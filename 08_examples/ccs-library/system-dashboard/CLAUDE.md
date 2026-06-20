# Claude Design Root — MetaChromatic / 04-Prism

This Claude project is the **design playground** for the MetaChromatic / 04-Prism system.
It is NOT the production app. Production lives in `kas1987/Image-Prism` → `apps/metachromatic`.

---

## Ground Rules

- **Never invent tokens.** All colors, spacing, radii, glass variants, and font stacks
  must come from `apps/metachromatic/src/chromatic/tokens/variables.css` (imported here).
  Do not use hex values that aren't in that file unless explicitly asked.

- **Font stack (mandatory):**
  - Display / hero titles → `'Fraunces Variable', Georgia, serif`
  - UI / body → `'Geist', system-ui, sans-serif`
  - Mono / data → `'JetBrains Mono', Consolas, monospace`
  - Load via CDN: `@fontsource-variable/fraunces`, `@fontsource/geist`

- **Canonical accent colors (from variables.css):**
  ```
  --chromatic-cyan:    #2de2e6
  --chromatic-magenta: #c77dff
  --chromatic-indigo:  #4f6bff
  --chromatic-teal:    #00f5d4
  --chromatic-violet:  #7b61ff
  --chromatic-pink:    #ec4899
  --chromatic-orange:  #fb923c
  ```

- **Aurora tier colors:**
  ```
  LEGACY    → #c77dff  (--chromatic-magenta)
  ELITE     → #a855f7  (--aurora-elite)
  AURORA    → #fbbf24  (amber — from --level-5)
  PRISM     → #2de2e6  (--chromatic-cyan)
  NOVA      → #00f5d4  (--chromatic-teal)
  STANDARD  → #6366f1  (--aurora-standard)
  ```

- **Glass system (match production classes from glass.css):**
  - Plane A — deepest panels → `glass-a` (`rgba(18,22,28,.82)`, blur 8px)
  - Plane B — workspace panels → `glass-b` (`rgba(18,22,28,.62)`, blur 16px)
  - Plane C — floating surfaces → `glass-c` (`rgba(18,22,28,.45)`, blur 24px)
  - Token vars: `--glass-bg` + `--glass-border` + `--glass-shadow` + `--glass-blur`

- **Background void:** `--void: #0a0a0f` / `--bg-obsidian: #070a12`

- **Spacing scale:** `--spacing-8` (8px) · `--spacing-12` (12px) · `--spacing-16` (16px)

- **Motion:** 150–200ms transitions. Respect `prefers-reduced-motion`. No decorative motion.

- **No emoji** in UI — placeholders or SVG icons only.

---

## Production Stack (for lift-to-prod handoffs)

| Layer | Technology |
|---|---|
| Shell | Electron + React 18 + Vite + Zustand |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| Package manager | pnpm 10.28.2 |
| Shared packages | `@prism/chromatic`, `@prism/fx`, `@prism/metadata-engine`, `@prism/app-contracts` |
| Monorepo root | `kas1987/Image-Prism` |

When producing lift-to-prod code: TypeScript, named exports, no inline styles, use
`@prism/app-contracts` for data shapes, Zustand for state. Match the glass utility classes.

---

## MetaChromatic Taxonomy

### Aurora Tiers (ordered)
LEGACY → ELITE → AURORA → PRISM → NOVA → STANDARD

### Metadata Family Keys
`identity` · `physical` · `aurora` · `face` · `assets` · `content` · `arc`

### Character Schema (from ccs-character-metadata-spec.v1)
Canonical sections and required fields per the live spec:

