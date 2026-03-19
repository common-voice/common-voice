"""Structured logging matching the bundler's style."""

from __future__ import annotations

import logging
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


def setup_logging(verbose: bool = False) -> None:
    """Configure logging with bundler-style formatting."""
    root = logging.getLogger("mdc_uploader")
    root.setLevel(logging.DEBUG if verbose else logging.INFO)

    if not root.handlers:
        handler = logging.StreamHandler(sys.stderr)
        handler.setFormatter(BundlerFormatter())
        root.addHandler(handler)
