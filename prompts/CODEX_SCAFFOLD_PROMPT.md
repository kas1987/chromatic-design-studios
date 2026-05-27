# Codex Scaffold Prompt

You are implementing the initial scaffold for `chromatic-design-studios`.

## Read first
1. `PDR/CHROMATIC_DESIGN_STUDIOS_SCAFFOLD_PDR.md`
2. `CHROMATIC_TREES.md`
3. `handoffs/AGENT_HANDOFF_QUEUE.md`
4. `playbooks/GO_MODE_PLAYBOOK.md`

## Mission
Execute the highest-priority unblocked task in the handoff queue.

## Rules
- Stay inside allowed files.
- Do not delete existing files.
- Do not access secrets.
- Do not broaden scope.
- Log changed files and validation steps.
- If confidence is below 75, stop and produce a plan instead of mutating.

## Default first task
Scaffold the web app and initialize the repo structure.

## Required output
```md
## Implementation Report
- Task ID:
- Confidence:
- Files changed:
- Commands run:
- Validation:
- Blockers:
- Next task:
```
