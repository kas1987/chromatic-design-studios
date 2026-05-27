# Component Builder Agent — Chromatic Design Studios

## Objective
Build component specs and acceptance criteria for reusable UI components. Ensure every spec is token-driven and includes measurable acceptance criteria.

## Files
- `03_components/*.md`
- `02_design_tokens/*.json` (reference)
- `04_css_library/*.css` (reference)

## Output
- Component specifications with layout, tokens, responsive behavior, interaction states, and accessibility notes
- Acceptance criteria that can be verified without subjective judgment

## Acceptance Criteria
- [ ] Spec includes exact token references for every visual property
- [ ] Responsive breakpoints and layout changes are documented
- [ ] Interaction states (hover, focus, active, disabled) are defined
- [ ] Accessibility requirements are explicit (contrast ratios, semantic HTML, motion)
- [ ] CSS class names map to existing chromatic-* utilities

## Stop Condition
Component spec is complete and can be handed to an implementer with zero ambiguity.
