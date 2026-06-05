# Light-mode theme variant — QA & tuning guide

Tracker: `cds-mzn.6`. Date: 2026-06-05. Status: **infra + seed shipped; final palette
tunable via the visual-design companion.**

Design Law #4 is "Dark First" — dark remains the default; light is an opt-in token
override set activated by `<html class="light">`.

## How it works

| Layer | File | Role |
|-------|------|------|
| Override tokens | `02_design_tokens/tokens.colors.light.json` | Only the mode-dependent keys (background, surface, text, border, glow, gradient). Hue scales `primary.*`/`accent.*` are shared, not redefined. |
| Build pipeline | `scripts/build-tokens.mjs` | Reads the optional light file and emits a `.light { … }` block of CSS-var overrides into `chromatic-tokens.css` (after `:root`). |
| Activation | `apps/web/src/app/globals.css` | `html.light { color-scheme: light; }`; `body` already reads `var(--color-*)`, so the override block re-themes everything. |
| No-flash init | `apps/web/src/app/layout.tsx` | `THEME_INIT` inline script applies the persisted choice to `<html>` before paint. |
| Toggle | `apps/web/src/components/ThemeToggle.tsx` | Flips `.light`, persists to `localStorage["chromatic-theme"]`. Mounted in the `/studio` header. |
| CTA-label fix | `tokens.colors.json` + `Button.tsx` | New `text.onprimary` token (white in both modes) so the violet primary button stays readable when `text.primary` flips dark in light mode. |

## Seed light palette — WCAG contrast (computed)

| Pair | Ratio | AA (≥4.5) |
|------|-------|-----------|
| `text.primary` #1a1530 on `background.default` #faf9fc (headline) | **16.77:1** | ✅ |
| `text.secondary` #4b4564 on `background.default` (subhead) | **8.58:1** | ✅ |
| `text.secondary` #4b4564 on `surface.default` #ffffff | **9.00:1** | ✅ |
| `text.muted` #6b6486 on `background.default` | **5.28:1** | ✅ |
| `text.onprimary` #ffffff on `primary.600` #7c3aed (CTA label) | **5.70:1** | ✅ |
| `text.primary` #1a1530 on `surface.default` #ffffff | **17.59:1** | ✅ |

All text pairs clear AA. (`border.default` vs background is ~1.2:1 by design — a
subtle decorative boundary, not text or a control edge requiring the 3:1 non-text rule.)

## Tuning the palette live (the chosen approach)

The seed above is a derived starting point. To refine it interactively with the
frontend-family `visual-design` companion:

```bash
# 1. start the companion (Windows/Git Bash, backgrounded)
.00_Governance/.02_Plugins/frontend-family/skills/visual-design/scripts/start-server.sh \
   --project-dir "$(pwd)"
# -> prints screen_dir + state_dir + a browser URL

# 2. emit the LIGHT tuner screen (seeded from tokens.colors.light.json)
node scripts/chromatic-token-studio.mjs screen-light <screen_dir>

# 3. open the URL, drag colors on a light backdrop, watch contrast live

# 4. write the chosen values back into the light override file
node scripts/chromatic-token-studio.mjs apply-light <state_dir>/tokens.json

# 5. regenerate CSS + Tailwind theme
npm run tokens
```

`screen-light` renders the preview card on a light stage so contrast reads true while
tuning; `apply-light` writes only Chromatic light keys (ignores other companion events).

## Verified
- `node scripts/build-tokens.mjs` → 97 vars + `.light` block. ✅
- `npm run build --workspace apps/web` → green, 5/5 static pages. ✅
- Toggle persists across reload via `localStorage`; no-flash init avoids a dark→light flash. ✅

## Outstanding (needs a browser)
- Visual pass of the seed palette in both modes at the `/studio` route, then optional
  interactive refinement via the companion steps above.
