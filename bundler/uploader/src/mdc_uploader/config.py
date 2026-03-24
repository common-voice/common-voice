"""Configuration for the MDC uploader."""

from __future__ import annotations

import os
from dataclasses import dataclass

from mdc_uploader.constants import DEFAULT_BASE_DIR, MDC_API_URLS
from mdc_uploader.models import ReleaseType
from mdc_uploader.typedef import MDCTarget, _OrphanedSubmission


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
    # Per-locale recovery data from --retry-failed (locale -> IDs)
    orphaned_submissions: dict[str, _OrphanedSubmission] | None = None
    # SDK state file for --resume (resumes partial multipart upload)
    resume_state_path: str | None = None
    resume_submission_id: str | None = None

    def __post_init__(self) -> None:
        """Validate resume invariants."""
        has_path = self.resume_state_path is not None
        has_sid = self.resume_submission_id is not None
        if has_path != has_sid:
            raise ValueError("resume_state_path and resume_submission_id must both be set or both None")
        if has_path:
            if not self.locales or len(self.locales) != 1:
                raise ValueError("Resume mode requires exactly one locale")

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
        orphaned_submissions: dict[str, _OrphanedSubmission] | None = None,
        resume_state_path: str | None = None,
        resume_submission_id: str | None = None,
    ) -> UploaderConfig:
        """Build config from CLI args and environment variables."""
        resolved_url = mdc_api_url or MDC_API_URLS[upload_target]
        # Resolution order: --base-dir CLI > UPLOAD_BASE_DIR env (Click) >
        # gs://DATASETS_BUNDLER_BUCKET_NAME env (shared with bundler) > /gcs mount
        bundler_bucket = os.environ.get("DATASETS_BUNDLER_BUCKET_NAME")
        if base_dir:
            resolved_base_dir = base_dir
        elif bundler_bucket:
            resolved_base_dir = f"gs://{bundler_bucket}"
        else:
            resolved_base_dir = DEFAULT_BASE_DIR
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
            orphaned_submissions=orphaned_submissions,
            resume_state_path=resume_state_path,
            resume_submission_id=resume_submission_id,
        )
