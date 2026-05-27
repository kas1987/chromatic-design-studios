# Design QA Checklist — Chromatic Design Studios

## Objective
Objective pass/fail checks for every design output before marking complete.

---

## Check 1: Token Coverage

| # | Check | Pass Criteria | Tool |
|---|-------|---------------|------|
| 1.1 | All colors are token-defined | Every hex/rgb/hsl in output exists in `tokens.colors.json` | Manual grep + token file comparison |
| 1.2 | All fonts are token-defined | Only Inter, IBM Plex Sans, IBM Plex Mono are used | `grep -i "font-family" *.css` |
| 1.3 | All spacing is token-scaled | Every px/rem value is a multiple of 4px (8px grid) | `grep -oP '\d+px' *.css \| sort -u` |
| 1.4 | Motion durations are token-defined | Only 150ms, 300ms, 500ms used | `grep -oP '\d+ms' *.css \| sort -u` |

**Verdict:** PASS if all 4 sub-checks pass. FAIL if any hardcoded value is found outside tokens.

---

## Check 2: CSS Custom Property Mapping

| # | Check | Pass Criteria |
|---|-------|---------------|
| 2.1 | Base tokens mapped | `chromatic-base.css` contains `--color-*`, `--space-*`, `--font-*` |
| 2.2 | No hardcoded values in components | `chromatic-components.css` uses only `var(--*)` for colors/spacing |
| 2.3 | Effects reference tokens | `chromatic-effects.css` glow values match `tokens.glow.json` |
| 2.4 | Layout uses tokens | `chromatic-layout.css` breakpoints match responsive spec |

**Verdict:** PASS if all 4 sub-checks pass. FAIL if any component hardcodes a value.

---

## Check 3: Visual Consistency

| # | Check | Pass Criteria |
|---|-------|---------------|
| 3.1 | Dark mode default | Background is `#0a0a0f` or `var(--color-background)` |
| 3.2 | No neon clutter | No colors with saturation > 80% outside primary/accent families |
| 3.3 | Purposeful glow | Every `box-shadow` glow has a semantic reason (hover, focus, emphasis) |
| 3.4 | Readable contrast | All text on backgrounds meets WCAG AA (4.5:1 for normal, 3:1 for large) |
| 3.5 | Two-font discipline | No more than 3 font families appear in any CSS file |

**Verdict:** PASS if all 5 sub-checks pass. WARN if 4/5 pass (address before shipping).

---

## Check 4: File Structure Compliance

| # | Check | Pass Criteria |
|---|-------|---------------|
| 4.1 | Folder structure matches CHROMATIC_TREES.md | `find . -type f \| sort` aligns with documented tree |
| 4.2 | Naming conventions followed | All files use kebab-case; folders use `NN_category` format |
| 4.3 | No orphaned files | Every file has a documented purpose in CHROMATIC_TREES.md |
| 4.4 | README exists at root | `README.md` is present and non-empty |

**Verdict:** PASS if all 4 sub-checks pass.

---

## Check 5: Accessibility

| # | Check | Pass Criteria |
|---|-------|---------------|
| 5.1 | Focus visible | All interactive elements have `:focus-visible` styles |
| 5.2 | Reduced motion | `@media (prefers-reduced-motion: reduce)` disables animations |
| 5.3 | Semantic HTML | Headings are hierarchical (`h1` > `h2` > `h3`)
| 5.4 | Color not sole indicator | Status (success/warning/error) uses shape + color, not color alone |

**Verdict:** PASS if all 4 sub-checks pass.

---

## Check 6: Prompt Quality (if prompts modified)

| # | Check | Pass Criteria |
|---|-------|---------------|
| 6.1 | 5-layer structure | Every OpenArt prompt has Background, Subject, Lighting, Effects, Quality |
| 6.2 | Token-aligned colors | All colors in prompts match token hex values |
| 6.3 | Negative prompts included | Every positive prompt has a negative prompt block |
| 6.4 | Bridge prompt complete | Claude Design prompt includes context, tokens, constraints, QA rules |

**Verdict:** PASS if all 4 sub-checks pass.

---

## Final Verdict

| Overall | Condition |
|---------|-----------|
| ✅ PASS | All applicable checks PASS |
| ⚠️ WARN | One or more checks WARN, zero FAIL |
| ❌ FAIL | Any check FAILs |

**No output may be marked complete without a PASS or WARN verdict.**
**FAIL verdicts MUST be resolved before shipping.**
