"""Tests for pipeline.py with mocked MDC client."""

import os
from unittest.mock import MagicMock, patch

import pytest

from mdc_uploader.config import UploaderConfig
from mdc_uploader.mdc import OrphanedDraftError
from mdc_uploader.models import LocaleUploadJob, ReleaseType
from mdc_uploader.naming import parse_release_name
from mdc_uploader.pipeline import (
    _preserve_sdk_state_local,
    _resolve_file_and_datasheet,
    _sdk_state_path,
    _try_fadvise,
    build_jobs,
    process_locale,
    run_batch,
)


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


class TestTryFadvise:
    """Tests for _try_fadvise helper and its integration points."""

    def test_calls_posix_fadvise_and_closes_fd(self, tmp_path):
        """posix_fadvise is called with correct args; fd is always closed."""
        f = tmp_path / "data.bin"
        f.write_bytes(b"x" * 64)

        with patch("mdc_uploader.pipeline.os", spec=os) as mock_os:
            mock_os.open.return_value = 42
            advice = os.POSIX_FADV_DONTNEED
            _try_fadvise(str(f), advice)

            mock_os.open.assert_called_once_with(str(f), mock_os.O_RDONLY)
            mock_os.posix_fadvise.assert_called_once_with(42, 0, 0, advice)
            mock_os.close.assert_called_once_with(42)

    def test_closes_fd_on_oserror(self, tmp_path):
        """fd is closed even when posix_fadvise raises OSError."""
        f = tmp_path / "data.bin"
        f.write_bytes(b"x" * 64)

        with patch("mdc_uploader.pipeline.os", spec=os) as mock_os:
            mock_os.open.return_value = 42
            mock_os.posix_fadvise.side_effect = OSError("EINVAL")

            _try_fadvise(str(f), os.POSIX_FADV_SEQUENTIAL)

            mock_os.close.assert_called_once_with(42)

    def test_noop_when_posix_fadvise_missing(self, tmp_path):
        """No crash when posix_fadvise is unavailable (e.g. Windows)."""
        f = tmp_path / "data.bin"
        f.write_bytes(b"x" * 64)

        with patch("mdc_uploader.pipeline.os", spec=os) as mock_os:
            del mock_os.posix_fadvise

            _try_fadvise(str(f), 0)

            mock_os.open.assert_not_called()

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    @patch("mdc_uploader.pipeline._try_fadvise")
    def test_process_locale_calls_sequential_hint(
        self, mock_fadvise, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """process_locale calls _try_fadvise(SEQUENTIAL) before upload."""
        tarball = tmp_path / "test-br.tar.gz"
        tarball.write_bytes(b"x" * 100)
        spec = parse_release_name("sps-corpus-3.0-2026-03-09")
        job = LocaleUploadJob(
            locale="br", release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path=str(tarball), datasheet_path=None, file_size=100,
        )

        mock_resolve.return_value = (str(tarball), "", None)
        mock_is_gcs.return_value = False
        mock_lang.find.return_value = {
            "code": "br", "english_name": "Breton",
            "native_name": "Brezhoneg",
        }
        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.create_and_upload.return_value = ("sub-1", True)

        result = process_locale(job, mock_client, dry_run=False)

        assert result.status == "success"
        mock_fadvise.assert_called_once_with(
            str(tarball), os.POSIX_FADV_SEQUENTIAL,
        )

    @patch("mdc_uploader.pipeline._try_fadvise")
    def test_resolve_gcs_calls_dontneed_hint(
        self, mock_fadvise,
    ) -> None:
        """_resolve_file_and_datasheet calls _try_fadvise(DONTNEED) after GCS download."""
        spec = parse_release_name("sps-corpus-3.0-2026-03-09")
        job = LocaleUploadJob(
            locale="br", release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path="tarballs/test-br.tar.gz",
            datasheet_path=None, file_size=100,
        )

        mock_blob = MagicMock()
        mock_blob.exists.return_value = True
        mock_blob.download_to_filename = MagicMock()

        mock_bucket = MagicMock()
        mock_bucket.blob.return_value = mock_blob

        mock_gcs_client = MagicMock()
        mock_gcs_client.bucket.return_value = mock_bucket

        with patch("mdc_uploader.pipeline._parse_gcs_uri", return_value=("bucket", "prefix")), \
             patch("mdc_uploader.pipeline.is_gcs_uri", return_value=True), \
             patch("google.cloud.storage.Client", return_value=mock_gcs_client):
            result_path, _, error = _resolve_file_and_datasheet(
                job, "gs://bucket/prefix",
            )

        assert error is None
        assert result_path is not None
        mock_fadvise.assert_called_once()
        call_args = mock_fadvise.call_args
        assert call_args[0][1] == os.POSIX_FADV_DONTNEED


class TestResumeProcessLocale:
    """Tests for --resume branch in process_locale."""

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    @patch("mdc_uploader.pipeline._try_fadvise")
    def test_resume_success(
        self, mock_fadvise, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """Resume mode calls resume_and_upload and returns success."""
        tarball = tmp_path / "test-fr.tar.gz"
        tarball.write_bytes(b"x" * 200)
        spec = parse_release_name("cv-corpus-25.0-2026-03-09")
        state_file = str(tmp_path / "mdc-upload-fr.json")

        job = LocaleUploadJob(
            locale="fr", release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path=str(tarball), datasheet_path=None, file_size=200,
            resume_state_path=state_file,
            resume_submission_id="sub-resume",
        )

        mock_resolve.return_value = (str(tarball), "# Datasheet", None)
        mock_is_gcs.return_value = False
        mock_lang.find.return_value = {
            "code": "fr", "english_name": "French", "native_name": "Fran\u00e7ais",
        }
        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.resume_and_upload.return_value = ("sub-resume", True)

        result = process_locale(job, mock_client, dry_run=False)

        assert result.status == "success"
        assert result.submission_id == "sub-resume"
        mock_client.resume_and_upload.assert_called_once_with(
            file_path=str(tarball),
            submission=mock_client.build_submission.return_value,
            resume_state_path=state_file,
            submission_id="sub-resume",
        )
        # Should NOT call create_and_upload
        mock_client.create_and_upload.assert_not_called()

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    def test_resume_missing_tarball_fails(
        self, mock_resolve, mock_is_gcs, mock_lang,
    ) -> None:
        """Resume mode with missing tarball returns failed result."""
        spec = parse_release_name("cv-corpus-25.0-2026-03-09")
        job = LocaleUploadJob(
            locale="fr", release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path="/nonexistent.tar.gz", datasheet_path=None, file_size=0,
            resume_state_path="/state/mdc-upload-fr.json",
            resume_submission_id="sub-resume",
        )

        mock_resolve.return_value = (None, "", "Tarball not found")
        mock_is_gcs.return_value = False
        mock_lang.find.return_value = {
            "code": "fr", "english_name": "French", "native_name": "Fran\u00e7ais",
        }

        result = process_locale(job, MagicMock(), dry_run=False)

        assert result.status == "failed"
        assert "not found" in result.error.lower()
        assert result.attempts == 0

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    @patch("mdc_uploader.pipeline._try_fadvise")
    def test_resume_failure_returns_orphaned_result(
        self, mock_fadvise, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """Resume upload failure produces orphaned_draft result."""
        tarball = tmp_path / "test-fr.tar.gz"
        tarball.write_bytes(b"x" * 200)
        spec = parse_release_name("cv-corpus-25.0-2026-03-09")

        job = LocaleUploadJob(
            locale="fr", release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path=str(tarball), datasheet_path=None, file_size=200,
            resume_state_path="/state/mdc-upload-fr.json",
            resume_submission_id="sub-resume",
        )

        mock_resolve.return_value = (str(tarball), "", None)
        mock_is_gcs.return_value = False
        mock_lang.find.return_value = {
            "code": "fr", "english_name": "French", "native_name": "Fran\u00e7ais",
        }
        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.resume_and_upload.side_effect = OrphanedDraftError(
            "sub-resume", "resume failed", file_upload_id="fup-partial",
        )

        result = process_locale(job, mock_client, dry_run=False)

        assert result.status == "failed"
        assert result.orphaned_draft is True
        assert result.submission_id == "sub-resume"
        assert result.file_upload_id == "fup-partial"

    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.is_gcs_uri")
    @patch("mdc_uploader.pipeline._resolve_file_and_datasheet")
    @patch("mdc_uploader.pipeline._try_fadvise")
    def test_resume_gcs_mode_sets_tmp_file(
        self, mock_fadvise, mock_resolve, mock_is_gcs, mock_lang, tmp_path
    ) -> None:
        """In GCS mode, resume sets tmp_file for cleanup."""
        tmp_dir = tmp_path / "gcs_tmp"
        tmp_dir.mkdir()
        tarball = tmp_dir / "cv-corpus-25.0-2026-03-09-fr.tar.gz"
        tarball.write_bytes(b"x" * 200)
        spec = parse_release_name("cv-corpus-25.0-2026-03-09")

        job = LocaleUploadJob(
            locale="fr", release_spec=spec,
            release_type=ReleaseType.FULL,
            tarball_path=str(tarball), datasheet_path=None, file_size=200,
            resume_state_path="/state/mdc-upload-fr.json",
            resume_submission_id="sub-resume",
        )

        mock_resolve.return_value = (str(tarball), "", None)
        mock_is_gcs.return_value = True
        mock_lang.find.return_value = {
            "code": "fr", "english_name": "French", "native_name": "Fran\u00e7ais",
        }
        mock_client = MagicMock()
        mock_client.build_submission.return_value = MagicMock()
        mock_client.resume_and_upload.return_value = ("sub-resume", True)

        result = process_locale(
            job, mock_client, dry_run=False, base_dir="gs://bucket"
        )

        assert result.status == "success"
        # Tarball should be cleaned up (GCS mode cleanup)
        assert not tarball.exists()


class TestSdkStatePath:
    """Tests for _sdk_state_path helper."""

    def test_local_base_dir_uses_upload_logs(self, tmp_path) -> None:
        """Local base-dir writes state to <base_dir>/<release>/upload-logs/."""
        path = _sdk_state_path(str(tmp_path), "cv-corpus-25.0-2026-03-09", "full", "fr")
        assert "upload-logs" in path
        assert path.endswith("mdc-upload-cv-corpus-25.0-2026-03-09-full-fr.json")
        assert os.path.isdir(os.path.dirname(path))

    def test_gcs_uri_falls_back_to_state_dir(self, tmp_path) -> None:
        """gs:// base-dir falls back to .state/."""
        state_dir = str(tmp_path / "state")
        with patch("mdc_uploader.pipeline.is_gcs_uri", return_value=True), \
             patch("mdc_uploader.pipeline.STATE_DIR", state_dir):
            path = _sdk_state_path("gs://bucket", "cv-corpus-25.0-2026-03-09", "full", "fr")
        assert path.startswith(state_dir)
        assert path.endswith("mdc-upload-cv-corpus-25.0-2026-03-09-full-fr.json")

    def test_empty_base_dir_falls_back_to_state_dir(self, tmp_path) -> None:
        """Empty base-dir falls back to .state/."""
        state_dir = str(tmp_path / "state")
        with patch("mdc_uploader.pipeline.STATE_DIR", state_dir):
            path = _sdk_state_path("", "cv-corpus-25.0-2026-03-09", "full", "fr")
        assert path.startswith(state_dir)

    def test_release_in_filename_prevents_collision(self, tmp_path) -> None:
        """Different releases produce different state filenames."""
        p1 = _sdk_state_path(str(tmp_path), "cv-corpus-25.0-2026-03-09", "full", "fr")
        p2 = _sdk_state_path(str(tmp_path), "cv-corpus-26.0-2026-06-15", "full", "fr")
        assert p1 != p2

    def test_release_type_in_filename_prevents_collision(self, tmp_path) -> None:
        """Different release types for same release produce different filenames."""
        p1 = _sdk_state_path(str(tmp_path), "cv-corpus-25.0-2026-03-09", "full", "fr")
        p2 = _sdk_state_path(str(tmp_path), "cv-corpus-25.0-2026-03-09", "licensed", "fr")
        assert p1 != p2


class TestPreserveSdkStateLocal:
    """Tests for _preserve_sdk_state_local fallback."""

    def test_copies_state_to_state_dir(self, tmp_path) -> None:
        """SDK state file next to tarball is copied to .state/."""
        tarball = tmp_path / "test-fr.tar.gz"
        tarball.write_bytes(b"x" * 10)
        sdk_state = tmp_path / "test-fr.tar.gz.mdc-upload.json"
        sdk_state.write_text('{"test": true}', encoding="utf-8")

        state_dir = str(tmp_path / "state_out")
        with patch("mdc_uploader.pipeline.STATE_DIR", state_dir):
            _preserve_sdk_state_local(str(tarball), "fr", "cv-corpus-25.0-2026-03-09", "full")

        dest = os.path.join(state_dir, "mdc-upload-cv-corpus-25.0-2026-03-09-full-fr.json")
        assert os.path.exists(dest)

    def test_noop_when_no_state_file(self, tmp_path) -> None:
        """No error when SDK state file doesn't exist."""
        tarball = tmp_path / "test-fr.tar.gz"
        tarball.write_bytes(b"x" * 10)

        # Should not raise
        _preserve_sdk_state_local(str(tarball), "fr", "cv-corpus-25.0-2026-03-09", "full")

    def test_oserror_is_nonfatal(self, tmp_path) -> None:
        """OSError during copy is logged but doesn't raise."""
        tarball = tmp_path / "test-fr.tar.gz"
        tarball.write_bytes(b"x" * 10)
        sdk_state = tmp_path / "test-fr.tar.gz.mdc-upload.json"
        sdk_state.write_text('{"test": true}', encoding="utf-8")

        # Point to a non-writable dir
        with patch("mdc_uploader.pipeline.STATE_DIR", "/proc/nonexistent"):
            _preserve_sdk_state_local(str(tarball), "fr", "cv-corpus-25.0-2026-03-09", "full")
        # Should not raise


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
        assert not os.path.exists(state_file), "Original state file moved to .state/"
        copied = os.path.join(
            state_dir, "mdc-upload-sps-corpus-3.0-2026-03-09-full-br.json"
        )
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


class TestRunBatchConcurrency:
    """Tests for parallel execution, auto-retry, and orphaned-draft handling."""

    def _make_config(self, tmp_path, jobs=2, no_stream=False, dry_run=False):
        """Build a minimal UploaderConfig for batch tests."""
        base = str(tmp_path / "base")
        release = "cv-corpus-25.0-2026-03-09"
        release_dir = os.path.join(base, release)
        os.makedirs(release_dir, exist_ok=True)
        # Create tarballs so build_jobs finds them
        for loc in ("aa", "bb"):
            with open(
                os.path.join(release_dir, f"{release}-{loc}.tar.gz"), "wb"
            ) as f:
                f.write(b"x" * 100)

        return UploaderConfig(
            release_name=release,
            upload_target="dev",
            mdc_api_url="http://test",
            mdc_api_key="test-key",
            base_dir=base,
            release_type=ReleaseType.FULL,
            locales=["aa", "bb"],
            submission_id=None,
            dry_run=dry_run,
            verbose=False,
            jobs=jobs,
            no_stream=no_stream,
        )

    @patch("mdc_uploader.pipeline.save_logs_to_storage")
    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.process_locale")
    @patch("mdc_uploader.pipeline.build_jobs")
    @patch("mdc_uploader.pipeline.is_gcs_uri", return_value=True)
    def test_parallel_processes_all_locales(
        self, _mock_gcs, mock_build, mock_process, mock_lang, _mock_save,
        tmp_path,
    ) -> None:
        """With -j 2 and streaming, both locales are processed."""
        mock_lang.init.return_value = None
        config = self._make_config(tmp_path, jobs=2)

        from mdc_uploader.models import UploadResult

        spec = parse_release_name(config.release_name)
        mock_build.return_value = [
            LocaleUploadJob(
                locale=loc, release_spec=spec,
                release_type=ReleaseType.FULL,
                tarball_path=f"/fake/{loc}.tar.gz",
                datasheet_path=None, file_size=100,
            )
            for loc in ("aa", "bb")
        ]
        mock_process.side_effect = lambda job, *a, **kw: UploadResult(
            locale=job.locale, status="success", size_bytes=100,
            duration_seconds=0.1, attempts=1,
        )

        success = run_batch(config)

        assert success is True
        assert mock_process.call_count == 2

    @patch("mdc_uploader.pipeline.save_logs_to_storage")
    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.process_locale")
    def test_retry_on_transient_failure(
        self, mock_process, mock_lang, _mock_save, tmp_path,
    ) -> None:
        """Transient failure is retried up to 3 times."""
        mock_lang.init.return_value = None
        config = self._make_config(tmp_path, jobs=1)

        from mdc_uploader.models import UploadResult

        call_count = {"aa": 0, "bb": 0}

        def side_effect(job, *a, **kw):
            call_count[job.locale] += 1
            if job.locale == "aa" and call_count["aa"] < 3:
                return UploadResult(
                    locale=job.locale, status="failed",
                    error="transient", size_bytes=100,
                    duration_seconds=0.1, attempts=1,
                )
            return UploadResult(
                locale=job.locale, status="success",
                size_bytes=100, duration_seconds=0.1, attempts=1,
            )

        mock_process.side_effect = side_effect

        success = run_batch(config)

        assert success is True
        # aa retried 3 times (fail, fail, success), bb once
        assert call_count["aa"] == 3
        assert call_count["bb"] == 1

    @patch("mdc_uploader.pipeline.save_logs_to_storage")
    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.process_locale")
    def test_orphaned_draft_not_retried(
        self, mock_process, mock_lang, _mock_save, tmp_path,
    ) -> None:
        """OrphanedDraftError result is not retried (breaks immediately)."""
        mock_lang.init.return_value = None
        config = self._make_config(tmp_path, jobs=1)

        from mdc_uploader.models import UploadResult

        call_count = {"aa": 0, "bb": 0}

        def side_effect(job, *a, **kw):
            call_count[job.locale] += 1
            if job.locale == "aa":
                return UploadResult(
                    locale=job.locale, status="failed",
                    error="orphaned", orphaned_draft=True,
                    submission_id="sub-orphan",
                    size_bytes=100, duration_seconds=0.1, attempts=1,
                )
            return UploadResult(
                locale=job.locale, status="success",
                size_bytes=100, duration_seconds=0.1, attempts=1,
            )

        mock_process.side_effect = side_effect

        success = run_batch(config)

        assert success is False  # aa failed
        # aa called only once -- orphaned draft breaks retry loop
        assert call_count["aa"] == 1
        assert call_count["bb"] == 1

    @patch("mdc_uploader.pipeline.save_logs_to_storage")
    @patch("mdc_uploader.pipeline.language")
    @patch("mdc_uploader.pipeline.process_locale")
    def test_no_stream_forces_sequential(
        self, mock_process, mock_lang, _mock_save, tmp_path,
    ) -> None:
        """--no-stream with -j 4 still runs sequentially."""
        mock_lang.init.return_value = None
        config = self._make_config(tmp_path, jobs=4, no_stream=True)

        from mdc_uploader.models import UploadResult

        order = []

        def side_effect(job, *a, **kw):
            order.append(job.locale)
            return UploadResult(
                locale=job.locale, status="success",
                size_bytes=100, duration_seconds=0.1, attempts=1,
            )

        mock_process.side_effect = side_effect

        success = run_batch(config)

        assert success is True
        # Sequential: locales processed in order
        assert order == ["aa", "bb"]
