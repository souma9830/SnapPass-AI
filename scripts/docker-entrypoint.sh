#!/bin/sh
# docker-entrypoint.sh
# Entrypoint script for the SnapPass AI backend Docker container.
# Waits for dependencies before starting the application.

set -e

MONGO_HOST="${MONGO_HOST:-mongo}"
MONGO_PORT="${MONGO_PORT:-27017}"
TIMEOUT="${WAIT_TIMEOUT:-30}"

echo "⏳ Starting SnapPass AI Backend entrypoint..."

# Wait for MongoDB if MONGO_URI is set
if [ -n "$MONGO_URI" ]; then
  echo "Waiting for MongoDB at ${MONGO_HOST}:${MONGO_PORT}..."
  /app/scripts/wait-for-mongo.sh "${MONGO_HOST}:${MONGO_PORT}" "$TIMEOUT"
fi

echo "Starting application..."
exec "$@"
