#!/bin/bash
# Warn when a tool response exceeds ~5k tokens (~20k chars)
INPUT=$(cat)
THRESHOLD=20000

# Fast pre-check: skip jq entirely if raw input is small
RAW_LEN=${#INPUT}
if [ "$RAW_LEN" -lt "$THRESHOLD" ]; then
  exit 0
fi

# Single jq call: extract both response length and tool name
IFS=$'\t' read -r RESPONSE_LEN TOOL_NAME < <(
  printf '%s' "$INPUT" | jq -r '
    [((.tool_response // "") | tostring | length),
     (.tool_name // "unknown")] | @tsv
  ' 2>/dev/null | tr -d '\r'
)
RESPONSE_LEN=${RESPONSE_LEN:-0}
TOOL_NAME=${TOOL_NAME:-unknown}

if [ "$RESPONSE_LEN" -gt "$THRESHOLD" ]; then
  TOKENS_EST=$(( RESPONSE_LEN / 4 ))
  printf '{"systemMessage":"⚠️  %s returned ~%dk tokens (over 5k limit). Use targeted params to reduce size.","hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"RESPONSE SIZE EXCEEDED: %s returned ~%d tokens. Reduce with depth/target (browser_snapshot), limit (queries), or head_limit (Grep/Bash)."}}\n' \
    "$TOOL_NAME" "$(( TOKENS_EST / 1000 ))" "$TOOL_NAME" "$TOKENS_EST"
fi
