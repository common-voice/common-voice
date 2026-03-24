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
mdc.py ------------> datacollective SDK (step-by-step public API)
    |                 (create_submission_draft,
    |                  upload_dataset_file,
    |                  update_submission,
    |                  submit_submission)
    |
    v
gcs.py ------------> google-cloud-storage (optional, for gs:// URIs only)
```

Supporting modules:

- `typedef.py` -- shared type definitions (`UploadStatus`, `MDCTarget`, `LanguageNames`, TypedDicts)
- `models.py` -- data models (`Modality`, `ReleaseType`, `ReleaseSpec`, `LocaleUploadJob`, `UploadResult`)
- `log.py` -- structured logging matching the bundler's `[TIMESTAMP] [LEVEL] [COMPONENT]` format

## Environment Variables

| Variable           | Required       | Default    | Description                                             |
| ------------------ | -------------- | ---------- | ------------------------------------------------------- |
| `MDC_API_KEY_DEV`  | For `-ut dev`  | --         | MDC API key for the dev environment                     |
| `MDC_API_KEY_PROD` | For `-ut prod` | --         | MDC API key for the prod environment                    |
| `MDC_API_URL`      | No             | from `-ut` | Override MDC API base URL                               |
| `UPLOAD_BASE_DIR`  | No             | `/gcs`     | Default base directory for uploads                      |
| `UPLOAD_STATE_DIR` | No             | `./.state` | Directory for batch state JSON files                    |
| `UPLOAD_LOG_FILE`  | No             | --         | Default log file path (env alternative to `--log-file`) |

Dev and prod use separate MDC accounts. Set the key matching your `-ut` target.

`UPLOAD_BASE_DIR` and `UPLOAD_STATE_DIR` are defined by this tool only (not in the SCS bundler code). They provide env-var alternatives to CLI options so values can be set once in the pod spec.

## Module Responsibilities

| Module         | Purpose                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------- |
| `cli.py`       | Click CLI entry point, option parsing, `--retry-failed`/`--resume` handling, error formatting |
| `config.py`    | `UploaderConfig` dataclass, env var + CLI arg resolution                                      |
| `constants.py` | MDC API URLs, metadata templates, contact info                                                |
| `typedef.py`   | Shared type aliases, Literal types, TypedDicts                                                |
| `models.py`    | `Modality`, `ReleaseType`, `ReleaseSpec`, `LocaleUploadJob`, `UploadResult`                   |
| `naming.py`    | Release name parsing, tarball/datasheet path construction                                     |
| `language.py`  | `LanguageRegistry` class -- fetches locale names from CV API + hardcoded extras               |
| `mdc.py`       | `MDCClient` -- step-by-step SDK calls, resume, recovery, error/response capture, 429 retry    |
| `pipeline.py`  | Per-locale upload orchestration, resume/recovery routing, GCS temp cleanup, batch runner      |
| `state.py`     | `BatchState` JSON persistence, orphaned submission extraction, log-to-storage upload          |
| `progress.py`  | tqdm batch progress bar, human-readable size formatting                                       |
| `log.py`       | Structured logging, auto log file, `flush_all`/`get_log_file_path` for storage save           |
| `gcs.py`       | GCS fallback for `gs://` URIs (uses `google-cloud-storage` runtime dependency)                |

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

Uses the SDK's documented step-by-step public API for full control:

1. Resolve tarball path from `--base-dir` + release naming conventions
2. Fetch English/native names from `LanguageRegistry` (CV API + extras)
3. Read datasheet markdown from filesystem (optional)
4. **Step 1/4**: `create_submission_draft()` -- create draft, capture `submission_id`
5. **Step 2/4**: `upload_dataset_file()` -- multipart upload with `.mdc-upload.json` resume state
6. **Step 3/4**: `update_submission()` -- set metadata + `fileUploadId`
7. **Step 4/4**: `submit_submission()` -- submit for review
8. Record result (including `submission_id` and `file_upload_id`) in batch state JSON

Each step has per-step error handling: request payload and HTTP response body are logged on failure, and `OrphanedDraftError` captures both IDs for recovery.

### Orphaned Draft Recovery (--retry-failed)

When a previous run failed after step 2 (upload succeeded but metadata update or submit failed), the state file contains `orphaned_draft: true` with both `submission_id` and `file_upload_id`. On retry:

1. Fetch language data and read datasheet (no tarball download needed)
2. `recover_submission()` -- calls steps 3+4 only, skipping draft creation and file upload
3. Record result in batch state JSON

### Resume Partial Upload (--resume)

When step 2 (multipart upload) fails partway, the SDK saves per-part progress to a state file. On `--resume`:

1. Search for SDK state file: `<base-dir>/<release>/upload-logs/mdc-upload-<locale>.json` first, `.state/` fallback
2. Resolve tarball and datasheet (tarball is needed -- the SDK re-reads it for remaining parts)
3. `resume_and_upload()` -- skips step 1 (draft already exists), calls `upload_dataset_file(state_path=...)` which uploads only missing parts, then runs steps 3+4
4. Record result in batch state JSON

The SDK validates that the state file matches (submissionId, filename, fileSize, mimeType) before resuming. If the file has changed, it starts a fresh upload instead.

#### State file persistence

During normal uploads, `_sdk_state_path()` determines where the SDK writes its per-part state:

- **Local/GCSFuse base-dir**: `<base-dir>/<release>/upload-logs/mdc-upload-<locale>.json` -- on GCSFuse mounts this is GCS-backed and survives pod eviction. The SDK writes after every part, so progress is persisted in real time.
- **gs:// base-dir**: `.state/mdc-upload-<locale>.json` -- local disk only (can't write to GCS via filesystem). Survives pod crashes (OOM kill) but NOT pod eviction.

Additionally, `_preserve_sdk_state_local()` copies SDK state from next to the tarball to `.state/` as a fallback for code paths that don't pass `state_path` (e.g. `upload_new_version`).

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

Every batch run writes a state JSON file to `.state/` after each locale completes. After the batch, both the state JSON and log file are copied to `<base-dir>/<release>/upload-logs/` for persistence across pod recycling.

Local state file path:

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
    "ga-IE": {
      "status": "success",
      "submission_id": "abc-123",
      "file_upload_id": "fup-456"
    },
    "en": {
      "status": "failed",
      "error": "Orphaned draft sub-789: Metadata update failed: 400 Bad Request",
      "orphaned_draft": true,
      "submission_id": "sub-789",
      "file_upload_id": "fup-012"
    }
  }
}
```

On `--retry-failed`, locales with `orphaned_draft` + both IDs resume from step 3 without re-uploading.

Use `--retry-failed <path>` to re-run only failed locales. Config is restored from the state file.

---

## Runtime Files

During and after a batch run, the uploader creates files in three locations:

```txt
.state/                                        <-- local scratch (ephemeral on pod filesystem)
  upload-state-cv-corpus-25.0-...-20260319T170000.json   <-- batch state (per run)
  upload-state-cv-corpus-25.0-...-20260319T183000.json   <-- retry run state
  mdc-upload-br.json                                     <-- SDK upload state (copied on failure)
  mdc-upload-en.json                                     <-- one per failed locale
  mdc-upload-cv-corpus-25.0-...-20260319T170000.log      <-- log file (always created)

