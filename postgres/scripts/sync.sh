#!/bin/sh
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PG_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_DIR="$(cd "$PG_DIR/.." && pwd)"                 
CONFIG="${CONFIG:-$PG_DIR/databases.json}"
SERVICE="${SERVICE:-postgres}"

[ -f "$CONFIG" ] || { echo "Missing $CONFIG" >&2; exit 1; }
CFG="$(cat "$CONFIG")"

cd "$APP_DIR"

psql_exec() {
  docker compose exec -T "$SERVICE" \
    sh -c 'PGOPTIONS="-c client_min_messages=warning" exec psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$@"' sh "$@"
}

echo "Syncing roles and databases..."
psql_exec -d postgres -v cfg="$CFG" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', e->>'db_user', e->>'db_password')
FROM jsonb_array_elements(:'cfg'::jsonb) e
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = e->>'db_user')
\gexec

SELECT format('ALTER ROLE %I PASSWORD %L', e->>'db_user', e->>'db_password')
FROM jsonb_array_elements(:'cfg'::jsonb) e
\gexec

SELECT format('CREATE DATABASE %I OWNER %I', e->>'db_name', e->>'db_user')
FROM jsonb_array_elements(:'cfg'::jsonb) e
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = e->>'db_name')
\gexec
SQL

DBS="$(psql_exec -d postgres -At -v cfg="$CFG" <<'SQL'
SELECT e->>'db_name' FROM jsonb_array_elements(:'cfg'::jsonb) e;
SQL
)"

echo "$DBS" | while read -r DB; do
  [ -n "$DB" ] || continue
  echo "\nDatabase: $DB"
  psql_exec -d "$DB" -At -v cfg="$CFG" -v db="$DB" <<'SQL' |
SET client_min_messages = warning;
SELECT s->>'name'
FROM jsonb_array_elements(:'cfg'::jsonb) e,
     jsonb_array_elements(coalesce(e->'schemas', '[]'::jsonb)) s
WHERE e->>'db_name' = :'db'
ORDER BY 1;
SQL
  grep -v '^SET$' |
  while read -r SCHEMA; do
    [ -n "$SCHEMA" ] || continue
    STATUS="$(psql_exec -d "$DB" -At -v cfg="$CFG" -v db="$DB" -v schema="$SCHEMA" <<'SQL'
SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = :'schema')
            THEN 'exists' ELSE 'created' END;
SELECT format('CREATE SCHEMA IF NOT EXISTS %I AUTHORIZATION %I', :'schema',
              (SELECT e->>'db_user' FROM jsonb_array_elements(:'cfg'::jsonb) e WHERE e->>'db_name' = :'db'))
\gexec
SQL
    )"
    echo "  $SCHEMA: $(echo "$STATUS" | head -n1)"
  done
done

echo "\nSync done."