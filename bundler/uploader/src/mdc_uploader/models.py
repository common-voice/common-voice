"""Data models for the MDC uploader."""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum

from mdc_uploader.typedef import UploadStatus


class Modality(StrEnum):
    """Speech modality (scripted or spontaneous)."""

    SCS = "scs"
    SPS = "sps"


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
