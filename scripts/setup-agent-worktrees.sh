#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE_DIR="${ROOT_DIR}/.worktrees"
BASE_BRANCH="${1:-main}"

declare -A AGENTS=(
  ["developer-a"]="codex/agent-developer-a"
  ["developer-b"]="codex/agent-developer-b"
  ["qa-engineer"]="codex/agent-qa-engineer"
  ["security-expert"]="codex/agent-security-expert"
  ["performance-expert"]="codex/agent-performance-expert"
)

mkdir -p "${WORKTREE_DIR}"

for agent in "${!AGENTS[@]}"; do
  branch="${AGENTS[$agent]}"
  path="${WORKTREE_DIR}/${agent}"

  if [ -d "${path}" ]; then
    echo "Skipping ${agent}: worktree already exists at ${path}"
    continue
  fi

  if git show-ref --verify --quiet "refs/heads/${branch}"; then
    echo "Adding existing branch ${branch} at ${path}"
    git worktree add "${path}" "${branch}"
  else
    echo "Creating ${branch} from ${BASE_BRANCH} at ${path}"
    git worktree add "${path}" -b "${branch}" "${BASE_BRANCH}"
  fi
done

echo
echo "Active worktrees:"
git worktree list

