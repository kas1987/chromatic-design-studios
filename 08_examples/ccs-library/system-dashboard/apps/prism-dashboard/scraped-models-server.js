#!/usr/bin/env node
/**
 * scraped-models-server.js
 * Lightweight HTTP server that serves scraped model metadata from the local filesystem.
 * Runs on port 9883 by default.
 *
 * Serves:
 *   GET /characters?limit=N&root=PATH&offset=N
 *   GET /health
 *
 * Response shape compatible with data-connectors.js normalizeCharacterRecord()
 * Primary data file per model: {slug}/{slug}_CHARACTER_PROFILE.json (richest)
 * Fallback: {slug}/{slug}_MASTER.json
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const repoMetadata = require('./ccs-repo-metadata.json');
const ccsCharacterSchema = require('./ccs-character-metadata-spec.v1.json');

const DEFAULT_PORT = 9883;
const DEFAULT_ROOT = 'E:/scraped_models';

// Cache loaded characters in memory after first scan
let _cache = null;
let _cacheRoot = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function loadCharacters(rootDir) {
  const now = Date.now();
  if (_cache && _cacheRoot === rootDir && (now - _cacheTime) < CACHE_TTL_MS) {
    return _cache;
  }

  const results = [];

  if (!fs.existsSync(rootDir)) {
    console.warn(`[scraped-models-server] Root dir not found: ${rootDir}`);
    return results;
  }

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip special dirs
    if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name === '__pycache__') continue;

    const slug = entry.name;
    const modelDir = path.join(rootDir, slug);

    // Try CHARACTER_PROFILE.json first (richest), then MASTER.json
    const candidateFiles = [
      path.join(modelDir, `${slug}_CHARACTER_PROFILE.json`),
      path.join(modelDir, 'CHARACTER_PROFILE.json'),
      path.join(modelDir, `${slug}_MASTER.json`),
    ];

    let raw = null;
    for (const f of candidateFiles) {
      if (fs.existsSync(f)) {
        try {
          raw = JSON.parse(fs.readFileSync(f, 'utf8'));
          break;
        } catch {
          // malformed JSON — skip to next candidate
        }
      }
    }

    if (!raw) continue;

    results.push(normalizeRecord(slug, raw, modelDir));
  }

  _cache = results;
  _cacheRoot = rootDir;
  _cacheTime = now;

  console.log(`[scraped-models-server] Loaded ${results.length} models from ${rootDir}`);
  return results;
}

function normalizeRecord(slug, raw, modelDir) {
  // Map CHARACTER_PROFILE.json / MASTER.json fields to the shape
  // data-connectors.js normalizeCharacterRecord() expects
  const physical = raw.physical || {};
  const acts = raw.acts || raw.content?.acts || {};
  const aurora = raw.aurora || {};
  const freeones = raw.freeones || {};
  const personality = raw.personality || {};
  const geo = raw.geo || {};
  const aliases = raw.aliases || [];

  return {
    model_slug: slug,
    model_name: raw.trigger_word || raw.character_name || slug.replace(/_/g, ' '),
    character_name: raw.trigger_word || raw.character_name || slug,
    description: raw.bio || null,
    summary: null,

    // Aurora fields
    aurora_tier: aurora.tier || raw.aurora_tier || null,
    aurora_quadrant: aurora.aurora_quadrant || raw.aurora_quadrant || null,
    aurora_confidence_grade: aurora.confidence_grade || raw.aurora_confidence_grade || null,

    // Personality / archetype
    archetype: personality.emotional_archetype || raw.emotional_archetype || null,
    emotional_archetype: personality.emotional_archetype || raw.emotional_archetype || null,
    content_level: raw.content_level || null,
    nsfw_tier: raw.nsfw_tier || null,

    // Physical
    ethnicity: physical.ethnicity || null,
    nationality: physical.nationality || null,
    height_cm: physical.height_cm || null,
    body_type: physical.body_type || null,
    hair_color: physical.hair_color || null,
    eye_color: physical.eye_color || null,
    bra_cup: physical.bra_cup || null,

    // Content metrics
    total_images: raw.source_image_count || acts.total_scenes || null,
    total_scenes: acts.total_scenes || null,
    acts_summary: acts.acts_summary || null,
    acts_list: acts.acts_list || null,

    // Meta
    aliases: Array.isArray(aliases) ? aliases : (aliases ? [aliases] : []),
    profession: raw.profession?.primary || raw.profession_primary || null,
    career_status: freeones.career_status || null,
    dob: freeones.dob || null,
    continent: geo.continent || null,
    arc_key: raw.arc_key || personality.arc_key || null,

    // Identity — ensure arrays stay as arrays (some files store as space-joined strings)
    identity_tags: Array.isArray(raw.identity_tags) ? raw.identity_tags : (raw.identity_tags ? String(raw.identity_tags).split(' ') : []),
    visual_anchors: Array.isArray(raw.visual_anchors) ? raw.visual_anchors : [],
    face_generation_tags: Array.isArray(raw.face_generation_tags) ? raw.face_generation_tags : (raw.face_generation_tags ? String(raw.face_generation_tags).split(', ') : []),
    confidence: raw.confidence || null,

    // Paths
    model_directory: modelDir,
    source: 'scraped_models_filesystem',
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${DEFAULT_PORT}`);

  // CORS — allow the dashboard (file:// and localhost origins)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const pathname = url.pathname;

  // Health check
  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      server: 'scraped-models-server',
      port: DEFAULT_PORT,
      repo_metadata: repoMetadata,
      schema_metadata: {
        schema_id: ccsCharacterSchema.schema_id,
        schema_version: ccsCharacterSchema.version,
      },
    }));
    return;
  }

  // Characters endpoint — /characters or /api/models/characters
  if (pathname === '/characters' || pathname === '/api/models/characters') {
    const rootDir = url.searchParams.get('root') || DEFAULT_ROOT;
    const limit = parseInt(url.searchParams.get('limit') || '500', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const all = loadCharacters(rootDir);
    const page = all.slice(offset, offset + limit);

    res.writeHead(200);
    res.end(JSON.stringify({
      characters: page,
      total: all.length,
      limit,
      offset,
      source: 'scraped_models_filesystem',
      root: rootDir,
      repo_metadata: repoMetadata,
      schema_metadata: {
        schema_id: ccsCharacterSchema.schema_id,
        schema_version: ccsCharacterSchema.version,
      },
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found', path: pathname }));
});

const PORT = parseInt(process.env.SCRAPED_MODELS_PORT || DEFAULT_PORT, 10);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[scraped-models-server] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[scraped-models-server] Default root: ${DEFAULT_ROOT}`);
  console.log(`[scraped-models-server] Endpoints: /characters  /api/models/characters  /health`);
});

server.on('error', (err) => {
  console.error('[scraped-models-server] Error:', err.message);
});
