#!/usr/bin/env bash
# Pre-push gate for Chromatic Design Studios — self-contained, no harness coupling.
#
# The beads sync step runs in the entrypoint (.beads/hooks/pre-push) BEFORE this
# script. This file is the project gate only. It deliberately does NOT run the
# chromatic-harness-v2 E2E suite (an earlier shared copy did, which blocked every
# push from this repo on unrelated harness lint failures).
#
# Scope here: block direct pushes to main/master. Build/lint verification is run
# explicitly via `npm run build:web` rather than on every push (kept fast + flake-free).

set -euo pipefail

# Never interfere with beads/Dolt ref syncs.
if [ ! -t 0 ]; then
  while read -r local_ref _l _remote_ref _r; do
    [ -z "${local_ref:-}" ] && continue
    case "$local_ref" in refs/dolt/*) exit 0 ;; esac
  done
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "master" ] || [ "$BRANCH" = "main" ] || [ "$BRANCH" = "Main" ]; then
  echo ""
  echo "  pre-push: direct push to $BRANCH is blocked. Use a session branch + PR."
  echo ""
  exit 1
fi

exit 0
