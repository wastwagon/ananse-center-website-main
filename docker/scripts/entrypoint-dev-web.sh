#!/bin/sh
set -e

cd /app

if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  echo "Installing frontend dependencies..."
  npm ci
fi

exec "$@"
