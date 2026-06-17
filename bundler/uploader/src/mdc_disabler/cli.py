"""Command-line interface for mdc-disable."""

from __future__ import annotations

import os
import sys

import click

from mdc_disabler.client import DisableClient
from mdc_disabler.config import DisablerConfig
from mdc_disabler.core import run_disable
from mdc_uploader.gcs import gcs_upload_file, is_gcs_uri
from mdc_uploader.log import logger, setup_logging

EPILOG = """\b
Examples:
  mdc-disable -ut prod -m sps --version 3.0 --dry-run
  mdc-disable -ut prod -m sps --version 3.0
  mdc-disable -ut prod -m scs --version 25.0 -l "en ga-IE mt"
  mdc-disable -ut prod -m sps --version 3.0 --fresh --yes

\b
Environment variables:
  MDC_API_KEY_DEV   MDC API key for dev target (required for -ut dev)
  MDC_API_KEY_PROD  MDC API key for prod target (required for -ut prod)
  MDC_ORG_ID        Override the org id to scrape (default: per -ut; dev unset)
  UPLOAD_BASE_DIR              Override --base-dir (shared with mdc-upload)
  DATASETS_BUNDLER_BUCKET_NAME Auto-resolves to gs://<value> (shared with bundler)
"""


def _resolve_api_key(target: str, dry_run: bool) -> str:
    """Read MDC_API_KEY_<TARGET>. Empty allowed only for --dry-run."""
    target_var = f"MDC_API_KEY_{target.upper()}"
    key = os.environ.get(target_var, "")
    if not key and not dry_run:
        raise click.UsageError(f"{target_var} environment variable is required (or use --dry-run).")
    return key


def _upload_artifacts(config: DisablerConfig) -> None:
    """Best-effort copy of the log + state file to <base>/mdc-disable-logs/ (audit)."""
    if not is_gcs_uri(config.base_dir):
        return
    for path in (config.log_file, config.state_file):
        if path and os.path.exists(path):
            try:
                gcs_upload_file(config.base_dir, f"mdc-disable-logs/{os.path.basename(path)}", path)
            except Exception as exc:  # pylint: disable=broad-exception-caught
                logger.warning("DISABLE", "Could not upload %s: %s", path, exc)


@click.command(
    "mdc-disable",
    epilog=EPILOG,
    context_settings={"max_content_width": 100, "help_option_names": ["-h", "--help"]},
)
@click.option(
    "-ut",
    "--target",
    type=click.Choice(["dev", "prod"]),
    required=True,
    help="MDC environment to operate on.",
)
@click.option(
    "-m",
    "--modality",
    type=click.Choice(["sps", "scs"]),
    required=True,
    help="Speech modality.",
)
@click.option(
    "--version",
    required=True,
    help="Dataset version to disable, e.g. 3.0.",
)
@click.option(
    "-l",
    "--locales",
    default=None,
    help="Space-separated locale codes. When omitted, all locales of the version.",
)
@click.option(
    "--base-dir",
    default=None,
    envvar="UPLOAD_BASE_DIR",
    help="Base dir for org snapshot/state/logs. Default: gs://$DATASETS_BUNDLER_BUCKET_NAME.",
)
@click.option(
    "--state-file",
    default=None,
    help="Resume state path. Default: .state/mdc-disable-<modality>-<version>-state.json.",
)
@click.option(
    "--fresh",
    "force_rescrape",
    is_flag=True,
    help="Force a fresh org-page scrape instead of the cached snapshot.",
)
@click.option(
    "--dry-run",
    is_flag=True,
    help="List what would be disabled; make no changes.",
)
@click.option(
    "--yes",
    "assume_yes",
    is_flag=True,
    help="Skip the prod confirmation prompt.",
)
@click.option(
    "--log-file",
    default=None,
    help="Write a full debug log to this path.",
)
@click.option(
    "-v",
    "--verbose",
    is_flag=True,
    help="Verbose console logging.",
)
def cli(  # pylint: disable=too-many-arguments
    target: str,
    modality: str,
    version: str,
    locales: str | None,
    base_dir: str | None,
    state_file: str | None,
    force_rescrape: bool,
    dry_run: bool,
    assume_yes: bool,
    log_file: str | None,
    verbose: bool,
) -> None:
    """Disable (set visibility=private) prior MDC dataset versions.

    Scrapes the organization page, resolves each dataset id to its submission id,
    and PATCHes visibility=private with 429-aware pacing and local resume.

    Example: mdc-disable -ut prod -m sps --version 3.0 --dry-run
    """
    api_key = _resolve_api_key(target, dry_run)
    config = DisablerConfig.from_cli(
        target=target,  # type: ignore[arg-type]
        modality=modality,
        version=version,
        locales=locales,
        base_dir=base_dir,
        dry_run=dry_run,
        verbose=verbose,
        assume_yes=assume_yes,
        force_rescrape=force_rescrape,
        state_file=state_file,
        log_file=log_file,
        api_key=api_key,
    )
    setup_logging(verbose=config.verbose, log_file=config.log_file)
    logger.info(
        "DISABLE",
        "Target: %s | %s %s | base: %s%s",
        config.target,
        config.modality,
        config.version,
        config.base_dir,
        " | DRY RUN" if config.dry_run else "",
    )

    client: DisableClient | None = None
    if not config.dry_run:
        if not config.org_id:
            raise click.UsageError(
                f"No org id for target '{config.target}'. Set MDC_ORG_ID or add it to constants."
            )
        if config.target == "prod" and not config.assume_yes:
            click.confirm(
                f"Disable ALL {config.modality} {config.version} datasets on PROD?",
                abort=True,
            )
        client = DisableClient(config.api_key, config.api_url)

    summary = run_disable(config, client)

    logger.info(
        "DISABLE",
        "Summary: %d selected | %d disabled | %d failed | %d skipped",
        summary.total,
        summary.disabled,
        summary.failed,
        summary.skipped,
    )
    if summary.failed_ids:
        logger.error("DISABLE", "Failed: %s", summary.failed_ids)
        logger.info("DISABLE", "Re-run to retry failures (state: %s)", config.state_file)
    _upload_artifacts(config)
    sys.exit(1 if summary.failed else 0)
