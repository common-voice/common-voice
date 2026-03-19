"""Structured logging matching the bundler's style."""

from __future__ import annotations

import logging
import os
import sys
from datetime import UTC, datetime


class BundlerFormatter(logging.Formatter):
    """Format: [TIMESTAMP] [LEVEL]  [COMPONENT] message"""

    def format(self, record: logging.LogRecord) -> str:
        ts = datetime.now(UTC).strftime("%Y-%m-%d %H:%M:%S")
        level = record.levelname.ljust(5)
        component = getattr(record, "component", "UPLOAD").ljust(10)
        msg = f"[{ts}] [{level}] [{component}] {record.getMessage()}"
        if record.exc_info and record.exc_info[1] is not None:
            msg += "\n" + self.formatException(record.exc_info)
        return msg


class ComponentLogger:
    """Logger that supports component-tagged messages."""

    def __init__(self, name: str = "mdc_uploader") -> None:
        self._logger = logging.getLogger(name)

    def _log(
        self,
        level: int,
        component: str,
        msg: str,
        *args: object,
        exc_info: bool = False,
    ) -> None:
        if self._logger.isEnabledFor(level):
            record = self._logger.makeRecord(
                self._logger.name,
                level,
                "(mdc_uploader)",
                0,
                msg,
                args,
                sys.exc_info() if exc_info else None,
            )
            record.component = component  # dynamic attr for BundlerFormatter
            self._logger.handle(record)

    def debug(self, component: str, msg: str, *args: object) -> None:
        """Log at DEBUG level with component tag."""
        self._log(logging.DEBUG, component, msg, *args)

    def info(self, component: str, msg: str, *args: object) -> None:
        """Log at INFO level with component tag."""
        self._log(logging.INFO, component, msg, *args)

    def warning(self, component: str, msg: str, *args: object) -> None:
        """Log at WARNING level with component tag."""
        self._log(logging.WARNING, component, msg, *args)

    def error(self, component: str, msg: str, *args: object, exc_info: bool = False) -> None:
        """Log at ERROR level with component tag."""
        self._log(logging.ERROR, component, msg, *args, exc_info=exc_info)


logger = ComponentLogger()


def setup_logging(verbose: bool = False, log_file: str | None = None) -> None:
    """Configure logging with bundler-style formatting.

    Args:
        verbose: Enable DEBUG level on the console handler.
        log_file: Optional path to a log file. The file handler always
            captures DEBUG level regardless of verbose, so request
            payloads and response bodies are recorded even without -v.
    """
    root = logging.getLogger("mdc_uploader")
    root.setLevel(logging.DEBUG if verbose else logging.INFO)

    if not root.handlers:
        console = logging.StreamHandler(sys.stderr)
        console.setFormatter(BundlerFormatter())
        console.setLevel(logging.DEBUG if verbose else logging.INFO)
        root.addHandler(console)

    if log_file and not any(isinstance(h, logging.FileHandler) for h in root.handlers):
        # File handler always captures everything for post-mortem debugging
        root.setLevel(logging.DEBUG)
        log_dir = os.path.dirname(log_file)
        if log_dir:
            os.makedirs(log_dir, exist_ok=True)
        fh = logging.FileHandler(log_file, mode="a", encoding="utf-8")
        fh.setFormatter(BundlerFormatter())
        fh.setLevel(logging.DEBUG)
        root.addHandler(fh)

        # Also capture the datacollective SDK's own log lines
        dc_logger = logging.getLogger("datacollective")
        if not any(isinstance(h, logging.FileHandler) for h in dc_logger.handlers):
            dc_logger.addHandler(fh)
            dc_logger.setLevel(logging.DEBUG)
