"""Tests for mdc.py -- exception wrapping and retry logic."""

from __future__ import annotations

from mdc_uploader.mdc import (
    RateLimitError,
    TransientError,
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
