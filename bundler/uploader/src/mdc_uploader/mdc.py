"""MDC SDK wrapper with retry and 429 handling."""

from __future__ import annotations

import os
import re
from typing import Any

import datacollective.upload as _dc_upload
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

# -- Override SDK defaults -----------------------------------------------------
# Part size: 256 MB -- at 13.4 MB/s observed throughput, completes in ~19s per
# part (well within MDC's 15-min deadline). 586 parts for 150 GB max file.
# Max upload: 150 GB.
_dc_upload.DEFAULT_PART_SIZE = (  # pyright: ignore[reportAttributeAccessIssue]
    256 * 1024 * 1024  # 256 MB
)
_dc_upload.MAX_UPLOAD_BYTES = (  # pyright: ignore[reportAttributeAccessIssue]
    150 * 1000 * 1000 * 1000  # 150 GB
)

# -- 429 / transient error detection ------------------------------------------


class RateLimitError(Exception):
    """Raised when MDC returns 429 with a Retry-After header."""

    def __init__(self, retry_after: int, message: str = "") -> None:
        self.retry_after = retry_after
        super().__init__(message or f"429 Too Many Requests (Retry-After: {retry_after}s)")


class TransientError(Exception):
    """Wraps transient errors (5xx, connection) for retry."""


def _is_retryable(exc: BaseException) -> bool:
    """Return True for errors worth retrying.

    Only our custom wrapper types are retryable. All exceptions in retry-decorated
    methods go through _wrap_exception first, which wraps transient/network errors
    as TransientError. Raw SDK exceptions (e.g. requests.HTTPError for 401/403)
    inherit from OSError in Python 3, so we must NOT use isinstance(exc, OSError)
    here -- that would retry auth failures and create orphaned drafts.
    """
    if isinstance(exc, RateLimitError):
        return exc.retry_after <= MAX_RETRY_AFTER_SECONDS
    return isinstance(exc, TransientError)


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


# -- Response detail extraction ------------------------------------------------


