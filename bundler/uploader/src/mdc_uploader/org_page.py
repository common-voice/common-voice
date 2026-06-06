"""MDC org page scraping: discover all dataset submissions for our organization.

Fetches the server-side-rendered org page and regex-parses locale codes,
submission IDs, and dataset names. Saves/loads a stable GCS snapshot so
subsequent runs reuse the cached data without re-scraping.

T0.2: Validate regex patterns against actual MDC org page HTML before activating disable calls.
"""

from __future__ import annotations

import json
import os
import re
from datetime import UTC, datetime

import httpx

from mdc_uploader.constants import MDC_ORG_ID, MDC_SITE_BASE
from mdc_uploader.gcs import gcs_read_text, gcs_write_text, is_gcs_uri
from mdc_uploader.log import logger
from mdc_uploader.models import Modality, OrgDataset

# Stable snapshot blob paths relative to base_dir (no timestamp, no release)
_SNAPSHOT_JSON = ".state/org-snapshot.json"
_SNAPSHOT_TSV = ".state/org-snapshot.tsv"

# Snapshots older than this are treated as stale and trigger a fresh scrape.
_SNAPSHOT_MAX_AGE_HOURS = 48

# Strip HTML tags from anchor content
_TAG_RE = re.compile(r"<[^>]+>")

# Dataset name format: "Common Voice Scripted Speech 25.0 - English"
_NAME_RE = re.compile(
    r"^Common Voice (Scripted|Spontaneous) Speech (\d+\.\d+) - (.+)$"
)

# href="/datasets/{id}" with DOTALL to capture anchor content including inner HTML; caller strips via _TAG_RE.
_LINK_RE = re.compile(
    r'href="/datasets/([a-z0-9]{15,})"[^>]*>(.*?)</a>',
    re.DOTALL | re.IGNORECASE,
)

# HTML table row
_ROW_RE = re.compile(r"<tr\b[^>]*>(.*?)</tr>", re.DOTALL | re.IGNORECASE)

# HTML table cell text
_CELL_RE = re.compile(r"<td[^>]*>\s*([^<\s][^<]*?)\s*</td>", re.IGNORECASE)

# Valid locale code: "en", "rm-vallader", "zh-TW", etc.
_LOCALE_CODE_RE = re.compile(r"^[a-z]{2,3}(?:-[a-zA-Z0-9]+)*$")


def fetch_org_datasets(
    site_base: str = MDC_SITE_BASE,
    org_id: str = MDC_ORG_ID,
    timeout: int = 30,
) -> list[OrgDataset]:
    """GET /organization/{org_id} and regex-parse datasets from HTML.

    Returns [] on any HTTP or parse failure — caller decides how to proceed.
    T0.2: Validate and adjust regex patterns against actual MDC org page HTML.
    """
    url = f"{site_base}/organization/{org_id}"
    try:
        resp = httpx.get(url, timeout=timeout, follow_redirects=True)
        resp.raise_for_status()
    except Exception as exc:  # pylint: disable=broad-exception-caught
        logger.warning("ORG", "Failed to fetch org page %s: %s", url, exc)
        return []

    datasets = _parse_org_page(resp.text)
    if not datasets:
        logger.warning("ORG", "Org page parsed 0 matching datasets from %s", url)
    else:
        logger.info("ORG", "Fetched %d datasets from org page", len(datasets))
    return datasets


def _parse_org_page(html: str) -> list[OrgDataset]:
    """Parse org page HTML into an OrgDataset list.

    Expected HTML structure: a table where each row contains a dataset link
    (href="/datasets/{id}") and a locale code in an adjacent cell.

    T0.2: Adjust regex patterns after inspecting actual MDC org page HTML.
    """
    results: list[OrgDataset] = []
    seen_ids: set[str] = set()

    for row_m in _ROW_RE.finditer(html):
        row_html = row_m.group(1)

        # Find dataset link: href + anchor text (dataset name)
        link_m = _LINK_RE.search(row_html)
        if not link_m:
            continue
        submission_id = link_m.group(1)
        if submission_id in seen_ids:
            continue
        name = _TAG_RE.sub("", link_m.group(2)).strip()

        # Parse name: "Common Voice {Scripted|Spontaneous} Speech {version} - {locale_name}"
        name_m = _NAME_RE.match(name)
        if not name_m:
            continue
        modality_word, version, locale_name = name_m.groups()
        modality = "scs" if modality_word == "Scripted" else "sps"

        # Extract locale code: look for a standalone locale-code value in table cells
        locale_code = _extract_locale_code(row_html)
        if not locale_code:
            logger.warning(
                "ORG",
                "Could not extract locale code for %s (%s) -- skipping",
                submission_id,
                name,
            )
            continue

        seen_ids.add(submission_id)
        results.append(
            OrgDataset(
                locale_code=locale_code,
                modality=modality,
                version=version,
                submission_id=submission_id,
                name=name,
                locale_name=locale_name,
                href=f"/datasets/{submission_id}",
            )
        )

    return results


def _extract_locale_code(row_html: str) -> str:
    """Extract locale code from a table row's cells or data attributes."""
    # Primary: look for a <td> containing only a locale-code value
    for cell_m in _CELL_RE.finditer(row_html):
        cell_text = cell_m.group(1).strip()
        if _LOCALE_CODE_RE.match(cell_text):
            return cell_text

    # Fallback 1: data-locale="..." attribute on any element
    attr_m = re.search(r'data-locale="([a-z][a-z0-9-]+)"', row_html, re.IGNORECASE)
    if attr_m:
        return attr_m.group(1)

    # Fallback 2: strip HTML and scan text tokens for a locale-shaped value.
    plain = _TAG_RE.sub(" ", row_html)
    for token in plain.split():
        if _LOCALE_CODE_RE.match(token):
            return token

    return ""


