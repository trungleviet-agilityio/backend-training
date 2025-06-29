-- TV Company Database - Delete All Data
-- This file deletes all test data from the database
-- Run this file to clean the database for fresh testing

-- Delete in reverse dependency order to avoid foreign key constraint violations

-- Delete Transmission Channels (linking table)
DELETE FROM transmission_channels;

-- Delete Transmissions
DELETE FROM transmissions;

-- Delete Episodes
DELETE FROM episodes;

-- Delete Series Cast (linking table)
DELETE FROM series_cast;

-- Delete TV Series
DELETE FROM tv_series;

-- Delete Employees
DELETE FROM employees;

-- Delete Roles
DELETE FROM roles;

-- Delete Channels
DELETE FROM channels;

-- Delete Series Domains
DELETE FROM series_domains;

-- Reset sequences if any were used (UUIDs don't need this, but included for completeness)
-- Note: Since we're using UUIDs, no sequences need to be reset

-- Verify all tables are empty
SELECT 'series_domains' as table_name, COUNT(*) as record_count FROM series_domains
UNION ALL
SELECT 'tv_series', COUNT(*) FROM tv_series
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'series_cast', COUNT(*) FROM series_cast
UNION ALL
SELECT 'episodes', COUNT(*) FROM episodes
UNION ALL
SELECT 'channels', COUNT(*) FROM channels
UNION ALL
SELECT 'transmissions', COUNT(*) FROM transmissions
UNION ALL
SELECT 'transmission_channels', COUNT(*) FROM transmission_channels
ORDER BY table_name;
