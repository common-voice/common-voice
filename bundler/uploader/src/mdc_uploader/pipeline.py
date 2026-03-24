"""Upload pipeline -- per-locale orchestration and batch runner."""

from __future__ import annotations

import os
import tempfile
import time

from mdc_uploader import language
from mdc_uploader.config import UploaderConfig
from mdc_uploader.gcs import (
    _parse_gcs_uri,
    gcs_list_tarballs,
    gcs_read_text,
    is_gcs_uri,
)
from mdc_uploader.log import logger
from mdc_uploader.mdc import MDCClient, OrphanedDraftError
from mdc_uploader.models import (
    LocaleUploadJob,
    ReleaseSpec,
    ReleaseType,
    UploadResult,
)
from mdc_uploader.naming import (
    datasheet_path,
    detect_locales,
    parse_release_name,
    tarball_dir,
    tarball_filename,
    tarball_path,
)
from mdc_uploader.progress import batch_progress, format_size
from mdc_uploader.state import STATE_DIR, BatchState, save_logs_to_storage


def _try_fadvise(path: str, advice: int) -> None:
    """Best-effort posix_fadvise hint; silently ignored when unavailable."""
    if not hasattr(os, "posix_fadvise"):
        return
    try:
        fd = os.open(path, os.O_RDONLY)
        try:
            os.posix_fadvise(fd, 0, 0, advice)
        finally:
            os.close(fd)
    except OSError:
        pass


def _build_jobs_gcs(  # pylint: disable=too-many-locals
    config: UploaderConfig,
    release_spec: ReleaseSpec,
    license_name: str | None,
) -> list[LocaleUploadJob]:
    """Build jobs when base-dir is a gs:// URI (GCS fallback mode)."""
    subdir = tarball_dir(config.release_name, config.release_type)

    if config.locales:
        # Fetch sizes for explicit locales from GCS
        from google.cloud import storage as gcs_storage  # type: ignore[import-untyped]  # pylint: disable=import-outside-toplevel  # noqa: I001

        bucket_name, base_prefix = _parse_gcs_uri(config.base_dir)
        client = gcs_storage.Client()
        bucket = client.bucket(bucket_name)
        locale_sizes: list[tuple[str, int]] = []
        for loc in config.locales:
            fname = tarball_filename(loc, config.release_name, license_name)
            blob_path = f"{base_prefix}/{subdir}/{fname}" if base_prefix else f"{subdir}/{fname}"
            blob = bucket.blob(blob_path)
            if blob.exists():
                blob.reload()
                locale_sizes.append((loc, blob.size or 0))
            else:
                locale_sizes.append((loc, 0))
    else:
        locale_sizes = gcs_list_tarballs(
            config.base_dir,
            config.release_name,
            subdir,
            license_name,
            is_variants=config.release_type == ReleaseType.VARIANTS,
        )

    jobs: list[LocaleUploadJob] = []
    for locale, size in locale_sizes:
        # For GCS mode, tarball_path is the relative blob path
        # (downloaded to a temp file in _resolve_file_and_datasheet)
        tb_blob = f"{subdir}/{tarball_filename(locale, config.release_name, license_name)}"
        ds_blob = os.path.relpath(datasheet_path("", release_spec, locale, license_name), "")

        orphan = (config.orphaned_submissions or {}).get(locale)
        orphaned_sid = orphan["submission_id"] if orphan else None
        orphaned_fid = orphan["file_upload_id"] if orphan else None

        # Resume state: only applies to the matching locale
        resume_path = config.resume_state_path if config.resume_submission_id else None
        resume_sid = config.resume_submission_id if resume_path else None

        jobs.append(
            LocaleUploadJob(
                locale=locale,
                release_spec=release_spec,
                release_type=config.release_type,
                tarball_path=tb_blob,  # blob path, not filesystem
                datasheet_path=ds_blob,
                file_size=size,
                submission_id=config.submission_id,
                license_type=license_name,
                orphaned_submission_id=orphaned_sid,
                orphaned_file_upload_id=orphaned_fid,
                resume_state_path=resume_path,
                resume_submission_id=resume_sid,
            )
        )

    jobs.sort(key=lambda j: j.file_size)
    return jobs


