/**
 * DATA CONNECTOR MIDDLEWARE
 * Plug in real endpoints by replacing mock sources with live ones.
 * Each connector supports: REST, WebSocket, SSE, or Mock (fallback).
 *
 * Usage:
 *   const dc = new DataConnector({ source: 'mock' });
 *   dc.subscribe('metrics', (data) => { ... });
 *   dc.connect();
 *
 * To wire a real backend:
 *   const dc = new DataConnector({
 *     source: 'websocket',
 *     url: 'wss://your-api.com/stream',
 *     auth: { token: 'Bearer ...' }
 *   });
 */

class EventBus {
  constructor() { this._listeners = {}; }
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(f => f !== fn);
  }
  emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
    (this._listeners['*'] || []).forEach(fn => fn({ event, data }));
  }
}

// Canonical CCS repo metadata contract for all webhook/webnode payloads.
const CCS_REPO_METADATA = Object.freeze({
  repo: {
    name: '04-Prism',
    owner: 'kas1987',
    current_branch: 'main',
    default_branch: 'main',
  },
  system: {
    name: 'CCS',
    metadata_contract: 'ccs-character-metadata-spec.v1',
    metadata_contract_version: '1.0.0',
  },
  governance: {
    always_attach_to: ['webhooks', 'webnodes', 'connector_full_update_payloads', 'scraped_models_server_responses'],
    as_of: '2026-04-28',
  },
});

const CCS_SCHEMA_METADATA = Object.freeze({
  schema_id: 'ccs-character-metadata-spec.v1',
  schema_version: '1.0.0',
  schema_path: 'apps/prism-dashboard/ccs-character-metadata-spec.v1.json',
});

function enrichWithCcsMetadata(payload = {}) {
  const currentMetadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {};
  return {
    ...payload,
    metadata: {
      ...currentMetadata,
      repo_metadata: CCS_REPO_METADATA,
      schema_metadata: CCS_SCHEMA_METADATA,
    },
  };
}

// Canonical backend lane contract mirrored from @prism/app-contracts.
const PRISM_BACKEND_LANES = {
  storyboard_api: {
    id: 'storyboard_api',
    defaultPort: 5000,
    viteEnvKey: 'VITE_STORYBOARD_API_URL',
    nodeEnvKey: 'STORYBOARD_API_URL',
  },
  tts_clone: {
    id: 'tts_clone',
    defaultPort: 8765,
    viteEnvKey: 'VITE_TTS_CLONE_URL',
    nodeEnvKey: 'TTS_CLONE_URL',
  },
  ollama: {
    id: 'ollama',
    defaultPort: 11434,
    viteEnvKey: 'VITE_OLLAMA_URL',
    nodeEnvKey: 'OLLAMA_URL',
  },
  comfyui: {
    id: 'comfyui',
    defaultPort: 8188,
    viteEnvKey: 'VITE_COMFYUI_URL',
    nodeEnvKey: 'COMFYUI_URL',
  },
};

function normalizeUrl(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed ? trimmed.replace(/\/$/, '') : '';
}

function readRuntimeEnvValue(key) {
  const env = (typeof window !== 'undefined' && window.__PRISM_ENV__) ||
              (typeof window !== 'undefined' && window.__POLYCHROMATIC_ENV__) ||
              null;
  const candidate = env && typeof env === 'object' ? env[key] : undefined;
  return typeof candidate === 'string' ? candidate : '';
}

function resolveBackendBaseUrl(serviceId, overrides = {}) {
  const lane = PRISM_BACKEND_LANES[serviceId];
  if (!lane) return '';

  const directOverride = normalizeUrl(overrides[serviceId]);
  if (directOverride) return directOverride;

  const globalUrls = (typeof window !== 'undefined' && window.__PRISM_BACKEND_URLS__) ||
                     (typeof window !== 'undefined' && window.__POLYCHROMATIC_BACKEND_URLS__) ||
                     {};
  const globalOverride = normalizeUrl(globalUrls[serviceId]);
  if (globalOverride) return globalOverride;

  const viteValue = normalizeUrl(readRuntimeEnvValue(lane.viteEnvKey));
  if (viteValue) return viteValue;

  const nodeValue = normalizeUrl(readRuntimeEnvValue(lane.nodeEnvKey));
  if (nodeValue) return nodeValue;

  return `http://127.0.0.1:${lane.defaultPort}`;
}

