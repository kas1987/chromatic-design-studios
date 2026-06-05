/**
 * CHARACTER CONNECTOR
 * Separate data connector for the Live Character page.
 * Emits character-specific biometric, threat, voice, and timeline channels.
 *
 * To wire a real backend:
 *   const cc = new CharacterConnector({
 *     source: 'websocket',
 *     url: 'wss://your-api.com/character-stream',
 *     auth: { token: 'Bearer ...' }
 *   });
 */

class CharacterEventBus {
  constructor() { this._l = {}; }
  on(e, fn) { (this._l[e] = this._l[e] || []).push(fn); return () => this.off(e, fn); }
  off(e, fn) { if (this._l[e]) this._l[e] = this._l[e].filter(f => f !== fn); }
  emit(e, d) { (this._l[e] || []).forEach(fn => fn(d)); (this._l['*'] || []).forEach(fn => fn({e,d})); }
}

function rnd(base, range = 4) { return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range * 2)); }
function wave(len = 128) { return Array.from({length: len}, (_, i) => Math.sin(i * 0.18) * 0.4 + (Math.random() - 0.5) * 0.6); }

const CHARACTERS = [
  {
    id: 'PR-2041', name: 'Aria Chen', callsign: 'ARCHITECT',
    rank: 'A+', status: 'ACTIVE', threat_level: 'LOW',
    avatar_hue: 260, // purple
    biometrics: { heart_rate: 68, neural_freq: 42.3, stress_index: 18, cortisol: 0.22, focus: 91, sync_rate: 98.4 },
    scan_zones: {
      head:  { label: 'Neural Core',     metrics: ['IQ Index: 147', 'Pattern Recog: 94%', 'Memory Load: 62%', 'Cognitive Sync: 98%'] },
      chest: { label: 'Cardiac Monitor', metrics: ['HR: 68 bpm', 'HRV: 42ms', 'O₂ Sat: 99%', 'Cardiac Rhythm: Nominal'] },
      core:  { label: 'Core Biometrics', metrics: ['Stress Index: 18', 'Cortisol: 0.22μg/dl', 'Adrenaline: Low', 'Homeostasis: 97%'] },
      larm:  { label: 'Left Neural Path',  metrics: ['Motor Speed: 94ms', 'Reflex Grade: A', 'Neural Density: High', 'Sync: 99.1%'] },
      rarm:  { label: 'Right Neural Path', metrics: ['Motor Speed: 91ms', 'Reflex Grade: A', 'Neural Density: High', 'Sync: 98.7%'] },
      legs:  { label: 'Mobility Index',  metrics: ['Reaction: 188ms', 'Agility Score: 88', 'Endurance: 91%', 'Stability: High'] },
    }
  },
  {
    id: 'PR-1887', name: 'Marcus Webb', callsign: 'CATALYST',
    rank: 'S', status: 'FIELD',  threat_level: 'MODERATE',
    avatar_hue: 200, // cyan
    biometrics: { heart_rate: 84, neural_freq: 38.7, stress_index: 41, cortisol: 0.48, focus: 78, sync_rate: 91.2 },
    scan_zones: {
      head:  { label: 'Neural Core',     metrics: ['IQ Index: 131', 'Pattern Recog: 81%', 'Memory Load: 74%', 'Cognitive Sync: 88%'] },
      chest: { label: 'Cardiac Monitor', metrics: ['HR: 84 bpm', 'HRV: 28ms', 'O₂ Sat: 97%', 'Cardiac Rhythm: Elevated'] },
      core:  { label: 'Core Biometrics', metrics: ['Stress Index: 41', 'Cortisol: 0.48μg/dl', 'Adrenaline: Moderate', 'Homeostasis: 88%'] },
      larm:  { label: 'Left Neural Path',  metrics: ['Motor Speed: 81ms', 'Reflex Grade: A-', 'Neural Density: High', 'Sync: 93.2%'] },
      rarm:  { label: 'Right Neural Path', metrics: ['Motor Speed: 79ms', 'Reflex Grade: A', 'Neural Density: High', 'Sync: 94.1%'] },
      legs:  { label: 'Mobility Index',  metrics: ['Reaction: 162ms', 'Agility Score: 95', 'Endurance: 88%', 'Stability: Very High'] },
    }
  },
  {
    id: 'PR-3312', name: 'Nadia Osei', callsign: 'EMPATH',
    rank: 'A', status: 'STANDBY', threat_level: 'LOW',
    avatar_hue: 160, // green
    biometrics: { heart_rate: 61, neural_freq: 44.1, stress_index: 12, cortisol: 0.18, focus: 94, sync_rate: 99.1 },
    scan_zones: {
      head:  { label: 'Neural Core',     metrics: ['IQ Index: 138', 'Pattern Recog: 89%', 'Memory Load: 44%', 'Cognitive Sync: 99%'] },
      chest: { label: 'Cardiac Monitor', metrics: ['HR: 61 bpm', 'HRV: 58ms', 'O₂ Sat: 99%', 'Cardiac Rhythm: Optimal'] },
      core:  { label: 'Core Biometrics', metrics: ['Stress Index: 12', 'Cortisol: 0.18μg/dl', 'Adrenaline: Minimal', 'Homeostasis: 99%'] },
      larm:  { label: 'Left Neural Path',  metrics: ['Motor Speed: 98ms', 'Reflex Grade: B+', 'Neural Density: Moderate', 'Sync: 97.4%'] },
      rarm:  { label: 'Right Neural Path', metrics: ['Motor Speed: 102ms', 'Reflex Grade: B+', 'Neural Density: Moderate', 'Sync: 96.8%'] },
      legs:  { label: 'Mobility Index',  metrics: ['Reaction: 214ms', 'Agility Score: 72', 'Endurance: 94%', 'Stability: High'] },
    }
  }
];

