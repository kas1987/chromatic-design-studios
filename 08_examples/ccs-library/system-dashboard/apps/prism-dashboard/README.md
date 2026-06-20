# Prism Dashboard

> Psychometric analytics dashboard with live data connectors — drop-in, zero build step.

---

## Quick Start

```bash
cd apps/prism-dashboard
npm install
npm start
# → http://localhost:3001/System Dashboard.html
```

Or open `System Dashboard.html` directly in any browser — no server needed for mock data mode.

---

## File Structure

```text
apps/prism-dashboard/
├── System Dashboard.html   # Main UI — all charts, panels, layout
├── data-connectors.js      # Middleware: Mock / REST / WebSocket / SSE
├── tweaks-panel.jsx        # In-page design controls (toggle via toolbar)
├── package.json            # serve script
└── README.md               # This file
```

Legacy layering (imported old app):

```text
apps/prism-dashboard/legacy/prism_3d_psychometric_app/
```

Run it from the same workspace:

```bash
cd apps/prism-dashboard
npm run legacy:install
npm run legacy:dev
```

The legacy app is now wired to live Prism telemetry via:

```text
legacy/prism_3d_psychometric_app/src/data/liveProfileAdapter.js
```

It auto-uses a real psychometric endpoint when present, otherwise derives deterministic live profile data from Ollama/ComfyUI/Storyboard/TTS service state.

## Canonical 3D Engine

The canonical Prism 3D DSSM node engine now lives in:

```text
codex-ccs/src/components/PrismaticVeil/
```

Use this legacy app as a comparison/prototype lane, not the primary maintained route.

From repo root:

```bash
pnpm run prism:canon     # canonical route in codex-ccs
pnpm run prism:legacy    # legacy prototype app
pnpm run prism:compare   # launch both (5173 + 5174)
```

---

## Wiring a Live Backend

Open `data-connectors.js` and replace the bottom registry entry:

This dashboard now supports a built-in `prism_local` source that auto-pulls local runtime telemetry from Ollama + ComfyUI + optional Storyboard/TTS APIs.

```js
ConnectorRegistry.register('primary', new DataConnector({
  source: 'prism_local',
  pollInterval: 4000
}));
```

In `prism_local` mode:

- System/KPI sections are driven by real local service state.
- Psychometric sections are computed deterministically from live telemetry.
- If a real psychometric payload endpoint exists, it is auto-consumed and overrides computed values.
- Character nodes are merged from real local MetaChromatic-compatible sources when available:
  - Seed Scout: `http://127.0.0.1:9883/characters?limit=500`
  - Storyboard characters: `{storyboard_api}/api/storyboard/characters`
  - Storyboard voice catalog: `{storyboard_api}/api/storyboard/voices`
- The character stream normalizes those sources into a DerivedCharacter-compatible roster for the dashboard UI.

```js
// ── Default (mock) ────────────────────────────────
ConnectorRegistry.register('primary', new DataConnector({ source: 'mock' }));

// ── WebSocket (replace above with this) ───────────
ConnectorRegistry.register('primary', new DataConnector({
  source: 'websocket',
  url: 'wss://your-api.com/stream',
  auth: { token: 'Bearer eyJ...' }
}));

// ── REST polling (replace above with this) ────────
ConnectorRegistry.register('primary', new DataConnector({
  source: 'rest',
  url: 'https://your-api.com/metrics',
  headers: { 'X-Team-ID': 'prism-alpha' },
  pollInterval: 5000   // ms
}));

// ── Server-Sent Events (replace above with this) ──
ConnectorRegistry.register('primary', new DataConnector({
  source: 'sse',
  url: 'https://your-api.com/events'
}));
```

If the live endpoint is unreachable, the connector **automatically falls back to mock data** — the dashboard never goes blank.

---

## Expected Payload Shape

