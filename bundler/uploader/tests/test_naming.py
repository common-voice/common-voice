"""Tests for naming.py -- release parsing and path construction."""

from unittest.mock import patch

import pytest

from mdc_uploader.models import Modality, ReleaseType
from mdc_uploader.naming import (
    datasheet_path,
    detect_locales,
    mdc_dataset_name,
    parse_release_name,
    sanitize_license_name,
    tarball_dir,
    tarball_filename,
    tarball_path,
)

REL_SCS = "cv-corpus-25.0-2026-03-09"
REL_SPS = "sps-corpus-3.0-2026-03-09"
REL_SCS_DELTA = "cv-corpus-25.0-delta-2026-03-09"
REL_SPS_DELTA = "sps-corpus-3.0-delta-2026-03-09"


class TestParseReleaseName:
    """Tests for parse_release_name."""

    def test_scs_release(self):
        """SCS release name is parsed correctly."""
        spec = parse_release_name(REL_SCS)
        assert spec.modality == Modality.SCS
        assert spec.version == "25.0"
        assert spec.date == "2026-03-09"
        assert spec.release_name == REL_SCS
        assert spec.prefix == "cv-corpus"
        assert spec.modality_display == "Scripted Speech"
        assert spec.datasheet_prefix == "cv-datasheet"
        assert spec.is_delta is False

    def test_sps_release(self):
        """SPS release name is parsed correctly."""
        spec = parse_release_name(REL_SPS)
        assert spec.modality == Modality.SPS
        assert spec.version == "3.0"
        assert spec.date == "2026-03-09"
        assert spec.prefix == "sps-corpus"
        assert spec.modality_display == "Spontaneous Speech"
        assert spec.datasheet_prefix == "sps-datasheet"
        assert spec.is_delta is False

    def test_scs_delta(self):
        """SCS delta release name is parsed correctly."""
        spec = parse_release_name(REL_SCS_DELTA)
        assert spec.modality == Modality.SCS
        assert spec.version == "25.0"
        assert spec.date == "2026-03-09"
        assert spec.release_name == REL_SCS_DELTA
        assert spec.is_delta is True

    def test_sps_delta(self):
        """SPS delta release name is parsed correctly."""
        spec = parse_release_name(REL_SPS_DELTA)
        assert spec.modality == Modality.SPS
        assert spec.version == "3.0"
        assert spec.date == "2026-03-09"
        assert spec.is_delta is True

    def test_invalid_release(self):
        """Invalid release name raises ValueError."""
        with pytest.raises(ValueError, match="Invalid release name"):
            parse_release_name("bad-name-1.0")

    def test_missing_date(self):
        """Release name without date raises ValueError."""
        with pytest.raises(ValueError):
            parse_release_name("cv-corpus-25.0")


class TestSanitizeLicenseName:
    """Tests for sanitize_license_name."""

    def test_cc_by_4_0(self):
        """Dot is preserved -- matches bundler's compress.ts regex."""
        assert sanitize_license_name("CC-BY 4.0") == "CC-BY_4.0"

    def test_cc0(self):
        """CC0 license is sanitized correctly."""
        assert sanitize_license_name("CC0 1.0") == "CC0_1.0"

    def test_special_chars(self):
        """All special characters are replaced with underscore."""
        assert sanitize_license_name('a/b\\c:d*e?"f<g>h|i') == "a_b_c_d_e__f_g_h_i"


class TestTarballDir:
    """Tests for tarball_dir."""

    def test_full(self):
        """Full release uses bare release name as directory."""
        assert tarball_dir(REL_SCS, ReleaseType.FULL) == REL_SCS

    def test_delta(self):
        """Delta release uses bare release name (name already has -delta-)."""
        assert tarball_dir(REL_SCS_DELTA, ReleaseType.DELTA) == REL_SCS_DELTA

    def test_delta_licensed(self):
        """Delta + licensed appends -licensed to the delta release name."""
        assert tarball_dir(REL_SCS_DELTA, ReleaseType.LICENSED) == f"{REL_SCS_DELTA}-licensed"

    def test_licensed(self):
        """Licensed release appends -licensed suffix."""
        assert tarball_dir(REL_SCS, ReleaseType.LICENSED) == f"{REL_SCS}-licensed"

    def test_variants(self):
        """Variants release appends -variants suffix."""
        assert tarball_dir(REL_SCS, ReleaseType.VARIANTS) == f"{REL_SCS}-variants"


class TestTarballFilename:
    """Tests for tarball_filename."""

    def test_unlicensed(self):
        """Unlicensed tarball uses {release}-{locale}.tar.gz."""
        assert tarball_filename("en", REL_SCS) == f"{REL_SCS}-en.tar.gz"

    def test_licensed(self):
        """Licensed tarball appends sanitized license name."""
        assert tarball_filename("en", REL_SCS, "CC-BY 4.0") == f"{REL_SCS}-en-CC-BY_4.0.tar.gz"

    def test_compound_locale(self):
        """Compound locale codes (ga-IE) are preserved."""
        assert tarball_filename("ga-IE", REL_SPS) == f"{REL_SPS}-ga-IE.tar.gz"


