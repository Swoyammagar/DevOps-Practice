#!/bin/bash
set -euo pipefail

printf '%s' "$EC2_SSH_KEY" > key.pem
chmod 400 key.pem
trap 'rm -f key.pem' EXIT

ssh -o StrictHostKeyChecking=accept-new -i key.pem "$EC2_USER@$EC2_HOST" "
  set -e

  cd ~

  echo 'Pulling latest frontend image...'
  docker pull $DOCKERHUB_USERNAME/$IMAGE:latest

  echo 'Removing old frontend container...'
  docker compose rm -sf frontend

  echo 'Starting frontend...'
  docker compose up -d frontend

  echo 'Frontend deployment complete.'

  docker ps
"