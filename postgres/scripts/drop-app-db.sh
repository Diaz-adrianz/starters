#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <USER_NAME> <DATABASE_NAME>"
    exit 1
fi

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../../.env"

if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
fi

: "${POSTGRES_ROOT_PASSWORD:?POSTGRES_ROOT_PASSWORD is not set}"

USER_NAME="$1"
DATABASE_NAME="$2"

export PGPASSWORD="${POSTGRES_ROOT_PASSWORD}"

docker compose exec -T postgres psql -U postgres -d "${DATABASE_NAME}" -c \
    "DROP OWNED BY \"${USER_NAME}\" CASCADE;" 2>/dev/null || true

docker compose exec -T postgres psql -U postgres -c \
    "DROP DATABASE IF EXISTS \"${DATABASE_NAME}\";"

docker compose exec -T postgres psql -U postgres -c \
    "DROP ROLE IF EXISTS \"${USER_NAME}\";"

echo "Done."
echo "Deleted database : ${DATABASE_NAME}"
echo "Deleted user     : ${USER_NAME}"