#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
BACKUP_DIR="$PROJECT_DIR/postgres/backups"

if [[ $# -eq 0 ]]; then
  echo "Usage: backup-database.sh <database> [database...]" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] Docker is not installed or not in PATH." >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
umask 077

TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"
FAILED=()

for DATABASE in "$@"; do
  BACKUP_FILE="$BACKUP_DIR/${TIMESTAMP}_${DATABASE}.dump"
  TEMP_FILE="$BACKUP_FILE.partial"

  echo "[INFO] Backing up database '$DATABASE'..."

  if docker compose -f "$COMPOSE_FILE" exec -T postgres \
    sh -c 'exec pg_dump -Fc -U "$POSTGRES_USER" -d "$1"' \
    sh "$DATABASE" > "$TEMP_FILE"; then

    mv "$TEMP_FILE" "$BACKUP_FILE"
    echo "[SUCCESS] $BACKUP_FILE"
  else
    rm -f "$TEMP_FILE"
    echo "[ERROR] Failed to back up '$DATABASE'." >&2
    FAILED+=("$DATABASE")
  fi
done

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "[ERROR] Failed databases: ${FAILED[*]}" >&2
  exit 1
fi

echo "[SUCCESS] All backups completed."