def _build_jobs_local(
    config: UploaderConfig,
    release_spec: ReleaseSpec,
    license_name: str | None,
) -> list[LocaleUploadJob]:
    """Build jobs when base-dir is a local/GCSFuse filesystem path."""
    if config.locales:
        locales = config.locales
    else:
        locales = detect_locales(
            config.base_dir, config.release_name, config.release_type, license_name
        )

    jobs: list[LocaleUploadJob] = []
    for locale in locales:
        tb_path = tarball_path(
            config.base_dir,
            config.release_name,
            locale,
            config.release_type,
            license_name,
        )

        ds_path_candidate = datasheet_path(
            config.base_dir,
            release_spec,
            locale,
            license_name,
        )
        ds_path: str | None = ds_path_candidate if os.path.exists(ds_path_candidate) else None

        try:
            file_size = os.path.getsize(tb_path)
        except OSError:
            file_size = 0

        # Check for orphaned draft recovery data from --retry-failed
        orphan = (config.orphaned_submissions or {}).get(locale)
        orphaned_sid = orphan["submission_id"] if orphan else None
        orphaned_fid = orphan["file_upload_id"] if orphan else None

        # Resume state: only applies to the matching locale
        resume_path = config.resume_state_path if config.resume_submission_id else None
        resume_sid = config.resume_submission_id if resume_path else None

        jobs.append(
            LocaleUploadJob(
                locale=locale,
                release_spec=release_spec,
                release_type=config.release_type,
                tarball_path=tb_path,
                datasheet_path=ds_path,
                file_size=file_size,
                submission_id=config.submission_id,
                license_type=license_name,
                orphaned_submission_id=orphaned_sid,
                orphaned_file_upload_id=orphaned_fid,
                resume_state_path=resume_path,
                resume_submission_id=resume_sid,
            )
        )

    jobs.sort(key=lambda j: j.file_size)
    return jobs


def build_jobs(
    config: UploaderConfig,
    release_spec: ReleaseSpec,
) -> list[LocaleUploadJob]:
    """Build the list of upload jobs from config and filesystem/GCS."""
    license_name = "CC-BY 4.0" if config.release_type == ReleaseType.LICENSED else None

    if is_gcs_uri(config.base_dir):
        return _build_jobs_gcs(config, release_spec, license_name)
    return _build_jobs_local(config, release_spec, license_name)


def _resolve_file_and_datasheet(
    job: LocaleUploadJob,
    base_dir: str,
) -> tuple[str | None, str, str | None]:  # (tarball_local_path, datasheet_text, error)
    """Resolve tarball file path and datasheet text.

    For gs:// URIs: downloads tarball to temp via google-cloud-storage.
    For local paths (including GCSFuse mounts): reads directly from filesystem.

    Returns (tarball_local_path_or_None, datasheet_text, error_or_None).
    """
    tarball_local: str | None = None
    datasheet_text = ""

    if is_gcs_uri(base_dir):
        # GCS mode: tarball_path is a blob path
        tmp_dir: str | None = None
        try:
            # File must persist for the upload -- caller handles cleanup.
            from google.cloud import (  # type: ignore[import-untyped]  # pylint: disable=import-outside-toplevel
                storage as gcs_storage,
            )

            bucket_name, base_prefix = _parse_gcs_uri(base_dir)
            gcs_client = gcs_storage.Client()
            bucket = gcs_client.bucket(bucket_name)
            blob_path = f"{base_prefix}/{job.tarball_path}" if base_prefix else job.tarball_path
            blob = bucket.blob(blob_path)

            if not blob.exists():
                return None, "", f"GCS blob not found: gs://{bucket_name}/{blob_path}"

            # Use the original tarball filename so MDC logs/stores a meaningful name
            original_name = os.path.basename(job.tarball_path)
            tmp_dir = tempfile.mkdtemp()
            tmp_path = os.path.join(tmp_dir, original_name)
            blob.download_to_filename(tmp_path)
            # Drop page cache after download -- large datasets fill the cache
            # and cause pressure.  The upload re-faults pages on demand.
            _try_fadvise(tmp_path, getattr(os, "POSIX_FADV_DONTNEED", 0))
            logger.info("GCS", "[%s] Downloaded %s", job.locale, blob_path)
            tarball_local = tmp_path
        except Exception as exc:  # pylint: disable=broad-exception-caught
            # Clean up temp dir/file on download failure to avoid leaking disk space
            if tmp_dir:
                try:
                    for f in os.listdir(tmp_dir):
                        os.unlink(os.path.join(tmp_dir, f))
                    os.rmdir(tmp_dir)
                except OSError:
                    pass
            logger.error("GCS", "[%s] Download failed: %s", job.locale, exc)
            return None, "", f"GCS download failed: {exc}"

        # Read datasheet
        if job.datasheet_path:
            text = gcs_read_text(base_dir, job.datasheet_path)
            if text:
                datasheet_text = text
            else:
                logger.warning("UPLOAD", "[%s] No datasheet found in GCS", job.locale)

        return tarball_local, datasheet_text, None

    # Local/GCSFuse: paths are filesystem paths
    tarball_local = job.tarball_path if os.path.exists(job.tarball_path) else None

    if job.datasheet_path and os.path.exists(job.datasheet_path):
        with open(job.datasheet_path, encoding="utf-8") as f:
            datasheet_text = f.read()
    elif job.datasheet_path is None:
        logger.warning("UPLOAD", "[%s] No datasheet found -- proceeding without", job.locale)
    else:
        logger.warning("UPLOAD", "[%s] Datasheet not found at %s", job.locale, job.datasheet_path)

    error = f"Tarball not found: {job.tarball_path}" if tarball_local is None else None
    return tarball_local, datasheet_text, error


