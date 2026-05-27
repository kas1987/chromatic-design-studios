# Agent Handoff Queue

## Active sprint
`CDS-SCAFFOLD-001`

## Queue rules
- Work top-down unless blocked.
- Each task must update this queue when complete.
- Do not start a lower-priority task if a critical task is unblocked.

---

## CDS-001: Scaffold web app

| Field | Value |
|---|---|
| Agent | Builder |
| Model | Code/frontend model |
| Priority | Critical |
| Risk | Medium |
| Confidence target | 85 |
| Allowed files | `apps/web/**`, package config files |
| Definition of Done | T3/Next.js app scaffold exists and runs locally |

---

## CDS-002: Initialize shadcn/ui and base components

| Field | Value |
|---|---|
| Agent | UI Builder |
| Priority | Critical |
| Allowed files | `apps/web/**`, `packages/ui/**`, `packages/tokens/**` |
| Definition of Done | Button, card, dialog, tabs, input, sidebar installed or scaffolded |

---

## CDS-003: Create Chromatic design tokens

| Field | Value |
|---|---|
| Agent | Design Systems Agent |
| Priority | High |
| Allowed files | `packages/tokens/**`, `docs/architecture/**` |
| Definition of Done | CSS variables for colors, spacing, radius, shadow, motion, glow |

---

## CDS-004: Add dashboard shell

| Field | Value |
|---|---|
| Agent | Frontend Builder |
| Priority | High |
| Allowed files | `apps/web/**`, `packages/ui/**` |
| Definition of Done | Dashboard page with navigation cards for Asset Library, Prompt Studio, Model Router, Agent Queue, Service Health |

---

## CDS-005: Add service placeholders

| Field | Value |
|---|---|
| Agent | Operator |
| Priority | High |
| Allowed files | `services/**`, `docker-compose.chromatic.yml` |
| Definition of Done | LiteLLM, n8n, Open WebUI, ComfyUI, Ollama service folders documented |

---

## CDS-006: Add LiteLLM config example

| Field | Value |
|---|---|
| Agent | Model Router Agent |
| Priority | High |
| Allowed files | `services/litellm/**`, `.env.example` |
| Definition of Done | Example config maps local Ollama and external OpenAI-compatible providers |

---

## CDS-007: Create asset registry

| Field | Value |
|---|---|
| Agent | Asset Archivist |
| Priority | Medium |
| Allowed files | `services/comfyui/**`, `docs/taxonomy/**` |
| Definition of Done | Registry template for backgrounds, cards, particles, overlays, UI assets |

---

## CDS-008: Add validation script/checklist

| Field | Value |
|---|---|
| Agent | Auditor |
| Priority | Medium |
| Allowed files | `validation/**`, `scripts/**` |
| Definition of Done | Checklist and optional script verify required folders/files exist |
