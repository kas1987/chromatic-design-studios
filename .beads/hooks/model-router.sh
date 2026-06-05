#!/usr/bin/env bash
# model-router.sh v3 — subscription-first Agent call router (PreToolUse hook)
#
# ADVISORY ONLY: This hook scores Agent calls and emits routing guidance via
# additionalContext. PreToolUse hooks cannot change a subagent's model assignment.
# To route subagent calls by model, set model: explicitly on each Agent call.
#
# Scores incoming Agent calls against tier_patterns from router-patterns.json.
# Emits additionalContext advisory or permissionDecision:deny for pure-LLM calls.
# Checks ollama-status.json; if Ollama is down, bumps tier-0 → tier-1.
# Guards against uncapped cloud spend: if tier-0→tier-1 bumps >= OL_BUMP_MAX_SESSION
# (default 10), skips the cloud dispatch and warns instead.
#
# Tier map (subscription-first — no pay-per-token providers in active dispatch):
#   0 = ollama local   (free — llama3.2:3b / 1b)
#   1 = featherless 8B  ($25/mo flat — Qwen2.5-7B swarm, 1 unit each)
#   2 = featherless 14B ($25/mo flat — Qwen2.5-14B, 2 units)
#   3 = featherless 72B ($25/mo flat — Qwen2.5-72B, uses all 4 units; gemini last-resort metered fallback)
#   4 = claude native   (Claude Code subscription — orchestrator)
#
# BLOCKED providers (pay-per-token, not subscription):
#   openai — sk-proj API key bills per token; blocked until budget approved
#
# DEFERRED providers (wire in later):
#   claude API — native session used instead; no HTTP dispatch to api.anthropic.com
#
# Exit codes: 0 always (fail-open)

set -u

LOG_DIR="${ROUTER_LOG_DIR:-${HOME}/.claude/.agents/router}"
LOG_FILE="${LOG_DIR}/log.jsonl"
PATTERNS_FILE="${ROUTER_PATTERNS_FILE:-${HOME}/.claude/config/router-patterns.json}"
TIERS_FILE="${ROUTER_TIERS_FILE:-${HOME}/.claude/config/provider-tiers.json}"
ROUTER_BLOCK_ENABLED="${ROUTER_BLOCK_ENABLED:-true}"

# ---- Bump counter cap ----
# Per-session counter persisted in session-state.json.
# Configurable via OL_BUMP_MAX_SESSION env (default 10).
OL_BUMP_MAX_SESSION="${OL_BUMP_MAX_SESSION:-10}"
SESSION_STATE_FILE="${LOG_DIR}/session-state.json"

mkdir -p "${LOG_DIR}" 2>/dev/null || exit 0

# ---- read_bump_count: read tier0_bump_count from session-state.json ----
read_bump_count() {
  if [ -f "${SESSION_STATE_FILE}" ]; then
    jq -r '.tier0_bump_count // 0' "${SESSION_STATE_FILE}" 2>/dev/null || echo 0
  else
    echo 0
  fi
}

# ---- increment_bump_count: atomically increment and persist ----
increment_bump_count() {
  local current
  current=$(read_bump_count)
  local new_count=$(( current + 1 ))
  # Merge into existing state (preserve other fields like tier0_degraded)
  local existing="{}"
  [ -f "${SESSION_STATE_FILE}" ] && existing=$(cat "${SESSION_STATE_FILE}" 2>/dev/null || echo "{}")
  printf '%s' "${existing}" | jq -c --argjson n "${new_count}" '. + {tier0_bump_count: $n}' \
    > "${SESSION_STATE_FILE}" 2>/dev/null || true
  echo "${new_count}"
}

# ---- Ollama liveness (read pre-written status file) ----
OLLAMA_STATUS_FILE="${LOG_DIR}/ollama-status.json"
ollama_up=true
if [ -f "${OLLAMA_STATUS_FILE}" ]; then
  _up=$(jq -r '.up' "${OLLAMA_STATUS_FILE}" 2>/dev/null)
  [ "${_up}" = "false" ] && ollama_up=false
fi