def _extract_response_detail(exc: Exception) -> tuple[int | None, str | None]:
    """Extract HTTP status code and response body from a requests.HTTPError.

    The datacollective SDK's send_api_request() calls raise_for_status() which
    raises requests.HTTPError with the full Response attached as exc.response.
    This lets us capture the server's error detail without coupling to SDK internals.
    """
    resp = getattr(exc, "response", None)
    if resp is None:
        return None, None
    try:
        return resp.status_code, resp.text
    except (AttributeError, TypeError):  # noqa: BLE001
        return None, None


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

    def create_and_upload(
        self,
        file_path: str,
        submission: DatasetSubmission,
        state_path: str | None = None,
    ) -> tuple[str, bool]:
        """Step-by-step submission using the SDK's documented public API.

        Steps: (1) create draft, (2) upload file, (3) update metadata,
        (4) submit for review.  Each step has per-step error handling so
        we capture the submission_id and file_upload_id for recovery.

        Args:
            state_path: Where the SDK should write multipart upload state.
                        When on a GCS-backed mount this survives pod eviction.

        Returns (submission_id, success).
        """
        # Step 1: Create draft
        logger.info("MDC", "Step 1/4: Creating draft submission...")
        try:
            draft = create_submission_draft(submission)
        except Exception as exc:
            _log_step_error("Step 1/4: Draft creation failed", exc, submission)
            raise
        submission_id: str = draft.get("submission", {}).get("id", "")
        if not submission_id:
            raise RuntimeError("Draft creation did not return a submission ID")
        logger.info("MDC", "Step 1/4: Draft created (submission_id=%s)", submission_id)

        # Step 2: Upload file
        logger.info("MDC", "Step 2/4: Uploading %s...", os.path.basename(file_path))
        try:
            upload_kwargs: dict[str, str] = {
                "file_path": file_path,
                "submission_id": submission_id,
            }
            if state_path is not None:
                upload_kwargs["state_path"] = state_path
            upload_state = upload_dataset_file(**upload_kwargs)
        except Exception as exc:
            _log_step_error("Step 2/4: Upload failed", exc, submission)
            raise OrphanedDraftError(
                submission_id=submission_id,
                message=f"Upload failed: {exc}",
            ) from exc
        file_upload_id: str = upload_state.fileUploadId
        logger.info(
            "MDC",
            "Step 2/4: Upload complete (file_upload_id=%s)",
            file_upload_id,
        )

        # Steps 3+4: Update metadata and submit
        return self._finalize_submission(
            submission_id,
            file_upload_id,
            submission,
        )

    def resume_and_upload(
        self,
        file_path: str,
        submission: DatasetSubmission,
        resume_state_path: str,
        submission_id: str,
    ) -> tuple[str, bool]:
        """Resume a partially uploaded file and finalize the submission.

        Skips step 1 (draft already exists). Step 2 resumes from SDK state
        file -- only missing parts are uploaded. Steps 3-4 proceed as normal.
        """
        logger.info(
            "MDC",
            "Step 1/4: Skipped -- reusing existing draft %s",
            submission_id,
        )
        logger.info(
            "MDC",
            "Step 2/4: Resuming upload of %s (state: %s)...",
            os.path.basename(file_path),
            resume_state_path,
        )
        try:
            upload_state = upload_dataset_file(
                file_path=file_path,
                submission_id=submission_id,
                state_path=resume_state_path,
            )
        except Exception as exc:
            _log_step_error("Step 2/4: Resume upload failed", exc, submission)
            raise OrphanedDraftError(
                submission_id=submission_id,
                message=f"Resume upload failed: {exc}",
            ) from exc
        file_upload_id: str = upload_state.fileUploadId
        logger.info(
            "MDC",
            "Step 2/4: Upload complete (file_upload_id=%s)",
            file_upload_id,
        )

        # Steps 3+4: Update metadata and submit
        return self._finalize_submission(
            submission_id,
            file_upload_id,
            submission,
        )

    def recover_submission(
        self,
        submission_id: str,
        file_upload_id: str,
        submission: DatasetSubmission,
    ) -> tuple[str, bool]:
        """Resume a failed submission from step 3 (metadata update).

        Used by --retry-failed when the upload succeeded but metadata
        update or submit failed.  Skips draft creation and file upload.
        """
        logger.info(
            "MDC",
            "Recovering orphaned draft %s (skipping steps 1-2, file_upload_id=%s)",
            submission_id,
            file_upload_id,
        )
        return self._finalize_submission(
            submission_id,
            file_upload_id,
            submission,
        )

    def _finalize_submission(
        self,
        submission_id: str,
        file_upload_id: str,
        submission: DatasetSubmission,
    ) -> tuple[str, bool]:
        """Steps 3+4: update metadata and submit for review."""
        submission.fileUploadId = file_upload_id  # type: ignore[attr-defined]

        # Step 3: Update metadata
        logger.info("MDC", "Step 3/4: Updating metadata for %s...", submission_id)
        try:
            update_submission(submission_id, submission)
        except Exception as exc:
            _log_step_error("Step 3/4: Metadata update failed", exc, submission)
            raise OrphanedDraftError(
                submission_id=submission_id,
                message=f"Metadata update failed: {exc}",
                file_upload_id=file_upload_id,
                response_body=_extract_response_detail(exc)[1],
            ) from exc
        logger.info("MDC", "Step 3/4: Metadata updated")

        # Step 4: Submit for review
        logger.info("MDC", "Step 4/4: Submitting %s for review...", submission_id)
        try:
            response: dict[str, Any] = submit_submission(
                submission_id,
                submission,
            )
        except Exception as exc:
            _log_step_error("Step 4/4: Submit failed", exc, submission)
            raise OrphanedDraftError(
                submission_id=submission_id,
                message=f"Submit failed: {exc}",
                file_upload_id=file_upload_id,
                response_body=_extract_response_detail(exc)[1],
            ) from exc

        status = response.get("submission", {}).get("status", "unknown")
        logger.info("MDC", "Step 4/4: Submitted -- status: %s", status)
        return submission_id, True

    @retry(
        retry=retry_if_exception(_is_retryable),
        wait=_wait_for_retry,
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def upload_new_version(self, file_path: str, submission_id: str) -> bool:
        """Upload a new file version to an existing dataset."""
        try:
            upload_dataset_file(file_path=file_path, submission_id=submission_id)
        except Exception as exc:
            raise _wrap_exception(exc) from exc
        logger.info("MDC", "New version uploaded to %s", submission_id)
        return True


class OrphanedDraftError(Exception):
    """Raised when a draft was created but the upload/submit failed."""

    def __init__(
        self,
        submission_id: str,
        message: str,
        file_upload_id: str | None = None,
        response_body: str | None = None,
    ) -> None:
        self.submission_id = submission_id
        self.file_upload_id = file_upload_id
        self.response_body = response_body
        super().__init__(f"Orphaned draft {submission_id}: {message}")


_MAX_LOG_BODY = 2000  # cap logged response/payload bodies


def _log_step_error(
    step: str,
    exc: Exception,
    submission: DatasetSubmission,
) -> None:
    """Log detailed error info for a failed submission step."""
    payload = submission.model_dump(exclude_none=True)  # type: ignore[attr-defined]
    # "other" is the full datasheet text -- replace with length summary
    if "other" in payload:
        payload["other"] = f"<datasheet {len(payload['other'])} chars>"
    logger.error("MDC", "%s -- Request payload: %s", step, payload)
    status_code, response_body = _extract_response_detail(exc)
    if response_body:
        body = response_body[:_MAX_LOG_BODY]
        if len(response_body) > _MAX_LOG_BODY:
            body += f"... ({len(response_body)} chars total)"
        logger.error("MDC", "%s -- HTTP %s | Response body: %s", step, status_code, body)
    logger.error("MDC", "%s -- [%s]: %s", step, type(exc).__name__, exc)


def _wrap_exception(exc: Exception) -> Exception:
    """Wrap SDK exceptions into retryable categories."""
    status_code, response_body = _extract_response_detail(exc)
    if response_body:
        body = response_body[:_MAX_LOG_BODY]
        if len(response_body) > _MAX_LOG_BODY:
            body += f"... ({len(response_body)} chars total)"
        logger.error("MDC", "HTTP %s | Response body: %s", status_code, body)
    logger.error("MDC", "SDK exception [%s]: %s", type(exc).__name__, exc)
    exc_str = str(exc).lower()
    # Check for 429
    if "429" in exc_str or "too many requests" in exc_str or "rate limit" in exc_str:
        # Try to extract Retry-After value
        retry_after = 60  # default
        match = re.search(r"retry.after[:\s]+(\d+)", exc_str, re.IGNORECASE)
        if match:
            retry_after = int(match.group(1))
        return RateLimitError(retry_after, str(exc))
    # Check for transient server errors (by message content)
    if any(code in exc_str for code in ("500", "502", "503", "504", "timeout", "connection")):
        return TransientError(str(exc))
    # Check by exception type for network-level errors whose message may not
    # contain the keywords above (e.g. bare ConnectionError, TimeoutError).
    # Note: Python's builtin ConnectionError/TimeoutError are OSError subclasses,
    # but we must NOT catch OSError broadly -- requests.HTTPError also inherits
    # from OSError and that would make auth errors (401/403) retryable.
    if isinstance(exc, (ConnectionError, TimeoutError)):
        return TransientError(str(exc))
    # Non-retryable (includes 401/403 auth errors, 404, etc.)
    return exc
