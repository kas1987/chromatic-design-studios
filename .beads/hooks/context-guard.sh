#!/usr/bin/env bash
# context-guard.sh — non-blocking context window warnings for Claude Code
# 70-80%: yellow warning banner
# >=80%:  red warning banner (compactionThreshold:0.8 fires auto-compact after the turn)
#
# Thresholds (override via env):
#   CLAUDE_CONTEXT_LIMIT    default 200000 tokens
#   CONTEXT_WARN_PCT        default 70
#   CONTEXT_CRITICAL_PCT    default 80

CONTEXT_LIMIT=${CLAUDE_CONTEXT_LIMIT:-200000}
WARN_PCT=${CONTEXT_WARN_PCT:-70}
CRITICAL_PCT=${CONTEXT_CRITICAL_PCT:-80}

INPUT=$(cat 2>/dev/null || true)

# Fast JSON parse for session_id
SESSION_ID=$(python3 -c "import json,sys; d=json.loads(sys.stdin.read()); print(d.get('session_id',''))" <<< "$INPUT" 2>/dev/null || true)

SESSION_FILE=""
if [ -n "$SESSION_ID" ]; then
  # Check cache first to avoid repeated find
  CACHE_KEY="$HOME/.claude/.cache/ctx-session-${SESSION_ID}"
  if [ -f "$CACHE_KEY" ] && [ -f "$(cat "$CACHE_KEY" 2>/dev/null)" ]; then
    SESSION_FILE=$(cat "$CACHE_KEY")
  else
    SESSION_FILE=$(find "$HOME/.claude/projects" -name "${SESSION_ID}.jsonl" 2>/dev/null | head -1 || true)
    if [ -n "$SESSION_FILE" ] && [ -f "$SESSION_FILE" ]; then
      mkdir -p "$HOME/.claude/.cache"
      echo "$SESSION_FILE" > "$CACHE_KEY"
    fi
  fi
fi

# Fallback: most recently touched .jsonl in same project dir (no global scan)
if [ -z "$SESSION_FILE" ] || [ ! -f "$SESSION_FILE" ]; then
  PROJECT_SLUG=$(basename "$(pwd)" | sed 's|[: ]|-|g')
  PROJECT_DIR=$(find "$HOME/.claude/projects" -maxdepth 1 -type d -name "*${PROJECT_SLUG}*" 2>/dev/null | head -1 || true)
  if [ -n "$PROJECT_DIR" ]; then
    SESSION_FILE=$(ls -t "$PROJECT_DIR"/*.jsonl 2>/dev/null | head -1 || true)
  fi
fi

[ -z "$SESSION_FILE" ] && exit 0
[ ! -f "$SESSION_FILE" ] && exit 0

CACHE_TOKENS=$(tail -100 "$SESSION_FILE" 2>/dev/null \
  | grep -o '"cache_read_input_tokens":[0-9]*' \
  | tail -1 | grep -o '[0-9]*' || true)
INPUT_TOKENS=$(tail -100 "$SESSION_FILE" 2>/dev/null \
  | grep -o '"input_tokens":[0-9]*' \
  | tail -1 | grep -o '[0-9]*' || true)

CACHE_TOKENS=${CACHE_TOKENS:-0}
INPUT_TOKENS=${INPUT_TOKENS:-0}

# sum is correct: input_tokens = non-cached only; cache_read_input_tokens = cached; total = both
ACTIVE_TOKENS=$(( CACHE_TOKENS + INPUT_TOKENS ))

case "$ACTIVE_TOKENS" in
  ''|*[!0-9]*) exit 0 ;;
esac

PCT=$(( ACTIVE_TOKENS * 100 / CONTEXT_LIMIT ))

if [ "$PCT" -lt "$WARN_PCT" ]; then
  exit 0
elif [ "$PCT" -lt "$CRITICAL_PCT" ]; then
  cat <<EOF
{"systemMessage": "⚠️  Context ~${PCT}% used (${ACTIVE_TOKENS}/${CONTEXT_LIMIT} tokens). Compaction triggers at 80%."}
EOF
  exit 0
else
  cat <<EOF
{"systemMessage": "🔴 Context at ~${PCT}% (${ACTIVE_TOKENS}/${CONTEXT_LIMIT} tokens). Auto-compacting after this turn."}
EOF
  exit 0
fi