function liveJitter(char) {
  const b = char.biometrics;
  return {
    heart_rate:   Math.round(rnd(b.heart_rate, 3)),
    neural_freq:  +rnd(b.neural_freq, 0.8).toFixed(1),
    stress_index: Math.round(rnd(b.stress_index, 5)),
    cortisol:     +rnd(b.cortisol * 100, 4).toFixed(0) / 100,
    focus:        Math.round(rnd(b.focus, 3)),
    sync_rate:    +rnd(b.sync_rate, 0.5).toFixed(1),
  };
}

function generateTimeline(char) {
  const events = ['Baseline Capture','Stress Test','Cognitive Probe','Social Sim','Field Debrief','Neural Resync'];
  const now = Date.now();
  return events.map((label, i) => ({
    label,
    ts: now - (5 - i) * 8.6e5,
    score: Math.round(rnd(82, 8)),
    anomaly: Math.random() < 0.15,
  }));
}

class CharacterConnector {
  constructor(config = {}) {
    this.config = Object.assign({ source: 'mock', mockInterval: 2000, characterIndex: 0 }, config);
    this.bus = new CharacterEventBus();
    this._timer = null;
    this._connected = false;
    this._charIdx = this.config.characterIndex % CHARACTERS.length;
    this._ws = null;
    this._sse = null;
  }

  get character() { return CHARACTERS[this._charIdx]; }

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
    if (this._ws)    { this._ws.close();   this._ws = null; }
    if (this._sse)   { this._sse.close();  this._sse = null; }
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    this.bus.emit('status', { connected: false });
  }

  subscribe(channel, fn) { return this.bus.on(channel, fn); }

  switchCharacter(idx) {
    this._charIdx = idx % CHARACTERS.length;
    this._emitFull();
  }

  refresh() { this._emitFull(); }

  _connectWS() {
    try {
      this._ws = new WebSocket(this.config.url);
      this._ws.onmessage = e => { try { this._dispatch(JSON.parse(e.data)); } catch(_) {} };
      this._ws.onerror   = () => this._fallbackToMock('WS error');
      this._ws.onclose   = () => { if (this._connected) this._fallbackToMock('WS closed'); };
    } catch(e) { this._fallbackToMock(e.message); }
  }

  _connectSSE() {
    try {
      this._sse = new EventSource(this.config.url);
      this._sse.onmessage = e => { try { this._dispatch(JSON.parse(e.data)); } catch(_) {} };
      this._sse.onerror   = () => this._fallbackToMock('SSE error');
    } catch(e) { this._fallbackToMock(e.message); }
  }

  _startPoll() {
    const fetchData = async () => {
      try {
        const res = await fetch(this.config.url, { headers: this.config.auth ? { Authorization: this.config.auth.token } : {} });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        this._dispatch(await res.json());
      } catch(e) { this.bus.emit('error', { message: e.message }); }
    };
    fetchData();
    this._timer = setInterval(fetchData, this.config.pollInterval || 3000);
  }

  _startMock() {
    this._emitFull();
    this._timer = setInterval(() => this._emitLive(), this.config.mockInterval);
  }

  _emitFull() {
    const char = this.character;
    this._dispatch({
      type: 'full',
      profile:   char,
      biometrics: liveJitter(char),
      scan_zones: char.scan_zones,
      voice_wave: wave(256),
      timeline:   generateTimeline(char),
      threat: {
        level: char.threat_level,
        score: char.threat_level === 'LOW' ? Math.round(rnd(18,6)) : char.threat_level === 'MODERATE' ? Math.round(rnd(48,8)) : Math.round(rnd(74,6)),
        zones: { head: rnd(20,8), chest: rnd(15,6), core: rnd(25,10), larm: rnd(10,5), rarm: rnd(10,5), legs: rnd(12,6) }
      }
    });
  }

  _emitLive() {
    const char = this.character;
    this._dispatch({
      type: 'live',
      biometrics: liveJitter(char),
      voice_wave: wave(256),
    });
  }

  _dispatch(payload) {
    this.bus.emit('raw', payload);
    if (payload.profile)    this.bus.emit('profile',    payload.profile);
    if (payload.biometrics) this.bus.emit('biometrics', payload.biometrics);
    if (payload.scan_zones) this.bus.emit('scan_zones', payload.scan_zones);
    if (payload.voice_wave) this.bus.emit('voice_wave', payload.voice_wave);
    if (payload.timeline)   this.bus.emit('timeline',   payload.timeline);
    if (payload.threat)     this.bus.emit('threat',     payload.threat);
  }

  _fallbackToMock(reason) {
    console.warn('[CharacterConnector] Falling back to mock:', reason);
    this.bus.emit('error', { message: reason, fallback: true });
    this._startMock();
  }
}

window.CharacterConnector = CharacterConnector;
window.PRISM_CHARACTERS = CHARACTERS;
