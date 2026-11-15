#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

DATABASE="${1:?Usage: create-schemas.sh <database> <schema...>}"
shift

if [[ $# -eq 0 ]]; then
  echo "[ERROR] Provide at least one schema." >&2
  exit 1
fi

for SCHEMA in "$@"; do
  docker compose -f "$COMPOSE_FILE" exec -T postgres \
    sh -c 'exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$1" -v schema="$2"' \
    sh "$DATABASE" "$SCHEMA" <<'SQL'
SELECT pg_get_userbyid(datdba) AS database_owner
FROM pg_database
WHERE datname = current_database()
\gset

SELECT format(
  'CREATE SCHEMA IF NOT EXISTS %I AUTHORIZATION %I',
  :'schema',
  :'database_owner'
)
\gexec

ALTER SCHEMA :"schema" OWNER TO :"database_owner";
SQL

  echo "[SUCCESS] Schema '$SCHEMA' is ready in '$DATABASE'."
done