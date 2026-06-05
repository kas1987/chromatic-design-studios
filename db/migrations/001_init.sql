-- CCS Library DB — Postgres schema
-- Run automatically via docker-entrypoint-initdb.d on first container start

CREATE TABLE IF NOT EXISTS registry_tokens (
  id          SERIAL PRIMARY KEY,
  category    TEXT NOT NULL,
  group_name  TEXT,
  name        TEXT NOT NULL,
  value       TEXT NOT NULL,
  theme       TEXT NOT NULL,
  synced_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registry_components (
  id           SERIAL PRIMARY KEY,
  name         TEXT UNIQUE NOT NULL,
  file_path    TEXT NOT NULL,
  props_json   JSONB,
  tokens_used  JSONB,
  synced_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS component_usage (
  id             SERIAL PRIMARY KEY,
  component_name TEXT NOT NULL,
  project        TEXT,
  context        TEXT,
  recorded_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_task_log (
  id           SERIAL PRIMARY KEY,
  agent_id     TEXT,
  task_type    TEXT,
  input_json   JSONB,
  output_json  JSONB,
  status       TEXT NOT NULL,
  duration_ms  INTEGER,
  recorded_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync_log (
  id                 SERIAL PRIMARY KEY,
  source_hash        TEXT NOT NULL,
  tokens_synced      INTEGER NOT NULL,
  components_synced  INTEGER NOT NULL,
  synced_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rt_category_theme ON registry_tokens(category, theme);
CREATE INDEX IF NOT EXISTS idx_cu_component      ON component_usage(component_name);
CREATE INDEX IF NOT EXISTS idx_atl_agent_type    ON agent_task_log(agent_id, task_type);
