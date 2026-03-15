"""Tests for language.py -- LanguageRegistry class."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from mdc_uploader.language import LanguageRegistry


class TestLanguageRegistryInit:
    """Tests for LanguageRegistry initialization."""

    @patch("mdc_uploader.language.httpx.Client")
    def test_init_from_api(self, mock_client_cls: MagicMock) -> None:
        """Init fetches from API and appends extras."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {"code": "en", "english_name": "English", "native_name": "English"},
            {"code": "de", "english_name": "German", "native_name": "Deutsch"},
        ]
        mock_resp.raise_for_status = MagicMock()
        mock_client = MagicMock()
        mock_client.get.return_value = mock_resp
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_cls.return_value = mock_client

        reg = LanguageRegistry()
        reg.init()

        assert reg.find("en") == ("English", "English")
        assert reg.find("de") == ("German", "Deutsch")

    @patch("mdc_uploader.language.httpx.Client")
    def test_extras_appended(self, mock_client_cls: MagicMock) -> None:
        """Extras (el-CY, ms-MY) are appended after API fetch."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {"code": "en", "english_name": "English", "native_name": "English"},
        ]
        mock_resp.raise_for_status = MagicMock()
        mock_client = MagicMock()
        mock_client.get.return_value = mock_resp
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_cls.return_value = mock_client

        reg = LanguageRegistry()
        reg.init()

        assert reg.find("el-CY") == ("Cypriot Greek", "Cypriot Greek")
        assert reg.find("ms-MY") == ("Bahasa Malay", "Bahasa Malay")

    @patch("mdc_uploader.language.httpx.Client")
    def test_extras_dont_override_api(self, mock_client_cls: MagicMock) -> None:
        """If API already has a locale from extras, API data wins."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {"code": "el-CY", "english_name": "API Greek", "native_name": "API Greek"},
        ]
        mock_resp.raise_for_status = MagicMock()
        mock_client = MagicMock()
        mock_client.get.return_value = mock_resp
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_cls.return_value = mock_client

        reg = LanguageRegistry()
        reg.init()

        # API value should not be overridden by extras
        assert reg.find("el-CY") == ("API Greek", "API Greek")

    @patch("mdc_uploader.language.httpx.Client")
    def test_skips_incomplete_entries(self, mock_client_cls: MagicMock) -> None:
        """Entries missing code, english_name, or native_name are skipped."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {"code": "en", "english_name": "English", "native_name": "English"},
            {"code": "", "english_name": "NoCode", "native_name": "NoCode"},
            {"code": "xx", "english_name": "", "native_name": "NoEnglish"},
            {"code": "yy", "english_name": "NoNative", "native_name": ""},
        ]
        mock_resp.raise_for_status = MagicMock()
        mock_client = MagicMock()
        mock_client.get.return_value = mock_resp
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_cls.return_value = mock_client

        reg = LanguageRegistry()
        reg.init()

        assert reg.find("en") == ("English", "English")
        with pytest.raises(ValueError, match="not found"):
            reg.find("xx")
        with pytest.raises(ValueError, match="not found"):
            reg.find("yy")

    @patch("mdc_uploader.language.httpx.Client")
    def test_api_failure_raises(self, mock_client_cls: MagicMock) -> None:
        """API failure propagates -- language names are required."""
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
        with pytest.raises(RuntimeError, match="init\\(\\) must be called"):
            reg.find("en")

    @patch("mdc_uploader.language.httpx.Client")
    def test_find_unknown_locale_raises(self, mock_client_cls: MagicMock) -> None:
        """Finding an unknown locale raises ValueError with helpful message."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {"code": "en", "english_name": "English", "native_name": "English"},
        ]
        mock_resp.raise_for_status = MagicMock()
        mock_client = MagicMock()
        mock_client.get.return_value = mock_resp
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_cls.return_value = mock_client

        reg = LanguageRegistry()
        reg.init()

        with pytest.raises(ValueError, match="not found.*add it to.*EXTRAS"):
            reg.find("zz-ZZ")
