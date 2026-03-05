# Common Voice Dataset Bundler

Standalone service that packages per-locale Common Voice datasets into distributable `.tar.gz` archives, collects statistics, and generates datasheets.

For architecture, internals, and testing details see [DEVELOPER.md](DEVELOPER.md).

---

## Release types

| Type         | Description                                                              |
| ------------ | ------------------------------------------------------------------------ |
| `full`       | Complete re-bundle of all clips for the release window                   |
| `delta`      | Only new clips since the last full release (no datasheets, no CC splits) |
| `statistics` | Re-runs stats and metadata only, no clip processing                      |
| `variants`   | Extracts variant subsets from a completed full release                   |

---

## CLI usage

Run from the bundler build output directory or from inside the bundler container:

```bash
cd bundler/js/cli    # local
# cd js/cli          # inside container
```

### Flags

| Flag               | Required                         | Description                                             |
| ------------------ | -------------------------------- | ------------------------------------------------------- |
| `-t <type>`        | always                           | Release type: `full`, `delta`, `statistics`, `variants` |
| `-u <datetime>`    | always                           | End of clip time window                                 |
| `-r <name>`        | always                           | Release name (e.g. `cv-corpus-25.0-2026-03-09`)         |
| `-p <name>`        | `full` only                      | Previous release to bootstrap clips from                |
| `-d <file or URL>` | `full` only                      | Datasheets JSON filename or URL (see below)             |
| `-f <datetime>`    | `delta` only                     | Start of clip time window (defaults to epoch)           |
| `-l <locales...>`  | optional                         | Restrict to specific locales                            |
| `--license-mode`   | optional (default: `unlicensed`) | `unlicensed`, `licensed`, or `both`                     |

### Datasheets (`-d`)

The `-d` flag accepts a filename or a full URL. A plain filename is resolved against `DATASHEETS_BASE_URL` (defaults to the cv-datasheets `main` branch on GitHub).

```bash
# Filename -- resolved to https://raw.githubusercontent.com/.../releases/datasheets-2026-03-09.json
-d 'datasheets-2026-03-09.json'

# Full URL -- used as-is (useful for unmerged branches or specific commits)
-d 'https://raw.githubusercontent.com/common-voice/cv-datasheets/<commit>/releases/datasheets-2026-03-09.json'
```

### Examples

TL;DR: Example for v25.0 with cut-off at 2026-03-09 midnight

```bash
# We already have v24.0 full release until midnight of 2025-12-05
# First generate delta release for v25.0
node start-dataset-release.js \
  -t delta \
  -f "2025-12-06 00:00:00" \
  -u "2026-03-09 23:59:59" \
  -r "cv-corpus-25.0-delta-2026-03-09"

# Then generate full release for v25.0, bootstrapping from v24.0 and using the generated delta
node start-dataset-release.js \
  -t full \
  -u "2026-03-09 23:59:59" \
  -r "cv-corpus-25.0-2026-03-09" \
  -p "cv-corpus-24.0-2025-12-05" \
  -d "datasheets-2026-03-09.json"
```

More examples:

```bash
# Full release
node start-dataset-release.js \
  -t full -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-2026-03-09 -p cv-corpus-24.0-2025-12-05 \
  -d 'datasheets-2026-03-09.json'

# Full release -- specific locales only
node start-dataset-release.js \
  -t full -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-2026-03-09 -p cv-corpus-24.0-2025-12-05 \
  -d 'datasheets-2026-03-09.json' -l en tr de

# Full release -- licensed locales only
node start-dataset-release.js \
  -t full -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-2026-03-09 -p cv-corpus-24.0-2025-12-05 \
  -d 'datasheets-2026-03-09.json' --license-mode licensed

# Full release -- both licensed and unlicensed (separate tarballs)
node start-dataset-release.js \
  -t full -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-2026-03-09 -p cv-corpus-24.0-2025-12-05 \
  -d 'datasheets-2026-03-09.json' --license-mode both

# Delta release
node start-dataset-release.js \
  -t delta -f '2025-12-05 00:00:00' -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-delta-2026-03-09

# Variant release
node start-dataset-release.js \
  -t variants -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-2026-03-09

# Statistics only
node start-dataset-release.js \
  -t statistics -u '2026-03-09 23:59:59' \
  -r cv-corpus-25.0-2026-03-09
```

---

## Configuration

All configuration is via environment variables:

| Variable                             | Default                | Description                                                  |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------ |
| `ENVIRONMENT`                        | `local`                | `local`, `sandbox`, `staging`, `production`                  |
| `LOG_LEVEL`                          | derived                | `debug` / `info` / `warn` / `error` / `silent`               |
| `REDIS_URL`                          | `redis`                | BullMQ broker                                                |
| `DB_HOST`                            | `db`                   | MySQL host                                                   |
| `DB_PORT`                            | `3306`                 | MySQL port                                                   |
| `DB_DATABASE`                        | `voiceweb`             | MySQL database name                                          |
| `DB_USER`                            | `voicecommons`         | MySQL user                                                   |
| `DB_PASSWORD`                        | `voicecommons`         | MySQL password                                               |
| `CLIPS_BUCKET_NAME`                  | `common-voice-clips`   | GCS bucket for raw audio                                     |
| `DATASETS_BUNDLER_BUCKET_NAME`       | `common-voice-bundler` | GCS bucket for release output                                |
| `STORAGE_LOCAL_DEVELOPMENT_ENDPOINT` | `http://storage:8080`  | Local GCS emulator endpoint                                  |
| `DATASHEETS_BASE_URL`                | GitHub `main` branch   | Base URL for datasheets JSON; override to test from a branch |

---

## Commands

```bash
npm install          # Install dependencies
npm run build        # Build TypeScript
npm test             # Run tests
npm start            # Start the worker service (requires built JS)
```

> **Note:** A legacy CLI exists at `server/src/api/cli/start-dataset-release.ts` but uses the old `bull` library. It prints a deprecation warning if invoked.