function buildPrismLocalEndpoints(overrides = {}) {
  const storyboardBase = resolveBackendBaseUrl('storyboard_api', overrides);
  const ttsBase = resolveBackendBaseUrl('tts_clone', overrides);
  const ollamaBase = resolveBackendBaseUrl('ollama', overrides);
  const comfyBase = resolveBackendBaseUrl('comfyui', overrides);
  const seedBase = normalizeUrl(overrides.seed_scout || overrides.seedScout || overrides.seed_api) || 'http://127.0.0.1:9883';
  const scrapedModelsRoot = overrides.scraped_models_root || overrides.scrapedModelsRoot || 'E:/scraped_models';

  return {
    ollamaVersion: `${ollamaBase}/api/version`,
    ollamaTags: `${ollamaBase}/api/tags`,
    ollamaRunning: `${ollamaBase}/api/ps`,
    comfyStats: `${comfyBase}/system_stats`,
    comfyQueue: `${comfyBase}/queue`,
    storyboardHealthCandidates: [
      `${storyboardBase}/api/storyboard/health`,
      `${storyboardBase}/api/health`,
      `${storyboardBase}/health`,
    ],
    ttsHealthCandidates: [
      `${ttsBase}/v1/health`,
      `${ttsBase}/health`,
    ],
    psychometricCandidates: [
      `${storyboardBase}/api/personality/psychometric`,
      'http://127.0.0.1:3000/api/personality/psychometric',
      'http://127.0.0.1:43123/api/personality/psychometric',
      '/api/personality/psychometric',
    ],
    seedCharactersCandidates: [
      `${seedBase}/characters?limit=500`,
      `${seedBase}/characters?limit=500&root=${encodeURIComponent(scrapedModelsRoot)}`,
      `${seedBase}/characters?limit=500&scraped_root=${encodeURIComponent(scrapedModelsRoot)}`,
      '/api/seed/characters?limit=500',
    ],
    characterCatalogCandidates: [
      `${storyboardBase}/api/storyboard/characters`,
      `${storyboardBase}/api/characters?per_page=100`,
      'http://127.0.0.1:43123/api/storyboard/characters',
      'http://127.0.0.1:5000/api/storyboard/characters',
      'http://127.0.0.1:5000/api/characters?per_page=100',
    ],
    voiceCatalogCandidates: [
      `${storyboardBase}/api/storyboard/voices`,
      'http://127.0.0.1:5000/api/storyboard/voices',
    ],
    scrapedModelsCharactersCandidates: [
      `${storyboardBase}/api/storyboard/characters/scraped?limit=500`,
      `http://127.0.0.1:43123/api/models/characters?limit=500&root=${encodeURIComponent(scrapedModelsRoot)}`,
      `http://127.0.0.1:9883/characters?limit=500&root=${encodeURIComponent(scrapedModelsRoot)}`,
      '/api/models/characters?limit=500',
    ],
    dbMetadataCandidates: [
      `${storyboardBase}/api/storyboard/metadata/sources`,
      `http://127.0.0.1:43123/api/models/metadata/sources?root=${encodeURIComponent(scrapedModelsRoot)}`,
      '/api/models/metadata/sources',
    ],
    scrapedModelsRoot,
  };
}

function toTitleCase(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function stableColorFromSlug(slug = '') {
  const palette = ['#7c5cfc', '#22d3ee', '#10d98a', '#f59e0b', '#f43f5e', '#a855f7'];
  const sum = String(slug).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[sum % palette.length];
}

function normalizeCharacterSlug(raw = {}) {
  return String(raw.slug || raw.model_slug || raw.name || raw.id || raw.display_name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function normalizeCharacterRecord(raw = {}, source = 'unknown') {
  const slug = normalizeCharacterSlug(raw);
  if (!slug) return null;

  const displayName =
    raw.displayName ||
    raw.display_name ||
    raw.model_name ||
    raw.name ||
    toTitleCase(slug);

  const voicePreset = raw.voicePreset || raw.voice_preset || raw.voice_id || raw.qwenPreset || '';
  const personality =
    raw.personality ||
    raw.summary ||
    raw.description ||
    raw.tagline ||
    raw.generatedBackstory ||
    '';
  const archetype =
    raw.personalityArchetype ||
    raw.aurora_archetype ||
    raw.archetype ||
    raw.title ||
    '';
  const tone = raw.tone || raw.vocalStyle || raw.voiceStyle || '';
  const imageCount = Number(raw.total_images ?? raw.images ?? raw.image_count ?? 0) || 0;

  return {
    slug,
    displayName: String(displayName),
    title: archetype ? String(archetype) : (tone ? toTitleCase(tone) : 'Character Node'),
    source,
    metadataSources: [source],
    voicePreset: voicePreset ? String(voicePreset) : '',
    voiceProvider: raw.voiceProvider || raw.voice_provider || null,
    tone: tone ? String(tone) : '',
    archetype: archetype ? String(archetype) : '',
    nationality: raw.nationality || raw.origin || raw.personal?.nationality || null,
    ethnicity: raw.ethnicity || raw.personal?.ethnicity || null,
    profession: raw.profession || raw.career?.profession || null,
    taxonomyLevel: raw.suggestedTaxonomyLevel || raw.nsfwLevel || raw.content_level || null,
    suggestedArc: raw.suggestedArc || raw.arc || raw.relationship_arc_template || null,
    loraNameHint: raw.loraNameHint || raw.lora_name_hint || `${slug}.safetensors`,
    imageCount,
    personality: String(personality),
    metadata: raw,
    avatarColor: stableColorFromSlug(slug),
  };
}

function extractCharacterArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.characters)) return payload.characters;
  if (Array.isArray(payload.models)) return payload.models;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (payload.data && Array.isArray(payload.data.characters)) return payload.data.characters;
  if (payload.data && Array.isArray(payload.data.models)) return payload.data.models;
  return [];
}

