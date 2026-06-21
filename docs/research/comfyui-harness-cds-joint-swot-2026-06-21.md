# ComfyUI-Harness + Chromatic Design Studios — Joint SWOT & Claude Design–class Expansion Plan

**Author:** Claude (minimax-m3)
**Date:** 2026-06-21
**Scope:** `E:\ComfyUI-Harness` (REPO-COMFY, production lab) and `E:\chromatic-design-studios` (CDS, v1.0.0-rc, front-end resource platform)
**Reading order:** Read CDS `PROJECT_STATE.md` and ComfyUI-Harness `REPO_STATUS.md` / `COMFYUI_INTEGRATION_MAP.md` first.

---

## 0. TL;DR

Both repos are unusually mature for their tier: CDS just shipped a v1.0.0-rc with 21 components, real npm packaging, an agent render path, and 5 example routes; ComfyUI-Harness has a working governance, registry, ledger, scoring, Stash integration, and 4 active feat branches. The gap to "Claude Design class" is **not engineering** — it's **distribution surface and content density**. Specifically: a public docs site, public npm publish, ComfyUI asset packs as first-class CDS resources, and a marketing layer that signals "this is the place for image+video front-end resources" to outsiders.

Recommended 90-day push:
1. **Wave A (W1-2):** ComfyUI assets surface in CDS — promote `05_OUTPUTS/ranked/` to a `/generated` resource route backed by Stash GraphQL.
2. **Wave B (W3-5):** First 3 ComfyUI resource packs — "Zelex Portrait Pack", "Stash Indexer Pack", "Mastery Loop Pack" — each as a CDS-installable npm + a CDS gallery entry.
3. **Wave C (W6-8):** Public launch — Nextra docs site at chromaticstudios.dev, public npm scope, marketing landing.
4. **Wave D (W9-12):** Video lane — fold `feat/video-pipeline-lane` into the platform with its own gallery and tutorial pages.

---

## 1. ComfyUI-Harness (REPO-COMFY) — current state

**Role:** Production lab for ComfyUI workflows, models, prompt matrices, run ledgers, and scored outputs. Governance-bridged into chromatic-harness-v2.

### What is real and working
- 10+ workflows registered in `01_WORKFLOWS/` with `workflow_registry.yaml` (active, external_ref, legacy_p2 tiers)
- `run_matrix.py` + `run_matrix_sequential.py` execute and ledger-batch ComfyUI queues
- 6-dimension scoring (`matrix_config.yaml`): prompt adherence / aesthetic / face detail / composition / technical / user preference
- Review Hub ingest writes to `D:\.000_AI\AI_REVIEW_HUB\db\image_review_scores.sqlite`
- Stash integration (`c842721`): sidecar metadata, GraphQL at `:9999`, ranked output sync
- Golden Seed Mastery Loop (`a468cba`): `mastery_db`, `mastery_loop`, `mastery_mcp` — closed-loop grading
- 24 test files in `tests/` covering matrix, scoring, ledger, ingest, lineage, vision
- 4 active feat branches off `main`:
  - `feat/visual-asset-registry` (asset registry + provenance)
  - `feat/portfolio-token-economy` (finance/forecasting framework)
  - `feat/video-pipeline-lane` (video scaffold)
  - plus 7 more in remotes (drift-scanner, control-plane-telemetry, governance-beads, etc.)
- Portfolio trace IDs: `REPO-COMFY:run:<run_id>`

