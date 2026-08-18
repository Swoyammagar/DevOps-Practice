#!/bin/bash

set -euo pipefail

echo "Installing dependencies..."
npm install

echo "Building frontend..."

npm run build

echo "Uploading dist to S3..."

aws s3 sync dist/ "s3://$S3_BUCKET" --delete

echo "S3 deployment complete."