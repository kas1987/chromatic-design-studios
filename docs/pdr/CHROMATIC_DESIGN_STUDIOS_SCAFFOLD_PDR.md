# PDR: Chromatic Design Studios Scaffold

## 0. Metadata

| Field | Value |
|---|---|
| PDR Name | Chromatic Design Studios Scaffold |
| Version | 0.1.0 |
| Owner | Sir / Chromatic Harness |
| Status | Draft for implementation |
| Date | 2026-05-27 |
| Target Repo | `chromatic-design-studios` |
| Primary Goal | Scaffold a local-first design/control center for Chromatic Harness visual, prompt, model, and agent workflows |

---

## 1. Executive summary

Chromatic Design Studios should be scaffolded as a **real local-first AI design and operations control center**, not a decorative website. The repo should start with a clean Next.js/T3 frontend, a Chromatic UI/component system, service boundaries for LiteLLM/n8n/Open WebUI/ComfyUI/Ollama, and governance files that let agents continue work from a minimal `GO` command.

The first milestone is a working repo skeleton with clear folders, design tokens, service docs, model-routing placeholders, agent handoff queues, and a visual UI foundation ready for Claude Design or Codex implementation.

---

## 2. Problem statement

The user needs a repeatable scaffold for building Chromatic Design Studios, a system that imitates the high-level design assistance of Claude Design while remaining aligned with the Chromatic Harness operating model.

Current risk:

- Agents may over-search or over-tool.
- UI assets may become scattered.
- Model routing may be inconsistent.
- CSS/design components may be built ad hoc.
- Future `GO` commands may lack enough state to execute safely.

This PDR solves that by defining a controlled scaffold, repo tree, governance files, and first implementation queue.

---

## 3. Objectives

### Primary objectives

1. Scaffold a maintainable repo for Chromatic Design Studios.
2. Provide a clean frontend base using T3/Next.js, Tailwind, and shadcn/ui.
3. Define service boundaries for AI, automation, model routing, and asset generation.
4. Create repo governance files so agents can safely continue from minimal prompts.
5. Prepare handoff prompts for Claude Design, Codex, and autonomous agents.

### Non-objectives

- Do not build the full production app in the first scaffold.
- Do not hard-code model API keys.
- Do not merge all services into one monolith.
- Do not make ComfyUI/Open WebUI/n8n proprietary code dependencies; run them as services.

---

## 4. Target users

| User | Need |
|---|---|
| Sir | One command center for design, prompts, agents, and visual assets |
| Claude Design | Clear scaffold and design brief |
| Codex/Cursor agents | File tree, acceptance criteria, and implementation queue |
| Chromatic Harness agents | Governance, confidence gates, and model routing rules |

---

## 5. Recommended stack

| Layer | Tool | Role |
|---|---|---|
| Frontend scaffold | T3 / Next.js | Main app shell |
| UI system | Tailwind + shadcn/ui | Component and design token base |
| Model gateway | LiteLLM | Route cloud/local models behind one API |
| Local runtime | Ollama | Local LLM serving |
| High-throughput later | vLLM | Optional future inference server |
| Automation | n8n | Webhooks, scheduled jobs, GO-mode workflows |
| AI cockpit | Open WebUI | Adjacent local command center/reference |
| Asset generation | ComfyUI | Visual workflow and asset pipeline |
| Observability later | Langfuse | Prompt/model traces, evals, audit logs |
| Agent orchestration later | LangGraph | Durable agent state machines |

---

## 6. System architecture

```text
User / Sir
  |
  v
Chromatic Design Studios Web App
  |
  +--> LiteLLM Gateway --> OpenAI / Claude / Gemini / OpenRouter / Ollama
  |
  +--> n8n Workflows --> GitHub / Discord / file watchers / webhooks
  |
  +--> ComfyUI Service --> visual assets, cards, backgrounds, motion references
  |
  +--> Open WebUI --> local AI cockpit and experimentation space
  |
  +--> Chromatic Governance Docs --> playbooks, queues, PDRs, repo tree rules
```

