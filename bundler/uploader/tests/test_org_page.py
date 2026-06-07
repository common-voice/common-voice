"""Tests for org_page.py -- scraping, snapshot I/O, and prior map."""

from __future__ import annotations

import json
import os
from unittest.mock import MagicMock, patch

from mdc_uploader.models import Modality, OrgDataset
from mdc_uploader.org_page import (
    _parse_org_page,
    build_prior_map,
    fetch_org_datasets,
    load_or_fetch,
    load_org_snapshot,
    save_org_snapshot,
)

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

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
        submission_id=sid,
        name=name,
        locale_name=name.rsplit(" - ", 1)[-1],
        href=f"/datasets/{sid}",
    )


def _make_html(entries: list[tuple[str, str, str]]) -> str:
    """Build minimal org page HTML from (locale, sid, name) tuples."""
    rows = []
    for locale, sid, name in entries:
        rows.append(
            f"<tr>"
            f'<td>{locale}</td>'
            f'<td><a href="/datasets/{sid}">{name}</a></td>'
            f"</tr>"
        )
    return "<table>" + "".join(rows) + "</table>"


# ---------------------------------------------------------------------------
# _parse_org_page
# ---------------------------------------------------------------------------


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
        assert d.submission_id == "cmndapwry02jnmh07dyo46mot"
        assert d.locale_name == "English"
        assert d.href == "/datasets/cmndapwry02jnmh07dyo46mot"

    def test_parses_sps_entry(self) -> None:
        html = _make_html([
            ("fr", "cmn1pv5hi00uto1072y1074y7", "Common Voice Spontaneous Speech 3.0 - French"),
        ])
        result = _parse_org_page(html)
        assert len(result) == 1
        assert result[0].modality == "sps"
        assert result[0].locale_code == "fr"
        assert result[0].version == "3.0"

    def test_parses_multiple_entries(self) -> None:
        html = _make_html([
            ("en", "cmndapwry02jnmh07dyo46mot", "Common Voice Scripted Speech 25.0 - English"),
            ("fr", "cmn2abc123def456ghi789jkl", "Common Voice Scripted Speech 25.0 - French"),
        ])
        result = _parse_org_page(html)
        assert len(result) == 2
        locales = {d.locale_code for d in result}
        assert locales == {"en", "fr"}

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
        result = _parse_org_page(html)
        assert len(result) == 1

    def test_skips_row_without_locale(self) -> None:
        # Row has no cell that looks like a locale code
        html = (
            "<table>"
            "<tr><td>NOT-A-LOCALE-CODE-TOO-LONG</td>"
            '<td><a href="/datasets/cmndapwry02jnmh07dyo46mot">'
            "Common Voice Scripted Speech 25.0 - English</a></td></tr>"
            "</table>"
        )
        result = _parse_org_page(html)
        assert len(result) == 0

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


# ---------------------------------------------------------------------------
# fetch_org_datasets
# ---------------------------------------------------------------------------


class TestFetchOrgDatasets:
    def test_returns_datasets_on_success(self) -> None:
        html = _make_html([
            ("en", "cmndapwry02jnmh07dyo46mot", "Common Voice Scripted Speech 25.0 - English"),
        ])
        mock_resp = MagicMock()
        mock_resp.text = html
        mock_resp.raise_for_status = MagicMock()

        with patch("mdc_uploader.org_page.httpx.get", return_value=mock_resp):
            result = fetch_org_datasets("https://example.com", "orgid123")

        assert len(result) == 1
        assert result[0].locale_code == "en"

    def test_returns_empty_on_http_error(self) -> None:
        with patch("mdc_uploader.org_page.httpx.get", side_effect=Exception("connection refused")):
            result = fetch_org_datasets("https://example.com", "orgid123")
        assert result == []

    def test_returns_empty_on_non_200(self) -> None:
        mock_resp = MagicMock()
        mock_resp.raise_for_status.side_effect = Exception("404")
        with patch("mdc_uploader.org_page.httpx.get", return_value=mock_resp):
            result = fetch_org_datasets("https://example.com", "orgid123")
        assert result == []


# ---------------------------------------------------------------------------
# load_org_snapshot / save_org_snapshot
# ---------------------------------------------------------------------------


class TestOrgSnapshot:
    def test_round_trip_local(self, tmp_path: object) -> None:
        """Save to local path and load back."""
        base = str(tmp_path)
        datasets = [_make_dataset("en"), _make_dataset("fr", sid="cmn2abc123def456ghi789jkl")]
        save_org_snapshot(datasets, base)

        loaded = load_org_snapshot(base)
        assert loaded is not None
        assert len(loaded) == 2
        locales = {d.locale_code for d in loaded}
        assert locales == {"en", "fr"}

    def test_load_returns_none_on_miss(self, tmp_path: object) -> None:
        result = load_org_snapshot(str(tmp_path))
        assert result is None

    def test_load_returns_none_on_malformed_json(self, tmp_path: object) -> None:
        state_dir = os.path.join(str(tmp_path), ".state")
        os.makedirs(state_dir)
        with open(os.path.join(state_dir, "org-snapshot.json"), "w") as f:
            f.write("not json {{{")
        result = load_org_snapshot(str(tmp_path))
        assert result is None

    def test_load_returns_none_on_missing_key(self, tmp_path: object) -> None:
        state_dir = os.path.join(str(tmp_path), ".state")
        os.makedirs(state_dir)
        with open(os.path.join(state_dir, "org-snapshot.json"), "w") as f:
            json.dump({"scraped_at": "2026-06-06T00:00:00Z", "datasets": [{"no_locale": "x"}]}, f)
        result = load_org_snapshot(str(tmp_path))
        assert result is None

    def test_tsv_written_with_correct_columns(self, tmp_path: object) -> None:
        base = str(tmp_path)
        datasets = [_make_dataset("en")]
        save_org_snapshot(datasets, base)

        tsv_path = os.path.join(base, ".state", "org-snapshot.tsv")
        with open(tsv_path, encoding="utf-8") as f:
            lines = f.read().splitlines()
        assert lines[0] == "locale\tmodality\tversion\tid\tname"
        assert lines[1].startswith("en\tscs\t25.0\t")

    def test_save_failure_is_nonfatal(self, tmp_path: object) -> None:
        # Make .state a file (not a dir) to trigger failure
        bad_state = os.path.join(str(tmp_path), ".state")
        with open(bad_state, "w") as f:
            f.write("block")
        datasets = [_make_dataset("en")]
        save_org_snapshot(datasets, str(tmp_path))  # should not raise


