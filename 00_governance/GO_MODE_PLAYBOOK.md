# GO Mode Playbook — Chromatic Design Studios

## Purpose

GO Mode is the autonomous execution protocol for Chromatic Design Studios. When a task is scored high-confidence, the system may execute without human approval. When confidence is low, the system MUST stop and ask.

## Task Selection Protocol

1. **Read** `PROJECT_STATE.md` to understand current objective
2. **Read** `DESIGN_QUEUE.md` to see the prioritized task list
3. **Pick** the highest-priority unblocked task with status = `pending` or `ready`
4. **Score** confidence (see Confidence Scoring below)
5. **Execute** only if score >= 3 (Green or Yellow gate)

## Confidence Scoring

Score each task on a 1-5 scale before execution:

| Score | Label | Behavior |
|-------|-------|----------|
| 5 | Green | Auto-execute. No human approval needed. |
| 4 | Green | Auto-execute. Log decision to PROJECT_STATE.md. |
| 3 | Yellow | Reduce scope to the safest sub-task, then execute. Log rationale. |
| 2 | Red | STOP. Document blockers in PROJECT_STATE.md. Ask human. |
| 1 | Red | STOP immediately. Do not attempt. Ask human. |

### Scoring Dimensions

| Dimension | Weight | Question |
|-----------|--------|----------|
| Clarity | 30% | Is the task description unambiguous? |
| Context | 25% | Do I have all needed files, tokens, and specs? |
| Risk | 25% | Could this break existing assets or overwrite important files? |
| Time | 20% | Can this be completed in <= 3 iterations? |

### Composite Score

- **5.0–4.0** → Green
- **3.9–3.0** → Yellow
- **2.9–1.0** → Red

## Execution Rules

### Green Gate (4–5)

- Execute the full task as specified
- Write outputs to the designated files
- Update DESIGN_QUEUE.md to `in_progress` → `done`
- Update PROJECT_STATE.md with completion note
- Do NOT exceed the task scope

### Yellow Gate (3)

- Identify the safest sub-task within the scope
- Execute ONLY that sub-task
- Update DESIGN_QUEUE.md with partial completion note
- Log: `PARTIAL: [sub-task completed] — remaining: [list]`
- Stop after sub-task. Do NOT proceed to riskier parts.

### Red Gate (1–2)

- STOP immediately
- Do NOT modify any files
- Write to PROJECT_STATE.md: `BLOCKED: [task ID] — reason: [scoring breakdown]`
- Ask human for clarification or scope reduction

## Stop Conditions

A GO-mode session MUST stop when ANY of the following occur:

1. **Scope drift detected** — the agent is modifying files not listed in the task output
2. **Tool overuse** — more than 5 tool calls without meaningful progress
3. **Iteration limit** — 3 iterations on the same task without completion
4. **Confidence drop** — mid-task confidence falls below 3
5. **File collision** — attempting to modify a file locked by another task
6. **Destructive operation** — deletion of non-temporary files without explicit task permission

## Post-Execution

After any execution (complete or partial):

1. Update `DESIGN_QUEUE.md` status
2. Update `PROJECT_STATE.md` with what was done
3. If new tasks were discovered, add them to `DESIGN_QUEUE.md` with `discovered` label
4. If files were created outside expected paths, update `CHROMATIC_TREES.md`
