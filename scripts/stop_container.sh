#!/bin/bash

echo "Stopping existing password-generator container..."

# Check if the container exists
if [ "$(docker ps -aq -f name=password-generator)" ]; then

    # Stop the container if it is running
    docker stop password-generator || true

    # Remove the old container
    docker rm password-generator || true

    echo "Old container stopped and removed."

else
    echo "No existing container found."
fi