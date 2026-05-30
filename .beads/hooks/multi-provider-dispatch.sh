#!/usr/bin/env bash
# multi-provider-dispatch.sh — dispatch a prompt file to a provider tier.
#
# Usage:
#   multi-provider-dispatch.sh <tier> <prompt-file>   dispatch tier 0-4
#   multi-provider-dispatch.sh --auto <prompt-file>   read router log, pick tier
#   multi-provider-dispatch.sh --test                 smoke all tiers 0-3
#   multi-provider-dispatch.sh --help                 show Usage
#
# Outputs JSON to stdout. Writes log entry to dispatch.jsonl.
# Exit codes: 0=success or usage, 1=error/all-failed

set -u

TIERS_FILE="${ROUTER_TIERS_FILE:-${HOME}/.claude/config/provider-tiers.json}"
LOG_DIR="${ROUTER_LOG_DIR:-${HOME}/.claude/.agents/router}"
DISPATCH_LOG="${LOG_DIR}/dispatch.jsonl"
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"

mkdir -p "${LOG_DIR}" 2>/dev/null || true

# ---- helpers ----

usage() {
  printf 'Usage:\n'
  printf '  multi-provider-dispatch.sh <tier> <prompt-file>\n'
  printf '  multi-provider-dispatch.sh --auto <prompt-file>\n'
  printf '  multi-provider-dispatch.sh --test\n'
  printf '  multi-provider-dispatch.sh --help\n'
}

error_json() {
  local tier="${1:-?}" provider="${2:-unknown}" model="${3:-unknown}" msg="${4:-dispatch failed}"
  jq -cn \
    --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)" \
    --argjson tier "${tier}" \
    --arg provider "${provider}" \
    --arg model "${model}" \
    --arg msg "${msg}" \
    '{error: $msg, tier: $tier, provider: $provider, model: $model, timestamp: $ts}'
}

log_dispatch() {
  local tier="${1}" provider="${2}" model="${3}" path="${4}" status="${5:-attempted}"
  jq -cn \
    --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)" \
    --argjson tier "${tier}" \
    --arg provider "${provider}" \
    --arg model "${model}" \
    --arg path "${path}" \
    --arg status "${status}" \
    '{timestamp: $ts, tier: $tier, provider: $provider, model: $model, path: $path, status: $status}' \
    >> "${DISPATCH_LOG}" 2>/dev/null || true
}

resolve_tier() {
  local tier="$1"
  local provider="unknown" model="unknown"
  if [ -r "${TIERS_FILE}" ]; then
    provider=$(jq -r --argjson t "${tier}" '.tiers[$t | tostring].primary.provider // "unknown"' "${TIERS_FILE}" 2>/dev/null)
    model=$(jq -r --argjson t "${tier}" '.tiers[$t | tostring].primary.model // "unknown"' "${TIERS_FILE}" 2>/dev/null)
  fi
  printf '%s %s' "${provider}" "${model}"
}

