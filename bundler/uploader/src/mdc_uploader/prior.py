"""Prior version map for the disable-prior feature.

Single entry point used by both pre-mode (bulk disable before batch)
and post-mode (per-locale disable after success).
"""

from __future__ import annotations

from mdc_uploader import org_page
from mdc_uploader.constants import MDC_ORG_ID, MDC_SITE_BASE
from mdc_uploader.log import logger
from mdc_uploader.models import DisableMode, ReleaseSpec


def load_prior_map(
    disable_mode: DisableMode,
    base_dir: str,
    release_spec: ReleaseSpec,
    force_rescrape: bool = False,
    locales: set[str] | None = None,
    site_base: str = MDC_SITE_BASE,
    org_id: str = MDC_ORG_ID,
) -> dict[str, list[str]]:
    """Scrape the org page and return {locale_code -> [prior_submission_ids]}.

    {} when disable_mode is SKIP or the page can't be loaded. `locales` (if given)
    restricts the map to those codes.
    """
    if disable_mode == DisableMode.SKIP:
        return {}

    datasets = org_page.load_or_fetch(
        site_base=site_base,
        org_id=org_id,
        gcs_base=base_dir,
        force_rescrape=force_rescrape,
    )

    if not datasets:
        logger.warning("ORG", "No datasets loaded from org page -- skipping disable")
        return {}

    return org_page.build_prior_map(
        datasets=datasets,
        modality=release_spec.modality,
        current_version=release_spec.version,
        locales=locales,
    )
