# Chromatic Design Studios

A governed, repo-ready design system for the Chromatic Harness ecosystem. Transforms minimal user intent into structured UI/design outputs with confidence gates, agent routing, reusable prompts, design tokens, and acceptance checks.

## Quick Start

1. Open `getdesign.md` to see the command protocol
2. Review `CHROMATIC_DESIGN_SYSTEM.md` for design laws
3. Browse `02_design_tokens/` for the token system
4. Check `04_css_library/` for CSS custom properties and components
5. See `08_examples/hero-page/example.md` for a live demo

## Structure

| Folder | Purpose |
|--------|---------|
| `00_governance/` | Execution rules, confidence gates, model routing |
| `01_brand/` | Brand manifest and visual language |
| `02_design_tokens/` | Color, spacing, typography, motion, glow tokens |
| `03_components/` | Component specs with acceptance criteria |
| `04_css_library/` | CSS custom properties, layout, components, effects |
| `05_prompts/` | Claude Design bridge + OpenArt layered prompts |
| `06_agents/` | Agent handoff templates |
| `07_qa/` | Design QA checklist |
| `08_examples/` | Demo outputs |
| `09_packaging/` | Release checklist |
| `10_appendices/` | File tree, reference docs |

## Design Principles

1. **Token-Driven** — Every visual value references a token
2. **8px Grid** — All spacing is a multiple of 8px
3. **Two Fonts** — Inter + IBM Plex Sans (Mono for code)
4. **Dark First** — Default theme is Deep Void
5. **Glow, Don't Blur** — Emphasis through glow, not excessive blur
6. **Purposeful Motion** — Animations serve UX, never decoration
7. **Holographic, Not Neon** — Premium light effects, not clutter
8. **Agent-Readable** — All specs use structured markdown

## Version
v0.1.0 — MVP
