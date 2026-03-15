"""Configuration for the MDC uploader."""

from __future__ import annotations

from dataclasses import dataclass

from mdc_uploader.constants import DEFAULT_BASE_DIR, MDC_API_URLS
from mdc_uploader.models import ReleaseType
from mdc_uploader.typedef import MDCTarget


@dataclass(frozen=True)
class UploaderConfig:
    """Resolved configuration for an upload run."""

    release_name: str
    upload_target: MDCTarget
    mdc_api_url: str
    mdc_api_key: str
    base_dir: str
    release_type: ReleaseType
    locales: list[str] | None  # None = auto-detect
    submission_id: str | None  # None = new submission mode
    dry_run: bool
    verbose: bool

    @classmethod
    def from_cli(  # pylint: disable=too-many-arguments
        cls,
        *,
        release: str,
        upload_target: MDCTarget,
        base_dir: str | None,
        release_type: str,
        locales: str | None,
        submission_id: str | None,
        dry_run: bool,
        verbose: bool,
        mdc_api_key: str,
        mdc_api_url: str | None,
    ) -> UploaderConfig:
        """Build config from CLI args and environment variables."""
        resolved_url = mdc_api_url or MDC_API_URLS[upload_target]
        resolved_base_dir = base_dir or DEFAULT_BASE_DIR
        locale_list = [loc.strip() for loc in locales.split() if loc.strip()] if locales else None

        return cls(
            release_name=release,
            upload_target=upload_target,
            mdc_api_url=resolved_url,
            mdc_api_key=mdc_api_key,
            base_dir=resolved_base_dir,
            release_type=ReleaseType(release_type),
            locales=locale_list,
            submission_id=submission_id,
            dry_run=dry_run,
            verbose=verbose,
        )
