#!/usr/bin/env bash
# Warn at session start if Axis P quota state is missing or stale (>135 min).
# Live capture runs every 2h (quota-capture routine, kept under the 15/day
# "included routine runs" cap); 135 min tolerates one missed run.
# Manual fallback: quota-seed --pct N --reset-days D  (values from Claude.ai /usage)

file="$HOME/.claude/powerline/usage/quota_state.json"

if [ ! -f "$file" ]; then
  echo "[quota] WARNING: quota_state.json missing — run: quota-seed --pct N --reset-days D"
elif [ -z "$(find "$file" -mmin -135 2>/dev/null)" ]; then
  age=$(( ($(date +%s) - $(date -r "$file" +%s 2>/dev/null || echo 0)) / 60 ))
  echo "[quota] WARNING: Axis P stale (~${age}min) — run: quota-seed --pct N --reset-days D"
fi
