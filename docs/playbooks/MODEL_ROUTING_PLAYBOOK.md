# Model Routing Playbook

## Purpose
Route work to the cheapest/strongest fitting model instead of defaulting to expensive thinkers.

## Routing table

| Task | Preferred model class | Notes |
|---|---|---|
| Repo tree edits | Codex / strong code model | Needs file discipline |
| UI design implementation | Claude Design / frontend-capable model | Give visual brief and component constraints |
| PDR drafting | GPT / Claude strong writing model | Needs structure and governance clarity |
| Cheap classification | Small local model | Use for labels, routing, triage |
| Long context audit | Large-context model | Use only when scoped evidence is required |
| Image/video prompt writing | Creative model | Keep prompt variants versioned |
| SQL/schema generation | Code model | Validate with tests |

## Default principle
Use the smallest model that can complete the task with confidence >= 75.

## Escalation rule
Escalate model size only when:

- context is too long,
- reasoning depth is insufficient,
- validation fails twice,
- or the task is architectural/high-risk.
