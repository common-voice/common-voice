"""Tests for gcs.py -- URI parsing and GCS utilities."""

from __future__ import annotations

import pytest

from mdc_uploader.gcs import _parse_gcs_uri, _require_gcs, is_gcs_uri


class TestIsGcsUri:
    """Tests for is_gcs_uri."""

    def test_valid_gs_uri(self) -> None:
        """gs:// prefix is detected."""
        assert is_gcs_uri("gs://bucket/path") is True

    def test_gs_bucket_only(self) -> None:
        """gs:// with bucket only is valid."""
        assert is_gcs_uri("gs://my-bucket") is True

    def test_local_path(self) -> None:
        """Local paths are not GCS URIs."""
        assert is_gcs_uri("/gcs/data") is False

    def test_relative_path(self) -> None:
        """Relative paths are not GCS URIs."""
        assert is_gcs_uri("./releases") is False

    def test_empty_string(self) -> None:
        """Empty string is not a GCS URI."""
        assert is_gcs_uri("") is False

    def test_http_uri(self) -> None:
        """HTTP URIs are not GCS URIs."""
        assert is_gcs_uri("https://storage.googleapis.com/bucket") is False


class TestParseGcsUri:
    """Tests for _parse_gcs_uri."""

    def test_bucket_and_prefix(self) -> None:
        """Parses bucket and prefix from gs:// URI."""
        bucket, prefix = _parse_gcs_uri("gs://my-bucket/path/to/data")
        assert bucket == "my-bucket"
        assert prefix == "path/to/data"

    def test_bucket_only(self) -> None:
        """Bucket-only URI returns empty prefix."""
        bucket, prefix = _parse_gcs_uri("gs://my-bucket")
        assert bucket == "my-bucket"
        assert prefix == ""

    def test_bucket_with_trailing_slash(self) -> None:
        """Trailing slash in bucket gives empty-ish prefix."""
        bucket, prefix = _parse_gcs_uri("gs://my-bucket/")
        assert bucket == "my-bucket"
        assert prefix == ""

    def test_deep_prefix(self) -> None:
        """Deep nested prefix is preserved."""
        bucket, prefix = _parse_gcs_uri("gs://cv-data/releases/v25/full")
        assert bucket == "cv-data"
        assert prefix == "releases/v25/full"


class TestRequireGcs:
    """Tests for _require_gcs guard."""

    def test_raises_when_not_available(self) -> None:
        """Raises ImportError with install instructions when GCS not available."""
        import mdc_uploader.gcs as gcs_mod

        original = gcs_mod.HAS_GCS
        try:
            gcs_mod.HAS_GCS = False
            with pytest.raises(ImportError, match="pip install"):
                _require_gcs()
        finally:
            gcs_mod.HAS_GCS = original
