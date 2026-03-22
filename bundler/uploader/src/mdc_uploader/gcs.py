"""GCS support for gs:// URIs via google-cloud-storage.

Used when --base-dir is a gs:// URI. Downloads tarballs to temp files
before uploading to MDC. See DEVELOPER.md for details.
"""

from __future__ import annotations

import os
import tempfile
from collections.abc import Generator
from contextlib import contextmanager

from google.cloud import storage as gcs_storage  # type: ignore[import-untyped]

from mdc_uploader.log import logger
from mdc_uploader.progress import format_size


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


@contextmanager
def gcs_temp_download(
    gcs_uri: str,
    blob_path: str,
) -> Generator[str, None, None]:
    """Download a GCS blob to a temp file and yield the local path.

    Cleans up the temp file on exit.
    """
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
    license_name: str | None = None,
    is_variants: bool = False,
) -> list[tuple[str, int]]:
    """List tarball blobs for known locales under a GCS prefix.

    Uses the already-initialized LanguageRegistry as the source of known codes.
    For variants, checks variant codes. For other types, checks base locale codes.
    Returns list of (locale, size_bytes) sorted by size ascending.
    """
    from mdc_uploader import language  # pylint: disable=import-outside-toplevel
    from mdc_uploader.naming import tarball_filename  # pylint: disable=import-outside-toplevel

    bucket_name, base_prefix = _parse_gcs_uri(gcs_uri)

    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)

    codes = language.variant_codes() if is_variants else language.all_codes()
    results: list[tuple[str, int]] = []

    for code in codes:
        fname = tarball_filename(code, release_name, license_name)
        blob_path = f"{base_prefix}/{subdir}/{fname}" if base_prefix else f"{subdir}/{fname}"
        blob = bucket.blob(blob_path)
        if blob.exists():
            blob.reload()
            results.append((code, blob.size or 0))

    results.sort(key=lambda x: x[1])
    return results


def gcs_upload_file(gcs_uri: str, blob_path: str, local_path: str) -> None:
    """Upload a local file to a GCS blob."""
    bucket_name, base_prefix = _parse_gcs_uri(gcs_uri)
    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)
    full_path = f"{base_prefix}/{blob_path}" if base_prefix else blob_path
    blob = bucket.blob(full_path)
    blob.upload_from_filename(local_path)
    logger.info("GCS", "Uploaded -> gs://%s/%s", bucket_name, full_path)


def gcs_read_text(gcs_uri: str, blob_path: str) -> str | None:
    """Read a text file from GCS. Returns None if not found."""
    bucket_name, base_prefix = _parse_gcs_uri(gcs_uri)

    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)
    full_path = f"{base_prefix}/{blob_path}" if base_prefix else blob_path
    blob = bucket.blob(full_path)

    if not blob.exists():
        return None

    text: str = blob.download_as_text()
    return text
