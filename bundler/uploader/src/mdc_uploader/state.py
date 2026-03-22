"""Batch state persistence for --retry-failed support and log storage."""

from __future__ import annotations

import json
import os
import shutil
from datetime import UTC, datetime

from mdc_uploader.log import logger
from mdc_uploader.models import UploadResult
from mdc_uploader.typedef import LocaleStateEntry, RetryStateData, _OrphanedSubmission

# Default state directory: .state/ relative to CWD.
# Override via UPLOAD_STATE_DIR env var (e.g. for containers with a specific writable path).
STATE_DIR = os.environ.get("UPLOAD_STATE_DIR", os.path.join(".", ".state"))


class BatchState:
    """Tracks per-locale upload results and persists to JSON."""

    def __init__(
        self,
        release: str,
        upload_target: str,
        release_type: str,
        base_dir: str,
        output_dir: str | None = None,
    ) -> None:
        self.release = release
        self.upload_target = upload_target
        self.release_type = release_type
        self.base_dir = base_dir
        self.started_at = datetime.now(UTC).isoformat()
        self.locales: dict[str, LocaleStateEntry] = {}
        resolved_dir = output_dir if output_dir is not None else STATE_DIR
        os.makedirs(resolved_dir, exist_ok=True)
        self._state_path = self._build_path(release, resolved_dir)

    @staticmethod
    def _build_path(release: str, output_dir: str) -> str:
        ts = datetime.now(UTC).strftime("%Y%m%dT%H%M%S%f")
        return os.path.join(output_dir, f"upload-state-{release}-{ts}.json")

    @property
    def state_path(self) -> str:
        """Path to the state JSON file."""
        return self._state_path

    def record(self, result: UploadResult) -> None:
        """Record a locale result and flush to disk."""
        entry = LocaleStateEntry(
            status=result.status,
            size_bytes=result.size_bytes,
            duration_seconds=result.duration_seconds,
            attempts=result.attempts,
        )
        if result.submission_id:
            entry["submission_id"] = result.submission_id
        if result.file_upload_id:
            entry["file_upload_id"] = result.file_upload_id
        if result.error:
            entry["error"] = result.error
        if result.orphaned_draft:
            entry["orphaned_draft"] = True
            if result.submission_id:
                entry["submission_id"] = result.submission_id
            if result.file_upload_id:
                entry["file_upload_id"] = result.file_upload_id

        self.locales[result.locale] = entry
        self._flush()

    def _flush(self) -> None:
        """Write current state to JSON file."""
        data = {
            "release": self.release,
            "upload_target": self.upload_target,
            "type": self.release_type,
            "base_dir": self.base_dir,
            "started_at": self.started_at,
            "locales": self.locales,
        }
        with open(self._state_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def summary(self) -> tuple[int, int, int]:
        """Return (success_count, failed_count, skipped_count)."""
        success = sum(1 for v in self.locales.values() if v["status"] == "success")
        failed = sum(1 for v in self.locales.values() if v["status"] == "failed")
        skipped = sum(1 for v in self.locales.values() if v["status"] == "skipped")
        return success, failed, skipped


def load_state_for_retry(path: str) -> RetryStateData:
    """Load a state file and extract config + failed locales for retry."""
    with open(path, encoding="utf-8") as f:
        data: dict[str, object] = json.load(f)

    locales_data: dict[str, dict[str, object]] = data.get("locales", {})  # type: ignore[assignment]
    failed_locales = [
        locale for locale, info in locales_data.items() if info.get("status") == "failed"
    ]

    if not failed_locales:
        raise ValueError(f"No failed locales found in {path}")

    # Extract orphaned submissions that can be recovered (steps 3+4 only)
    orphaned: dict[str, _OrphanedSubmission] = {}
    for locale, info in locales_data.items():
        if (
            info.get("status") == "failed"
            and info.get("orphaned_draft")
            and info.get("submission_id")
            and info.get("file_upload_id")
        ):
            orphaned[locale] = _OrphanedSubmission(
                submission_id=str(info["submission_id"]),
                file_upload_id=str(info["file_upload_id"]),
            )

    logger.info(
        "STATE",
        "Loaded %d failed locales from %s: %s",
        len(failed_locales),
        path,
        ", ".join(failed_locales),
    )
    if orphaned:
        logger.info(
            "STATE",
            "%d locale(s) have orphaned drafts -- will retry from step 3: %s",
            len(orphaned),
            ", ".join(orphaned),
        )

    return RetryStateData(
        release=str(data["release"]),
        upload_target=str(data.get("upload_target", data.get("target", "dev"))),
        type=str(data.get("type", "full")),
        base_dir=str(data["base_dir"]) if data.get("base_dir") else None,
        failed_locales=failed_locales,
        orphaned_submissions=orphaned,
    )


def save_logs_to_storage(
    base_dir: str,
    release_name: str,
    state: BatchState,
) -> None:
    """Save log file and state JSON to persistent storage.

    Copies to <base-dir>/<release>/upload-logs/ so they survive pod recycling.
    Non-fatal: failures are logged as warnings but do not affect the exit code.
    """
    from mdc_uploader.gcs import (  # pylint: disable=import-outside-toplevel
        gcs_upload_file,
        is_gcs_uri,
    )
    from mdc_uploader.log import (  # pylint: disable=import-outside-toplevel
        flush_all,
        get_log_file_path,
    )

    flush_all()
    log_file = get_log_file_path()
    state_file = state.state_path

    # Collect files to persist: (local_path, dest_filename)
    files_to_save: list[tuple[str, str]] = []
    if log_file and os.path.exists(log_file):
        files_to_save.append((log_file, os.path.basename(log_file)))
    if os.path.exists(state_file):
        files_to_save.append((state_file, os.path.basename(state_file)))

    if not files_to_save:
        return

    dest_dir = os.path.join(release_name, "upload-logs")

    if is_gcs_uri(base_dir):
        for local_path, filename in files_to_save:
            blob_path = f"{dest_dir}/{filename}"
            try:
                gcs_upload_file(base_dir, blob_path, local_path)
            except Exception as exc:  # pylint: disable=broad-exception-caught
                logger.warning("UPLOAD", "Failed to save %s to storage: %s", filename, exc)
    else:
        storage_dir = os.path.join(base_dir, dest_dir)
        os.makedirs(storage_dir, exist_ok=True)
        for local_path, filename in files_to_save:
            dest = os.path.join(storage_dir, filename)
            try:
                shutil.copy2(local_path, dest)
                logger.info("UPLOAD", "Log saved to %s", dest)
            except Exception as exc:  # pylint: disable=broad-exception-caught
                logger.warning("UPLOAD", "Failed to save %s: %s", filename, exc)
