# MDC Uploader -- Developer Guide

Technical internals for the MDC Uploader.
For usage and CLI reference see [README.md](README.md).

---

## Architecture

```txt
mdc-upload CLI
    |
    v
cli.py -----------> config.py (resolve env vars + CLI args)
    |
    v
pipeline.py ------> naming.py (release parsing, path construction)
    |               language.py (locale name resolution via LanguageRegistry)
    |               state.py (batch state persistence)
    |               progress.py (tqdm batch progress)
    |
    v
mdc.py ------------> datacollective SDK
    |                 (create_submission_with_upload,
    |                  upload_dataset_file)
    |
    v
gcs.py ------------> google-cloud-storage (optional, for gs:// URIs only)
```

Supporting modules:

- `typedef.py` -- shared type definitions (`UploadStatus`, `MDCTarget`, `LanguageNames`, TypedDicts)
- `models.py` -- data models (`Modality`, `ReleaseType`, `ReleaseSpec`, `LocaleUploadJob`, `UploadResult`)
- `log.py` -- structured logging matching the bundler's `[TIMESTAMP] [LEVEL] [COMPONENT]` format

## Environment Variables

| Variable           | Required       | Default    | Description                                  |
| ------------------ | -------------- | ---------- | -------------------------------------------- |
| `MDC_API_KEY_DEV`  | For `-ut dev`  | --         | MDC API key for the dev environment          |
| `MDC_API_KEY_PROD` | For `-ut prod` | --         | MDC API key for the prod environment         |
| `MDC_API_URL`      | No             | from `-ut` | Override MDC API base URL                    |
| `UPLOAD_BASE_DIR`  | No             | `/gcs`     | Default base directory for uploads           |
| `UPLOAD_STATE_DIR` | No             | `./.state` | Directory for batch state JSON files         |

Dev and prod use separate MDC accounts. Set the key matching your `-ut` target.

`UPLOAD_BASE_DIR` and `UPLOAD_STATE_DIR` are defined by this tool only (not in the SCS bundler code). They provide env-var alternatives to CLI options so values can be set once in the pod spec.

## Module Responsibilities

| Module         | Purpose                                                                            |
| -------------- | ---------------------------------------------------------------------------------- |
| `cli.py`       | Click CLI entry point, option parsing, `--retry-failed` handling, error formatting |
| `config.py`    | `UploaderConfig` dataclass, env var + CLI arg resolution                           |
| `constants.py` | MDC API URLs, metadata templates, contact info                                     |
| `typedef.py`   | Shared type aliases, Literal types, TypedDicts                                     |
| `models.py`    | `Modality`, `ReleaseType`, `ReleaseSpec`, `LocaleUploadJob`, `UploadResult`        |
| `naming.py`    | Release name parsing, tarball/datasheet path construction                          |
| `language.py`  | `LanguageRegistry` class -- fetches locale names from CV API + hardcoded extras    |
| `mdc.py`       | `MDCClient` wrapping the datacollective SDK with retry + 429 handling              |
| `pipeline.py`  | Per-locale upload orchestration, batch runner, summary reporting                   |
| `state.py`     | `BatchState` JSON persistence for `--retry-failed` support                         |
| `progress.py`  | tqdm batch progress bar, human-readable size formatting                            |
| `log.py`       | Structured logging matching the bundler's `[TIMESTAMP] [LEVEL] [COMPONENT]` format |
| `gcs.py`       | GCS fallback for `gs://` URIs (uses `google-cloud-storage` runtime dependency)     |

---

## Data Flow

The uploader supports three ways to access release files via `--base-dir`:

### 1. GCSFuse mount (production)

```txt
GCS bucket --[GCSFuse CSI]--> /gcs (local mount) --> SDK reads file --> MDC API
```

In GKE, the GCS bucket is mounted as a local filesystem at `/gcs` via the GCSFuse CSI driver. The SDK reads tarballs directly from the mount point -- no downloads, no temp files, no extra libraries. This is the default (`--base-dir /gcs`).

