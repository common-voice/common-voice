"""Data models for the MDC uploader."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum

from mdc_uploader.typedef import UploadStatus


class Modality(StrEnum):
    """Speech modality (scripted or spontaneous)."""

    SCS = "scs"
    SPS = "sps"


class DisableMode(StrEnum):
    """Controls whether and when prior MDC dataset versions are disabled."""

    SKIP = "skip"
    PRE = "pre"
    POST = "post"


class ReleaseType(StrEnum):
    """Release type determining tarball directory and license."""

    FULL = "full"
    DELTA = "delta"
    LICENSED = "licensed"
    VARIANTS = "variants"


@dataclass(frozen=True)
class ReleaseSpec:
    """Parsed release name with derived fields."""

    release_name: str
    modality: Modality
    version: str
    date: str
    is_delta: bool = False

    @property
    def prefix(self) -> str:
        """Corpus prefix string (cv-corpus or sps-corpus)."""
        return "cv-corpus" if self.modality == Modality.SCS else "sps-corpus"

    @property
    def modality_display(self) -> str:
        """Human-readable modality name."""
        return "Scripted Speech" if self.modality == Modality.SCS else "Spontaneous Speech"

    @property
    def datasheet_prefix(self) -> str:
        """Datasheet filename prefix (cv-datasheet or sps-datasheet)."""
        return "cv-datasheet" if self.modality == Modality.SCS else "sps-datasheet"


@dataclass
class OrgDataset:
    """A dataset submission scraped from the MDC org page."""

    locale_code: str   # primary — e.g. "en", "rm-vallader" (from page table)
    modality: str      # "scs" | "sps" (parsed from name)
    version: str       # e.g. "25.0" (parsed from name)
    submission_id: str  # e.g. "cmfh0j9o10006ns07jq45h7xk"
    name: str          # full display name, e.g. "Common Voice Scripted Speech 25.0 - English"
    locale_name: str   # English locale name extracted from name field
    href: str          # "/datasets/{submission_id}"


@dataclass
class LocaleUploadJob:
    """A single locale upload job."""

    locale: str
    release_spec: ReleaseSpec
    release_type: ReleaseType
    tarball_path: str
    datasheet_path: str | None
    file_size: int
    submission_id: str | None = None  # None = new submission, set = version update
    license_type: str | None = None  # e.g. "CC-BY 4.0" for licensed releases
    # Recovery data from --retry-failed: skip steps 1-2, go straight to 3+4
    orphaned_submission_id: str | None = None
    orphaned_file_upload_id: str | None = None
    # Resume data from --resume: resume partial multipart upload from SDK state
    resume_state_path: str | None = None
    resume_submission_id: str | None = None


@dataclass
class UploadResult:
    """Result of a single locale upload."""

    locale: str
    status: UploadStatus
    submission_id: str | None = None
    file_upload_id: str | None = None
    size_bytes: int = 0
    duration_seconds: float = 0.0
    error: str | None = None
    orphaned_draft: bool = False
    attempts: int = 0
    # Disable-prior results (post-mode: set after successful upload)
    disabled_ids: list[str] = field(default_factory=list)
    disable_failed_ids: list[str] = field(default_factory=list)
    disable_pending_ids: list[str] = field(default_factory=list)