```
identity        → model_slug, display_name, trigger_word
personal_career → age, born, birthplace, nationality, ethnicity, sexuality, profession_primary
physical        → ethnicity, hair_color, eye_color, body_type, height_cm, weight_kg,
                  bra_cup, cup_letter, boobs, bust, waist, hips, pubic_hair
aurora          → quadrant, tier, confidence_grade,
                  score_overall, score_face, score_body, score_whr, score_symmetry, score_skin
face            → face_shape, jaw, cheekbones, nose, lips, brows, eyes, facial_thirds,
                  raw_geometry, face_generation_tags
assets          → cover_image, profile_thumb, canonical_face, gallery_sample,
                  local_image_count, local_image_paths
content_nsfw    → content_level, nsfw_tier, content, acts, tags, has_video, has_vr
lora_generation → trained, lora_path, checkpoint_step, base_checkpoint,
                  training_date, quality_score, recommended_strength
stats_social    → rating_score, votes, favorited, gallery_count, instagram, twitter, onlyfans
```

### Normalized DB Tables
`models` · `model_physical` · `model_personal` · `model_career` · `model_face`
`model_aurora` · `model_assets` · `model_content` · `model_lora` · `model_stats`
`model_social` · `model_aliases` · `model_links` · `model_personality`

### Frontend Display Layers
`card_view` · `profile_header` · `stats_strip` · `physical_panel`
`generation_panel` · `content_panel` · `face_panel`

### Prism Geometry → Archetype Map
```
Octahedron   → Strategist  (LEGACY,  cyan)
Tetrahedron  → Smuggler    (ELITE,   magenta)
Icosahedron  → Healer      (AURORA,  amber/gold)
Torus-knot   → Shadow      (PRISM,   violet)
Dodecahedron → Oracle      (NOVA,    teal)
Sphere       → Mirror      (STANDARD, indigo)
Diamond      → Guardian    (AURORA,  pink)
```

---

## Design Files in This Project

| File | What it is |
|---|---|
| `Prism Hero Card.html` | Full-page hero — prism + character network + HUD |
| `browser/Browser.html` | MetaChromatic character library browser |
| `System Dashboard.html` | Psychometric analytics dashboard (local design copy) |
| `apps/prism-dashboard/System Dashboard.html` | Synced from repo — latest production build |
| `apps/prism-dashboard/data-connectors.js` | Live data middleware (mock/REST/WS/SSE) |
| `apps/prism-dashboard/ccs-character-metadata-spec.v1.json` | **Canonical character schema** |
| `Character Profile.html` | Character deep-dive profile view |
| `hero/` | Hero sub-scripts: metaprism.js, network.js, hud.js, hero.css |
| `browser/` | Browser sub-scripts and data |
| `dashboard/` | Dashboard card registry + theme |

## Token Files (synced from Image-Prism)

| File | What it is |
|---|---|
| `apps/metachromatic/src/chromatic/tokens/variables.css` | **Source of truth** — all CSS vars |
| `apps/metachromatic/src/chromatic/tokens/glass.css` | Glass plane system (A/B/C) |
| `apps/metachromatic/src/chromatic/tokens/modes.css` | Mode gradient overrides |
| `apps/metachromatic/src/chromatic/tokens/radiance.css` | Glow + radiance effects |
| `apps/metachromatic/src/chromatic/tokens/vibrant.css` | Vibrant color utilities |
| `apps/metachromatic/src/chromatic/tokens/tailwind-metachromatic.js` | Tailwind config for prod |

---

## Sync Protocol

This project is the **source of truth for design**. Production is the source of truth for
engineering conventions. When syncing:

1. Token drift → re-import `variables.css` from `kas1987/Image-Prism`
2. Component lift → I produce TypeScript + Tailwind output matching Image-Prism conventions
3. Never copy production components INTO this project (risk of import loops)
4. Screenshots go in `screenshots/` — not committed to production repo

---

## What NOT to Do

- Do not use `Inter`, `Roboto`, `Arial`, or `system-ui` as a primary font
- Do not invent colors outside the chromatic palette
- Do not add gradient backgrounds as the primary design treatment
- Do not use rounded-corner cards with left-border accent (AI slop pattern)
- Do not use emoji as iconography
- Do not reference production `src/` paths in HTML artifacts (they won't resolve)
