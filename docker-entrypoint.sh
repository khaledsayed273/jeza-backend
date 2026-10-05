#!/bin/sh
set -e

# Apply pending Drizzle migrations before starting the server.
# Dokploy provides DATABASE_URL from the linked MySQL service.
if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Running database migrations..."
  pnpm db:migrate
else
  echo "[entrypoint] WARNING: DATABASE_URL is not set, skipping migrations."
fi

mkdir -p /app/uploads

echo "[entrypoint] Starting server..."
exec node dist/index.js
