# Bundler -- Developer Guide

Technical internals for the Common Voice Dataset Bundler.
For usage and CLI reference see [README.md](README.md).

---

## Pipeline overview

For each locale the processing pipeline runs these steps:

1. Checks the minority-language rule (< 5 unique speakers -> age/gender redacted)
2. Fetches MP3 clips -- streams previous-release and delta tarballs from GCS directly through `tar -xzf -` into the working directory (tarballs never land on disk), then prunes GDPR-deleted clips via a shell `sort`+`comm` pass against the DB query, with individual GCS download as a fallback for missing clips
3. Measures total audio duration via the `mp3-duration-reporter` binary
4. Filters problem clips -- clips exceeding 30 s are excluded; clips below 500 ms or between 17-30 s are flagged as warnings but kept
5. Runs CorporaCreator (Python) to split clips into `train / dev / test` sets
6. Writes reported and validated sentences TSVs
7. Generates a datasheet (`README.md`) for the locale
8. Compresses all locale files into a `.tar.gz` and streams it directly to GCS (no local tarball)
9. Streams a metadata-only `.tar.gz` archive directly to GCS
10. Calculates and uploads per-locale stats JSON
11. Cleans up temporary files
12. Flushes the process log and problem-clip report to Redis; GCS snapshots are uploaded every 10 completed locales and at the end of the run
13. On the final locale: cleans up all release-scoped Redis keys and drains the BullMQ queue

---

## Deduplication and skip logic

Before the pipeline runs, each locale job goes through a three-layer check in this order:

1. **Redis done SET** (fast path, ~1 ms) -- if the locale is already in the `scripted:done:<release>` SET, skip immediately without hitting GCS.
2. **GCS file-existence check** (authoritative) -- if the tarball already exists in the bucket, skip and backfill the done SET so future runs use the fast path.
3. **Processing guard HASH** (stall/crash recovery) -- `scripted:processing:<release>` is a HASH mapping locale identifiers to heartbeat timestamps. Before processing, the bundler atomically claims the locale via `HSETNX`. If the entry already exists, it checks the heartbeat age:
   - **Fresh (age < `PROCESSING_STALE_MS`, 20 min)** -- another pod is actively working on it. Skip.
   - **Stale (age >= `PROCESSING_STALE_MS`)** -- the original pod is assumed crashed. Overwrite and take over (logged as a warning).

   The heartbeat timestamp is refreshed every 5 minutes alongside the BullMQ lock extension, so long-running locales are never falsely reclaimed.

After the pipeline completes (success or failure), the locale is removed from the processing HASH via `try/finally`. On success it is added to the done SET.

### Crash recovery

When a pod crashes mid-processing:

1. BullMQ detects the stalled job after the lock expires (10 min) and re-dispatches it.
2. The new pod finds a stale entry in the processing HASH (>20 min old) and reclaims it.
3. **Total recovery time: ~20 min.** No manual intervention or `--force` needed.

When all pods are restarted (intentional kill), the same mechanism applies -- stale entries are reclaimed once new workers pick up the re-dispatched jobs. To start a completely fresh run instead, use `--force`.

### `--force` mode

There are two `--force` variants depending on whether `-l` is also passed:

#### Full force (`--force` without `-l`)

The init handler performs a complete reset:

1. **Force-flushes logs** -- any accumulated problem-clips and process-log rows from the previous (potentially bad) run are uploaded to GCS before being destroyed. Log filenames include a run timestamp (e.g. `process-log-20260322-143005.tsv`), so previous runs are preserved. Covers all release name variants (base, `-licensed`, `-variants`).
2. **Obliterates the BullMQ queue** -- removes ALL jobs (active, waiting, delayed, completed, failed) via `queue.obliterate({ force: true })`. The queue is resumed immediately after.
3. **Clears Redis state** -- deletes ALL entries in the done SET(s) and processing HASH(es) for the release.
4. **Queue pre-filter** is skipped entirely -- all locales are scheduled regardless of state.
5. **Processor (`processLocale`)** bypasses both the Redis done-SET fast path and the GCS existence check. The tarball is re-created from scratch and uploaded, overwriting any existing archive.
6. **Variant processor (`processVariants`)** bypasses per-variant done-SET and GCS existence checks. The full-release tarball must still exist (source of clips).
7. **Statistics (`generateStatistics`)** re-generates stats unconditionally.
8. The **processing HASH guard** still prevents two pods from processing the same locale simultaneously within the new run.

#### Selective force (`--force -l en tr`)

Only the targeted locales are reset. The rest of the release (including any in-progress jobs) is untouched:

