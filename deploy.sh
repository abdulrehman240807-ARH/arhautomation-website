#!/usr/bin/env bash
set -euo pipefail

# ARH Automation — one-shot deploy script
# Usage: ./deploy.sh
# Idempotent: safe to run multiple times.

echo "=== ARH Automation deploy ==="

# 1. Pull latest
echo "[1/4] Pulling latest code..."
git pull --ff-only origin main

# 2. Build image
echo "[2/4] Building Docker image..."
docker compose build --pull

# 3. Roll out
echo "[3/4] Starting containers..."
docker compose up -d --remove-orphans

# 4. Healthcheck
echo "[4/4] Running healthcheck..."
RETRIES=10
DELAY=3
for i in $(seq 1 $RETRIES); do
  if curl -sf http://localhost/health > /dev/null 2>&1; then
    echo "✓ Site is healthy (attempt $i/$RETRIES)"
    docker compose ps
    exit 0
  fi
  echo "  Waiting... ($i/$RETRIES)"
  sleep $DELAY
done

echo "✗ Healthcheck failed after $RETRIES attempts"
docker compose logs --tail=30
exit 1