def _cleanup_gcs_temp(
    tmp_file: str,
    locale: str,
    succeeded: bool,
) -> None:
    """Clean up GCS-downloaded temp files after a locale upload.

    Always removes the tarball to prevent disk exhaustion during batches.
    On success: also removes .mdc-upload.json and the temp dir.
    On failure: preserves .mdc-upload.json for debugging, logs its path.
    With step-by-step uploads, submission_id and file_upload_id are saved
    in BatchState for recovery -- the tarball is not needed for retry.
    """
    try:
        tmp_dir = os.path.dirname(tmp_file)
        # Always remove the tarball to save disk
        os.unlink(tmp_file)

        if not tmp_dir or tmp_dir == os.getcwd():
            return

        if succeeded:
            for fname in os.listdir(tmp_dir):
                if fname.endswith(".mdc-upload.json"):
                    os.unlink(os.path.join(tmp_dir, fname))
            try:
                os.rmdir(tmp_dir)
            except OSError:
                pass
        else:
            # Copy .mdc-upload.json to .state/ with locale in the name,
            # then clean up the temp dir entirely.
            import shutil  # pylint: disable=import-outside-toplevel

            for fname in os.listdir(tmp_dir):
                if fname.endswith(".mdc-upload.json"):
                    src = os.path.join(tmp_dir, fname)
                    dest = os.path.join(STATE_DIR, f"mdc-upload-{locale}.json")
                    os.makedirs(STATE_DIR, exist_ok=True)
                    shutil.copy2(src, dest)
                    logger.info(
                        "UPLOAD",
                        "[%s] MDC upload state saved to: %s",
                        locale,
                        dest,
                    )
                    os.unlink(src)
            try:
                os.rmdir(tmp_dir)
            except OSError:
                pass
    except OSError as exc:
        logger.warning("UPLOAD", "[%s] Cleanup failed (non-fatal): %s", locale, exc)


def _sdk_state_path(base_dir: str, release_name: str, locale: str) -> str:
    """Return the path where the SDK should write multipart upload state.

    For local/GCSFuse base dirs: writes to <base_dir>/<release>/upload-logs/
    so the state file is on GCS-backed storage and survives pod eviction.

    For gs:// URIs (no writable filesystem): falls back to .state/ on local disk.
    """
    if is_gcs_uri(base_dir):
        os.makedirs(STATE_DIR, exist_ok=True)
        return os.path.join(STATE_DIR, f"mdc-upload-{locale}.json")
    upload_logs = os.path.join(base_dir, release_name, "upload-logs")
    os.makedirs(upload_logs, exist_ok=True)
    return os.path.join(upload_logs, f"mdc-upload-{locale}.json")


def _preserve_sdk_state_local(tarball_path: str, locale: str) -> None:
    """Copy SDK state file to .state/ for --resume support (fallback).

    Only needed when state_path was NOT passed to upload_dataset_file
    (e.g. upload_new_version). The default SDK location is
    <tarball>.mdc-upload.json next to the tarball.
    No-op when the SDK state file does not exist.
    """
    sdk_state = f"{tarball_path}.mdc-upload.json"
    if not os.path.exists(sdk_state):
        return
    import shutil  # pylint: disable=import-outside-toplevel

    dest = os.path.join(STATE_DIR, f"mdc-upload-{locale}.json")
    os.makedirs(STATE_DIR, exist_ok=True)
    shutil.copy2(sdk_state, dest)
    logger.info("UPLOAD", "[%s] SDK upload state saved to: %s", locale, dest)


