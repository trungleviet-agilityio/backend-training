-- TV Company Database Views
-- This file creates all the views for different user access patterns

-- Production Views

-- 1. Series Overview View
DROP VIEW IF EXISTS series_overview CASCADE;
CREATE VIEW series_overview AS
SELECT
    tvs.uuid,
    tvs.title,
    tvs.description,
    sd.name as domain_name,
    tvs.start_date,
    tvs.end_date,
    COUNT(e.uuid) as episode_count,
    CASE
        WHEN tvs.end_date IS NULL THEN 'Ongoing'
        ELSE 'Completed'
    END as status
FROM tv_series tvs
JOIN series_domains sd ON tvs.domain_uuid = sd.uuid
LEFT JOIN episodes e ON tvs.uuid = e.series_uuid AND e.deleted = FALSE
WHERE tvs.deleted = FALSE
GROUP BY tvs.uuid, tvs.title, tvs.description, sd.name, tvs.start_date, tvs.end_date;

-- 2. Episode Production View
DROP VIEW IF EXISTS episode_production CASCADE;
CREATE VIEW episode_production AS
SELECT
    e.uuid,
    e.episode_number,
    e.title,
    e.duration_minutes,
    e.air_date,
    s.title as series_title,
    emp.first_name || ' ' || emp.last_name as director_name,
    emp.email as director_email,
    COUNT(t.uuid) as transmission_count,
    MAX(t.transmission_time) as last_transmission
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN employees emp ON e.director_uuid = emp.uuid
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = FALSE
WHERE e.deleted = FALSE AND s.deleted = FALSE AND emp.deleted = FALSE
GROUP BY e.uuid, e.episode_number, e.title, e.duration_minutes, e.air_date, s.title, emp.first_name, emp.last_name, emp.email;

-- 3. Cast and Crew View
DROP VIEW IF EXISTS cast_and_crew CASCADE;
CREATE VIEW cast_and_crew AS
SELECT
    s.title as series_title,
    emp.first_name || ' ' || emp.last_name as employee_name,
    emp.email as employee_email,
    r.name as role_name,
    esr.character_name,
    esr.start_date,
    esr.end_date,
    d.name as department_name
FROM employee_series_roles esr
JOIN tv_series s ON esr.series_uuid = s.uuid
JOIN employees emp ON esr.employee_uuid = emp.uuid
JOIN roles r ON esr.role_uuid = r.uuid
JOIN departments d ON r.department_uuid = d.uuid
WHERE esr.deleted = FALSE
    AND s.deleted = FALSE
    AND emp.deleted = FALSE
    AND r.deleted = FALSE
ORDER BY s.title, r.name, emp.first_name, emp.last_name;

-- HR Views

-- 4. Employee Directory View
DROP VIEW IF EXISTS employee_directory CASCADE;
CREATE VIEW employee_directory AS
SELECT
    emp.uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.birthdate,
    emp.employment_date,
    emp.is_internal,
    emp.status,
    EXTRACT(YEAR FROM AGE(current_date, emp.birthdate)) AS age,
    EXTRACT(YEAR FROM AGE(current_date, emp.employment_date)) AS years_of_employment,
    STRING_AGG(r.name, ', ') as current_roles,
    STRING_AGG(d.name, ', ') as departments
FROM employees emp
LEFT JOIN employee_roles er ON emp.uuid = er.employee_uuid AND er.is_active = TRUE AND er.deleted = FALSE
LEFT JOIN roles r ON er.role_uuid = r.uuid
LEFT JOIN departments d ON r.department_uuid = d.uuid
WHERE emp.deleted = FALSE
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.birthdate, emp.employment_date, emp.is_internal, emp.status;

-- 5. Active Employees View
DROP VIEW IF EXISTS active_employees CASCADE;
CREATE VIEW active_employees AS
SELECT
    emp.uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.employment_date,
    emp.is_internal,
    EXTRACT(YEAR FROM AGE(current_date, emp.birthdate)) AS age,
    EXTRACT(YEAR FROM AGE(current_date, emp.employment_date)) AS years_of_employment,
    STRING_AGG(r.name, ', ') as roles
FROM employees emp
JOIN employee_roles er ON emp.uuid = er.employee_uuid AND er.is_active = TRUE AND er.deleted = FALSE
JOIN roles r ON er.role_uuid = r.uuid
WHERE emp.deleted = FALSE
    AND emp.status = 'active'
    AND r.deleted = FALSE
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.employment_date, emp.is_internal;

