"""Shared type definitions for the MDC uploader."""

from __future__ import annotations

from typing import Literal, TypedDict

# -- Literal types ------------------------------------------------------------

UploadStatus = Literal["success", "failed", "skipped"]
"""Result status for a single locale upload."""

MDCTarget = Literal["dev", "prod"]
"""MDC environment target."""


# -- Language data (mirrors common/language.ts) --------------------------------


class VariantData(TypedDict):
    """A locale variant (e.g. fr-europe, cy-southwes)."""

    id: int
    code: str
    name: str
    type: str | None
    locale_id: int


class AccentData(TypedDict):
    """A predefined accent (e.g. us, australia)."""

    id: int
    code: str
    name: str
    locale_id: int


class _LanguageDataOptional(TypedDict, total=False):
    """Optional fields in the languagedata API response."""

    target_sentence_count: int
    english_name: str
    is_contributable: int
    is_translated: int


class LanguageData(_LanguageDataOptional):
    """Full locale entry from the Common Voice languagedata API.

    Mirrors common/language.ts:LanguageData.
    """

    id: int
    code: str
    native_name: str
    text_direction: str
    variants: list[VariantData]
    predefined_accents: list[AccentData]


# -- Batch state ---------------------------------------------------------------


class _LocaleStateOptional(TypedDict, total=False):
    """Optional keys in a per-locale state entry."""

    submission_id: str
    file_upload_id: str
    error: str
    orphaned_draft: bool


class LocaleStateEntry(_LocaleStateOptional):
    """Per-locale entry in the batch state JSON."""

    status: UploadStatus
    size_bytes: int
    duration_seconds: float
    attempts: int


class DescriptionTemplate(TypedDict):
    """Short/long description template pair per modality."""

    short: str
    long: str


class _OrphanedSubmission(TypedDict):
    """Recovery data for a failed submission with uploaded file."""

    submission_id: str
    file_upload_id: str


class RetryStateData(TypedDict):
    """Data extracted from a state file for --retry-failed."""

    release: str
    upload_target: str
    type: str
    base_dir: str | None
    failed_locales: list[str]
    orphaned_submissions: dict[str, _OrphanedSubmission]