/tmp/                                          <-- ephemeral (GCS download temp files)
  tmpXXXXXX/                                   <-- temp dir per locale (GCS mode only)
    cv-corpus-25.0-2026-03-09-br.tar.gz        <-- downloaded tarball (deleted after upload)
    cv-corpus-25.0-...-br.tar.gz.mdc-upload.json  <-- SDK resume state (during upload)

<base-dir>/<release>/upload-logs/              <-- persistent (GCS, survives pod recycling)
  mdc-upload-cv-corpus-25.0-...-20260319T170000.log      <-- copied from .state/ after batch
  upload-state-cv-corpus-25.0-...-20260319T170000.json   <-- copied from .state/ after batch
```

**Log persistence:** A DEBUG-level log file is always created in `.state/` (even without `--log-file`). After the batch completes, both the log file and state JSON are copied to `<base-dir>/<release>/upload-logs/` in GCS so they survive pod recycling. For `gs://` URIs, upload uses the GCS client; for GCSFuse mounts, the mount must be writable (see GCSFuse section below).

**Tarball lifecycle (GCS mode):** downloaded from GCS -> uploaded to MDC -> always deleted (both success and failure). The `submission_id` and `file_upload_id` in batch state are sufficient for retry.

**`.mdc-upload.json` lifecycle:** For new uploads, `_sdk_state_path()` directs the SDK to write state to `upload-logs/` (GCSFuse) or `.state/` (`gs://` mode). The SDK writes after every part and deletes on success. For `gs://` downloads, `_cleanup_gcs_temp` also copies any leftover state from the temp dir to `.state/` on failure.

