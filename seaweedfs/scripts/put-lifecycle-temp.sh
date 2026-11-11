#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SEAWEEDFS_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="${COMPOSE_FILE:-$SEAWEEDFS_DIR/../docker-compose.yml}"

BUCKET="${1:-}"
ACCESS_KEY="${2:-}"
SECRET_KEY="${3:-}"
DAYS="${4:-1}"
AWS_CLI_IMAGE="${AWS_CLI_IMAGE:-amazon/aws-cli:latest}"

log() { echo "[INFO] $*"; }
success() { echo "[SUCCESS] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

[[ $# -ge 3 && $# -le 4 ]] || fail "Usage: $0 <bucket> <access-key> <secret-key> [days]"
[[ "$BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] || fail "Invalid bucket name: $BUCKET"
[[ "$DAYS" =~ ^[1-9][0-9]*$ ]] || fail "Expiration days must be a positive integer"
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

"${AWS[@]}" head-bucket --bucket "$BUCKET" \
  || fail "Bucket '$BUCKET' does not exist or cannot be accessed"

LIFECYCLE=$(cat <<EOF
{
  "Rules": [
    {
      "ID": "expire-temp",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "temp/"
      },
      "Expiration": {
        "Days": $DAYS
      }
    }
  ]
}
EOF
)

log "Applying lifecycle to '$BUCKET/temp/'..."
log "Expiration: $DAYS day(s)"

"${AWS[@]}" put-bucket-lifecycle-configuration \
  --bucket "$BUCKET" \
  --lifecycle-configuration "$LIFECYCLE" \
  || fail "Failed to apply lifecycle configuration"

success "Lifecycle applied to '$BUCKET/temp/'"