"""MDC SDK wrapper with retry and 429 handling."""

from __future__ import annotations

import os
import re
from typing import Any

from datacollective import (
    DatasetSubmission,
    License,
    Task,
    create_submission_draft,
    submit_submission,
    update_submission,
    upload_dataset_file,
)
from tenacity import (
    RetryCallState,
    retry,
    retry_if_exception,
    stop_after_attempt,
)

from mdc_uploader.constants import (
    DESCRIPTIONS,
    FORBIDDEN_USAGE,
    INTENDED_USAGE,
    MAX_RETRY_AFTER_SECONDS,
    POINT_OF_CONTACT_EMAIL,
    POINT_OF_CONTACT_NAME,
    RESTRICTIONS,
)
from mdc_uploader.log import logger
from mdc_uploader.models import ReleaseSpec

# -- 429 / transient error detection ------------------------------------------


class RateLimitError(Exception):
    """Raised when MDC returns 429 with a Retry-After header."""

    def __init__(self, retry_after: int, message: str = "") -> None:
        self.retry_after = retry_after
        super().__init__(message or f"429 Too Many Requests (Retry-After: {retry_after}s)")


class TransientError(Exception):
    """Wraps transient errors (5xx, connection) for retry."""


def _is_retryable(exc: BaseException) -> bool:
    """Return True for errors worth retrying."""
    if isinstance(exc, RateLimitError):
        return exc.retry_after <= MAX_RETRY_AFTER_SECONDS
    return isinstance(exc, (TransientError, ConnectionError, TimeoutError, OSError))


def _wait_for_retry(retry_state: RetryCallState) -> float:
    """Custom wait: use Retry-After for 429s, exponential for others."""
    outcome = retry_state.outcome
    exc = outcome.exception() if outcome else None
    if isinstance(exc, RateLimitError):
        wait_time = float(exc.retry_after)
        logger.warning(
            "MDC",
            "Rate limited -- waiting %ds (Retry-After)",
            exc.retry_after,
        )
        return wait_time
    # Exponential backoff: 10s, 30s, 90s
    attempt = int(retry_state.attempt_number)
    wait: float = min(10.0 * (3 ** (attempt - 1)), 90.0)
    return wait


# -- License mapping ----------------------------------------------------------

LICENSE_MAP: dict[str, License] = {
    "CC0_1_0": License.CC0_1_0,
    "CC-BY 4.0": License.CC_BY_4_0,
    "CC_BY_4_0": License.CC_BY_4_0,
}


# -- MDC client ----------------------------------------------------------------


