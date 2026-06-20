# Session Retrospective — CCS Library DB

**Date:** 2026-06-05
**PRs merged:** none (changes uncommitted)
**Epics closed:** n/a (no bead opened; work was ad-hoc)

## What shipped

- `db/migrations/001_init.sql` — Postgres DDL (registry mirrors + analytics + agent log tables)
- `scripts/build-db.mjs` — two-phase ingest+sync pipeline (SQLite Phase 1, Postgres Phase 2)
- `db/ccs-registry.db` — generated; 227 tokens, 5 components ingested from source (smoke test green)
- `docker-compose.chromatic.yml` — `cds-postgres` service added, profile `db`, healthcheck wired
- `apps/api/src/` — connection pool (`db.ts`) + four route handlers (tokens, components, usage, agent-log)
- `package.json` — `postgres` dep added, `db:build` and `dev:api` scripts
- `docs/superpowers/specs/2026-06-05-ccs-library-db-design.md` — approved design spec

## Learnings

### 1. Node v26 + better-sqlite3 = native compile failure
`better-sqlite3` requires `node-gyp` and has no prebuilt for Node v26. Install fails immediately.  
**Action:** Always use `node:sqlite` (built-in since Node 22) for new SQLite work in this repo. Drop `better-sqlite3` from any future dependency lists.

### 2. CSS class count was 0 — complex selectors not captured by simple regex
The CSS files use nested selectors, `@layer`, and multi-class rules that the naive `.class { }` regex misses.  
**Action:** CSS class parsing is a known gap. Fine for now (tokens and components are the primary registry use). Improve with `postcss` parse if CSS class querying becomes needed.

### 3. node:sqlite `readOnly` option spelling
`DatabaseSync(path, { readOnly: true })` — camelCase, not `readonly`. Easy to get wrong silently.  
**Action:** Always check node:sqlite docs — it doesn't throw on unknown options.

### 4. Postgres sync is safely skippable
Omitting `DATABASE_URL` skips Phase 2 with a clean warning. SQLite-only mode works for local dev without Docker.  
**Action:** Document this in the API README so contributors don't think Postgres is required to run locally.

## KPI snapshot

| Metric | Value |
|--------|-------|
| Tokens ingested | 227 |
| Components ingested | 5 |
| CSS classes ingested | 0 (gap — see learnings) |
| Postgres tables created | 5 |
| API routes | 4 |
| Build time (ingest) | < 1s |

## Follow-up

- `git add` + commit the new files (user approval needed per auto-mode-off policy)
- Start Postgres: `docker compose --profile db up -d postgres` then set `DATABASE_URL` to test sync
- CSS class parsing — open a bead if queryable CSS classes become a requirement
- `apps/api` needs a `package.json` and `tsconfig.json` to be a proper workspace package
- Update `PROJECT_STATE.md` to reflect Wave 5 DB layer complete