---

## 7. Repo tree standard

The repo must use a clear worktree:

```text
chromatic-design-studios/
  apps/
    web/
    api/
    worker/
  packages/
    ui/
    tokens/
    prompts/
    agents/
    workflows/
    schemas/
  services/
    litellm/
    n8n/
    open-webui/
    comfyui/
    ollama/
  docs/
    PDR/
    playbooks/
    taxonomy/
    architecture/
  handoffs/
  prompts/
  scripts/
  manifests/
  validation/
  CHROMATIC_TREES.md
  docker-compose.chromatic.yml
```

---

## 8. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| CDS-001 | Scaffold T3/Next.js app under `apps/web` | Critical |
| CDS-002 | Initialize Tailwind and shadcn/ui component base | Critical |
| CDS-003 | Create packages for UI, tokens, prompts, agents, workflows, and schemas | Critical |
| CDS-004 | Add service folders for LiteLLM, n8n, Open WebUI, ComfyUI, Ollama | Critical |
| CDS-005 | Add `docker-compose.chromatic.yml` service scaffold | High |
| CDS-006 | Add `CHROMATIC_TREES.md` repo governance file | Critical |
| CDS-007 | Add GO-mode and model-routing playbooks | High |
| CDS-008 | Add agent handoff queue with first implementation tasks | High |
| CDS-009 | Add Claude Design and Codex scaffold prompts | High |
| CDS-010 | Add validation checklist and artifact manifest | High |

---

## 9. Design requirements

Chromatic Design Studios should visually feel:

- premium
- cosmic
- glassy/holographic
- disciplined rather than chaotic
- modular
- audit-friendly
- high-signal with minimal clutter

Initial UI surfaces:

1. Dashboard
2. Asset Library
3. Prompt Studio
4. Model Router Matrix
5. Agent Queue
6. Service Health
7. Design Token Lab
8. PDR Browser

---

## 10. Agent operating rules

Agents must:

1. Read `CHROMATIC_TREES.md` before restructuring folders.
2. Read `handoffs/AGENT_HANDOFF_QUEUE.md` before choosing work.
3. Score confidence before mutation.
4. Prefer small reversible changes.
5. Update state after each completed task.
6. Avoid broad repo wandering.
7. Stop if required files are missing or if the task requires secrets.

---

## 11. Confidence gate

| Confidence | Behavior |
|---:|---|
| 90-100 | Execute scoped implementation |
| 75-89 | Execute with normal logging |
| 60-74 | Only reversible low-risk changes |
| 40-59 | Plan only |
| 0-39 | Halt and escalate |

Minimum scaffold implementation confidence target: **80%**.

---

## 12. Acceptance criteria

The scaffold is complete when:

- [ ] Repo root contains required governance files.
- [ ] `apps/web` exists or setup instructions are present.
- [ ] `packages/*` exist for reusable internal modules.
- [ ] `services/*` exist for external local services.
- [ ] `docker-compose.chromatic.yml` exists.
- [ ] Claude/Codex prompts exist.
- [ ] Agent handoff queue has at least 8 tasks.
- [ ] Validation checklist passes.
- [ ] Manifest records the artifact and dependencies.

---

## 13. Risks

| Risk | Severity | Mitigation |
|---|---:|---|
| Overbuilding before scaffold is stable | High | Keep first milestone to repo structure and visual shell |
| License mixing with GPL/fair-code services | Medium | Run external tools as services, avoid embedding code |
| Agent scope creep | High | Use confidence gate and handoff queue |
| Model-routing sprawl | High | Put all routing behind LiteLLM config |
| Asset chaos | Medium | Register generated assets in inventory files |

---

## 14. First sprint

### Sprint name
`CDS-SCAFFOLD-001`

### Goal
Create the initial repo skeleton, governance layer, frontend shell, service folders, and agent-ready handoff queue.

### Definition of done
A new agent can open the repo, read the PDR, execute the first queue item, and know exactly where to place files without asking for context.
