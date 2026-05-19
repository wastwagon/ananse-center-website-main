#!/bin/sh
set -e

cd /app

if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  echo "Installing API dependencies..."
  npm install
fi

echo "Running database migrations..."
npx prisma migrate deploy
npx prisma generate

if [ "$SKIP_PRISMA_SEED" != "true" ]; then
  echo "Seeding database..."
  npx prisma db seed || true
fi

exec "$@"
