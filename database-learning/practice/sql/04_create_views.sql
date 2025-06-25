-- TV Company Database Views - CORRECTED VERSION
-- This file creates all the views with proper DISTINCT usage to prevent duplicate data
-- Based on Chapter 12: Views - Data, Aggregate, and Validation views

-- ============================================================================
-- DATA VIEWS (Single and Multitable)
-- ============================================================================

-- 1. Series Overview View (Aggregate View)
DROP VIEW IF EXISTS v_series_overview CASCADE;
CREATE VIEW v_series_overview AS
SELECT
    s.uuid,
    s.title,
    s.description,
    s.start_date,
    s.end_date,
    sd.name as domain_name,
    sd.description as domain_description,
    COUNT(DISTINCT e.uuid) as episode_count,
    AVG(e.duration_minutes) as avg_episode_duration,
    MIN(e.air_date) as first_episode_air_date,
    MAX(e.air_date) as last_episode_air_date,
    s.created_time,
    s.updated_time
FROM tv_series s
LEFT JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
WHERE s.deleted = false
GROUP BY s.uuid, s.title, s.description, s.start_date, s.end_date,
         sd.name, sd.description, s.created_time, s.updated_time;

-- 2. Episode Details View (Data View)
DROP VIEW IF EXISTS v_episode_details CASCADE;
CREATE VIEW v_episode_details AS
SELECT
    e.uuid,
    e.episode_number,
    e.title as episode_title,
    e.duration_minutes,
    e.air_date,
    s.uuid as series_uuid,
    s.title as series_title,
    sd.name as domain_name,
    emp.uuid as director_uuid,
    emp.first_name as director_first_name,
    emp.last_name as director_last_name,
    emp.email as director_email,
    COUNT(DISTINCT t.uuid) as transmission_count,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership,
    e.created_time,
    e.updated_time
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
JOIN employees emp ON e.director_uuid = emp.uuid AND emp.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE e.deleted = false
GROUP BY e.uuid, e.episode_number, e.title, e.duration_minutes, e.air_date,
         s.uuid, s.title, sd.name, emp.uuid, emp.first_name, emp.last_name, emp.email,
         e.created_time, e.updated_time;

-- 3. Cast and Crew View (Data View) - CORRECT (no changes needed)
DROP VIEW IF EXISTS v_series_cast_details CASCADE;
CREATE VIEW v_series_cast_details AS
SELECT
    sc.uuid,
    s.uuid as series_uuid,
    s.title as series_title,
    emp.uuid as employee_uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status as employee_status,
    r.uuid as role_uuid,
    r.name as role_name,
    r.description as role_description,
    sc.character_name,
    sc.start_date as assignment_start,
    sc.end_date as assignment_end,
    sc.created_time,
    sc.updated_time
FROM series_cast sc
JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE sc.deleted = false;

-- 4. Employee Participation View (Aggregate View) - CORRECT (already has DISTINCT)
DROP VIEW IF EXISTS v_employee_participation CASCADE;
CREATE VIEW v_employee_participation AS
SELECT
    emp.uuid as employee_uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status,
    emp.employment_date,
    COUNT(DISTINCT sc.series_uuid) as series_count,
    COUNT(DISTINCT sc.role_uuid) as role_count,
    STRING_AGG(DISTINCT r.name, ', ') as roles_played,
    STRING_AGG(DISTINCT s.title, ', ') as series_participated,
    COUNT(DISTINCT e.uuid) as episodes_directed,
    emp.created_time,
    emp.updated_time
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
LEFT JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
LEFT JOIN episodes e ON emp.uuid = e.director_uuid AND e.deleted = false
WHERE emp.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email,
         emp.status, emp.employment_date, emp.created_time, emp.updated_time;

-- 5. Available Employees View (Data View with Filter) - CORRECT (already has DISTINCT)
DROP VIEW IF EXISTS v_available_employees CASCADE;
CREATE VIEW v_available_employees AS
SELECT
    emp.uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.employment_date,
    emp.is_internal,
    emp.status,
    STRING_AGG(DISTINCT r.name, ', ') as roles
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.deleted = false AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.employment_date, emp.is_internal, emp.status;

-- 6. Transmission Schedule View (Data View)
DROP VIEW IF EXISTS v_transmission_schedule CASCADE;
CREATE VIEW v_transmission_schedule AS
SELECT
    t.uuid as transmission_uuid,
    t.transmission_time,
    t.viewership,
    e.uuid as episode_uuid,
    e.episode_number,
    e.title as episode_title,
    e.duration_minutes,
    s.uuid as series_uuid,
    s.title as series_title,
    sd.name as domain_name,
    STRING_AGG(DISTINCT c.name, ', ') as channels,
    STRING_AGG(DISTINCT c.type, ', ') as channel_types,
    COUNT(DISTINCT tc.channel_uuid) as channel_count,
    t.created_time,
    t.updated_time
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE t.deleted = false
GROUP BY t.uuid, t.transmission_time, t.viewership, e.uuid, e.episode_number,
         e.title, e.duration_minutes, s.uuid, s.title, sd.name,
         t.created_time, t.updated_time;

-- ============================================================================
-- AGGREGATE VIEWS (Performance and Analytics)
-- ============================================================================