function mergeCharacterRosters(...sources) {
  const merged = new Map();
  for (const source of sources) {
    const list = extractCharacterArray(source.payload);
    for (const raw of list) {
      const normalized = normalizeCharacterRecord(raw, source.name);
      if (!normalized) continue;
      const existing = merged.get(normalized.slug);
      if (!existing) {
        merged.set(normalized.slug, normalized);
        continue;
      }
      merged.set(normalized.slug, {
        ...existing,
        ...Object.fromEntries(
          Object.entries(normalized).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        ),
        imageCount: Math.max(existing.imageCount || 0, normalized.imageCount || 0),
        personality: existing.personality || normalized.personality,
        metadataSources: [...new Set([...(existing.metadataSources || []), ...(normalized.metadataSources || [])])],
        metadata: {
          ...(existing.metadata || {}),
          [source.name]: raw,
        },
      });
    }
  }
  return [...merged.values()].sort((a, b) => {
    if ((b.imageCount || 0) !== (a.imageCount || 0)) return (b.imageCount || 0) - (a.imageCount || 0);
    return a.displayName.localeCompare(b.displayName);
  });
}

function characterToProfile(character, fallbackProfile) {
  if (!character) return fallbackProfile;
  const seed = character.slug.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return {
    name: character.displayName,
    title: character.title || character.archetype || 'MetaChromatic Character',
    id: character.slug,
    avatar_color: character.avatarColor || stableColorFromSlug(character.slug),
    gender: character.metadata?.gender || 'F',
    age: character.metadata?.age || (24 + (seed % 14)),
    rank: character.archetype || character.metadata?.rank || (character.imageCount > 1000 ? 'S' : 'A'),
    summary:
      character.personality ||
      [
        character.ethnicity || character.nationality,
        character.profession,
        character.voicePreset ? `voice ${character.voicePreset}` : '',
      ].filter(Boolean).join(' · ') ||
      'MetaChromatic character node with live metadata.',
  };
}

function generateMockCharacters() {
  return [
    normalizeCharacterRecord({
      slug: 'serena',
      display_name: 'Serena',
      archetype: 'Narrator',
      tone: 'intimate',
      voice_id: 'Serena',
      personality: 'Warm, intimate narrator who speaks directly to the user.',
      total_images: 0,
    }, 'mock_storyboard'),
    normalizeCharacterRecord({
      slug: 'jade',
      display_name: 'Jade',
      archetype: 'Dominant Narrator',
      tone: 'dominant',
      voice_id: 'Ono_anna',
      personality: 'Commanding narrator with precise, controlled delivery.',
      total_images: 0,
    }, 'mock_storyboard'),
    normalizeCharacterRecord({
      slug: 'mira_kestrel',
      display_name: 'Mira Kestrel',
      archetype: 'Navigator',
      tone: 'guarded',
      voice_id: 'Vivian',
      personality: 'Curious, adaptive character profile used for live-stage testing.',
      total_images: 240,
    }, 'mock_metachromatic'),
  ].filter(Boolean);
}

// ─── Mock data generators ───────────────────────────────────────────────────

function jitter(val, range = 3) {
  return Math.max(0, Math.min(100, val + (Math.random() - 0.5) * range * 2));
}

function sparkline(base, len = 20, variance = 8) {
  const pts = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = Math.max(5, Math.min(99, v + (Math.random() - 0.5) * variance));
    pts.push(Math.round(v));
  }
  return pts;
}

function generateProfile() {
  const profiles = [
    { name: 'Aria Chen', title: 'The Architect', id: 'PR-2041',
      avatar_color: '#7c3aed', gender: 'F', age: 29, rank: 'A+',
      summary: 'Systems thinker with exceptional pattern recognition. Operates with surgical precision under ambiguity. Natural at building scalable frameworks.' },
    { name: 'Marcus Webb', title: 'The Catalyst', id: 'PR-1887',
      avatar_color: '#0891b2', gender: 'M', age: 34, rank: 'S',
      summary: 'High-energy executor who transforms vision into motion. Strong social capital and adaptive communication. Thrives under pressure.' },
    { name: 'Nadia Osei', title: 'The Empath', id: 'PR-3312',
      avatar_color: '#059669', gender: 'F', age: 27, rank: 'A',
      summary: 'Deep emotional intelligence with strong ethical framework. Exceptional team cohesion builder. Predictive of group dynamics.' },
  ];
  return profiles[Math.floor(Math.random() * profiles.length)];
}

function generateMetrics() {
  return {
    overall_index:      { value: Math.round(jitter(87, 4)), label: 'Very High', spark: sparkline(87) },
    psychometric_fit:   { value: Math.round(jitter(92, 3)), label: 'Excellent',  spark: sparkline(92) },
    emotional_stability:{ value: Math.round(jitter(76, 5)), label: 'High',       spark: sparkline(76) },
    cognitive_agility:  { value: Math.round(jitter(88, 4)), label: 'Very High',  spark: sparkline(88) },
    behavioral_risk:    { value: Math.round(jitter(28, 6)), label: 'Low',        spark: sparkline(28) },
    data_confidence:    { value: Math.round(jitter(94, 2)), label: 'Very High',  spark: sparkline(94) },
  };
}

function generateBigFive() {
  return {
    Openness:          Math.round(jitter(82, 5)),
    Conscientiousness: Math.round(jitter(91, 3)),
    Extraversion:      Math.round(jitter(68, 6)),
    Agreeableness:     Math.round(jitter(74, 4)),
    Neuroticism:       Math.round(jitter(34, 7)),
  };
}

