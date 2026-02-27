# Common Voice Dataset Bundler

Standalone service that packages per-locale Common Voice datasets into distributable `.tar.gz` archives, collects statistics, and generates datasheets (README files).

---

## Overview

The bundler is a **BullMQ worker** service. An external orchestrator enqueues one job per locale, and the worker processes them sequentially. For each locale the pipeline:

1. Checks the minority-language rule (< 5 unique speakers → age/gender redacted)
2. Downloads MP3 clips (from a previous full release, a delta tarball, or GCS fallback)
3. Measures total audio duration via the `mp3-duration-reporter` binary
4. Filters **problem clips** — clips exceeding 30 s are excluded and their duration subtracted; clips below 500 ms or between 17–30 s are flagged as warnings but kept
5. Runs **CorporaCreator** (Python) to split clips into `train / dev / test` sets
6. Writes reported and validated sentences TSVs
7. Generates a **datasheet** (`README.md`) for the locale and uploads it to GCS
8. Compresses all locale files into a `.tar.gz` archive
9. Uploads the archive to GCS
10. Compresses and uploads a separate metadata-only archive
11. Calculates and uploads per-locale stats JSON
12. Cleans up temporary files
13. Flushes the **process log** and **problem-clip report** to Redis; GCS snapshots are uploaded every 10 completed locales and at the end of the run

---

## Release types

| Type         | Description                                                              |
| ------------ | ------------------------------------------------------------------------ |
| `full`       | Complete re-bundle of all clips for the release window                   |
| `delta`      | Only new clips since the last full release (no datasheets, no CC splits) |
| `statistics` | Re-runs stats and metadata only, no clip processing                      |
| `variants`   | Extracts dialect/script variant subsets from a completed full release    |

### Variant releases

Variant releases produce one tarball per (locale, variant) combination. Requires a completed `full` release — the bundler downloads the full tarball (derived from `-r`), filters clips by the `variant` column, runs CorporaCreator on each subset, and uploads to a `-variants` GCS directory. Dispatches one BullMQ job per locale (not per variant) — each job loops over the locale's variants internally. The `-p` flag is not needed — the source full release is the same as `-r`.

### CLI usage

The CLI lives in `server/src/api/cli/start-dataset-release.ts`. In pods, run the compiled JS from the server build output directory.

The command format is:

```bash
node start-dataset-release.js \
  -t <release type> \
  -u <release timestamp> \
  -r <release name> \
  [ -f <from timestamp> ] \
  [ -p <previous release name> ] \
  [ -l <locale1 locale2 ...> ] \
  [ --license-mode <licensed|unlicensed|both> ] \
  [ -d <datasheets filename or URL> ]
```

- `-t` is the release type (`full`, `delta`, `statistics`, or `variants`). Required.
- `-u` is the release timestamp (defines the end of the clip time window). Required.
- `-r` is the release name (used for output naming and GCS paths). Required.
- `-f` is optional (defaults to epoch `1970-01-01`) but **required for delta releases** (defines the start of the clip time window).
- `-p` is required for full releases (previous release to bootstrap clips from) and ignored for delta, statistics, and variants.
- `-d` is optional and specifies the datasheets JSON filename or full URL (useful when datasheets live on an unmerged branch or a specific commit).

```bash
# Change to the server build output directory
cd server/js/api/cli

# Full release (all locales, unlicensed) — -p required, -f optional (defaults to epoch)
node start-dataset-release.js \
  -t full -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06 -p cv-corpus-24.0-2025-12-01

# Full release with datasheets from a specific commit (e.g. for test purposes while the new datasheets file is on a branch and not yet merged to main)
node start-dataset-release.js \
  -t full -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06 -p cv-corpus-24.0-2025-12-01 \
  -d 'https://raw.githubusercontent.com/common-voice/cv-datasheets/<commit>/releases/datasheets-25.0-2026-03-06.json'

# Full release (specific locales only)
node start-dataset-release.js \
  -t full -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06 -p cv-corpus-24.0-2025-12-01 -l en tr de

# Delta release — -f required (defines start of clip time window), -p not needed
node start-dataset-release.js \
  -t delta -f '2025-09-05 00:00:00' -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-delta-2026-03-06

# Variant release — sources clips from the full release identified by -r
node start-dataset-release.js \
  -t variants -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06

# Statistics only (re-run stats, no clip processing)
node start-dataset-release.js \
  -t statistics -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06

# Licensed locales only
node start-dataset-release.js \
  -t full -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06 -p cv-corpus-24.0-2025-12-01 --license-mode licensed

# Both licensed and unlicensed (separate tarballs)
node start-dataset-release.js \
  -t full -u '2026-03-06 23:59:59' \
  -r cv-corpus-25.0-2026-03-06 -p cv-corpus-24.0-2025-12-01 --license-mode both
```

---

## Directory structure

