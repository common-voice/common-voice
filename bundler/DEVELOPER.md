# Bundler -- Developer Guide

Technical internals for the Common Voice Dataset Bundler.
For usage and CLI reference see [README.md](README.md).

---

## Pipeline overview

For each locale the processing pipeline runs these steps:

1. Checks the minority-language rule (< 5 unique speakers -> age/gender redacted)
2. Downloads MP3 clips (from a previous full release, a delta tarball, or GCS fallback)
3. Measures total audio duration via the `mp3-duration-reporter` binary
4. Filters problem clips -- clips exceeding 30 s are excluded; clips below 500 ms or between 17-30 s are flagged as warnings but kept
5. Runs CorporaCreator (Python) to split clips into `train / dev / test` sets
6. Writes reported and validated sentences TSVs
7. Generates a datasheet (`README.md`) for the locale
8. Compresses all locale files into a `.tar.gz` archive
9. Uploads the archive to GCS
10. Compresses and uploads a separate metadata-only archive
11. Calculates and uploads per-locale stats JSON
12. Cleans up temporary files
13. Flushes the process log and problem-clip report to Redis; GCS snapshots are uploaded every 10 completed locales and at the end of the run

---

## Deduplication and skip logic

Before the pipeline runs, each locale job goes through a three-layer check in this order:

1. **Redis done SET** (fast path, ~1 ms) -- if the locale is already in the `scripted:done:<release>` SET, skip immediately without hitting GCS.
2. **GCS file-existence check** (authoritative) -- if the tarball already exists in the bucket, skip and backfill the done SET so future runs use the fast path.
3. **Redis processing SET** (stall guard) -- an atomic `SADD` to `scripted:processing:<release>` returns 0 if another pod already claimed the locale, preventing duplicate processing from BullMQ stall re-dispatches. The processing SET is cleared by the init handler on each new run so that re-runs can reprocess failed locales.

After the pipeline completes (success or failure), the locale is removed from the processing SET via `try/finally`. On success it is added to the done SET.

---

## Variant releases

Variant releases produce one tarball per (locale, variant) combination. Requires a completed `full` release -- the bundler downloads the full tarball (derived from `-r`), filters clips by the `variant` column, runs CorporaCreator on each subset, and uploads to a `-variants` GCS directory. Dispatches one BullMQ job per locale (not per variant) -- each job loops over the locale's variants internally.

---

## Directory structure

```text
bundler/
├── src/
│   ├── cli/                  # CLI tools (start-dataset-release, calculateDurations)
│   ├── config/               # Runtime configuration (env vars, constants)
│   ├── core/                 # Domain logic
│   │   ├── clips.ts          # Clip download, TSV streaming, minority-language filter
│   │   ├── compress.ts       # tar.gz creation and filename helpers
│   │   ├── datasheets.ts     # Datasheet generation from cv-datasheets templates
│   │   ├── metadata.ts       # Metadata-only archive
│   │   ├── problemClips.ts   # Problem-clip duration filter + Redis push
│   │   ├── releaseLogger.ts  # Per-locale process log, GCS flush via Redis
│   │   ├── reportedSentences.ts
│   │   ├── ruleOfFive.ts     # Minority-language check (< 5 speakers)
│   │   ├── sentences.ts      # Validated / unvalidated sentence TSVs
│   │   ├── localeData.ts     # Shared locale data extraction (clips, sentences, buckets, durations)
│   │   ├── stats.ts          # Per-locale statistics JSON (reads from localeData)
│   │   ├── upload.ts         # GCS archive upload
│   │   ├── utils.ts          # Shared utilities (line counting, unit conversion, duration formatting)
│   │   └── locales.ts        # Locale + variant queries, accent/variant metadata
│   ├── infrastructure/
│   │   ├── corporaCreator.ts       # Python CorporaCreator subprocess
│   │   ├── database.ts             # MySQL connection
│   │   ├── datasheetsFetcher.ts    # Fetch pre-compiled datasheets JSON
│   │   ├── filesystem.ts           # Filesystem helpers (checksum, line count, tar extract)
│   │   ├── logger.ts               # Structured logger (levels: debug/info/warn/error/silent)
│   │   ├── mp3DurationReporter.ts  # Rust binary wrapper for MP3 duration
│   │   ├── queue.ts                # BullMQ queue setup
│   │   ├── redis.ts                # Shared ioredis client
│   │   ├── storage.ts              # Google Cloud Storage adapter
│   │   └── tar.ts                  # tar extraction
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
    ├── problem-clips.tsv    # clips excluded or flagged during processing
    └── process-log.tsv      # one row per locale: duration, clip count, speed, status
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
    ├── problem-clips.tsv
    └── process-log.tsv
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
| `src/worker/processor.test.ts`                 | Job environment derivation, `uploadPath` precomputation                                         |
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
