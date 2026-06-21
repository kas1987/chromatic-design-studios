# Project State

## Current Objective
Ship Chromatic Design Studios as a dedicated front-end resource platform (v1.0.0).

## Status
- Wave 1 (Foundation) — **COMPLETE**
- Wave 2 (Build) — **COMPLETE**
- Wave 3 (QA + Demo) — **COMPLETE**
- Wave 4 (Scaffold) — **COMPLETE** (v0.3.0 shipped 2026-06-05)
- Wave 5 (Platform Surface) — **COMPLETE** (v0.4.0 shipped 2026-06-21)
- Wave 6 (Component Library) — **COMPLETE** (v0.5.0 shipped 2026-06-21)
- Wave 7 (Token Packaging + CLI Distribution) — **COMPLETE** (v0.5.0 shipped 2026-06-21)
  - ✅ `@chromatic/tokens` real npm package: ESM/CJS dual exports, TypeScript types, Tailwind preset, Figma Tokens export, Style Dictionary compatibility
  - ✅ Build pipeline (`packages/tokens/scripts/build.mjs`) emits dist/, css/, tailwind/, figma/, styledictionary/
  - ✅ `chromatic-ui` CLI: init, add, list, tokens, doctor subcommands (shadcn-overlay copy-paste model)
  - ✅ Templates: index.ts barrel + 23 component .tsx files in `packages/cli/templates/`
  - ✅ CLI tests: 7/7 pass
- Wave 8 (Agent Render Path) — **COMPLETE** (v0.5.0 shipped 2026-06-21)
  - ✅ `chromatic-agent` CLI: render, list, check subcommands
  - ✅ Spec-as-source-of-truth: parses `03_components/*.md` markdown specs
  - ✅ Confidence gate: only renderable components with templates emit TSX
  - ✅ 3 starter component specs: Button, Card, Badge with corresponding TSX templates
  - ✅ Agent tests: 7/7 pass
- Wave 9 (Examples Gallery + Marketing Polish + v1.0.0) — **COMPLETE** (v1.0.0 ship candidate)
  - ✅ 5 fully-rendered example routes: /examples/dashboard, /auth, /empty-state, /error-page, /pricing
  - ✅ Real components exercising Table, Avatar, Progress, Tooltip, Toggle, Kbd, Sheet, etc.
  - ✅ /examples index shows 5 shipped + 5 draft patterns with global nav across all 5 platform routes
  - ✅ Build: 15 routes prerendered; typecheck green
  - ✅ Tests: 44 tokens + 36 web + 7 CLI + 7 agent = **94 unit + 13 E2E all green**
  - ✅ Pushed to origin/Main

## Version
v1.0.0-rc (platform release candidate — all 5 waves complete)

## Last Updated
2026-06-21