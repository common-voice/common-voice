"""Tests for pipeline.py with mocked MDC client."""

import os
from unittest.mock import MagicMock, patch

import pytest

from mdc_uploader.config import UploaderConfig
from mdc_uploader.mdc import OrphanedDraftError
from mdc_uploader.models import LocaleUploadJob, ReleaseType
from mdc_uploader.naming import parse_release_name
from mdc_uploader.pipeline import build_jobs, process_locale, run_batch


def _lang_entry(code: str, english: str, native: str) -> dict[str, object]:
    """Build a minimal LanguageData dict for mocking."""
    return {
        "id": 1,
        "code": code,
        "english_name": english,
        "native_name": native,
        "text_direction": "LTR",
        "variants": [],
        "predefined_accents": [],
    }


@pytest.fixture
def release_dir(tmp_path):
    """Create a test release directory with tarballs and datasheets."""
    release = "sps-corpus-3.0-2026-03-09"
    rel_dir = tmp_path / release
    rel_dir.mkdir()

    ds_dir = rel_dir / "datasheets"
    ds_dir.mkdir()

    # Create test tarballs
    (rel_dir / f"{release}-ga-IE.tar.gz").write_bytes(b"x" * 100)
    (rel_dir / f"{release}-en.tar.gz").write_bytes(b"x" * 500)
    (rel_dir / f"{release}-mt.tar.gz").write_bytes(b"x" * 50)

    # Create a datasheet
    (ds_dir / f"{release}-datasheet-ga-IE.md").write_text("# Datasheet for ga-IE", encoding="utf-8")

    return tmp_path


@pytest.fixture
def config(release_dir):
    """Create a test UploaderConfig."""
    return UploaderConfig(
        release_name="sps-corpus-3.0-2026-03-09",
        upload_target="dev",
        mdc_api_url="https://dev.datacollective.mozillafoundation.org/api",
        mdc_api_key="test-key",
        base_dir=str(release_dir),
        release_type=ReleaseType.FULL,
        locales=None,
        submission_id=None,
        dry_run=False,
        verbose=False,
    )


class TestBuildJobs:
    """Tests for job building and locale detection."""

    @patch("mdc_uploader.language.all_codes")
    def test_auto_detects_locales_sorted_by_size(self, mock_all_codes, config):
        """Auto-detected locales are sorted smallest-first."""
        mock_all_codes.return_value = ["ga-IE", "en", "mt"]

        spec = parse_release_name(config.release_name)
        jobs = build_jobs(config, spec)

        assert len(jobs) == 3
        assert jobs[0].locale == "mt"
        assert jobs[1].locale == "ga-IE"
        assert jobs[2].locale == "en"

    def test_explicit_locales(self, config, release_dir):
        """Explicit --locales restricts to those locales only."""
        explicit_config = UploaderConfig(
            release_name=config.release_name,
            upload_target=config.upload_target,
            mdc_api_url=config.mdc_api_url,
            mdc_api_key=config.mdc_api_key,
            base_dir=str(release_dir),
            release_type=ReleaseType.FULL,
            locales=["ga-IE"],
            submission_id=None,
            dry_run=False,
            verbose=False,
        )
        spec = parse_release_name(explicit_config.release_name)
        jobs = build_jobs(explicit_config, spec)

        assert len(jobs) == 1
        assert jobs[0].locale == "ga-IE"
        assert jobs[0].datasheet_path is not None

    @patch("mdc_uploader.language.all_codes")
    def test_missing_datasheet_is_none(self, mock_all_codes, config):
        """Locales without datasheets get datasheet_path=None."""
        mock_all_codes.return_value = ["ga-IE", "en", "mt"]

        spec = parse_release_name(config.release_name)
        jobs = build_jobs(config, spec)

        mt_job = next(j for j in jobs if j.locale == "mt")
        assert mt_job.datasheet_path is None


class TestProcessLocale:
    """Tests for single-locale upload processing."""

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.language.all_codes")
    def test_dry_run_skips_upload(self, mock_all_codes, mock_lang, config):
        """Dry run resolves language data but skips upload."""
        mock_all_codes.return_value = ["ga-IE", "en", "mt"]
        mock_lang.find.return_value = _lang_entry("ga-IE", "Irish", "Gaeilge")
        mock_lang.find_by_variant.return_value = None

        spec = parse_release_name(config.release_name)
        jobs = build_jobs(config, spec)
        ga_job = next(j for j in jobs if j.locale == "ga-IE")

        result = process_locale(ga_job, None, dry_run=True)

        assert result.status == "skipped"
        assert result.locale == "ga-IE"
        mock_lang.find.assert_called_once_with("ga-IE")

    @patch("mdc_uploader.pipeline.language")
    def test_missing_tarball_fails(self, mock_lang):
        """Missing tarball produces a failed result."""
        mock_lang.find.return_value = _lang_entry("xx", "Test", "Test")
        mock_lang.find_by_variant.return_value = None

        spec = parse_release_name("sps-corpus-3.0-2026-03-09")
        job = LocaleUploadJob(
            locale="xx",
            release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path="/nonexistent/path.tar.gz",
            datasheet_path=None,
            file_size=0,
        )

        result = process_locale(job, None, dry_run=False)

        assert result.status == "failed"
        assert "not found" in result.error


