#!/usr/bin/env node
/**
 * chromatic-ui — CLI for the Chromatic Design Studios component library.
 *
 * Subcommands:
 *   init                  Scaffold tokens + base config into the current project.
 *   add <component>       Copy a component source into ./components/chromatic/.
 *   add --pack <name>     Copy a whole ComfyUI pack into ./components/chromatic/packs/.
 *   list                  List available components.
 *   packs [list]          List available ComfyUI resource packs.
 *   packs show <name>     Print a pack's manifest.
 *   tokens                Emit a CSS layer with the design tokens.
 *   doctor                Verify project setup (Tailwind present, etc.).
 *
 * The CLI is intentionally zero-network: it ships embedded component sources
 * (./templates) and writes them to disk. No telemetry, no telemetry hooks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATES = path.join(PKG_ROOT, 'templates');

const args = process.argv.slice(2);
const cmd = args[0];

function help() {
  console.log(`chromatic-ui — Chromatic Design Studios CLI

Usage:
  chromatic-ui <command> [options]

Commands:
  init                  Scaffold tokens + base config into ./components/chromatic
  add <name>            Add a single component (e.g. "button", "modal")
  add --pack <name>     Add a ComfyUI resource pack (e.g. "zelex-portrait")
  list                  List available components
  packs [list]          List available ComfyUI resource packs
  packs show <name>     Print a pack's manifest.yaml
  tokens                Emit @chromatic/tokens CSS layer to ./app/globals.css
  doctor                Check project setup

Options:
  -h, --help            Show this help
  -v, --version         Show version
`);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`  + ${path.relative(process.cwd(), dest)}`);
}

function listComponents() {
  const dir = path.join(TEMPLATES, 'components');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));
}

function listPacks() {
  const dir = path.join(TEMPLATES, 'packs');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else if (entry.isFile()) {
      copyFile(src, dest);
    }
  }
}

function cmdInit() {
  const cwd = process.cwd();
  const target = path.join(cwd, 'components', 'chromatic');
  console.log(`Initializing Chromatic into ${target}…`);
  ensureDir(target);
  // Copy the index barrell and a starter.
  copyFile(path.join(TEMPLATES, 'index.ts'), path.join(target, 'index.ts'));
  console.log('Done. Next steps:');
  console.log('  1. Add `import "./components/chromatic";` to your root layout.');
  console.log('  2. Run `chromatic-ui add button` to add your first component.');
  console.log('  3. See https://github.com/kas1987/chromatic-design-studios for docs.');
}

function cmdAdd(name, opts = {}) {
  if (!name) {
    console.error('Usage: chromatic-ui add <component>  OR  chromatic-ui add --pack <name>');
    process.exit(1);
  }
  const target = path.join(process.cwd(), 'components', 'chromatic');

  if (opts.pack) {
    const packName = name;
    const packDir = path.join(TEMPLATES, 'packs', packName);
    if (!fs.existsSync(packDir) || !fs.statSync(packDir).isDirectory()) {
      console.error(`Pack "${packName}" not found. Run: chromatic-ui packs list`);
      process.exit(1);
    }
    const dest = path.join(target, 'packs', packName);
    copyDir(packDir, dest);
    console.log(`Added pack ${packName}.`);
    return;
  }

  ensureDir(target);
  const safe = name.replace(/[^a-zA-Z0-9-_]/g, '');
  // Try exact match, lowercase, title-case
  const candidates = [
    `${safe}.tsx`,
    `${safe.toLowerCase()}.tsx`,
    `${safe.charAt(0).toUpperCase() + safe.slice(1)}.tsx`,
  ];
  let matched = null;
  for (const f of candidates) {
    const p = path.join(TEMPLATES, 'components', f);
    if (fs.existsSync(p)) {
      matched = p;
      break;
    }
  }
  if (!matched) {
    console.error(`Component "${name}" not found. Run: chromatic-ui list`);
    process.exit(1);
  }
  copyFile(matched, path.join(target, path.basename(matched)));
  console.log(`Added ${path.basename(matched)}. Import it from "@/components/chromatic".`);
}

function cmdPacks(sub, name) {
  const packs = listPacks();
  if (!sub || sub === 'list') {
    console.log(`Available packs (${packs.length}):`);
    for (const p of packs) console.log(`  - ${p}`);
    return;
  }
  if (sub === 'show') {
    if (!name) {
      console.error('Usage: chromatic-ui packs show <name>');
      process.exit(1);
    }
    const manifest = path.join(TEMPLATES, 'packs', name, 'manifest.yaml');
    if (!fs.existsSync(manifest)) {
      console.error(`Pack "${name}" not found. Run: chromatic-ui packs list`);
      process.exit(1);
    }
    console.log(fs.readFileSync(manifest, 'utf8'));
    return;
  }
  console.error(`Unknown packs subcommand: ${sub}`);
  process.exit(1);
}

function cmdList() {
  const items = listComponents();
  console.log(`Available components (${items.length}):`);
  for (const f of items) console.log(`  - ${f.replace(/\.tsx$/, '')}`);
}

function cmdTokens() {
  const cssFile = path.join(PKG_ROOT, '..', 'tokens', 'css', 'tokens.css');
  if (!fs.existsSync(cssFile)) {
    console.error('Could not find @chromatic/tokens CSS layer. Run `npm run build` in packages/tokens first.');
    process.exit(1);
  }
  const dest = path.join(process.cwd(), 'chromatic-tokens.css');
  fs.copyFileSync(cssFile, dest);
  console.log(`Wrote ${dest}. Import it from your root layout.`);
}

function cmdDoctor() {
  const cwd = process.cwd();
  const checks = [
    {
      name: 'package.json',
      ok: fs.existsSync(path.join(cwd, 'package.json')),
    },
    {
      name: 'tailwind.config.{ts,js}',
      ok:
        fs.existsSync(path.join(cwd, 'tailwind.config.ts')) ||
        fs.existsSync(path.join(cwd, 'tailwind.config.js')),
    },
    {
      name: 'components/chromatic/ directory',
      ok: fs.existsSync(path.join(cwd, 'components', 'chromatic')),
    },
  ];
  let bad = 0;
  for (const c of checks) {
    console.log(`  ${c.ok ? '✓' : '✗'} ${c.name}`);
    if (!c.ok) bad++;
  }
  if (bad > 0) {
    console.log(`\n${bad} check(s) failed. Run \`chromatic-ui init\` to scaffold.`);
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}

if (cmd === '--help' || cmd === '-h' || !cmd) {
  help();
} else if (cmd === '--version' || cmd === '-v') {
  const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
  console.log(`${pkg.name} v${pkg.version}`);
} else if (cmd === 'init') {
  cmdInit();
} else if (cmd === 'add') {
  const isPack = args.includes('--pack');
  const filtered = args.filter((a) => a !== '--pack');
  cmdAdd(filtered[1], { pack: isPack });
} else if (cmd === 'packs') {
  cmdPacks(args[1], args[2]);
} else if (cmd === 'list') {
  cmdList();
} else if (cmd === 'tokens') {
  cmdTokens();
} else if (cmd === 'doctor') {
  cmdDoctor();
} else {
  console.error(`Unknown command: ${cmd}`);
  help();
  process.exit(1);
}
