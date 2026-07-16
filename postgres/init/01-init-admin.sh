#!/bin/bash
set -e

if [[ -z "${POSTGRES_ADMIN_USER}" || \
      -z "${POSTGRES_ADMIN_PASSWORD}" || \
      -z "${POSTGRES_ADMIN_ALLOWED_HOSTS}" ]]; then
    echo "Skipping Postgres admin user setup."
    exit 0
fi

# create/update admin role
psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${POSTGRES_ADMIN_USER}') THEN
      CREATE ROLE "${POSTGRES_ADMIN_USER}" LOGIN SUPERUSER PASSWORD '${POSTGRES_ADMIN_PASSWORD}';
   ELSE
      ALTER ROLE "${POSTGRES_ADMIN_USER}" WITH LOGIN SUPERUSER PASSWORD '${POSTGRES_ADMIN_PASSWORD}';
   END IF;
END
\$\$;
EOSQL

# rebuild pg_hba.conf allow rules for this user
HBA_FILE="${PGDATA}/pg_hba.conf"
MARKER_START="# BEGIN ${POSTGRES_ADMIN_USER} rules"
MARKER_END="# END ${POSTGRES_ADMIN_USER} rules"

sed -i "/${MARKER_START}/,/${MARKER_END}/d" "$HBA_FILE"

{
  echo "$MARKER_START"
  IFS=',' read -ra ALLOWED_HOSTS <<< "${POSTGRES_ADMIN_ALLOWED_HOSTS}"
  for CIDR in "${ALLOWED_HOSTS[@]}"; do
      CIDR="$(echo "$CIDR" | xargs)"
      echo "host    all    ${POSTGRES_ADMIN_USER}    ${CIDR}    scram-sha-256"
  done
  echo "$MARKER_END"
} >> "$HBA_FILE"

psql -v ON_ERROR_STOP=1 --username "postgres" -c "SELECT pg_reload_conf();"