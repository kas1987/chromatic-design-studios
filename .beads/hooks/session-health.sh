#!/usr/bin/env bash
# session-health.sh — SessionStart hook: catch broken state before session begins
# Always exits 0 (fail-open)
set -u

LOG_DIR="${HOME}/.claude/.agents/router"
mkdir -p "${LOG_DIR}" 2>/dev/null || true

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null)

# gh auth check
gh_status="fail"
if gh auth status >/dev/null 2>&1; then
  gh_status="ok"
fi

# bd CLI check
bd_status="fail"
if bd version >/dev/null 2>&1; then
  bd_status="ok"
fi

# secret scan: look for raw GitHub PAT in settings.json
secret_status="clean"
settings_file="${HOME}/.claude/settings.json"
if [ -f "${settings_file}" ] && grep -qE 'ghp_[A-Za-z0-9]{36}' "${settings_file}" 2>/dev/null; then
  secret_status="warn"
fi

# Write JSON status
jq -cn \
  --arg ts "${timestamp}" \
  --arg gh "${gh_status}" \
  --arg bd "${bd_status}" \
  --arg sec "${secret_status}" \
  '{checked_at: $ts, gh_auth: $gh, bd: $bd, secret_scan: $sec}' \
  > "${LOG_DIR}/session-health.json" 2>/dev/null || true

# Append human-readable log line
printf '[%s] gh=%s bd=%s secrets=%s\n' \
  "${timestamp}" "${gh_status}" "${bd_status}" "${secret_status}" \
  >> "${LOG_DIR}/session-health.log" 2>/dev/null || true

exit 0
