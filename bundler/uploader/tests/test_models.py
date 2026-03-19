"""Tests for models.py -- enums and dataclass properties."""

from __future__ import annotations

from mdc_uploader.models import (
    LocaleUploadJob,
    Modality,
    ReleaseSpec,
    ReleaseType,
    UploadResult,
)


class TestModality:
    """Tests for Modality enum."""

    def test_values(self) -> None:
        """Modality enum has expected values."""
        assert Modality.SCS == "scs"
        assert Modality.SPS == "sps"

    def test_str_enum(self) -> None:
        """Modality is a StrEnum -- string operations work."""
        assert Modality.SCS.upper() == "SCS"
        assert f"type-{Modality.SPS}" == "type-sps"


class TestReleaseType:
    """Tests for ReleaseType enum."""

    def test_values(self) -> None:
        """ReleaseType enum has expected values."""
        assert ReleaseType.FULL == "full"
        assert ReleaseType.DELTA == "delta"
        assert ReleaseType.LICENSED == "licensed"
        assert ReleaseType.VARIANTS == "variants"

    def test_from_string(self) -> None:
        """ReleaseType can be constructed from string."""
        assert ReleaseType("full") == ReleaseType.FULL
        assert ReleaseType("delta") == ReleaseType.DELTA
        assert ReleaseType("licensed") == ReleaseType.LICENSED


class TestReleaseSpec:
    """Tests for ReleaseSpec derived properties."""

    def test_scs_properties(self) -> None:
        """SCS release spec has correct derived properties."""
        spec = ReleaseSpec(
            release_name="cv-corpus-25.0-2026-03-09",
            modality=Modality.SCS,
            version="25.0",
            date="2026-03-09",
        )
        assert spec.prefix == "cv-corpus"
        assert spec.modality_display == "Scripted Speech"
        assert spec.datasheet_prefix == "cv-datasheet"

    def test_sps_properties(self) -> None:
        """SPS release spec has correct derived properties."""
        spec = ReleaseSpec(
            release_name="sps-corpus-3.0-2026-03-09",
            modality=Modality.SPS,
            version="3.0",
            date="2026-03-09",
        )
        assert spec.prefix == "sps-corpus"
        assert spec.modality_display == "Spontaneous Speech"
        assert spec.datasheet_prefix == "sps-datasheet"

    def test_frozen(self) -> None:
        """ReleaseSpec is frozen (immutable)."""
        spec = ReleaseSpec(
            release_name="cv-corpus-25.0-2026-03-09",
            modality=Modality.SCS,
            version="25.0",
            date="2026-03-09",
        )
        import pytest

        with pytest.raises(AttributeError):
            spec.version = "26.0"  # type: ignore[misc]


class TestUploadResult:
    """Tests for UploadResult defaults."""

    def test_defaults(self) -> None:
        """UploadResult has correct defaults."""
        result = UploadResult(locale="en", status="success")
        assert result.submission_id is None
        assert result.size_bytes == 0
        assert result.duration_seconds == 0.0
        assert result.error is None
        assert result.orphaned_draft is False
        assert result.attempts == 0


class TestLocaleUploadJob:
    """Tests for LocaleUploadJob defaults."""

    def test_defaults(self) -> None:
        """LocaleUploadJob has correct optional defaults."""
        spec = ReleaseSpec(
            release_name="cv-corpus-25.0-2026-03-09",
            modality=Modality.SCS,
            version="25.0",
            date="2026-03-09",
        )
        job = LocaleUploadJob(
            locale="en",
            release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path="/gcs/test.tar.gz",
            datasheet_path=None,
            file_size=1024,
        )
        assert job.submission_id is None
        assert job.license_type is None