def process_locale(  # pylint: disable=too-many-return-statements,too-many-branches,too-many-locals
    job: LocaleUploadJob,
    client: MDCClient | None,
    dry_run: bool,
    base_dir: str = "",
) -> UploadResult:
    """Process a single locale upload."""
    locale = job.locale
    start = time.monotonic()
    tmp_file: str | None = None  # track temp files for GCS cleanup
    upload_succeeded = False

    try:
        # Fetch language data -- for variants, look up the parent locale
        if job.release_type == ReleaseType.VARIANTS:
            lang_entry = language.find_by_variant(locale)
            if lang_entry is None:
                lang_entry = language.find(locale)
        else:
            lang_entry = language.find(locale)
        english_name = lang_entry.get("english_name", lang_entry["code"])
        native_name = lang_entry["native_name"]

        # Recovery mode: skip tarball download, go straight to steps 3+4.
        # Only needs language data + submission metadata, not the tarball.
        if job.orphaned_submission_id and job.orphaned_file_upload_id:
            assert client is not None
            # Read datasheet without downloading the tarball
            datasheet_text = ""
            if job.datasheet_path:
                if is_gcs_uri(base_dir):
                    datasheet_text = gcs_read_text(base_dir, job.datasheet_path) or ""
                elif os.path.exists(job.datasheet_path):
                    with open(job.datasheet_path, encoding="utf-8") as f:
                        datasheet_text = f.read()
            submission = client.build_submission(
                release_spec=job.release_spec,
                english_name=english_name,
                native_name=native_name,
                locale=locale,
                license_name=job.license_type,
                datasheet_text=datasheet_text,
            )
            logger.info(
                "UPLOAD",
                "[%s] RETRYING orphaned draft %s (steps 3-4 only)",
                locale,
                job.orphaned_submission_id,
            )
            submission_id, _ = client.recover_submission(
                submission_id=job.orphaned_submission_id,
                file_upload_id=job.orphaned_file_upload_id,
                submission=submission,
            )
            upload_succeeded = True
            return UploadResult(
                locale=locale,
                status="success",
                submission_id=submission_id,
                size_bytes=job.file_size,
                duration_seconds=time.monotonic() - start,
                attempts=1,
            )

        # Resume mode: reuse existing draft, resume partial multipart upload.
        if job.resume_state_path and job.resume_submission_id:
            assert client is not None

            tarball_local, datasheet_text, resolve_error = _resolve_file_and_datasheet(
                job, base_dir
            )
            if tarball_local is None:
                return UploadResult(
                    locale=locale,
                    status="failed",
                    size_bytes=job.file_size,
                    duration_seconds=time.monotonic() - start,
                    error=resolve_error or f"Tarball not found: {job.tarball_path}",
                    attempts=0,
                )
            if is_gcs_uri(base_dir):
                tmp_file = tarball_local

            _try_fadvise(tarball_local, getattr(os, "POSIX_FADV_SEQUENTIAL", 0))

            submission = client.build_submission(
                release_spec=job.release_spec,
                english_name=english_name,
                native_name=native_name,
                locale=locale,
                license_name=job.license_type,
                datasheet_text=datasheet_text,
            )
            logger.info(
                "UPLOAD",
                "[%s] RESUMING partial upload for draft %s",
                locale,
                job.resume_submission_id,
            )
            submission_id, _ = client.resume_and_upload(
                file_path=tarball_local,
                submission=submission,
                resume_state_path=job.resume_state_path,
                submission_id=job.resume_submission_id,
            )
            upload_succeeded = True
            return UploadResult(
                locale=locale,
                status="success",
                submission_id=submission_id,
                size_bytes=job.file_size,
                duration_seconds=time.monotonic() - start,
                attempts=1,
            )

        # Resolve file path and datasheet
        tarball_local, datasheet_text, resolve_error = _resolve_file_and_datasheet(job, base_dir)

        if tarball_local is None:
            return UploadResult(
                locale=locale,
                status="failed",
                size_bytes=job.file_size,
                duration_seconds=time.monotonic() - start,
                error=resolve_error or f"Tarball not found: {job.tarball_path}",
                attempts=0,
            )

        # Track temp file for cleanup in GCS mode
        if is_gcs_uri(base_dir):
            tmp_file = tarball_local

        if dry_run:
            logger.info(
                "UPLOAD",
                "[%s] DRY RUN -- would upload %s (%s) as '%s'",
                locale,
                os.path.basename(job.tarball_path),
                format_size(job.file_size),
                f"Common Voice {job.release_spec.modality_display} "
                f"{job.release_spec.version} - {english_name}",
            )
            return UploadResult(
                locale=locale,
                status="skipped",
                size_bytes=job.file_size,
                duration_seconds=time.monotonic() - start,
            )

        assert client is not None
        submission = client.build_submission(
            release_spec=job.release_spec,
            english_name=english_name,
            native_name=native_name,
            locale=locale,
            license_name=job.license_type,
            datasheet_text=datasheet_text,
        )

        # Sequential readahead hint -- reduces page cache pressure for multi-GB uploads.
        _try_fadvise(tarball_local, getattr(os, "POSIX_FADV_SEQUENTIAL", 0))

        if job.submission_id:
            # Version update mode
            logger.info(
                "UPLOAD",
                "[%s] Uploading new version to %s (%s)",
                locale,
                job.submission_id,
                format_size(job.file_size),
            )
            client.upload_new_version(tarball_local, job.submission_id)
            upload_succeeded = True
            return UploadResult(
                locale=locale,
                status="success",
                submission_id=job.submission_id,
                size_bytes=job.file_size,
                duration_seconds=time.monotonic() - start,
                attempts=1,
            )

        # New submission mode
        logger.info(
            "UPLOAD",
            "[%s] Creating new submission (%s)",
            locale,
            format_size(job.file_size),
        )
        state_path = _sdk_state_path(base_dir, job.release_spec.release_name, locale)
        submission_id, _ = client.create_and_upload(
            file_path=tarball_local,
            submission=submission,
            state_path=state_path,
        )
        upload_succeeded = True
        return UploadResult(
            locale=locale,
            status="success",
            submission_id=submission_id,
            size_bytes=job.file_size,
            duration_seconds=time.monotonic() - start,
            attempts=1,
        )

    except OrphanedDraftError as exc:
        return UploadResult(
            locale=locale,
            status="failed",
            submission_id=exc.submission_id,
            file_upload_id=exc.file_upload_id,
            size_bytes=job.file_size,
            duration_seconds=time.monotonic() - start,
            error=str(exc),
            orphaned_draft=True,
        )
    except Exception as exc:  # pylint: disable=broad-exception-caught
        return UploadResult(
            locale=locale,
            status="failed",
            size_bytes=job.file_size,
            duration_seconds=time.monotonic() - start,
            error=str(exc),
        )
    finally:
        if tmp_file and os.path.exists(tmp_file):
            _cleanup_gcs_temp(tmp_file, locale, upload_succeeded)
        elif not upload_succeeded:
            _preserve_sdk_state_local(job.tarball_path, locale)


