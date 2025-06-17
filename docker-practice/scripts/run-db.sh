#!/bin/sh
echo 'Starting the database'

# Load environment variables
if [ -f local.env ]; then
    export $(cat local.env | grep -v '^#' | xargs)
fi

# Set default port if not specified
POSTGRES_HOST_PORT=${POSTGRES_HOST_PORT:-5433}

echo "Using Docker Compose to start PostgreSQL..."
echo "PostgreSQL will be available on localhost:${POSTGRES_HOST_PORT}"

# Use modern docker compose command directly
docker compose up -d postgres

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Database started successfully!"
    echo "PostgreSQL is now running on localhost:${POSTGRES_HOST_PORT}"
    echo "You can connect using:"
    echo "  Host: localhost"
    echo "  Port: ${POSTGRES_HOST_PORT}"
    echo "  Database: postgres"
    echo "  Username: postgres"
    echo "  Password: postgres"
    echo ""
    echo "Check status with: docker compose ps"
else
    echo "Failed to start the database."
    echo "If you get permission errors, try running with sudo:"
    echo "  sudo docker compose up -d postgres"
    echo "Or ensure your user is in the docker group:"
    echo "  sudo usermod -aG docker \$USER && newgrp docker"
    exit 1
fi
