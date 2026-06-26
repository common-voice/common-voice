"""Configuration for mdc-disable."""

from __future__ import annotations

import os
from dataclasses import dataclass

from mdc_disabler.constants import MDC_ORG_IDS, MDC_SITE_URLS
from mdc_uploader.config import resolve_base_dir
from mdc_uploader.constants import MDC_API_URLS
from mdc_uploader.typedef import MDCTarget


@dataclass(frozen=True)
class DisablerConfig:
    """Resolved configuration for a disable run."""

    target: MDCTarget
    modality: str
    version: str
    locales: list[str] | None
    api_url: str
    api_key: str
    org_id: str
    site_base: str
    base_dir: str
    dry_run: bool
    verbose: bool
    assume_yes: bool
    force_rescrape: bool
    state_file: str
    log_file: str | None

    @classmethod
    def from_cli(  # pylint: disable=too-many-arguments
        cls,
        *,
        target: MDCTarget,
        modality: str,
        version: str,
        locales: str | None,
        base_dir: str | None,
        dry_run: bool,
        verbose: bool,
        assume_yes: bool,
        force_rescrape: bool,
        state_file: str | None,
        log_file: str | None,
        api_key: str,
    ) -> DisablerConfig:
        """Build config from CLI args and environment variables."""
        locale_list = (
            [loc.strip() for loc in locales.split() if loc.strip()] if locales else None
        )
        resolved_state = state_file or os.path.join(
            ".state", f"mdc-disable-{modality}-{version}-state.json"
        )
        return cls(
            target=target,
            modality=modality,
            version=version,
            locales=locale_list,
            api_url=MDC_API_URLS[target],
            api_key=api_key,
            org_id=os.environ.get("MDC_ORG_ID") or MDC_ORG_IDS.get(target, ""),
            site_base=MDC_SITE_URLS[target],
            base_dir=resolve_base_dir(base_dir),
            dry_run=dry_run,
            verbose=verbose,
            assume_yes=assume_yes,
            force_rescrape=force_rescrape,
            state_file=resolved_state,
            log_file=log_file,
        )
