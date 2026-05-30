#!/usr/bin/env bash
# Dispatch tiered LLM review for a Multica issue.
# Called by in-review-watcher.sh with MULTICA_ISSUE_ID and REVIEW_TIER set.
set -euo pipefail

ISSUE_ID="${MULTICA_ISSUE_ID:-}"
TIER="${REVIEW_TIER:-T2}"
KEY_PATH="${OPENAI_API_KEY_PATH:-$HOME/.claude/secrets/openai-key.txt}"

if [[ -z "$ISSUE_ID" ]]; then
  echo "FAIL"
  echo "Review unavailable: MULTICA_ISSUE_ID not set"
  exit 1
fi

if [[ ! -f "$KEY_PATH" ]] || [[ ! -s "$KEY_PATH" ]]; then
  echo "FAIL"
  echo "Review unavailable: API key not found at $KEY_PATH"
  exit 1
fi

API_KEY=$(cat "$KEY_PATH")

# Tier 1: auto-approve docs/trivial
if [[ "$TIER" == "T1" ]]; then
  echo "PASS"
  echo "Tier-1 auto-approved: docs/trivial change"
  exit 0
fi

# Tier 2 and Tier 3: call LLM for review
RESPONSE=$(curl -sf \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"Review issue $ISSUE_ID for tier $TIER compliance. Reply with PASS or FAIL and one sentence reason.\"}]}" \
  "https://api.openai.com/v1/chat/completions" 2>/dev/null) || RESPONSE=""

if [[ -z "$RESPONSE" ]]; then
  echo "FAIL"
  echo "Review unavailable: API call failed"
  exit 1
fi

VERDICT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null) || VERDICT=""

if [[ -z "$VERDICT" ]]; then
  echo "FAIL"
  echo "Review unavailable: API call failed"
  exit 1
fi

echo "$VERDICT"
