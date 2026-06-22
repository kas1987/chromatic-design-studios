#!/usr/bin/env node
/**
 * Tests for the chromatic-ui CLI pack commands.
 *
 * Run: node --test ./bin/__tests__/packs.test.mjs
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
  return fs.mkdtempSync(path.join(os.tmpdir(), 'chromatic-cli-packs-'));
}

test('packs list enumerates the 3 resource packs', () => {
  const out = runCli(['packs', 'list']).stdout;
  const items = out.split('\n').filter((l) => l.startsWith('  - '));
  const names = items.map((l) => l.replace(/^  - /, '').trim());
  assert.ok(names.includes('zelex-portrait'), 'zelex-portrait missing');
  assert.ok(names.includes('stash-indexer'), 'stash-indexer missing');
  assert.ok(names.includes('mastery-loop'), 'mastery-loop missing');
  assert.ok(items.length >= 3, `expected >=3 packs, got ${items.length}`);
});

test('packs show <name> prints the manifest', () => {
  const r = runCli(['packs', 'show', 'zelex-portrait']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /name: zelex-portrait/);
  assert.match(r.stdout, /lane: image/);
  assert.match(r.stdout, /workflow_id: zelex_t2i_four_prompt_v1/);
});

test('packs show with unknown name exits non-zero', () => {
  const r = runCli(['packs', 'show', 'no-such-pack']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /not found/);
});

test('add --pack <name> copies the whole pack directory', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', '--pack', 'zelex-portrait'], dir);
    assert.equal(r.status, 0, r.stderr);
    const packRoot = path.join(dir, 'components', 'chromatic', 'packs', 'zelex-portrait');
    assert.ok(fs.existsSync(packRoot), 'pack root should exist');
    assert.ok(fs.existsSync(path.join(packRoot, 'manifest.yaml')));
    assert.ok(fs.existsSync(path.join(packRoot, 'models.yaml')));
    assert.ok(
      fs.existsSync(path.join(packRoot, 'workflows', 'zelex_t2i_four_prompt.v1.graph.json')),
      'workflow JSON missing',
    );
    assert.ok(
      fs.existsSync(path.join(packRoot, 'prompts', 'zelex.yaml')),
      'prompt YAML missing',
    );
    const wf = JSON.parse(
      fs.readFileSync(
        path.join(packRoot, 'workflows', 'zelex_t2i_four_prompt.v1.graph.json'),
        'utf8',
      ),
    );
    assert.equal(wf.id, 'zelex_t2i_four_prompt_v1');
    assert.equal(wf.kind, 'image.t2i');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('add --pack stash-indexer copies the metadata-only pack', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', '--pack', 'stash-indexer'], dir);
    assert.equal(r.status, 0, r.stderr);
    const packRoot = path.join(dir, 'components', 'chromatic', 'packs', 'stash-indexer');
    assert.ok(fs.existsSync(path.join(packRoot, 'workflows', 'stash-indexer.v1.graph.json')));
    assert.ok(fs.existsSync(path.join(packRoot, 'prompts', 'INDEX-PROMPT.yaml')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('add --pack with unknown name exits non-zero', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', '--pack', 'not-a-pack'], dir);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /not found/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('add <name> still works (no --pack)', () => {
  const dir = tempDir();
  try {
    runCli(['init'], dir);
    const r = runCli(['add', 'modal'], dir);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(
      fs.existsSync(path.join(dir, 'components', 'chromatic', 'Modal.tsx')),
      'Modal.tsx should exist',
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
