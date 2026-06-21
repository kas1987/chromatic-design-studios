#!/usr/bin/env node
/**
 * build.mjs — Build the @chromatic/tokens npm package.
 *
 * Inputs:  packages/tokens/src/*.json (canonical sources)
 * Outputs:
 *   - dist/index.{cjs,mjs,d.ts}            : combined export
 *   - dist/<domain>.{cjs,mjs,d.ts}         : per-domain exports
 *   - css/tokens.css                       : CSS custom properties
 *   - tailwind/preset.cjs                  : Tailwind preset
 *   - figma/tokens.json                    : Figma Tokens plugin format
 *   - styledictionary/tokens.json          : Style Dictionary compatible
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(PKG, 'src');
const DIST = path.join(PKG, 'dist');
const CSS = path.join(PKG, 'css');
const TW = path.join(PKG, 'tailwind');
const FIGMA = path.join(PKG, 'figma');
const SD = path.join(PKG, 'styledictionary');

for (const d of [DIST, CSS, TW, FIGMA, SD]) {
  fs.mkdirSync(d, { recursive: true });
}

const DOMAINS = ['colors', 'spacing', 'typography', 'motion', 'effects'];
const tokens = {};
for (const d of DOMAINS) {
  tokens[d] = JSON.parse(fs.readFileSync(path.join(SRC, `${d}.json`), 'utf8'));
}

// ---- 1. dist/*.mjs / *.cjs / *.d.ts (TypeScript types + ESM/CJS bundles) ----
function emitDomain(domain) {
  const data = tokens[domain];
  const tsContent = `export const ${domain} = ${JSON.stringify(data, null, 2)} as const;\nexport type ${domain.charAt(0).toUpperCase() + domain.slice(1)} = typeof ${domain};\nexport default ${domain};\n`;
  const mjsContent = `const ${domain} = ${JSON.stringify(data, null, 2)};\nexport { ${domain} };\nexport default ${domain};\n`;
  const cjsContent = `"use strict";\nconst ${domain} = ${JSON.stringify(data, null, 2)};\nObject.defineProperty(exports, "${domain}", { enumerable: true, get: function () { return ${domain}; } });\nmodule.exports = ${domain};\nmodule.exports.default = ${domain};\n`;
  const dtsContent = `declare const _${domain}: ${JSON.stringify(data, null, 2)};\nexport declare const ${domain}: typeof _${domain};\nexport default _${domain};\n`;
  fs.writeFileSync(path.join(DIST, `${domain}.mjs`), mjsContent);
  fs.writeFileSync(path.join(DIST, `${domain}.cjs`), cjsContent);
  fs.writeFileSync(path.join(DIST, `${domain}.d.ts`), dtsContent);
}
for (const d of DOMAINS) emitDomain(d);

const indexMjs = `import { colors } from './colors.mjs';\nimport { spacing } from './spacing.mjs';\nimport { typography } from './typography.mjs';\nimport { motion } from './motion.mjs';\nimport { effects } from './effects.mjs';\nexport { colors, spacing, typography, motion, effects };\nexport default { colors, spacing, typography, motion, effects };\n`;
const indexCjs = `"use strict";\nconst { colors } = require('./colors.cjs');\nconst { spacing } = require('./spacing.cjs');\nconst { typography } = require('./typography.cjs');\nconst { motion } = require('./motion.cjs');\nconst { effects } = require('./effects.cjs');\nObject.assign(exports, { colors, spacing, typography, motion, effects });\nexports.default = { colors, spacing, typography, motion, effects };\n`;
const indexDts = `export { colors, type Colors } from './colors.js';\nexport { spacing, type Spacing } from './spacing.js';\nexport { typography, type Typography } from './typography.js';\nexport { motion, type Motion } from './motion.js';\nexport { effects, type Effects } from './effects.js';\ndeclare const _default: { colors: typeof import('./colors.js').colors; spacing: typeof import('./spacing.js').spacing; typography: typeof import('./typography.js').typography; motion: typeof import('./motion.js').motion; effects: typeof import('./effects.js').effects };\nexport default _default;\n`;
fs.writeFileSync(path.join(DIST, 'index.mjs'), indexMjs);
fs.writeFileSync(path.join(DIST, 'index.cjs'), indexCjs);
fs.writeFileSync(path.join(DIST, 'index.d.ts'), indexDts);

// ---- 2. css/tokens.css ----
function flattenColor(obj, prefix = 'color') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flattenColor(v, `${prefix}-${k}`));
    } else {
      out.push([`--${prefix}-${k}`, String(v)]);
    }
  }
  return out;
}
function flattenSpacing(obj, prefix = 'space') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && 'rem' in v) {
      out.push([`--${prefix}-${k}`, v.rem ?? v.value]);
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flattenSpacing(v, `${prefix}-${k}`));
    }
  }
  return out;
}
function flattenMotion(obj, prefix = 'motion') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' || typeof v === 'number') {
      out.push([`--${prefix}-${k}`, String(v)]);
    } else if (v && typeof v === 'object') {
      out.push(...flattenMotion(v, `${prefix}-${k}`));
    }
  }
  return out;
}

const cssLines = [
  '/**',
  ' * Chromatic Design Studios — Design Tokens',
  ' * Auto-generated. Do not edit. Source: 02_design_tokens/*.json',
  ' */',
  ':root {',
  ...flattenColor(tokens.colors).map(([k, v]) => `  ${k}: ${v};`),
  ...flattenColor(tokens.effects).map(([k, v]) => `  ${k.replace('--color-', '--')}: ${v};`),
  ...flattenSpacing(tokens.spacing).map(([k, v]) => `  ${k}: ${v};`),
  ...flattenMotion(tokens.motion).map(([k, v]) => `  ${k}: ${v};`),
  '}',
  '',
];
fs.writeFileSync(path.join(CSS, 'tokens.css'), cssLines.join('\n'));

