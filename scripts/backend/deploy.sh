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

  echo 'Starting MongoDB...'
  docker compose up -d --no-recreate mongodb

  echo 'Starting backend...'
  docker compose up -d backend

  echo 'Backend deployment complete.'

  docker ps
"