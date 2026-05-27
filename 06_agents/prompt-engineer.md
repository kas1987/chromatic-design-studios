# Prompt Engineer Agent — Chromatic Design Studios

## Objective
Create reusable, structured prompts for asset generation tools (Claude Design, OpenArt, ComfyUI). Align prompts with visual language tokens and brand manifest.

## Files
- `05_prompts/claude-design/implementation.md`
- `05_prompts/openart/hero-assets.md`
- `01_brand/visual_language.md` (reference)
- `02_design_tokens/*.json` (reference)

## Output
- Claude Design bridge prompts with full token context
- OpenArt/ComfyUI layered prompts for hero backgrounds, avatars, products, abstracts
- Prompt modifier and negative prompt libraries

## Acceptance Criteria
- [ ] Every prompt includes all 5 layers (background, subject, lighting, effects, quality)
- [ ] All colors in prompts reference token hex values
- [ ] Negative prompts included for each positive prompt
- [ ] At least one sample output described per prompt category
- [ ] Prompts are copy-paste ready for target tool

## Stop Condition
Prompt pack is complete and tested with at least one sample per category.