### What is thin
- Branch hygiene — 11 remote feature branches, several stale; `backup/quarantine-2026-06-02` and `feat/comftyui-alias-normalize` need a decision
- No public surface at all (this is a backend, that's correct)
- `CHANGELOG.md` last touched 2026-05-24 — drift from feat branches
- `04_RUNS` / `06_RESULTS` are E: data (correct) but no first-class read API for CDS to consume
- `02_MODELS/comfy_paths.yaml` (per `COMFYUI_INTEGRATION_MAP.md`) is the integration contract — but no versioned schema for it

---

## 2. Chromatic Design Studios (CDS) — current state

**Role:** Front-end resource platform. Token-driven, agent-readable, locally runnable.

### What is real and working (v1.0.0-rc, 2026-06-21)
- 6 token files (color, color.light, spacing, typography, motion, glow) — `scripts/build-tokens.mjs` → CSS vars + Tailwind theme
- 21 components in `packages/ui` grouped Form / Layout / Display / Feedback / Navigation
- `@chromatic/tokens` published structure: ESM/CJS dual exports, TypeScript types, Tailwind preset, Figma Tokens export, Style Dictionary compatibility (`packages/tokens/scripts/build.mjs`)
- `chromatic-ui` CLI: `init`, `add`, `list`, `tokens`, `doctor` subcommands (shadcn-overlay copy-paste model)
- `chromatic-agent` CLI: `render`, `list`, `check` — confidence-gated spec → TSX
- 3 starter agent-renderable specs: Button, Card, Badge (`03_components/`)
- 5 example routes: `/examples/dashboard`, `/examples/auth`, `/examples/empty-state`, `/examples/error-page`, `/examples/pricing`
- 15 routes prerendered, 94 unit + 13 E2E green
- Local-first: `docker-compose.chromatic.yml` ships LiteLLM, n8n, Open WebUI, ComfyUI, Ollama
- Beads (`bd`) is local — 239 issues, Dolt DB

### What is thin (relative to Claude Design ambition)
- **No public docs site** — current `apps/web` is the dev surface, not a marketing/docs site
- **Light theme exists as tokens but isn't wired into the UI** (still dark-first only)
- **`chromatic-ui add`** is single-component copy-paste — no "pack" concept (the 3 design packs promised by shadcn-overlay decision weren't all built out)
- **Zero video/animated content** — all examples are static
- **Handoff file stale** (was 23 days, may be refreshed by today's work)
- **No public npm publish** — package.json is real, but the registry is private/local
- **No inbound links / SEO surface** — single landing page

---

## 3. Joint SWOT

### Strengths
| | Evidence |
|---|---|
| **Real artifacts everywhere** | 21 components shipped, 10 workflows registered, 24 test files, 94 unit + 13 E2E green. No "scaffold-only" repos. |
| **Agent-readable end-to-end** | Component specs = prompts. Token JSON = single source of truth. Stash sidecars + `chromatic-agent render` close the loop. |
| **Local-first mesh** | ComfyUI + LiteLLM + Ollama + n8n + Open WebUI ship via `docker-compose.chromatic.yml`. ComfyUI-Harness runtime hub at `D:\.000_AI\ComfyUI`. |
| **Governance maturity** | chromatic-harness-v2 control plane, beads issue tracking, portfolio trace IDs, REPO_STATUS, run ledgers. |
| **Closed loops already in place** | Golden Seed Mastery Loop (`a468cba`), review-hub ingest, scoring with 6 dimensions, recency tie-break. |
| **Token + Tailwind + npm packaging** | Real `dist/`, `css/`, `tailwind/`, `figma/`, `styledictionary/` outputs. CLI is copy-paste shadcn-overlay. |

### Weaknesses
| | Evidence |
|---|---|
| **Branch drift on ComfyUI-Harness** | 11 remote feat branches, 2 quarantine/alias branches, no merge cadence visible since 2026-05-25. |
| **Stale changelog** | CDS `CHANGELOG.md` exists, ComfyUI-Harness `CHANGELOG.md` last touched 2026-05-24 — but `c842721` (Stash), `a468cba` (Mastery Loop), `4b6a455` (seed intelligence) all shipped later without entries. |
| **No public surface** | No docs site, no public npm, no marketing layer. Inside the chromatic-harness-v2 git org, invisible to outside. |
| **Stale memory drift** | Auto-memory was at v0.3.0 (5/30 components) when reality is v1.0.0-rc (21+ shipped). This is exactly the kind of "manifest defense" failure GOL rule 3 warns about. |
| **Light theme half-built** | `tokens.colors.light.json` exists; not consumed by `apps/web`. |
| **ComfyUI assets not surfaced as CDS resources** | `05_OUTPUTS/ranked/` and Stash exist; CDS has no `/generated` route. The two repos don't yet talk to each other at the user level. |

### Opportunities
| | Evidence |
|---|---|
| **Image + Video resource platform slot is empty** | Claude Design is text-component focused. No first-class competitor covers ComfyUI workflows / Stash media / LoRA cards as browseable resources. |
| **Stash is the bridge** | Stash GraphQL at `:9999` is already in place; CDS can build a `/generated` route that paginates Stash and links back to ComfyUI-Harness manifests. |
| **`@chromatic/tokens` is multi-target** | CSS + Tailwind + Figma + Style Dictionary + npm — that's 4 distribution channels from one source. |
| **Agent render path is unique** | `chromatic-agent render <spec.md>` is not a thing in any other design system. Marketing differentiator. |
| **Local-first is on-trend** | Anthropic, Vercel, Linear all emphasize local dev. CDS Docker mesh is ahead of most design systems. |
| **`feat/video-pipeline-lane` is real** | Video branch exists — if it lands, CDS becomes "image + video" resource platform, which is materially bigger than just "design system". |

### Threats
| | Evidence |
|---|---|
| **shadcn/ui is the default** | New designers reflexively type `npx shadcn@latest add button`. CDS has to win the *next* click, not the first. |
| **No distribution = no signal** | Without public docs, public npm, and external links, Google and humans can't find CDS. |
| **Solo operator bus factor** | All evidence points to a single owner (kas1987). Velocity looks high but it's a single point of failure. |
| **ComfyUI version churn** | ComfyUI breaks workflows on every major node update; if `01_WORKFLOWS/*.graph.json` drift, the matrix stops running. |
| **AI-generated asset licensing** | ComfyUI outputs may have IP/NSFW issues at scale; `01_brand/` and `05_prompts/` need a clear posture or risk takedowns. |
| **Memory drift across repos** | The 23-day-old handoff file in CDS is the canary — if handoffs go stale, the whole chromatic-harness-v2 control plane degrades. |

---

## 4. Claude Design–class expansion: what that actually means

Claude Design wins on three things:
1. **Browseable surface** — every component, token, pattern is reachable from a global nav and indexed.
2. **Copy-paste install** — `npx ...` is one terminal command, and the file lands in your repo.
3. **Agent-readable from the inside** — specs are LLM-consumable, the playground exposes live state, the agent render path is a first-class feature.

CDS already has 2/3 (`chromatic-ui add`, `chromatic-agent render`). The browseable surface exists in dev (`/components`, `/tokens`, `/examples`) but **not in production**. That's the gap.

The image/video angle is the differentiator no one else has. Claude Design does not have:
- A `/generated` page of real ComfyUI outputs
- A `/packs` route with "Zelex Portrait Pack" / "Mastery Loop Pack" — installable ComfyUI workflows + prompts + models
- A `/video` route tying into `feat/video-pipeline-lane`
- A Stash-backed media library (only Stash itself has this; CDS could embed it)

---

## 5. Recommended 90-day plan

### Wave A — Joint Bridge (Weeks 1-2)
**Goal:** CDS consumes ComfyUI-Harness outputs as first-class resources.

- Add `/generated` route to `apps/web` reading from Stash GraphQL
- Sidebar nav entry: Generated (with badge showing image count)
- Beads: `cds-*` issues for "Stash client", "image card component", "media grid"
- ComfyUI-Harness: a thin HTTP API at `/outputs/recent` reading `05_OUTPUTS/ranked/`
- **Done when:** `npm run dev:web` shows ≥20 generated images on `/generated` filtered by Stash tags

### Wave B — First 3 Resource Packs (Weeks 3-5)
**Goal:** Ship the "ComfyUI Resource Pack" concept — installable workflows + prompts + models.

- `chromatic-ui add --pack zelex-portrait` → drops `workflows/zelex_t2i_four_prompt.v1.graph.json` + `prompts/zelex.yaml` + `models/zelex.lora` (symlink or download ref)
- 3 packs: Zelex Portrait (T2I), Stash Indexer (utility), Mastery Loop (closed-loop grading harness)
- Beads: per-pack epic
- ComfyUI-Harness: `pack_registry.yaml` with pack → workflow_ids[] mapping
- **Done when:** A user can `npx chromatic-ui@latest add zelex-portrait` and have everything wired

### Wave C — Public Launch (Weeks 6-8)
**Goal:** CDS is on the open internet as a Claude Design–class resource platform.

- Nextra docs site at `apps/docs` (or migrate `apps/web` to Nextra hybrid)
- Public npm scope decision: `@chromatic/tokens` on public npmjs (the prior memory flagged this as still open — recommend public)
- Marketing landing page with: image pack hero, "Image + Video Resource Platform" tagline, 5 example screenshots, "Built for Claude Code" badge
- `apps/web/src/app/page.tsx` already has the surface grid — promote that to the docs site
- **Done when:** `chromaticstudios.dev` (or chosen domain) is live, npm package is `npm view @chromatic/tokens` accessible, lighthouse ≥ 90

### Wave D — Video Lane (Weeks 9-12)
**Goal:** CDS becomes image + video, not just image.

- Land `feat/video-pipeline-lane` from ComfyUI-Harness to main
- New `/video` route in CDS: video component gallery (Looping, Scrub, HoverPreview, etc.)
- New `/examples/video-*` route
- Beads: `cds-video-*` epic
- **Done when:** Video components and one end-to-end example (e.g., "ComfyUI → AnimateDiff → Stash → CDS video card") work locally

---

## 6. Three open decisions (revised from prior SWOT)

| Decision | Old recommendation | Updated recommendation | Why |
|----------|-------------------|------------------------|-----|
| shadcn overlay | Yes | **Yes (confirmed — already shipped)** | No change. `chromatic-ui add` is shadcn-overlay; works. |
| npm publish scope | Public npm | **Public npm** | Distribution is the #1 blocker; private is invisible. |
| Docs stack | Nextra | **Nextra** | `apps/web` is already Next.js 15; Nextra is the lowest-friction path. |
| **NEW:** ComfyUI-Harness branch policy | n/a | **Squash-merge with auto-delete; weekly branch hygiene sweep** | 11 remote feat branches is drift. |
| **NEW:** ComfyUI-Harness → CDS bridge | n/a | **Stash GraphQL first, then thin HTTP API** | Stash is already up; let CDS consume it before adding another surface. |
| **NEW:** Marketing site vs docs site | n/a | **Single Nextra site with /docs and /examples sections** | Don't split into two apps. |

---

## 7. What this is NOT

- Not a "we should rebuild" — the engineering is done; the gap is distribution.
- Not a "vs shadcn" — shadcn-overlay is the right model; the question is what CDS ships *on top* of that.
- Not a "wait for v2" — v1.0.0-rc is the right time to ship the marketing surface; that's when external people can use it.

---

## 8. Quick wins (this week)

- [ ] ComfyUI-Harness: bump `CHANGELOG.md` to cover `c842721`, `a468cba`, `4b6a455`, and the 4 active feat branches
- [ ] ComfyUI-Harness: branch hygiene pass — close/merge/delete stale remotes
- [ ] CDS: wire `tokens.colors.light.json` into dark/light toggle (already token-defined, just not consumed)
- [ ] CDS: file beads `cds-bridge-*` for the Stash GraphQL client
- [ ] CDS: refresh `.agents/handoffs/latest.json` (or remove it as the source of truth and use bd handoffs)
- [ ] Both: open a shared "image-video-resource-platform" epic in chromatic-harness-v2 control plane