-- 7. Series Performance View (Aggregate View)
DROP VIEW IF EXISTS v_series_performance CASCADE;
CREATE VIEW v_series_performance AS
SELECT
    s.uuid as series_uuid,
    s.title as series_title,
    sd.name as domain_name,
    COUNT(DISTINCT e.uuid) as total_episodes,
    COUNT(DISTINCT t.uuid) as total_transmissions,
    COUNT(DISTINCT tc.channel_uuid) as channels_used,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership_per_transmission,
    MAX(t.viewership) as peak_viewership,
    COUNT(DISTINCT sc.employee_uuid) as cast_size,
    AVG(e.duration_minutes) as avg_episode_duration,
    s.start_date,
    s.end_date,
    CASE
        WHEN s.end_date IS NOT NULL THEN
            (s.end_date - s.start_date)
        ELSE NULL
    END as production_days
FROM tv_series s
JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN series_cast sc ON s.uuid = sc.series_uuid AND sc.deleted = false
WHERE s.deleted = false
GROUP BY s.uuid, s.title, sd.name, s.start_date, s.end_date;

-- 8. Channel Performance View (Aggregate View)
DROP VIEW IF EXISTS v_channel_performance CASCADE;
CREATE VIEW v_channel_performance AS
SELECT
    c.uuid,
    c.name as channel_name,
    c.type as channel_type,
    COUNT(DISTINCT t.uuid) as transmissions_count,
    COUNT(DISTINCT e.uuid) as episodes_count,
    COUNT(DISTINCT s.uuid) as series_count,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership,
    MAX(t.transmission_time) as last_transmission
FROM channels c
LEFT JOIN transmission_channels tc ON c.uuid = tc.channel_uuid AND tc.deleted = false
LEFT JOIN transmissions t ON tc.transmission_uuid = t.uuid AND t.deleted = false
LEFT JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
LEFT JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE c.deleted = false
GROUP BY c.uuid, c.name, c.type;

-- 9. Production Status View (Data View with Calculated Fields)
DROP VIEW IF EXISTS v_production_status CASCADE;
CREATE VIEW v_production_status AS
SELECT
    s.uuid as series_uuid,
    s.title as series_title,
    s.start_date,
    s.end_date,
    CASE
        WHEN s.end_date IS NOT NULL THEN 'Completed'
        WHEN s.start_date IS NOT NULL THEN 'In Production'
        ELSE 'Planned'
    END as production_status,
    COUNT(DISTINCT e.uuid) as episode_count,
    COUNT(DISTINCT sc.employee_uuid) as cast_count,
    COUNT(DISTINCT CASE WHEN emp.status = 'available' THEN emp.uuid END) as available_employees,
    COUNT(DISTINCT CASE WHEN emp.status = 'busy' THEN emp.uuid END) as busy_employees,
    s.created_time,
    s.updated_time
FROM tv_series s
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
LEFT JOIN series_cast sc ON s.uuid = sc.series_uuid AND sc.deleted = false
LEFT JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
WHERE s.deleted = false
GROUP BY s.uuid, s.title, s.start_date, s.end_date, s.created_time, s.updated_time;

-- 10. Executive Dashboard View (Aggregate View)
DROP VIEW IF EXISTS v_executive_dashboard CASCADE;
CREATE VIEW v_executive_dashboard AS
SELECT
    (SELECT COUNT(*) FROM tv_series WHERE deleted = false) as active_series,
    (SELECT COUNT(*) FROM episodes WHERE deleted = false) as total_episodes,
    (SELECT COUNT(*) FROM employees WHERE deleted = false AND status = 'available') as available_cast,
    (SELECT COUNT(*) FROM transmissions WHERE deleted = false) as total_transmissions,
    (SELECT SUM(viewership) FROM transmissions WHERE deleted = false) as total_viewership,
    (SELECT COUNT(*) FROM channels WHERE deleted = false) as active_channels,
    (SELECT COUNT(DISTINCT series_uuid) FROM series_cast WHERE deleted = false) as series_with_cast;

-- ============================================================================
-- VALIDATION VIEWS (Data Integrity and Quality)
-- ============================================================================

-- 11. Data Quality Check View (Validation View)
DROP VIEW IF EXISTS v_data_quality_check CASCADE;
CREATE VIEW v_data_quality_check AS
SELECT
    'episodes_without_director' as issue_type,
    e.uuid as record_uuid,
    e.title as record_title,
    'Episode missing director assignment' as description
FROM episodes e
WHERE e.director_uuid IS NULL AND e.deleted = false

UNION ALL
SELECT
    'transmissions_without_channels' as issue_type,
    t.uuid as record_uuid,
    CONCAT('Transmission for episode ', e.episode_number) as record_title,
    'Transmission not assigned to any channel' as description
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
WHERE tc.transmission_uuid IS NULL AND t.deleted = false

UNION ALL

SELECT
    'actors_without_character' as issue_type,
    sc.uuid as record_uuid,
    CONCAT(emp.first_name, ' ', emp.last_name) as record_title,
    'Actor role missing character name' as description
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE r.name = 'Actor' AND sc.character_name IS NULL
      AND sc.deleted = false;

-- 12. Valid Employee Roles View (Validation View)
DROP VIEW IF EXISTS v_valid_employee_roles CASCADE;
CREATE VIEW v_valid_employee_roles AS
SELECT DISTINCT
    emp.uuid as employee_uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status,
    r.uuid as role_uuid,
    r.name as role_name,
    r.description as role_description,
    sc.character_name,
    sc.start_date as role_start,
    sc.end_date as role_end
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.deleted = false;

-- 13. Valid Transmission Channels View (Validation View)
DROP VIEW IF EXISTS v_valid_transmission_channels CASCADE;
CREATE VIEW v_valid_transmission_channels AS
SELECT
    t.uuid as transmission_uuid,
    t.transmission_time,
    t.viewership,
    e.episode_number,
    e.title as episode_title,
    s.title as series_title,
    c.name as channel_name,
    c.type as channel_type,
    tc.created_time
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE t.deleted = false;