dispatch_tier() {
  local tier="$1" prompt_file="$2"
  local provider model pair
  pair=$(resolve_tier "${tier}")
  provider=$(printf '%s' "${pair}" | cut -d' ' -f1)
  model=$(printf '%s' "${pair}" | cut -d' ' -f2)

  log_dispatch "${tier}" "${provider}" "${model}" "${prompt_file}" "attempted"

  case "${tier}" in
    4)
      # Claude is handled natively by Claude Code — no external dispatch needed
      jq -cn \
        --argjson tier "${tier}" \
        --arg provider "${provider}" \
        --arg model "${model}" \
        '{note: "tier-4 (claude) is handled natively by Claude Code; no external dispatch", tier: $tier, provider: $provider, model: $model}'
      return 0
      ;;
    0)
      # Ollama
      local prompt_text
      prompt_text=$(cat "${prompt_file}" 2>/dev/null)
      local response
      response=$(curl --silent --fail --max-time 10 \
        -X POST "${OLLAMA_URL}/api/generate" \
        -H 'Content-Type: application/json' \
        -d "$(jq -cn --arg m "${model}" --arg p "${prompt_text}" '{model:$m,prompt:$p,stream:false}')" \
        2>/dev/null) || {
        error_json "${tier}" "${provider}" "${model}" "ollama unreachable at ${OLLAMA_URL}"
        return 1
      }
      printf '%s' "${response}"
      return 0
      ;;
    1)
      # Featherless
      local key="${FEATHERLESS_API_KEY:-}"
      if [ -z "${key}" ]; then
        error_json "${tier}" "${provider}" "${model}" "FEATHERLESS_API_KEY not set"
        return 1
      fi
      local prompt_text
      prompt_text=$(cat "${prompt_file}" 2>/dev/null)
      local response
      response=$(curl --silent --fail --max-time 15 \
        -X POST "https://api.featherless.ai/v1/chat/completions" \
        -H "Authorization: Bearer ${key}" \
        -H "Content-Type: application/json" \
        -d "$(jq -cn --arg m "${model}" --arg p "${prompt_text}" '{model:$m,messages:[{role:"user",content:$p}],max_tokens:512}')" \
        2>/dev/null) || {
        error_json "${tier}" "${provider}" "${model}" "featherless API call failed"
        return 1
      }
      printf '%s' "${response}"
      return 0
      ;;
    2)
      # OpenAI
      local key="${OPENAI_API_KEY:-}"
      if [ -z "${key}" ]; then
        error_json "${tier}" "${provider}" "${model}" "OPENAI_API_KEY not set"
        return 1
      fi
      local prompt_text
      prompt_text=$(cat "${prompt_file}" 2>/dev/null)
      local response
      response=$(curl --silent --fail --max-time 15 \
        -X POST "https://api.openai.com/v1/chat/completions" \
        -H "Authorization: Bearer ${key}" \
        -H "Content-Type: application/json" \
        -d "$(jq -cn --arg m "${model}" --arg p "${prompt_text}" '{model:$m,messages:[{role:"user",content:$p}],max_tokens:512}')" \
        2>/dev/null) || {
        error_json "${tier}" "${provider}" "${model}" "openai API call failed"
        return 1
      }
      printf '%s' "${response}"
      return 0
      ;;
    3)
      # Gemini
      local key="${GEMINI_API_KEY:-}"
      if [ -z "${key}" ]; then
        error_json "${tier}" "${provider}" "${model}" "GEMINI_API_KEY not set"
        return 1
      fi
      local prompt_text
      prompt_text=$(cat "${prompt_file}" 2>/dev/null)
      local response
      response=$(curl --silent --fail --max-time 15 \
        "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}" \
        -H "Content-Type: application/json" \
        -d "$(jq -cn --arg p "${prompt_text}" '{contents:[{parts:[{text:$p}]}]}')" \
        2>/dev/null) || {
        error_json "${tier}" "${provider}" "${model}" "gemini API call failed"
        return 1
      }
      printf '%s' "${response}"
      return 0
      ;;
    *)
      error_json "${tier}" "unknown" "unknown" "unknown tier: ${tier}"
      return 1
      ;;
  esac
}

# ---- main ----

case "${1:-}" in
  ""|--help)
    usage
    exit 0
    ;;
  --auto)
    if [ -z "${2:-}" ]; then
      printf 'usage: --auto requires a prompt file argument\n' >&2
      exit 1
    fi
    prompt_file="$2"
    if [ ! -f "${prompt_file}" ]; then
      error_json "0" "unknown" "unknown" "prompt file not found: ${prompt_file}"
      exit 1
    fi
    # Read latest recommended tier from router log
    tier=4
    if [ -f "${LOG_DIR}/log.jsonl" ]; then
      _t=$(tail -1 "${LOG_DIR}/log.jsonl" | jq -r '.tier // 4' 2>/dev/null)
      [[ "${_t}" =~ ^[0-4]$ ]] && tier="${_t}"
    fi
    dispatch_tier "${tier}" "${prompt_file}"
    ;;
  --test)
    printf 'Smoke testing tiers 0-3 (expect errors without API keys/Ollama):\n'
    prompt_file=$(mktemp)
    printf 'Reply with exactly: test OK' > "${prompt_file}"
    for t in 0 1 2 3; do
      pair=$(resolve_tier "${t}")
      provider=$(printf '%s' "${pair}" | cut -d' ' -f1)
      printf 'tier %d (%s): ' "${t}" "${provider}"
      result=$(dispatch_tier "${t}" "${prompt_file}" 2>/dev/null)
      if printf '%s' "${result}" | jq -e '.error' >/dev/null 2>&1; then
        msg=$(printf '%s' "${result}" | jq -r '.error' 2>/dev/null)
        printf 'error: %s\n' "${msg}"
      elif printf '%s' "${result}" | jq -e '.note' >/dev/null 2>&1; then
        printf 'note: native\n'
      else
        printf 'ok\n'
      fi
    done
    rm -f "${prompt_file}"
    exit 0
    ;;
  [0-9]*)
    tier="$1"
    prompt_file="${2:-}"
    if [ -z "${prompt_file}" ] || [ ! -f "${prompt_file}" ]; then
      error_json "${tier}" "unknown" "unknown" "prompt file not found: ${prompt_file:-<missing>}"
      exit 1
    fi
    dispatch_tier "${tier}" "${prompt_file}"
    ;;
  *)
    usage
    exit 0
    ;;
esac