Your backend should emit JSON in this shape (all fields optional — omit any you don't have):

```json
{
  "type": "full_update",
  "ts": 1714300000000,
  "metrics": {
    "overall_index":       { "value": 87, "label": "Very High", "spark": [82,85,88,87,...] },
    "psychometric_fit":    { "value": 92, "label": "Excellent",  "spark": [...] },
    "emotional_stability": { "value": 76, "label": "High",       "spark": [...] },
    "cognitive_agility":   { "value": 88, "label": "Very High",  "spark": [...] },
    "behavioral_risk":     { "value": 28, "label": "Low",        "spark": [...] },
    "data_confidence":     { "value": 94, "label": "Very High",  "spark": [...] }
  },
  "big_five": {
    "Openness": 82, "Conscientiousness": 91,
    "Extraversion": 68, "Agreeableness": 74, "Neuroticism": 34
  },
  "motivation": {
    "score": 85,
    "drivers": [
      { "label": "Achievement", "value": 92 },
      { "label": "Growth",      "value": 88 }
    ]
  },
  "values": {
    "score": 78,
    "items": [{ "label": "Integrity", "value": 92 }]
  },
  "radar": {
    "individual": [76, 82, 68, 74, 91, 88],
    "population":  [65, 70, 72, 68, 70, 71]
  },
  "emotional": {
    "labels":    ["Apr 1", "Apr 2", "..."],
    "positive":  [62, 65, 60, ...],
    "negative":  [28, 30, 25, ...],
    "stability": [74, 72, 76, ...]
  },
  "cognitive": {
    "overall": 88,
    "items": [{ "label": "Memory", "value": 92 }]
  },
  "stress": [
    { "label": "Stress Tolerance",   "value": 78 },
    { "label": "Recovery Rate",       "value": 82 },
    { "label": "Pressure Handling",   "value": 74 },
    { "label": "Change Adaptability", "value": 81 }
  ],
  "anomalies": {
    "count": 3,
    "items": ["Anomaly description 1", "Anomaly description 2"]
  },
  "system": {
    "ai_models_active": "8/8",
    "analysis_queue": 12,
    "last_sync": "2m ago",
    "data_integrity": "98.8%",
    "total_profiles": 2548,
    "avg_confidence": 91
  },
  "profile": {
    "name": "Aria Chen",
    "title": "The Architect",
    "id": "PR-2041",
    "avatar_color": "#7c5cfc",
    "gender": "F",
    "age": 29,
    "rank": "A+",
    "summary": "Systems thinker with exceptional pattern recognition."
  },
  "characters": [
    {
      "slug": "serena",
      "displayName": "Serena",
      "title": "Narrator",
      "voicePreset": "Serena",
      "tone": "intimate",
      "archetype": "Narrator",
      "nationality": null,
      "ethnicity": null,
      "profession": null,
      "taxonomyLevel": null,
      "suggestedArc": null,
      "loraNameHint": "serena.safetensors",
      "imageCount": 0,
      "personality": "Warm, intimate narrator who speaks directly to the user.",
      "metadataSources": ["storyboard_voices"]
    }
  ]
}
```

### CCS Metadata Contract (always attached)

For CCS webhook/webnode interoperability, `repo_metadata` and `schema_metadata` are always attached under `payload.metadata` by the connector middleware.

```json
{
  "metadata": {
    "repo_metadata": {
      "repo": {
        "name": "04-Prism",
        "owner": "kas1987",
        "current_branch": "main",
        "default_branch": "main"
      },
      "system": {
        "name": "CCS",
        "metadata_contract": "ccs-character-metadata-spec.v1",
        "metadata_contract_version": "1.0.0"
      }
    },
    "schema_metadata": {
      "schema_id": "ccs-character-metadata-spec.v1",
      "schema_version": "1.0.0",
      "schema_path": "apps/prism-dashboard/ccs-character-metadata-spec.v1.json"
    }
  }
}
```

Canonical files:
- `apps/prism-dashboard/ccs-repo-metadata.json`
- `apps/prism-dashboard/ccs-character-metadata-spec.v1.json`

You can also emit **partial updates** — only include the channels that changed:
```json
{ "type": "partial", "metrics": { "behavioral_risk": { "value": 31, "label": "Low" } } }
```

---

## Subscribing to Specific Channels

In your own JS you can subscribe to individual data streams:

```js
const connector = ConnectorRegistry.get('primary');

connector.subscribe('metrics',   data => console.log('metrics', data));
connector.subscribe('anomalies', data => console.log('anomalies', data));
connector.subscribe('profile',   data => console.log('profile', data));
connector.subscribe('raw',       data => console.log('raw payload', data));
connector.subscribe('error',     e    => console.warn('connector error', e));

connector.connect();
```

---

## Tweaks Panel

Click **Tweaks** in the toolbar (top-right) to open in-page controls:

| Tweak | What it does |
|---|---|
| Data Source | Switch between mock / rest / websocket |
| Update Interval | How often data refreshes (ms) |
| Accent Color | Primary purple highlight color |
| Show Sparklines | Toggle mini charts on metric cards |
| Chart Fill | gradient / solid / minimal |

All changes persist to disk automatically.

---

## Integration with Existing Prism Apps

To embed the dashboard inside the MetaChromatic Electron shell, add an iframe:

```html
<webview src="./apps/prism-dashboard/System Dashboard.html" style="width:100%;height:100%;" />
```

Or in React:
```jsx
<iframe
  src="/apps/prism-dashboard/System Dashboard.html"
  style={{ width: '100%', height: '100%', border: 'none' }}
  title="Prism Analytics Dashboard"
/>
```

---

## Scripts

```bash
npm start   # Serve on http://localhost:3001
npm run dev # Same as start
npm run open # Serve + auto-open browser (macOS)
```

---

*Part of the 04-Prism system. See root README.md for full project context.*
