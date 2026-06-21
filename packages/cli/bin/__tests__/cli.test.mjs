#!/usr/bin/env node
/**
 * Smoke tests for the chromatic-ui CLI.
 *
 * Run: node --test ./bin/__tests__/cli.test.mjs
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
  'chromatic-ui.mjs',
);

function runCli(args, cwd) {
  return spawnSync('node', [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'chromatic-cli-'));
}

test('--version prints the package version', () => {
  const out = runCli(['--version']).stdout.trim();
  assert.match(out, /^chromatic-ui v\d+\.\d+\.\d+$/);
});

test('list prints all 23 components', () => {
  const out = runCli(['list']).stdout;
  const items = out.split('\n').filter((l) => l.startsWith('  - '));
  assert.equal(items.length, 23, `expected 23 components, got ${items.length}`);
});

test('init scaffolds the barrel index', () => {
  const dir = tempDir();
  try {
    const r = runCli(['init'], dir);
    assert.equal(r.status, 0, r.stderr);
    const indexPath = path.join(dir, 'components', 'chromatic', 'index.ts');
    assert.ok(fs.existsSync(indexPath), 'index.ts should exist');
    const txt = fs.readFileSync(indexPath, 'utf8');
    assert.match(txt, /export \{ Button/);
    assert.match(txt, /export \{ Modal/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('add <name> copies the named component', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', 'modal'], dir);
    assert.equal(r.status, 0, r.stderr);
    const componentPath = path.join(dir, 'components', 'chromatic', 'Modal.tsx');
    assert.ok(fs.existsSync(componentPath), 'Modal.tsx should exist');
    const txt = fs.readFileSync(componentPath, 'utf8');
    assert.match(txt, /Chromatic Modal/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('add with unknown name exits non-zero', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', 'NotARealComponent'], dir);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /not found/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('doctor reports missing prerequisites in a bare temp dir', () => {
  const dir = tempDir();
  try {
    // In a bare temp dir, doctor should report failures (no package.json, no tailwind, no components dir)
    const r = runCli(['doctor'], dir);
    assert.notEqual(r.status, 0, 'doctor should exit non-zero when checks fail');
    // The output should mention at least one failing check
    const combined = r.stdout + r.stderr;
    assert.match(combined, /✗/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('add is case-insensitive', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', 'BUTTON'], dir);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(fs.existsSync(path.join(dir, 'components', 'chromatic', 'Button.tsx')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