function generateMotivation() {
  return {
    score: Math.round(jitter(85, 4)),
    drivers: [
      { label: 'Achievement', value: Math.round(jitter(92, 5)) },
      { label: 'Growth',      value: Math.round(jitter(88, 5)) },
      { label: 'Purpose',     value: Math.round(jitter(85, 5)) },
      { label: 'Recognition', value: Math.round(jitter(72, 6)) },
      { label: 'Power',       value: Math.round(jitter(46, 8)) },
      { label: 'Security',    value: Math.round(jitter(38, 7)) },
    ]
  };
}

function generateValues() {
  return {
    score: Math.round(jitter(78, 4)),
    items: [
      { label: 'Integrity',     value: Math.round(jitter(92, 4)) },
      { label: 'Independence',  value: Math.round(jitter(88, 5)) },
      { label: 'Innovation',    value: Math.round(jitter(74, 6)) },
      { label: 'Compassion',    value: Math.round(jitter(68, 7)) },
      { label: 'Stability',     value: Math.round(jitter(52, 8)) },
      { label: 'Tradition',     value: Math.round(jitter(41, 9)) },
    ]
  };
}

function generateRadar() {
  return {
    individual: [
      Math.round(jitter(82,5)), Math.round(jitter(91,4)),
      Math.round(jitter(68,6)), Math.round(jitter(74,5)),
      Math.round(jitter(76,4)), Math.round(jitter(88,3)),
    ],
    population: [65, 70, 72, 68, 65, 71]
  };
}

