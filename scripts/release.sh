#!/usr/bin/env bash
set -euo pipefail

MODE="release" # release | rc
RELEASE_TYPE="patch" # Only used in release mode
NEXT_MINOR=0
NEXT_PATCH=0
CURRENT_RC=0

usage() {
  cat <<'EOF'
Usage: release.sh [--patch|--minor|--rc]

Creates stage and production release tags.

Modes:
  --patch   Perform a patch release (default)
  --minor   Perform a minor release
  --rc      Only bump the stage RC tag (no production release)

Steps:
  1. Ensure clean git status
  2. Update branches (main, stage, production when applicable)
  3. Merge main -> stage (and stage -> production for releases)
  4. Tag stage (stage-v1.x.y-rcN) and optionally production (release-v1.x.y)
  5. Push tags to origin
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --patch)
      MODE="release"
      RELEASE_TYPE="patch"
      shift
      ;;
    --minor)
      MODE="release"
      RELEASE_TYPE="minor"
      shift
      ;;
    --rc)
      MODE="rc"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

require_clean_worktree() {
  if ! git diff --quiet HEAD --; then
    echo "ERROR: Working tree has uncommitted changes. Please commit or stash before running this script." >&2
    exit 1
  fi
}

require_branch_exists() {
  local branch="$1"
  if ! git show-ref --verify --quiet "refs/heads/${branch}"; then
    echo "ERROR: Local branch '${branch}' does not exist." >&2
    exit 1
  fi
}

fetch_origin() {
  git fetch --tags origin
}

checkout_and_pull() {
  local branch="$1"
  git checkout "${branch}"
  git pull --ff-only origin "${branch}"
}

merge_branch() {
  local from_branch="$1"
  git merge --no-ff "${from_branch}"
}

derive_next_versions() {
  if [[ "${MODE}" == "rc" ]]; then
    local latest_stage_tag
    latest_stage_tag="$(git tag --list 'stage-v1.*-rc*' --sort=-v:refname | head -n1 || true)"

    if [[ -z "${latest_stage_tag}" ]]; then
      echo "ERROR: No existing stage tag found (stage-v1.x.y-rcN). Run a regular release first." >&2
      exit 1
    fi

    if [[ "${latest_stage_tag}" =~ stage-v1\.([0-9]+)\.([0-9]+)-rc([0-9]+) ]]; then
      NEXT_MINOR="${BASH_REMATCH[1]}"
      NEXT_PATCH="${BASH_REMATCH[2]}"
      CURRENT_RC="${BASH_REMATCH[3]}"
    else
      echo "ERROR: Unable to parse latest stage tag '${latest_stage_tag}'." >&2
      exit 1
    fi

    return
  fi

  local latest_release_tag

  latest_release_tag="$(git tag --list 'release-v1.*' --sort=-v:refname | head -n1 || true)"
  if [[ -z "${latest_release_tag}" ]]; then
    echo "ERROR: No existing release tag found (release-v1.x.y)." >&2
    exit 1
  fi

  if [[ "${latest_release_tag}" =~ release-v1\.([0-9]+)\.([0-9]+)$ ]]; then
    local current_minor="${BASH_REMATCH[1]}"
    local current_patch="${BASH_REMATCH[2]}"

    if [[ "${RELEASE_TYPE}" == "minor" ]]; then
      NEXT_MINOR=$((current_minor + 1))
      NEXT_PATCH=0
    else
      NEXT_MINOR=$((current_minor))
      NEXT_PATCH=$((current_patch + 1))
    fi
  else
    echo "ERROR: Unable to parse latest release tag '${latest_release_tag}'." >&2
    exit 1
  fi
}

next_stage_tag() {
  local base_version="stage-v1.${NEXT_MINOR}.${NEXT_PATCH}"
  local existing_rc

  if [[ "${MODE}" == "rc" ]]; then
    local next_rc=$((CURRENT_RC + 1))
    echo "${base_version}-rc${next_rc}"
    return
  fi

  existing_rc="$(git tag --list "${base_version}-rc*" --sort=-v:refname | head -n1 || true)"

  if [[ -z "${existing_rc}" ]]; then
    echo "${base_version}-rc1"
  elif [[ "${existing_rc}" =~ rc([0-9]+)$ ]]; then
    local next_rc=$((BASH_REMATCH[1] + 1))
    echo "${base_version}-rc${next_rc}"
  else
    echo "ERROR: Unable to parse existing RC tag '${existing_rc}'." >&2
    exit 1
  fi
}

annotated_tag() {
  local tag="$1"
  local message="$2"

  if git rev-parse --quiet --verify "refs/tags/${tag}" >/dev/null; then
    echo "Tag '${tag}' already exists; skipping creation."
  else
    git tag -a "${tag}" -m "${message}"
  fi
}

push_tag() {
  local tag="$1"
  git push origin "${tag}"
}

main() {
  require_clean_worktree
  require_branch_exists "main"
  require_branch_exists "stage"
  if [[ "${MODE}" != "rc" ]]; then
    require_branch_exists "production"
  fi

  fetch_origin
  derive_next_versions

  checkout_and_pull "main"

  checkout_and_pull "stage"
  merge_branch "main"

  STAGE_TAG="$(next_stage_tag)"
  annotated_tag "${STAGE_TAG}" "Stage release ${STAGE_TAG}"
  push_tag "${STAGE_TAG}"

  if [[ "${MODE}" == "rc" ]]; then
    echo "Success! Created:"
    echo "  Stage tag   -> ${STAGE_TAG}"
    return
  fi

  checkout_and_pull "production"
  merge_branch "stage"

  RELEASE_TAG="release-v1.${NEXT_MINOR}.${NEXT_PATCH}"
  annotated_tag "${RELEASE_TAG}" "Release ${RELEASE_TAG}"
  push_tag "${RELEASE_TAG}"

  echo "Success! Created:"
  echo "  Stage tag   -> ${STAGE_TAG}"
  echo "  Release tag -> ${RELEASE_TAG}"
}

main "$@"
