"""Tests for mdc_disabler.cli (key resolution, prod guard, exit codes)."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

from click.testing import CliRunner

from mdc_disabler.cli import cli
from mdc_disabler.core import DisableSummary


def _run(
    args: list[str],
    env: dict[str, str | None] | None = None,
    inp: str | None = None,
) -> Any:
    return CliRunner().invoke(cli, args, env=env or {}, input=inp)


class TestDryRun:
    def test_dry_run_needs_no_key(self, tmp_path: Any) -> None:
        with patch(
            "mdc_disabler.cli.run_disable",
            return_value=DisableSummary(total=1, skipped=1),
        ) as mock_run:
            result = _run(
                [
                    "-ut",
                    "prod",
                    "-m",
                    "sps",
                    "--version",
                    "3.0",
                    "--base-dir",
                    str(tmp_path),
                    "--dry-run",
                ],
                env={"MDC_API_KEY_PROD": None},
            )
        assert result.exit_code == 0
        mock_run.assert_called_once()


class TestKeyResolution:
    def test_missing_key_errors(self, tmp_path: Any) -> None:
        result = _run(
            ["-ut", "prod", "-m", "sps", "--version", "3.0", "--base-dir", str(tmp_path)],
            env={"MDC_API_KEY_PROD": None},
        )
        assert result.exit_code == 2
        assert "MDC_API_KEY_PROD" in result.output


class TestProdGuard:
    def test_prod_without_yes_aborts(self, tmp_path: Any) -> None:
        with patch("mdc_disabler.cli.run_disable") as mock_run:
            result = _run(
                ["-ut", "prod", "-m", "sps", "--version", "3.0", "--base-dir", str(tmp_path)],
                env={"MDC_API_KEY_PROD": "k"},
                inp="n\n",
            )
        assert result.exit_code != 0
        mock_run.assert_not_called()


class TestExitCodes:
    def test_failure_exits_nonzero(self, tmp_path: Any) -> None:
        with patch(
            "mdc_disabler.cli.run_disable",
            return_value=DisableSummary(total=1, failed=1, failed_ids=["d-x"]),
        ):
            result = _run(
                [
                    "-ut",
                    "prod",
                    "-m",
                    "sps",
                    "--version",
                    "3.0",
                    "--yes",
                    "--base-dir",
                    str(tmp_path),
                ],
                env={"MDC_API_KEY_PROD": "k"},
            )
        assert result.exit_code == 1

    def test_success_exits_zero(self, tmp_path: Any) -> None:
        with patch(
            "mdc_disabler.cli.run_disable",
            return_value=DisableSummary(total=2, disabled=2),
        ):
            result = _run(
                [
                    "-ut",
                    "prod",
                    "-m",
                    "sps",
                    "--version",
                    "3.0",
                    "--yes",
                    "--base-dir",
                    str(tmp_path),
                ],
                env={"MDC_API_KEY_PROD": "k"},
            )
        assert result.exit_code == 0
