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
) -> dict[str, list[str]]:
    """Return {locale_code -> [prior_submission_ids]}.

    Returns {} when disable_mode is SKIP or the org page cannot be loaded.
    Calls org_page.load_or_fetch() for both pre and post modes.

    Note: version filter in build_prior_map already excludes current-version entries.
    """
    if disable_mode == DisableMode.SKIP:
        return {}

    datasets = org_page.load_or_fetch(
        site_base=MDC_SITE_BASE,
        org_id=MDC_ORG_ID,
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
    )
