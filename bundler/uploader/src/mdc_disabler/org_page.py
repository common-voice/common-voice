"""MDC org page scraping: discover the organization's published datasets.

Fetches the server-side-rendered org page and regex-parses locale codes,
dataset ids, and dataset names. Saves/loads a stable GCS snapshot so
subsequent runs reuse the cached data without re-scraping.
"""

from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from datetime import UTC, datetime

import httpx

from mdc_disabler.constants import MDC_ORG_ID, MDC_SITE_BASE
from mdc_uploader.gcs import gcs_read_text, gcs_write_text, is_gcs_uri
from mdc_uploader.log import logger

# Stable snapshot blob paths relative to base_dir (no timestamp, no release)
_SNAPSHOT_JSON = ".state/org-snapshot.json"
_SNAPSHOT_TSV = ".state/org-snapshot.tsv"

# Snapshots older than this are treated as stale and trigger a fresh scrape.
_SNAPSHOT_MAX_AGE_HOURS = 48

# Strip HTML tags from anchor content
_TAG_RE = re.compile(r"<[^>]+>")

# Dataset name format: "Common Voice Scripted Speech 25.0 - English"
_NAME_RE = re.compile(r"^Common Voice (Scripted|Spontaneous) Speech (\d+\.\d+) - (.+)$")

# href="/datasets/{id}" with DOTALL to capture anchor inner HTML; caller strips via _TAG_RE.
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


@dataclass
class OrgDataset:
    """A dataset scraped from the MDC org page (the id is a dataset id)."""

    locale_code: str   # e.g. "en", "rm-vallader"
    modality: str      # "scs" | "sps" (parsed from name)
    version: str       # e.g. "25.0" (parsed from name)
    dataset_id: str    # the /datasets/{id} value -- a dataset id, not a submission id
    name: str          # full display name
    locale_name: str   # English locale name from the name field
    href: str          # "/datasets/{dataset_id}"


def fetch_org_datasets(
    site_base: str = MDC_SITE_BASE,
    org_id: str = MDC_ORG_ID,
    timeout: int = 30,
) -> list[OrgDataset]:
    """GET /organization/{org_id} and regex-parse datasets from HTML.

    Returns [] on any HTTP or parse failure -- caller decides how to proceed.
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

    Each row contains a dataset link (href="/datasets/{id}") and a locale code
    in an adjacent cell.
    """
    results: list[OrgDataset] = []
    seen_ids: set[str] = set()

    for row_m in _ROW_RE.finditer(html):
        row_html = row_m.group(1)

        link_m = _LINK_RE.search(row_html)
        if not link_m:
            continue
        dataset_id = link_m.group(1)
        if dataset_id in seen_ids:
            continue
        name = _TAG_RE.sub("", link_m.group(2)).strip()

        name_m = _NAME_RE.match(name)
        if not name_m:
            continue
        modality_word, version, locale_name = name_m.groups()
        modality = "scs" if modality_word == "Scripted" else "sps"

        locale_code = _extract_locale_code(row_html)
        if not locale_code:
            logger.warning(
                "ORG",
                "Could not extract locale code for %s (%s) -- skipping",
                dataset_id,
                name,
            )
            continue

        seen_ids.add(dataset_id)
        results.append(
            OrgDataset(
                locale_code=locale_code,
                modality=modality,
                version=version,
                dataset_id=dataset_id,
                name=name,
                locale_name=locale_name,
                href=f"/datasets/{dataset_id}",
            )
        )

    return results


def _extract_locale_code(row_html: str) -> str:
    """Extract locale code from a table row's cells or data attributes."""
    # Primary: a <td> containing only a locale-code value
    for cell_m in _CELL_RE.finditer(row_html):
        cell_text = cell_m.group(1).strip()
        if _LOCALE_CODE_RE.match(cell_text):
            return cell_text

    # Fallback 1: data-locale="..." attribute
    attr_m = re.search(r'data-locale="([a-z][a-z0-9-]+)"', row_html, re.IGNORECASE)
    if attr_m:
        return attr_m.group(1)

    # Fallback 2: scan plain-text tokens for a locale-shaped value
    plain = _TAG_RE.sub(" ", row_html)
    for token in plain.split():
        if _LOCALE_CODE_RE.match(token):
            return token

    return ""


def load_org_snapshot(gcs_base: str) -> list[OrgDataset] | None:
    """Load org-snapshot.json from GCS or local .state/.

    Returns None on cache miss, parse error, or staleness -- caller scrapes fresh.
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
                pass  # malformed scraped_at -- treat snapshot as fresh
        datasets = [
            OrgDataset(
                locale_code=entry["locale"],
                modality=entry["modality"],
                version=entry["version"],
                dataset_id=entry["id"],
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
                "id": d.dataset_id,
                "name": d.name,
                "locale_name": d.locale_name,
            }
            for d in datasets
        ],
    }
    json_content = json.dumps(data, indent=2, ensure_ascii=False)

    tsv_lines = ["locale\tmodality\tversion\tid\tname"]
    tsv_lines.extend(
        f"{d.locale_code}\t{d.modality}\t{d.version}\t{d.dataset_id}\t{d.name}"
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
    """Return datasets from cache, or scrape + save when missing or force_rescrape.

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
