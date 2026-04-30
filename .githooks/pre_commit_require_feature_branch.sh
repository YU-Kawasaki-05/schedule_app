#!/usr/bin/env bash
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"

if [[ -z "$branch" || "$branch" == "HEAD" ]]; then
  echo "Blocked: detached HEAD is not allowed for commits in this repository."
  echo "Switch to a feature branch first (example: git switch -c feature/<topic>)."
  exit 1
fi

if [[ "$branch" != feature/* ]]; then
  echo "Blocked: commits are allowed only on feature/* branches."
  echo "Current branch: $branch"
  echo "Use: git switch -c feature/<topic> (or switch to an existing feature/* branch)."
  exit 1
fi
