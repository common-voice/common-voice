"""Tests for mdc_disabler.org_page -- scraping and snapshot I/O."""

from __future__ import annotations

import json
import os
from typing import Any
from unittest.mock import MagicMock, patch

from mdc_disabler.org_page import (
    OrgDataset,
    _parse_org_page,
    fetch_org_datasets,
    load_or_fetch,
    load_org_snapshot,
    save_org_snapshot,
)


def _make_dataset(
    locale: str = "en",
    modality: str = "scs",
    version: str = "25.0",
    sid: str = "cmndapwry02jnmh07dyo46mot",
    name: str | None = None,
) -> OrgDataset:
    if name is None:
        mod_word = "Scripted" if modality == "scs" else "Spontaneous"
        locale_name = {"en": "English", "fr": "French", "de": "German"}.get(locale, locale)
        name = f"Common Voice {mod_word} Speech {version} - {locale_name}"
    return OrgDataset(
        locale_code=locale,
        modality=modality,
        version=version,
        dataset_id=sid,
        name=name,
        locale_name=name.rsplit(" - ", 1)[-1],
        href=f"/datasets/{sid}",
    )


def _make_html(entries: list[tuple[str, str, str]]) -> str:
    """Build minimal org page HTML from (locale, sid, name) tuples."""
    rows = []
    for locale, sid, name in entries:
        rows.append(
            f"<tr><td>{locale}</td>"
            f'<td><a href="/datasets/{sid}">{name}</a></td></tr>'
        )
    return "<table>" + "".join(rows) + "</table>"


class TestParseOrgPage:
    def test_parses_scs_entry(self) -> None:
        html = _make_html([
            ("en", "cmndapwry02jnmh07dyo46mot", "Common Voice Scripted Speech 25.0 - English"),
        ])
        result = _parse_org_page(html)
        assert len(result) == 1
        d = result[0]
        assert d.locale_code == "en"
        assert d.modality == "scs"
        assert d.version == "25.0"
        assert d.dataset_id == "cmndapwry02jnmh07dyo46mot"
        assert d.locale_name == "English"
        assert d.href == "/datasets/cmndapwry02jnmh07dyo46mot"

    def test_parses_sps_entry(self) -> None:
        html = _make_html([
            ("fr", "cmn1pv5hi00uto1072y1074y7", "Common Voice Spontaneous Speech 3.0 - French"),
        ])
        result = _parse_org_page(html)
        assert len(result) == 1
        assert result[0].modality == "sps"
        assert result[0].version == "3.0"

    def test_skips_non_cv_names(self) -> None:
        html = _make_html([
            ("en", "cmndapwry02jnmh07dyo46mot", "Common Voice Scripted Speech 25.0 - English"),
            ("xx", "cmn0000000000000000000001", "Some Other Dataset - Unknown"),
        ])
        result = _parse_org_page(html)
        assert len(result) == 1
        assert result[0].locale_code == "en"

    def test_deduplicates_same_id(self) -> None:
        row = (
            '<tr><td>en</td>'
            '<td><a href="/datasets/cmndapwry02jnmh07dyo46mot">'
            "Common Voice Scripted Speech 25.0 - English</a></td></tr>"
        )
        html = "<table>" + row + row + "</table>"
        assert len(_parse_org_page(html)) == 1

    def test_skips_row_without_locale(self) -> None:
        html = (
            "<table>"
            "<tr><td>NOT-A-LOCALE-CODE-TOO-LONG</td>"
            '<td><a href="/datasets/cmndapwry02jnmh07dyo46mot">'
            "Common Voice Scripted Speech 25.0 - English</a></td></tr>"
            "</table>"
        )
        assert len(_parse_org_page(html)) == 0

    def test_empty_html_returns_empty(self) -> None:
        assert _parse_org_page("") == []

    def test_hyphenated_locale_code(self) -> None:
        html = _make_html([
            ("rm-vallader", "cmn1aaaaaaaaaaaaaaaaaaaaa",
             "Common Voice Scripted Speech 25.0 - Romansh Vallader"),
        ])
        result = _parse_org_page(html)
        assert len(result) == 1
        assert result[0].locale_code == "rm-vallader"


class TestFetchOrgDatasets:
    def test_returns_datasets_on_success(self) -> None:
        html = _make_html([
            ("en", "cmndapwry02jnmh07dyo46mot", "Common Voice Scripted Speech 25.0 - English"),
        ])
        mock_resp = MagicMock()
        mock_resp.text = html
        mock_resp.raise_for_status = MagicMock()
        with patch("mdc_disabler.org_page.httpx.get", return_value=mock_resp):
            result = fetch_org_datasets("https://example.com", "orgid123")
        assert len(result) == 1
        assert result[0].locale_code == "en"

    def test_returns_empty_on_http_error(self) -> None:
        with patch("mdc_disabler.org_page.httpx.get", side_effect=Exception("refused")):
            result = fetch_org_datasets("https://example.com", "orgid123")
        assert result == []


