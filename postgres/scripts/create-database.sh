#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

DATABASE="${1:?Usage: create-database.sh <database>}"

docker compose -f "$COMPOSE_FILE" exec -T postgres \
  sh -c 'exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@"' \
  sh -v database="$DATABASE" <<'SQL'
SELECT format('CREATE DATABASE %I', :'database')
WHERE NOT EXISTS (
  SELECT 1 FROM pg_database WHERE datname = :'database'
)
\gexec
SQL

echo "[SUCCESS] Database '$DATABASE' is ready."