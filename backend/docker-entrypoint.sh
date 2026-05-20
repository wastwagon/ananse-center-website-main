#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
npx prisma migrate deploy

UPLOAD_DIR="${MEDIA_UPLOAD_DIR:-/app/backend/uploads}"
mkdir -p "$UPLOAD_DIR"
echo "[entrypoint] Media upload dir: $UPLOAD_DIR"

if [ "${SKIP_PRISMA_SEED}" != "true" ]; then
  echo "[entrypoint] Seeding database in background (API will start immediately)..."
  npx prisma db seed > /tmp/prisma-seed.log 2>&1 &
else
  echo "[entrypoint] Skipping seed (SKIP_PRISMA_SEED=true)"
fi

echo "[entrypoint] Starting API on port ${BACKEND_PORT:-4000}..."
exec node dist/index.js
