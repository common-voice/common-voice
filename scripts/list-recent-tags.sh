#!/usr/bin/env bash

# List recent git tags for the sandbox, stage, and release channels.
# Usage: ./scripts/list-recent-tags.sh [COUNT]
# If COUNT is not provided, the script defaults to showing the latest 3 tags.
# Set GIT_TAG_REMOTE to override the remote used when fetching tags (defaults to origin).

set -euo pipefail

COUNT="${1:-3}"

if ! [[ "$COUNT" =~ ^[0-9]+$ ]] || [[ "$COUNT" -le 0 ]]; then
  echo "COUNT must be a positive integer (received: $COUNT)" >&2
  exit 1
fi

declare -a PATTERNS=("sandbox-v*" "stage-v*" "release-v*")

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "This script must be run inside a git repository." >&2
  exit 1
fi

fetch_remote="${GIT_TAG_REMOTE:-origin}"
fetch_args=(--tags --prune)

if git fetch --help | grep -q -- '--prune-tags'; then
  fetch_args+=(--prune-tags)
fi

if git remote | grep -qx "$fetch_remote"; then
  fetch_args+=("$fetch_remote")
else
  fetch_remote=""
fi

if ! git fetch "${fetch_args[@]}" >/dev/null 2>&1; then
  if [[ -n "$fetch_remote" ]]; then
    echo "Warning: failed to fetch tags from ${fetch_remote}; showing local tags." >&2
  else
    echo "Warning: failed to fetch tags; showing local tags." >&2
  fi
fi

for pattern in "${PATTERNS[@]}"; do
  echo "Recent tags for ${pattern} (showing up to ${COUNT}):"
  tags=()
  while IFS= read -r line; do
    tags+=("$line")
  done < <(
    git for-each-ref \
      --count="${COUNT}" \
      --sort=-creatordate \
      --format='%(refname:strip=2)  %(creatordate:short)' \
      "refs/tags/${pattern}"
  )

  if ((${#tags[@]} == 0)); then
    echo "  (no tags found)"
  else
    printf '  %s\n' "${tags[@]}"
  fi

  echo
done
