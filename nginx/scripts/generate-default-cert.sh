#!/usr/bin/env sh

set -e

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
CERT_DIR="$SCRIPT_DIR/../certs"

mkdir -p "$CERT_DIR"

openssl req \
  -x509 \
  -nodes \
  -days 3650 \
  -newkey rsa:2048 \
  -keyout "$CERT_DIR/default.key" \
  -out "$CERT_DIR/default.crt" \
  -subj "/CN=default"

echo "Self-signed certificate generated:"
echo "  Certificate: $CERT_DIR/default.crt"
echo "  Private key: $CERT_DIR/default.key"

echo "Reloading Nginx..."
docker compose exec nginx nginx -s reload

echo "Done."
