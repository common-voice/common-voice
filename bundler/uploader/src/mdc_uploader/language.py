"""Locale language data resolution.

Source of truth: Common Voice languagedata API.
Stores full LanguageData entries (mirrors common/language.ts).
Extras appended for locales missing from the API (el-CY, ms-MY).

Usage:
    language.init()
    entry = language.find("en")
    codes = language.all_codes()
    vcodes = language.variant_codes()
"""

from __future__ import annotations

from typing import Any

import httpx

from mdc_uploader.constants import CV_API_URL
from mdc_uploader.log import logger
from mdc_uploader.typedef import LanguageData


class LanguageRegistry:
    """Registry of locale data, loaded from API + hardcoded extras.

    All locales are kept regardless of is_contributable flag because
    SPS locales may not have SCS counterparts and those have is_contributable=0.
    """

    # Locales not present in the CV languagedata API.
    # Same data as cv-datasheets/metadata/locale-extras.json.
    EXTRAS: dict[str, LanguageData] = {
        "el-CY": LanguageData(
            id=0,
            code="el-CY",
            native_name="Κυπριακά Ελληνικά",
            english_name="Cypriot Greek",
            text_direction="LTR",
            variants=[],
            predefined_accents=[],
        ),
        "ms-MY": LanguageData(
            id=0,
            code="ms-MY",
            native_name="Bahasa Melayu",
            english_name="Bahasa Malay",
            text_direction="LTR",
            variants=[],
            predefined_accents=[],
        ),
    }

    def __init__(self) -> None:
        self._registry: dict[str, LanguageData] = {}
        self._initialized: bool = False

    def init(self) -> None:
        """Initialize from API + extras.

        1. Fetch all locales from the CV languagedata API
        2. Append extras for locales missing from the API

        Raises on API failure -- language data is required for correct MDC metadata.
        """
        self._registry.clear()

        self._fetch_from_api()

        for code, entry in self.EXTRAS.items():
            if code not in self._registry:
                self._registry[code] = entry

        if self.EXTRAS:
            logger.info("LANG", "Appended %d extras: %s", len(self.EXTRAS), ", ".join(self.EXTRAS))

        self._initialized = True
        logger.info("LANG", "Initialized: %d locales", len(self._registry))

    def _require_init(self) -> None:
        """Raise RuntimeError if init() has not been called."""
        if not self._initialized:
            raise RuntimeError("LanguageRegistry.init() must be called first")

    def all_codes(self) -> list[str]:
        """Return all known locale codes."""
        self._require_init()
        return list(self._registry.keys())

    def variant_codes(self) -> list[str]:
        """Return all variant codes across all locales."""
        self._require_init()
        codes: list[str] = []
        for entry in self._registry.values():
            for variant in entry.get("variants", []):
                codes.append(variant["code"])
        return codes

    def find(self, locale: str) -> LanguageData:
        """Look up full language data for a locale.

        Returns the full LanguageData entry.
        Raises ValueError if locale is not found.
        """
        self._require_init()

        if locale in self._registry:
            return self._registry[locale]

        raise ValueError(
            f"Locale {locale!r} not found in language registry "
            f"({len(self._registry)} locales loaded). "
            f"If this is a new locale, add it to LanguageRegistry.EXTRAS."
        )

    def find_by_variant(self, variant_code: str) -> LanguageData | None:
        """Look up the parent locale for a variant code.

        Returns the parent LanguageData entry, or None if not found.
        """
        self._require_init()
        for entry in self._registry.values():
            for variant in entry.get("variants", []):
                if variant["code"] == variant_code:
                    return entry
        return None

    def _fetch_from_api(self) -> None:
        """Fetch all locales from the CV languagedata API."""
        logger.info("LANG", "Fetching language data from %s", CV_API_URL)
        with httpx.Client(timeout=30.0) as client:
            resp = client.get(CV_API_URL)
            resp.raise_for_status()
            data: list[dict[str, Any]] = resp.json()

        for raw in data:
            code = raw.get("code", "")
            if not code:
                continue
            # Store as LanguageData -- the API response matches our TypedDict
            entry: LanguageData = raw  # type: ignore[assignment]
            self._registry[code] = entry

        logger.info("LANG", "API returned %d locales", len(self._registry))


# Module-level singleton -- use via language.init() / language.find()
_instance = LanguageRegistry()
init = _instance.init
find = _instance.find
find_by_variant = _instance.find_by_variant
all_codes = _instance.all_codes
variant_codes = _instance.variant_codes
