#!/usr/bin/env bash
# Wrapper for the MDC Uploader CLI.
# Locates the Python venv and invokes mdc-upload.
#
# Lookup order:
#   1. /opt/venv/bin/mdc-upload  (container -- set by Dockerfile)
#   2. bundler/uploader/.venv/bin/mdc-upload  (local dev)
#
# Usage: mdc-upload.sh [OPTIONS]
# Example: mdc-upload.sh -r cv-corpus-25.0-2026-03-09 -ut prod --dry-run

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_PATH="/opt/venv"
LOCAL_VENV="$SCRIPT_DIR/../uploader/.venv"

if [ -f "$VENV_PATH/bin/mdc-upload" ]; then
    exec "$VENV_PATH/bin/mdc-upload" "$@"
elif [ -f "$LOCAL_VENV/bin/mdc-upload" ]; then
    exec "$LOCAL_VENV/bin/mdc-upload" "$@"
else
    echo "Error: mdc-upload not found." >&2
    echo "Install with: cd bundler/uploader && pip install -e ." >&2
    exit 1
fi