1. **Done SET** -- scans members and removes only those whose locale prefix matches a target (handles both `locale` and `locale|license` members).
2. **Processing HASH** -- scans fields and removes only matching entries.
3. **BullMQ jobs** -- scans completed, failed, waiting, and delayed jobs. Removes only those whose deterministic job ID contains a targeted locale. Active jobs for targeted locales cannot be forcefully removed (BullMQ returns 0 if locked), but their Redis state was cleared, so when the new jobs run they will supersede the old results.
4. **No queue obliteration** -- other locales' jobs continue processing normally.
5. **No log flush** -- only targeted locales are being re-done, not the whole run.

### End-of-run cleanup

When a release name group finishes (count === total for that group), it decrements a `pendingGroups` counter. In `--license-mode both` there are two groups (base + licensed) with independent counters; only the last group to finish triggers cleanup:

1. **Deletes all release-scoped Redis keys** -- logs, counters, timestamps, done SET, processing HASH, for all release name variants (base, `-licensed`, `-variants`).
2. **Drains the BullMQ queue** -- removes any remaining completed/failed/delayed/waiting jobs.

All logs and stats are already persisted in GCS at this point. Redis keys have a 24-hour TTL (`RELEASE_LOG_KEY_TTL_SEC`) as a safety net in case cleanup fails.

---

## Variant releases

Variant releases produce one tarball per (locale, variant) combination. Requires a completed `full` release -- the bundler downloads the full tarball (derived from `-r`), filters clips by the `variant` column, runs CorporaCreator on each subset, and uploads to a `-variants` GCS directory. Dispatches one BullMQ job per locale (not per variant) -- each job loops over the locale's variants internally.

---

## Directory structure

```text
bundler/
├── src/
│   ├── cli/                  # CLI tools (start-dataset-release, calculateDurations)
│   ├── config/               # Runtime configuration (env vars, constants, Redis keys)
│   │   ├── index.ts          # Barrel re-export
│   │   ├── config.ts         # Env-var parsing, IO getters, Config/DbConfig types
│   │   ├── constants.ts      # Time enums, lock/redlock, audio thresholds, release log settings
│   │   ├── datasheets.ts     # DATASHEETS_BASE_URL, Modality, modality-key mapping
│   │   └── redisKeys.ts      # Redis key builders (scripted: namespace)
│   ├── core/                 # Domain logic
│   │   ├── clips.ts          # Clip fetch (stream-extract + GDPR prune), TSV streaming, minority-language filter
│   │   ├── compress.ts       # tar.gz streaming to GCS and filename helpers
│   │   ├── datasheets.ts     # Datasheet generation from cv-datasheets templates
│   │   ├── metadata.ts       # Metadata-only archive
│   │   ├── problemClips.ts   # Problem-clip duration filter + Redis push
│   │   ├── releaseLogger.ts  # Per-locale process log, GCS flush via Redis
│   │   ├── reportedSentences.ts
│   │   ├── ruleOfFive.ts     # Minority-language check (< 5 speakers)
│   │   ├── sentences.ts      # Validated / unvalidated sentence TSVs
│   │   ├── localeData.ts     # Shared locale data extraction (clips, sentences, buckets, durations)
│   │   ├── stats.ts          # Per-locale statistics JSON (reads from localeData)
│   │   ├── upload.ts         # GCS archive upload (used by generateStatistics only)
│   │   ├── utils.ts          # Shared utilities (line counting, unit conversion, duration formatting)
│   │   └── locales.ts        # Locale + variant queries, accent/variant metadata
│   ├── infrastructure/
│   │   ├── corporaCreator.ts       # Python CorporaCreator subprocess
│   │   ├── database.ts             # MySQL connection
│   │   ├── datasheetsFetcher.ts    # Fetch pre-compiled datasheets JSON
│   │   ├── filesystem.ts           # Filesystem helpers (checksum, line count, tar extract)
│   │   ├── lineStream.ts            # Partial-line buffering helper for subprocess data events
│   │   ├── logger.ts               # Structured logger (levels + verbosity: quiet/normal/verbose/debug)
│   │   ├── mp3DurationReporter.ts  # Rust binary wrapper for MP3 duration
│   │   ├── queue.ts                # BullMQ queue setup
│   │   ├── redis.ts                # Shared ioredis client
│   │   ├── storage.ts              # Google Cloud Storage adapter (256 MB upload chunks)
│   │   └── tar.ts                  # tar extraction (file-based and stream-based)
│   ├── test-helpers/
│   │   └── tsv.ts              # Shared TSV serialisation helpers for tests
│   ├── worker/
│   │   ├── generateStatistics.ts  # Statistics-only release pipeline (re-run stats without clips)
│   │   ├── processor.ts           # Per-locale processing pipeline
│   │   ├── processVariants.ts     # Variant release processing (per-locale, loops variants)
│   │   └── worker.ts              # BullMQ worker entry point
│   ├── main.ts               # Service entry point
│   └── types.ts              # Shared TypeScript types
├── queries/                  # SQL query files
├── Dockerfile
├── jest.config.js
├── package.json
└── tsconfig.json
```

