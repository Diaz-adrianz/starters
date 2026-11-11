#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SEAWEEDFS_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE=".env"
COMPOSE_FILE="${COMPOSE_FILE:-$SEAWEEDFS_DIR/../docker-compose.yml}"

BUCKET="${1:-}"
AWS_CLI_IMAGE="${AWS_CLI_IMAGE:-amazon/aws-cli:latest}"

log() { echo "[INFO] $*"; }
success() { echo "[SUCCESS] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

[[ -n "$BUCKET" ]] || fail "Usage: $0 <bucket-name>"
[[ -f "$ENV_FILE" ]] || fail "Environment file not found: $ENV_FILE"
[[ -f "$COMPOSE_FILE" ]] || fail "Compose file not found: $COMPOSE_FILE"

[[ "$BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] \
  || fail "Invalid bucket name: $BUCKET"

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

POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET/public/*"
    }
  ]
}
EOF
)

log "Applying public read policy to '$BUCKET/public/'..."

"${AWS[@]}" put-bucket-policy \
  --bucket "$BUCKET" \
  --policy "$POLICY" \
  || fail "Failed to apply public read policy"

success "Public read policy applied to '$BUCKET/public/'"