def print_summary(state: BatchState) -> None:
    """Print a summary table of the batch results."""
    success, failed, skipped = state.summary()
    total = success + failed + skipped

    # Derive modality tag from release name for the summary header
    modality_tag = "SPS" if state.release.startswith("sps-") else "SCS"

    logger.info("UPLOAD", "")
    logger.info("UPLOAD", "-- Batch Summary [%s] %s " + "-" * 20, modality_tag, state.release)
    logger.info(
        "UPLOAD",
        "Total: %d | Success: %d | Failed: %d | Skipped: %d",
        total,
        success,
        failed,
        skipped,
    )
    logger.info("UPLOAD", "")

    # Print per-locale results
    for locale, entry in state.locales.items():
        status_str = entry["status"].upper()
        size = format_size(entry.get("size_bytes", 0))
        duration: float = entry.get("duration_seconds", 0.0)
        sid: str = entry.get("submission_id", "-")
        error: str = entry.get("error", "")

        if entry["status"] == "failed":
            logger.info(
                "UPLOAD",
                "  %-12s  %-7s  %-10s  %6.1fs  %s  %s",
                locale,
                status_str,
                size,
                duration,
                sid,
                error[:60],
            )
        else:
            logger.info(
                "UPLOAD",
                "  %-12s  %-7s  %-10s  %6.1fs  %s",
                locale,
                status_str,
                size,
                duration,
                sid,
            )

    from mdc_uploader.log import get_log_file_path  # pylint: disable=import-outside-toplevel

    log_path = get_log_file_path()
    if log_path:
        logger.info("UPLOAD", "Log file: %s", log_path)

    if failed > 0:
        logger.info("UPLOAD", "")
        logger.info(
            "UPLOAD",
            "State saved: %s",
            state.state_path,
        )
        logger.info(
            "UPLOAD",
            "To retry failed: mdc-upload --retry-failed %s",
            state.state_path,
        )
        # Check for SDK state files that support --resume (partial uploads).
        # State may be in upload-logs/ (GCS-persistent) or .state/ (local).
        upload_logs_dir = os.path.join(state.base_dir, state.release, "upload-logs")
        for locale in state.locales:
            if state.locales[locale]["status"] != "failed":
                continue
            state_name = f"mdc-upload-{locale}.json"
            has_state = os.path.exists(os.path.join(upload_logs_dir, state_name)) or \
                os.path.exists(os.path.join(STATE_DIR, state_name))
            if has_state:
                logger.info(
                    "UPLOAD",
                    "To resume %s (partial upload): mdc-upload --resume "
                    "-r %s -l %s -ut %s",
                    locale,
                    state.release,
                    locale,
                    state.upload_target,
                )


