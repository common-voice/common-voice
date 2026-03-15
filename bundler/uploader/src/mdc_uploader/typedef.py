"""Shared type definitions for the MDC uploader."""

from __future__ import annotations

from typing import Literal, TypedDict

# -- Literal types ------------------------------------------------------------

UploadStatus = Literal["success", "failed", "skipped"]
"""Result status for a single locale upload."""

MDCTarget = Literal["dev", "prod"]
"""MDC environment target."""


# -- TypedDicts ---------------------------------------------------------------


class LocaleStateEntry(TypedDict, total=False):
    """Per-locale entry in the batch state JSON.

    Required keys: status, size_bytes, duration_seconds, attempts.
    Optional keys: submission_id, error, orphaned_draft.
    """

    status: UploadStatus
    size_bytes: int
    duration_seconds: float
    attempts: int
    submission_id: str
    error: str
    orphaned_draft: bool


class DescriptionTemplate(TypedDict):
    """Short/long description template pair per modality."""

    short: str
    long: str


class RetryStateData(TypedDict):
    """Data extracted from a state file for --retry-failed."""

    release: str
    upload_target: str
    type: str
    base_dir: str | None
    failed_locales: list[str]


# -- Type aliases -------------------------------------------------------------

LanguageNames = tuple[str, str]
"""(english_name, native_name) pair for a locale."""
