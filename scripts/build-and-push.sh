#!/bin/bash
set -euo pipefail

FULL_NAME="$DOCKERHUB_USERNAME/$IMAGE:latest"

echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

echo "Building $FULL_NAME from $CONTEXT ..."

if [ "$IMAGE" = "dockerapp-frontend" ]; then
  docker build \
    --build-arg VITE_API_URL="$VITE_API_URL" \
    -t "$FULL_NAME" \
    "$CONTEXT"
else
  docker build \
    -t "$FULL_NAME" \
    "$CONTEXT"
fi

echo "Pushing $FULL_NAME ..."
docker push "$FULL_NAME"