class TestOrgSnapshot:
    def test_round_trip_local(self, tmp_path: Any) -> None:
        base = str(tmp_path)
        datasets = [_make_dataset("en"), _make_dataset("fr", sid="cmn2abc123def456ghi789jkl")]
        save_org_snapshot(datasets, base)
        loaded = load_org_snapshot(base)
        assert loaded is not None
        assert {d.locale_code for d in loaded} == {"en", "fr"}
        ids = {d.dataset_id for d in loaded}
        assert ids == {"cmndapwry02jnmh07dyo46mot", "cmn2abc123def456ghi789jkl"}

    def test_load_returns_none_on_miss(self, tmp_path: Any) -> None:
        assert load_org_snapshot(str(tmp_path)) is None

    def test_load_returns_none_on_malformed_json(self, tmp_path: Any) -> None:
        state_dir = os.path.join(str(tmp_path), ".state")
        os.makedirs(state_dir)
        with open(os.path.join(state_dir, "org-snapshot.json"), "w") as f:
            f.write("not json {{{")
        assert load_org_snapshot(str(tmp_path)) is None

    def test_load_returns_none_when_stale(self, tmp_path: Any) -> None:
        # scraped_at far in the past -> older than _SNAPSHOT_MAX_AGE_HOURS -> re-scrape.
        state_dir = os.path.join(str(tmp_path), ".state")
        os.makedirs(state_dir)
        snap = {
            "scraped_at": "2000-01-01T00:00:00Z",
            "datasets": [{
                "locale": "en", "modality": "scs", "version": "25.0",
                "id": "cmndapwry02jnmh07dyo46mot", "name": "x", "locale_name": "English",
            }],
        }
        with open(os.path.join(state_dir, "org-snapshot.json"), "w", encoding="utf-8") as f:
            json.dump(snap, f)
        assert load_org_snapshot(str(tmp_path)) is None

    def test_tsv_written_with_correct_columns(self, tmp_path: Any) -> None:
        base = str(tmp_path)
        save_org_snapshot([_make_dataset("en")], base)
        tsv_path = os.path.join(base, ".state", "org-snapshot.tsv")
        with open(tsv_path, encoding="utf-8") as f:
            lines = f.read().splitlines()
        assert lines[0] == "locale\tmodality\tversion\tid\tname"
        assert lines[1].startswith("en\tscs\t25.0\t")

    def test_save_failure_is_nonfatal(self, tmp_path: Any) -> None:
        bad_state = os.path.join(str(tmp_path), ".state")
        with open(bad_state, "w") as f:
            f.write("block")
        save_org_snapshot([_make_dataset("en")], str(tmp_path))  # should not raise


class TestLoadOrFetch:
    def test_uses_cache_when_available(self, tmp_path: Any) -> None:
        base = str(tmp_path)
        save_org_snapshot([_make_dataset("en")], base)
        with patch("mdc_disabler.org_page.fetch_org_datasets") as mock_fetch:
            result = load_or_fetch(gcs_base=base)
        mock_fetch.assert_not_called()
        assert len(result) == 1

    def test_force_rescrape_bypasses_cache(self, tmp_path: Any) -> None:
        base = str(tmp_path)
        save_org_snapshot([_make_dataset("en")], base)
        fresh = [_make_dataset("fr", sid="cmn2abc123def456ghi789jkl")]
        with patch("mdc_disabler.org_page.fetch_org_datasets", return_value=fresh):
            result = load_or_fetch(gcs_base=base, force_rescrape=True)
        assert len(result) == 1 and result[0].locale_code == "fr"

    def test_scrapes_when_no_cache(self, tmp_path: Any) -> None:
        base = str(tmp_path)
        fresh = [_make_dataset("de", sid="cmn3abc123def456ghi789jkl")]
        with patch("mdc_disabler.org_page.fetch_org_datasets", return_value=fresh):
            result = load_or_fetch(gcs_base=base)
        assert len(result) == 1 and result[0].locale_code == "de"
        assert os.path.exists(os.path.join(base, ".state", "org-snapshot.json"))

    def test_returns_empty_on_total_failure(self) -> None:
        with patch("mdc_disabler.org_page.fetch_org_datasets", return_value=[]):
            result = load_or_fetch()
        assert result == []
