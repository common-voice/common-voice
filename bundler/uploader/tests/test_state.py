"""Tests for state.py -- BatchState and load_state_for_retry."""

from __future__ import annotations

import json

import pytest

from mdc_uploader.models import UploadResult
from mdc_uploader.state import BatchState, load_state_for_retry


class TestBatchState:
    """Tests for BatchState recording and summary."""

    def test_record_success(self, tmp_path: object) -> None:
        """Successful result is recorded correctly."""
        state = BatchState("cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs")
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
        assert state.locales["en"]["submission_id"] == "sub-123"

    def test_record_failed_with_error(self) -> None:
        """Failed result includes error message."""
        state = BatchState("cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs")
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
        assert state.locales["de"]["error"] == "Connection timeout"

    def test_record_orphaned_draft(self) -> None:
        """Orphaned draft is tracked in state."""
        state = BatchState("cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs")
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

        assert state.locales["fr"]["orphaned_draft"] is True
        assert state.locales["fr"]["submission_id"] == "orphan-456"

    def test_summary_counts(self) -> None:
        """Summary returns correct success/failed/skipped counts."""
        state = BatchState("cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs")

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

    def test_flush_writes_json(self) -> None:
        """State is flushed to JSON after each record."""
        state = BatchState("cv-corpus-25.0-2026-03-09", "dev", "full", "/gcs")
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
