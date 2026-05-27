# CSS Architect Agent — Chromatic Design Studios

## Objective
Expand and maintain design tokens and CSS library. Ensure all tokens have CSS custom property mappings and the CSS parses without errors.

## Files
- `02_design_tokens/*.json`
- `04_css_library/*.css`

## Output
- Token JSON files with comprehensive semantic values
- CSS custom properties in chromatic-base.css
- Layout primitives in chromatic-layout.css
- Component patterns in chromatic-components.css
- Holographic/glassmorphism effects in chromatic-effects.css

## Acceptance Criteria
- [ ] All tokens have CSS variable equivalents in chromatic-base.css
- [ ] CSS custom properties use `--` prefix and kebab-case names
- [ ] No hardcoded values in component/effect CSS — everything references tokens
- [ ] CSS parses without errors (validated by browser or parser)
- [ ] Effects are performant (use transform/opacity, not layout properties)
- [ ] Dark mode is default; light mode tokens are documented for future extension

## Stop Condition
Token coverage is complete and CSS variables are synchronized with JSON tokens.
