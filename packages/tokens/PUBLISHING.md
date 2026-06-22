# Publishing @chromatic/tokens to npm

Status: **publish-ready** (verified 2026-06-21 via `npm publish --dry-run`).

## What's in the package

- `dist/` — built ESM + CJS + `.d.ts` for colors, spacing, typography, motion, effects
- `css/tokens.css` — drop-in CSS layer
- `tailwind/preset.cjs` — `tailwind.config.cjs` preset
- `figma/tokens.json` — Figma Tokens import
- `styledictionary/tokens.json` — Style Dictionary source
- `README.md`, `LICENSE` (MIT)

Tarball: 9.8 kB · 25 files · shasum 1d6ae3e3a8c29f41c0dc2217cea1ece36b4d1b43.

## Pre-publish checklist

1. `npm test` — 44/44 vitest cases pass
2. `npm run build` — emits `dist/`, `css/`, `tailwind/`, `figma/`, `styledictionary/`
3. `npm run dry-run` — full pack preview, no warnings

`prepublishOnly` runs `npm test && npm run build` automatically.

## Publish command

```bash
cd packages/tokens
npm login                        # one-time, or use NPM_TOKEN env var
npm run dry-run                  # verify tarball contents
npm publish --access public      # publishes with tag=latest
```

## Versioning

- 0.5.x → minor for new token categories, patch for additions within a category
- Breaking JSON shape changes → 1.0.0 (currently 0.5.0)
- Tag with `next` for pre-release: `npm publish --tag next`

## Scope name

The npm scope is `@chromatic/tokens`. To claim it, the publishing user must
own or be a maintainer of the `chromatic` org. The user `kas1987` is
configured for this in `~/.npmrc` (not committed).

## Provenance

- Repository: git+https://github.com/kas1987/chromatic-design-studios.git
- Directory: `packages/tokens`
- Author: Chromatic Harness (kas1987)
- License: MIT
