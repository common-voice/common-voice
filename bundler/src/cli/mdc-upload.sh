#!/usr/bin/env bash
# Wrapper for the MDC Uploader CLI.
# Ensures the Python venv is activated before invoking mdc-upload.
#
# Usage: ./scripts/mdc-upload.sh [OPTIONS]
# Example: ./scripts/mdc-upload.sh -r cv-corpus-25.0-2026-03-09 -ut prod --dry-run

set -euo pipefail

VENV_PATH="/opt/venv"
LOCAL_VENV="$(dirname "$0")/../uploader/.venv"

if [ -f "$VENV_PATH/bin/mdc-upload" ]; then
    exec "$VENV_PATH/bin/mdc-upload" "$@"
elif [ -f "$LOCAL_VENV/bin/mdc-upload" ]; then
    exec "$LOCAL_VENV/bin/mdc-upload" "$@"
else
    echo "Error: mdc-upload not found." >&2
    echo "Install with: cd bundler/uploader && pip install -e ." >&2
    exit 1
fi
