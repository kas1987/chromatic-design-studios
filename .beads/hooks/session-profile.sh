#!/usr/bin/env bash
# SessionStart hook — reads Profile: field from session-brief.md and
# toggles skill families for the NEXT session (current session already loaded).
set +e

BRIEF="$HOME/.claude/session-brief.md"
[ -f "$BRIEF" ] || exit 0

# Extract first non-empty Profile: line (case-insensitive)
PROFILE=$(grep -i '^\*\*Profile:\*\*\|^Profile:' "$BRIEF" 2>/dev/null \
  | head -1 \
  | sed 's/.*Profile:[*[:space:]]*//' \
  | sed 's/[[:space:]]*<!--.*//' \
  | tr -d '*[:space:]' \
  | tr '[:upper:]' '[:lower:]')

[ -z "$PROFILE" ] && exit 0
[ "$PROFILE" = "<!--" ] && exit 0  # skip template placeholder

# Run skills-family.ps1 with the profile arg
OUTPUT=$(pwsh -NoProfile -File "$HOME/.claude/bin/skills-family.ps1" "$PROFILE" 2>&1)
STATUS=$?

if [ $STATUS -eq 0 ]; then
    MSG="[session-profile] Set skill families to profile='$PROFILE' (effective next session)."
else
    MSG="[session-profile] WARN: skills-family.ps1 exited $STATUS for profile='$PROFILE': $OUTPUT"
fi

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' \
  "$(echo "$MSG" | sed 's/"/\\"/g')"
exit 0