### 2. gs:// URI (optional fallback)

```txt
GCS bucket --[google-cloud-storage]--> temp file --> SDK reads file --> MDC API --> cleanup
```

When `--base-dir` is a `gs://` URI, each tarball is downloaded to a temp file, uploaded to MDC, then cleaned up. The `google-cloud-storage` dependency is included at install time:

```bash
mdc-upload -r cv-corpus-25.0-2026-03-09 --base-dir gs://common-voice-bundler -ut dev
```

This mode is useful for environments without GCSFuse (e.g. local machines with GCP credentials, CI runners).

### 3. Local directory (testing)

```txt
Local directory --> SDK reads file --> MDC API
```

Point `--base-dir` to any local directory with the same structure as the GCS bucket:

```bash
mdc-upload -r sps-corpus-3.0-2026-03-09 --base-dir ./test-releases -ut dev --dry-run
```

---

## Upload Flow

### New Submission (per locale)

1. Resolve tarball path from `--base-dir` + release naming conventions
2. Fetch English/native names from `LanguageRegistry` (CV API + extras)
3. Read datasheet markdown from filesystem (optional)
4. `create_submission_with_upload()` -- single SDK call that creates draft, uploads tarball, sets metadata, and submits for review
5. Record result in batch state JSON

### Version Update

1. Resolve tarball path
2. `upload_dataset_file()` -- upload new file to existing submission ID
3. Record result in batch state JSON

---

## Language Name Resolution

`language.py` uses a `LanguageRegistry` class to resolve locale codes to English/native name pairs.

1. Fetches all locales from `commonvoice.mozilla.org/api/v1/languagedata`
2. Appends hardcoded extras for locales missing from the API (el-CY, ms-MY)
3. API entries take priority -- extras only fill gaps
4. All locales are kept regardless of `is_contributable` flag (SPS locales may have `is_contributable=0`)
5. API failure is fatal -- language names are required for correct MDC metadata

To add a new locale not in the API, add it to `LanguageRegistry.EXTRAS` in `language.py`.

---

## Path Conventions

All paths mirror the bundler's GCS output structure.
See `bundler/src/core/compress.ts` and `bundler/src/worker/processor.ts`.

### Tarballs (relative to base-dir)

| Type        | Path                                                              |
| ----------- | ----------------------------------------------------------------- |
| Full (CC0)  | `{release}/{release}-{locale}.tar.gz`                             |
| Delta (CC0) | `{release-delta}/{release-delta}-{locale}.tar.gz`                 |
| Licensed    | `{release}-licensed/{release}-{locale}-{sanitizedLicense}.tar.gz` |
| Variants    | `{release}-variants/{release}-{locale}-{variantToken}.tar.gz`     |

### Datasheets (relative to base-dir)

| Modality | Path                                                                       |
| -------- | -------------------------------------------------------------------------- |
| SCS      | `{release}/datasheets/cv-datasheet-{ver}-{locale}[-{sanitizedLicense}].md` |
| SPS      | `{release}/datasheets/{release}-datasheet-{locale}.md`                     |

### License sanitization

Matches `bundler/src/core/compress.ts:sanitizeLicenseName`:

```txt
re.sub(r'[\s/\\:*?"<>|]', '_', license)
```

Example: `CC-BY 4.0` becomes `CC-BY_4.0` (dot is preserved).

---

## Retry and State Management

Every batch run writes a state JSON file to `.state/` after each locale completes:

```txt
.state/upload-state-{release}-{timestamp}.json
```

The file contains all config needed to reproduce the run, plus per-locale results:

```json
{
  "release": "sps-corpus-3.0-2026-03-09",
  "upload_target": "dev",
  "type": "full",
  "base_dir": "/gcs",
  "started_at": "2026-03-13T14:30:00+00:00",
  "locales": {
    "ga-IE": { "status": "success", "submission_id": "abc-123" },
    "en": { "status": "failed", "error": "429 Too Many Requests" }
  }
}
```

