#!/bin/bash

# wait-for-db.sh - Wait for PostgreSQL test database to be ready

echo "🔍 Waiting for PostgreSQL test database to be ready..."

# Database connection parameters
DB_HOST="localhost"
DB_PORT="5435"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="blog_engine_test"

# Maximum wait time (seconds)
MAX_WAIT=30
WAIT_INTERVAL=2
ELAPSED=0

# Function to check if database is ready
check_db() {
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" >/dev/null 2>&1
    return $?
}

# Wait for database to be ready
while ! check_db; do
    if [ $ELAPSED -ge $MAX_WAIT ]; then
        echo "❌ Database not ready after ${MAX_WAIT} seconds. Exiting."
        exit 1
    fi
    
    echo "⏳ Database not ready yet. Waiting... (${ELAPSED}s/${MAX_WAIT}s)"
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
done

echo "✅ PostgreSQL test database is ready!"
echo "📊 Database: $DB_NAME on $DB_HOST:$DB_PORT"
echo "" 