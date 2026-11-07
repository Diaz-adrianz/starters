#!/bin/sh
set -eu
umask 077

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"          
BACKUP_DIR="${BACKUP_DIR:-/opt/backups/postgres}"   
KEEP="${KEEP:-4}"                                   
SERVICE="${SERVICE:-postgres}"

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/pg_$(date +%F_%H%M).sql"
trap 'rm -f "$OUT" "$OUT.gz"' EXIT

cd "$APP_DIR"
docker compose exec -T "$SERVICE" sh -c 'pg_dumpall -U "$POSTGRES_USER"' > "$OUT"
gzip "$OUT"
trap - EXIT

ls -1t "$BACKUP_DIR"/pg_*.sql.gz | tail -n +"$((KEEP + 1))" | xargs -r rm --