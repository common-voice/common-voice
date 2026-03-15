"""Optional GCS fallback via google-cloud-storage (pip install .[gcs]).

Used when --base-dir is a gs:// URI. Downloads tarballs to temp files
before uploading to MDC. See DEVELOPER.md for details.
"""

from __future__ import annotations

import os
import tempfile
from collections.abc import Generator
from contextlib import contextmanager

from mdc_uploader.log import logger
from mdc_uploader.progress import format_size

try:
    from google.cloud import storage as gcs_storage  # type: ignore[import-untyped]

    HAS_GCS = True
except ImportError:
    gcs_storage = None  # guarded by _require_gcs()
    HAS_GCS = False


def is_gcs_uri(path: str) -> bool:
    """Check if a path is a GCS URI (gs://...)."""
    return path.startswith("gs://")


def _parse_gcs_uri(uri: str) -> tuple[str, str]:
    """Parse gs://bucket/prefix into (bucket, prefix)."""
    without_scheme = uri[5:]  # strip "gs://"
    parts = without_scheme.split("/", 1)
    bucket = parts[0]
    prefix = parts[1] if len(parts) > 1 else ""
    return bucket, prefix


def _require_gcs() -> None:
    if not HAS_GCS:
        raise ImportError(
            "google-cloud-storage is required for gs:// URIs. "
            "Install with: pip install mdc-uploader[gcs]"
        )


@contextmanager
def gcs_temp_download(
    gcs_uri: str,
    blob_path: str,
) -> Generator[str, None, None]:
    """Download a GCS blob to a temp file and yield the local path.

    Cleans up the temp file on exit.
    """
    _require_gcs()
    assert gcs_storage is not None
    bucket_name, base_prefix = _parse_gcs_uri(gcs_uri)

    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)
    full_path = f"{base_prefix}/{blob_path}" if base_prefix else blob_path
    blob = bucket.blob(full_path)

    if not blob.exists():
        raise FileNotFoundError(f"GCS blob not found: gs://{bucket_name}/{full_path}")

    size = blob.size or 0
    logger.info("GCS", "Downloading gs://%s/%s (%s)", bucket_name, full_path, format_size(size))

    suffix = ".tar.gz" if blob_path.endswith(".tar.gz") else ""
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp_path = tmp.name

    try:
        blob.download_to_filename(tmp_path)
        logger.info("GCS", "Downloaded to %s", tmp_path)
        yield tmp_path
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def gcs_list_tarballs(
    gcs_uri: str,
    release_name: str,
    subdir: str,
) -> list[tuple[str, int]]:
    """List tarball blobs under a GCS prefix.

    Returns list of (locale, size_bytes) sorted by size ascending.
    """
    _require_gcs()
    assert gcs_storage is not None
    bucket_name, base_prefix = _parse_gcs_uri(gcs_uri)

    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)

    prefix = f"{base_prefix}/{subdir}/" if base_prefix else f"{subdir}/"
    blobs = bucket.list_blobs(prefix=prefix)

    tarball_prefix = f"{release_name}-"
    results: list[tuple[str, int]] = []

    for blob in blobs:
        name = os.path.basename(blob.name)
        if name.startswith(tarball_prefix) and name.endswith(".tar.gz"):
            locale = name[len(tarball_prefix) : -len(".tar.gz")]
            results.append((locale, blob.size or 0))

    results.sort(key=lambda x: x[1])
    return results


def gcs_read_text(gcs_uri: str, blob_path: str) -> str | None:
    """Read a text file from GCS. Returns None if not found."""
    _require_gcs()
    assert gcs_storage is not None
    bucket_name, base_prefix = _parse_gcs_uri(gcs_uri)

    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)
    full_path = f"{base_prefix}/{blob_path}" if base_prefix else blob_path
    blob = bucket.blob(full_path)

    if not blob.exists():
        return None

    text: str = blob.download_as_text()
    return text
