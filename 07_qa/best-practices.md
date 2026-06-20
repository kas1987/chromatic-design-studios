# Web best-practices pass — Accessibility / SEO / Best-Practices / tooling

Date: 2026-06-05. Tracker: `cds-mzn.5` (Hero a11y) + general hardening.
Covers everything statically verifiable that moves the Lighthouse Accessibility,
Best-Practices, and SEO categories. Only the *scored browser run* itself remains.

## Accessibility
| Improvement | Where |
|-------------|-------|
| Skip-to-content link (visible on focus) → `#main` | `layout.tsx` body + `.skip-link` in `globals.css` |
| `<main id="main">` landmark on every route | `app/page.tsx`, `app/studio/page.tsx` |
| `<nav aria-label="Primary">` (distinguishes landmarks) | `app/page.tsx` |
| Icon-only theme toggle has `aria-label` + `aria-pressed` | `components/ThemeToggle.tsx` |
| Global `prefers-reduced-motion` guard (caps all transitions/animation) | `globals.css` |
| `<html lang="en">`, focus-visible glow rings, semantic headings | layout + components |
| Color contrast — all text pairs AA+ in both themes | `07_qa/hero-a11y-audit.md`, `07_qa/light-mode.md` |

## SEO
| Improvement | Where |
|-------------|-------|
| `metadataBase` (resolves OG/relative URLs; silences build warning) | `layout.tsx` |
| Title template `%s · Chromatic Design Studios` | `layout.tsx` |
| `robots: { index, follow }`, keywords, authors, applicationName | `layout.tsx` |
| Open Graph + Twitter card metadata | `layout.tsx` |
| Descriptive internal links via `next/link` (no raw `<a>` to routes) | home + studio |

## Best Practices
| Improvement | Where |
|-------------|-------|
| Favicon — token-gradient SVG prism | `public/icon.svg` + `metadata.icons` |
| Web App Manifest (`/manifest.webmanifest`, standalone, dark theme) | `app/manifest.ts` |
| `viewport` export — `width=device-width`, `colorScheme: dark light`, per-scheme `themeColor` | `layout.tsx` |
| No-flash theme init script (avoids FOUC on light/dark) | `layout.tsx` |
| `next/link` client navigation (prefetch, no full reload) | home + studio |

## Tooling / CI hygiene
- Added ESLint (`eslint` + `eslint-config-next`, `next/core-web-vitals`) → **0 warnings/errors**.
- Added `typecheck` script (`tsc --noEmit`) → **clean**.
- Fixed 2 lint errors (`no-html-link-for-pages`) surfaced by the new config.

## Verified
- `npm run typecheck --workspace apps/web` → clean.
- `next lint` → ✔ No ESLint warnings or errors.
- `npm run build --workspace apps/web` → green; routes `/`, `/studio`,
  `/manifest.webmanifest`, `/_not-found` all static.

## Outstanding (needs a browser — the only thing left)
```
npm run dev:web
npx lighthouse http://localhost:3000 --only-categories=accessibility,best-practices,seo --view
```
All static contributors to these categories are now in place.