Use `--retry-failed <path>` to re-run only failed locales. Config is restored from the state file.

---

## Error Handling

### 429 Rate Limiting

The `MDCClient` in `mdc.py` handles 429 responses:

1. Parses the `Retry-After` header from the error message
2. Waits the specified duration before retrying
3. If `Retry-After` exceeds 1 hour (3600s), marks the locale as failed
4. Maximum 3 attempts per API call
5. On final failure, continues to the next locale (batch never aborts)

### Transient Errors (5xx, timeouts)

Retried with exponential backoff: 10s, 30s, 90s. Maximum 3 attempts.

### Orphaned Drafts

If `create_submission_draft` succeeds but a later step fails, the state file records `"orphaned_draft": true` with the submission ID for manual cleanup.

### Silent Failure

Individual locale failures are logged but do not abort the batch. The batch continues to the next locale. A summary table is printed at the end with all results.

### CLI Error Output

By default, unhandled exceptions show a single-line error message. Use `-v` for full tracebacks. Click validation errors (missing `--release`, missing `MDC_API_KEY`) are formatted by Click.

---

## Sorting Strategy

**Single-pod mode** (current): locales sorted smallest-first by file size.
Rationale: completes more locales faster, gives early feedback, and if interrupted the remaining work is concentrated in fewer files.

**Multi-pod mode** (planned, iteration 2): largest-first via BullMQ queue so big files start processing immediately while smaller ones fill gaps.

---

## Type System

### Type stubs (`typings/`)

The `datacollective` SDK has no `py.typed` marker, so type stubs are provided in `typings/datacollective/`. These are picked up by:

- **mypy** via `mypy_path = "typings"` in `pyproject.toml`
- **Pylance** via `python.analysis.stubPath` in `.vscode/settings.json`

### Shared types (`typedef.py`)

All shared type aliases, Literal types, and TypedDicts live in `typedef.py`:

- `UploadStatus` -- `Literal["success", "failed", "skipped"]`
- `MDCTarget` -- `Literal["dev", "prod"]`
- `LanguageNames` -- `tuple[str, str]` (english, native)
- `LocaleStateEntry`, `RetryStateData`, `DescriptionTemplate` -- TypedDicts

---

## Development

### Setup

```bash
cd bundler/uploader
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### Run Tests

```bash
# All tests
python -m pytest tests/ -v

# Single file
python -m pytest tests/test_naming.py -v

# Single test
python -m pytest tests/test_mdc.py::TestWrapException::test_429_detected -v
```

### Linting and Formatting

```bash
# Format
ruff format src/ tests/

# Lint (auto-fix)
ruff check --fix src/ tests/

# Type check
mypy src/
```

Ruff is the primary linter and formatter (replaces black, isort, flake8). Pylint config is also included in `pyproject.toml` for IDE integration.

### Test Coverage

| Test file          | Tests | Covers                                               |
| ------------------ | ----- | ---------------------------------------------------- |
| `test_naming.py`   | 26    | Release parsing (incl. delta), paths, detect_locales |
| `test_mdc.py`      | 18    | Exception wrapping, retry logic                      |
| `test_gcs.py`      | 11    | URI detection, parsing, require guard                |
| `test_config.py`   | 7     | UploaderConfig.from_cli, locale parsing              |
| `test_language.py` | 7     | LanguageRegistry init/find/extras/API failure        |
| `test_state.py`    | 7     | BatchState record/summary, retry loading             |
| `test_models.py`   | 7     | StrEnum values, ReleaseSpec props, defaults          |
| `test_pipeline.py` | 6     | Job building, process_locale, batch dry run          |
| `test_progress.py` | 5     | format_size B/KB/MB/GB/TB                            |

### Project Dependencies

Runtime:

- `datacollective>=0.4.2` -- MDC Python SDK
- `click>=8.1` -- CLI framework
- `tenacity>=8.2` -- retry with backoff
- `httpx>=0.27` -- HTTP client for language API
- `tqdm>=4.66` -- progress bars

GCS support:

- `google-cloud-storage>=2.14` -- used for `gs://` URI mode (see Data Flow above)

