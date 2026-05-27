# Confidence Gate Playbook — Chromatic Design Studios

## Gate Thresholds

| Gate | Score Range | Color | Behavior |
|------|-------------|-------|----------|
| Green | 4.0 – 5.0 | 🟢 | Auto-execute full task |
| Yellow | 3.0 – 3.9 | 🟡 | Reduce scope, execute safest sub-task, ask human for remainder |
| Red | 1.0 – 2.9 | 🔴 | STOP. Do not execute. Ask human. |

## Scoring Breakdown

### Clarity (30%)

| Score | Criteria |
|-------|----------|
| 5 | Task has exact file paths, expected output format, and acceptance criteria |
| 4 | Task has file paths and acceptance criteria; output format implied |
| 3 | Task has acceptance criteria but missing exact file paths |
| 2 | Task description is vague; no acceptance criteria |
| 1 | Task is a single sentence or keyword with no structure |

### Context (25%)

| Score | Criteria |
|-------|----------|
| 5 | All referenced files exist and are readable; token system is complete |
| 4 | Most referenced files exist; some tokens may need expansion |
| 3 | Core files exist but some references are missing |
| 2 | Critical files missing (e.g., no token files for the task domain) |
| 1 | Working in a vacuum — no project context available |

### Risk (25%)

| Score | Criteria |
|-------|----------|
| 5 | Task is purely additive (new files, new tokens). No existing assets at risk. |
| 4 | Task modifies isolated files with clear backups / version control. |
| 3 | Task modifies shared files (e.g., base CSS) but changes are scoped. |
| 2 | Task modifies widely-used files without clear rollback plan. |
| 1 | Task involves destructive operations (deletion, overwrite) on critical files. |

### Time (20%)

| Score | Criteria |
|-------|----------|
| 5 | Task is a single file or <= 3 files, <= 200 lines total. |
| 4 | Task touches 4–6 files, <= 500 lines total. |
| 3 | Task touches 7–10 files, <= 1000 lines total. |
| 2 | Task touches 10+ files or requires cross-domain knowledge. |
| 1 | Task is open-ended ("improve the design system") with no boundaries. |

## Composite Formula

```
confidence = (clarity × 0.30) + (context × 0.25) + (risk × 0.25) + (time × 0.20)
```

Round to one decimal place.

## Yellow Gate Protocol

When confidence = 3.x:

1. **Identify the safest sub-task** — the part with highest individual dimension scores
2. **Execute only that sub-task**
3. **Document the remainder** as a new blocked task in DESIGN_QUEUE.md
4. **Log rationale**: `YELLOW GATE: [task] — executed [sub-task] — deferred [remainder] — reason: [lowest dimension]`

## Red Gate Protocol

When confidence <= 2.9:

1. **STOP immediately** — do not write any files
2. **Document blockers** in PROJECT_STATE.md
3. **Ask human** with the exact scoring breakdown
4. **Do not retry** the same task without human input

## Gate Override

A human may explicitly override any gate:

- `OVERRIDE: [task] — human approved execution at confidence [score]`
- Log override in PROJECT_STATE.md
- Proceed with full task (not reduced scope)
