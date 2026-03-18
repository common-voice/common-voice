"""Release name parsing and filesystem path construction.

Mirrors the naming logic from the Node.js bundler:
- bundler/src/core/compress.ts: sanitizeLicenseName, generateTarFilename
- bundler/src/worker/processor.ts: deriveJobEnv (GCS path construction)
- bundler/src/worker/processVariants.ts: deriveVariantEnv (variant naming)
"""

from __future__ import annotations

import os
import re

from mdc_uploader.models import Modality, ReleaseSpec, ReleaseType


def parse_release_name(name: str) -> ReleaseSpec:
    """Parse a release name into its components.

    Examples:
        cv-corpus-25.0-2026-03-09        -> SCS, version=25.0, date=2026-03-09
        cv-corpus-25.0-delta-2026-03-09  -> SCS, version=25.0, date=2026-03-09 (delta)
        sps-corpus-3.0-2026-03-09        -> SPS, version=3.0, date=2026-03-09
        sps-corpus-3.0-delta-2026-03-09  -> SPS, version=3.0, date=2026-03-09 (delta)
    """
    # Pattern: {cv|sps}-corpus-{version}[-delta]-{date}
    match = re.match(r"^(cv|sps)-corpus-(\d+\.\d+)(?:-(delta))?-(\d{4}-\d{2}-\d{2})$", name)
    if match:
        prefix = match.group(1)
        modality = Modality.SCS if prefix == "cv" else Modality.SPS
        return ReleaseSpec(
            release_name=name,
            modality=modality,
            version=match.group(2),
            date=match.group(4),
            is_delta="delta" == match.group(3),
        )

    raise ValueError(
        f"Invalid release name: {name!r}. Expected [cv|sps]-corpus-X.Y[-delta]-YYYY-MM-DD"
    )


def sanitize_license_name(license_name: str) -> str:
    """Sanitize a license name for use in filenames.

    Mirrors bundler/src/core/compress.ts:sanitizeLicenseName.
    Replaces spaces and special characters with underscores.
    """
    return re.sub(r'[\s/\\:*?"<>|]', "_", license_name)


def tarball_dir(release_name: str, release_type: ReleaseType) -> str:
    """Return the directory name for tarballs of a given release type.

    Delta releases use the release name as-is (the name already contains '-delta-').
    Licensed appends '-licensed' to any release name (full or delta).
    """
    if release_type in (ReleaseType.FULL, ReleaseType.DELTA):
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
    # Must match bundler's releaseVersionTag: "25.0-2026-03-09" (version + date)
    version_tag = f"{release_spec.version}-{release_spec.date}"
    if license_name:
        sanitized = sanitize_license_name(license_name)
        filename = f"{prefix}-{version_tag}-{locale}-{sanitized}.md"
    else:
        filename = f"{prefix}-{version_tag}-{locale}.md"
    return os.path.join(base_dir, release_spec.release_name, "datasheets", filename)


def detect_locales(
    base_dir: str,
    release_name: str,
    release_type: ReleaseType,
    license_name: str | None = None,
) -> list[str]:
    """Auto-detect locales from the language registry by checking which tarballs exist.

    Uses the already-initialized LanguageRegistry as the source of known codes.
    For variants, checks variant codes (e.g. fr-europe, cy-southwes).
    For other types, checks base locale codes (e.g. en, ga-IE).
    Returns codes sorted by file size (smallest first).
    """
    from mdc_uploader import language  # pylint: disable=import-outside-toplevel

    if release_type == ReleaseType.VARIANTS:
        codes = language.variant_codes()
    else:
        codes = language.all_codes()

    locale_files: list[tuple[str, int]] = []

    for code in codes:
        tb = tarball_path(base_dir, release_name, code, release_type, license_name)
        if os.path.exists(tb):
            locale_files.append((code, os.path.getsize(tb)))

    if not locale_files:
        directory = os.path.join(base_dir, tarball_dir(release_name, release_type))
        raise FileNotFoundError(
            f"No tarballs found in {directory} for any known locale. "
            "Check --base-dir and --release values."
        )

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
