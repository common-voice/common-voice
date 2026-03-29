"""GCS-to-MDC direct streaming upload -- no temp files.

Reads GCS blobs in part-sized chunks via range reads and PUTs each chunk
directly to an MDC presigned URL.  Memory usage is constant at ~part_size
(256 MB) regardless of file size.  Disk usage is zero.

Resume is supported via the same UploadState format used by the SDK:
completed part ETags are persisted after each chunk, and on retry only
missing parts are uploaded (all bytes are still read for SHA-256).
"""

from __future__ import annotations

import hashlib
import math
import os
import time
from pathlib import Path

import datacollective.upload_utils as _dc_upload_utils
from datacollective.api_utils import _get_api_url, _send_api_request
from datacollective.models import UploadPart
from datacollective.upload_utils import (
    DEFAULT_MIME_TYPE,
    MAX_UPLOAD_BYTES,
    UploadState,
    _complete_upload,
    _extract_etag,
    _get_presigned_part_url,
    _load_upload_state,
    _save_upload_state,
    _upload_part_with_retry,
)
from google.cloud import storage as gcs_storage  # type: ignore[import-untyped]

from mdc_uploader.log import logger
from mdc_uploader.progress import format_size


def _initiate_upload_raw(
    submission_id: str,
    filename: str,
    file_size: int,
    mime_type: str = DEFAULT_MIME_TYPE,
) -> dict:
    """Initiate a multipart upload, bypassing the SDK's Pydantic model.

    The SDK's _initiate_upload() validates file_size via a Pydantic model
    whose ``le`` constraint is evaluated at class-definition time.  This
    function sends the same POST but skips client-side validation, so the
    server decides whether the size is acceptable.
    """
    payload = {
        "submissionId": submission_id,
        "filename": filename,
        "fileSize": file_size,
        "mimeType": mime_type,
    }
    url = f"{_get_api_url()}/uploads"
    resp = _send_api_request("POST", url, json_body=payload)
    return dict(resp.json())


