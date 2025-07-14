#!/bin/bash

# db-reset-test.sh - Reset test database for clean testing

echo "🔄 Resetting test database..."

# Database connection parameters  
DB_HOST="localhost"
DB_PORT="5435"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="blog_engine_test"

# Drop and recreate database
echo "📍 Dropping and recreating test database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

# Run initialization script
echo "🔧 Running database initialization..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ./scripts/sql/init-test.sql

echo "✅ Test database reset completed!"
echo "📊 Database: $DB_NAME on $DB_HOST:$DB_PORT" 