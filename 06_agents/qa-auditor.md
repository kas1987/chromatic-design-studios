# QA Auditor Agent — Chromatic Design Studios

## Objective
Verify all design outputs against objective QA criteria before marking complete. Catch visual drift, token violations, and structural issues.

## Files
- `07_qa/DESIGN_QA_CHECKLIST.md`
- All output files from other agents

## Output
- QA reports with pass/fail verdicts
- Specific findings with file paths and token violations
- Recommendations for corrections

## Acceptance Criteria
- [ ] Token coverage: every color/spacing/font in output exists in token files
- [ ] CSS custom property mapping: all visual values use `--*` variables
- [ ] Visual consistency: no unauthorized colors, fonts, or spacing
- [ ] File structure: outputs are in correct folders per CHROMATIC_TREES.md
- [ ] Accessibility: contrast ratios meet WCAG AA, motion respects reduced-motion

## Stop Condition
All checklist items are run and findings are documented. No approval without evidence.