def stream_upload_from_gcs(
    bucket_name: str,
    blob_path: str,
    submission_id: str,
    state_path: str,
    part_size: int | None = None,
) -> UploadState:
    """Upload a GCS blob to MDC without downloading to disk.

    Reads the blob in ``part_size`` chunks using GCS range reads and PUTs
    each chunk directly to an MDC presigned URL.

    Args:
        bucket_name: GCS bucket name.
        blob_path: Full blob path within the bucket.
        submission_id: MDC submission ID (draft must already exist).
        state_path: Path to persist upload state for resume.
        part_size: Chunk size in bytes.  Resolved at call time from
            ``datacollective.upload_utils.DEFAULT_PART_SIZE`` (256 MB
            after mdc.py override) when *None*.

    Returns:
        Completed UploadState with checksum and all part ETags.
    """
    if part_size is None:
        part_size = _dc_upload_utils.DEFAULT_PART_SIZE

    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_path)
    blob.reload()

    file_size = blob.size
    if not file_size or file_size <= 0:
        raise ValueError(f"Blob has no content: gs://{bucket_name}/{blob_path}")
    if file_size > MAX_UPLOAD_BYTES:
        raise ValueError(
            f"Blob exceeds upload limit ({format_size(file_size)} > "
            f"{format_size(MAX_UPLOAD_BYTES)})"
        )

    filename = os.path.basename(blob_path)
    state_file = Path(state_path)

    # -- Resume: load existing state if available ----------------------------
    state = _load_or_resume(state_file, submission_id, filename, file_size,
                            part_size)
    # Use state.partSize for the loop -- it may differ from the requested
    # part_size if the server chose a different value or we resumed from
    # an existing state file.
    effective_part_size = state.partSize
    if effective_part_size <= 0:
        raise ValueError(
            f"Invalid partSize ({effective_part_size}) in upload state -- "
            "corrupt state file or unexpected server response"
        )
    num_parts = int(math.ceil(file_size / effective_part_size))
    parts_done: dict[int, str] = {p.partNumber: p.etag for p in state.parts}

    logger.info(
        "STREAM",
        "Streaming gs://%s/%s (%s, %d parts of %s)",
        bucket_name,
        blob_path,
        format_size(file_size),
        num_parts,
        format_size(effective_part_size),
    )
    if parts_done:
        logger.info(
            "STREAM",
            "Resuming: %d/%d parts already uploaded",
            len(parts_done),
            num_parts,
        )

    # -- Part loop -----------------------------------------------------------
    hasher = hashlib.sha256()
    t0 = time.monotonic()
    bytes_uploaded = 0

    for part_number in range(1, num_parts + 1):
        start = (part_number - 1) * effective_part_size
        end = min(start + effective_part_size, file_size)
        chunk_len = end - start

        # GCS range read -- only this chunk in memory
        chunk = blob.download_as_bytes(start=start, end=end - 1)
        hasher.update(chunk)

        if part_number in parts_done:
            continue

        presigned = _get_presigned_part_url(state.fileUploadId, part_number)
        response = _upload_part_with_retry(presigned.url, chunk)
        etag = _extract_etag(response)
        parts_done[part_number] = etag
        bytes_uploaded += chunk_len

        # Persist state for resume
        state.parts = [
            UploadPart(partNumber=n, etag=e)
            for n, e in sorted(parts_done.items())
        ]
        _save_upload_state(state_file, state)

        elapsed = time.monotonic() - t0
        speed = bytes_uploaded / elapsed if elapsed > 0 else 0
        logger.info(
            "STREAM",
            "Part %d/%d (%s, %s uploaded) -- %.1f MB/s",
            part_number,
            num_parts,
            format_size(chunk_len),
            format_size(bytes_uploaded),
            speed / (1024 * 1024),
        )

    # -- Complete upload -----------------------------------------------------
    state.checksum = hasher.hexdigest()
    state.parts = [
        UploadPart(partNumber=n, etag=e)
        for n, e in sorted(parts_done.items())
    ]
    _save_upload_state(state_file, state)

    _complete_upload(state.fileUploadId, state.uploadId, state.parts, state.checksum)

    elapsed = time.monotonic() - t0
    speed = file_size / elapsed if elapsed > 0 else 0
    logger.info(
        "STREAM",
        "Upload complete: %s in %.0fs (%.1f MB/s avg), file_upload_id=%s",
        format_size(file_size),
        elapsed,
        speed / (1024 * 1024),
        state.fileUploadId,
    )

    return state


def _load_or_resume(
    state_file: Path,
    submission_id: str,
    filename: str,
    file_size: int,
    part_size: int,
) -> UploadState:
    """Load existing upload state or initiate a new multipart upload."""
    state = _load_upload_state(state_file)
    if state is not None:
        # Validate that state matches this upload
        if (
            state.submissionId == submission_id
            and state.filename == filename
            and state.fileSize == file_size
        ):
            logger.info("STREAM", "Resuming from state: %s", state_file)
            return state
        logger.warning(
            "STREAM",
            "State file mismatch (submission/file/size) -- starting fresh",
        )

    # Initiate new multipart upload
    logger.info(
        "STREAM",
        "Initiating upload: %s (%s)",
        filename,
        format_size(file_size),
    )
    data = _initiate_upload_raw(submission_id, filename, file_size)
    file_upload_id = str(data.get("fileUploadId", ""))
    upload_id_raw = data.get("uploadId")
    upload_id = upload_id_raw if isinstance(upload_id_raw, str) else ""
    server_part_size = int(data.get("partSize", 0)) or part_size

    if not file_upload_id:
        raise RuntimeError("Upload initiation did not return fileUploadId")

    state = UploadState(
        submissionId=submission_id,
        fileUploadId=file_upload_id,
        uploadId=upload_id,
        fileSize=file_size,
        partSize=server_part_size,
        filename=filename,
        mimeType=DEFAULT_MIME_TYPE,
        parts=[],
        checksum=None,
    )
    _save_upload_state(state_file, state)
    return state
