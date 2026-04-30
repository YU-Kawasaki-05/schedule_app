#!/usr/bin/env bash
set -euo pipefail

while read -r local_ref local_sha remote_ref remote_sha; do
  case "$remote_ref" in
    refs/heads/main|refs/heads/master)
      echo "Blocked: push to protected branch ($remote_ref) is not allowed by default."
      echo "If you intentionally want this, run push manually with --no-verify after explicit approval."
      exit 1
      ;;
  esac
done
