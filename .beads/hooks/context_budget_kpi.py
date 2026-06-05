#!/usr/bin/env python3
"""context_budget_adherence KPI collector.

Emits two complementary signals into the agentops events log so the harness can
measure whether autocompaction actually fires near the TARGET_FRACTION (0.55)
of the active model's real context window.

Modes:
  --session-start  (SessionStart hook): reads the model from stdin, computes the
                   CONFIGURED target pct (autoCompactWindow / window) and logs it
                   as the *intent*. Also caches the active window to a state file
                   so the PreCompact pass can resolve the real pct (the PreCompact
                   stdin does NOT carry the model id).
  --precompact     (PreCompact hook): reads the trigger from stdin and logs the
                   *actual* pct at the real compaction moment, using the cached
                   window. config-vs-reality drift = target_pct - actual_pct.

Read-only w.r.t. settings. Always exits 0 so it can never block a session.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

CLAUDE_HOME = Path(os.path.expanduser("~/.claude"))
SETTINGS = CLAUDE_HOME / "settings.json"
EVENTS_LOG = CLAUDE_HOME / "knowledge" / "10_RUNTIME" / "logs" / "agentops-events.jsonl"
STATE_FILE = CLAUDE_HOME / "knowledge" / "10_RUNTIME" / "context-budget-state.json"

TARGET_FRACTION = 0.55
DEFAULT_WINDOW = 200_000


def window_for_model(model: str | None) -> int:
    if not model:
        return DEFAULT_WINDOW
    m = model.lower()
    if "1m" in m or "1000000" in m or "1048576" in m:
        return 1_000_000
    return DEFAULT_WINDOW


def read_stdin_json() -> dict:
    try:
        raw = sys.stdin.read()
    except Exception:
        return {}
    if not raw or not raw.strip():
        return {}
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def model_from_payload(data: dict) -> str | None:
    model = data.get("model")
    if isinstance(model, dict):
        return model.get("id") or model.get("display_name")
    if isinstance(model, str):
        return model
    return None


def read_json_file(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def autocompact_window() -> int | None:
    val = read_json_file(SETTINGS).get("autoCompactWindow")
    return int(val) if isinstance(val, (int, float)) else None


def autocompact_pct() -> int | None:
    """The configured percentage trigger (CLAUDE_AUTOCOMPACT_PCT_OVERRIDE).

    This is the real, window-agnostic knob: a percentage of the model's actual
    context window, so it yields the same target on 200k and 1M models. Checked
    in the OS env first, then the settings.json ``env`` block.
    """
    val = os.environ.get("CLAUDE_AUTOCOMPACT_PCT_OVERRIDE")
    if val is None:
        env = read_json_file(SETTINGS).get("env")
        if isinstance(env, dict):
            val = env.get("CLAUDE_AUTOCOMPACT_PCT_OVERRIDE")
    try:
        return int(val) if val is not None else None
    except (TypeError, ValueError):
        return None


def configured_target_pct(window: int) -> float | None:
    """Resolve the configured compaction trigger as a percentage.

    Precedence: explicit PCT override → legacy autoCompactWindow/window →
    recommended TARGET_FRACTION.
    """
    pct = autocompact_pct()
    if pct is not None:
        return float(pct)
    acw = autocompact_window()
    if acw:
        return round((acw / window) * 100, 1)
    return round(TARGET_FRACTION * 100, 1)


def emit(event_type: str, payload: dict, severity: str = "info") -> None:
    record = {
        "agent_id": None,
        "duration_ms": None,
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "parent_event_id": None,
        "payload": payload,
        "run_id": None,
        "schema_version": "1.0.0",
        "session_id": payload.get("session_id"),
        "severity": severity,
        "source_component": "hooks.context_budget_kpi",
        "source_repo": "kas1987/claude-config",
        "task_id": None,
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    try:
        EVENTS_LOG.parent.mkdir(parents=True, exist_ok=True)
        with EVENTS_LOG.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record) + "\n")
    except OSError:
        pass  # never block on telemetry


def last_compact_drift() -> dict | None:
    """Scan the event log tail for the most recent context_pct_at_compact."""
    try:
        lines = EVENTS_LOG.read_text(encoding="utf-8").splitlines()
    except OSError:
        return None
    for line in reversed(lines[-500:]):
        if "context_pct_at_compact" not in line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if ev.get("event_type") == "context_pct_at_compact":
            return ev.get("payload") or {}
    return None


def do_session_start() -> int:
    data = read_stdin_json()
    model = model_from_payload(data)
    window = window_for_model(model)
    acw = autocompact_window()
    pct = autocompact_pct()
    target_pct = configured_target_pct(window)

    # Boot-time drift alarm: surface config rot from the *previous* compaction.
    prev = last_compact_drift()
    if prev and isinstance(prev.get("drift_pct"), (int, float)) and abs(prev["drift_pct"]) > 10:
        print(
            f"[context-budget] last compaction fired at "
            f"{prev.get('context_pct_at_compact')}% of a {prev.get('window'):,}-token "
            f"window (drift {prev['drift_pct']:+}% vs {int(TARGET_FRACTION * 100)}% target). "
            f"Set CLAUDE_AUTOCOMPACT_PCT_OVERRIDE={int(TARGET_FRACTION * 100)} in "
            f"~/.claude/settings.json env (a percentage scales to any window).",
            file=sys.stderr,
        )

    # Cache window + configured pct so PreCompact can resolve the trigger.
    try:
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(
            json.dumps(
                {
                    "model": model,
                    "window": window,
                    "autoCompactWindow": acw,
                    "autoCompactPct": pct,
                }
            ),
            encoding="utf-8",
        )
    except OSError:
        pass

    emit(
        "context_budget_target",
        {
            "session_id": data.get("session_id"),
            "model": model,
            "window": window,
            "autoCompactWindow": acw,
            "autoCompactPct": pct,
            "target_pct": target_pct,
            "recommended_pct": int(TARGET_FRACTION * 100),
        },
    )
    return 0


def do_precompact() -> int:
    data = read_stdin_json()
    state = read_json_file(STATE_FILE)
    window = state.get("window") or DEFAULT_WINDOW
    acw = state.get("autoCompactWindow") or autocompact_window()
    # Prefer the percentage knob (cached at session start) — it IS the trigger.
    pct = state.get("autoCompactPct")
    if pct is None:
        pct = autocompact_pct()
    if pct is not None:
        actual_pct = float(pct)
    elif acw:
        actual_pct = round((acw / window) * 100, 1)
    else:
        actual_pct = None
    target_pct = int(TARGET_FRACTION * 100)
    drift_pct = round(actual_pct - target_pct, 1) if actual_pct is not None else None

    emit(
        "context_pct_at_compact",
        {
            "session_id": data.get("session_id"),
            "trigger": data.get("trigger"),
            "model": state.get("model"),
            "window": window,
            "autoCompactWindow": acw,
            "autoCompactPct": pct,
            "context_pct_at_compact": actual_pct,
            "target_pct": target_pct,
            "drift_pct": drift_pct,
        },
        severity="warning" if (drift_pct is not None and abs(drift_pct) > 10) else "info",
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--session-start", action="store_true")
    group.add_argument("--precompact", action="store_true")
    args = parser.parse_args()
    if args.session_start:
        return do_session_start()
    return do_precompact()


if __name__ == "__main__":
    sys.exit(main())
