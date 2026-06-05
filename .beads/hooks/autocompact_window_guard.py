#!/usr/bin/env python3
"""autoCompact window guard.

autoCompactWindow in settings.json is an ABSOLUTE token threshold, not a
fraction. It must track the desired fraction (TARGET_FRACTION) of the ACTIVE
model's real context window. A value tuned for a 200k window (e.g. 110000)
fires autocompaction at only ~11% of a 1,000,000-token window — far too early.

Default mode (SessionStart hook): READ-ONLY. Reads the SessionStart JSON on
stdin, detects the model's context window, and if the baked-in
autoCompactWindow drifts from the recommended value, prints a warning with the
exact fix command. Never mutates settings (respects the read-only-proposals
governance rule and the shared-config collision hazard). Always exits 0 so it
can never block a session.

--apply mode (manual): atomically rewrites autoCompactWindow in settings.json
to the recommended value for a given/inferred window. This is the explicit
user-gated action.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path

SETTINGS = Path(os.path.expanduser("~/.claude/settings.json"))
TARGET_FRACTION = 0.55
DEFAULT_WINDOW = 200_000
# Tolerance: don't nag for tiny rounding differences (5% of recommended).
DRIFT_TOLERANCE = 0.05


def window_for_model(model: str | None) -> int:
    """Infer the context window (tokens) from a model identifier string."""
    if not model:
        return DEFAULT_WINDOW
    m = model.lower()
    # 1M beta variants are tagged with a "1m" marker, e.g. claude-opus-4-8[1m].
    if "1m" in m or "[1m]" in m or "1000000" in m or "1048576" in m:
        return 1_000_000
    return DEFAULT_WINDOW


def recommended(window: int) -> int:
    return round(window * TARGET_FRACTION)


def read_settings() -> dict:
    try:
        return json.loads(SETTINGS.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def read_model_from_stdin() -> str | None:
    """SessionStart passes the model as a string field; parse defensively."""
    try:
        raw = sys.stdin.read()
    except Exception:
        return None
    if not raw or not raw.strip():
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    model = data.get("model")
    # statusLine-style nested object {"id": ...} is tolerated too.
    if isinstance(model, dict):
        return model.get("id") or model.get("display_name")
    if isinstance(model, str):
        return model
    return None


def atomic_write(path: Path, text: str) -> None:
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(text)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def do_check(model: str | None) -> int:
    window = window_for_model(model)
    target = recommended(window)
    settings = read_settings()
    current = settings.get("autoCompactWindow")
    if not isinstance(current, (int, float)):
        # Nothing set / unparseable — recommend explicitly.
        print(
            f"[autocompact-guard] autoCompactWindow unset; on a {window:,}-token "
            f"window the recommended value is {target:,} "
            f"({int(TARGET_FRACTION * 100)}%). Fix: python "
            f"~/.claude/hooks/autocompact_window_guard.py --apply",
            file=sys.stderr,
        )
        return 0
    drift = abs(current - target)
    if drift > target * DRIFT_TOLERANCE:
        pct_of_window = (current / window) * 100 if window else 0
        print(
            f"[autocompact-guard] autoCompactWindow={int(current):,} is "
            f"{pct_of_window:.0f}% of the active {window:,}-token window "
            f"(model={model or 'unknown'}). Recommended {target:,} "
            f"({int(TARGET_FRACTION * 100)}%). "
            f"Fix (applies next session): python "
            f"~/.claude/hooks/autocompact_window_guard.py --apply",
            file=sys.stderr,
        )
    return 0


def do_apply(model: str | None, explicit_window: int | None) -> int:
    window = explicit_window or window_for_model(model)
    target = recommended(window)
    settings = read_settings()
    if not settings:
        print("[autocompact-guard] could not read settings.json; aborting apply", file=sys.stderr)
        return 1
    current = settings.get("autoCompactWindow")
    if current == target:
        print(f"[autocompact-guard] autoCompactWindow already {target:,}; no change")
        return 0
    settings["autoCompactWindow"] = target
    atomic_write(SETTINGS, json.dumps(settings, indent=2) + "\n")
    print(
        f"[autocompact-guard] autoCompactWindow {current} -> {target:,} "
        f"({int(TARGET_FRACTION * 100)}% of {window:,}). Takes effect next session."
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="rewrite settings.json (manual, user-gated)")
    parser.add_argument("--window", type=int, default=None, help="override detected context window (tokens)")
    parser.add_argument("--model", default=None, help="model id (skips stdin detection)")
    args = parser.parse_args()

    # In --apply mode there is usually no stdin model; allow --model/--window.
    model = args.model
    if model is None and not args.apply:
        model = read_model_from_stdin()
    elif model is None and args.apply:
        # Best effort: try stdin (may be empty when run manually).
        model = read_model_from_stdin()

    if args.apply:
        return do_apply(model, args.window)
    return do_check(model)


if __name__ == "__main__":
    sys.exit(main())