Dev:

- `pytest>=8.0`, `pytest-mock>=3.12`
- `ruff>=0.4` -- linting + formatting
- `mypy>=1.10` -- type checking
- `types-tqdm>=4.66` -- tqdm type stubs

---

## GCSFuse Configuration (GKE)

The bundler pods already use GCSFuse to mount the GCS bucket. The uploader reuses the same mount at `/gcs` (configurable via `--base-dir` or `UPLOAD_BASE_DIR`).

Pod volume spec (already configured in the bundler deployment):

```yaml
volumes:
  - name: gcs-releases
    csi:
      driver: gcsfuse.csi.storage.gke.io
      volumeAttributes:
        bucketName: common-voice-bundler
        mountOptions: 'implicit-dirs'

volumeMounts:
  - name: gcs-releases
    mountPath: /gcs
    readOnly: true
```

Prerequisites:

- GCSFuse CSI driver addon enabled on the GKE cluster
- Service account with `storage.objectViewer` on the bucket
- See [GCP docs](https://cloud.google.com/kubernetes-engine/docs/how-to/persistent-volumes/cloud-storage-fuse-csi-driver)

### Checking GCSFuse from inside a pod

```bash
# Check if GCSFuse mount is active
mount | grep gcsfuse

# Verify the mount point is accessible
df -T /gcs

# List files to confirm bucket contents are visible
ls /gcs/
```

If `mount | grep gcsfuse` returns nothing, the CSI driver addon may not be enabled on the cluster. Check from outside the pod:

```bash
# Check if the GCSFuse CSI driver addon is enabled
gcloud container clusters describe <CLUSTER> --zone <ZONE> \
  --format='value(addonsConfig.gcsFuseCsiDriverConfig.enabled)'

# Enable if needed
gcloud container clusters update <CLUSTER> --zone <ZONE> \
  --update-addons=GcsFuseCsiDriver=ENABLED
```

---

## Docker Integration

The uploader is installed in the bundler Dockerfile alongside the Node.js bundler.

### Entry point: `bundler/src/cli/mdc-upload.sh`

The shell wrapper is the primary entry point in both container and local environments. It locates the correct Python venv automatically:

1. Checks `/opt/venv/bin/mdc-upload` (container path, set by Dockerfile)
2. Falls back to `bundler/uploader/.venv/bin/mdc-upload` (local dev path)
3. Exits with an error if neither is found

```bash
# Inside the container
./src/cli/mdc-upload.sh -r cv-corpus-25.0-2026-03-09 -ut prod

# Local dev (same script)
./bundler/src/cli/mdc-upload.sh -r sps-corpus-3.0-2026-03-09 -ut dev --dry-run
```

### Dockerfile additions

The Dockerfile installs the uploader into a dedicated venv at `/opt/venv`:

```dockerfile
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir ./uploader
```

The shell script at `src/cli/mdc-upload.sh` must be executable (`chmod +x`). Git tracks this via the `100755` file mode.

---

## Future: Multi-Pod with BullMQ (Iteration 2)

Planned for the next iteration using the official BullMQ Python port (v2.19.6):

- `mdc-upload dispatch` -- scan base-dir, sort by size DESC, push jobs to BullMQ queue
- `mdc-upload worker` -- BullMQ Worker consumes and processes jobs
- `mdc-upload status` -- show batch progress from Redis
- **Redis-backed batch state** -- current `.state/` JSON files are local to the pod filesystem and do not survive pod crashes. Move state tracking to Redis so `--retry-failed` works across pod restarts.
- Reuses existing Redis instance from bundler infrastructure