-- 6. Employee Performance View
DROP VIEW IF EXISTS employee_performance CASCADE;
CREATE VIEW employee_performance AS
SELECT
    emp.uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    r.name as role_name,
    COUNT(DISTINCT esr.series_uuid) as series_participation_count,
    COUNT(DISTINCT e.uuid) as episodes_directed,
    MAX(e.air_date) as last_episode_date
FROM employees emp
LEFT JOIN employee_series_roles esr ON emp.uuid = esr.employee_uuid AND esr.deleted = FALSE
LEFT JOIN roles r ON esr.role_uuid = r.uuid
LEFT JOIN episodes e ON emp.uuid = e.director_uuid AND e.deleted = FALSE
WHERE emp.deleted = FALSE AND emp.status = 'active'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, r.name;

-- Analytics Views

-- 7. Transmission Analytics View
DROP VIEW IF EXISTS transmission_analytics CASCADE;
CREATE VIEW transmission_analytics AS
SELECT
    t.uuid as transmission_uuid,
    e.episode_number,
    e.title as episode_title,
    s.title as series_title,
    t.transmission_time,
    t.viewership,
    STRING_AGG(c.name, ', ') as channels,
    COUNT(tc.channel_uuid) as channel_count,
    sd.name as series_domain
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = FALSE
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = FALSE
WHERE t.deleted = FALSE
    AND e.deleted = FALSE
    AND s.deleted = FALSE
GROUP BY t.uuid, e.episode_number, e.title, s.title, t.transmission_time, t.viewership, sd.name;

-- 8. Series Performance View
DROP VIEW IF EXISTS series_performance CASCADE;
CREATE VIEW series_performance AS
SELECT
    s.uuid,
    s.title,
    sd.name as domain,
    s.start_date,
    s.end_date,
    COUNT(DISTINCT e.uuid) as total_episodes,
    COUNT(DISTINCT t.uuid) as total_transmissions,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership,
    MAX(t.viewership) as peak_viewership,
    COUNT(DISTINCT tc.channel_uuid) as channels_used
FROM tv_series s
JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = FALSE
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = FALSE
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = FALSE
WHERE s.deleted = FALSE
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
LEFT JOIN transmission_channels tc ON c.uuid = tc.channel_uuid AND tc.deleted = FALSE
LEFT JOIN transmissions t ON tc.transmission_uuid = t.uuid AND t.deleted = FALSE
LEFT JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = FALSE
LEFT JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = FALSE
WHERE c.deleted = FALSE
GROUP BY c.uuid, c.name, c.type;

-- Management Views

-- 10. Executive Dashboard View
DROP VIEW IF EXISTS executive_dashboard CASCADE;
CREATE VIEW executive_dashboard AS
SELECT
    (SELECT COUNT(*) FROM tv_series WHERE deleted = FALSE) as active_series,
    (SELECT COUNT(*) FROM episodes WHERE deleted = FALSE) as total_episodes,
    (SELECT COUNT(*) FROM employees WHERE deleted = FALSE AND status = 'active') as active_employees,
    (SELECT COUNT(*) FROM transmissions WHERE deleted = FALSE) as total_transmissions,
    (SELECT SUM(viewership) FROM transmissions WHERE deleted = FALSE) as total_viewership,
    (SELECT COUNT(*) FROM channels WHERE deleted = FALSE) as active_channels,
    (SELECT COUNT(DISTINCT series_uuid) FROM employee_series_roles WHERE deleted = FALSE) as series_with_employees;

-- 11. Department Overview View
DROP VIEW IF EXISTS department_overview CASCADE;
CREATE VIEW department_overview AS
SELECT
    d.uuid,
    d.name as department_name,
    d.description,
    COUNT(DISTINCT r.uuid) as roles_count,
    COUNT(DISTINCT emp.uuid) as employees_count,
    COUNT(DISTINCT CASE WHEN emp.status = 'active' THEN emp.uuid END) as active_employees
FROM departments d
LEFT JOIN roles r ON d.uuid = r.department_uuid AND r.deleted = FALSE
LEFT JOIN employee_roles er ON r.uuid = er.role_uuid AND er.is_active = TRUE AND er.deleted = FALSE
LEFT JOIN employees emp ON er.employee_uuid = emp.uuid AND emp.deleted = FALSE
WHERE d.deleted = FALSE
GROUP BY d.uuid, d.name, d.description;