# ---- Weekly usage threshold ----
TRACKER_FILE="${ROUTER_USAGE_TRACKER_FILE:-${HOME}/.claude/usage-tracker.json}"
WEEKLY_BUDGET="${ROUTER_WEEKLY_BUDGET_USD:-}"
USAGE_THRESHOLD="${ROUTER_USAGE_THRESHOLD:-0.8}"
usage_high=false
if [ -n "${WEEKLY_BUDGET}" ] && [ -r "${TRACKER_FILE}" ]; then
  cutoff=$(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-7d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo "")
  if [ -n "${cutoff}" ]; then
    weekly_usage=$(jq -r --arg c "${cutoff}" '[.sessions[] | select(.timestamp >= $c) | .costUsd] | add // 0' "${TRACKER_FILE}" 2>/dev/null || echo "0")
    exceeded=$(awk -v u="${weekly_usage}" -v b="${WEEKLY_BUDGET}" -v t="${USAGE_THRESHOLD}" 'BEGIN { if ((u+0) > ((b+0)*(t+0))) print "1"; else print "0" }')
    [ "${exceeded}" = "1" ] && usage_high=true
  fi
fi

# ---- Read stdin ----
input=$(cat 2>/dev/null) || exit 0
[ -z "${input}" ] && exit 0

