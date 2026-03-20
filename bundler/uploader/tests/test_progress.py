"""Tests for progress.py -- format_size."""

from __future__ import annotations

from mdc_uploader.progress import format_size


class TestFormatSize:
    """Tests for format_size."""

    def test_bytes(self) -> None:
        """Small values shown in bytes."""
        assert format_size(0) == "0.0 B"
        assert format_size(512) == "512.0 B"

    def test_kilobytes(self) -> None:
        """KB range."""
        assert format_size(1024) == "1.0 KB"
        assert format_size(1536) == "1.5 KB"

    def test_megabytes(self) -> None:
        """MB range."""
        assert format_size(1024 * 1024) == "1.0 MB"
        assert format_size(int(1024 * 1024 * 2.5)) == "2.5 MB"

    def test_gigabytes(self) -> None:
        """GB range."""
        assert format_size(1024**3) == "1.0 GB"

    def test_terabytes(self) -> None:
        """TB range."""
        assert format_size(1024**4) == "1.0 TB"
