# CCS Library DB — Design Spec
**Date:** 2026-06-05  
**Status:** Approved  
**Version:** 1.0.0

---

## Overview

Two-layer database architecture for the Chromatic Design Studios (CDS) monorepo:

- **SQLite `db/ccs-registry.db`** — static registry, rebuilt from source files on every build. Portable, offline-capable, used by agents and tooling.
- **Postgres `cds-postgres`** — operational layer. Mirrors the registry for fast API queries; stores append-only usage analytics and agent task logs.

`apps/api` reads Postgres exclusively. SQLite is the canonical source; Postgres is populated by the sync script.

---

## Architecture

```
Source files                  Build pipeline               Runtime
──────────────────────────────────────────────────────────────────
02_design_tokens/*.json  ─┐
css-library/*.css        ─┤─ scripts/build-db.mjs ──► db/ccs-registry.db (SQLite)
packages/ui/src/         ─┘           │
                                      │ sync (atomic transaction)
                                      ▼
                               Postgres (cds-postgres :5432)
                               ├── registry_tokens       (mirror, replaced on sync)
                               ├── registry_components   (mirror, replaced on sync)
                               ├── component_usage       (append-only)
                               ├── agent_task_log        (append-only)
                               └── sync_log              (append-only provenance)
                                      │
                               apps/api ◄── single connection pool (DATABASE_URL)
```

**Key invariant:** Registry mirror tables are replaced atomically on each sync. Log tables are never truncated.

---

## SQLite Schema (`db/ccs-registry.db`)

```sql
-- Design tokens, one row per leaf value
CREATE TABLE tokens (
  id          INTEGER PRIMARY KEY,
  category    TEXT NOT NULL,   -- 'colors', 'spacing', 'typography', 'motion', 'glow'
  group_name  TEXT,            -- 'primary', 'background', 'text', etc.
  name        TEXT NOT NULL,   -- '500', 'default', 'primary'
  value       TEXT NOT NULL,   -- '#8b5cf6', '1rem', '300ms'
  theme       TEXT NOT NULL    -- 'base' | 'luxe' | 'zelex'
);

-- UI components from packages/ui/src/components/
CREATE TABLE components (
  id          INTEGER PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  file_path   TEXT NOT NULL,
  props_json  TEXT,   -- JSON array: [{name, type, required, default}]
  tokens_used TEXT    -- JSON array of token ids
);

-- CSS utility classes parsed from css-library/*.css
CREATE TABLE css_classes (
  id          INTEGER PRIMARY KEY,
  class_name  TEXT NOT NULL,
  source_file TEXT NOT NULL,  -- 'chromatic-base.css', 'chromatic-effects.css', etc.
  theme       TEXT NOT NULL,  -- 'base' | 'luxe'
  properties  TEXT            -- JSON: {"color": "var(--color-primary-500)", ...}
);

-- Theme bundles
CREATE TABLE themes (
  id              INTEGER PRIMARY KEY,
  name            TEXT UNIQUE NOT NULL,  -- 'base', 'luxe', 'zelex'
  description     TEXT,
  token_count     INTEGER DEFAULT 0,
  component_count INTEGER DEFAULT 0
);

-- Token → component cross-reference
CREATE TABLE token_component_refs (
  token_id     INTEGER REFERENCES tokens(id),
  component_id INTEGER REFERENCES components(id),
  PRIMARY KEY (token_id, component_id)
);

-- Build metadata (single row, replaced each ingest)
CREATE TABLE registry_meta (
  built_at        TEXT NOT NULL,
  token_count     INTEGER NOT NULL,
  component_count INTEGER NOT NULL,
  css_class_count INTEGER NOT NULL,
  source_hash     TEXT NOT NULL
);

CREATE INDEX idx_tokens_category_theme ON tokens(category, theme);
CREATE INDEX idx_css_classes_theme ON css_classes(theme);
```

**Ingest sources:**
- `tokens` ← `02_design_tokens/*.json` (recursive leaf walk)
- `components` ← `packages/ui/src/components/*.tsx` (regex prop extraction)
- `css_classes` ← `css-library/*.css` (regex rule parse)
- `themes` ← derived from token/component counts per theme

---

## Postgres Schema

