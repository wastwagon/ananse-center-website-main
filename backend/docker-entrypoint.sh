#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations..."
npx prisma migrate deploy
echo "[entrypoint] Database migrations applied"

UPLOAD_DIR="${MEDIA_UPLOAD_DIR:-/app/backend/uploads}"
mkdir -p "$UPLOAD_DIR"
echo "[entrypoint] Media upload dir: $UPLOAD_DIR"

if [ "${SKIP_PRISMA_SEED}" != "true" ]; then
  echo "[entrypoint] Seeding database (programs, CMS, Stage C, demo preview unless SEED_DEMO_PREVIEW=false)..."
  npx prisma db seed
  echo "[entrypoint] Seed complete"
else
  echo "[entrypoint] Skipping seed (SKIP_PRISMA_SEED=true)"
fi

echo "[entrypoint] Starting API on port ${BACKEND_PORT:-4000}..."
exec node dist/index.js
