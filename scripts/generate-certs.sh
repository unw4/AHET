#!/usr/bin/env bash
# generate-certs.sh — Generate self-signed TLS certificates for local HTTPS development
# Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

set -euo pipefail

CERT_DIR="./secrets/certs"
mkdir -p "$CERT_DIR"

echo "==> Generating self-signed certificate in $CERT_DIR"

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$CERT_DIR/server.key" \
  -out "$CERT_DIR/server.crt" \
  -subj "/C=TR/ST=Istanbul/L=Istanbul/O=AH@ Dev/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "==> Certificate generated:"
echo "    Key:  $CERT_DIR/server.key"
echo "    Cert: $CERT_DIR/server.crt"
echo ""
echo "NOTE: This certificate is for LOCAL DEVELOPMENT only."
echo "      Add it to your system trust store if needed."
