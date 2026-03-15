"""Locale language name resolution.

Source of truth: Common Voice languagedata API.
Extras appended for locales missing from the API (el-CY, ms-MY).

Usage:
    language.init()
    english, native = language.find("en")
"""

from __future__ import annotations

from typing import Any

import httpx

from mdc_uploader.constants import CV_API_URL
from mdc_uploader.log import logger
from mdc_uploader.typedef import LanguageNames


class LanguageRegistry:
    """Registry of locale language names, loaded from API + hardcoded extras.

    All locales are kept regardless of is_contributable flag because
    SPS locales may not have SCS counterparts and those have is_contributable=0.
    """

    # Locales not present in the CV languagedata API.
    # Same data as cv-datasheets/metadata/locale-extras.json.
    EXTRAS: dict[str, LanguageNames] = {
        "el-CY": ("Cypriot Greek", "Cypriot Greek"),
        "ms-MY": ("Bahasa Malay", "Bahasa Malay"),
    }

    def __init__(self) -> None:
        self._registry: dict[str, LanguageNames] = {}
        self._initialized: bool = False

    def init(self) -> None:
        """Initialize from API + extras.

        1. Fetch all locales from the CV languagedata API
        2. Append extras for locales missing from the API

        Raises on API failure -- language names are required for correct MDC metadata.
        """
        self._registry.clear()

        self._fetch_from_api()

        for code, names in self.EXTRAS.items():
            if code not in self._registry:
                self._registry[code] = names

        if self.EXTRAS:
            logger.info("LANG", "Appended %d extras: %s", len(self.EXTRAS), ", ".join(self.EXTRAS))

        self._initialized = True
        logger.info("LANG", "Initialized: %d locales", len(self._registry))

    def find(self, locale: str) -> LanguageNames:
        """Look up language names for a locale.

        Returns (english_name, native_name).
        Raises ValueError if locale is not found.
        Raises RuntimeError if init() has not been called.
        """
        if not self._initialized:
            raise RuntimeError("LanguageRegistry.init() must be called before find()")

        if locale in self._registry:
            return self._registry[locale]

        raise ValueError(
            f"Locale {locale!r} not found in language registry "
            f"({len(self._registry)} locales loaded). "
            f"If this is a new locale, add it to LanguageRegistry.EXTRAS."
        )

    def _fetch_from_api(self) -> None:
        """Fetch all locales from the CV languagedata API."""
        logger.info("LANG", "Fetching language data from %s", CV_API_URL)
        with httpx.Client(timeout=30.0, verify=False) as client:
            resp = client.get(CV_API_URL)
            resp.raise_for_status()
            data: list[dict[str, Any]] = resp.json()

        for entry in data:
            code = entry.get("code", "")
            english = entry.get("english_name", "")
            native = entry.get("native_name", "")
            if code and english and native:
                self._registry[code] = (english, native)

        logger.info("LANG", "API returned %d locales", len(self._registry))


# Module-level singleton -- use via language.init() / language.find()
_instance = LanguageRegistry()
init = _instance.init
find = _instance.find
