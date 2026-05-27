# Release Checklist — Chromatic Design Studios

## Pre-Release Verification

Run these checks before tagging any release.

### Structure

- [ ] `CHROMATIC_TREES.md` matches actual repo tree
- [ ] All 10 folders exist (`00_governance` through `10_appendices`)
- [ ] No empty placeholder files (every `.md` has substantive content)
- [ ] No orphaned files without documented purpose

### Tokens

- [ ] All 5 token files exist: colors, spacing, typography, motion, glow
- [ ] `tokens.colors.json` contains semantic palette + primary/accent scales
- [ ] `tokens.spacing.json` contains base + scale + semantic tokens
- [ ] `tokens.typography.json` contains family, scale, weight, line-height, letter-spacing, roles
- [ ] `tokens.motion.json` contains duration, easing, property, rules
- [ ] `tokens.glow.json` contains intensity, color, preset
- [ ] All token files are valid JSON (`python -m json.tool` passes)

### CSS

- [ ] 4 CSS files exist: base, layout, components, effects
- [ ] `chromatic-base.css` maps all tokens to CSS custom properties
- [ ] No hardcoded values in components/effects (only `var(--*)`)
- [ ] CSS parses without syntax errors
- [ ] `prefers-reduced-motion` respected
- [ ] Focus-visible styles present on all interactive elements

### Prompts

- [ ] Claude Design bridge prompt is copy-paste ready
- [ ] OpenArt prompts follow 5-layer structure
- [ ] Negative prompts included
- [ ] All prompt colors match token hex values

### Governance

- [ ] GO_MODE_PLAYBOOK contains confidence scoring and stop conditions
- [ ] CONFIDENCE_GATE_PLAYBOOK contains green/yellow/red thresholds
- [ ] MODEL_ROUTING_PLAYBOOK contains 6 agent roles with clear responsibilities

### Agents

- [ ] 6 agent handoff files exist with objective, files, output, acceptance, stop condition
- [ ] Every agent spec references correct files and output formats

### Component + Demo

- [ ] Hero component spec exists with token mapping table
- [ ] Demo hero page HTML/CSS demonstrates end-to-end usage
- [ ] Demo passes responsive check at 320px, 768px, 1280px

### QA

- [ ] `DESIGN_QA_CHECKLIST.md` exists with 6 checks and pass/fail criteria
- [ ] All checklist items are objective (no subjective judgment required)

### Docs

- [ ] `README.md` explains the project purpose
- [ ] `CHROMATIC_DESIGN_SYSTEM.md` contains design laws and token system overview
- [ ] `PROJECT_STATE.md` reflects current release status
- [ ] `DESIGN_QUEUE.md` is accurate
- [ ] `getdesign.md` command protocol is complete

## Release Command

```bash
# Tag the release
git tag -a v0.1.0 -m "Chromatic Design Studios MVP"

# Push
git push origin v0.1.0
```

## Post-Release

- [ ] Update `PROJECT_STATE.md` with release version
- [ ] Archive any pre-release notes
- [ ] Open follow-up issues for deferred work (light mode, CI/CD, Figma sync)
