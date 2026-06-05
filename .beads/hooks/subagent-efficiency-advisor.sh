#!/usr/bin/env bash
# subagent-efficiency-advisor.sh — PreToolUse(Agent) advisory.
#
# Complements model-router.sh (which scores model TIER). This injects the
# non-tier rules from ~/.claude/governance/subagent-token-efficiency.md so the
# dispatcher is reminded before paying the ~150k boot tax. Advisory only —
# always exits 0, never blocks. (Note: does NOT fire for Workflow agent()
# calls — those are governed by the workflow template / orchestrator doctrine.)
set -u

# Only act on read-heavy / general dispatches; keep it cheap and fail-open.
read -r -d '' MSG <<'EOF'
Subagent efficiency (governance/subagent-token-efficiency.md): route by C-level
(C1/C2->haiku/local, C3->sonnet, C4->opus); read-only work -> agentType:Explore;
codegraph_* not grep+Read loops; one artifact + done-criteria per agent (keep
turns <30); pass file PATHS not inlined payloads.
EOF

printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":%s}}\n' \
  "$(printf '%s' "$MSG" | jq -Rs . 2>/dev/null || printf '""')"

exit 0
