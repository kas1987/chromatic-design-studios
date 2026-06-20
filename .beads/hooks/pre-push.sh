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

block() {
  echo ""
  echo "  pre-push: direct push to $1 is blocked. Use a session branch + PR."
  echo ""
  exit 1
}

# Git feeds each ref being pushed on stdin as:
#   <local_ref> SP <local_sha> SP <remote_ref> SP <remote_sha> LF
# Gate on the *destination* ref (remote_ref), not the checked-out branch — an
# explicit refspec like `git push origin HEAD:refs/heads/main` updates a
# protected branch while HEAD is on a feature branch, and a HEAD-only check
# would wave it through. Dolt/beads ref syncs are never blocked.
if [ ! -t 0 ]; then
  while read -r local_ref _local_sha remote_ref _remote_sha; do
    [ -z "${remote_ref:-}" ] && continue
    case "$local_ref" in refs/dolt/*) continue ;; esac
    case "$remote_ref" in
      refs/dolt/*) continue ;;
      refs/heads/main | refs/heads/master | refs/heads/Main) block "$remote_ref" ;;
    esac
  done
  exit 0
fi

# No stdin (manual/interactive invocation): fall back to the current branch.
BRANCH=$(git rev-parse --abbrev-ref HEAD)
case "$BRANCH" in
  master | main | Main) block "$BRANCH" ;;
esac

exit 0
