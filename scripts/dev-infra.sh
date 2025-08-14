#!/usr/bin/env bash
set -euo pipefail
docker compose up -d
echo "Infra started (postgres, opensearch, minio)."

