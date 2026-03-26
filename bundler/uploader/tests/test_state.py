"""Tests for state.py -- BatchState, load_state_for_retry, save_logs_to_storage."""

from __future__ import annotations

import json
import os
from pathlib import Path
from unittest.mock import patch

import pytest

from mdc_uploader.models import UploadResult
from mdc_uploader.state import BatchState, load_state_for_retry, save_logs_to_storage


class TestBatchState:
    """Tests for BatchState recording and summary."""

    def test_record_success(self, tmp_path: object) -> None:
        """Successful result is recorded correctly."""
        state = BatchState(
            "cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs", output_dir=str(tmp_path)
        )
        result = UploadResult(
            locale="en",
            status="success",
            submission_id="sub-123",
            size_bytes=1000,
            duration_seconds=5.0,
            attempts=1,
        )
        state.record(result)

        assert state.locales["en"]["status"] == "success"
        assert state.locales["en"]["size_bytes"] == 1000
        assert state.locales["en"]["submission_id"] == "sub-123"  # type: ignore

    def test_record_failed_with_error(self, tmp_path: object) -> None:
        """Failed result includes error message."""
        state = BatchState(
            "cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs", output_dir=str(tmp_path)
        )
        result = UploadResult(
            locale="de",
            status="failed",
            size_bytes=500,
            duration_seconds=2.0,
            error="Connection timeout",
            attempts=3,
        )
        state.record(result)

        assert state.locales["de"]["status"] == "failed"
        assert state.locales["de"]["error"] == "Connection timeout"  # type: ignore

    def test_record_orphaned_draft(self, tmp_path: object) -> None:
        """Orphaned draft is tracked in state."""
        state = BatchState(
            "cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs", output_dir=str(tmp_path)
        )
        result = UploadResult(
            locale="fr",
            status="failed",
            submission_id="orphan-456",
            size_bytes=200,
            duration_seconds=3.0,
            error="Upload failed",
            orphaned_draft=True,
            attempts=3,
        )
        state.record(result)

        assert state.locales["fr"]["orphaned_draft"] is True  # type: ignore
        assert state.locales["fr"]["submission_id"] == "orphan-456"  # type: ignore

    def test_summary_counts(self, tmp_path: object) -> None:
        """Summary returns correct success/failed/skipped counts."""
        state = BatchState(
            "cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs", output_dir=str(tmp_path)
        )

        for locale, status in [
            ("en", "success"),
            ("de", "success"),
            ("fr", "failed"),
            ("mt", "skipped"),
        ]:
            state.record(
                UploadResult(
                    locale=locale, status=status, size_bytes=0, duration_seconds=0.0, attempts=1
                )
            )

        success, failed, skipped = state.summary()
        assert success == 2
        assert failed == 1
        assert skipped == 1

    def test_flush_writes_json(self, tmp_path: object) -> None:
        """State is flushed to JSON after each record."""
        state = BatchState(
            "cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs", output_dir=str(tmp_path)
        )
        state.record(
            UploadResult(
                locale="en", status="success", size_bytes=100, duration_seconds=1.0, attempts=1
            )
        )

        with open(state.state_path, encoding="utf-8") as f:
            data = json.load(f)

        assert data["release"] == "cv-corpus-25.0-2026-03-09"
        assert data["upload_target"] == "dev"
        assert data["type"] == "full"
        assert "en" in data["locales"]
        assert data["locales"]["en"]["status"] == "success"


class TestLoadStateForRetry:
    """Tests for load_state_for_retry."""

    def test_loads_failed_locales(self, tmp_path: object) -> None:
        """Extracts failed locales from state file."""
        import pathlib

        state_file = pathlib.Path(str(tmp_path)) / "state.json"
        state_data = {
            "release": "cv-corpus-25.0-2026-03-09",
            "upload_target": "dev",
            "type": "full",
            "base_dir": "/gcs",
            "locales": {
                "en": {
                    "status": "success",
                    "size_bytes": 100,
                    "duration_seconds": 1.0,
                    "attempts": 1,
                },
                "de": {
                    "status": "failed",
                    "size_bytes": 200,
                    "duration_seconds": 2.0,
                    "attempts": 3,
                    "error": "timeout",
                },
                "fr": {
                    "status": "failed",
                    "size_bytes": 300,
                    "duration_seconds": 3.0,
                    "attempts": 3,
                    "error": "500",
                },
                "mt": {
                    "status": "skipped",
                    "size_bytes": 50,
                    "duration_seconds": 0.5,
                    "attempts": 0,
                },
            },
        }
        state_file.write_text(json.dumps(state_data), encoding="utf-8")

        result = load_state_for_retry(str(state_file))

        assert result["release"] == "cv-corpus-25.0-2026-03-09"
        assert result["upload_target"] == "dev"
        assert result["type"] == "full"
        assert result["base_dir"] == "/gcs"
        assert sorted(result["failed_locales"]) == ["de", "fr"]

    def test_no_failed_raises(self, tmp_path: object) -> None:
        """Raises ValueError when no failed locales found."""
        import pathlib

        state_file = pathlib.Path(str(tmp_path)) / "state.json"
        state_data = {
            "release": "cv-corpus-25.0-2026-03-09",
            "upload_target": "dev",
            "type": "full",
            "base_dir": "/gcs",
            "locales": {
                "en": {
                    "status": "success",
                    "size_bytes": 100,
                    "duration_seconds": 1.0,
                    "attempts": 1,
                },
            },
        }
        state_file.write_text(json.dumps(state_data), encoding="utf-8")

        with pytest.raises(ValueError, match="No failed locales"):
            load_state_for_retry(str(state_file))