def load_org_snapshot(gcs_base: str) -> list[OrgDataset] | None:
    """Load org-snapshot.json from GCS or local .state/.

    Returns None on cache miss or parse error — caller should scrape fresh.
    """
    raw: str | None
    if is_gcs_uri(gcs_base):
        raw = gcs_read_text(gcs_base, _SNAPSHOT_JSON)
    else:
        local_path = os.path.join(gcs_base, _SNAPSHOT_JSON)
        try:
            with open(local_path, encoding="utf-8") as f:
                raw = f.read()
        except FileNotFoundError:
            return None
        except OSError as exc:
            logger.warning("ORG", "Failed to read local snapshot: %s", exc)
            return None

    if raw is None:
        return None

    try:
        data = json.loads(raw)
        scraped_at_str = data.get("scraped_at", "")
        if scraped_at_str:
            try:
                age_hours = (
                    datetime.now(UTC) - datetime.fromisoformat(scraped_at_str)
                ).total_seconds() / 3600
                if age_hours > _SNAPSHOT_MAX_AGE_HOURS:
                    logger.warning(
                        "ORG",
                        "Org snapshot is %.0fh old (max %dh) -- will re-scrape",
                        age_hours,
                        _SNAPSHOT_MAX_AGE_HOURS,
                    )
                    return None
            except ValueError:
                pass  # malformed scraped_at — treat snapshot as fresh
        datasets = [
            OrgDataset(
                locale_code=entry["locale"],
                modality=entry["modality"],
                version=entry["version"],
                submission_id=entry["id"],
                name=entry["name"],
                locale_name=entry.get("locale_name", ""),
                href=f'/datasets/{entry["id"]}',
            )
            for entry in data.get("datasets", [])
        ]
        logger.info(
            "ORG",
            "Loaded %d datasets from snapshot (scraped_at=%s)",
            len(datasets),
            scraped_at_str or "?",
        )
        return datasets
    except (KeyError, ValueError, TypeError) as exc:
        logger.warning("ORG", "Failed to parse org snapshot: %s", exc)
        return None


def save_org_snapshot(datasets: list[OrgDataset], gcs_base: str) -> None:
    """Write org-snapshot.json + org-snapshot.tsv to GCS or local .state/.

    Best-effort: logs on failure, never raises.
    """
    scraped_at = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    data = {
        "scraped_at": scraped_at,
        "org_id": MDC_ORG_ID,
        "total": len(datasets),
        "datasets": [
            {
                "locale": d.locale_code,
                "modality": d.modality,
                "version": d.version,
                "id": d.submission_id,
                "name": d.name,
            }
            for d in datasets
        ],
    }
    json_content = json.dumps(data, indent=2, ensure_ascii=False)

    tsv_lines = ["locale\tmodality\tversion\tid\tname"]
    tsv_lines.extend(
        f"{d.locale_code}\t{d.modality}\t{d.version}\t{d.submission_id}\t{d.name}"
        for d in datasets
    )
    tsv_content = "\n".join(tsv_lines) + "\n"

    try:
        if is_gcs_uri(gcs_base):
            gcs_write_text(gcs_base, _SNAPSHOT_JSON, json_content)
            gcs_write_text(gcs_base, _SNAPSHOT_TSV, tsv_content)
        else:
            state_dir = os.path.join(gcs_base, ".state")
            os.makedirs(state_dir, exist_ok=True)
            for fname, content in (
                (os.path.join(state_dir, "org-snapshot.json"), json_content),
                (os.path.join(state_dir, "org-snapshot.tsv"), tsv_content),
            ):
                with open(fname, "w", encoding="utf-8") as f:
                    f.write(content)
            logger.info("ORG", "Saved org snapshot to %s", state_dir)
    except Exception as exc:  # pylint: disable=broad-exception-caught
        logger.warning("ORG", "Failed to save org snapshot: %s", exc)


def load_or_fetch(
    site_base: str = MDC_SITE_BASE,
    org_id: str = MDC_ORG_ID,
    gcs_base: str = "",
    force_rescrape: bool = False,
) -> list[OrgDataset]:
    """Return datasets from GCS cache, or scrape + save if missing or force_rescrape.

    Returns [] on total failure (all errors are logged).
    """
    if not force_rescrape and gcs_base:
        cached = load_org_snapshot(gcs_base)
        if cached is not None:
            return cached

    datasets = fetch_org_datasets(site_base=site_base, org_id=org_id)
    if datasets and gcs_base:
        save_org_snapshot(datasets, gcs_base)
    return datasets


def build_prior_map(
    datasets: list[OrgDataset],
    modality: Modality,
    current_version: str,
    current_submission_ids: set[str] | None = None,
) -> dict[str, list[str]]:
    """Return {locale_code -> [prior_submission_ids]} for the given modality.

    A "prior" entry matches on modality, has a version != current_version,
    and is not in current_submission_ids. Entries with a different modality
    are left untouched (one-time uploads preserved).
    """
    modality_val = modality.value
    exclude = current_submission_ids or set()
    prior_map: dict[str, list[str]] = {}

    for d in datasets:
        if d.modality != modality_val:
            continue
        if d.version == current_version:
            continue
        if d.submission_id in exclude:
            continue
        prior_map.setdefault(d.locale_code, []).append(d.submission_id)

    if prior_map:
        total_ids = sum(len(ids) for ids in prior_map.values())
        logger.info(
            "ORG",
            "Prior map: %d locale(s), %d submission(s) to potentially disable",
            len(prior_map),
            total_ids,
        )
    return prior_map
