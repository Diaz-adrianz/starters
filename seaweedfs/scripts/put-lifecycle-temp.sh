#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SEAWEEDFS_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE=".env"
COMPOSE_FILE="${COMPOSE_FILE:-$SEAWEEDFS_DIR/../docker-compose.yml}"

BUCKET="${1:-}"
DAYS="${2:-1}"
AWS_CLI_IMAGE="${AWS_CLI_IMAGE:-amazon/aws-cli:latest}"

log() { echo "[INFO] $*"; }
success() { echo "[SUCCESS] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

[[ -n "$BUCKET" ]] || fail "Usage: $0 <bucket-name> [expiration-days]"

[[ "$BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] \
  || fail "Invalid bucket name: $BUCKET"

[[ "$DAYS" =~ ^[1-9][0-9]*$ ]] \
  || fail "Expiration days must be a positive integer"

[[ -f "$ENV_FILE" ]] || fail "Environment file not found: $ENV_FILE"
[[ -f "$COMPOSE_FILE" ]] || fail "Compose file not found: $COMPOSE_FILE"

set -a
source "$ENV_FILE"
set +a

: "${SEAWEEDFS_S3_ADMIN_ACCESS_KEY:?Missing S3 admin access key}"
: "${SEAWEEDFS_S3_ADMIN_SECRET_KEY:?Missing S3 admin secret key}"

CONTAINER_ID="$(docker compose -f "$COMPOSE_FILE" ps -q seaweedfs-s3)"

[[ -n "$CONTAINER_ID" ]] || fail "SeaweedFS S3 container is not running"

NETWORK="$(
  docker inspect \
    --format '{{range $name, $_ := .NetworkSettings.Networks}}{{println $name}}{{end}}' \
    "$CONTAINER_ID" | head -n 1
)"

[[ -n "$NETWORK" ]] || fail "Unable to detect Docker network"

AWS=(
  docker run --rm
  --network "$NETWORK"
  -e AWS_ACCESS_KEY_ID="$SEAWEEDFS_S3_ADMIN_ACCESS_KEY"
  -e AWS_SECRET_ACCESS_KEY="$SEAWEEDFS_S3_ADMIN_SECRET_KEY"
  -e AWS_DEFAULT_REGION=us-east-1
  "$AWS_CLI_IMAGE"
  --endpoint-url http://seaweedfs-s3:8333
  s3api
)

log "Checking bucket '$BUCKET'..."

"${AWS[@]}" head-bucket --bucket "$BUCKET" >/dev/null \
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