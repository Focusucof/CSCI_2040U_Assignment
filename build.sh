#!/usr/bin/env bash
set -e

echo "Building and starting Streamly..."
docker compose build
docker compose up "$@"
