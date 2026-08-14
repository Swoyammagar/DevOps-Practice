#!/bin/bash

set -euo pipefail

USERNAME="swoyammagar"
IMAGE="dockerapp-backend"
TAG="latest"

EC2_USER="ubuntu"
EC2_IP="34.231.99.231"
KEY="$HOME/.ssh/Swoyam0512@.pem"

FULL_NAME="$USERNAME/$IMAGE:$TAG"

echo "Building image..."

docker build -t "$IMAGE" .

echo "Tagging image..."

docker tag "$IMAGE" "$FULL_NAME"

echo "Pushing image..."

docker push "$FULL_NAME"

echo "Deploying to EC2..."

ssh -i "$KEY" "$EC2_USER@$EC2_IP" << EOF

cd ~

docker compose pull

docker compose up -d

EOF

echo "Deployment completed successfully!"
