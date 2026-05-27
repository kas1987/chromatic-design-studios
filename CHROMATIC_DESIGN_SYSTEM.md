# Chromatic Design System

Source of truth for visual and interaction standards.

## Design Laws

1. **Token-Driven** — Every color, spacing value, font size, motion duration, and glow intensity must reference a token. No hardcoded values in components.
2. **8px Grid** — All spacing is a multiple of 8px (or 4px for tight internals).
3. **Two Fonts** — Inter for headings and UI, IBM Plex Sans for body. IBM Plex Mono for code.
4. **Dark First** — The default theme is dark (Deep Void background). Light mode is a future extension.
5. **Glow, Don't Blur** — Use glow effects for emphasis. Avoid excessive backdrop-filter blur that reduces readability.
6. **Purposeful Motion** — Every animation must serve UX (feedback, orientation, delight). Decorative motion is prohibited.
7. **Holographic, Not Neon** — Gradients and effects should feel like holographic light, not unreadable neon signs.
8. **Agent-Readable** — All specs must be parseable by LLM agents. Use structured markdown, tables, and explicit acceptance criteria.

## Token System

| Domain | File | Status |
|--------|------|--------|
| Color | `02_design_tokens/tokens.colors.json` | ✅ Complete |
| Spacing | `02_design_tokens/tokens.spacing.json` | ✅ Complete |
| Typography | `02_design_tokens/tokens.typography.json` | ✅ Complete |
| Motion | `02_design_tokens/tokens.motion.json` | ✅ Complete |
| Glow | `02_design_tokens/tokens.glow.json` | ✅ Complete |

## CSS Architecture

| Layer | File | Purpose |
|-------|------|---------|
| Base | `chromatic-base.css` | CSS custom properties, reset, base typography |
| Layout | `chromatic-layout.css` | Flex, grid, container primitives |
| Components | `chromatic-components.css` | Button, card, input patterns |
| Effects | `chromatic-effects.css` | Glow, glassmorphism, holographic gradients |

## Governance

- `getdesign.md` — Command center for design requests
- `00_governance/GO_MODE_PLAYBOOK.md` — Autonomous execution rules
- `00_governance/CONFIDENCE_GATE_PLAYBOOK.md` — Confidence scoring and gates
- `00_governance/MODEL_ROUTING_PLAYBOOK.md` — Agent role assignments

## Version
v0.1 — MVP Foundation Complete
