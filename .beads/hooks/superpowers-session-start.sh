#!/usr/bin/env bash
# SessionStart hook — injects using-superpowers from user-owned skills copy
set -euo pipefail

SKILL_FILE="${HOME}/.claude/skills/using-superpowers/SKILL.md"

if [ ! -f "$SKILL_FILE" ]; then
    exit 0
fi

using_superpowers_content=$(cat "$SKILL_FILE")

escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

escaped=$(escape_for_json "$using_superpowers_content")
session_context="<EXTREMELY_IMPORTANT>\nYou have superpowers.\n\n**Below is the full content of your 'using-superpowers' skill - your introduction to using skills. For all other skills, use the 'Skill' tool:**\n\n${escaped}\n</EXTREMELY_IMPORTANT>"

printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"
exit 0
