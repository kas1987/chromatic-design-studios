# GO Mode Protocol

When the user says `GO`, the system must:

1. Read `getdesign.md`.
2. Read `PROJECT_STATE.md`.
3. Read `DESIGN_QUEUE.md`.
4. Select highest-priority unblocked task.
5. Score confidence.
6. Execute only if score permits.
7. Update state and decision logs.
8. Produce next recommended task.

## Confidence Bands

| Score | Behavior |
|---:|---|
| 90-100 | Execute scoped task normally |
| 75-89 | Execute with normal logging |
| 60-74 | Draft only if reversible |
| 0-59 | Halt and request missing context or create blocked task |

## Stop Conditions

- Task scope unclear.
- Required file missing.
- Risk is high and no human approval exists.
- Agent needs to modify files outside allowed scope.
- Task requires secrets, deployment, deletion, or external cost.
