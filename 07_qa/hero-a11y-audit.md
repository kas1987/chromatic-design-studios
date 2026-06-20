# Hero — Accessibility & Acceptance Audit

Audit of the shipped `packages/ui` `Hero` (consumed on `/`) against the acceptance
criteria in `03_components/hero-component.md`. Date: 2026-06-05. Tracker: `cds-mzn.5`.

## WCAG contrast (computed from `02_design_tokens/tokens.colors.json`)

| Pair | Ratio | AA (≥4.5) |
|------|-------|-----------|
| `text.primary` #f8fafc on `background.default` #0a0a0f (headline) | **18.88:1** | ✅ |
| `text.secondary` #94a3b8 on `background.default` (subheadline) | **7.70:1** | ✅ |
| `text.primary` on `primary.600` #7c3aed (primary CTA label) | **5.45:1** | ✅ |
| `text.secondary` on `surface.default` #12121a (ghost CTA hover) | **7.27:1** | ✅ |

All foreground/background pairs clear AA for normal text; headline/subhead clear AAA.

## Acceptance criteria

| Criterion | Status | Notes |
|-----------|--------|-------|
| Background renders without banding | ⚠️ visual | Token gradient `gradient.hero`; verify in-browser across engines |
| Headline uses exact token values | ✅ | `font-heading` (Inter), `text-4xl` (48px), `font-bold` (700), `text-text-primary` |
| Spacing matches token scale | ✅ | section `py-9` (96px), content gap `gap-5` (24px), CTA gap `gap-4` (16px) |
| Responsive at 320 / 768 / 1280 | ✅ (fixed) | Headline now `text-2xl sm:text-3xl md:text-4xl` per spec; container `max-w-5xl`, CTAs wrap |
| CTA hover uses tokens + 150ms | ✅ | `Button` uses `duration-fast` (150ms), `hover:shadow-glow-hover`, `hover:bg-primary-500` |
| No hardcoded colors | ✅ | All values resolve to token CSS vars / Tailwind token classes |
| Lighthouse a11y ≥ 95 | ⏳ pending | Requires a browser run — not executed in this environment (see below) |
| CSS + HTML < 20KB | ✅ | `/` route 122 B + shared chunks; Hero markup is minimal |

## Reduced motion
The aurora overlay carries `motion-reduce:hidden`; the only animation is the CTA
translate/glow on hover (no autoplay, no parallax). Honors `prefers-reduced-motion`.

## Semantics
Headline is `<h1>`, subheadline `<p>`, CTAs are real `<button>`/`<a>` with
`focus-visible:shadow-glow-focus`. Badge is decorative text, not a control.

## Outstanding (for a follow-up with a browser)
Run Lighthouse against the dev server to confirm the ≥95 score and the no-banding
visual check:
```
npm run dev:web    # then, in another shell:
npx lighthouse http://localhost:3000 --only-categories=accessibility --view
```
Static criteria above all pass; only the scored browser run remains.