```text
bundler/
├── src/
│   ├── cli/                  # One-off CLI tools (e.g. calculateDurations)
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
│   │   └── locales.ts        # Locale + variant queries (fetchLocalesWithVariantClips)
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
[q2tjm|2026-03-06T16:42:13.07] INFO   51% ██████████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
[q2tjm|2026-03-06T16:42:13.07] INFO  [en:ok] 15/120 jobs | 1.3M/2.5M clips | 234c/s | elapsed 1h32m | ETA 1h28m
```

Line 1: space-padded percentage + 100-char bar.
Line 2: locale tag, metrics.
Progress is clip-based so the bar advances proportionally to actual audio processed.
Status tags: `ok`/`er`/`sk` for success, error, or skip (already-processed locale detected via GCS/Redis deduplication).
Throttled for small locales.

---

## Configuration

All configuration is via environment variables:

| Variable                             | Default                | Description                                                                    |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------------------ |
| `ENVIRONMENT`                        | `local`                | Runtime environment (`local`, `sandbox`, `staging`, `production`)              |
| `LOG_LEVEL`                          | derived                | `debug` / `info` / `warn` / `error` / `silent` (overrides environment default) |
| `REDIS_URL`                          | `redis`                | BullMQ broker                                                                  |
| `DB_HOST`                            | `db`                   | MySQL host                                                                     |
| `DB_PORT`                            | `3306`                 | MySQL port                                                                     |
| `DB_DATABASE`                        | `voiceweb`             | MySQL database name                                                            |
| `DB_USER`                            | `voicecommons`         | MySQL user                                                                     |
| `DB_PASSWORD`                        | `voicecommons`         | MySQL password                                                                 |
| `CLIPS_BUCKET_NAME`                  | `common-voice-clips`   | GCS bucket for raw audio                                                       |
| `DATASETS_BUNDLER_BUCKET_NAME`       | `common-voice-bundler` | GCS bucket for release output                                                  |
| `STORAGE_LOCAL_DEVELOPMENT_ENDPOINT` | `http://storage:8080`  | Local GCS emulator endpoint                                                    |
| `DATASHEETS_BASE_URL`                | GitHub `main` branch   | Base URL for pre-compiled datasheets JSON; override to test from a branch      |

---

## Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run a specific test file
npx jest src/core/datasheets.test.ts

# Run e2e tests (skipped in CI; requires network)
npx jest src/core/datasheets.e2e.test.ts

# Start the worker service (requires built JS)
npm start
```

---

## Testing

Tests use **Jest** with **ts-jest** (runs TypeScript directly, no pre-compile step).

| File                                           | Covers                                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/core/compress.test.ts`                    | Tar filename generation, path filtering, license sanitization                                  |
| `src/core/datasheets.test.ts`                  | Template filling, replacement map, table builders, dangling header cleanup                     |
| `src/core/datasheets.e2e.test.ts`              | Full pipeline with live GitHub data (skipped in CI)                                            |
| `src/core/localeData.test.ts`                  | Clips.tsv scanning, sentence file scanning, locale data orchestration, source filtering        |
| `src/core/metadata.test.ts`                    | Metadata archive helpers                                                                       |
| `src/core/problemClips.test.ts`                | Duration filter classification, clips.tsv rewrite, Redis push, TTL                             |
| `src/core/releaseLogger.test.ts`               | Process-log row format, GCS flush triggers, Redis key routing, progress throttle, error swallow|
| `src/core/stats.test.ts`                       | `unitToHours` conversion, `buildLocale` mapping from `LocaleReleaseData`                       |
| `src/core/utils.test.ts`                       | `countLinesInFile`, `unitToHours`, `formatDuration`, `renderBar`, `formatCompact`, `formatEta` |
| `src/infrastructure/datasheetsFetcher.test.ts` | Local file loading, modality mapping, error recovery                                           |
| `src/worker/processor.test.ts`                 | Job environment derivation, `uploadPath` precomputation                                        |
| `src/worker/processVariants.test.ts`           | Variant clip/duration filtering, env derivation, locale column rewriting                       |

---

## Datasheets

Datasheets are Markdown README files generated from templates stored in the
[cv-datasheets](https://github.com/common-voice/cv-datasheets) repository.

The bundler fetches a pre-compiled `datasheets-<release>.json` file that
contains templates (per language) and locale metadata. To enable datasheet
generation, pass the filename or full URL when enqueuing jobs:

```json
{
  "datasheetsFile": "datasheets-25.0-2026-03-06.json"
}
```

A full URL is also accepted (useful while a new file is on a feature branch):

```json
{
  "datasheetsFile": "https://raw.githubusercontent.com/common-voice/cv-datasheets/main/releases/datasheets-25.0-2026-03-06.json"
}
```

Filenames are resolved against `DATASHEETS_BASE_URL` (defaults to the `main`
branch of cv-datasheets). Override this env var to fetch from an unmerged
branch or a specific commit — see `.env.dist` for an example.

Datasheets are only generated for `full` releases. Delta and statistics
releases are silently skipped.