def run_batch(config: UploaderConfig) -> bool:
    """Run the full batch upload. Returns True if all locales succeeded."""
    release_spec = parse_release_name(config.release_name)

    from mdc_uploader.log import get_log_file_path  # pylint: disable=import-outside-toplevel

    logger.info(
        "UPLOAD",
        "Release: %s (%s, type=%s, target=%s)",
        config.release_name,
        release_spec.modality_display,
        config.release_type.value,
        config.upload_target,
    )
    logger.info("UPLOAD", "Base dir: %s", config.base_dir)
    log_path = get_log_file_path()
    if log_path:
        logger.info("UPLOAD", "Log file: %s", log_path)

    if config.dry_run:
        logger.info("UPLOAD", "** DRY RUN MODE **")

    # Initialize batch state early so save_logs_to_storage can persist
    # the log file even if build_jobs or language.init() fails.
    state = BatchState(
        release=config.release_name,
        upload_target=config.upload_target,
        release_type=config.release_type.value,
        base_dir=config.base_dir,
    )

    try:
        # Initialize language registry (API + extras)
        language.init()

        # Build jobs
        try:
            jobs = build_jobs(config, release_spec)
        except FileNotFoundError as exc:
            logger.error("UPLOAD", str(exc))
            return False

        total_size = sum(j.file_size for j in jobs)
        logger.info(
            "UPLOAD",
            "Found %d locales (%s total)",
            len(jobs),
            format_size(total_size),
        )

        if jobs:
            logger.info(
                "UPLOAD",
                "Order (smallest-first): %s (%s) -> ... -> %s (%s)",
                jobs[0].locale,
                format_size(jobs[0].file_size),
                jobs[-1].locale,
                format_size(jobs[-1].file_size),
            )

        # Initialize MDC client
        client = MDCClient(config.mdc_api_key, config.mdc_api_url) if not config.dry_run else None

        # Process locales with batch progress bar
        progress = batch_progress(len(jobs))
        for i, job in enumerate(jobs, 1):
            result = process_locale(job, client, config.dry_run, config.base_dir)
            state.record(result)

            status_label = result.status.upper()
            if result.status == "success":
                logger.info(
                    "UPLOAD",
                    "[%d/%d] %s -- %s (%s in %.1fs)",
                    i,
                    len(jobs),
                    result.locale,
                    status_label,
                    format_size(result.size_bytes),
                    result.duration_seconds,
                )
            elif result.status == "failed":
                logger.error(
                    "UPLOAD",
                    "[%d/%d] %s -- FAILED: %s",
                    i,
                    len(jobs),
                    result.locale,
                    result.error,
                )
            elif result.status == "skipped":
                logger.info(
                    "UPLOAD",
                    "[%d/%d] %s -- SKIPPED (dry run)",
                    i,
                    len(jobs),
                    result.locale,
                )

            progress.update(1)

        progress.close()

        # Summary
        print_summary(state)

        _, failed, _ = state.summary()
        return failed == 0
    finally:
        # Persist logs to GCS so they survive pod recycling.
        # Runs on all exit paths including early errors.
        save_logs_to_storage(config.base_dir, config.release_name, state)
