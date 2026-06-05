#!/usr/bin/env node
/**
 * build-db.mjs — CCS Library DB ingest + sync pipeline.
 *
 * Phase 1: Rebuild db/ccs-registry.db (SQLite) from source files:
 *   - 02_design_tokens/*.json  → tokens table
 *   - packages/ui/src/components/*.tsx → components table
 *   - css-library/*.css        → css_classes table
 *
 * Phase 2: Sync registry tables to Postgres (if DATABASE_URL is set).
 *   - Atomically replaces registry_tokens + registry_components
 *   - Appends to sync_log
 *
 * Run: node scripts/build-db.mjs
 * Requires Node >= 22 (uses node:sqlite built-in)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_DIR = path.join(ROOT, '02_design_tokens');
const COMPONENTS_DIR = path.join(ROOT, 'packages', 'ui', 'src', 'components');
const CSS_DIR = path.join(ROOT, 'css-library');
const DB_PATH = path.join(ROOT, 'db', 'ccs-registry.db');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/** Recursively walk a JSON object, yielding { group, name, value } for every leaf. */
function* walkTokens(obj, groupParts = []) {
  for (const [key, val] of Object.entries(obj)) {
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      yield* walkTokens(val, [...groupParts, key]);
    } else {
      const parts = [...groupParts, key];
      const name = parts.pop();
      yield { group: parts.join('.'), name, value: String(val) };
    }
  }
}

/** Rough prop extraction from TSX source via regex. */
function extractProps(src) {
  const propsMatch = src.match(/(?:interface|type)\s+\w*Props\s*[={][^}]+}/s);
  if (!propsMatch) return [];
  const block = propsMatch[0];
  const props = [];
  const propRe = /(\w+)(\??):\s*([^;,\n]+)/g;
  let m;
  while ((m = propRe.exec(block)) !== null) {
    props.push({ name: m[1], type: m[3].trim(), required: m[2] !== '?' });
  }
  return props;
}

/** Parse CSS file into array of { className, properties } objects. */
function parseCssClasses(src) {
  const classes = [];
  const ruleRe = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
  let m;
  while ((m = ruleRe.exec(src)) !== null) {
    const className = m[1];
    const decls = {};
    const declRe = /([\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = declRe.exec(m[2])) !== null) {
      decls[d[1].trim()] = d[2].trim();
    }
    if (Object.keys(decls).length > 0) {
      classes.push({ className, properties: decls });
    }
  }
  return classes;
}

function hashSources(paths) {
  const h = crypto.createHash('sha256');
  for (const p of paths) {
    if (fs.existsSync(p)) h.update(fs.readFileSync(p));
  }
  return h.digest('hex').slice(0, 16);
}

// ── Phase 1: Build SQLite ─────────────────────────────────────────────────────