class TestRunBatch:
    """Tests for batch upload orchestration."""

    @patch("mdc_uploader.pipeline.language")
    def test_dry_run_succeeds(self, mock_lang, config, release_dir):
        """Dry run batch completes with success (no failures)."""
        mock_lang.find.return_value = _lang_entry("ga-IE", "Test", "Test")
        mock_lang.find_by_variant.return_value = None
        mock_lang.all_codes.return_value = ["ga-IE", "en", "mt"]
        mock_lang.init.return_value = None

        dry_config = UploaderConfig(
            release_name=config.release_name,
            upload_target=config.upload_target,
            mdc_api_url=config.mdc_api_url,
            mdc_api_key="",
            base_dir=str(release_dir),
            release_type=ReleaseType.FULL,
            locales=["ga-IE"],
            submission_id=None,
            dry_run=True,
            verbose=False,
        )

        success = run_batch(dry_config)
        assert success is True


class TestGcsTempCleanup:
    """Tests for GCS temp file preservation on failure."""

    def _make_gcs_job(
        self, tmp_path, locale: str = "br"
    ) -> tuple[LocaleUploadJob, str, str]:
        """Create a job with a real temp tarball simulating GCS download.

        Returns (job, tarball_path, tmp_dir).
        """
        # Simulate a GCS-downloaded temp directory
        tmp_dir = str(tmp_path / "gcs_tmp")
        os.makedirs(tmp_dir, exist_ok=True)
        tarball = os.path.join(tmp_dir, f"test-{locale}.tar.gz")
        with open(tarball, "wb") as f:
            f.write(b"x" * 100)

        spec = parse_release_name("sps-corpus-3.0-2026-03-09")
        job = LocaleUploadJob(
            locale=locale,
            release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path=tarball,
            datasheet_path=None,
            file_size=100,
        )
        return job, tarball, tmp_dir

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    def test_deletes_tarball_on_failure(
        self, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """On failure, temp tarball is deleted to save disk."""
        job, tarball, tmp_dir = self._make_gcs_job(tmp_path)

        mock_resolve.return_value = (tarball, "", None)
        mock_is_gcs.return_value = True
        mock_lang.find.return_value = {
            "code": "br", "english_name": "Breton",
            "native_name": "Brezhoneg",
        }

        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.create_and_upload.side_effect = RuntimeError(
            "400 Bad Request"
        )

        result = process_locale(
            job, mock_client, dry_run=False, base_dir="gs://bucket"
        )

        assert result.status == "failed"
        assert not os.path.exists(tarball), "Tarball must be deleted"

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    def test_cleans_temp_on_success(
        self, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """On success, temp tarball and dir are cleaned up."""
        job, tarball, tmp_dir = self._make_gcs_job(tmp_path)

        mock_resolve.return_value = (tarball, "", None)
        mock_is_gcs.return_value = True
        mock_lang.find.return_value = {
            "code": "br", "english_name": "Breton",
            "native_name": "Brezhoneg",
        }

        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.create_and_upload.return_value = ("sub-123", True)

        result = process_locale(
            job, mock_client, dry_run=False, base_dir="gs://bucket"
        )

        assert result.status == "success"
        assert not os.path.exists(tarball), "Tarball should be cleaned"
        assert not os.path.isdir(tmp_dir), "Temp dir should be cleaned"

    @patch("mdc_uploader.pipeline.STATE_DIR")
    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    def test_copies_mdc_state_to_state_dir_on_failure(
        self, mock_resolve, mock_is_gcs, mock_lang,
        mock_state_dir, tmp_path,
    ) -> None:
        """On failure, .mdc-upload.json is copied to .state/ with locale name."""
        state_dir = str(tmp_path / "state_out")
        mock_state_dir.__str__ = lambda _s: state_dir
        # patch the actual string value used in the function
        mock_state_dir.__fspath__ = lambda _s: state_dir

        job, tarball, tmp_dir = self._make_gcs_job(tmp_path)

        state_file = os.path.join(
            tmp_dir, f"test-{job.locale}.tar.gz.mdc-upload.json"
        )
        with open(state_file, "w", encoding="utf-8") as f:
            f.write('{"test": true}')

        mock_resolve.return_value = (tarball, "", None)
        mock_is_gcs.return_value = True
        mock_lang.find.return_value = {
            "code": "br", "english_name": "Breton",
            "native_name": "Brezhoneg",
        }

        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.create_and_upload.side_effect = RuntimeError("fail")

        with patch("mdc_uploader.pipeline.STATE_DIR", state_dir):
            process_locale(
                job, mock_client, dry_run=False, base_dir="gs://bucket"
            )

        assert not os.path.exists(tarball), "Tarball must be deleted"
        assert not os.path.exists(state_file), "Original state file removed"
        copied = os.path.join(state_dir, "mdc-upload-br.json")
        assert os.path.exists(copied), "State file copied to .state/"
        from pathlib import Path  # pylint: disable=import-outside-toplevel

        assert "test" in Path(copied).read_text(encoding="utf-8")

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    def test_orphaned_draft_captures_file_upload_id(
        self, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """OrphanedDraftError result carries file_upload_id."""
        job, tarball, _ = self._make_gcs_job(tmp_path)

        mock_resolve.return_value = (tarball, "", None)
        mock_is_gcs.return_value = True
        mock_lang.find.return_value = {
            "code": "br", "english_name": "Breton",
            "native_name": "Brezhoneg",
        }

        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.create_and_upload.side_effect = OrphanedDraftError(
            "sub-X", "metadata failed", file_upload_id="fup-X",
        )

        result = process_locale(
            job, mock_client, dry_run=False, base_dir="gs://bucket"
        )

        assert result.status == "failed"
        assert result.orphaned_draft is True
        assert result.submission_id == "sub-X"
        assert result.file_upload_id == "fup-X"
