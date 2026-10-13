#!/bin/sh
set -e

cd /app

if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  echo "Installing API dependencies..."
  npm install
fi

echo "Applying database migrations..."
npx prisma migrate deploy
npx prisma generate
echo "Database migrations applied"

if [ "$SKIP_PRISMA_SEED" != "true" ]; then
  echo "Seeding database..."
  npx prisma db seed
  echo "Seed complete"
else
  echo "Skipping seed (SKIP_PRISMA_SEED=true)"
fi

exec "$@"