---

## Output layout

For a release named `cv-corpus-25.0-2026-03-06`:

```text
cv-corpus-25.0-2026-03-06/
├── cv-corpus-25.0-2026-03-06-en.tar.gz      # locale archive (includes README.md)
├── cv-corpus-25.0-2026-03-06-tr.tar.gz
├── ...
├── stats/
│   ├── stats_en.json
│   ├── stats_tr.json
│   └── ...
├── metadata/
│   ├── cv-metadata-25.0-2026-03-06-en.tar.gz
│   └── ...
├── datasheets/
│   ├── cv-datasheet-25.0-2026-03-06-en.md
│   ├── cv-datasheet-25.0-2026-03-06-tr.md
│   └── ...
└── logs/
    ├── problem-clips-20260322-143005.tsv   # clips excluded or flagged during processing
    └── process-log-20260322-143005.tsv     # one row per locale: duration, clip count, speed, status
```

Each locale `.tar.gz` contains a `README.md` (the datasheet) alongside the clip and sentence files.

For variant releases, output goes to a separate `-variants` directory:

```text
cv-corpus-25.0-2026-03-06-variants/
├── cv-corpus-25.0-2026-03-06-cy-southwes.tar.gz
├── cv-corpus-25.0-2026-03-06-cy-northwes.tar.gz
├── cv-corpus-25.0-2026-03-06-ug-cyrl.tar.gz
├── ...
├── stats/
│   ├── stats_cy-southwes.json
│   └── ...
├── metadata/
│   ├── cv-metadata-25.0-2026-03-06-cy-southwes.tar.gz
│   └── ...
└── logs/
    ├── problem-clips-20260322-143005.tsv
    └── process-log-20260322-143005.tsv
```

---

## Progress output

On each locale job completion, a two-line progress summary is emitted:

```text
[q2tjm|2026-03-06T16:42:13.07] INFO   51% ..................................................
[q2tjm|2026-03-06T16:42:13.07] INFO  [en:ok] 15/120 jobs | 1.3M/2.5M clips | 234c/s | elapsed 1h32m | ETA 1h28m
```

Line 1: space-padded percentage + 100-char bar.
Line 2: locale tag, metrics.
Progress is clip-based so the bar advances proportionally to actual audio processed.
Status tags: `ok`/`er`/`sk` for success, error, or skip.

---

## Verbosity

The `--verbosity` CLI flag controls both the logger output level and how subprocess output (CorporaCreator, mp3-duration-reporter, tar, wc/tail, prune script) is handled. It travels through BullMQ job data and is applied at job start via `applyVerbosity()`.

| Level     | Log level   | CC stdout | CC stderr       | Other subprocesses            |
| --------- | ----------- | --------- | --------------- | ----------------------------- |
| `quiet`   | `warn`      | drained   | suppressed      | stderr demoted to debug       |
| `normal`  | env default | drained   | on failure only | stderr as warn (default)      |
| `verbose` | `debug`     | drained   | streamed live   | stderr streamed as debug      |
| `debug`   | `debug`     | streamed  | streamed live   | stderr streamed, tqdm enabled |

When `--verbosity` is not `normal`, it overrides the `LOG_LEVEL` environment variable. The verbosity state is stored in `logger.ts` alongside `currentLevel` and is read by subprocess handlers via `getVerbosity()`.

In `debug` mode, `TQDM_DISABLE` is not set, so swifter/tqdm progress bars and CorporaCreator's own `print()` output are all visible. This reveals memory warnings, pandas diagnostics, and progress information that are normally suppressed.

---

## Testing

Tests use **Jest** with **ts-jest** (runs TypeScript directly, no pre-compile step).

```bash
npm test                                        # all tests
npm test -- --coverage                          # with coverage
npx jest src/core/datasheets.test.ts            # specific file
npx jest src/core/datasheets.e2e.test.ts        # e2e (skipped in CI; requires network)
```

