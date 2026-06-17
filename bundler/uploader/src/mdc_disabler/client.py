"""MDC client for mdc-disable: resolve dataset id -> submission id, set visibility=private."""

from __future__ import annotations

import os
import time
from collections.abc import Callable
from typing import Any, TypeVar

from datacollective import (
    DatasetSubmission,
    Visibility,
    get_dataset_details,
    update_submission,
)

from mdc_uploader.constants import MAX_RETRY_AFTER_SECONDS
from mdc_uploader.log import logger
from mdc_uploader.mdc import (
    RateLimitError,
    TransientError,
    _extract_response_detail,
    _extract_retry_after,
)

T = TypeVar("T")


def _classify(exc: Exception) -> Exception:
    """Map an SDK exception to RateLimitError/TransientError, else return it unchanged.

    Mirrors mdc_uploader.mdc._wrap_exception's classification without its logging,
    so retried 429s don't emit spurious error lines.
    """
    if isinstance(exc, (RateLimitError, TransientError)):
        return exc
    status_code, _ = _extract_response_detail(exc)
    if status_code == 429:
        return RateLimitError(_extract_retry_after(exc), str(exc))
    if status_code is not None and 500 <= status_code < 600:
        return TransientError(str(exc))
    text = str(exc).lower()
    if "too many requests" in text or "rate limit" in text:
        return RateLimitError(_extract_retry_after(exc), str(exc))
    if any(kw in text for kw in ("500", "502", "503", "504", "timeout", "connection")):
        return TransientError(str(exc))
    if isinstance(exc, (ConnectionError, TimeoutError)):
        return TransientError(str(exc))
    return exc


class DisableClient:
    """Resolve dataset ids and PATCH submissions to visibility=private, with 429 backoff."""

    def __init__(
        self,
        api_key: str,
        api_url: str,
        max_attempts: int = 5,
        max_retry_after: int = MAX_RETRY_AFTER_SECONDS,
    ) -> None:
        # The datacollective SDK reads these env vars.
        os.environ["MDC_API_KEY"] = api_key
        os.environ["MDC_API_URL"] = api_url
        self.max_attempts = max_attempts
        self.max_retry_after = max_retry_after

    def _call(self, fn: Callable[..., T], *args: Any, what: str) -> T:
        """Call an SDK function, waiting on 429 Retry-After and retrying transients."""
        attempt = 0
        while True:
            attempt += 1
            try:
                return fn(*args)
            except Exception as exc:  # pylint: disable=broad-exception-caught
                wrapped = _classify(exc)
                if (
                    isinstance(wrapped, RateLimitError)
                    and wrapped.retry_after <= self.max_retry_after
                    and attempt < self.max_attempts
                ):
                    logger.warning(
                        "MDC",
                        "%s rate-limited -- waiting %ds (attempt %d/%d)",
                        what,
                        wrapped.retry_after,
                        attempt,
                        self.max_attempts,
                    )
                    time.sleep(wrapped.retry_after)
                    continue
                if isinstance(wrapped, TransientError) and attempt < self.max_attempts:
                    wait = min(10.0 * (3 ** (attempt - 1)), 90.0)
                    logger.warning(
                        "MDC",
                        "%s transient error -- retrying in %.0fs (attempt %d/%d)",
                        what,
                        wait,
                        attempt,
                        self.max_attempts,
                    )
                    time.sleep(wait)
                    continue
                raise

    def resolve_submission_id(self, dataset_id: str) -> str:
        """dataset id -> submissionId via get_dataset_details. "" on failure (logged)."""
        try:
            details = self._call(get_dataset_details, dataset_id, what="resolve")
        except Exception as exc:  # pylint: disable=broad-exception-caught
            status_code, _ = _extract_response_detail(exc)
            detail = f" (HTTP {status_code})" if status_code is not None else ""
            logger.error("MDC", "Failed to resolve dataset %s%s: %s", dataset_id, detail, exc)
            return ""
        submission_id = str(details.get("submissionId", ""))
        if not submission_id:
            logger.error("MDC", "Dataset %s has no submissionId", dataset_id)
        return submission_id

    def set_private(self, submission_id: str) -> bool:
        """PATCH visibility=private on a submission. False on failure (logged)."""
        try:
            self._call(
                update_submission,
                submission_id,
                DatasetSubmission(visibility=Visibility.PRIVATE),
                what="disable",
            )
        except Exception as exc:  # pylint: disable=broad-exception-caught
            status_code, _ = _extract_response_detail(exc)
            detail = f" (HTTP {status_code})" if status_code is not None else ""
            logger.error("MDC", "Failed to disable %s%s: %s", submission_id, detail, exc)
            return False
        return True
