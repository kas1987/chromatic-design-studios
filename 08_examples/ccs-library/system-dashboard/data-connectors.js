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
    }, config);
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

  _emit() {
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
      profile:    this._profile,
    };
    this._dispatch(payload);
  }

  // Dispatch incoming payload to channels ───────────────────────────────────

  _dispatch(payload) {
    this.bus.emit('raw', payload);
    if (payload.type === 'full_update' || payload.metrics)    this.bus.emit('metrics',    payload.metrics);
    if (payload.type === 'full_update' || payload.big_five)   this.bus.emit('big_five',   payload.big_five);
    if (payload.type === 'full_update' || payload.motivation) this.bus.emit('motivation', payload.motivation);
    if (payload.type === 'full_update' || payload.values)     this.bus.emit('values',     payload.values);
    if (payload.type === 'full_update' || payload.radar)      this.bus.emit('radar',      payload.radar);
    if (payload.type === 'full_update' || payload.emotional)  this.bus.emit('emotional',  payload.emotional);
    if (payload.type === 'full_update' || payload.cognitive)  this.bus.emit('cognitive',  payload.cognitive);
    if (payload.type === 'full_update' || payload.stress)     this.bus.emit('stress',     payload.stress);
    if (payload.type === 'full_update' || payload.anomalies)  this.bus.emit('anomalies',  payload.anomalies);
    if (payload.type === 'full_update' || payload.system)     this.bus.emit('system',     payload.system);
    if (payload.type === 'full_update' || payload.profile)    this.bus.emit('profile',    payload.profile);
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

// Default mock connector
ConnectorRegistry.register('primary', new DataConnector({ source: 'mock', mockInterval: 4000 }));

window.DataConnector = DataConnector;
window.ConnectorRegistry = ConnectorRegistry;
