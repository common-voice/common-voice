"""Tests for mdc.py -- exception wrapping, retry logic, and response detail extraction."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from requests import Response
from requests.exceptions import HTTPError

from mdc_uploader.mdc import (
    MDCClient,
    OrphanedDraftError,
    RateLimitError,
    TransientError,
    _extract_response_detail,
    _is_retryable,
    _wrap_exception,
)


class TestWrapException:
    """Tests for _wrap_exception categorization."""

    def test_429_detected(self) -> None:
        """429 in error message produces RateLimitError."""
        exc = Exception("HTTP 429 Too Many Requests")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, RateLimitError)
        assert wrapped.retry_after == 60  # default

    def test_429_with_retry_after(self) -> None:
        """Retry-After value is extracted from error message."""
        exc = Exception("429 rate limit exceeded, Retry-After: 120")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, RateLimitError)
        assert wrapped.retry_after == 120

    def test_rate_limit_text(self) -> None:
        """'rate limit' text triggers RateLimitError."""
        exc = Exception("API rate limit reached")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, RateLimitError)

    def test_500_is_transient(self) -> None:
        """500 errors are wrapped as TransientError."""
        exc = Exception("Internal Server Error 500")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, TransientError)

    def test_502_is_transient(self) -> None:
        """502 errors are wrapped as TransientError."""
        exc = Exception("502 Bad Gateway")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, TransientError)

    def test_503_is_transient(self) -> None:
        """503 errors are wrapped as TransientError."""
        exc = Exception("503 Service Unavailable")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, TransientError)

    def test_timeout_is_transient(self) -> None:
        """Timeout errors are wrapped as TransientError."""
        exc = Exception("Request timeout after 30s")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, TransientError)

    def test_connection_is_transient(self) -> None:
        """Connection errors are wrapped as TransientError."""
        exc = Exception("Connection refused by server")
        wrapped = _wrap_exception(exc)
        assert isinstance(wrapped, TransientError)

    def test_400_is_not_retryable(self) -> None:
        """400 errors pass through unwrapped."""
        exc = Exception("400 Bad Request: invalid locale")
        wrapped = _wrap_exception(exc)
        assert wrapped is exc  # returned as-is

    def test_generic_error_passes_through(self) -> None:
        """Non-matching errors pass through unchanged."""
        exc = ValueError("Invalid argument")
        wrapped = _wrap_exception(exc)
        assert wrapped is exc


class TestIsRetryable:
    """Tests for _is_retryable predicate."""

    def test_rate_limit_within_max(self) -> None:
        """RateLimitError with retry_after <= MAX is retryable."""
        assert _is_retryable(RateLimitError(60)) is True

    def test_rate_limit_exceeds_max(self) -> None:
        """RateLimitError with retry_after > MAX is not retryable."""
        assert _is_retryable(RateLimitError(7200)) is False

    def test_transient_error(self) -> None:
        """TransientError is retryable."""
        assert _is_retryable(TransientError("server error")) is True

    def test_raw_connection_error_not_retryable(self) -> None:
        """Raw ConnectionError is not retryable -- must go through _wrap_exception first."""
        assert _is_retryable(ConnectionError("refused")) is False

    def test_raw_timeout_error_not_retryable(self) -> None:
        """Raw TimeoutError is not retryable -- must go through _wrap_exception first."""
        assert _is_retryable(TimeoutError("timed out")) is False

    def test_raw_os_error_not_retryable(self) -> None:
        """Raw OSError is not retryable (PermissionError inherits from OSError)."""
        assert _is_retryable(OSError("network unreachable")) is False

    def test_wrapped_connection_error_is_retryable(self) -> None:
        """ConnectionError wrapped via _wrap_exception becomes retryable TransientError."""
        wrapped = _wrap_exception(ConnectionError("refused"))
        assert isinstance(wrapped, TransientError)
        assert _is_retryable(wrapped) is True

    def test_wrapped_timeout_error_is_retryable(self) -> None:
        """TimeoutError wrapped via _wrap_exception becomes retryable TransientError."""
        wrapped = _wrap_exception(TimeoutError("timed out"))
        assert isinstance(wrapped, TransientError)
        assert _is_retryable(wrapped) is True

    def test_permission_error_not_retryable(self) -> None:
        """PermissionError (403) is not retryable even though it inherits from OSError."""
        assert _is_retryable(PermissionError("Access denied")) is False

    def test_value_error_not_retryable(self) -> None:
        """ValueError is not retryable."""
        assert _is_retryable(ValueError("bad input")) is False

    def test_generic_exception_not_retryable(self) -> None:
        """Generic Exception is not retryable."""
        assert _is_retryable(Exception("something")) is False


def _make_http_error(status_code: int, body: str) -> HTTPError:
    """Build a requests.HTTPError with a mock Response attached."""
    resp = Response()
    resp.status_code = status_code
    resp._content = body.encode("utf-8")  # noqa: SLF001  # pylint: disable=protected-access
    exc = HTTPError(f"{status_code} Client Error", response=resp)
    return exc


class TestExtractResponseDetail:
    """Tests for _extract_response_detail."""

    def test_http_error_returns_status_and_body(self) -> None:
        """HTTPError with .response yields (status_code, body_text)."""
        exc = _make_http_error(400, '{"error":"locale invalid"}')
        status, body = _extract_response_detail(exc)
        assert status == 400
        assert body == '{"error":"locale invalid"}'

    def test_plain_exception_returns_none(self) -> None:
        """Plain Exception without .response yields (None, None)."""
        exc = ValueError("bad input")
        status, body = _extract_response_detail(exc)
        assert status is None
        assert body is None

    def test_none_response_returns_none(self) -> None:
        """Exception with .response = None yields (None, None)."""
        exc = Exception("fail")
        exc.response = None  # type: ignore[attr-defined]
        status, body = _extract_response_detail(exc)
        assert status is None
        assert body is None

    def test_500_response(self) -> None:
        """5xx responses are extracted correctly."""
        exc = _make_http_error(502, "Bad Gateway")
        status, body = _extract_response_detail(exc)
        assert status == 502
        assert body == "Bad Gateway"


class TestWrapExceptionResponseLogging:
    """Tests that _wrap_exception logs response body when available."""

    @patch("mdc_uploader.mdc.logger")
    def test_logs_response_body_on_http_error(self, mock_logger: MagicMock) -> None:
        """_wrap_exception logs the response body for HTTPError."""
        exc = _make_http_error(400, '{"message":"locale br invalid"}')
        _wrap_exception(exc)
        # First call should be the response body log
        calls = mock_logger.error.call_args_list
        assert any("Response body" in str(c) for c in calls)
        assert any("locale br invalid" in str(c) for c in calls)

    @patch("mdc_uploader.mdc.logger")
    def test_no_response_body_log_for_plain_exception(self, mock_logger: MagicMock) -> None:
        """_wrap_exception does not log response body for non-HTTP exceptions."""
        exc = ConnectionError("refused")
        _wrap_exception(exc)
        calls = mock_logger.error.call_args_list
        assert not any("Response body" in str(c) for c in calls)


class TestOrphanedDraftError:
    """Tests for enriched OrphanedDraftError."""

    def test_basic_fields(self) -> None:
        """OrphanedDraftError carries submission_id in message."""
        exc = OrphanedDraftError("sub-123", "upload failed")
        assert exc.submission_id == "sub-123"
        assert "sub-123" in str(exc)

    def test_optional_fields_default_none(self) -> None:
        """file_upload_id and response_body default to None."""
        exc = OrphanedDraftError("sub-123", "fail")
        assert exc.file_upload_id is None
        assert exc.response_body is None

    def test_optional_fields_set(self) -> None:
        """file_upload_id and response_body can be set."""
        exc = OrphanedDraftError(
            "sub-123",
            "metadata update failed",
            file_upload_id="upload-456",
            response_body='{"error":"bad locale"}',
        )
        assert exc.file_upload_id == "upload-456"
        assert exc.response_body == '{"error":"bad locale"}'


class TestCreateAndUpload:
    """Tests for step-by-step create_and_upload flow."""

    def _client(self) -> MDCClient:
        """Build an MDCClient without real env vars."""
        return MDCClient(api_key="test", api_url="http://test")

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_success_full_flow(
        self, mock_draft, mock_upload, mock_update, mock_submit,
    ) -> None:
        """Full success: all 4 steps complete."""
        mock_draft.return_value = {
            "submission": {"id": "sub-1"},
        }
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-1"
        mock_upload.return_value = mock_upload_state
        mock_update.return_value = {}
        mock_submit.return_value = {
            "submission": {"status": "submitted"},
        }

        sub_id, ok = self._client().create_and_upload(
            "/fake/file.tar.gz", MagicMock(),
        )
        assert sub_id == "sub-1"
        assert ok is True
        mock_draft.assert_called_once()
        mock_upload.assert_called_once()
        mock_update.assert_called_once()
        mock_submit.assert_called_once()

    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_draft_failure_no_orphan(self, mock_draft) -> None:
        """Draft failure raises directly, no OrphanedDraftError."""
        mock_draft.side_effect = RuntimeError("auth failed")

        with pytest.raises(RuntimeError, match="auth failed"):
            self._client().create_and_upload(
                "/fake/file.tar.gz", MagicMock(),
            )

    @patch("mdc_uploader.mdc.upload_dataset_file")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_upload_failure_orphaned_draft(
        self, mock_draft, mock_upload,
    ) -> None:
        """Upload failure raises OrphanedDraftError with submission_id."""
        mock_draft.return_value = {
            "submission": {"id": "sub-2"},
        }
        mock_upload.side_effect = RuntimeError("network error")

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().create_and_upload(
                "/fake/file.tar.gz", MagicMock(),
            )
        assert exc_info.value.submission_id == "sub-2"
        assert exc_info.value.file_upload_id is None

    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_metadata_400_orphaned_with_ids(
        self, mock_draft, mock_upload, mock_update,
    ) -> None:
        """Metadata update 400 raises OrphanedDraftError with both IDs."""
        mock_draft.return_value = {
            "submission": {"id": "sub-3"},
        }
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-3"
        mock_upload.return_value = mock_upload_state
        mock_update.side_effect = _make_http_error(
            400, '{"error":"bad locale"}',
        )

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().create_and_upload(
                "/fake/file.tar.gz", MagicMock(),
            )
        assert exc_info.value.submission_id == "sub-3"
        assert exc_info.value.file_upload_id == "fup-3"
        assert exc_info.value.response_body == '{"error":"bad locale"}'

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_submit_failure_orphaned_with_ids(
        self, mock_draft, mock_upload, mock_update, mock_submit,
    ) -> None:
        """Submit failure raises OrphanedDraftError with both IDs."""
        mock_draft.return_value = {
            "submission": {"id": "sub-4"},
        }
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-4"
        mock_upload.return_value = mock_upload_state
        mock_update.return_value = {}
        mock_submit.side_effect = _make_http_error(500, "server error")

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().create_and_upload(
                "/fake/file.tar.gz", MagicMock(),
            )
        assert exc_info.value.submission_id == "sub-4"
        assert exc_info.value.file_upload_id == "fup-4"


class TestResumeAndUpload:
    """Tests for resume_and_upload (resume partial multipart upload)."""

    def _client(self) -> MDCClient:
        return MDCClient(api_key="test", api_url="http://test")

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    def test_success_skips_draft_and_finalizes(
        self, mock_upload, mock_update, mock_submit,
    ) -> None:
        """Resume: skips step 1, uploads with state_path, runs steps 3+4."""
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-resume"
        mock_upload.return_value = mock_upload_state
        mock_update.return_value = {}
        mock_submit.return_value = {"submission": {"status": "submitted"}}

        sub_id, ok = self._client().resume_and_upload(
            file_path="/fake/file.tar.gz",
            submission=MagicMock(),
            resume_state_path="/state/mdc-upload-fr.json",
            submission_id="sub-existing",
        )

        assert sub_id == "sub-existing"
        assert ok is True
        mock_upload.assert_called_once_with(
            file_path="/fake/file.tar.gz",
            submission_id="sub-existing",
            state_path="/state/mdc-upload-fr.json",
            enable_logging=False,
            show_progress=False,
        )
        mock_update.assert_called_once()
        mock_submit.assert_called_once()

    @patch("mdc_uploader.mdc.upload_dataset_file")
    def test_upload_failure_raises_orphaned_draft(self, mock_upload) -> None:
        """Resume upload failure raises OrphanedDraftError with submission_id."""
        mock_upload.side_effect = RuntimeError("connection lost")

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().resume_and_upload(
                file_path="/fake/file.tar.gz",
                submission=MagicMock(),
                resume_state_path="/state/mdc-upload-fr.json",
                submission_id="sub-existing",
            )
        assert exc_info.value.submission_id == "sub-existing"
        assert exc_info.value.file_upload_id is None

    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    def test_metadata_failure_orphaned_with_file_upload_id(
        self, mock_upload, mock_update,
    ) -> None:
        """Resume metadata failure captures file_upload_id."""
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-resume"
        mock_upload.return_value = mock_upload_state
        mock_update.side_effect = _make_http_error(400, '{"error":"bad"}')

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().resume_and_upload(
                file_path="/fake/file.tar.gz",
                submission=MagicMock(),
                resume_state_path="/state/mdc-upload-fr.json",
                submission_id="sub-existing",
            )
        assert exc_info.value.submission_id == "sub-existing"
        assert exc_info.value.file_upload_id == "fup-resume"


class TestRecoverSubmission:
    """Tests for recover_submission (retry from step 3)."""

    def _client(self) -> MDCClient:
        return MDCClient(api_key="test", api_url="http://test")

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    def test_recovery_success(
        self, mock_update, mock_submit,
    ) -> None:
        """Recovery completes steps 3+4 without re-uploading."""
        mock_update.return_value = {}
        mock_submit.return_value = {
            "submission": {"status": "submitted"},
        }

        sub_id, ok = self._client().recover_submission(
            submission_id="sub-orphan",
            file_upload_id="fup-orphan",
            submission=MagicMock(),
        )
        assert sub_id == "sub-orphan"
        assert ok is True

    @patch("mdc_uploader.mdc.update_submission")
    def test_recovery_metadata_failure(self, mock_update) -> None:
        """Recovery metadata failure raises OrphanedDraftError."""
        mock_update.side_effect = _make_http_error(
            400, '{"error":"still bad"}',
        )

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().recover_submission(
                submission_id="sub-orphan",
                file_upload_id="fup-orphan",
                submission=MagicMock(),
            )
        assert exc_info.value.submission_id == "sub-orphan"
        assert exc_info.value.file_upload_id == "fup-orphan"


class TestStreamAndUpload:
    """Tests for stream_and_upload -- draft -> stream -> finalize."""

    def _client(self, verbose: bool = False) -> MDCClient:
        return MDCClient(api_key="test", api_url="http://test", verbose=verbose)

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.stream_upload_from_gcs")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_success_full_flow(
        self, mock_draft, mock_stream, mock_update, mock_submit,
    ) -> None:
        """Full success: draft -> stream -> metadata -> submit."""
        mock_draft.return_value = {"submission": {"id": "sub-s1"}}
        mock_stream_state = MagicMock()
        mock_stream_state.fileUploadId = "fup-s1"
        mock_stream.return_value = mock_stream_state
        mock_update.return_value = {}
        mock_submit.return_value = {"submission": {"status": "submitted"}}

        sub_id, ok = self._client().stream_and_upload(
            bucket_name="my-bucket",
            blob_path="release/test-en.tar.gz",
            submission=MagicMock(),
            state_path="/tmp/state.json",
        )
        assert sub_id == "sub-s1"
        assert ok is True
        mock_draft.assert_called_once()
        mock_stream.assert_called_once_with(
            bucket_name="my-bucket",
            blob_path="release/test-en.tar.gz",
            submission_id="sub-s1",
            state_path="/tmp/state.json",
        )
        mock_update.assert_called_once()
        mock_submit.assert_called_once()

    @patch("mdc_uploader.mdc.stream_upload_from_gcs")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_stream_failure_orphaned_draft(
        self, mock_draft, mock_stream,
    ) -> None:
        """Stream failure raises OrphanedDraftError."""
        mock_draft.return_value = {"submission": {"id": "sub-s2"}}
        mock_stream.side_effect = RuntimeError("GCS timeout")

        with pytest.raises(OrphanedDraftError) as exc_info:
            self._client().stream_and_upload(
                bucket_name="b", blob_path="p",
                submission=MagicMock(), state_path="/tmp/s.json",
            )
        assert exc_info.value.submission_id == "sub-s2"

    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_draft_failure_no_orphan(self, mock_draft) -> None:
        """Draft failure raises directly, no OrphanedDraftError."""
        mock_draft.side_effect = RuntimeError("auth failed")

        with pytest.raises(RuntimeError, match="auth failed"):
            self._client().stream_and_upload(
                bucket_name="b", blob_path="p",
                submission=MagicMock(), state_path="/tmp/s.json",
            )


class TestVerbosePassthrough:
    """Tests for verbose flag passthrough to SDK."""

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_verbose_true_passed_to_sdk(
        self, mock_draft, mock_upload, mock_update, mock_submit,
    ) -> None:
        """When verbose=True, enable_logging and show_progress are True."""
        mock_draft.return_value = {"submission": {"id": "sub-v"}}
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-v"
        mock_upload.return_value = mock_upload_state
        mock_update.return_value = {}
        mock_submit.return_value = {"submission": {"status": "submitted"}}

        client = MDCClient(api_key="test", api_url="http://test", verbose=True)
        client.create_and_upload("/fake/file.tar.gz", MagicMock())

        call_kwargs = mock_upload.call_args[1]
        assert call_kwargs["enable_logging"] is True
        assert call_kwargs["show_progress"] is True

    @patch("mdc_uploader.mdc.submit_submission")
    @patch("mdc_uploader.mdc.update_submission")
    @patch("mdc_uploader.mdc.upload_dataset_file")
    @patch("mdc_uploader.mdc.create_submission_draft")
    def test_verbose_false_passed_to_sdk(
        self, mock_draft, mock_upload, mock_update, mock_submit,
    ) -> None:
        """When verbose=False (default), enable_logging and show_progress are False."""
        mock_draft.return_value = {"submission": {"id": "sub-v2"}}
        mock_upload_state = MagicMock()
        mock_upload_state.fileUploadId = "fup-v2"
        mock_upload.return_value = mock_upload_state
        mock_update.return_value = {}
        mock_submit.return_value = {"submission": {"status": "submitted"}}

        client = MDCClient(api_key="test", api_url="http://test")
        client.create_and_upload("/fake/file.tar.gz", MagicMock())

        call_kwargs = mock_upload.call_args[1]
        assert call_kwargs["enable_logging"] is False
        assert call_kwargs["show_progress"] is False
