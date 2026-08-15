#!/bin/sh
# wait-for-mongo.sh
# Waits for MongoDB to be ready before starting the backend.
# Usage: ./wait-for-mongo.sh <host:port> <timeout-seconds>

set -e

HOST_PORT="${1:-mongo:27017}"
TIMEOUT="${2:-30}"

echo "Waiting for MongoDB at $HOST_PORT (timeout: ${TIMEOUT}s)..."

for i in $(seq 1 $TIMEOUT); do
  if nc -z "$(echo $HOST_PORT | cut -d: -f1)" "$(echo $HOST_PORT | cut -d: -f2)" 2>/dev/null; then
    echo "MongoDB is ready after ${i}s."
    exit 0
  fi
  sleep 1
done

echo "Error: MongoDB did not become ready within ${TIMEOUT}s."
exit 1
