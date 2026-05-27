# GO Mode Playbook

## Purpose
Define what agents should do when the user gives a minimal command such as `GO`.

## GO means
Proceed with the highest-priority unblocked task in `handoffs/AGENT_HANDOFF_QUEUE.md`.

## GO does not mean
- Search the whole repo.
- Invent new scope.
- Change secrets.
- Delete files.
- Deploy publicly.
- Rewrite architecture without a PDR.

## Execution loop

```text
Read queue -> Select task -> Score confidence -> Execute smallest safe step -> Validate -> Record -> Queue next
```

## Confidence gate

| Score | Action |
|---:|---|
| 90-100 | Execute normally |
| 75-89 | Execute scoped task |
| 60-74 | Only reversible edits |
| 40-59 | Produce plan only |
| 0-39 | Halt |

## Required log after action

```md
## Run Note
- Task ID:
- Action:
- Files changed:
- Confidence:
- Validation:
- Next task:
```