---

## Helper Commands

### Monitoring a running batch

```bash
# Watch temp dir disk usage during GCS downloads
watch -n5 'du -sh /tmp/tmp* 2>/dev/null'

# Tail the log file in real time
tail -f .state/mdc-upload-cv25-*.log

# Count completed/failed/remaining from log
grep -c 'Step 4/4: Submitted' .state/mdc-upload-cv25-*.log    # completed
grep -c 'FAILED' .state/mdc-upload-cv25-*.log                  # failed
```

### Inspecting results after a batch

```bash
# List all state files
ls -lt .state/upload-state-*.json

# Show failed locales from state JSON
python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
for loc, info in d['locales'].items():
    if info['status'] == 'failed':
        print(f\"{loc}: {info.get('error', '?')[:80]}\")
" .state/upload-state-cv-corpus-25.0-*.json

# Show orphaned drafts (recoverable with --retry-failed)
python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
for loc, info in d['locales'].items():
    if info.get('orphaned_draft'):
        print(f\"{loc}: sub={info['submission_id']} fup={info.get('file_upload_id', '?')}\")
" .state/upload-state-cv-corpus-25.0-*.json

# Summary counts
python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
from collections import Counter
c = Counter(v['status'] for v in d['locales'].values())
print(f\"success={c['success']} failed={c['failed']} skipped={c['skipped']}\")
" .state/upload-state-cv-corpus-25.0-*.json
```

### Inspecting MDC upload state files (on failure)

```bash
# List preserved SDK state files
ls -la .state/mdc-upload-*.json

# Show what IDs were used for a failed locale
cat .state/mdc-upload-br.json | python3 -m json.tool
```

### Cleanup

```bash
# Remove old state files (keep last 5)
ls -t .state/upload-state-*.json | tail -n +6 | xargs rm -f

# Remove orphaned temp dirs (if any survived)
find /tmp -maxdepth 1 -name 'tmp*' -type d -mmin +60 -exec du -sh {} \;

# Remove old log files
ls -t .state/mdc-upload-*.log | tail -n +3 | xargs rm -f
```

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

If step 1 (draft creation) succeeds but a later step fails, the state file records `"orphaned_draft": true` with `submission_id` and `file_upload_id` (if upload completed). Use `--retry-failed` to automatically recover -- locales with both IDs skip re-upload and resume from step 3.

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

| Test file          | Tests | Covers                                                           |
| ------------------ | ----- | ---------------------------------------------------------------- |
| `test_mdc.py`      | 37    | Exception wrapping, response extraction, step-by-step, recovery  |
| `test_naming.py`   | 30    | Release parsing (incl. delta), paths, detect_locales             |
| `test_language.py` | 11    | LanguageRegistry init/find/extras/variants/API failure           |
| `test_pipeline.py` | 10    | Job building, process_locale, GCS temp cleanup, orphaned drafts  |
| `test_gcs.py`      | 10    | URI detection, parsing, require guard                            |
| `test_models.py`   | 9     | StrEnum values, ReleaseSpec props, defaults                      |
| `test_state.py`    | 7     | BatchState record/summary, retry loading, orphaned extraction    |
| `test_config.py`   | 7     | UploaderConfig.from_cli, locale parsing                          |
| `test_log.py`      | 6     | File handler setup, DEBUG capture, datacollective logger routing |
| `test_progress.py` | 5     | format_size B/KB/MB/GB/TB                                        |

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
    readOnly: false # writable -- uploader saves logs to <release>/upload-logs/
```

Prerequisites:

- GCSFuse CSI driver addon enabled on the GKE cluster
- Service account with `storage.objectViewer` + `storage.objectCreator` on the bucket (objectCreator needed for upload-logs)
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
- **Redis-backed batch state** -- state JSON is now copied to GCS after each batch, but mid-batch crashes still lose progress. Move state tracking to Redis for real-time persistence across pod restarts.
- Reuses existing Redis instance from bundler infrastructure
