#!/bin/bash
set -e

echo "Starting PostgreSQL initialization with:"
echo "- Database: $POSTGRES_DB"
echo "- User: $POSTGRES_USER"
echo "- Schema: $POSTGRES_SCHEMA"

# Create database and schema if they don't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create schema if specified
    DO \$\$
    BEGIN
        IF '${POSTGRES_SCHEMA}' != '' THEN
            CREATE SCHEMA IF NOT EXISTS ${POSTGRES_SCHEMA};
            GRANT ALL ON SCHEMA ${POSTGRES_SCHEMA} TO ${POSTGRES_USER};
        END IF;
    END
    \$\$;

    -- Create additional application user if needed
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'app_user') THEN
            CREATE USER app_user WITH PASSWORD '${POSTGRES_PASSWORD}';
        END IF;
    END
    \$\$;

    -- Grant privileges to app_user
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO app_user;
    GRANT ALL ON SCHEMA public TO app_user;

    -- Grant schema privileges if schema exists
    DO \$\$
    BEGIN
        IF '${POSTGRES_SCHEMA}' != '' THEN
            GRANT ALL ON SCHEMA ${POSTGRES_SCHEMA} TO app_user;
        END IF;
    END
    \$\$;

    -- Log initialization
    \echo 'Database initialization completed successfully'
EOSQL

echo "PostgreSQL initialization completed for database: $POSTGRES_DB"
