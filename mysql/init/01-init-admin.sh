#!/bin/bash
set -e

# Skip if admin user configuration is incomplete
if [[ -z "${MYSQL_ADMIN_USER}" || \
      -z "${MYSQL_ADMIN_PASSWORD}" || \
      -z "${MYSQL_ADMIN_ALLOWED_HOSTS}" ]]; then
    echo "Skipping MySQL admin user setup."
    exit 0
fi

IFS=',' read -ra ALLOWED_HOSTS <<< "${MYSQL_ADMIN_ALLOWED_HOSTS}"

# Create/update users for allowed IPs
for IP in "${ALLOWED_HOSTS[@]}"; do
    IP="$(echo "$IP" | xargs)" # trim whitespace

    mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<EOSQL
CREATE USER IF NOT EXISTS '${MYSQL_ADMIN_USER}'@'${IP}'
IDENTIFIED BY '${MYSQL_ADMIN_PASSWORD}';

ALTER USER '${MYSQL_ADMIN_USER}'@'${IP}'
IDENTIFIED BY '${MYSQL_ADMIN_PASSWORD}';

GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_ADMIN_USER}'@'${IP}' WITH GRANT OPTION;
EOSQL
done

# Remove hosts that are no longer allowed
CURRENT_HOSTS=$(
    mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -Nse \
    "SELECT Host FROM mysql.user WHERE User='${MYSQL_ADMIN_USER}';"
)

for HOST in $CURRENT_HOSTS; do
    FOUND=false

    for IP in "${ALLOWED_HOSTS[@]}"; do
        IP="$(echo "$IP" | xargs)"
        if [[ "$HOST" == "$IP" ]]; then
            FOUND=true
            break
        fi
    done

    if [[ "$FOUND" == false ]]; then
        echo "Dropping ${MYSQL_ADMIN_USER}@${HOST}"
        mysql -u root -p"${MYSQL_ROOT_PASSWORD}" \
            -e "DROP USER IF EXISTS '${MYSQL_ADMIN_USER}'@'${HOST}';"
    fi
done

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"
