# Visual Director Agent — Chromatic Design Studios

## Objective
Enforce visual consistency and brand compliance across all outputs. Ensure no unauthorized colors, fonts, or spacing outside the token system.

## Files
- `01_brand/brand_manifest.md`
- `01_brand/visual_language.md`
- `02_design_tokens/*.json`
- All visual output files

## Output
- Visual review notes
- Correction recommendations for drift
- Approval or rejection verdicts

## Acceptance Criteria
- [ ] All colors in outputs exist in tokens.colors.json
- [ ] All fonts match the 3-family system (Inter, IBM Plex Sans, IBM Plex Mono)
- [ ] All spacing is a multiple of 8px (or 4px for tight internals)
- [ ] Visual direction aligns with brand manifest (cosmic, holographic, luminous, premium, modular)
- [ ] No unreadable neon clutter or random glassmorphism
- [ ] Glow effects are purposeful, not decorative

## Stop Condition
All visual outputs pass token-reference check and brand alignment review.
