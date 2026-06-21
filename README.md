# Chromatic Design Studios

> **A front-end resource platform — token-driven, agent-readable, locally runnable.**

Chromatic Design Studios is the design operations layer of the Chromatic Harness ecosystem. It ships a single source of truth for visual primitives (JSON tokens) that compiles to CSS variables and a Tailwind theme, a library of token-driven React components, an interactive playground for live token tuning, and a confidence-gated agent render path that turns markdown specs into TSX.

## Quick start

```bash
npm install
npm run tokens        # compile 02_design_tokens/*.json → CSS vars + Tailwind theme
npm run build:web     # build the apps/web front end
npm run dev:web       # http://localhost:3000
```

## Surfaces

| Route | What it is |
|-------|-----------|
| [`/`](apps/web/src/app/page.tsx) | Landing page — surface grid, differentiators, CTA pair |
| [`/components`](apps/web/src/app/components/page.tsx) | Component index — 21 primitives grouped by Form / Layout / Display / Feedback / Navigation |
| [`/tokens`](apps/web/src/app/tokens/page.tsx) | Token explorer — color ramps, spacing, typography, motion, glow |
| [`/examples`](apps/web/src/app/examples/page.tsx) | Examples gallery — 10 production page patterns |
| [`/playground`](apps/web/src/app/playground/page.tsx) | Live token-tuning playground |
| [`/studio`](apps/web/src/app/studio/page.tsx) | Existing primitive gallery (button / card / badge / input / hero) |

## Why a "front-end resource platform"

Most design systems stop at components. CDS goes further:

1. **Token-driven from the file up.** Every visual value references a token defined in `02_design_tokens/*.json`. The JSON compiles to CSS variables and a Tailwind theme — components never see raw values.
2. **Spec-as-source-of-truth.** Each component ships as a structured markdown spec (token mapping, layout diagram, interaction states, acceptance criteria). The spec is the prompt.
3. **Agent-renderable.** A confidence-gated CLI (`chromatic-agent render <spec.md>`) turns component specs into TSX. See [`docs/research/chromatic-design-studios-swot-2026-06-21.md`](docs/research/chromatic-design-studios-swot-2026-06-21.md) for the 90-day plan.
4. **Local-first.** The full platform runs offline: LiteLLM, n8n, Open WebUI, ComfyUI, and Ollama ship via `docker-compose.chromatic.yml`.
5. **Confidence-gated.** A 1-5 scoring system (`00_governance/CONFIDENCE_GATE_PLAYBOOK.md`) decides what ships automatically and what pauses for review.

## Design laws

The eight laws in [`CHROMATIC_DESIGN_SYSTEM.md`](CHROMATIC_DESIGN_SYSTEM.md) are the source of truth. Highlights:

1. **Token-driven** — no hardcoded values in components.
2. **8px grid** — all spacing is a multiple of 8 (4 for tight internals).
3. **Two fonts** — Inter (heading/UI), IBM Plex Sans (body), IBM Plex Mono (code).
4. **Dark first** — Deep Void background is the default; light is opt-in.
5. **Glow, don't blur** — emphasis through glow, not excessive backdrop-filter blur.
6. **Purposeful motion** — animations serve UX, never decoration.
7. **Holographic, not neon** — premium light effects, not clutter.
8. **Agent-readable** — specs parse cleanly by LLM agents.

## Project layout

```
chromatic-design-studios/
├── 00_governance/        # GO mode, confidence gate, model routing playbooks
├── 01_brand/             # Brand manifest, visual language
├── 02_design_tokens/     # JSON source of truth for every visual primitive
├── 03_components/        # Component specs (markdown → prompts)
├── 04_css_library/       # CSS layers (base, layout, components, effects)
├── 05_prompts/           # Claude Design bridge + OpenArt layered prompts
├── 06_agents/            # Agent role definitions
├── 07_qa/                # Design QA checklist
├── 08_examples/          # Demo pages
├── 09_packaging/         # Release checklist
├── 10_appendices/        # File tree
├── apps/
│   ├── web/              # Next.js front end (the platform surface)
│   ├── api/              # Backend adapter (placeholder)
│   └── worker/           # Agent job runner (placeholder)
├── packages/
│   ├── tokens/           # Compiled token package
│   ├── ui/               # Token-driven React component library
│   ├── prompts/          # Prompt templates
│   ├── agents/           # Agent definitions
│   ├── workflows/        # Workflow specs
│   └── schemas/          # Shared Zod/type schemas
├── services/             # LiteLLM, n8n, Open WebUI, ComfyUI, Ollama
├── docs/                 # PDR, playbooks, architecture, research, CHANGELOG
├── handoffs/             # Agent handoff queue
├── manifests/            # Generated artifact registry
└── validation/           # Acceptance criteria
```

## Issue tracking

Beads (`bd`) is local to this repo. Run from the repo root. The wave-level roadmap lives in `docs/research/chromatic-design-studios-swot-2026-06-21.md` and is the primary planning surface; beads holds granular issues.

## Version

v0.4.0 — Platform Surface. See [`docs/CHANGELOG.md`](docs/CHANGELOG.md) for the full history and the planned v1.0.0 trajectory.
