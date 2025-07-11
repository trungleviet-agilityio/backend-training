-- Development Database Initialization Script
-- This script sets up the development database with proper extensions and configurations

-- Create database if it doesn't exist (this will be handled by docker-compose)
-- CREATE DATABASE IF NOT EXISTS blog_engine_dev;

-- Connect to the database
\c blog_engine_dev;

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Set up database-level configurations
ALTER DATABASE blog_engine_dev SET timezone TO 'UTC';

-- Create custom types if needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
    END IF;
END $$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE blog_engine_dev TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

-- Log successful initialization
SELECT 'Development database initialized successfully' AS status; 