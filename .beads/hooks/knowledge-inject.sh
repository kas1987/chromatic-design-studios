#!/usr/bin/env bash
# SessionStart hook — injects top 5 relevant learnings from knowledge.db
set +e  # never fail hard

DB="$HOME/.claude/knowledge/knowledge.db"
PWD_NORM="${PWD:-}"

# Exit silently if DB missing or sqlite3 unavailable
[ -f "$DB" ] || exit 0
command -v sqlite3 >/dev/null 2>&1 || exit 0

# Derive project slug from cwd: strip home prefix, lowercase, replace / and \ with -
HOME_NORM="$HOME"
slug="${PWD_NORM#$HOME_NORM/}"       # strip $HOME/
slug="${slug#$HOME_NORM\\}"          # strip $HOME\ (Windows path)
slug="${slug//\\/-}"                 # backslash → dash
slug="${slug//\//-}"                 # forward slash → dash
slug=$(echo "$slug" | tr '[:upper:]' '[:lower:]')

# Query project-specific learnings (up to 3)
PROJECT_ROWS=$(sqlite3 -json "$DB" \
  "SELECT id, summary, confidence, tags FROM artifacts
   WHERE project = '${slug//\'/\'\'}' AND confidence IN ('high','medium')
   ORDER BY updated DESC LIMIT 3;" 2>/dev/null || echo "[]")

# Query global learnings (up to 5, will trim after merge)
GLOBAL_ROWS=$(sqlite3 -json "$DB" \
  "SELECT id, summary, confidence, tags FROM artifacts
   WHERE project = 'global' AND confidence IN ('high','medium')
   ORDER BY updated DESC LIMIT 5;" 2>/dev/null || echo "[]")

# Merge and format with Python (available on this system)
FORMATTED=$(python3 - "$PROJECT_ROWS" "$GLOBAL_ROWS" 2>/dev/null <<'PYEOF'
import sys, json

def parse(s):
    try:
        return json.loads(s) if s and s != "[]" else []
    except Exception:
        return []

project_rows = parse(sys.argv[1])
global_rows  = parse(sys.argv[2])

seen = set()
merged = []
for row in project_rows + global_rows:
    rid = row.get("id","")
    if rid and rid not in seen:
        seen.add(rid)
        merged.append(row)
    if len(merged) >= 5:
        break

if not merged:
    sys.exit(0)

lines = ["Prior learnings relevant to this session:"]
for r in merged:
    tags = r.get("tags","")
    tag_str = f" [{tags}]" if tags else ""
    summary = (r.get("summary") or "").strip().replace("\n"," ")
    lines.append(f"- {r['id']}{tag_str}: {summary}")

print("\n".join(lines))
PYEOF
)

[ -z "$FORMATTED" ] && exit 0

# Escape for JSON embedding
escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

CONTEXT="<prior-learnings>\n$(escape_for_json "$FORMATTED")\n</prior-learnings>"

printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$CONTEXT"
exit 0
