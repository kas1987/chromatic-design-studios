#!/usr/bin/env bash
# In-review watcher — polls Multica for in_review issues and dispatches tiered LLM review
# Runs every 2 min via autopilot d2680814. Logs to ~/.claude/.agents/review/watcher.log

set -euo pipefail

LOG="$HOME/.claude/.agents/review/watcher.log"
REVIEWED_IDS="$HOME/.claude/.agents/review/reviewed-ids.txt"
DISPATCH_LOG="$HOME/.claude/.agents/review/dispatch.log"
DELIVERABLES="$HOME/.claude/.agents/review/deliverables"

mkdir -p "$(dirname "$LOG")" "$DELIVERABLES"
touch "$REVIEWED_IDS"

TS=$(date -u +"%Y-%m-%dT%H:%M:%S%:z")

# Fetch all in_review issues
ISSUES_JSON=$(multica issue list --status in_review --output json 2>/dev/null)
ISSUE_COUNT=$(echo "$ISSUES_JSON" | jq '.issues | length')

if [[ "$ISSUE_COUNT" -eq 0 ]]; then
  echo "[watcher $TS] Scheduled run complete — no in_review issues found, nothing to dispatch" >> "$LOG"
  exit 0
fi

# Process each issue
echo "$ISSUES_JSON" | jq -c '.issues[]' | while read -r issue; do
  ISSUE_ID=$(echo "$issue" | jq -r '.id')
  ISSUE_KEY=$(echo "$issue" | jq -r '.identifier // .id')
  TITLE=$(echo "$issue" | jq -r '.title')

  # Skip already-reviewed
  if grep -qxF "$ISSUE_ID" "$REVIEWED_IDS" 2>/dev/null; then
    echo "[watcher $TS] Skipping $ISSUE_KEY ($ISSUE_ID) — already reviewed" >> "$LOG"
    continue
  fi

  echo "[watcher $TS] Triggering review for $ISSUE_ID: $TITLE" >> "$LOG"

  # Tier classification based on title keywords
  TIER="T2"
  if echo "$TITLE" | grep -qiE 'doc|readme|comment|changelog'; then
    TIER="T1"
  elif echo "$TITLE" | grep -qiE 'refactor|rename|reorganize|restructure'; then
    TIER="T3"
  elif echo "$TITLE" | grep -qiE 'security|auth|secret|token|password|vuln|cve'; then
    TIER="T4"
  fi

  # Dispatch review (use review-dispatch.sh if present, else log tier decision)
  DISPATCH_SCRIPT="$HOME/.claude/hooks/review-dispatch.sh"
  if [[ -x "$DISPATCH_SCRIPT" ]]; then
    MULTICA_ISSUE_ID="$ISSUE_ID" REVIEW_TIER="$TIER" "$DISPATCH_SCRIPT" >> "$DISPATCH_LOG" 2>&1 \
      && echo "$ISSUE_ID" >> "$REVIEWED_IDS" \
      && echo "[watcher $TS] Dispatched $TIER review for $ISSUE_KEY: $TITLE" >> "$LOG" \
      || echo "[watcher $TS] Dispatch failed for $ISSUE_KEY ($TIER): $TITLE" >> "$LOG"
  else
    # review-dispatch.sh missing — record tier decision and mark reviewed
    echo "[watcher $TS] review-dispatch.sh missing — tier=$TIER for $ISSUE_KEY: $TITLE (marking reviewed to avoid loop)" >> "$LOG"
    echo "$ISSUE_ID" >> "$REVIEWED_IDS"
  fi
done

echo "[watcher $TS] Run complete" >> "$LOG"
