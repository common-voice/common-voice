"""Tests for mdc_disabler.client (resolve, set_private, 429 backoff)."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from mdc_disabler.client import DisableClient
from mdc_uploader.mdc import RateLimitError


def _client() -> DisableClient:
    return DisableClient(api_key="k", api_url="http://t", max_retry_after=600, max_attempts=3)


class TestResolve:
    @patch("mdc_disabler.client.get_dataset_details")
    def test_returns_submission_id(self, mock_get: MagicMock) -> None:
        mock_get.return_value = {"submissionId": "s-1"}
        assert _client().resolve_submission_id("d-1") == "s-1"

    @patch("mdc_disabler.client.get_dataset_details")
    def test_missing_submission_id_returns_empty(self, mock_get: MagicMock) -> None:
        mock_get.return_value = {"id": "d-1"}
        assert _client().resolve_submission_id("d-1") == ""

    @patch("mdc_disabler.client.get_dataset_details")
    def test_exception_returns_empty(self, mock_get: MagicMock) -> None:
        mock_get.side_effect = RuntimeError("boom")
        assert _client().resolve_submission_id("d-1") == ""


class TestSetPrivate:
    @patch("mdc_disabler.client.update_submission")
    def test_success(self, mock_update: MagicMock) -> None:
        assert _client().set_private("s-1") is True
        mock_update.assert_called_once()

    @patch("mdc_disabler.client.update_submission")
    def test_failure_returns_false(self, mock_update: MagicMock) -> None:
        mock_update.side_effect = RuntimeError("nope")
        assert _client().set_private("s-1") is False


class TestRetry:
    @patch("mdc_disabler.client.time.sleep")
    @patch("mdc_disabler.client.update_submission")
    def test_waits_then_succeeds_on_429(
        self, mock_update: MagicMock, mock_sleep: MagicMock
    ) -> None:
        mock_update.side_effect = [RateLimitError(5, "429"), MagicMock()]
        assert _client().set_private("s-1") is True
        mock_sleep.assert_called_once_with(5)
        assert mock_update.call_count == 2

    @patch("mdc_disabler.client.time.sleep")
    @patch("mdc_disabler.client.update_submission")
    def test_gives_up_after_max_attempts(
        self, mock_update: MagicMock, mock_sleep: MagicMock
    ) -> None:
        mock_update.side_effect = RateLimitError(5, "429")
        assert _client().set_private("s-1") is False
        # max_attempts=3 -> 2 sleeps between 3 tries
        assert mock_sleep.call_count == 2

    @patch("mdc_disabler.client.time.sleep")
    @patch("mdc_disabler.client.update_submission")
    def test_gives_up_when_retry_after_exceeds_cap(
        self, mock_update: MagicMock, mock_sleep: MagicMock
    ) -> None:
        # retry_after 700 > max_retry_after 600 -> not honored -> no sleep, give up
        mock_update.side_effect = RateLimitError(700, "429")
        assert _client().set_private("s-1") is False
        mock_sleep.assert_not_called()
