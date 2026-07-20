#!/bin/bash

set -e

echo "Starting deployment..."

# Pull the latest Docker image from Docker Hub
docker pull abhishekthite09/password-generator:latest

# Remove old container if it still exists
docker rm -f password-generator 2>/dev/null || true

# Start the new container
docker run -d \
  --name password-generator \
  --restart unless-stopped \
  -p 80:80 \
  abhishekthite09/password-generator:latest

echo "Password Generator container started successfully."

# Show running containers
docker ps