"""Tests for mdc_disabler.core (selection + resumable disable loop)."""

from __future__ import annotations

import json
from typing import Any
from unittest.mock import MagicMock, patch

from mdc_disabler.config import DisablerConfig
from mdc_disabler.core import run_disable, select_targets
from mdc_disabler.org_page import OrgDataset


def _ds(locale: str, modality: str, version: str, sid: str) -> OrgDataset:
    return OrgDataset(
        locale_code=locale,
        modality=modality,
        version=version,
        dataset_id=sid,
        name=f"Common Voice X {version} - {locale}",
        locale_name=locale,
        href=f"/datasets/{sid}",
    )


def _config(tmp_path: Any, **over: Any) -> DisablerConfig:
    base: dict[str, Any] = dict(
        target="prod", modality="sps", version="3.0", locales="",
        base_dir=str(tmp_path), delay=0.0,
        dry_run=False, verbose=False, assume_yes=True, force_rescrape=False,
        state_file=str(tmp_path / "state.json"), log_file=None, api_key="k",
    )
    base.update(over)
    return DisablerConfig.from_cli(**base)


class TestSelectTargets:
    def test_filters_modality_version_locale(self) -> None:
        data = [
            _ds("tr", "sps", "3.0", "d-tr3"),
            _ds("en", "sps", "3.0", "d-en3"),
            _ds("tr", "sps", "4.0", "d-tr4"),   # wrong version
            _ds("tr", "scs", "3.0", "d-trs"),   # wrong modality
        ]
        out = select_targets(data, "sps", "3.0", {"tr"})
        assert [d.dataset_id for d in out] == ["d-tr3"]

    def test_no_locale_filter_returns_all_matching(self) -> None:
        data = [_ds("tr", "sps", "3.0", "a"), _ds("en", "sps", "3.0", "b")]
        out = select_targets(data, "sps", "3.0", None)
        assert {d.locale_code for d in out} == {"tr", "en"}


class TestRunDisable:
    @patch("mdc_disabler.core.org_page.load_or_fetch")
    def test_disables_and_writes_state(self, mock_fetch: MagicMock, tmp_path: Any) -> None:
        mock_fetch.return_value = [_ds("tr", "sps", "3.0", "d-tr"), _ds("en", "sps", "3.0", "d-en")]
        client = MagicMock()
        client.resolve_submission_id.side_effect = lambda did: {"d-tr": "s-tr", "d-en": "s-en"}[did]
        client.set_private.return_value = True

        summary = run_disable(_config(tmp_path), client)

        assert (summary.total, summary.disabled, summary.failed) == (2, 2, 0)
        client.set_private.assert_any_call("s-tr")
        state = json.loads((tmp_path / "state.json").read_text())
        assert state["d-tr"]["status"] == "done"
        assert state["d-tr"]["submission_id"] == "s-tr"

    @patch("mdc_disabler.core.org_page.load_or_fetch")
    def test_skips_done_from_state(self, mock_fetch: MagicMock, tmp_path: Any) -> None:
        mock_fetch.return_value = [_ds("tr", "sps", "3.0", "d-tr")]
        (tmp_path / "state.json").write_text(json.dumps(
            {"d-tr": {"locale": "tr", "submission_id": "s-tr", "status": "done", "error": ""}}
        ))
        client = MagicMock()

        summary = run_disable(_config(tmp_path), client)

        assert summary.skipped == 1 and summary.disabled == 0
        client.resolve_submission_id.assert_not_called()
        client.set_private.assert_not_called()

    @patch("mdc_disabler.core.org_page.load_or_fetch")
    def test_dry_run_makes_no_client_calls(self, mock_fetch: MagicMock, tmp_path: Any) -> None:
        mock_fetch.return_value = [_ds("tr", "sps", "3.0", "d-tr")]
        summary = run_disable(_config(tmp_path, dry_run=True), None)
        assert summary.total == 1 and summary.disabled == 0 and summary.skipped == 1

    @patch("mdc_disabler.core.org_page.load_or_fetch")
    def test_resolve_failure_records_failed(self, mock_fetch: MagicMock, tmp_path: Any) -> None:
        mock_fetch.return_value = [_ds("tr", "sps", "3.0", "d-tr")]
        client = MagicMock()
        client.resolve_submission_id.return_value = ""   # resolve failed

        summary = run_disable(_config(tmp_path), client)

        assert summary.failed == 1 and "d-tr" in summary.failed_ids
        client.set_private.assert_not_called()