class MDCClient:
    """Wraps datacollective SDK functions with retry logic."""

    def __init__(self, api_key: str, api_url: str) -> None:
        # The datacollective SDK reads these env vars
        os.environ["MDC_API_KEY"] = api_key
        os.environ["MDC_API_URL"] = api_url
        self.api_url = api_url

    def build_submission(
        self,
        release_spec: ReleaseSpec,
        english_name: str,
        native_name: str,
        locale: str,
        license_name: str | None,
        datasheet_text: str,
    ) -> DatasetSubmission:
        """Build a DatasetSubmission with all metadata fields."""
        modality_key = release_spec.modality.value
        modality_display = release_spec.modality_display
        version = release_spec.version

        descs = DESCRIPTIONS[modality_key]
        short_desc = descs["short"].format(english=english_name)
        long_desc = descs["long"].format(english=english_name, native=native_name)

        # Resolve license enum
        license_enum = License.CC0_1_0
        if license_name and license_name in LICENSE_MAP:
            license_enum = LICENSE_MAP[license_name]

        name = f"Common Voice {modality_display} {version} - {english_name}"

        return DatasetSubmission(
            name=name,
            shortDescription=short_desc,
            longDescription=long_desc,
            task=Task.ASR,
            licenseAbbreviation=license_enum,
            locale=locale,
            format="MP3",
            forbiddenUsage=FORBIDDEN_USAGE,
            intendedUsage=INTENDED_USAGE,
            restrictions=RESTRICTIONS,
            other=datasheet_text or "No datasheet available for this release.",
            pointOfContactFullName=POINT_OF_CONTACT_NAME,
            pointOfContactEmail=POINT_OF_CONTACT_EMAIL,
            agreeToSubmit=True,
        )

    @retry(
        retry=retry_if_exception(_is_retryable),
        wait=_wait_for_retry,
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _create_draft(self, submission: DatasetSubmission) -> dict[str, Any]:
        """Create a submission draft. Retries on transient errors."""
        try:
            result: dict[str, Any] = create_submission_draft(submission)
            return result
        except Exception as exc:
            raise _wrap_exception(exc) from exc

    @retry(
        retry=retry_if_exception(_is_retryable),
        wait=_wait_for_retry,
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _upload_file(self, file_path: str, submission_id: str) -> Any:
        """Upload a file to an existing submission. Retries on transient errors."""
        try:
            return upload_dataset_file(
                file_path=file_path,
                submission_id=submission_id,
            )
        except Exception as exc:
            raise _wrap_exception(exc) from exc

    @retry(
        retry=retry_if_exception(_is_retryable),
        wait=_wait_for_retry,
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _update(self, submission_id: str, submission: DatasetSubmission) -> Any:
        """Update submission metadata. Retries on transient errors."""
        try:
            return update_submission(
                submission_id=submission_id,
                submission=submission,
            )
        except Exception as exc:
            raise _wrap_exception(exc) from exc

    @retry(
        retry=retry_if_exception(_is_retryable),
        wait=_wait_for_retry,
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _submit(self, submission_id: str) -> Any:
        """Finalize a submission. Retries on transient errors."""
        try:
            return submit_submission(
                submission_id=submission_id,
                submission=DatasetSubmission(agreeToSubmit=True),
            )
        except Exception as exc:
            raise _wrap_exception(exc) from exc

    def create_and_upload(
        self,
        file_path: str,
        submission: DatasetSubmission,
    ) -> tuple[str, bool]:
        """Full new-submission flow: draft -> upload -> update -> submit.

        Returns (submission_id, success).
        If draft is created but later steps fail, logs orphaned draft.
        """
        submission_id: str | None = None
        try:
            # Step 1: Create draft
            draft = self._create_draft(
                DatasetSubmission(
                    name=submission.name,
                    longDescription=submission.longDescription,
                    agreeToSubmit=True,
                )
            )
            submission_id = draft["submission"]["id"]
            assert isinstance(submission_id, str), "API returned non-string submission ID"
            logger.info("MDC", "Created draft submission %s", submission_id)

            # Step 2: Upload file
            upload_state = self._upload_file(file_path, submission_id)
            file_id = getattr(upload_state, "fileUploadId", "?")
            logger.info("MDC", "Upload complete (file upload ID: %s)", file_id)

            # Step 3: Update metadata
            self._update(submission_id, submission)
            logger.debug("MDC", "Metadata updated for %s", submission_id)

            # Step 4: Submit
            response = self._submit(submission_id)
            status = response.get("submission", {}).get("status", "unknown")
            logger.info("MDC", "Submitted %s -- status: %s", submission_id, status)

            return submission_id, True

        except Exception as exc:
            if submission_id:
                logger.error(
                    "MDC",
                    "Failed after draft creation -- orphaned draft: %s (error: %s)",
                    submission_id,
                    exc,
                )
                raise OrphanedDraftError(submission_id, str(exc)) from exc
            raise

    def upload_new_version(self, file_path: str, submission_id: str) -> bool:
        """Upload a new file version to an existing dataset."""
        self._upload_file(file_path, submission_id)
        logger.info("MDC", "New version uploaded to %s", submission_id)
        return True


class OrphanedDraftError(Exception):
    """Raised when a draft was created but the upload/submit failed."""

    def __init__(self, submission_id: str, message: str) -> None:
        self.submission_id = submission_id
        super().__init__(f"Orphaned draft {submission_id}: {message}")


def _wrap_exception(exc: Exception) -> Exception:
    """Wrap SDK exceptions into retryable categories."""
    exc_str = str(exc).lower()
    # Check for 429
    if "429" in exc_str or "too many requests" in exc_str or "rate limit" in exc_str:
        # Try to extract Retry-After value
        retry_after = 60  # default
        match = re.search(r"retry.after[:\s]+(\d+)", exc_str, re.IGNORECASE)
        if match:
            retry_after = int(match.group(1))
        return RateLimitError(retry_after, str(exc))
    # Check for transient server errors
    if any(code in exc_str for code in ("500", "502", "503", "504", "timeout", "connection")):
        return TransientError(str(exc))
    # Non-retryable
    return exc