class TestTarballPath:
    """Tests for tarball_path."""

    def test_full_scs(self):
        """Full SCS tarball path is correct."""
        result = tarball_path("/gcs", REL_SCS, "en", ReleaseType.FULL)
        assert result == f"/gcs/{REL_SCS}/{REL_SCS}-en.tar.gz"

    def test_licensed_scs(self):
        """Licensed SCS tarball path includes -licensed dir and license suffix."""
        result = tarball_path("/gcs", REL_SCS, "en", ReleaseType.LICENSED, "CC-BY 4.0")
        expected = f"/gcs/{REL_SCS}-licensed/{REL_SCS}-en-CC-BY_4.0.tar.gz"
        assert result == expected

    def test_variants_scs(self):
        """Variants SCS tarball path includes -variants dir."""
        result = tarball_path("/gcs", REL_SCS, "cy-southwes", ReleaseType.VARIANTS)
        expected = f"/gcs/{REL_SCS}-variants/{REL_SCS}-cy-southwes.tar.gz"
        assert result == expected

    def test_full_sps(self):
        """Full SPS tarball path is correct."""
        result = tarball_path("/gcs", REL_SPS, "ga-IE", ReleaseType.FULL)
        assert result == f"/gcs/{REL_SPS}/{REL_SPS}-ga-IE.tar.gz"


class TestDatasheetPath:
    """Tests for datasheet_path."""

    def test_scs_unlicensed(self):
        """SCS unlicensed datasheet path is correct."""
        spec = parse_release_name(REL_SCS)
        result = datasheet_path("/gcs", spec, "en")
        expected = f"/gcs/{REL_SCS}/datasheets/cv-datasheet-25.0-en.md"
        assert result == expected

    def test_scs_licensed(self):
        """SCS licensed datasheet includes sanitized license."""
        spec = parse_release_name(REL_SCS)
        result = datasheet_path("/gcs", spec, "en", "CC-BY 4.0")
        expected = f"/gcs/{REL_SCS}/datasheets/cv-datasheet-25.0-en-CC-BY_4.0.md"
        assert result == expected

    def test_sps(self):
        """SPS datasheet path uses sps-datasheet prefix."""
        spec = parse_release_name(REL_SPS)
        result = datasheet_path("/gcs", spec, "ga-IE")
        expected = f"/gcs/{REL_SPS}/datasheets/sps-datasheet-3.0-ga-IE.md"
        assert result == expected


class TestDetectLocales:
    """Tests for detect_locales (registry-first approach)."""

    @patch("mdc_uploader.language.all_codes")
    def test_detects_and_sorts_by_size(self, mock_all_codes, tmp_path):
        """Auto-detected locales are sorted smallest-first."""
        mock_all_codes.return_value = ["en", "mt", "de", "fr"]

        release_dir = tmp_path / REL_SCS
        release_dir.mkdir()

        (release_dir / f"{REL_SCS}-en.tar.gz").write_bytes(b"x" * 1000)
        (release_dir / f"{REL_SCS}-mt.tar.gz").write_bytes(b"x" * 10)
        (release_dir / f"{REL_SCS}-de.tar.gz").write_bytes(b"x" * 500)
        # fr has no tarball -- should be skipped

        locales = detect_locales(str(tmp_path), REL_SCS, ReleaseType.FULL)
        assert locales == ["mt", "de", "en"]

    @patch("mdc_uploader.language.all_codes")
    def test_empty_dir_raises(self, mock_all_codes, tmp_path):
        """No matching tarballs raises FileNotFoundError."""
        mock_all_codes.return_value = ["en", "de"]
        (tmp_path / REL_SCS).mkdir()

        with pytest.raises(FileNotFoundError, match="No tarballs found"):
            detect_locales(str(tmp_path), REL_SCS, ReleaseType.FULL)

    @patch("mdc_uploader.language.all_codes")
    def test_licensed_locales_detected(self, mock_all_codes, tmp_path):
        """Licensed tarballs are found using constructed paths (no suffix parsing)."""
        mock_all_codes.return_value = ["en", "ga-IE"]

        release_dir = tmp_path / f"{REL_SCS}-licensed"
        release_dir.mkdir()

        (release_dir / f"{REL_SCS}-en-CC-BY_4.0.tar.gz").write_bytes(b"x" * 500)
        (release_dir / f"{REL_SCS}-ga-IE-CC-BY_4.0.tar.gz").write_bytes(b"x" * 100)

        locales = detect_locales(
            str(tmp_path), REL_SCS, ReleaseType.LICENSED, license_name="CC-BY 4.0"
        )
        assert locales == ["ga-IE", "en"]

    @patch("mdc_uploader.language.all_codes")
    def test_only_existing_tarballs_returned(self, mock_all_codes, tmp_path):
        """Locales without tarballs are excluded."""
        mock_all_codes.return_value = ["en", "de", "fr", "mt"]

        release_dir = tmp_path / REL_SCS
        release_dir.mkdir()

        (release_dir / f"{REL_SCS}-en.tar.gz").write_bytes(b"x" * 100)
        # de, fr, mt have no tarballs

        locales = detect_locales(str(tmp_path), REL_SCS, ReleaseType.FULL)
        assert locales == ["en"]


class TestMdcDatasetName:
    """Tests for mdc_dataset_name."""

    def test_scs(self):
        """SCS dataset name is formatted correctly."""
        result = mdc_dataset_name("Scripted Speech", "25.0", "English")
        assert result == "Common Voice Scripted Speech 25.0 - English"

    def test_sps(self):
        """SPS dataset name is formatted correctly."""
        result = mdc_dataset_name("Spontaneous Speech", "3.0", "Irish")
        assert result == "Common Voice Spontaneous Speech 3.0 - Irish"
