-- TV Company Database Schema
-- Based on the D2 diagram: tv_company_rd.d2
-- This file contains only table creation statements


-- Create custom schema
CREATE SCHEMA IF NOT EXISTS tv_company;
SET search_path TO tv_company, public;

-- Drop tables in dependency order (linking tables first)
DROP TABLE IF EXISTS employee_series_roles CASCADE;
DROP TABLE IF EXISTS employee_roles CASCADE;
DROP TABLE IF EXISTS transmission_channels CASCADE;
DROP TABLE IF EXISTS transmissions CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS tv_series CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
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

-- 2. Department (validation table)
CREATE TABLE departments (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TVSeries
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

-- 4. Role
CREATE TABLE roles (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    department_uuid UUID NOT NULL REFERENCES departments(uuid),
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Employee
CREATE TABLE employees (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birthdate DATE NOT NULL,
    employment_date DATE NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Episode
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

-- 7. Channel (validation table)
CREATE TABLE channels (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50),
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Transmission
CREATE TABLE transmissions (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    episode_uuid UUID NOT NULL REFERENCES episodes(uuid),
    transmission_time TIMESTAMPTZ NOT NULL,
    viewership BIGINT DEFAULT 0 CHECK (viewership >= 0),
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. TransmissionChannel (linking table)
CREATE TABLE transmission_channels (
    transmission_uuid UUID NOT NULL REFERENCES transmissions(uuid),
    channel_uuid UUID NOT NULL REFERENCES channels(uuid),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (transmission_uuid, channel_uuid)
);

-- 10. EmployeeRole (linking table)
CREATE TABLE employee_roles (
    employee_uuid UUID NOT NULL REFERENCES employees(uuid),
    role_uuid UUID NOT NULL REFERENCES roles(uuid),
    assigned_at DATE,
    is_active BOOLEAN DEFAULT TRUE,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_uuid, role_uuid)
);

-- 11. EmployeeSeriesRole (linking table)
CREATE TABLE employee_series_roles (
    employee_uuid UUID NOT NULL REFERENCES employees(uuid),
    series_uuid UUID NOT NULL REFERENCES tv_series(uuid),
    role_uuid UUID NOT NULL REFERENCES roles(uuid),
    character_name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    deleted BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_uuid, series_uuid, role_uuid)
);
