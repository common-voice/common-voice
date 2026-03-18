"""CLI entry point for the MDC uploader."""

from __future__ import annotations

import os
import sys

import click

from mdc_uploader.config import UploaderConfig
from mdc_uploader.log import logger, setup_logging
from mdc_uploader.models import ReleaseType
from mdc_uploader.pipeline import run_batch
from mdc_uploader.state import load_state_for_retry
from mdc_uploader.typedef import MDCTarget

EPILOG = """\b
Examples:
  mdc-upload -r cv-corpus-25.0-2026-03-09 -ut dev --dry-run
  mdc-upload -r cv-corpus-25.0-2026-03-09 -ut prod
  mdc-upload -r sps-corpus-3.0-2026-03-09 -l "en ga-IE mt" -ut dev
  mdc-upload -r cv-corpus-25.0-2026-03-09 -rt licensed -ut prod
  mdc-upload --retry-failed upload-state-...-20260313T143000.json
  mdc-upload -r sps-corpus-3.0-2026-03-09 --base-dir ./test-releases --dry-run

\b
Environment variables:
  MDC_API_KEY_DEV   MDC API key for dev target (required for -ut dev)
  MDC_API_KEY_PROD  MDC API key for prod target (required for -ut prod)
  MDC_API_URL       Override MDC API base URL (default: from -ut)
  UPLOAD_BASE_DIR              Override --base-dir (highest priority after CLI flag)
  DATASETS_BUNDLER_BUCKET_NAME Auto-resolves to gs://<value> (shared with bundler)
"""


@click.command(
    "mdc-upload",
    epilog=EPILOG,
    context_settings={"max_content_width": 100, "help_option_names": ["-h", "--help"]},
)
@click.option(
    "-r",
    "--release",
    type=str,
    default=None,
    help="Release name, e.g. cv-corpus-25.0-2026-03-09 or sps-corpus-3.0-2026-03-09.",
)
@click.option(
    "-ut",
    "--upload-target",
    "upload_target",
    type=click.Choice(["dev", "prod"]),
    default="dev",
    show_default=True,
    help="MDC environment to upload to.",
)
@click.option(
    "-l",
    "--locales",
    type=str,
    default=None,
    help="Space-separated locale codes to upload. When omitted, all locales are "
    "auto-detected from the release directory and sorted smallest-first.",
)
@click.option(
    "-rt",
    "--release-type",
    "release_type",
    type=click.Choice([t.value for t in ReleaseType]),
    default="full",
    show_default=True,
    help="Dataset release type: full (CC0), delta (CC0), licensed (CC-BY 4.0), or variants.",
)
@click.option(
    "--base-dir",
    type=str,
    default=None,
    envvar="UPLOAD_BASE_DIR",
    help="GCS bucket (gs://...) or local path with release files. "
    "Defaults to /gcs (GCSFuse mount in K8s).",
)
@click.option(
    "--submission-id",
    type=str,
    default=None,
    help="Existing MDC submission ID. When set, uploads a new file version to "
    "this dataset instead of creating a new submission.",
)
@click.option(
    "--retry-failed",
    type=click.Path(exists=True, dir_okay=False),
    default=None,
    help="Path to a state JSON file from a previous run. Only failed locales "
    "are retried; config is restored from the file.",
)
@click.option("--dry-run", is_flag=True, help="Preview what would be uploaded without calling MDC.")
@click.option("-v", "--verbose", is_flag=True, help="Enable debug-level logging.")
def cli(
    release: str | None,
    upload_target: str,
    locales: str | None,
    release_type: str,
    base_dir: str | None,
    submission_id: str | None,
    retry_failed: str | None,
    dry_run: bool,
    verbose: bool,
) -> None:
    """Upload Common Voice release tarballs to Mozilla Data Collective (MDC) via API.

    Attaches datasheet metadata to each submission, displayed on the MDC dataset page.
    """
    setup_logging(verbose)

    try:
        _run(
            release=release,
            upload_target=upload_target,
            locales=locales,
            release_type=release_type,
            base_dir=base_dir,
            submission_id=submission_id,
            retry_failed=retry_failed,
            dry_run=dry_run,
            verbose=verbose,
        )
    except click.UsageError:
        raise  # let Click format these
    except KeyboardInterrupt:
        logger.error("UPLOAD", "Interrupted by user")
        sys.exit(130)
    except Exception as exc:  # pylint: disable=broad-exception-caught
        logger.error("UPLOAD", "Fatal: %s", exc)
        if verbose:
            logger.error("UPLOAD", "Traceback:", exc_info=True)
        else:
            logger.error("UPLOAD", "Re-run with -v for full traceback")
        sys.exit(1)


def _resolve_api_key(target: MDCTarget, dry_run: bool) -> str:
    """Resolve MDC API key for the given target.

    Reads MDC_API_KEY_DEV or MDC_API_KEY_PROD based on -ut.
    Not required for --dry-run.
    """
    target_var = f"MDC_API_KEY_{target.upper()}"
    key = os.environ.get(target_var, "")
    if not key and not dry_run:
        raise click.UsageError(
            f"{target_var} environment variable is required (or use --dry-run)."
        )
    return key


def _run(
    *,
    release: str | None,
    upload_target: str,
    locales: str | None,
    release_type: str,
    base_dir: str | None,
    submission_id: str | None,
    retry_failed: str | None,
    dry_run: bool,
    verbose: bool,
) -> None:
    """Inner logic separated for clean error handling."""
    mdc_api_url = os.environ.get("MDC_API_URL")
    resolved_target: MDCTarget = upload_target  # type: ignore[assignment]  # Click validates

    # --retry-failed mode: load config from state file
    if retry_failed:
        state = load_state_for_retry(retry_failed)
        state_target = state["upload_target"]
        if state_target not in ("dev", "prod"):
            raise click.UsageError(
                f"Invalid upload_target {state_target!r} in state file. Expected 'dev' or 'prod'."
            )
        valid_target: MDCTarget = state_target  # type: ignore[assignment]
        mdc_api_key = _resolve_api_key(valid_target, dry_run)
        config = UploaderConfig.from_cli(
            release=state["release"],
            upload_target=valid_target,
            base_dir=state["base_dir"] or base_dir,
            release_type=state["type"] or release_type,
            locales=" ".join(state["failed_locales"]),
            submission_id=submission_id,
            dry_run=dry_run,
            verbose=verbose,
            mdc_api_key=mdc_api_key,
            mdc_api_url=mdc_api_url,
        )
        logger.info(
            "RETRY",
            "Retrying %d failed locales from %s",
            len(state["failed_locales"]),
            retry_failed,
        )
    else:
        if not release:
            raise click.UsageError("--release is required (unless using --retry-failed)")

        mdc_api_key = _resolve_api_key(resolved_target, dry_run)
        config = UploaderConfig.from_cli(
            release=release,
            upload_target=resolved_target,
            base_dir=base_dir,
            release_type=release_type,
            locales=locales,
            submission_id=submission_id,
            dry_run=dry_run,
            verbose=verbose,
            mdc_api_key=mdc_api_key,
            mdc_api_url=mdc_api_url,
        )

    success = run_batch(config)
    sys.exit(0 if success else 1)
