#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <USER_NAME> <USER_PASSWORD> <HOST> <DATABASE_NAME>"
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
USER_PASSWORD="$2"
HOST="$3"
DATABASE_NAME="$4"

export PGPASSWORD="${POSTGRES_ROOT_PASSWORD}"

docker compose exec -T postgres psql -U postgres <<EOF
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${USER_NAME}') THEN
      CREATE ROLE "${USER_NAME}" LOGIN PASSWORD '${USER_PASSWORD}';
   ELSE
      ALTER ROLE "${USER_NAME}" WITH LOGIN PASSWORD '${USER_PASSWORD}';
   END IF;
END
\$\$;

SELECT 'CREATE DATABASE "${DATABASE_NAME}"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DATABASE_NAME}')\gexec

GRANT CONNECT, CREATE ON DATABASE "${DATABASE_NAME}" TO "${USER_NAME}";
EOF

docker compose exec -T postgres psql -U postgres -d "${DATABASE_NAME}" <<EOF
GRANT USAGE, CREATE ON SCHEMA public TO "${USER_NAME}";

GRANT
    SELECT,
    INSERT,
    UPDATE,
    DELETE,
    TRUNCATE,
    REFERENCES,
    TRIGGER
ON ALL TABLES IN SCHEMA public TO "${USER_NAME}";

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "${USER_NAME}";

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT
    SELECT,
    INSERT,
    UPDATE,
    DELETE,
    TRUNCATE,
    REFERENCES,
    TRIGGER
ON TABLES TO "${USER_NAME}";

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO "${USER_NAME}";
EOF

echo "Done."
echo "Database : ${DATABASE_NAME}"
echo "User     : ${USER_NAME}"