"""Tests for config.py -- UploaderConfig.from_cli."""

from __future__ import annotations

from mdc_uploader.config import UploaderConfig
from mdc_uploader.models import ReleaseType


class TestUploaderConfigFromCli:
    """Tests for UploaderConfig.from_cli factory method."""

    def test_space_separated_locales(self) -> None:
        """Locales string is split on whitespace."""
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="dev",
            base_dir="/gcs",
            release_type="full",
            locales="en  de  ga-IE",
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url=None,
        )
        assert config.locales == ["en", "de", "ga-IE"]

    def test_single_locale(self) -> None:
        """Single locale string works."""
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="dev",
            base_dir=None,
            release_type="full",
            locales="en",
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url=None,
        )
        assert config.locales == ["en"]

    def test_none_locales_auto_detect(self) -> None:
        """None locales means auto-detect."""
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="dev",
            base_dir=None,
            release_type="full",
            locales=None,
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url=None,
        )
        assert config.locales is None

    def test_default_base_dir(self, monkeypatch) -> None:
        """Default base_dir is /gcs when not specified and no bucket env set."""
        monkeypatch.delenv("DATASETS_BUNDLER_BUCKET_NAME", raising=False)
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="dev",
            base_dir=None,
            release_type="full",
            locales=None,
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url=None,
        )
        assert config.base_dir == "/gcs"

    def test_custom_api_url(self) -> None:
        """Custom MDC API URL overrides the default for the target."""
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="dev",
            base_dir=None,
            release_type="full",
            locales=None,
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url="https://custom.api.example.com",
        )
        assert config.mdc_api_url == "https://custom.api.example.com"

    def test_release_type_parsing(self) -> None:
        """Release type string is parsed to ReleaseType enum."""
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="prod",
            base_dir=None,
            release_type="licensed",
            locales=None,
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url=None,
        )
        assert config.release_type == ReleaseType.LICENSED
        assert config.upload_target == "prod"

    def test_locales_trimmed(self) -> None:
        """Whitespace in locale strings is trimmed."""
        config = UploaderConfig.from_cli(
            release="cv-corpus-25.0-2026-03-09",
            upload_target="dev",
            base_dir=None,
            release_type="full",
            locales="  en   de  ",
            submission_id=None,
            dry_run=False,
            verbose=False,
            mdc_api_key="test",
            mdc_api_url=None,
        )
        assert config.locales == ["en", "de"]