| File                                           | Covers                                                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/core/compress.test.ts`                    | Tar filename generation, path filtering, license sanitization                                   |
| `src/core/datasheets.test.ts`                  | Template filling, replacement map, table builders, dangling header cleanup                      |
| `src/core/datasheets.e2e.test.ts`              | Full pipeline with live GitHub data (skipped in CI)                                             |
| `src/core/localeData.test.ts`                  | Clips.tsv scanning, sentence file scanning, locale data orchestration, source filtering         |
| `src/core/metadata.test.ts`                    | Metadata archive helpers                                                                        |
| `src/core/problemClips.test.ts`                | Duration filter classification, clips.tsv rewrite, Redis push, TTL                              |
| `src/core/releaseLogger.test.ts`               | Process-log row format, GCS flush triggers, Redis key routing, progress throttle, error swallow |
| `src/core/stats.test.ts`                       | `unitToHours` conversion, `buildLocale` mapping from `LocaleReleaseData`                        |
| `src/core/utils.test.ts`                       | `countLinesInFile`, `unitToHours`, `formatDuration`, `renderBar`, `formatCompact`, `formatEta`  |
| `src/infrastructure/datasheetsFetcher.test.ts` | Local file loading, modality mapping, error recovery                                            |
| `src/infrastructure/lineStream.test.ts`        | Partial-line buffering, multi-chunk assembly, flush, empty-line skipping                        |
| `src/infrastructure/logger.test.ts`            | `applyVerbosity` log-level mapping, `getVerbosity` state, output suppression/promotion          |
| `src/worker/processor.test.ts`                 | Job environment derivation, `uploadPath` precomputation, `--force`/`--verbosity` passthrough    |
| `src/worker/processVariants.test.ts`           | Variant clip/duration filtering, env derivation, locale column rewriting                        |

---

## Datasheets

Datasheets are Markdown README files generated from templates stored in the
[cv-datasheets](https://github.com/common-voice/cv-datasheets) repository.

The bundler fetches a pre-compiled `datasheets-<release>.json` file that
contains templates (per language) and locale metadata. The `-d` CLI flag
accepts a filename (resolved against `DATASHEETS_BASE_URL`) or a full URL.

Filenames are resolved against `DATASHEETS_BASE_URL` (defaults to the `main`
branch of cv-datasheets). Override this env var to fetch from an unmerged
branch or a specific commit.

Datasheets are only generated for `full` releases. Delta and statistics
releases are silently skipped.

### Sources table truncation

The sources table in datasheets is truncated to keep it readable:

- Maximum **9 named sources** are shown (`SOURCES_MAX_ROWS`).
- Sources representing less than **1% of total sentences** (`SOURCES_MIN_PCT`) are excluded.
- Everything below the cutoff (plus any pre-existing "Other" from upstream data) is merged into a single "Other" row.
- If all sources qualify and fit within the limit, no "Other" row is shown.

---

## Stats JSON

Per-locale stats JSON files use machine-readable codes for accent and variant splits (e.g. `shapsug`, `ady-Cyrl`) rather than display names. The `backmap()` function in `stats.ts` translates names to codes using `accentCodeMap` / `variantCodeMap` loaded from the database. Names without a code mapping (including `""` for unspecified) pass through as-is.

The `variant` field was added to the `splits` object alongside `accent`, `age`, `gender`, and `sentence_domain`. For locales with no defined variants or accents, these fields are empty objects (`{}`).

---

## Redis keys

All keys use the `scripted:` prefix (see `config/redisKeys.ts`). `{rel}` is the effective release name (e.g. `cv-corpus-25.0-2026-03-09`, `...-licensed`, `...-variants`).

| Key                                | Type | Purpose                                                    |
| ---------------------------------- | ---- | ---------------------------------------------------------- |
| `scripted:done:{rel}`              | SET  | Locales successfully processed (fast-path skip check)      |
| `scripted:processing:{rel}`        | HASH | Locales in progress (field = locale, value = heartbeat ms) |
| `scripted:log:process:{rel}`       | LIST | TSV rows for the process-log report                        |
| `scripted:log:problem-clips:{rel}` | LIST | TSV rows for the problem-clips report                      |
| `scripted:jobs:count:{rel}`        | STR  | Completed locale job counter (atomic INCR)                 |
| `scripted:jobs:total:{rel}`        | STR  | Total locale jobs scheduled                                |
| `scripted:clips:count:{rel}`       | STR  | Cumulative clips processed                                 |
| `scripted:clips:total:{rel}`       | STR  | Total expected clips                                       |
| `scripted:time:start:{rel}`        | STR  | ISO 8601 timestamp of the first init job                   |
| `scripted:log:last-flush:{rel}`    | STR  | ISO 8601 timestamp of the last GCS log flush               |
| `scripted:pending-groups:{base}`   | STR  | Groups still running (e.g. 2 for `--license-mode both`)    |

All keys have a 24-hour TTL (`RELEASE_LOG_KEY_TTL_SEC`) as a safety net. They are explicitly deleted after a successful run completes.
