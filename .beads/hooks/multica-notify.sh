#!/usr/bin/env bash
# Notifies Multica when a Claude Code Agent tool use completes.
# Set MULTICA_ISSUE_ID in the environment to update a specific issue.
# Requires multica CLI on PATH.
#
# Success detection: parses tool_response content for error markers.
# Routes to 'failed' on errors, 'in_review' on clean completion.

MULTICA_BIN_DEFAULT="$HOME/.multica/bin/multica"

if [ -z "${MULTICA_ISSUE_ID:-}" ]; then
  exit 0
fi

if [ -n "${MULTICA_BIN:-}" ] && command -v "$MULTICA_BIN" &>/dev/null; then
  MULTICA_CMD="$MULTICA_BIN"
elif command -v "$MULTICA_BIN_DEFAULT" &>/dev/null; then
  MULTICA_CMD="$MULTICA_BIN_DEFAULT"
elif command -v multica &>/dev/null; then
  MULTICA_CMD="multica"
else
  exit 0
fi

INPUT=$(cat)

TOOL_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null)
if [ "$TOOL_NAME" != "Agent" ]; then
  exit 0
fi

# Extract tool response content for failure detection
RESPONSE_TEXT=$(printf '%s' "$INPUT" | jq -r '(.tool_response // "") | tostring' 2>/dev/null)

# Check for error markers in the agent output
HAS_ERROR=false
if printf '%s' "$RESPONSE_TEXT" | grep -qiE \
  'Traceback \(most recent|^Error:|^ERROR:|Exception:|FAILED[^_]|Task failed|Command failed|exit code [1-9]|non-zero exit|returned non-zero'; then
  HAS_ERROR=true
fi

if [ "$HAS_ERROR" = "true" ]; then
  "$MULTICA_CMD" issue update "$MULTICA_ISSUE_ID" --status failed 2>/dev/null || true
  echo "[multica-notify] Agent error detected — issue $MULTICA_ISSUE_ID → failed" >&2
else
  "$MULTICA_CMD" issue update "$MULTICA_ISSUE_ID" --status in_review 2>/dev/null || true
  echo "[multica-notify] Agent completed — issue $MULTICA_ISSUE_ID → in_review" >&2
fi
