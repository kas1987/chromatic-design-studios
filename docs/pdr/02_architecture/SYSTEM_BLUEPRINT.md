# System Blueprint

## Architecture Layers

```text
Layer 0: Governance
Layer 1: getdesign.md command protocol
Layer 2: Design tokens
Layer 3: CSS and component primitives
Layer 4: Prompt libraries
Layer 5: Asset exports
Layer 6: QA and packaging
```

## Data Flow

```text
getdesign.md
  -> DESIGN_QUEUE.md
  -> agent handoff
  -> prompt/token/component output
  -> QA checklist
  -> DECISION_LOG.md / PROJECT_STATE.md
```

## Source-of-Truth Order

1. `getdesign.md`
2. `CHROMATIC_DESIGN_SYSTEM.md`
3. `DESIGN_QUEUE.md`
4. `02_design_tokens/`
5. `04_css_library/`
6. `05_prompts/`
7. `06_agents/`

## Folder Contract

- Governance files explain how work is allowed to proceed.
- Tokens define design primitives.
- CSS files consume tokens.
- Components consume CSS and tokens.
- Prompts consume visual language and asset rules.
- Exports contain generated outputs only.
