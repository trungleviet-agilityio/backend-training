-- TV Company Database Views
-- This file creates all the views for different user access patterns

-- Production Views

-- 1. Series Overview View
DROP VIEW IF EXISTS series_overview CASCADE;
CREATE VIEW series_overview AS
SELECT
    s.uuid,
    s.title,
    s.description,
    s.start_date,
    s.end_date,
    sd.name as domain_name,
    sd.description as domain_description,
    COUNT(e.uuid) as episode_count,
    AVG(e.duration_minutes) as avg_episode_duration,
    MIN(e.air_date) as first_episode_air_date,
    MAX(e.air_date) as last_episode_air_date,
    s.created_time,
    s.updated_time
FROM tv_series s
LEFT JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
WHERE s.deleted = false
GROUP BY s.uuid, s.title, s.description, s.start_date, s.end_date,
         sd.name, sd.description, s.created_time, s.updated_time;

-- 2. Episode Details View
DROP VIEW IF EXISTS episode_details CASCADE;
CREATE VIEW episode_details AS
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
    COUNT(t.uuid) as transmission_count,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership,
    e.created_time,
    e.updated_time
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN series_domains sd ON s.domain_uuid = sd.uuid
JOIN employees emp ON e.director_uuid = emp.uuid
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE e.deleted = false AND s.deleted = false AND emp.deleted = false
GROUP BY e.uuid, e.episode_number, e.title, e.duration_minutes, e.air_date,
         s.uuid, s.title, sd.name, emp.uuid, emp.first_name, emp.last_name, emp.email,
         e.created_time, e.updated_time;

-- 3. Cast and Crew View
DROP VIEW IF EXISTS series_cast_details CASCADE;
CREATE VIEW series_cast_details AS
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
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE sc.deleted = false AND s.deleted = false
      AND emp.deleted = false AND r.deleted = false;

-- Employee Management Views

-- 4. Employee Participation View
DROP VIEW IF EXISTS employee_participation CASCADE;
CREATE VIEW employee_participation AS
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

-- 5. Available Employees View
DROP VIEW IF EXISTS available_employees CASCADE;
CREATE VIEW available_employees AS
SELECT
    emp.uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.employment_date,
    emp.is_internal,
    EXTRACT(YEAR FROM AGE(current_date, emp.birthdate)) AS age,
    EXTRACT(YEAR FROM AGE(current_date, emp.employment_date)) AS years_of_employment,
    STRING_AGG(DISTINCT r.name, ', ') as roles
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.deleted = false
    AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.employment_date, emp.is_internal;

-- Analytics Views

-- 6. Transmission Schedule View
DROP VIEW IF EXISTS transmission_schedule CASCADE;
CREATE VIEW transmission_schedule AS
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
    STRING_AGG(c.name, ', ') as channels,
    STRING_AGG(c.type, ', ') as channel_types,
    COUNT(tc.channel_uuid) as channel_count,
    t.created_time,
    t.updated_time
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE t.deleted = false AND e.deleted = false
      AND s.deleted = false AND sd.deleted = false
GROUP BY t.uuid, t.transmission_time, t.viewership, e.uuid, e.episode_number,
         e.title, e.duration_minutes, s.uuid, s.title, sd.name,
         t.created_time, t.updated_time;

-- 7. Viewership Analytics View
DROP VIEW IF EXISTS viewership_analytics CASCADE;
CREATE VIEW viewership_analytics AS
SELECT
    s.uuid as series_uuid,
    s.title as series_title,
    sd.name as domain_name,
    e.uuid as episode_uuid,
    e.episode_number,
    e.title as episode_title,
    c.uuid as channel_uuid,
    c.name as channel_name,
    c.type as channel_type,
    COUNT(t.uuid) as transmission_count,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership,
    MAX(t.viewership) as max_viewership,
    MIN(t.viewership) as min_viewership,
    t.transmission_time,
    e.created_time,
    e.updated_time
FROM tv_series s
JOIN series_domains sd ON s.domain_uuid = sd.uuid
JOIN episodes e ON s.uuid = e.series_uuid
JOIN transmissions t ON e.uuid = t.episode_uuid
JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid
JOIN channels c ON tc.channel_uuid = c.uuid
WHERE s.deleted = false AND e.deleted = false
      AND t.deleted = false AND c.deleted = false
GROUP BY s.uuid, s.title, sd.name, e.uuid, e.episode_number, e.title,
         c.uuid, c.name, c.type, t.transmission_time, e.created_time, e.updated_time;

-- 8. Series Performance View
DROP VIEW IF EXISTS series_performance CASCADE;
CREATE VIEW series_performance AS
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
JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN series_cast sc ON s.uuid = sc.series_uuid AND sc.deleted = false
WHERE s.deleted = false AND sd.deleted = false
GROUP BY s.uuid, s.title, sd.name, s.start_date, s.end_date;

-- 9. Channel Performance View
DROP VIEW IF EXISTS channel_performance CASCADE;
CREATE VIEW channel_performance AS
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

-- Management Views

-- 10. Production Status View
DROP VIEW IF EXISTS production_status CASCADE;
CREATE VIEW production_status AS
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

-- 11. Executive Dashboard View
DROP VIEW IF EXISTS executive_dashboard CASCADE;
CREATE VIEW executive_dashboard AS
SELECT
    (SELECT COUNT(*) FROM tv_series WHERE deleted = false) as active_series,
    (SELECT COUNT(*) FROM episodes WHERE deleted = false) as total_episodes,
    (SELECT COUNT(*) FROM employees WHERE deleted = false AND status = 'available') as available_cast,
    (SELECT COUNT(*) FROM transmissions WHERE deleted = false) as total_transmissions,
    (SELECT SUM(viewership) FROM transmissions WHERE deleted = false) as total_viewership,
    (SELECT COUNT(*) FROM channels WHERE deleted = false) as active_channels,
    (SELECT COUNT(DISTINCT series_uuid) FROM series_cast WHERE deleted = false) as series_with_cast;

-- 12. Data Quality View
DROP VIEW IF EXISTS data_quality_check CASCADE;
CREATE VIEW data_quality_check AS
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
JOIN episodes e ON t.episode_uuid = e.uuid
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
WHERE tc.transmission_uuid IS NULL AND t.deleted = false

UNION ALL

SELECT
    'actors_without_character' as issue_type,
    sc.uuid as record_uuid,
    CONCAT(emp.first_name, ' ', emp.last_name) as record_title,
    'Actor role missing character name' as description
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Actor' AND sc.character_name IS NULL
      AND sc.deleted = false AND emp.deleted = false AND r.deleted = false;
