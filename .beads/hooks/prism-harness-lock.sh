#!/usr/bin/env bash
# prism-harness-lock.sh — acquire/release the prism-autonomy-harness advisory
# human-session lock when a Claude Code session starts/stops in that repo.
#
# Fail-soft: never blocks session startup. Warns to stderr on misconfiguration.
#
# Usage:
#   prism-harness-lock.sh acquire   # SessionStart hook
#   prism-harness-lock.sh release   # Stop hook
#
# Config: set PRISM_HARNESS_ROOT in settings.json env to override the default.
# NOTE: not wired to settings.json until scripts/harness_lock.py exists.
set -u

ACTION="${1:-acquire}"

# Prefer env override; fall back to ~/.claude (canonical harness location post-migration)
REPO_ROOT="${PRISM_HARNESS_ROOT:-$HOME/.claude}"
LOCK_SCRIPT="$REPO_ROOT/scripts/harness_lock.py"

# Normalize CWD for comparison (handle MSYS/MINGW paths)
cwd="$(pwd -W 2>/dev/null || pwd)"
case "$cwd" in
  "$REPO_ROOT"*|"${REPO_ROOT,,}"*) : ;;
  *) exit 0 ;;
esac

if [ ! -f "$LOCK_SCRIPT" ]; then
  echo "[harness-lock] WARN: lock script not found at $LOCK_SCRIPT — lock skipped" >&2
  exit 0
fi

case "$ACTION" in
  acquire)
    python "$LOCK_SCRIPT" acquire --ttl=3600 \
      --reason="claude-code session (SessionStart hook)" >/dev/null 2>&1 || true

    VERIFY_SCRIPT="$REPO_ROOT/scripts/verify_hook.sh"
    if [ -f "$VERIFY_SCRIPT" ]; then
      verify_out="$(bash "$VERIFY_SCRIPT" 2>&1)" || true
      verify_rc=$?
      if [ "$verify_rc" -eq 0 ]; then
        echo "[harness-lock] SessionStart hook fired — lock acquired (verify: PASS)" >&2
      else
        echo "[harness-lock] SessionStart hook fired — lock acquired but verify FAILED: $verify_out" >&2
      fi
    else
      echo "[harness-lock] SessionStart hook fired — lock acquired (verify: skipped)" >&2
    fi
    ;;
  release)
    python "$LOCK_SCRIPT" release >/dev/null 2>&1 || true
    ;;
  *)
    exit 0
    ;;
esac

exit 0
