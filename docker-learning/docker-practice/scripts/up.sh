#!/bin/sh
# Development Environment Startup Script
# Starts database and web server (local or Docker mode)

echo "Development Environment Startup"
echo "==============================="

# Load environment variables
if [ -f local.env ]; then
    export $(cat local.env | grep -v '^#' | xargs)
fi

# Check for Docker mode
USE_DOCKER=${USE_DOCKER:-false}

if [ "$1" = "--docker" ] || [ "$USE_DOCKER" = "true" ]; then
    echo "🐳 Starting in Docker mode..."

    # Start database first
    echo "Starting PostgreSQL database..."
    sh scripts/run-db.sh

    if [ $? -eq 0 ]; then
        echo "✓ Database started successfully"

        # Wait a moment for database to be ready
        sleep 2

        # Start web server in Docker
        echo "Starting Django web server in Docker..."
        docker compose up -d web

        if [ $? -eq 0 ]; then
            echo "✓ Web server started successfully"
            echo ""
            echo "🚀 Development environment is ready!"
            echo "   Database: localhost:${POSTGRES_HOST_PORT:-5433}"
            echo "   Web: http://localhost:${WEB_HOST_PORT:-8000}"
            echo ""
            echo "Check status: docker compose ps"
            echo "View logs: docker compose logs -f"
        else
            echo "✗ Failed to start web server"
            exit 1
        fi
    else
        echo "✗ Failed to start database"
        exit 1
    fi

else
    echo "💻 Starting in local mode..."

    # Start database in Docker (background)
    echo "Starting PostgreSQL database..."
    sh scripts/run-db.sh

    if [ $? -eq 0 ]; then
        echo "✓ Database started successfully"

        # Wait for database to be ready
        sleep 2

        # Start local Django server (background)
        echo "Starting Django development server locally..."
        sh scripts/run-server.sh &
        SERVER_PID=$!

        echo "✓ Web server started successfully (PID: $SERVER_PID)"
        echo ""
        echo "🚀 Development environment is ready!"
        echo "   Database: localhost:${POSTGRES_HOST_PORT:-5433}"
        echo "   Web: http://localhost:8000"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo "To stop database: docker compose down"

        # Wait for the server process
        wait $SERVER_PID
    else
        echo "✗ Failed to start database"
        exit 1
    fi
fi
