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

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is not set}"

USER_NAME="$1"
DATABASE_NAME="$2"

docker compose exec -T mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" \
    -e "DROP DATABASE IF EXISTS \`${DATABASE_NAME}\`;"

HOSTS=$(docker compose exec -T mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -Nse \
    "SELECT Host FROM mysql.user WHERE User='${USER_NAME}';")

for HOST in $HOSTS; do
    docker compose exec -T mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" \
        -e "DROP USER IF EXISTS '${USER_NAME}'@'${HOST}';"
done

docker compose exec -T mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" \
    -e "FLUSH PRIVILEGES;"

echo "Done."
echo "Deleted database : ${DATABASE_NAME}"
echo "Deleted user     : ${USER_NAME}"
