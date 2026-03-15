"""Batch state persistence for --retry-failed support."""

from __future__ import annotations

import json
from datetime import UTC, datetime

from mdc_uploader.log import logger
from mdc_uploader.models import UploadResult
from mdc_uploader.typedef import LocaleStateEntry, RetryStateData


class BatchState:
    """Tracks per-locale upload results and persists to JSON."""

    def __init__(
        self,
        release: str,
        upload_target: str,
        release_type: str,
        base_dir: str,
    ) -> None:
        self.release = release
        self.upload_target = upload_target
        self.release_type = release_type
        self.base_dir = base_dir
        self.started_at = datetime.now(UTC).isoformat()
        self.locales: dict[str, LocaleStateEntry] = {}
        self._state_path = self._build_path(release)

    @staticmethod
    def _build_path(release: str) -> str:
        ts = datetime.now(UTC).strftime("%Y%m%dT%H%M%S")
        return f"upload-state-{release}-{ts}.json"

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
        if result.error:
            entry["error"] = result.error
        if result.orphaned_draft:
            entry["orphaned_draft"] = True
            entry["submission_id"] = result.submission_id or ""

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

    logger.info(
        "STATE",
        "Loaded %d failed locales from %s: %s",
        len(failed_locales),
        path,
        ", ".join(failed_locales),
    )

    return RetryStateData(
        release=str(data["release"]),
        upload_target=str(data.get("upload_target", data.get("target", "dev"))),
        type=str(data.get("type", "full")),
        base_dir=str(data["base_dir"]) if data.get("base_dir") else None,
        failed_locales=failed_locales,
    )