function generateEmotional() {
  const len = 30;
  const dates = [];
  const now = new Date('2026-04-28');
  for (let i = len - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return {
    labels: dates,
    positive: sparkline(62, len, 10),
    negative: sparkline(28, len, 8),
    stability: sparkline(74, len, 6),
  };
}

function generateCognitive() {
  return {
    overall: Math.round(jitter(88, 4)),
    items: [
      { label: 'Memory',          value: Math.round(jitter(92, 4)) },
      { label: 'Problem Solving', value: Math.round(jitter(89, 5)) },
      { label: 'Abstract Think.', value: Math.round(jitter(91, 4)) },
      { label: 'Creativity',      value: Math.round(jitter(84, 6)) },
      { label: 'Processing Spd',  value: Math.round(jitter(75, 7)) },
    ]
  };
}

function generateStress() {
  return [
    { label: 'Stress Tolerance',  value: Math.round(jitter(78, 5)) },
    { label: 'Recovery Rate',     value: Math.round(jitter(82, 5)) },
    { label: 'Pressure Handling', value: Math.round(jitter(74, 6)) },
    { label: 'Change Adaptability',value: Math.round(jitter(81, 5)) },
  ];
}

function generateAnomalies() {
  const pool = [
    'Inconsistent risk-tolerance responses detected',
    'Elevated stress indicators in high-pressure scenarios',
    'Values alignment drift detected in recent cycle',
    'Motivation score variance above threshold',
    'Emotional baseline shift over 14-day window',
    'Cognitive load asymmetry in abstract reasoning',
  ];
  const count = Math.floor(Math.random() * 3) + 1;
  return {
    count,
    items: pool.sort(() => Math.random() - 0.5).slice(0, count)
  };
}

function generateSystemStatus() {
  return {
    ai_models_active: '8/8',
    analysis_queue: Math.floor(Math.random() * 20) + 5,
    last_sync: Math.floor(Math.random() * 5) + 1 + 'm ago',
    data_integrity: (98 + Math.random() * 1.8).toFixed(1) + '%',
    total_profiles: 2548 + Math.floor(Math.random() * 10),
    assessed: 2132,
    high_risk: 312,
    data_points: '1.2M',
    avg_confidence: Math.round(jitter(91, 2)),
  };
}

// ─── DataConnector class ─────────────────────────────────────────────────────

class DataConnector {
  /**
   * @param {Object} config
   * @param {'mock'|'rest'|'websocket'|'sse'} config.source
   * @param {string} [config.url]          REST/WS/SSE endpoint base URL
   * @param {Object} [config.auth]         e.g. { token: 'Bearer ...' }
   * @param {Object} [config.headers]      additional headers for REST/SSE
   * @param {number} [config.pollInterval] ms between REST polls (default 5000)
   * @param {number} [config.mockInterval] ms between mock ticks (default 3000)
   */
  constructor(config = {}) {
    this.config = Object.assign({
      source: 'mock',
      pollInterval: 5000,
      mockInterval: 3000,
      backendServiceUrls: {},
      localEndpoints: null,
    }, config);
    if (!this.config.localEndpoints) {
      this.config.localEndpoints = buildPrismLocalEndpoints(this.config.backendServiceUrls || {});
    }
    this.bus = new EventBus();
    this._ws = null;
    this._sse = null;
    this._timer = null;
    this._connected = false;
    this._profile = generateProfile();
  }

  // Public API ──────────────────────────────────────────────────────────────

  connect() {
    if (this._connected) return this;
    this._connected = true;
    const { source } = this.config;
    if      (source === 'websocket') this._connectWS();
    else if (source === 'sse')       this._connectSSE();
    else if (source === 'rest')      this._startPoll();
    else if (source === 'prism_local') this._startPrismLocal();
    else                             this._startMock();
    this.bus.emit('status', { connected: true, source });
    return this;
  }

  disconnect() {
    this._connected = false;
    if (this._ws)    { this._ws.close(); this._ws = null; }
    if (this._sse)   { this._sse.close(); this._sse = null; }
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    this.bus.emit('status', { connected: false });
    return this;
  }

  /** @param {string} channel @param {Function} fn @returns unsubscribe fn */
  subscribe(channel, fn) { return this.bus.on(channel, fn); }

  /** Force a single data refresh */
  refresh() { this._emit(); }

  // WebSocket ───────────────────────────────────────────────────────────────

  _connectWS() {
    const { url, auth } = this.config;
    try {
      this._ws = new WebSocket(url);
      this._ws.onopen = () => {
        if (auth?.token) this._ws.send(JSON.stringify({ type: 'auth', token: auth.token }));
        this.bus.emit('status', { connected: true, source: 'websocket' });
      };
      this._ws.onmessage = (e) => {
        try { this._dispatch(JSON.parse(e.data)); } catch(_) {}
      };
      this._ws.onerror = () => { this._fallbackToMock('WebSocket error'); };
      this._ws.onclose = () => { if (this._connected) this._fallbackToMock('WebSocket closed'); };
    } catch(e) { this._fallbackToMock(e.message); }
  }

  // Server-Sent Events ──────────────────────────────────────────────────────

  _connectSSE() {
    const { url } = this.config;
    try {
      this._sse = new EventSource(url);
      this._sse.onmessage = (e) => {
        try { this._dispatch(JSON.parse(e.data)); } catch(_) {}
      };
      this._sse.onerror = () => { this._fallbackToMock('SSE error'); };
    } catch(e) { this._fallbackToMock(e.message); }
  }

  // REST polling ────────────────────────────────────────────────────────────

  _startPoll() {
    const { url, auth, headers = {}, pollInterval } = this.config;
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(auth?.token ? { Authorization: auth.token } : {}),
            ...headers
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        this._dispatch(payload);
      } catch(e) {
        this.bus.emit('error', { message: e.message });
      }
    };
    fetchData();
    this._timer = setInterval(fetchData, pollInterval);
  }

  // Mock data ───────────────────────────────────────────────────────────────

  _startMock() {
    this._emit();
    this._timer = setInterval(() => this._emit(), this.config.mockInterval);
  }

  // Prism local telemetry (real data from local services) ──────────────────

  _startPrismLocal() {
    const endpoints = this.config.localEndpoints || {};
    const getJson = async (url) => {
      try {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    };

    const getFirstJson = async (urls = []) => {
      for (const u of urls) {
        const data = await getJson(u);
        if (data) return data;
      }
      return null;
    };

    const getFirstTruthy = async (urls = []) => {
      for (const u of urls) {
        const data = await getJson(u);
        if (toBool(data)) return data;
      }
      return null;
    };

    const toBool = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      if (typeof obj.ok === 'boolean') return obj.ok;
      if (typeof obj.status === 'string') return /ok|healthy|up/i.test(obj.status);
      return true;
    };

    const collect = async () => {
      const [
        ollamaVersion,
        ollamaTags,
        ollamaRunning,
        comfyStats,
        comfyQueue,
        storyboardHealth,
        ttsHealth,
        psychometricPayload,
        seedCharacters,
        characterCatalog,
        voiceCatalog,
        scrapedModelsCharacters,
        dbMetadata,
      ] = await Promise.all([
        getJson(endpoints.ollamaVersion),
        getJson(endpoints.ollamaTags),
        getJson(endpoints.ollamaRunning),
        getJson(endpoints.comfyStats),
        getJson(endpoints.comfyQueue),
        getFirstTruthy(endpoints.storyboardHealthCandidates || []),
        getFirstTruthy(endpoints.ttsHealthCandidates || []),
        getFirstJson(endpoints.psychometricCandidates),
        getFirstJson(endpoints.seedCharactersCandidates || []),
        getFirstJson(endpoints.characterCatalogCandidates || []),
        getFirstJson(endpoints.voiceCatalogCandidates || []),
        getFirstJson(endpoints.scrapedModelsCharactersCandidates || []),
        getFirstJson(endpoints.dbMetadataCandidates || []),
      ]);

      const runningModels = Array.isArray(ollamaRunning?.models) ? ollamaRunning.models.length : 0;
      const installedModels = Array.isArray(ollamaTags?.models) ? ollamaTags.models.length : 0;
      const queueRunning = Array.isArray(comfyQueue?.queue_running) ? comfyQueue.queue_running.length : 0;
      const queuePending = Array.isArray(comfyQueue?.queue_pending) ? comfyQueue.queue_pending.length : 0;

      const liveSources = [
        !!ollamaVersion,
        !!ollamaTags,
        !!ollamaRunning,
        !!comfyStats,
        !!comfyQueue,
        toBool(storyboardHealth),
        toBool(ttsHealth),
      ].filter(Boolean).length;

      const dataIntegrity = Math.min(99.9, 92 + liveSources * 1.1 + Math.random() * 0.8).toFixed(1) + '%';
      const successPct = Math.round((liveSources / 7) * 100);
      const queueDepth = queueRunning + queuePending;
      const overall = Math.max(45, Math.min(99, 58 + liveSources * 6 - Math.min(queueDepth, 20)));
      const fit = Math.max(50, Math.min(99, 62 + liveSources * 5));
      const stability = Math.max(40, Math.min(99, 75 - Math.min(queueDepth, 30)));
      const agility = Math.max(45, Math.min(99, 55 + liveSources * 6));
      const risk = Math.max(5, Math.min(95, 100 - successPct + Math.min(queueDepth, 20)));
      const confidence = Math.max(35, Math.min(99, Math.round(parseFloat(dataIntegrity))));

      const liveMetrics = {
        overall_index: { value: overall, label: overall >= 85 ? 'Very High' : overall >= 70 ? 'High' : 'Moderate', spark: sparkline(overall, 20, 4) },
        psychometric_fit: { value: fit, label: fit >= 90 ? 'Excellent' : fit >= 75 ? 'High' : 'Moderate', spark: sparkline(fit, 20, 4) },
        emotional_stability: { value: stability, label: stability >= 80 ? 'Very High' : stability >= 65 ? 'High' : 'Moderate', spark: sparkline(stability, 20, 5) },
        cognitive_agility: { value: agility, label: agility >= 85 ? 'Very High' : agility >= 70 ? 'High' : 'Moderate', spark: sparkline(agility, 20, 4) },
        behavioral_risk: { value: risk, label: risk <= 30 ? 'Low' : risk <= 60 ? 'Moderate' : 'High', spark: sparkline(risk, 20, 6) },
        data_confidence: { value: confidence, label: confidence >= 90 ? 'Very High' : confidence >= 75 ? 'High' : 'Moderate', spark: sparkline(confidence, 20, 3) },
      };

      const modelSeed = installedModels + runningModels * 3 + liveSources * 5;
      const bfOpenness = Math.max(35, Math.min(95, 55 + installedModels * 2 + liveSources * 2));
      const bfConscientiousness = Math.max(35, Math.min(95, 62 + liveSources * 3 - Math.min(queueDepth, 12)));
      const bfExtraversion = Math.max(25, Math.min(90, 40 + runningModels * 10 + liveSources * 2));
      const bfAgreeableness = Math.max(30, Math.min(95, 50 + liveSources * 3));
      const bfNeuroticism = Math.max(8, Math.min(92, 68 - liveSources * 5 + Math.min(queueDepth, 18)));

      const liveBigFive = {
        Openness: Math.round(bfOpenness),
        Conscientiousness: Math.round(bfConscientiousness),
        Extraversion: Math.round(bfExtraversion),
        Agreeableness: Math.round(bfAgreeableness),
        Neuroticism: Math.round(bfNeuroticism),
      };

      const liveMotivation = {
        score: Math.round((liveBigFive.Openness + liveBigFive.Conscientiousness + (100 - liveBigFive.Neuroticism)) / 3),
        drivers: [
          { label: 'Achievement', value: Math.round(Math.min(99, 45 + liveBigFive.Conscientiousness * 0.55)) },
          { label: 'Growth', value: Math.round(Math.min(99, 42 + liveBigFive.Openness * 0.6)) },
          { label: 'Purpose', value: Math.round(Math.min(99, 40 + successPct * 0.5)) },
          { label: 'Recognition', value: Math.round(Math.min(99, 30 + runningModels * 8 + liveSources * 3)) },
          { label: 'Power', value: Math.round(Math.min(99, 20 + queueRunning * 10 + liveSources * 4)) },
          { label: 'Security', value: Math.round(Math.max(10, 90 - queueDepth * 2)) },
        ],
      };

      const liveValues = {
        score: Math.round((liveBigFive.Agreeableness + liveBigFive.Conscientiousness + successPct) / 3),
        items: [
          { label: 'Integrity', value: Math.round(Math.min(99, 45 + liveBigFive.Conscientiousness * 0.55)) },
          { label: 'Independence', value: Math.round(Math.min(99, 30 + liveBigFive.Openness * 0.65)) },
          { label: 'Innovation', value: Math.round(Math.min(99, 25 + liveBigFive.Openness * 0.7)) },
          { label: 'Compassion', value: Math.round(Math.min(99, 28 + liveBigFive.Agreeableness * 0.62)) },
          { label: 'Stability', value: Math.round(Math.max(10, 95 - queueDepth * 2)) },
          { label: 'Tradition', value: Math.round(Math.max(5, 75 - liveBigFive.Openness * 0.4)) },
        ],
      };

      const liveRadar = {
        individual: [
          Math.round((liveBigFive.Openness + liveMetrics.emotional_stability.value) / 2),
          liveBigFive.Conscientiousness,
          liveBigFive.Extraversion,
          liveBigFive.Agreeableness,
          liveMetrics.emotional_stability.value,
          liveMetrics.cognitive_agility.value,
        ],
        population: [65, 70, 72, 68, 70, 71],
      };

      const now = new Date();
      const labels = [];
      const positive = [];
      const negative = [];
      const stabilitySeries = [];
      for (let i = 29; i >= 0; i -= 1) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const swing = ((modelSeed + i) % 9) - 4;
        positive.push(Math.max(10, Math.min(99, 45 + successPct * 0.45 + swing)));
        negative.push(Math.max(5, Math.min(90, 60 - successPct * 0.35 + Math.abs(swing))));
        stabilitySeries.push(Math.max(10, Math.min(99, 55 + successPct * 0.4 - Math.abs(swing))));
      }
      const liveEmotional = { labels, positive, negative, stability: stabilitySeries };

      const liveCognitive = {
        overall: liveMetrics.cognitive_agility.value,
        items: [
          { label: 'Memory', value: Math.round(Math.min(99, 35 + installedModels * 3 + liveSources * 4)) },
          { label: 'Problem Solving', value: Math.round(Math.min(99, 40 + successPct * 0.5)) },
          { label: 'Abstract Think.', value: Math.round(Math.min(99, 35 + liveBigFive.Openness * 0.65)) },
          { label: 'Creativity', value: Math.round(Math.min(99, 30 + liveBigFive.Openness * 0.7)) },
          { label: 'Processing Spd', value: Math.round(Math.max(12, 95 - queueDepth * 2)) },
        ],
      };

      const liveStress = [
        { label: 'Stress Tolerance', value: Math.round(Math.max(10, 95 - queueDepth * 2)) },
        { label: 'Recovery Rate', value: Math.round(Math.max(12, 92 - queueDepth * 1.7)) },
        { label: 'Pressure Handling', value: Math.round(Math.max(10, 90 - queueDepth * 2.1)) },
        { label: 'Change Adaptability', value: Math.round(Math.min(99, 42 + successPct * 0.52)) },
      ];

      const liveAnomalies = {
        count: liveSources >= 6 ? (queueDepth > 4 ? 2 : 1) : 3,
        items: [
          queueDepth > 0 ? `Comfy queue depth is ${queueDepth}` : 'Comfy queue is idle',
          toBool(storyboardHealth) ? 'Storyboard API healthy' : 'Storyboard API is unreachable',
          toBool(ttsHealth) ? 'TTS API healthy' : 'TTS API is unreachable',
        ],
      };

      const characters = mergeCharacterRosters(
        { name: 'seed_api', payload: seedCharacters },
        { name: 'storyboard_characters', payload: characterCatalog },
        { name: 'storyboard_voices', payload: voiceCatalog },
        { name: 'scraped_models_db', payload: scrapedModelsCharacters }
      );

      const dbRoots = [
        endpoints.scrapedModelsRoot,
        dbMetadata?.scraped_models_root,
        dbMetadata?.models_root,
        dbMetadata?.db_root,
      ].filter(Boolean);

      const liveProfile = (() => {
        if (characters.length > 0) {
          return characterToProfile(characters[0], this._profile);
        }
        const primaryModelName = Array.isArray(ollamaTags?.models) && ollamaTags.models[0]?.name
          ? String(ollamaTags.models[0].name)
          : null;
        if (!primaryModelName) return this._profile;
        const hash = primaryModelName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const names = ['Aurelius Node', 'Lira Velmont', 'Nadia Osei', 'Kael Drake', 'Mira Kestrel'];
        const titles = ['The Strategist', 'The Architect', 'The Catalyst', 'The Analyst', 'The Navigator'];
        const idx = hash % names.length;
        return {
          name: names[idx],
          title: titles[idx],
          id: `PR-${(1000 + (hash % 8000)).toString()}`,
          avatar_color: ['#7c3aed', '#0891b2', '#059669', '#f59e0b', '#a855f7'][idx],
          gender: ['F', 'M', 'F', 'M', 'F'][idx],
          age: 24 + (hash % 14),
          rank: ['A', 'A+', 'S', 'B+', 'S+'][idx],
          summary: `Runtime-derived profile based on active model ${primaryModelName}.`,
        };
      })();

      const payload = {
        type: 'full_update',
        ts: Date.now(),
        metrics: liveMetrics,
        big_five: liveBigFive,
        motivation: liveMotivation,
        values: liveValues,
        radar: liveRadar,
        emotional: liveEmotional,
        cognitive: liveCognitive,
        stress: liveStress,
        anomalies: liveAnomalies,
        system: {
          ai_models_active: `${runningModels}/${Math.max(installedModels, runningModels) || 1}`,
          analysis_queue: queueRunning + queuePending,
          last_sync: 'just now',
          data_integrity: dataIntegrity,
          total_profiles: 2548 + runningModels,
          assessed: 2132 + queueRunning,
          high_risk: Math.max(0, 312 - liveSources),
          data_points: `${(1.2 + installedModels * 0.01).toFixed(1)}M`,
          avg_confidence: Math.round(Math.min(99, 88 + liveSources)),
        },
        characters,
        profile: liveProfile,
        metadata: {
          source: 'prism_local',
          connector_contract: '@prism/app-contracts/backendLanes',
          backend_lanes: Object.values(PRISM_BACKEND_LANES).map((lane) => ({
            id: lane.id,
            viteEnvKey: lane.viteEnvKey,
            nodeEnvKey: lane.nodeEnvKey,
            defaultPort: lane.defaultPort,
            baseUrl: resolveBackendBaseUrl(lane.id, this.config.backendServiceUrls || {}),
          })),
          service_status: {
            storyboard_api: toBool(storyboardHealth) ? 'ok' : 'offline',
            tts_clone: toBool(ttsHealth) ? 'ok' : 'offline',
            ollama: ollamaVersion ? 'ok' : 'offline',
            comfyui: comfyStats ? 'ok' : 'offline',
            seed_api: seedCharacters ? 'ok' : 'offline',
            character_catalog: characters.length > 0 ? 'ok' : 'offline',
            scraped_models_db: scrapedModelsCharacters ? 'ok' : 'offline',
          },
          character_contract: 'MetaChromatic DerivedCharacter-compatible roster',
          character_sources: [...new Set(characters.flatMap((c) => c.metadataSources || []))],
          character_count: characters.length,
          source_priority: ['scraped_models_db', 'seed_api.characters', 'storyboard.catalog', 'voice.catalog', 'psychometric_payload', 'prism_local_telemetry', 'mock_fallback'],
          db_sources: {
            models_db: dbMetadata?.models_db || dbMetadata?.db_path || 'D:/.000_AI/models.db',
            scraped_models: [...new Set(dbRoots)],
            additional_dbs: dbMetadata?.additional_dbs || dbMetadata?.databases || [],
          },
          generated_at: new Date().toISOString(),
        },
      };

      if (psychometricPayload && typeof psychometricPayload === 'object') {
        Object.assign(payload, {
          metrics: psychometricPayload.metrics || payload.metrics,
          big_five: psychometricPayload.big_five || payload.big_five,
          motivation: psychometricPayload.motivation || payload.motivation,
          values: psychometricPayload.values || payload.values,
          radar: psychometricPayload.radar || payload.radar,
          emotional: psychometricPayload.emotional || payload.emotional,
          cognitive: psychometricPayload.cognitive || payload.cognitive,
          stress: psychometricPayload.stress || payload.stress,
          anomalies: psychometricPayload.anomalies || payload.anomalies,
          profile: psychometricPayload.profile || payload.profile,
          characters: psychometricPayload.characters || payload.characters,
          system: psychometricPayload.system || payload.system,
          metadata: psychometricPayload.metadata || payload.metadata,
        });
      }

      this._dispatch(payload);
    };

    collect();
    this._timer = setInterval(collect, this.config.pollInterval);
  }

  _emit() {
    const mockCharacters = generateMockCharacters();
    const payload = {
      type: 'full_update',
      ts: Date.now(),
      metrics:    generateMetrics(),
      big_five:   generateBigFive(),
      motivation: generateMotivation(),
      values:     generateValues(),
      radar:      generateRadar(),
      emotional:  generateEmotional(),
      cognitive:  generateCognitive(),
      stress:     generateStress(),
      anomalies:  generateAnomalies(),
      system:     generateSystemStatus(),
      characters: mockCharacters,
      profile:    characterToProfile(mockCharacters[0], this._profile),
      metadata: {
        source: 'mock',
        connector_contract: '@prism/app-contracts/backendLanes',
        backend_lanes: Object.values(PRISM_BACKEND_LANES),
        character_contract: 'MetaChromatic DerivedCharacter-compatible roster',
        character_sources: ['mock_storyboard', 'mock_metachromatic'],
        character_count: 3,
      },
    };
    this._dispatch(payload);
  }

  // Dispatch incoming payload to channels ───────────────────────────────────

  _dispatch(payload) {
    const enriched = enrichWithCcsMetadata(payload);

    this.bus.emit('raw', enriched);
    if (enriched.type === 'full_update' || enriched.metrics)    this.bus.emit('metrics',    enriched.metrics);
    if (enriched.type === 'full_update' || enriched.big_five)   this.bus.emit('big_five',   enriched.big_five);
    if (enriched.type === 'full_update' || enriched.motivation) this.bus.emit('motivation', enriched.motivation);
    if (enriched.type === 'full_update' || enriched.values)     this.bus.emit('values',     enriched.values);
    if (enriched.type === 'full_update' || enriched.radar)      this.bus.emit('radar',      enriched.radar);
    if (enriched.type === 'full_update' || enriched.emotional)  this.bus.emit('emotional',  enriched.emotional);
    if (enriched.type === 'full_update' || enriched.cognitive)  this.bus.emit('cognitive',  enriched.cognitive);
    if (enriched.type === 'full_update' || enriched.stress)     this.bus.emit('stress',     enriched.stress);
    if (enriched.type === 'full_update' || enriched.anomalies)  this.bus.emit('anomalies',  enriched.anomalies);
    if (enriched.type === 'full_update' || enriched.system)     this.bus.emit('system',     enriched.system);
    if (enriched.type === 'full_update' || enriched.profile)    this.bus.emit('profile',    enriched.profile);
    if (enriched.type === 'full_update' || enriched.characters) this.bus.emit('characters', enriched.characters);
    if (enriched.type === 'full_update' || enriched.metadata)   this.bus.emit('metadata',   enriched.metadata);
  }

  _fallbackToMock(reason) {
    console.warn('[DataConnector] Falling back to mock data:', reason);
    this.bus.emit('error', { message: reason, fallback: true });
    this._startMock();
  }
}

// ─── Connector registry ───────────────────────────────────────────────────────

const ConnectorRegistry = {
  _connectors: {},

  /**
   * Register a named connector. Call this to plug in a real data source.
   * @example
   *   ConnectorRegistry.register('live', new DataConnector({
   *     source: 'websocket',
   *     url: 'wss://api.yourapp.com/stream',
   *     auth: { token: 'Bearer eyJ...' }
   *   }));
   */
  register(name, connector) {
    this._connectors[name] = connector;
    return connector;
  },

  get(name) { return this._connectors[name]; },

  /** Connect all registered connectors */
  connectAll() {
    Object.values(this._connectors).forEach(c => c.connect());
  },

  disconnectAll() {
    Object.values(this._connectors).forEach(c => c.disconnect());
  }
};

// Default local-live connector with automatic fallback behavior when services are down
ConnectorRegistry.register('primary', new DataConnector({ source: 'prism_local', pollInterval: 4000, mockInterval: 4000 }));

window.DataConnector = DataConnector;
window.ConnectorRegistry = ConnectorRegistry;