function buildSqlite() {
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

  const db = new DatabaseSync(DB_PATH);

  db.exec(`
    CREATE TABLE tokens (
      id         INTEGER PRIMARY KEY,
      category   TEXT NOT NULL,
      group_name TEXT,
      name       TEXT NOT NULL,
      value      TEXT NOT NULL,
      theme      TEXT NOT NULL
    );
    CREATE TABLE components (
      id          INTEGER PRIMARY KEY,
      name        TEXT UNIQUE NOT NULL,
      file_path   TEXT NOT NULL,
      props_json  TEXT,
      tokens_used TEXT
    );
    CREATE TABLE css_classes (
      id          INTEGER PRIMARY KEY,
      class_name  TEXT NOT NULL,
      source_file TEXT NOT NULL,
      theme       TEXT NOT NULL,
      properties  TEXT
    );
    CREATE TABLE themes (
      id              INTEGER PRIMARY KEY,
      name            TEXT UNIQUE NOT NULL,
      description     TEXT,
      token_count     INTEGER DEFAULT 0,
      component_count INTEGER DEFAULT 0
    );
    CREATE TABLE token_component_refs (
      token_id     INTEGER,
      component_id INTEGER,
      PRIMARY KEY (token_id, component_id)
    );
    CREATE TABLE registry_meta (
      built_at        TEXT NOT NULL,
      token_count     INTEGER NOT NULL,
      component_count INTEGER NOT NULL,
      css_class_count INTEGER NOT NULL,
      source_hash     TEXT NOT NULL
    );
    CREATE INDEX idx_tokens_category_theme ON tokens(category, theme);
    CREATE INDEX idx_css_classes_theme ON css_classes(theme);
  `);

  const insertToken = db.prepare(
    'INSERT INTO tokens(category, group_name, name, value, theme) VALUES (?,?,?,?,?)'
  );
  const insertComponent = db.prepare(
    'INSERT OR IGNORE INTO components(name, file_path, props_json, tokens_used) VALUES (?,?,?,?)'
  );
  const insertClass = db.prepare(
    'INSERT INTO css_classes(class_name, source_file, theme, properties) VALUES (?,?,?,?)'
  );
  const insertTheme = db.prepare(
    'INSERT OR IGNORE INTO themes(name, description) VALUES (?,?)'
  );

  let tokenCount = 0;
  let componentCount = 0;
  let cssClassCount = 0;
  const sourceFiles = [];

  // ── Tokens ────────────────────────────────────────────────────────────────
  const tokenFiles = fs.readdirSync(TOKENS_DIR).filter(f => f.endsWith('.json'));
  sourceFiles.push(...tokenFiles.map(f => path.join(TOKENS_DIR, f)));

  for (const file of tokenFiles) {
    const category = file.replace(/^tokens\./, '').replace(/\.json$/, '');
    const theme = file.includes('.light') ? 'light'
                : file.includes('.luxe')  ? 'luxe'
                : file.includes('.zelex') ? 'zelex'
                : 'base';
    const data = readJson(path.join(TOKENS_DIR, file));
    for (const { group, name, value } of walkTokens(data)) {
      insertToken.run(category, group || null, name, value, theme);
      tokenCount++;
    }
  }

  // ── Components ────────────────────────────────────────────────────────────
  if (fs.existsSync(COMPONENTS_DIR)) {
    const compFiles = fs.readdirSync(COMPONENTS_DIR)
      .filter(f => f.endsWith('.tsx') && f !== 'index.ts');
    sourceFiles.push(...compFiles.map(f => path.join(COMPONENTS_DIR, f)));

    for (const file of compFiles) {
      const filePath = path.join(COMPONENTS_DIR, file);
      const src = fs.readFileSync(filePath, 'utf8');
      const name = path.basename(file, '.tsx');
      const props = extractProps(src);
      const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
      insertComponent.run(name, relPath, JSON.stringify(props), JSON.stringify([]));
      componentCount++;
    }
  }

  // ── CSS Classes ───────────────────────────────────────────────────────────
  if (fs.existsSync(CSS_DIR)) {
    const cssFiles = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));
    sourceFiles.push(...cssFiles.map(f => path.join(CSS_DIR, f)));

    for (const file of cssFiles) {
      const theme = file.includes('luxe') ? 'luxe' : 'base';
      const src = fs.readFileSync(path.join(CSS_DIR, file), 'utf8');
      for (const { className, properties } of parseCssClasses(src)) {
        insertClass.run(className, file, theme, JSON.stringify(properties));
        cssClassCount++;
      }
    }
  }

  // ── Themes ────────────────────────────────────────────────────────────────
  for (const [name, desc] of [
    ['base',  'Chromatic base dark theme'],
    ['luxe',  'Chromatic Luxe premium variant'],
    ['zelex', 'Zelex client theme'],
    ['light', 'Chromatic light mode override'],
  ]) {
    insertTheme.run(name, desc);
  }

  db.prepare(`
    UPDATE themes SET token_count = (
      SELECT COUNT(*) FROM tokens WHERE theme = themes.name
    )
  `).run();
  db.prepare(`
    UPDATE themes SET component_count = (SELECT COUNT(*) FROM components)
  `).run();

  // ── Registry meta ─────────────────────────────────────────────────────────
  const sourceHash = hashSources(sourceFiles);
  db.prepare(
    'INSERT INTO registry_meta(built_at, token_count, component_count, css_class_count, source_hash) VALUES (?,?,?,?,?)'
  ).run(new Date().toISOString(), tokenCount, componentCount, cssClassCount, sourceHash);

  db.close();

  console.log('\n=== ccs-registry.db built ===');
  console.log(`  tokens       ${tokenCount}`);
  console.log(`  components   ${componentCount}`);
  console.log(`  css_classes  ${cssClassCount}`);
  console.log(`  source_hash  ${sourceHash}`);
  console.log(`  path         ${DB_PATH}\n`);

  return { tokenCount, componentCount, sourceHash };
}

// ── Phase 2: Sync to Postgres ─────────────────────────────────────────────────

async function syncPostgres(tokenCount, componentCount, sourceHash) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log('DATABASE_URL not set — skipping Postgres sync (SQLite-only mode).');
    return;
  }

  let pg;
  try {
    const { default: postgres } = await import('postgres');
    pg = postgres(url);
  } catch {
    console.warn('postgres package not available — skipping Postgres sync. Run: npm install postgres');
    return;
  }

  const db = new DatabaseSync(DB_PATH, { readOnly: true });
  const tokens = db.prepare('SELECT category, group_name, name, value, theme FROM tokens').all();
  const components = db.prepare('SELECT name, file_path, props_json, tokens_used FROM components').all();
  db.close();

  try {
    await pg.begin(async (sql) => {
      await sql`TRUNCATE registry_tokens, registry_components RESTART IDENTITY`;

      if (tokens.length > 0) {
        await sql`INSERT INTO registry_tokens ${sql(
          tokens.map(t => ({
            category: t.category,
            group_name: t.group_name ?? null,
            name: t.name,
            value: t.value,
            theme: t.theme,
          }))
        )}`;
      }

      if (components.length > 0) {
        await sql`INSERT INTO registry_components ${sql(
          components.map(c => ({
            name: c.name,
            file_path: c.file_path,
            props_json: c.props_json ? JSON.parse(c.props_json) : null,
            tokens_used: c.tokens_used ? JSON.parse(c.tokens_used) : null,
          }))
        )}`;
      }

      await sql`
        INSERT INTO sync_log (source_hash, tokens_synced, components_synced)
        VALUES (${sourceHash}, ${tokenCount}, ${componentCount})
      `;
    });

    console.log('=== Postgres sync complete ===');
    console.log(`  tokens synced      ${tokenCount}`);
    console.log(`  components synced  ${componentCount}`);
  } finally {
    await pg.end();
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const { tokenCount, componentCount, sourceHash } = buildSqlite();
await syncPostgres(tokenCount, componentCount, sourceHash);
