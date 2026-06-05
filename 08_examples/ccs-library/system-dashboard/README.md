# MetaChromatic — Claude Design Root

> Design playground for the 04-Prism / MetaChromatic system.
> Source of truth for visual design, prototypes, and component explorations.
> Production engineering lives in `kas1987/Image-Prism`.

---

## What this is

This Claude project contains all interactive HTML prototypes, design explorations, and
visual references for the MetaChromatic character network system. Files here are built
with plain HTML + inline React/Babel — zero build step, open any `.html` in a browser.

It is **not** the production app. When a design is ready to ship, components are lifted
into `Image-Prism/apps/metachromatic` as TypeScript + Tailwind by Claude.

---

## Design Files

| File | Description |
|---|---|
| [`Prism Hero Card.html`](./Prism%20Hero%20Card.html) | Full hero: 3D prism, character rail, network graph, metadata HUD |
| [`browser/Browser.html`](./browser/Browser.html) | Character library browser with filters, detail panel, profile view |
| [`System Dashboard.html`](./System%20Dashboard.html) | Psychometric analytics dashboard with live data connectors |
| [`Character Profile.html`](./Character%20Profile.html) | Deep-dive character profile — all metadata panels |

---

## How to view

Open any `.html` file directly in a browser — no server or build needed.

For the dashboard with mock data streaming:
```bash
cd apps/prism-dashboard
npm install
npm start
# → http://localhost:3001/System Dashboard.html
```

---

## Design → Production sync

**Tokens:** `apps/metachromatic/src/chromatic/tokens/variables.css`
is imported here as the canonical reference. Re-import when production tokens change:

```
Image-Prism → apps/metachromatic/src/chromatic/tokens/variables.css
           → (import into this Claude project)
           → Claude reads and applies to new designs
```

**Component lift:** Tell Claude which prototype screen to lift.
Claude produces TypeScript + Tailwind output matching Image-Prism conventions
(`@prism/app-contracts` types, Zustand stores, glass utility classes).

---

## Folder structure

```
claude-design/              ← this project
├── CLAUDE.md               ← persistent rules for Claude
├── README.md               ← this file
│
├── Prism Hero Card.html    ← hero prototype
├── browser/                ← character library browser
├── hero/                   ← hero sub-scripts (JS + CSS)
├── dashboard/              ← dashboard card registry + theme
│
├── apps/
│   └── metachromatic/
│       └── src/chromatic/tokens/
│           └── variables.css   ← production token reference
│
└── screenshots/            ← design captures (not for production)
```

---

## Production stack reference

| Layer | Tech |
|---|---|
| Shell | Electron + React 18 + Vite |
| State | Zustand |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| Packages | pnpm 10.28.2 |
| Shared | `@prism/chromatic`, `@prism/fx`, `@prism/metadata-engine`, `@prism/app-contracts` |
| Repo | `kas1987/Image-Prism` → `apps/metachromatic` |

---

*Part of the 04-Prism system. See `kas1987/04-Prism` for the parent workspace.*
