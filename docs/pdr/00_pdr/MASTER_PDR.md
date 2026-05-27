# Product Design Record: Chromatic Design Studios

## 1. Product Name

Chromatic Design Studios

## 2. Problem Statement

Claude Design-style workflows are useful for fast UI generation, but they often lack durable repo structure, reusable design tokens, asset governance, cost/tool discipline, and reliable execution controls. Chromatic Design Studios solves this by creating a governed design studio scaffold that can route design work through `getdesign.md`, reusable prompts, design tokens, CSS libraries, and agent handoffs.

## 3. Product Vision

Chromatic Design Studios becomes the design operations layer for the Chromatic Harness ecosystem: a repeatable system for generating beautiful, coherent, testable design assets and implementation prompts from minimal user input.

## 4. Users

| User | Need |
|---|---|
| Human creative director | Minimal prompting, maximum design leverage |
| Claude Design | Clear implementation prompt and structured design specs |
| Cursor/Codex builder | File-level work packets and acceptance criteria |
| Visual agent | Stable visual north star and prompt library |
| QA/auditor agent | Objective criteria for design consistency |

## 5. Core Workflow

```text
User intent -> getdesign.md -> confidence gate -> route agent -> generate artifact -> QA review -> package output -> update state
```

## 6. MVP Scope

### In Scope

- `getdesign.md` command protocol
- design token scaffold
- global CSS library scaffold
- reusable component folders
- OpenArt and Claude Design prompt libraries
- agent handoff templates
- QA checklist
- implementation queue
- risk register
- packaging checklist

### Out of Scope for MVP

- Fully finished React application
- Paid asset marketplace integration
- Automated deployment
- Live Figma sync
- Production CI/CD
- Full visual regression testing

## 7. Functional Requirements

| ID | Requirement | Priority |
|---|---|---:|
| FR-001 | System must use `getdesign.md` as the design command center | P0 |
| FR-002 | System must maintain design tokens for color, spacing, typography, motion, and glow | P0 |
| FR-003 | System must provide agent handoffs with objective, files, output, acceptance criteria, and stop condition | P0 |
| FR-004 | System must include Claude Design implementation prompts | P1 |
| FR-005 | System must include OpenArt image/video prompt templates | P1 |
| FR-006 | System must include a reusable global CSS structure | P1 |
| FR-007 | System must include QA criteria before marking outputs complete | P1 |
| FR-008 | System must support GO-mode task selection from a queue | P1 |

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 | Outputs must be modular and reusable |
| NFR-002 | Agents must avoid broad, unbounded repo exploration |
| NFR-003 | Visual decisions must be token-driven where possible |
| NFR-004 | File naming must remain predictable and repo-safe |
| NFR-005 | All generated outputs must include acceptance criteria |
| NFR-006 | Risky or destructive changes require human approval |

## 9. Visual Direction

Chromatic Design Studios should feel cosmic, holographic, luminous, premium, modular, and operationally clean. It should avoid unreadable neon clutter, random glassmorphism, inconsistent spacing, and one-off CSS.

## 10. System Components

| Component | Purpose |
|---|---|
| `getdesign.md` | Primary command file |
| `CHROMATIC_DESIGN_SYSTEM.md` | Design laws and reusable standards |
| `DESIGN_QUEUE.md` | Execution queue |
| `02_design_tokens/` | Machine-readable style primitives |
| `04_css_library/` | Reusable CSS bundles |
| `05_prompts/` | Prompt libraries for asset generation |
| `06_agents/` | Agent role specs |
| `08_examples/` | Demo outputs |

## 11. Success Metrics

| Metric | Target |
|---|---:|
| Design request can be routed from `getdesign.md` | 100% |
| MVP task queue has acceptance criteria | 100% |
| Token files exist for color, spacing, typography, motion, glow | 100% |
| Agent handoffs include stop conditions | 100% |
| Generated design artifacts pass QA checklist | 90%+ |

## 12. Primary Risks

| Risk | Mitigation |
|---|---|
| Agents overuse tools or wander | Confidence gate and GO-mode playbook |
| Visual drift | Token system and design QA checklist |
| Prompt sprawl | Prompt library playbook and naming standards |
| CSS duplication | Global CSS architecture and component contracts |
| Weak implementation handoff | Claude Design bridge and agent packets |

## 13. MVP Acceptance

The MVP is accepted when the package contains enough governance, queue structure, prompts, tokens, and handoff material for another LLM or agent to start implementation without needing hidden chat context.
