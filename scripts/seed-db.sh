#!/usr/bin/env bash
# seed-db.sh — Populate the database with development test data
# Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

set -euo pipefail

API_URL="${API_URL:-http://localhost:8080/api/v1}"

echo "==> Seeding AH@ database at $API_URL"

# ─── Create Manager user ──────────────────────────────────────
echo "--> Creating Manager user..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@ahet.dev",
    "password": "DevPassword123!",
    "full_name": "Test Manager",
    "role": "MANAGER"
  }' | jq .

# ─── Create Employee user ─────────────────────────────────────
echo "--> Creating Employee user..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@ahet.dev",
    "password": "DevPassword123!",
    "full_name": "Test Employee",
    "role": "EMPLOYEE"
  }' | jq .

# ─── Login as Manager and get token ──────────────────────────
echo "--> Logging in as Manager..."
MANAGER_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@ahet.dev","password":"DevPassword123!"}' \
  | jq -r '.data.access_token')

echo "Manager token: ${MANAGER_TOKEN:0:20}..."

# ─── Create test vehicles ─────────────────────────────────────
echo "--> Creating test vehicles..."
for i in 1 2 3; do
  curl -s -X POST "$API_URL/vehicles" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $MANAGER_TOKEN" \
    -d "{
      \"name\": \"Fleet Vehicle $i\",
      \"plate\": \"34ABC00$i\",
      \"make\": \"Ford\",
      \"model\": \"Transit\",
      \"year\": $((2020 + i))
    }" | jq .
done

echo "==> Seed complete."
