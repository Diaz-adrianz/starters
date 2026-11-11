#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SEAWEEDFS_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="${COMPOSE_FILE:-$SEAWEEDFS_DIR/../docker-compose.yml}"

BUCKET="${1:-}"
ACCESS_KEY="${2:-}"
SECRET_KEY="${3:-}"
AWS_CLI_IMAGE="${AWS_CLI_IMAGE:-amazon/aws-cli:latest}"

log() { echo "[INFO] $*"; }
success() { echo "[SUCCESS] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

[[ $# -eq 3 ]] || fail "Usage: $0 <bucket> <access-key> <secret-key>"
[[ "$BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] || fail "Invalid bucket name: $BUCKET"
[[ -f "$COMPOSE_FILE" ]] || fail "Compose file not found: $COMPOSE_FILE"

CONTAINER_ID="$(
  docker compose -f "$COMPOSE_FILE" ps -q seaweedfs-s3
)" || fail "Unable to inspect SeaweedFS S3 service"

[[ -n "$CONTAINER_ID" ]] || fail "SeaweedFS S3 container is not running"

NETWORK="$(
  docker inspect \
    --format '{{range $name, $_ := .NetworkSettings.Networks}}{{println $name}}{{end}}' \
    "$CONTAINER_ID" | sed -n '1p'
)"

[[ -n "$NETWORK" ]] || fail "Unable to detect Docker network"

AWS=(
  docker run --rm
  --network "$NETWORK"
  -e AWS_ACCESS_KEY_ID="$ACCESS_KEY"
  -e AWS_SECRET_ACCESS_KEY="$SECRET_KEY"
  -e AWS_DEFAULT_REGION=us-east-1
  "$AWS_CLI_IMAGE"
  --endpoint-url http://seaweedfs-s3:8333
  s3api
)

log "Checking bucket '$BUCKET'..."

if OUTPUT="$("${AWS[@]}" head-bucket --bucket "$BUCKET" 2>&1)"; then
  success "Bucket '$BUCKET' already exists. Skipping."
  exit 0
fi

if [[ "$OUTPUT" != *"404"* && "$OUTPUT" != *"Not Found"* ]]; then
  fail "Unable to verify bucket '$BUCKET': $OUTPUT"
fi

log "Creating bucket '$BUCKET'..."

"${AWS[@]}" create-bucket --bucket "$BUCKET" \
  || fail "Failed to create bucket '$BUCKET'"

success "Bucket '$BUCKET' created successfully"