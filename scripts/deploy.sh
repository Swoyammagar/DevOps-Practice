#!/bin/bash
set -euo pipefail

FULL_NAME="$DOCKERHUB_USERNAME/$IMAGE:latest"

echo "$EC2_SSH_KEY" > key.pem
chmod 400 key.pem
trap 'rm -f key.pem' EXIT

ssh -o StrictHostKeyChecking=accept-new -i key.pem "$EC2_USER@$EC2_HOST" "
  docker pull $FULL_NAME
  docker rm -f $CONTAINER >/dev/null 2>&1 || true

  if [ \"$SERVICE\" = \"backend\" ]; then
    docker network inspect $NETWORK >/dev/null 2>&1 || docker network create $NETWORK
    docker volume inspect $VOLUME >/dev/null 2>&1 || docker volume create $VOLUME

    docker rm -f mongodb >/dev/null 2>&1 || true
    docker run -d \
      --name mongodb \
      --network $NETWORK \
      -p 27017:27017 \
      -v $VOLUME:/data/db \
      mongo:latest

    docker run -d \
      --name $CONTAINER \
      --network $NETWORK \
      -p $PORT:$PORT \
      -e PORT=$PORT \
      -e MONGO_URI=mongodb://mongodb:27017/mern-movie-watchlist \
      --restart always \
      $FULL_NAME
  else
    docker run -d \
      --name $CONTAINER \
      -p $PORT:$PORT \
      --restart always \
      $FULL_NAME
  fi
"