class TestSaveLogsToStorage:
    """Tests for save_logs_to_storage."""

    def _make_state(self, tmp_path: Path) -> BatchState:
        """Create a BatchState with one recorded result."""
        state = BatchState(
            "cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs", output_dir=str(tmp_path)
        )
        state.record(
            UploadResult(
                locale="en", status="success", size_bytes=100, duration_seconds=1.0, attempts=1
            )
        )
        return state

    def test_copies_log_and_state_to_local_dir(self, tmp_path: Path) -> None:
        """Both log file and state JSON are copied to <base-dir>/<release>/upload-logs/."""
        base_dir = str(tmp_path / "storage")
        os.makedirs(base_dir)
        state = self._make_state(tmp_path)

        # Create a fake log file and mock get_log_file_path to return it
        log_file = tmp_path / "test.log"
        log_file.write_text("some log content")

        with (
            patch("mdc_uploader.log.get_log_file_path", return_value=str(log_file)),
            patch("mdc_uploader.log.flush_all"),
        ):
            save_logs_to_storage(base_dir, "cv-corpus-25.0-2026-03-09", state)

        dest_dir = Path(base_dir) / "cv-corpus-25.0-2026-03-09" / "upload-logs"
        assert dest_dir.is_dir()
        assert (dest_dir / "test.log").read_text() == "some log content"
        assert (dest_dir / os.path.basename(state.state_path)).exists()

    def test_no_files_to_save_is_noop(self, tmp_path: Path) -> None:
        """Does nothing when log file and state file do not exist."""
        state = self._make_state(tmp_path)
        # Remove the state file so there's nothing to save
        os.unlink(state.state_path)

        with (
            patch("mdc_uploader.log.get_log_file_path", return_value=None),
            patch("mdc_uploader.log.flush_all"),
        ):
            # Should not raise
            save_logs_to_storage("/nonexistent", "cv-corpus-25.0-2026-03-09", state)

    def test_gcs_mode_uses_posix_paths(self, tmp_path: Path) -> None:
        """GCS mode calls gcs_upload_file with POSIX-style blob paths."""
        state = self._make_state(tmp_path)
        log_file = tmp_path / "test.log"
        log_file.write_text("log data")

        uploaded: list[tuple[str, str, str]] = []

        def fake_upload(
            uri: str, blob_path: str, local: str, client: object = None
        ) -> None:
            uploaded.append((uri, blob_path, local))

        mock_client = type("FakeClient", (), {})()

        with (
            patch("mdc_uploader.log.get_log_file_path", return_value=str(log_file)),
            patch("mdc_uploader.log.flush_all"),
            patch("mdc_uploader.gcs.is_gcs_uri", return_value=True),
            patch("mdc_uploader.gcs.gcs_upload_file", side_effect=fake_upload),
            patch("google.cloud.storage.Client", return_value=mock_client),
        ):
            save_logs_to_storage("gs://bucket", "cv-corpus-25.0-2026-03-09", state)

        assert len(uploaded) == 2
        for _, blob_path, _ in uploaded:
            # All path separators must be forward slashes (POSIX)
            assert "\\" not in blob_path
            assert blob_path.startswith("cv-corpus-25.0-2026-03-09/upload-logs/")

    def test_copy_failure_is_nonfatal(self, tmp_path: Path) -> None:
        """A copy failure logs a warning but does not raise."""
        state = self._make_state(tmp_path)
        log_file = tmp_path / "test.log"
        log_file.write_text("log data")

        # Point base_dir to a read-only location
        read_only_dir = str(tmp_path / "readonly")
        os.makedirs(read_only_dir)
        os.chmod(read_only_dir, 0o444)

        try:
            with (
                patch("mdc_uploader.log.get_log_file_path", return_value=str(log_file)),
                patch("mdc_uploader.log.flush_all"),
            ):
                # Should not raise despite permission error
                save_logs_to_storage(read_only_dir, "cv-corpus-25.0-2026-03-09", state)
        finally:
            os.chmod(read_only_dir, 0o755)