// ---- 3. tailwind/preset.cjs ----
const twPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          default: 'var(--color-background-default)',
          elevated: 'var(--color-background-elevated)',
          overlay: 'var(--color-background-overlay)',
        },
        surface: {
          default: 'var(--color-surface-default)',
          hover: 'var(--color-surface-hover)',
          active: 'var(--color-surface-active)',
          disabled: 'var(--color-surface-disabled)',
        },
        primary: Object.fromEntries(['50','100','200','300','400','500','600','700','800','900','950'].map((k) => [k, `var(--color-primary-${k})`])),
        accent: Object.fromEntries(['50','100','200','300','400','500','600','700','800','900','950'].map((k) => [k, `var(--color-accent-${k})`])),
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
        },
        border: {
          default: 'var(--color-border-default)',
          hover: 'var(--color-border-hover)',
          focus: 'var(--color-border-focus)',
          active: 'var(--color-border-active)',
        },
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-holographic': 'var(--gradient-holographic)',
        'gradient-glowEdge': 'var(--gradient-glowEdge)',
        'gradient-accentSweep': 'var(--gradient-accentSweep)',
      },
      boxShadow: {
        'glow-focus': 'var(--glow-focus)',
        'glow-hover': 'var(--glow-hover)',
        'glow-card': 'var(--glow-card)',
      },
    },
  },
};
fs.writeFileSync(path.join(TW, 'preset.cjs'), `/** Chromatic Tailwind preset (CommonJS). */\nmodule.exports = ${JSON.stringify(twPreset, null, 2)};\n`);

// ---- 4. figma/tokens.json (Figma Tokens plugin format) ----
function toFigma(domain, obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const fk = `${prefix}${k}`;
    if (v && typeof v === 'object') {
      if ('value' in v || '$value' in v) {
        out[fk] = { value: String(v.value ?? v.$value), type: domain };
      } else if ('size' in v || '$value' in v) {
        out[fk] = { value: v.rem ?? v.size, type: domain };
      } else {
        Object.assign(out, toFigma(domain, v, `${fk}-`));
      }
    } else {
      out[fk] = { value: String(v), type: domain };
    }
  }
  return out;
}
const figmaJson = { global: {} };
figmaJson.global.colors = toFigma('color', tokens.colors);
figmaJson.global.spacing = toFigma('spacing', tokens.spacing);
figmaJson.global.typography = toFigma('typography', tokens.typography);
figmaJson.global.motion = toFigma('motion', tokens.motion);
figmaJson.global.effects = toFigma('effect', tokens.effects);
fs.writeFileSync(path.join(FIGMA, 'tokens.json'), JSON.stringify(figmaJson, null, 2));

// ---- 5. styledictionary/tokens.json (Style Dictionary v4 format) ----
const sdTokens = {};
function addSd(obj, prefix) {
  for (const [k, v] of Object.entries(obj)) {
    const path = `${prefix}-${k}`;
    if (v && typeof v === 'object' && !('value' in v) && !('size' in v)) {
      addSd(v, path);
    } else {
      sdTokens[path] = { value: String(v.value ?? v.rem ?? v.size ?? v) };
    }
  }
}
for (const [d, data] of Object.entries(tokens)) {
  addSd(data, d);
}
fs.writeFileSync(path.join(SD, 'tokens.json'), JSON.stringify({ color: { ...sdTokens } }, null, 2));

console.log('[build] @chromatic/tokens built');
console.log(`  - dist/        (${DOMAINS.length * 3 + 3} files)`);
console.log('  - css/tokens.css');
console.log('  - tailwind/preset.cjs');
console.log('  - figma/tokens.json');
console.log('  - styledictionary/tokens.json');
