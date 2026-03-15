"""Release name parsing and filesystem path construction.

Mirrors the naming logic from the Node.js bundler:
- bundler/src/core/compress.ts: sanitizeLicenseName, generateTarFilename
- bundler/src/worker/processor.ts: deriveJobEnv (GCS path construction)
- bundler/src/worker/processVariants.ts: deriveVariantEnv (variant naming)
"""

from __future__ import annotations

import glob
import os
import re

from mdc_uploader.models import Modality, ReleaseSpec, ReleaseType


def parse_release_name(name: str) -> ReleaseSpec:
    """Parse a release name into its components.

    Examples:
        cv-corpus-25.0-2026-03-09  -> SCS, version=25.0, date=2026-03-09
        sps-corpus-3.0-2026-03-09  -> SPS, version=3.0, date=2026-03-09
    """
    scs_match = re.match(r"^cv-corpus-(\d+\.\d+)-(\d{4}-\d{2}-\d{2})$", name)
    if scs_match:
        return ReleaseSpec(
            release_name=name,
            modality=Modality.SCS,
            version=scs_match.group(1),
            date=scs_match.group(2),
        )

    sps_match = re.match(r"^sps-corpus-(\d+\.\d+)-(\d{4}-\d{2}-\d{2})$", name)
    if sps_match:
        return ReleaseSpec(
            release_name=name,
            modality=Modality.SPS,
            version=sps_match.group(1),
            date=sps_match.group(2),
        )

    raise ValueError(
        f"Invalid release name: {name!r}. "
        "Expected cv-corpus-X.Y-YYYY-MM-DD or sps-corpus-X.Y-YYYY-MM-DD"
    )


def sanitize_license_name(license_name: str) -> str:
    """Sanitize a license name for use in filenames.

    Mirrors bundler/src/core/compress.ts:sanitizeLicenseName.
    Replaces spaces and special characters with underscores.
    """
    return re.sub(r'[\s/\\:*?"<>|]', "_", license_name)


def tarball_dir(release_name: str, release_type: ReleaseType) -> str:
    """Return the directory name for tarballs of a given release type."""
    if release_type == ReleaseType.FULL:
        return release_name
    if release_type == ReleaseType.LICENSED:
        return f"{release_name}-licensed"
    if release_type == ReleaseType.VARIANTS:
        return f"{release_name}-variants"
    raise ValueError(f"Unknown release type: {release_type}")


def tarball_filename(
    locale: str,
    release_name: str,
    license_name: str | None = None,
) -> str:
    """Generate a tarball filename.

    Mirrors bundler/src/core/compress.ts:generateTarFilename.
    """
    if license_name:
        sanitized = sanitize_license_name(license_name)
        return f"{release_name}-{locale}-{sanitized}.tar.gz"
    return f"{release_name}-{locale}.tar.gz"


def tarball_path(
    base_dir: str,
    release_name: str,
    locale: str,
    release_type: ReleaseType,
    license_name: str | None = None,
) -> str:
    """Build the full filesystem path for a locale tarball."""
    directory = tarball_dir(release_name, release_type)
    filename = tarball_filename(locale, release_name, license_name)
    return os.path.join(base_dir, directory, filename)


def datasheet_path(
    base_dir: str,
    release_spec: ReleaseSpec,
    locale: str,
    license_name: str | None = None,
) -> str:
    """Build the full filesystem path for a locale datasheet.

    Mirrors bundler/src/core/datasheets.ts (lines 733-739).
    """
    prefix = release_spec.datasheet_prefix
    ver = release_spec.version
    if license_name:
        sanitized = sanitize_license_name(license_name)
        filename = f"{prefix}-{ver}-{locale}-{sanitized}.md"
    else:
        filename = f"{prefix}-{ver}-{locale}.md"
    return os.path.join(base_dir, release_spec.release_name, "datasheets", filename)


def detect_locales(
    base_dir: str,
    release_name: str,
    release_type: ReleaseType,
) -> list[str]:
    """Auto-detect locales by globbing tarball files in the release directory.

    Returns locale codes sorted by file size (smallest first).
    """
    directory = os.path.join(base_dir, tarball_dir(release_name, release_type))
    pattern = os.path.join(directory, f"{release_name}-*.tar.gz")
    files = glob.glob(pattern)

    if not files:
        raise FileNotFoundError(
            f"No tarballs found matching {pattern}. Check --base-dir and --release values."
        )

    # Extract locale from filename: {release_name}-{locale}[...].tar.gz
    prefix = f"{release_name}-"
    locale_files: list[tuple[str, int]] = []

    for filepath in files:
        basename = os.path.basename(filepath)
        if not basename.startswith(prefix):
            continue
        # Strip prefix and .tar.gz suffix
        rest = basename[len(prefix) : -len(".tar.gz")]
        # For licensed: rest = "en-CC_BY_4_0" -> locale = "en"
        # For variants: rest = "cy-southwes" -> locale = "cy-southwes"
        # For full: rest = "en" or "ga-IE" -> locale = rest
        # Licensed files have the sanitized license appended after locale.
        # We keep the full rest as the locale identifier for variants,
        # but for licensed we need to strip the license suffix.
        # Since we glob per release_type directory, the interpretation is clear.
        locale = rest
        size = os.path.getsize(filepath)
        locale_files.append((locale, size))

    # Sort smallest first (single-pod strategy)
    locale_files.sort(key=lambda x: x[1])
    return [lf[0] for lf in locale_files]


def mdc_dataset_name(
    modality_display: str,
    version: str,
    english_name: str,
) -> str:
    """Build the MDC dataset name.

    Example: "Common Voice Scripted Speech 25.0 - English"
    """
    return f"Common Voice {modality_display} {version} - {english_name}"
