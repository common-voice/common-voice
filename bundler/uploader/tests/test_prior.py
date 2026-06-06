"""Tests for prior.py -- load_prior_map."""

from __future__ import annotations

from unittest.mock import patch

from mdc_uploader.models import DisableMode, Modality, OrgDataset
from mdc_uploader.naming import parse_release_name
from mdc_uploader.prior import load_prior_map


def _scs_release() -> object:
    return parse_release_name("cv-corpus-25.0-2026-03-09")


def _make_dataset(locale: str, version: str, sid: str, modality: str = "scs") -> OrgDataset:
    mod_word = "Scripted" if modality == "scs" else "Spontaneous"
    name = f"Common Voice {mod_word} Speech {version} - English"
    return OrgDataset(
        locale_code=locale,
        modality=modality,
        version=version,
        submission_id=sid,
        name=name,
        locale_name="English",
        href=f"/datasets/{sid}",
    )


class TestLoadPriorMap:
    def test_returns_empty_for_skip_mode(self) -> None:
        with patch("mdc_uploader.prior.org_page.load_or_fetch") as mock_fetch:
            result = load_prior_map(
                disable_mode=DisableMode.SKIP,
                base_dir="/gcs",
                release_spec=_scs_release(),
            )
        mock_fetch.assert_not_called()
        assert result == {}

    def test_returns_empty_when_fetch_fails(self) -> None:
        with patch("mdc_uploader.prior.org_page.load_or_fetch", return_value=[]):
            result = load_prior_map(
                disable_mode=DisableMode.PRE,
                base_dir="/gcs",
                release_spec=_scs_release(),
            )
        assert result == {}

    def test_pre_mode_calls_load_or_fetch(self) -> None:
        datasets = [_make_dataset("en", "24.0", "cmn1aaaaaaaaaaaaaaaaaaaaa")]
        with patch("mdc_uploader.prior.org_page.load_or_fetch", return_value=datasets) as mock_f:
            result = load_prior_map(
                disable_mode=DisableMode.PRE,
                base_dir="/gcs",
                release_spec=_scs_release(),
            )
        mock_f.assert_called_once()
        assert "en" in result
        assert "cmn1aaaaaaaaaaaaaaaaaaaaa" in result["en"]

    def test_post_mode_calls_load_or_fetch(self) -> None:
        datasets = [_make_dataset("fr", "24.0", "cmn2bbbbbbbbbbbbbbbbbbbb")]
        with patch("mdc_uploader.prior.org_page.load_or_fetch", return_value=datasets) as mock_f:
            result = load_prior_map(
                disable_mode=DisableMode.POST,
                base_dir="/gcs",
                release_spec=_scs_release(),
            )
        mock_f.assert_called_once()
        assert "fr" in result

    def test_passes_force_rescrape(self) -> None:
        with patch("mdc_uploader.prior.org_page.load_or_fetch", return_value=[]) as mock_f:
            load_prior_map(
                disable_mode=DisableMode.PRE,
                base_dir="/gcs",
                release_spec=_scs_release(),
                force_rescrape=True,
            )
        _, kwargs = mock_f.call_args
        assert kwargs.get("force_rescrape") is True

    def test_version_filter_excludes_current_version(self) -> None:
        # Same-version entries are excluded by build_prior_map — current_ids not needed.
        datasets = [_make_dataset("en", "25.0", "cmn1aaaaaaaaaaaaaaaaaaaaa")]
        with patch("mdc_uploader.prior.org_page.load_or_fetch", return_value=datasets):
            result = load_prior_map(
                disable_mode=DisableMode.PRE,
                base_dir="/gcs",
                release_spec=_scs_release(),
            )
        assert result == {}