# Parse all input fields in a single jq call (IFS=$'\t' preserves spaces in fields)
IFS=$'\t' read -r tool_name description prompt sub_type model < <(
  printf '%s' "${input}" | jq -r '[
    .tool_name // "",
    .tool_input.description // "",
    .tool_input.prompt // "",
    (.tool_input.subagent_type // "general-purpose"),
    (.tool_input.model // "")
  ] | @tsv' 2>/dev/null | tr -d '\r'
) || exit 0
[ "${tool_name}" != "Agent" ] && exit 0

# Combined haystack
haystack=$(printf '%s\n%s' "${description}" "${prompt}" | tr '[:upper:]' '[:lower:]')

# ---- 5-tier scoring ----
best_tier=4
best_score=0
reason="default: no pattern matched"
declare -A tier_scores=()

if [ -r "${PATTERNS_FILE}" ]; then
  # Load all patterns in one jq call: emit "TIER\tPATTERN" lines
  # Use bash =~ (no subprocess) for matching
  while IFS=$'\t' read -r tier pattern; do
    [[ -z "${pattern}" ]] && continue
    pattern_clean="${pattern//$'\r'/}"
    if [[ "${haystack}" =~ ${pattern_clean} ]]; then
      score=$(( ${tier_scores[$tier]:-0} + 1 ))
      tier_scores[$tier]=$score
    fi
  done < <(jq -r '
    .tier_patterns | to_entries[] |
    .key as $t | .value[] |
    [$t, .] | @tsv
  ' "${PATTERNS_FILE}" 2>/dev/null)

  for tier in 0 1 2 3 4; do
    score=${tier_scores[$tier]:-0}
    if [[ "${score}" -gt "${best_score}" ]]; then
      best_score=${score}
      best_tier=${tier}
      reason="tier-${tier}: ${score} pattern(s) matched"
    fi
  done
fi

# ---- Ollama-down bump: tier-0 → tier-1 ----
if [ "${ollama_up}" = "false" ] && [ "${best_tier}" -eq 0 ]; then
  # Check session bump count before promoting
  current_bumps=$(read_bump_count)
  if [ "${current_bumps}" -ge "${OL_BUMP_MAX_SESSION}" ]; then
    # Cap reached: skip cloud dispatch, warn and exit
    printf 'WARN: tier0_degraded cap reached (%d/%d bumps this session) — skipping cloud dispatch for tier-0 task. Set OL_BUMP_MAX_SESSION to raise limit.\n' \
      "${current_bumps}" "${OL_BUMP_MAX_SESSION}" >&2
    exit 0
  fi
  new_count=$(increment_bump_count)
  best_tier=1
  reason="ollama-down: promoted tier 0->1 (featherless) [bump ${new_count}/${OL_BUMP_MAX_SESSION}]; ${reason}"
fi

# ---- Usage-high bump: tier-0 → tier-1 ----
if [ "${usage_high}" = "true" ] && [ "${best_tier}" -eq 0 ]; then
  best_tier=1
  reason="usage-high: promoted tier 0->1 (featherless); ${reason}"
fi

# ---- Model override shortcuts ----
if [ "${model}" = "haiku" ]; then
  [ "${best_tier}" -gt 1 ] && best_tier=1
  [ "${best_tier}" -eq 0 ] && best_tier=1
  reason="caller specified haiku → floored at tier-1 (never tier-0)"
fi
if [ "${model}" = "opus" ]; then
  best_tier=4
  reason="caller specified opus → tier-4 (native)"
fi

# ---- Resolve provider/model from tiers config (single jq call) ----
target_provider="claude"
target_model="claude-sonnet-4-6"
if [ -r "${TIERS_FILE}" ]; then
  read -r _p _m < <(
    jq -r --argjson t "${best_tier}" \
      '[.tiers[$t|tostring].primary.provider // "", .tiers[$t|tostring].primary.model // ""] | @tsv' \
      "${TIERS_FILE}" 2>/dev/null | tr -d '\r'
  )
  [ -n "${_p}" ] && target_provider="${_p}"
  [ -n "${_m}" ] && target_model="${_m}"
fi

# ---- Blocked provider guard ----
# If the resolved provider is in the blocked list, redirect to featherless T1
# and emit a warning. Fail-open: never hard-block a session.
BLOCKED_PROVIDERS="${BLOCKED_PROVIDERS:-openai}"
if [[ ",${BLOCKED_PROVIDERS}," == *",${target_provider},"* ]]; then
  old_provider="${target_provider}"
  old_model="${target_model}"
  target_provider="featherless"
  target_model="Qwen/Qwen2.5-7B-Instruct"
  best_tier=1
  reason="BLOCKED(${old_provider}): pay-per-token provider blocked; redirected to featherless T1 [was: ${old_model}]"
fi

# ---- Log entry ----
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null)
desc_short=$(printf '%s' "${description}" | head -c 200 | tr '\n' ' ')

entry=$(jq -cn \
  --arg ts "${timestamp}" \
  --arg desc "${desc_short}" \
  --arg sub "${sub_type}" \
  --arg model "${model}" \
  --argjson tier "${best_tier}" \
  --arg provider "${target_provider}" \
  --arg tmodel "${target_model}" \
  --arg reason "${reason}" \
  '{
    timestamp: $ts,
    description: $desc,
    subagent_type: $sub,
    model_requested: $model,
    tier: $tier,
    target_provider: $provider,
    target_model: $tmodel,
    reason: $reason
  }' 2>/dev/null)

[ -n "${entry}" ] && printf '%s\n' "${entry}" >> "${LOG_FILE}" 2>/dev/null

# ---- Log rotation ----
MAX_LOG_LINES="${ROUTER_MAX_LOG_LINES:-2000}"
current_lines=$(wc -l < "${LOG_FILE}" 2>/dev/null) || current_lines=0
if [ "${current_lines}" -gt "${MAX_LOG_LINES}" ]; then
  keep=$(( MAX_LOG_LINES * 4 / 5 ))
  tmp=$(mktemp 2>/dev/null) || tmp="${LOG_FILE}.rotate.$$"
  tail -n "${keep}" "${LOG_FILE}" > "${tmp}" 2>/dev/null \
    && cp "${tmp}" "${LOG_FILE}" 2>/dev/null \
    && rm -f "${tmp}" 2>/dev/null
fi

# ---- Hook output ----
# Detect tool-use keywords: if prompt contains bash/file/search ops, don't block
TOOL_USE_PATTERN="${TOOL_USE_PATTERN:-bash|glob|grep|install|execute|curl|npm |pip |webfetch|websearch}"
has_tool_use=false
if [[ "${haystack}" =~ ${TOOL_USE_PATTERN} ]]; then
  has_tool_use=true
fi

advisory="ROUTER tier=${best_tier} provider=${target_provider} model=${target_model} — ${reason}"

if [ "${ROUTER_BLOCK_ENABLED}" = "true" ] \
   && [ "${best_tier}" -lt 4 ] \
   && [ "${sub_type}" = "general-purpose" ] \
   && [ "${has_tool_use}" = "false" ]; then
  # Deny: redirect to cheaper tier
  jq -cn \
    --arg adv "${advisory}" \
    '{hookSpecificOutput: {permissionDecision: "deny", denyReason: ("Use cheaper tier instead. " + $adv), additionalContext: $adv}}' 2>/dev/null
else
  # Advisory only
  jq -cn --arg adv "${advisory}" \
    '{hookSpecificOutput: {additionalContext: $adv}}' 2>/dev/null
fi

exit 0
