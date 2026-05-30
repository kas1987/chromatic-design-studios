#!/usr/bin/env python3
"""Claude hook policy gate — T4 governance enforcement.

Reads a Claude Code hook payload from stdin and emits a hook decision JSON.
Designed for PreToolUse-style permission checks.

Bash classification uses segment-level + subshell-aware scanning to prevent
safe-prefix bypass via $() or backtick expressions (mc-vkg).
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path, PurePosixPath
from typing import Any, Dict

sys.path.insert(0, str(Path(__file__).resolve().parent))

SAFE_BASH_PREFIXES = (
    "git status",
    "git diff",
    "git log",
    "git branch",
    "git show",
    "python -m pytest",
    "pytest",
    "npm test",
    "npm run test",
    "npm run lint",
    "ruff check",
    "black .",
)

ASK_BASH_MARKERS = (
    "pip install",
    "npm install",
    "pnpm install",
    "yarn install",
    "docker",
    "git clean",
)

# T4 operations — always deny, no exceptions
DENY_BASH_MARKERS = (
    "git push --force",
    "git push -f ",
    "git push -f\n",
    "git reset --hard",
    "git push origin main",
    "git push origin master",
    "rm -rf /",
    "rm -rf ~",
    "sudo ",
    "chmod -R 777",
    "cat ~/.ssh",
    "cat .env",
    "cat ~/.env",
)

# Read-only prefixes that are safe even if they contain a deny-marker string
_SAFE_PREFIXES = re.compile(
    r"^\s*(grep|egrep|fgrep|rg|echo|cat|head|tail|awk|sed|less|more|"
    r"python3?\s+-[cm]|jq|wc|diff|ls|find|which|type|printf|#)"
)

ALLOWED_PATH_PREFIXES = (
    ".claude/",
    "06_CONFIG/",
    "08_TESTS/",
    "hooks/",
    "config/",
    "docs/",
    "scripts/",
    "tests/",
    "knowledge/",
)

ASK_PATH_PREFIXES = (".github/",)

ASK_PATH_NAMES = {
    "Dockerfile",
    "docker-compose.yml",
    "package.json",
    "package-lock.json",
    "pyproject.toml",
    "requirements.txt",
}

DENY_PATH_NAMES = {
    ".env",
    "id_rsa",
    "id_ed25519",
}

DENY_PATH_SUFFIXES = (
    ".pem",
    ".key",
)


# ── Subshell-aware bash classification ────────────────────────────────────────


def _extract_subshells(text: str) -> list:
    """Extract content from $(...) and `...` subshell expressions (handles nesting)."""
    result = []
    i = 0
    while i < len(text):
        if text[i : i + 2] == "$(":
            depth = 1
            j = i + 2
            while j < len(text) and depth > 0:
                if text[j : j + 2] == "$(":
                    depth += 1
                    j += 2
                elif text[j] == ")":
                    depth -= 1
                    j += 1
                else:
                    j += 1
            inner = text[i + 2 : j - 1]
            result.append(inner)
            result.extend(_extract_subshells(inner))
            i = j
        elif text[i] == "`":
            j = i + 1
            while j < len(text) and text[j] != "`":
                if text[j] == "\\":
                    j += 1
                j += 1
            inner = text[i + 1 : j]
            result.append(inner)
            i = j + 1
        else:
            i += 1
    return result


def _marker_is_live(command: str, marker: str) -> bool:
    """Return True only if marker appears as a real executed command.

    A safe prefix (grep, echo, cat …) does NOT protect subshell content —
    `echo $(git reset --hard HEAD)` is still destructive.
    """
    if marker not in command:
        return False

    for segment in re.split(r"[;&|]\s*", command):
        segment = segment.strip()
        if marker not in segment:
            continue

        if not _SAFE_PREFIXES.match(segment):
            before = segment[: segment.index(marker)]
            if before.count('"') % 2 == 0 and before.count("'") % 2 == 0:
                return True
        else:
            # Safe prefix shields the segment itself, but not its subshells
            for subshell in _extract_subshells(segment):
                if marker not in subshell:
                    continue
                for sub_seg in re.split(r"[;&|]\s*", subshell):
                    sub_seg = sub_seg.strip()
                    if marker in sub_seg:
                        before = sub_seg[: sub_seg.index(marker)]
                        if before.count('"') % 2 == 0 and before.count("'") % 2 == 0:
                            return True

    return False


# ── Decision emitter ──────────────────────────────────────────────────────────


def emit(decision: str, reason: str, event: str = "PreToolUse") -> None:
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": event,
                    "permissionDecision": decision,
                    "permissionDecisionReason": reason,
                }
            }
        )
    )


# ── Path classification ───────────────────────────────────────────────────────


def normalize_path(value: str) -> str:
    normalized = value.replace("\\", "/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    return normalized


def classify_path(path: str) -> tuple:
    normalized = normalize_path(path)
    name = PurePosixPath(normalized).name

    if name in DENY_PATH_NAMES or normalized.endswith(DENY_PATH_SUFFIXES):
        return "deny", f"Blocked protected path: {path}"

    if normalized.startswith(".ssh/") or "/.ssh/" in normalized:
        return "deny", f"Blocked SSH material path: {path}"

    if normalized.startswith(ASK_PATH_PREFIXES) or name in ASK_PATH_NAMES:
        return "ask", f"Manual approval required for sensitive repo path: {path}"

    if normalized.startswith(ALLOWED_PATH_PREFIXES):
        return "allow", f"Allowed repo-governance path: {path}"

    return "allow", f"Path allowed by default policy: {path}"


# ── Bash classification ───────────────────────────────────────────────────────


def classify_bash(command: str) -> tuple:
    # T4 deny — subshell-aware (mc-vkg). Only hard-blocked operations are denied.
    for marker in DENY_BASH_MARKERS:
        if _marker_is_live(command, marker):
            return "deny", f"T4 operation blocked: {marker!r} in command"

    # All other Bash commands are allowed — Bash(*) is in the global allow list
    # and the hook must not generate spurious 'ask' decisions that override it.
    return "allow", "Bash command allowed by policy"


# ── Payload router ────────────────────────────────────────────────────────────


def classify_payload(payload: Dict[str, Any]) -> tuple:
    tool_name = payload.get("tool_name") or payload.get("tool") or ""
    tool_input = payload.get("tool_input") or payload.get("input") or {}

    if tool_name == "Bash":
        return classify_bash(str(tool_input.get("command", "")))

    if tool_name in {"Edit", "Write", "MultiEdit"}:
        path = str(
            tool_input.get("file_path")
            or tool_input.get("path")
            or tool_input.get("filename")
            or ""
        )
        if not path:
            return "allow", f"No path found for {tool_name}; allowing by default"
        return classify_path(path)

    return (
        "defer",
        f"No local policy for tool {tool_name}; deferring to Claude/default permissions",
    )


# ── Audit logging (best-effort) ───────────────────────────────────────────────


def _try_emit_audit_event(payload: Dict[str, Any], decision: str, reason: str) -> None:
    try:
        from audit_log import append_event, build_event, DEFAULT_LOG_PATH
        import argparse

        tool_name = payload.get("tool_name") or payload.get("tool") or "unknown"
        tool_input = payload.get("tool_input") or payload.get("input") or {}
        action = str(
            tool_input.get("command")
            or tool_input.get("file_path")
            or tool_input.get("path")
            or ""
        )
        args = argparse.Namespace(
            event_type="permission_decision",
            event_id=None,
            timestamp=None,
            severity="info",
            source_repo=os.getenv("AGENTOPS_SOURCE_REPO", "kas1987/claude-config"),
            source_component="hooks.policy_gate",
            agent_id=os.getenv("AGENTOPS_AGENT_ID"),
            session_id=os.getenv("AGENTOPS_SESSION_ID"),
            task_id=os.getenv("AGENTOPS_TASK_ID"),
            run_id=os.getenv("AGENTOPS_RUN_ID"),
            parent_event_id=None,
            duration_ms=None,
        )
        event = build_event(
            args,
            {
                "tool": tool_name,
                "action": action,
                "decision": decision,
                "reason": reason,
            },
        )
        log_path = Path(os.getenv("AGENTOPS_LOG_PATH", str(DEFAULT_LOG_PATH)))
        append_event(event, log_path)
    except Exception:
        pass


# ── Entry point ───────────────────────────────────────────────────────────────


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    decision, reason = classify_payload(payload)
    emit(decision, reason)
    _try_emit_audit_event(payload, decision, reason)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
