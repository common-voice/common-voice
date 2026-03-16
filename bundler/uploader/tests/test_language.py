"""Tests for language.py -- LanguageRegistry class."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from mdc_uploader.language import LanguageRegistry


def _api_entry(
    code: str,
    english: str = "",
    native: str = "",
    variants: list[dict[str, object]] | None = None,
    accents: list[dict[str, object]] | None = None,
) -> dict[str, object]:
    """Build a minimal API response entry for testing."""
    return {
        "id": 1,
        "code": code,
        "english_name": english,
        "native_name": native,
        "text_direction": "LTR",
        "variants": variants or [],
        "predefined_accents": accents or [],
    }


def _mock_api(mock_client_cls: MagicMock, entries: list[dict[str, object]]) -> None:
    """Wire up a mocked httpx.Client to return the given entries."""
    mock_resp = MagicMock()
    mock_resp.json.return_value = entries
    mock_resp.raise_for_status = MagicMock()
    mock_client = MagicMock()
    mock_client.get.return_value = mock_resp
    mock_client.__enter__ = MagicMock(return_value=mock_client)
    mock_client.__exit__ = MagicMock(return_value=False)
    mock_client_cls.return_value = mock_client


class TestLanguageRegistryInit:
    """Tests for LanguageRegistry initialization."""

    @patch("mdc_uploader.language.httpx.Client")
    def test_init_from_api(self, mock_client_cls: MagicMock) -> None:
        """Init fetches from API and returns full LanguageData."""
        _mock_api(
            mock_client_cls,
            [
                _api_entry("en", "English", "English"),
                _api_entry("de", "German", "Deutsch"),
            ],
        )

        reg = LanguageRegistry()
        reg.init()

        en = reg.find("en")
        assert en["english_name"] == "English"
        assert en["native_name"] == "English"
        assert en["code"] == "en"

        de = reg.find("de")
        assert de["english_name"] == "German"
        assert de["native_name"] == "Deutsch"

    @patch("mdc_uploader.language.httpx.Client")
    def test_extras_appended(self, mock_client_cls: MagicMock) -> None:
        """Extras (el-CY, ms-MY) are appended after API fetch."""
        _mock_api(
            mock_client_cls,
            [
                _api_entry("en", "English", "English"),
            ],
        )

        reg = LanguageRegistry()
        reg.init()

        el = reg.find("el-CY")
        assert el["english_name"] == "Cypriot Greek"
        ms = reg.find("ms-MY")
        assert ms["english_name"] == "Bahasa Malay"

    @patch("mdc_uploader.language.httpx.Client")
    def test_extras_dont_override_api(self, mock_client_cls: MagicMock) -> None:
        """If API already has a locale from extras, API data wins."""
        _mock_api(
            mock_client_cls,
            [
                _api_entry("el-CY", "API Greek", "API Greek"),
            ],
        )

        reg = LanguageRegistry()
        reg.init()

        assert reg.find("el-CY")["english_name"] == "API Greek"

    @patch("mdc_uploader.language.httpx.Client")
    def test_skips_empty_code(self, mock_client_cls: MagicMock) -> None:
        """Entries with empty code are skipped."""
        _mock_api(
            mock_client_cls,
            [
                _api_entry("en", "English", "English"),
                _api_entry("", "NoCode", "NoCode"),
            ],
        )

        reg = LanguageRegistry()
        reg.init()

        assert "en" in reg.all_codes()
        assert "" not in reg.all_codes()

    @patch("mdc_uploader.language.httpx.Client")
    def test_api_failure_raises(self, mock_client_cls: MagicMock) -> None:
        """API failure propagates -- language data is required."""
        mock_client = MagicMock()
        mock_client.get.side_effect = ConnectionError("network down")
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_cls.return_value = mock_client

        reg = LanguageRegistry()
        with pytest.raises(ConnectionError):
            reg.init()


class TestLanguageRegistryFind:
    """Tests for LanguageRegistry.find()."""

    def test_find_before_init_raises(self) -> None:
        """Calling find() before init() raises RuntimeError."""
        reg = LanguageRegistry()
        with pytest.raises(RuntimeError, match="init"):
            reg.find("en")

    @patch("mdc_uploader.language.httpx.Client")
    def test_find_unknown_locale_raises(self, mock_client_cls: MagicMock) -> None:
        """Finding an unknown locale raises ValueError."""
        _mock_api(mock_client_cls, [_api_entry("en", "English", "English")])

        reg = LanguageRegistry()
        reg.init()

        with pytest.raises(ValueError, match="not found.*EXTRAS"):
            reg.find("zz-ZZ")


class TestLanguageRegistryVariants:
    """Tests for variant and accent handling."""

    @patch("mdc_uploader.language.httpx.Client")
    def test_variant_codes(self, mock_client_cls: MagicMock) -> None:
        """variant_codes() returns all variant codes across locales."""
        _mock_api(
            mock_client_cls,
            [
                _api_entry(
                    "fr",
                    "French",
                    "Francais",
                    variants=[
                        {
                            "id": 1,
                            "code": "fr-europe",
                            "name": "European French",
                            "type": None,
                            "locale_id": 3,
                        },
                        {
                            "id": 2,
                            "code": "fr-nafrica",
                            "name": "North African French",
                            "type": None,
                            "locale_id": 3,
                        },
                    ],
                ),
                _api_entry("en", "English", "English"),
            ],
        )

        reg = LanguageRegistry()
        reg.init()

        vcodes = reg.variant_codes()
        assert "fr-europe" in vcodes
        assert "fr-nafrica" in vcodes
        assert "en" not in vcodes

    @patch("mdc_uploader.language.httpx.Client")
    def test_find_by_variant(self, mock_client_cls: MagicMock) -> None:
        """find_by_variant() returns the parent locale entry."""
        _mock_api(
            mock_client_cls,
            [
                _api_entry(
                    "fr",
                    "French",
                    "Francais",
                    variants=[
                        {
                            "id": 1,
                            "code": "fr-europe",
                            "name": "European French",
                            "type": None,
                            "locale_id": 3,
                        },
                    ],
                ),
            ],
        )

        reg = LanguageRegistry()
        reg.init()

        parent = reg.find_by_variant("fr-europe")
        assert parent is not None
        assert parent["code"] == "fr"
        assert parent["english_name"] == "French"

    @patch("mdc_uploader.language.httpx.Client")
    def test_find_by_variant_unknown(self, mock_client_cls: MagicMock) -> None:
        """find_by_variant() returns None for unknown variant code."""
        _mock_api(mock_client_cls, [_api_entry("en", "English", "English")])

        reg = LanguageRegistry()
        reg.init()

        assert reg.find_by_variant("xx-unknown") is None

    @patch("mdc_uploader.language.httpx.Client")
    def test_all_codes_before_init_raises(self, mock_client_cls: MagicMock) -> None:
        """all_codes() before init() raises RuntimeError."""
        reg = LanguageRegistry()
        with pytest.raises(RuntimeError, match="init"):
            reg.all_codes()
