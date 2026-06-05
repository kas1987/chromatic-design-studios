#!/usr/bin/env node
/**
 * chromatic-token-studio.mjs — bridge between the canonical Chromatic tokens
 * and the frontend-family `visual-design` companion (live token tuning).
 *
 * Flow:
 *   1. Start the visual-design companion server (see USAGE below) -> screen_dir + state_dir.
 *   2. `node scripts/chromatic-token-studio.mjs screen <screen_dir>`
 *        Reads 02_design_tokens/*.json and writes a token-tuner HTML screen.
 *        Each control carries data-token="<dotted.path>" (for write-back) and
 *        data-token-css="--<chromatic-var>" (for live preview). The companion
 *        streams every edit into <state_dir>/tokens.json keyed by dotted path.
 *   3. User drags colors / radius / spacing in the browser.
 *   4. `node scripts/chromatic-token-studio.mjs apply <state_dir>/tokens.json`
 *        Patches the chosen values back into 02_design_tokens/*.json.
 *   5. `npm run tokens` regenerates the Tailwind theme + CSS vars.
 *
 * USAGE (start the companion, Windows/Git Bash — run backgrounded):
 *   .00_Governance/.02_Plugins/frontend-family/skills/visual-design/scripts/start-server.sh \
 *      --project-dir "$(pwd)"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_DIR = path.join(ROOT, '02_design_tokens');

const FILE_FOR_DOMAIN = {
  colors: 'tokens.colors.json',
  spacing: 'tokens.spacing.json',
  typography: 'tokens.typography.json',
  motion: 'tokens.motion.json',
  glow: 'tokens.glow.json',
};

// Curated set of tunable tokens: { path, label, type, cssVar, [min,max,step,unit] | options }
// `path` is the dotted location in its JSON file; `cssVar` matches build-tokens output.
const TUNABLE = [
  { path: 'colors.background.default', label: 'Background', type: 'color', cssVar: '--color-background-default' },
  { path: 'colors.background.elevated', label: 'Surface (elevated)', type: 'color', cssVar: '--color-background-elevated' },
  { path: 'colors.primary.500', label: 'Primary 500', type: 'color', cssVar: '--color-primary-500' },
  { path: 'colors.primary.600', label: 'Primary 600', type: 'color', cssVar: '--color-primary-600' },
  { path: 'colors.primary.700', label: 'Primary 700', type: 'color', cssVar: '--color-primary-700' },
  { path: 'colors.accent.500', label: 'Accent 500', type: 'color', cssVar: '--color-accent-500' },
  { path: 'colors.text.primary', label: 'Text primary', type: 'color', cssVar: '--color-text-primary' },
  { path: 'colors.text.secondary', label: 'Text secondary', type: 'color', cssVar: '--color-text-secondary' },
  { path: 'colors.border.default', label: 'Border', type: 'color', cssVar: '--color-border-default' },
  { path: 'spacing.semantic.radius.md', label: 'Radius md', type: 'range', cssVar: '--radius-md', min: 0, max: 24, step: 1, unit: 'px' },
  { path: 'spacing.semantic.radius.lg', label: 'Radius lg', type: 'range', cssVar: '--radius-lg', min: 0, max: 36, step: 1, unit: 'px' },
];

// Light-mode tunable set: only the mode-dependent colors live in the override
// file. cssVar names match the dark vars (the `.light` block overrides them).
const TUNABLE_LIGHT = [
  { path: 'colors.background.default', label: 'Background', type: 'color', cssVar: '--color-background-default' },
  { path: 'colors.background.elevated', label: 'Surface (elevated)', type: 'color', cssVar: '--color-background-elevated' },
  { path: 'colors.surface.default', label: 'Surface default', type: 'color', cssVar: '--color-surface-default' },
  { path: 'colors.text.primary', label: 'Text primary', type: 'color', cssVar: '--color-text-primary' },
  { path: 'colors.text.secondary', label: 'Text secondary', type: 'color', cssVar: '--color-text-secondary' },
  { path: 'colors.text.muted', label: 'Text muted', type: 'color', cssVar: '--color-text-muted' },
  { path: 'colors.text.onprimary', label: 'Text on primary (CTA label)', type: 'color', cssVar: '--color-text-onprimary' },
  { path: 'colors.border.default', label: 'Border', type: 'color', cssVar: '--color-border-default' },
  { path: 'colors.border.hover', label: 'Border hover', type: 'color', cssVar: '--color-border-hover' },
];

// Light-mode override file: mirrors the `colors` domain (no `colors.` wrapper).
// The same dotted `colors.<group>.<key>` paths used by the dark tuner address it,
// minus the leading `colors.` segment.
const LIGHT_FILE = 'tokens.colors.light.json';

function readToken(dotted) {
  const [domain, ...rest] = dotted.split('.');
  const obj = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, FILE_FOR_DOMAIN[domain]), 'utf8'));
  return rest.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function readLightToken(dotted) {
  // strip leading `colors.` — the light file IS the colors object
  const rest = dotted.replace(/^colors\./, '').split('.');
  const obj = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, LIGHT_FILE), 'utf8'));
  return rest.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function writeLightToken(dotted, value) {
  const rest = dotted.replace(/^colors\./, '').split('.');
  const file = path.join(TOKENS_DIR, LIGHT_FILE);
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  let node = obj;
  for (let i = 0; i < rest.length - 1; i++) node = node[rest[i]] ??= {};
  node[rest[rest.length - 1]] = value;
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
}

function writeToken(dotted, value) {
  const [domain, ...rest] = dotted.split('.');
  const file = path.join(TOKENS_DIR, FILE_FOR_DOMAIN[domain]);
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  let node = obj;
  for (let i = 0; i < rest.length - 1; i++) node = node[rest[i]];
  node[rest[rest.length - 1]] = value;
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
}

// ---- screen: emit the token-tuner HTML fragment ----------------------------
// mode: 'dark' tunes tokens.colors.json (+spacing); 'light' tunes the override file.
function buildScreen(screenDir, mode = 'dark') {
  const isLight = mode === 'light';
  const tunable = isLight ? TUNABLE_LIGHT : TUNABLE;
  const reader = isLight ? readLightToken : readToken;

  const rows = tunable.map((t) => {
    const current = reader(t.path) ?? '';
    if (t.type === 'color') {
      return `  <div class="token-row">
    <label>${t.label} <span class="token-value" data-token-output="${t.path}">${current}</span></label>
    <input type="color" data-token="${t.path}" data-token-css="${t.cssVar}" value="${current}">
  </div>`;
    }
    const num = String(current).replace(/px$/, '');
    return `  <div class="token-row">
    <label>${t.label} <span class="token-value" data-token-output="${t.path}">${current}</span></label>
    <input type="range" min="${t.min}" max="${t.max}" step="${t.step}"
           data-token="${t.path}" data-token-css="${t.cssVar}" value="${num}">
  </div>`;
  }).join('\n');

  const applyCmd = isLight ? 'apply-light' : 'apply';
  const title = isLight ? 'Tune Chromatic LIGHT mode' : 'Tune Chromatic tokens';
  // Light preview sits on a light backdrop so contrast reads true while tuning.
  const stageBg = isLight ? 'var(--color-background-default, #faf9fc)' : '';
  const stageStyle = isLight ? ` style="background:${stageBg}"` : '';

  const html = `<h2>${title}</h2>
<p class="subtitle">Drag to preview live. Values are saved to state/tokens.json — then run
<code>chromatic-token-studio.mjs ${applyCmd}</code> to write them back into 02_design_tokens/.</p>

<div class="tokens">
${rows}
</div>

<div class="preview-stage" data-bg="muted"${stageStyle}>
  <div style="background:var(--color-background-elevated);border:1px solid var(--color-border-default);
              border-radius:var(--radius-lg,12px);padding:24px 28px;max-width:420px">
    <span style="display:inline-block;border:1px solid var(--color-border-default);border-radius:9999px;
                 padding:2px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;
                 color:var(--color-text-secondary)">Design System</span>
    <h3 style="color:var(--color-text-primary);margin:12px 0 6px;font-size:28px">Chromatic Studios</h3>
    <p style="color:var(--color-text-secondary);margin:0 0 16px">Governed design operations for the Chromatic Harness.</p>
    <button style="background:var(--color-primary-600);color:var(--color-text-onprimary, #fff);border:none;
                   border-radius:var(--radius-md,8px);padding:10px 18px;cursor:pointer">Open Dashboard</button>
  </div>
</div>`;

  // Note: the range live-apply sets the raw number; preview vars expecting px
  // still read e.g. "12" — acceptable for preview. apply re-attaches the unit.
  const file = path.join(screenDir, 'chromatic-tokens.html');
  fs.writeFileSync(file, html);
  console.log(`[token-studio] wrote ${mode} tuner screen -> ${file}`);
  console.log(`[token-studio] open the companion URL, tune, then run: ${applyCmd} <state_dir>/tokens.json`);
}

// ---- apply: write chosen values back into the token JSON --------------------
function applyTokens(tokensJsonPath, mode = 'dark') {
  const isLight = mode === 'light';
  let chosen;
  try {
    chosen = JSON.parse(fs.readFileSync(tokensJsonPath, 'utf8'));
  } catch (e) {
    console.error(`[token-studio] cannot read ${tokensJsonPath}: ${e.message}`);
    process.exit(1);
  }
  const meta = new Map((isLight ? TUNABLE_LIGHT : TUNABLE).map((t) => [t.path, t]));
  const writer = isLight ? writeLightToken : writeToken;
  let n = 0;
  for (const [dotted, raw] of Object.entries(chosen)) {
    const t = meta.get(dotted);
    if (!t) continue; // ignore non-Chromatic events
    let value = raw;
    if (t.type === 'range' && t.unit && !String(raw).endsWith(t.unit)) value = `${raw}${t.unit}`;
    writer(dotted, value);
    console.log(`  ${dotted} = ${value}`);
    n++;
  }
  const target = isLight ? 'tokens.colors.light.json' : '02_design_tokens/';
  console.log(`[token-studio] applied ${n} ${mode} token(s) -> ${target}. Now run: npm run tokens`);
}

// ---- CLI --------------------------------------------------------------------
const [cmd, arg] = process.argv.slice(2);
if (cmd === 'screen' && arg) buildScreen(path.resolve(arg), 'dark');
else if (cmd === 'screen-light' && arg) buildScreen(path.resolve(arg), 'light');
else if (cmd === 'apply' && arg) applyTokens(path.resolve(arg), 'dark');
else if (cmd === 'apply-light' && arg) applyTokens(path.resolve(arg), 'light');
else {
  console.error(
    'Usage:\n' +
    '  chromatic-token-studio.mjs screen <screen_dir>             # tune dark tokens\n' +
    '  chromatic-token-studio.mjs screen-light <screen_dir>       # tune light-mode overrides\n' +
    '  chromatic-token-studio.mjs apply <state_dir>/tokens.json\n' +
    '  chromatic-token-studio.mjs apply-light <state_dir>/tokens.json',
  );
  process.exit(1);
}
