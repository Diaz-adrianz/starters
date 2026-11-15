#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

APP_USER="${1:?Usage: create-user.sh <username> <database>}"
DATABASE="${2:?Usage: create-user.sh <username> <database>}"

read -rsp "Password for '$APP_USER': " APP_PASSWORD
echo
read -rsp "Confirm password: " APP_PASSWORD_CONFIRM
echo

if [[ -z "$APP_PASSWORD" ]]; then
  echo "[ERROR] Password cannot be empty." >&2
  exit 1
fi

if [[ "$APP_PASSWORD" != "$APP_PASSWORD_CONFIRM" ]]; then
  echo "[ERROR] Passwords do not match." >&2
  exit 1
fi

docker compose -f "$COMPOSE_FILE" exec -T \
  -e APP_PASSWORD="$APP_PASSWORD" \
  postgres \
  sh -c 'exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@"' \
  sh -v app_user="$APP_USER" -v database="$DATABASE" <<'SQL'
\getenv app_password APP_PASSWORD

SELECT format('CREATE ROLE %I LOGIN', :'app_user')
WHERE NOT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = :'app_user'
)
\gexec

ALTER ROLE :"app_user" LOGIN PASSWORD :'app_password';

ALTER DATABASE :"database" OWNER TO :"app_user";

GRANT CONNECT, CREATE, TEMPORARY
ON DATABASE :"database"
TO :"app_user";
SQL

unset APP_PASSWORD APP_PASSWORD_CONFIRM

echo "[SUCCESS] User '$APP_USER' owns database '$DATABASE'."