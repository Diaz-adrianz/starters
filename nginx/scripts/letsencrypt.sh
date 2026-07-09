#!/usr/bin/env sh

set -e

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../../.env"

# Load environment variables from .env
if [ -f "$ENV_FILE" ]; then
  set -a
  . "$ENV_FILE"
  set +a
fi

# Validate EMAIL
if [ -z "${AUTHOR_EMAIL:-}" ]; then
  echo "Error: AUTHOR_EMAIL environment variable is not set."
  echo "Please define AUTHOR_EMAIL in your .env file."
  exit 1
fi

# Validate domains
if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <domain1> [domain2] ..."
  exit 1
fi

# Generate certificates
for DOMAIN in "$@"; do
  echo "Generating certificate for $DOMAIN..."

  docker compose run --rm --entrypoint certbot certbot certonly \
    --webroot -w /var/www/certbot \
    --email "$AUTHOR_EMAIL" \
    -d "$DOMAIN" \
    --agree-tos \
    --no-eff-email \
    --force-renewal
done

echo "Reloading Nginx service..."
docker compose exec nginx nginx -s reload

echo "Done."
