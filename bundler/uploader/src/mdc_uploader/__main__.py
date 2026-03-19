"""Allow running as ``python -m mdc_uploader``."""

from mdc_uploader.cli import cli

if __name__ == "__main__":
    cli()  # pylint: disable=no-value-for-parameter  # Click provides args
