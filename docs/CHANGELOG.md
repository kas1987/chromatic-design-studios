# Changelog

All notable changes to Chromatic Design Studios are recorded here. Versions follow [SemVer](https://semver.org/) lightly: breaking token changes are major, additive components are minor, fixes are patch.

## v1.0.0-rc+1 — Wave A Bridge (2026-06-21, commit 693184b)

**Shipped the cross-repo bridge that pairs CDS with the ComfyUI-Harness Stash media library.**

### Added

- `@chromatic/stash-client` package — typed GraphQL client for Stash (`:9999`)
  with a 24-image deterministic mock fallback. `createStashClientOrMock()` probes
  the URL with a 1s timeout and returns the mock when unreachable, so `/generated`
  always renders and dev never blocks on Stash.
- `/generated` route in `apps/web/src/app/generated/` — paginated image grid with
  tag filtering, rating / newest / title sorting, copy-prompt button per card, and
  workflow-id provenance for cross-repo traceability. Live vs Demo data badge in
  the nav reflects the real Stash state.
- `Generated` nav entry added to all platform routes (landing, `/components`,
  `/tokens`, `/examples`, `/playground`) for consistency.

### Fixed

- `packages/agent` test suite: REPO_ROOT resolution + cwd handling so the CLI
  smoke tests pass when invoked via `npm --workspaces` (which changes cwd to each
  package). 7/7 pass from any cwd.

### Tests

- 5 new vitest cases for `GeneratedGrid`. **107/107 total across 5 workspaces**
  (web 41, agent 7, ui 7, stash-client 8, tokens 44). Build: 16 routes
  prerendered; `/generated` ships at 1.39 kB. Typecheck: clean.

### Cross-references

- Documents the joint roadmap to becoming a Claude Design–class resource
  platform: `docs/research/comfyui-harness-cds-joint-swot-2026-06-21.md`.
- Next: merge `feat/visual-asset-registry` on the ComfyUI-Harness side to
  align the Stash GraphQL schema with the asset-registry JSON Schema
  (tracked in `BRANCH_HYGIENE.md`).

## v0.4.0 — Platform Surface — 2026-06-21

**Shipped the public-facing surface of the platform.**

### Added
- `/components` — token-driven component index grouped by Form / Layout / Display / Feedback / Navigation. Lists 21 components with status, category, and description.
- `/tokens` — interactive token explorer covering color ramps (primary violet, accent cyan, semantic), 8px spacing scale, typography scale, and glow / motion primitives.
- `/examples` — gallery of 10 production-grade page patterns (hero, dashboard, settings, auth, blog, e-com, empty state, error, mobile shell, pricing) with status badges.
- `/playground` — live token-tuning playground. Sliders drive `--color-primary-*` CSS vars at runtime, with HSL→hex shader mirroring the canonical violet ramp.
- Global primary nav (Components / Tokens / Examples / Playground / Studio) in `apps/web/src/app/layout.tsx`.
- `docs/research/chromatic-design-studios-swot-2026-06-21.md` — full SWOT + 90-day roadmap artifact.
- `docs/CHANGELOG.md` (this file).

### Changed
- `apps/web/src/app/page.tsx` rewritten as a proper landing page with surface grid, differentiator row, and CTA pair.
- `CHROMATIC_TREES.md` `Scaffold Tree` annotated with the new route additions.
- `.agents/handoffs/latest.json` refreshed to 2026-06-21.

### Infrastructure
- Beads: fresh local Dolt DB (`chromatic_design_studios`, prefix `cds-*`); 5 wave epics queued.

## v0.3.0 — Token-Driven Web — 2026-06-05

- Token pipeline: `scripts/build-tokens.mjs` compiles JSON → CSS vars + Tailwind theme.
- `apps/web` wired to tokens + typography fonts; build green.
- `packages/ui` token-driven `Hero` component implementing `03_components/hero-component.md`.
- `scripts/chromatic-token-studio.mjs` — live token tuning → write-back bridge.
- `next 15.5.19` upgrade via dependabot.

## v0.2.0 — Build & QA — 2026-05-22

- CSS library skeleton (base, layout, components, effects).
- Claude Design bridge prompt.
- OpenArt layered asset prompts.
- Hero component spec (formal markdown).
- Design QA checklist, demo hero page, packaging.

## v0.1.0 — Foundation — 2026-05-08

- Brand manifest and visual language.
- 6 design token files (color, color.light, spacing, typography, motion, glow).
- Governance playbooks (GO mode, confidence gate, model routing).
- Monorepo scaffold (apps/web, apps/api, apps/worker; packages/*; services/*).
- `docker-compose.chromatic.yml` for the local AI service mesh.
- CI green: typecheck, lint, unit tests, Playwright E2E.
