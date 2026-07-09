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

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is not set}"

USER_NAME="$1"
USER_PASSWORD="$2"
HOST="$3"
DATABASE_NAME="$4"

docker compose exec -T mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\`;

CREATE USER IF NOT EXISTS '${USER_NAME}'@'${HOST}'
IDENTIFIED BY '${USER_PASSWORD}';

ALTER USER '${USER_NAME}'@'${HOST}'
IDENTIFIED BY '${USER_PASSWORD}';

GRANT
    SELECT,
    INSERT,
    UPDATE,
    DELETE,
    CREATE,
    ALTER,
    INDEX,
    REFERENCES,
    CREATE VIEW,
    SHOW VIEW,
    CREATE ROUTINE,
    ALTER ROUTINE,
    EXECUTE,
    EVENT,
    TRIGGER,
    LOCK TABLES,
    CREATE TEMPORARY TABLES
ON \`${DATABASE_NAME}\`.*
TO '${USER_NAME}'@'${HOST}';

FLUSH PRIVILEGES;
EOF

echo "Done."
echo "Database : ${DATABASE_NAME}"
echo "User     : ${USER_NAME}"
