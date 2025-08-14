#!/usr/bin/env bash
set -euo pipefail

# Requires: docker, and minio container named ga_minio
# This script uses the MinIO mc client via docker to create buckets and set policies.

MINIO_HOST="http://ga_minio:9000"
ACCESS_KEY="${MINIO_ACCESS_KEY:-minioadmin}"
SECRET_KEY="${MINIO_SECRET_KEY:-SoK0D_9L7r#bJ1!mQaZ2&xP5^Ve3@Uc}"

echo "Configuring MinIO..."
docker run --rm --network grossanzeigen_default -e MC_HOST_local="http://${ACCESS_KEY}:${SECRET_KEY}@ga_minio:9000" minio/mc:latest \
  mb -p local/images-original || true

docker run --rm --network grossanzeigen_default -e MC_HOST_local="http://${ACCESS_KEY}:${SECRET_KEY}@ga_minio:9000" minio/mc:latest \
  mb -p local/images-processed || true

docker run --rm --network grossanzeigen_default -e MC_HOST_local="http://${ACCESS_KEY}:${SECRET_KEY}@ga_minio:9000" minio/mc:latest \
  anonymous set download local/images-processed

echo "MinIO buckets ready: images-original, images-processed"


