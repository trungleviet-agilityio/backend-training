-- TV Company Database Schema
-- Based on the D2 diagram: tv_company_rd.d2
-- This file contains only table creation statements


-- Create custom schema
CREATE SCHEMA IF NOT EXISTS tv_company;
SET search_path TO tv_company, public;

-- Drop tables in dependency order (linking tables first)
DROP TABLE IF EXISTS series_cast CASCADE;
DROP TABLE IF EXISTS transmission_channels CASCADE;
DROP TABLE IF EXISTS transmissions CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS tv_series CASCADE;
DROP TABLE IF EXISTS series_domains CASCADE;

-- Create tables in dependency order

-- 1. SeriesDomain (validation table)
CREATE TABLE series_domains (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TVSeries
CREATE TABLE tv_series (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    domain_uuid UUID NOT NULL REFERENCES series_domains(uuid),
    start_date DATE NOT NULL,
    end_date DATE,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Role (TV production roles)
CREATE TABLE roles (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Employee
CREATE TABLE employees (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birthdate DATE NOT NULL,
    employment_date DATE NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'busy', 'unavailable')),
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Episode
CREATE TABLE episodes (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_uuid UUID NOT NULL REFERENCES tv_series(uuid),
    episode_number INTEGER NOT NULL,
    title VARCHAR(255),
    duration_minutes INTEGER CHECK (duration_minutes BETWEEN 1 AND 600),
    air_date DATE,
    director_uuid UUID NOT NULL REFERENCES employees(uuid),
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Composite unique constraint
    UNIQUE(series_uuid, episode_number)
);

-- director_uuid must reference an employee who is assigned the Director role for the same series in the series_cast table.
-- Enforced by trigger: trg_check_director_in_series_cast (see 02_business_rules.sql)

-- 6. Channel (validation table)
CREATE TABLE channels (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50),
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Transmission
CREATE TABLE transmissions (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    episode_uuid UUID NOT NULL REFERENCES episodes(uuid),
    transmission_time TIMESTAMPTZ NOT NULL,
    viewership BIGINT DEFAULT 0 CHECK (viewership >= 0),
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TransmissionChannel (linking table)
CREATE TABLE transmission_channels (
    transmission_uuid UUID NOT NULL REFERENCES transmissions(uuid),
    channel_uuid UUID NOT NULL REFERENCES channels(uuid),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (transmission_uuid, channel_uuid)
);

-- 9. SeriesCast (linking table for employees participating in series)
CREATE TABLE series_cast (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_uuid UUID NOT NULL REFERENCES employees(uuid),
    series_uuid UUID NOT NULL REFERENCES tv_series(uuid),
    role_uuid UUID NOT NULL REFERENCES roles(uuid),
    character_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT NOW(),
    updated_time TIMESTAMP DEFAULT NOW(),
    UNIQUE(employee_uuid, series_uuid, role_uuid)
);
