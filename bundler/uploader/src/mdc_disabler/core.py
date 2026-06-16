"""Selection, resume state, and the serial disable loop for mdc-disable."""

from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass, field

from mdc_disabler import org_page
from mdc_disabler.client import DisableClient
from mdc_disabler.config import DisablerConfig
from mdc_disabler.org_page import OrgDataset
from mdc_uploader.log import logger

# Fixed pacing between datasets to keep the request rate well under MDC's limiter.
DELAY_BETWEEN_DATASETS_SECONDS = 1.0


@dataclass
class DisableSummary:
    """Outcome counts for a disable run."""

    total: int = 0
    disabled: int = 0
    failed: int = 0
    skipped: int = 0
    failed_ids: list[str] = field(default_factory=list)


def select_targets(
    datasets: list[OrgDataset],
    modality: str,
    version: str,
    locales: set[str] | None,
) -> list[OrgDataset]:
    """Datasets matching modality + exact version (+ locales when given), sorted by locale."""
    out = [
        d
        for d in datasets
        if d.modality == modality
        and d.version == version
        and (locales is None or d.locale_code in locales)
    ]
    out.sort(key=lambda d: d.locale_code)
    return out


def load_state(path: str) -> dict[str, dict[str, str]]:
    """Load resume state ({dataset_id: {...}}). {} when missing/unreadable."""
    if not path or not os.path.exists(path):
        return {}
    try:
        with open(path, encoding="utf-8") as f:
            data: dict[str, dict[str, str]] = json.load(f)
        return data
    except (OSError, ValueError) as exc:
        logger.warning("DISABLE", "Could not read state %s: %s", path, exc)
        return {}


def save_state(path: str, state: dict[str, dict[str, str]]) -> None:
    """Write resume state as JSON (best-effort)."""
    if not path:
        return
    state_dir = os.path.dirname(path)
    if state_dir:
        os.makedirs(state_dir, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def run_disable(config: DisablerConfig, client: DisableClient | None) -> DisableSummary:
    """Scrape, select prior datasets, and set each to private (serial, resumable).

    client is None for dry-run; in that case no MDC calls are made.
    """
    datasets = org_page.load_or_fetch(
        site_base=config.site_base,
        org_id=config.org_id,
        gcs_base=config.base_dir,
        force_rescrape=config.force_rescrape,
    )
    if not datasets:
        logger.error("DISABLE", "No datasets from org page -- nothing to do")
        return DisableSummary()

    locales = set(config.locales) if config.locales else None
    targets = select_targets(datasets, config.modality, config.version, locales)
    summary = DisableSummary(total=len(targets))
    logger.info(
        "DISABLE",
        "%d %s %s dataset(s) selected to disable",
        len(targets),
        config.modality,
        config.version,
    )
    if not targets:
        return summary

    if config.dry_run or client is None:
        for d in targets:
            logger.info(
                "DISABLE",
                "DRY RUN -- would disable %s (%s) [%s]",
                d.locale_code,
                d.name,
                d.dataset_id,
            )
        summary.skipped = len(targets)
        return summary

    state = load_state(config.state_file)
    total = len(targets)
    for idx, d in enumerate(targets, 1):
        dataset_id = d.dataset_id
        entry = state.get(dataset_id, {})
        if entry.get("status") == "done":
            summary.skipped += 1
            logger.info(
                "DISABLE", "[%d/%d] %s already disabled -- skipping", idx, total, d.locale_code
            )
            continue

        submission_id = entry.get("submission_id") or client.resolve_submission_id(dataset_id)
        if not submission_id:
            summary.failed += 1
            summary.failed_ids.append(dataset_id)
            state[dataset_id] = {
                "locale": d.locale_code,
                "submission_id": "",
                "status": "failed",
                "error": "resolve failed",
            }
            save_state(config.state_file, state)
            continue

        ok = client.set_private(submission_id)
        state[dataset_id] = {
            "locale": d.locale_code,
            "submission_id": submission_id,
            "status": "done" if ok else "failed",
            "error": "" if ok else "patch failed",
        }
        save_state(config.state_file, state)
        if ok:
            summary.disabled += 1
            logger.info(
                "DISABLE",
                "[%d/%d] %s disabled (submission %s)",
                idx,
                total,
                d.locale_code,
                submission_id,
            )
        else:
            summary.failed += 1
            summary.failed_ids.append(dataset_id)

        if idx < total:
            time.sleep(DELAY_BETWEEN_DATASETS_SECONDS)

    return summary