# ---------------------------------------------------------------------------
# load_or_fetch
# ---------------------------------------------------------------------------


class TestLoadOrFetch:
    def test_uses_cache_when_available(self, tmp_path: object) -> None:
        base = str(tmp_path)
        datasets = [_make_dataset("en")]
        save_org_snapshot(datasets, base)

        with patch("mdc_uploader.org_page.fetch_org_datasets") as mock_fetch:
            result = load_or_fetch(gcs_base=base)

        mock_fetch.assert_not_called()
        assert len(result) == 1

    def test_force_rescrape_bypasses_cache(self, tmp_path: object) -> None:
        base = str(tmp_path)
        # Pre-populate cache
        save_org_snapshot([_make_dataset("en")], base)

        fresh = [_make_dataset("fr", sid="cmn2abc123def456ghi789jkl")]
        with patch("mdc_uploader.org_page.fetch_org_datasets", return_value=fresh):
            result = load_or_fetch(gcs_base=base, force_rescrape=True)

        assert len(result) == 1
        assert result[0].locale_code == "fr"

    def test_scrapes_when_no_cache(self, tmp_path: object) -> None:
        base = str(tmp_path)
        fresh = [_make_dataset("de", sid="cmn3abc123def456ghi789jkl")]
        with patch("mdc_uploader.org_page.fetch_org_datasets", return_value=fresh):
            result = load_or_fetch(gcs_base=base)

        assert len(result) == 1
        assert result[0].locale_code == "de"
        # Snapshot was saved
        assert os.path.exists(os.path.join(base, ".state", "org-snapshot.json"))

    def test_returns_empty_on_total_failure(self) -> None:
        with patch("mdc_uploader.org_page.fetch_org_datasets", return_value=[]):
            result = load_or_fetch()
        assert result == []


# ---------------------------------------------------------------------------
# build_prior_map
# ---------------------------------------------------------------------------


class TestBuildPriorMap:
    def test_filters_by_modality(self) -> None:
        datasets = [
            _make_dataset("en", "scs", "24.0", "cmn1aaaaaaaaaaaaaaaaaaaaa"),
            _make_dataset("en", "sps", "2.0", "cmn2bbbbbbbbbbbbbbbbbbbb"),
        ]
        result = build_prior_map(datasets, Modality.SCS, "25.0")
        assert "en" in result
        assert "cmn1aaaaaaaaaaaaaaaaaaaaa" in result["en"]
        assert "cmn2bbbbbbbbbbbbbbbbbbbb" not in result.get("en", [])

    def test_excludes_current_version(self) -> None:
        datasets = [
            _make_dataset("en", "scs", "25.0", "cmn1aaaaaaaaaaaaaaaaaaaaa"),
            _make_dataset("fr", "scs", "24.0", "cmn2bbbbbbbbbbbbbbbbbbbb"),
        ]
        result = build_prior_map(datasets, Modality.SCS, "25.0")
        assert "en" not in result
        assert "fr" in result

    def test_excludes_current_submission_ids(self) -> None:
        datasets = [
            _make_dataset("en", "scs", "24.0", "cmn1aaaaaaaaaaaaaaaaaaaaa"),
        ]
        result = build_prior_map(
            datasets, Modality.SCS, "25.0", current_submission_ids={"cmn1aaaaaaaaaaaaaaaaaaaaa"}
        )
        assert result == {}

    def test_returns_empty_for_no_prior(self) -> None:
        datasets = [_make_dataset("en", "scs", "25.0")]
        result = build_prior_map(datasets, Modality.SCS, "25.0")
        assert result == {}

    def test_preserves_one_time_uploads(self) -> None:
        datasets = [
            _make_dataset("en", "scs", "24.0", "cmn1aaaaaaaaaaaaaaaaaaaaa"),
            _make_dataset("xx", "sps", "1.0", "cmn2bbbbbbbbbbbbbbbbbbbb"),  # SPS
        ]
        result = build_prior_map(datasets, Modality.SCS, "25.0")
        assert "xx" not in result
        assert "en" in result

    def test_multiple_prior_versions_per_locale(self) -> None:
        datasets = [
            _make_dataset("en", "scs", "23.0", "cmn1aaaaaaaaaaaaaaaaaaaaa"),
            _make_dataset("en", "scs", "24.0", "cmn2bbbbbbbbbbbbbbbbbbbb"),
        ]
        result = build_prior_map(datasets, Modality.SCS, "25.0")
        assert len(result["en"]) == 2