```sql
-- Registry mirror: tokens (truncated + replaced on sync)
CREATE TABLE registry_tokens (
  id          SERIAL PRIMARY KEY,
  category    TEXT NOT NULL,
  group_name  TEXT,
  name        TEXT NOT NULL,
  value       TEXT NOT NULL,
  theme       TEXT NOT NULL,
  synced_at   TIMESTAMPTZ DEFAULT now()
);

-- Registry mirror: components (truncated + replaced on sync)
CREATE TABLE registry_components (
  id           SERIAL PRIMARY KEY,
  name         TEXT UNIQUE NOT NULL,
  file_path    TEXT NOT NULL,
  props_json   JSONB,
  tokens_used  JSONB,
  synced_at    TIMESTAMPTZ DEFAULT now()
);

-- Append-only: component usage events
CREATE TABLE component_usage (
  id             SERIAL PRIMARY KEY,
  component_name TEXT NOT NULL,
  project        TEXT,         -- 'apps/web', 'zelex', etc.
  context        TEXT,         -- page/route/feature
  recorded_at    TIMESTAMPTZ DEFAULT now()
);

-- Append-only: agent activity
CREATE TABLE agent_task_log (
  id           SERIAL PRIMARY KEY,
  agent_id     TEXT,
  task_type    TEXT,           -- 'token-build', 'component-gen', 'design-review', etc.
  input_json   JSONB,
  output_json  JSONB,
  status       TEXT NOT NULL,  -- 'started' | 'completed' | 'failed'
  duration_ms  INTEGER,
  recorded_at  TIMESTAMPTZ DEFAULT now()
);

-- Append-only: sync provenance
CREATE TABLE sync_log (
  id                 SERIAL PRIMARY KEY,
  source_hash        TEXT NOT NULL,
  tokens_synced      INTEGER NOT NULL,
  components_synced  INTEGER NOT NULL,
  synced_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rt_category_theme ON registry_tokens(category, theme);
CREATE INDEX idx_cu_component ON component_usage(component_name);
CREATE INDEX idx_atl_agent_type ON agent_task_log(agent_id, task_type);
```

---

## Sync Script (`scripts/build-db.mjs`)

Single script, two phases:

**Phase 1 — Ingest → SQLite**
1. Delete and recreate `db/ccs-registry.db`
2. Walk `02_design_tokens/*.json`, insert leaf values into `tokens`
3. Glob `packages/ui/src/components/*.tsx`, regex-extract props → `components`
4. Parse `css-library/*.css` rules → `css_classes`
5. Derive `themes` counts; compute `source_hash`; write `registry_meta`

**Phase 2 — Sync → Postgres**
1. Connect via `process.env.DATABASE_URL`
2. Open transaction:
   - `TRUNCATE registry_tokens, registry_components RESTART IDENTITY`
   - Bulk insert from SQLite
3. Insert row into `sync_log`
4. Commit

If `DATABASE_URL` is unset, Phase 2 is skipped with a warning (SQLite-only mode for offline dev).

**npm hook:**
```json
"db:build": "node scripts/build-db.mjs",
"build": "npm run build:tokens && npm run db:build && next build"
```

---

## Docker — Postgres Service

Add to `docker-compose.chromatic.yml`, profile `db`:

```yaml
postgres:
  image: postgres:16-alpine
  container_name: cds-postgres
  ports:
    - "5432:5432"
  environment:
    POSTGRES_DB: ccs
    POSTGRES_USER: ccs
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./db/migrations:/docker-entrypoint-initdb.d:ro
  profiles: ["db"]
```

Migration SQL files go in `db/migrations/001_init.sql`.

`.env` additions:
```
POSTGRES_PASSWORD=changeme
DATABASE_URL=postgresql://ccs:changeme@localhost:5432/ccs
```

---

## API Endpoints (`apps/api`)

Single Postgres connection pool. Four routes:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/tokens` | Query `registry_tokens`; params: `category`, `theme` |
| `GET` | `/api/components` | Query `registry_components`; param: `name` |
| `POST` | `/api/usage` | Insert into `component_usage` |
| `POST` | `/api/agent-log` | Insert into `agent_task_log` |

No SQLite connection in the API at runtime.

---

## File Additions Summary

```
db/
  ccs-registry.db          (generated, gitignored)
  migrations/
    001_init.sql            (Postgres DDL)
scripts/
  build-db.mjs              (ingest + sync script)
docker-compose.chromatic.yml  (postgres service added)
apps/api/
  src/db.ts                 (connection pool)
  src/routes/tokens.ts
  src/routes/components.ts
  src/routes/usage.ts
  src/routes/agent-log.ts
```

---

## Out of Scope

- Client engagements / design jobs (tracked in `bd` / markdown)
- Authentication on API routes
- Real-time subscriptions
- Data migrations after initial schema (schema is rebuild-from-source)
