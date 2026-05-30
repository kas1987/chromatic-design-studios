#!/usr/bin/env bash
# ollama-liveness.sh — SessionStart hook that probes Ollama at localhost:11434.
# If Ollama is down, attempts to start it before giving up.
# Writes ~/.claude/.agents/router/ollama-status.json so model-router.sh can
# skip tier 0 instantly instead of timing out on every Agent call.
# Non-blocking: always exits 0.

set -u

STATUS_DIR="${HOME}/.claude/.agents/router"
STATUS_FILE="${STATUS_DIR}/ollama-status.json"
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
PROBE_TIMEOUT=2   # seconds for each probe
OLLAMA_EXE="C:/Users/kas41/AppData/Local/Programs/Ollama/ollama.exe"
WAIT_AFTER_START=4  # seconds to wait for Ollama to come up after launch

mkdir -p "${STATUS_DIR}" 2>/dev/null

probe_ollama() {
  local timeout="${1:-$PROBE_TIMEOUT}"
  curl --silent --fail --max-time "${timeout}" "${OLLAMA_URL}/api/tags" 2>/dev/null
}

start_ms=$(date +%s%3N 2>/dev/null || echo 0)
response=$(probe_ollama) && probe_ok=true || probe_ok=false
end_ms=$(date +%s%3N 2>/dev/null || echo 0)
elapsed=$(( end_ms - start_ms ))

if ! ${probe_ok}; then
  # Attempt to start Ollama via PowerShell (Windows native process)
  powershell.exe -NonInteractive -NoProfile -Command \
    "Start-Process -FilePath '${OLLAMA_EXE}' -WindowStyle Hidden" \
    2>/dev/null || true

  sleep "${WAIT_AFTER_START}"

  start_ms=$(date +%s%3N 2>/dev/null || echo 0)
  response=$(probe_ollama 3) && probe_ok=true || probe_ok=false
  end_ms=$(date +%s%3N 2>/dev/null || echo 0)
  elapsed=$(( end_ms - start_ms ))
fi

ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if ${probe_ok}; then
  model_count=$(printf '%s' "${response}" | jq '.models | length' 2>/dev/null || echo 0)
  jq -cn \
    --arg ts "${ts}" \
    --arg url "${OLLAMA_URL}" \
    --argjson ms "${elapsed}" \
    --argjson n "${model_count}" \
    '{up:true,checked_at:$ts,ollama_url:$url,response_ms:$ms,model_count:$n}' \
    > "${STATUS_FILE}" 2>/dev/null
else
  jq -cn \
    --arg ts "${ts}" \
    --arg url "${OLLAMA_URL}" \
    --argjson ms "${elapsed}" \
    '{up:false,checked_at:$ts,ollama_url:$url,response_ms:$ms,model_count:0}' \
    > "${STATUS_FILE}" 2>/dev/null
  printf '{"systemMessage": "ROUTER: Ollama unreachable at %s after auto-start attempt — tier-0 (local) routing disabled. Tier-1+ active."}\n' \
    "${OLLAMA_URL}"
fi

exit 0
