#!/usr/bin/env bash
# Checks result files for mandatory ## GOVERNANCE CONSTRAINTS block.
# Emits WARN: governance-header-absent when missing.
# Tier: T0-T2, grep-based, no LLM.
# Usage: check-governance-header.sh <worker-id> <task-id> <result-path>
set -euo pipefail

WORKER_ID="${1:-unknown-worker}"
TASK_ID="${2:-unknown-task}"
RESULT_PATH="${3:-}"

if [[ -z "$RESULT_PATH" || ! -f "$RESULT_PATH" ]]; then
  echo "WARN: governance-header-absent — result file not found: $RESULT_PATH (worker=$WORKER_ID, task=$TASK_ID)"
  exit 0
fi

if ! grep -q "## GOVERNANCE CONSTRAINTS" "$RESULT_PATH" 2>/dev/null; then
  echo "WARN: governance-header-absent — worker=$WORKER_ID task=$TASK_ID result=$RESULT_PATH"
  exit 0
fi

echo "OK: governance-header-present — worker=$WORKER_ID task=$TASK_ID"
exit 0
