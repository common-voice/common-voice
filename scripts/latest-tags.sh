#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

cd "$repo_root"

get_latest_tag() {
  local pattern=$1
  local label=$2

  local tag
  tag="$(git tag --list "$pattern" --sort=-version:refname | head -n1 || true)"

  if [[ -z "$tag" ]]; then
    echo "$label: <none>"
  else
    echo "$label: $tag"
  fi
}

get_latest_tag "sandbox-*" "sandbox"
get_latest_tag "stage-*" "stage"
get_latest_tag "release-v[0-9]*" "release"
