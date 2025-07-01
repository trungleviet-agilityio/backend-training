#!/bin/sh
# Docker Environment Setup Script
# Handles Docker permissions, port configuration, and initial setup

echo "Docker Environment Setup"
echo "======================="

# Function to check Docker access
check_docker_access() {
    if docker info >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if user is in docker group
echo "1. Checking Docker group membership..."
if groups $USER | grep -q '\bdocker\b'; then
    echo "✓ User $USER is already in the docker group"
else
    echo "✗ User $USER is not in the docker group"
    echo "Adding user to docker group..."
    sudo usermod -aG docker $USER
    echo "✓ User added to docker group"
    echo ""
    echo "IMPORTANT: You need to log out and log back in (or restart your terminal)"
    echo "for the group changes to take effect."
    echo ""
    echo "Alternatively, run: newgrp docker"
    echo ""
fi

# Test Docker access
echo "2. Testing Docker access..."
if check_docker_access; then
    echo "✓ Docker is accessible"
    echo "✓ Docker version: $(docker --version)"
    echo "✓ Docker Compose version: $(docker compose version)"
    DOCKER_ACCESSIBLE=true
else
    echo "✗ Docker is not accessible without sudo"
    echo "Testing with sudo..."
    if sudo docker info >/dev/null 2>&1; then
        echo "✓ Docker works with sudo"
        DOCKER_ACCESSIBLE=sudo
    else
        echo "✗ Docker is not working even with sudo"
        echo "Please check Docker installation"
        exit 1
    fi
fi

# Check port configuration
echo ""
echo "3. Checking port configuration..."
if [ -f local.env ]; then
    echo "✓ Found local.env configuration file"
    POSTGRES_PORT=$(grep "POSTGRES_HOST_PORT" local.env | cut -d'=' -f2 | head -1)
    WEB_PORT=$(grep "WEB_HOST_PORT" local.env | cut -d'=' -f2 | head -1)
    echo "  PostgreSQL port: ${POSTGRES_PORT:-5433}"
    echo "  Web port: ${WEB_PORT:-8000}"
else
    echo "✗ No local.env file found"
    echo "Creating default configuration..."
    cat > local.env << EOF
# Docker Compose Environment Variables
# Configure ports to avoid conflicts

# PostgreSQL host port (default: 5433 to avoid conflict with local PostgreSQL on 5432)
POSTGRES_HOST_PORT=5433

# Web application host port (default: 8000)
WEB_HOST_PORT=8000
EOF
    echo "✓ Created local.env with default ports"
fi

# Final instructions
echo ""
echo "4. Setup Complete!"
echo "=================="
echo "Next steps:"

if [ "$DOCKER_ACCESSIBLE" = "true" ]; then
    echo "✓ You can run Docker commands directly:"
    echo "  sh scripts/run-db.sh"
    echo "  docker compose up -d"
elif [ "$DOCKER_ACCESSIBLE" = "sudo" ]; then
    echo "⚠ You need to use sudo for Docker commands:"
    echo "  sudo sh scripts/run-db.sh"
    echo "  sudo docker compose up -d"
    echo ""
    echo "To fix permissions, log out and back in, or run: newgrp docker"
fi

echo ""
echo "Available scripts:"
echo "  scripts/run-db.sh      - Start PostgreSQL database"
echo "  scripts/set-ports.sh   - Configure ports"
echo "  scripts/up.sh          - Start database and server"
