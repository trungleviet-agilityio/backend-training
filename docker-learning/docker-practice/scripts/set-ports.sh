#!/bin/sh
# Port Configuration Utility for Docker Compose

echo "Docker Compose Port Configuration"
echo "================================="

if [ $# -eq 0 ]; then
    echo "Usage: $0 <postgres_port> [web_port]"
    echo "Examples:"
    echo "  $0 5433 8000    # Set PostgreSQL to 5433, Web to 8000"
    echo "  $0 5434         # Set PostgreSQL to 5434, keep Web at 8000"
    echo "  $0 check        # Show current ports"
    echo ""
    echo "Current configuration:"
    if [ -f local.env ]; then
        grep "POSTGRES_HOST_PORT\|WEB_HOST_PORT" local.env | grep -v "^#"
    else
        echo "No configuration file found (local.env)"
    fi
    exit 1
fi

if [ "$1" = "check" ]; then
    echo "Current port configuration:"
    if [ -f local.env ]; then
        grep "POSTGRES_HOST_PORT\|WEB_HOST_PORT" local.env | grep -v "^#"
    else
        echo "No configuration file found (local.env)"
    fi
    echo ""
    echo "Active containers:"
    docker compose ps 2>/dev/null || echo "No containers running"
    exit 0
fi

POSTGRES_PORT=$1
WEB_PORT=${2:-8000}

echo "Setting ports:"
echo "  PostgreSQL: $POSTGRES_PORT"
echo "  Web: $WEB_PORT"

# Update local.env file
if [ -f local.env ]; then
    # Backup the original file
    cp local.env local.env.backup

    # Update the ports
    sed -i "s/POSTGRES_HOST_PORT=.*/POSTGRES_HOST_PORT=$POSTGRES_PORT/" local.env
    sed -i "s/WEB_HOST_PORT=.*/WEB_HOST_PORT=$WEB_PORT/" local.env

    echo "✓ Updated local.env"
    echo ""
    echo "New configuration:"
    grep "POSTGRES_HOST_PORT\|WEB_HOST_PORT" local.env | grep -v "^#"
    echo ""
    echo "To apply changes, restart your containers:"
    echo "  docker compose down && sh scripts/run-db.sh"
else
    echo "Error: local.env file not found"
    exit 1
fi
