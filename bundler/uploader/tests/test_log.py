"""Tests for log.py -- file handler and setup_logging."""

from __future__ import annotations

import logging

from mdc_uploader.log import BundlerFormatter, setup_logging


class TestSetupLogging:
    """Tests for setup_logging file handler support."""

    def _reset_loggers(self) -> None:
        """Close and remove all handlers from mdc_uploader and datacollective loggers."""
        for name in ("mdc_uploader", "datacollective"):
            lg = logging.getLogger(name)
            for handler in lg.handlers[:]:
                handler.close()
                lg.removeHandler(handler)
            lg.setLevel(logging.WARNING)

    def test_log_file_creates_file_handler(self, tmp_path) -> None:  # type: ignore[no-untyped-def]
        """setup_logging with log_file adds a FileHandler."""
        self._reset_loggers()
        log_path = str(tmp_path / "test.log")
        setup_logging(verbose=False, log_file=log_path)

        root = logging.getLogger("mdc_uploader")
        file_handlers = [h for h in root.handlers if isinstance(h, logging.FileHandler)]
        assert len(file_handlers) == 1
        assert file_handlers[0].level == logging.DEBUG
        self._reset_loggers()

    def test_log_file_captures_debug_without_verbose(  # type: ignore[no-untyped-def]
        self, tmp_path
    ) -> None:
        """File handler captures DEBUG lines even when verbose=False."""
        self._reset_loggers()
        log_path = tmp_path / "test.log"
        setup_logging(verbose=False, log_file=str(log_path))

        root = logging.getLogger("mdc_uploader")
        root.debug("debug-sentinel")
        root.info("info-sentinel")

        content = log_path.read_text(encoding="utf-8")
        assert "debug-sentinel" in content
        assert "info-sentinel" in content
        self._reset_loggers()

    def test_log_file_uses_bundler_formatter(  # type: ignore[no-untyped-def]
        self, tmp_path
    ) -> None:
        """File handler uses BundlerFormatter."""
        self._reset_loggers()
        log_path = str(tmp_path / "test.log")
        setup_logging(verbose=False, log_file=log_path)

        root = logging.getLogger("mdc_uploader")
        file_handlers = [h for h in root.handlers if isinstance(h, logging.FileHandler)]
        assert isinstance(file_handlers[0].formatter, BundlerFormatter)
        self._reset_loggers()

    def test_datacollective_logger_captured(self, tmp_path) -> None:  # type: ignore[no-untyped-def]
        """datacollective SDK logger is also routed to the log file."""
        self._reset_loggers()
        log_path = tmp_path / "test.log"
        setup_logging(verbose=False, log_file=str(log_path))

        dc_logger = logging.getLogger("datacollective")
        dc_logger.info("sdk-sentinel")

        content = log_path.read_text(encoding="utf-8")
        assert "sdk-sentinel" in content
        self._reset_loggers()

    def test_no_duplicate_file_handlers(self, tmp_path) -> None:  # type: ignore[no-untyped-def]
        """Calling setup_logging twice with same log_file does not duplicate."""
        self._reset_loggers()
        log_path = str(tmp_path / "test.log")
        setup_logging(verbose=False, log_file=log_path)
        setup_logging(verbose=False, log_file=log_path)

        root = logging.getLogger("mdc_uploader")
        file_handlers = [h for h in root.handlers if isinstance(h, logging.FileHandler)]
        assert len(file_handlers) == 1
        self._reset_loggers()

    def test_no_log_file_skips_file_handler(self) -> None:
        """setup_logging without log_file adds no FileHandler."""
        self._reset_loggers()
        setup_logging(verbose=False)

        root = logging.getLogger("mdc_uploader")
        file_handlers = [h for h in root.handlers if isinstance(h, logging.FileHandler)]
        assert len(file_handlers) == 0
        self._reset_loggers()
