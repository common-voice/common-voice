"""Type stubs for datacollective.upload_utils (v0.4.5)."""

from pathlib import Path
from typing import Any

import requests
from datacollective.models import UploadPart

UPLOAD_TIMEOUT: tuple[int, int]
MAX_UPLOAD_RETRIES: int
RETRY_BACKOFF_SECONDS: int
DEFAULT_PART_SIZE: int
DEFAULT_MIME_TYPE: str
MAX_UPLOAD_BYTES: int

class UploadSession:
    fileUploadId: str
    uploadId: str
    partSize: int

class UploadState:
    submissionId: str
    fileUploadId: str
    uploadId: str
    fileSize: int
    partSize: int
    filename: str
    mimeType: str
    parts: list[UploadPart]
    checksum: str | None
    def __init__(
        self,
        *,
        submissionId: str,
        fileUploadId: str,
        uploadId: str,
        fileSize: int,
        partSize: int,
        filename: str,
        mimeType: str,
        parts: list[UploadPart] = ...,
        checksum: str | None = ...,
    ) -> None: ...
    def model_dump(self, **kwargs: Any) -> dict[str, Any]: ...

class PresignedPartUrl:
    partNumber: int
    url: str
    expiresAt: str | None

def _initiate_upload(
    submission_id: str, filename: str, file_size: int, mime_type: str
) -> UploadSession: ...
def _get_presigned_part_url(
    file_upload_id: str, part_number: int
) -> PresignedPartUrl: ...
def _complete_upload(
    file_upload_id: str,
    upload_id: str | None,
    parts: list[UploadPart],
    checksum: str,
) -> dict[str, Any]: ...
def _load_upload_state(path: Path) -> UploadState | None: ...
def _save_upload_state(path: Path, state: UploadState) -> None: ...
def _default_state_path(file_path: Path) -> Path: ...
def _load_or_create_state(
    state_file: Path,
    submission_id: str,
    final_filename: str,
    file_size: int,
) -> UploadState: ...
def _init_progress_bar(
    show_progress: bool,
    file_size: int,
    part_size: int,
    already_uploaded: int,
) -> Any: ...
def _upload_missing_parts(
    path: Path,
    state: UploadState,
    parts_by_number: dict[int, str],
    expected_parts: int,
    progress_bar: Any,
    state_file: Path,
) -> tuple[int, str]: ...
def _expected_parts(file_size: int, part_size: int) -> int: ...
def _normalize_parts(state: UploadState) -> dict[int, str]: ...
def _parts_from_mapping(parts_by_number: dict[int, str]) -> list[UploadPart]: ...
def _cleanup_state_file(state_file: Path) -> None: ...
def _upload_part(presigned_url: str, payload: bytes) -> requests.Response: ...
def _resolve_upload_state(
    file_path: str, state_path: str | None
) -> tuple[Path, UploadState | None]: ...
def _upload_part_with_retry(
    presigned_url: str,
    payload: bytes,
    max_retries: int = ...,
) -> requests.Response: ...
def _extract_etag(response: requests.Response) -> str: ...
