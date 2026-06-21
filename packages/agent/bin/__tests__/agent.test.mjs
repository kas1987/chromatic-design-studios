#!/usr/bin/env node
/**
 * Smoke tests for the chromatic-agent CLI.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'chromatic-agent.mjs',
);

// Tests invoke the CLI with a relative spec path. Resolve that path against
// the chromatic-design-studios repo root (4 levels up from this file:
// __tests__ → bin → agent → packages → repo) so the suite passes regardless
// of which workspace cwd npm selects.
const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
);

function runCli(args, cwd = REPO_ROOT) {
  return spawnSync('node', [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'chromatic-agent-'));
}

test('--help prints usage', () => {
  const out = runCli(['--help']).stdout;
  assert.match(out, /Render Chromatic Design Studios specs into TSX/);
});

test('list prints the 3 starter components', () => {
  const out = runCli(['list']).stdout;
  const items = out.split('\n').filter((l) => l.startsWith('  - '));
  assert.equal(items.length, 3, `expected 3 components, got ${items.length}`);
  assert.ok(items.some((i) => i.includes('Button')));
  assert.ok(items.some((i) => i.includes('Card')));
  assert.ok(items.some((i) => i.includes('Badge')));
});

test('check passes for a renderable spec', () => {
  const r = runCli(['check', '03_components/button.md']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Button is renderable/);
});

test('check fails for a missing spec', () => {
  const r = runCli(['check', '03_components/nonexistent.md']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /not found/i);
});

test('render emits TSX for a known component', () => {
  const dir = tempDir();
  try {
    const outFile = path.join(dir, 'ButtonDemo.tsx');
    const r = runCli(['render', '03_components/button.md', outFile]);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(fs.existsSync(outFile));
    const txt = fs.readFileSync(outFile, 'utf8');
    assert.match(txt, /import \{ Button \} from "@chromatic\/ui"/);
    assert.match(txt, /export function ButtonDemo\(\)/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('render without output writes to stdout', () => {
  const r = runCli(['render', '03_components/badge.md']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /import \{ Badge \} from "@chromatic\/ui"/);
});

test('render fails for an unknown component (confidence gate)', () => {
  const dir = tempDir();
  try {
    // Write a fake spec for a non-existent component
    const specPath = path.join(dir, 'phantom.md');
    fs.writeFileSync(specPath, '# Phantom\nStatus: stable\n');
    const r = runCli(['render', specPath]);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /confidence too low|no template found/i);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
