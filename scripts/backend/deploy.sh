#!/bin/bash
set -euo pipefail

printf '%s' "$EC2_SSH_KEY" > key.pem
chmod 400 key.pem
trap 'rm -f key.pem' EXIT

ssh -o StrictHostKeyChecking=accept-new -i key.pem "$EC2_USER@$EC2_HOST" "
  set -e

  cd ~

  echo 'Pulling latest backend image...'
  docker pull $DOCKERHUB_USERNAME/$IMAGE:latest

  echo 'Removing old backend container...'
  docker rm -f backend 2>/dev/null || true

  echo 'Ensuring MongoDB is running...'
  docker compose up -d mongodb

  echo 'Starting new backend container...'
  docker compose up -d backend

  echo 'Backend deployment complete.'

  docker ps
"