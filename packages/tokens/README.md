# @chromatic/tokens

> Design tokens — the single source of truth for color, spacing, typography, motion, and glow. Token-driven, framework-agnostic.

The npm package form of the Chromatic token system. Ships with:

- **JavaScript exports** (ESM + CJS) with full TypeScript types.
- **CSS** custom-properties layer (`@chromatic/tokens/css`).
- **Tailwind preset** (`@chromatic/tokens/tailwind`).
- **Figma Tokens** plugin JSON (`@chromatic/tokens/figma`).
- **Style Dictionary** v4-compatible JSON (`@chromatic/tokens/styledictionary`).

## Install

```bash
npm install @chromatic/tokens
```

## Usage

### JavaScript / TypeScript

```ts
import { colors, spacing, typography } from '@chromatic/tokens'

// colors.background.default === '#0a0a0f'
// colors.primary[600] === '#7c3aed'
// spacing[5] === '1.5rem'
```

### CSS

```css
@import '@chromatic/tokens/css';
```

### Tailwind preset

```ts
// tailwind.config.ts
import chromaticPreset from '@chromatic/tokens/tailwind'

export default {
  presets: [chromaticPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

### Figma Tokens plugin

Import `@chromatic/tokens/figma` in the Figma Tokens plugin. The token tree mirrors the JSON structure exactly.

### Style Dictionary

Point Style Dictionary at `@chromatic/tokens/styledictionary/tokens.json` (or build with the platform source via `02_design_tokens/*.json`).

## Build

```bash
node packages/tokens/scripts/build.mjs
```

Reads `packages/tokens/src/*.json` and emits:

- `dist/` — TypeScript types + ESM/CJS bundles (one set per domain + combined)
- `css/tokens.css` — CSS custom properties
- `tailwind/preset.cjs` — Tailwind preset
- `figma/tokens.json` — Figma Tokens plugin format
- `styledictionary/tokens.json` — Style Dictionary v4 format

## Source of truth

The canonical JSON sources live at `02_design_tokens/*.json` in the chromatic-design-studios monorepo. Every export above is generated from those files.

## License

MIT — see [chromatic-design-studios](https://github.com/kas1987/chromatic-design-studios).
