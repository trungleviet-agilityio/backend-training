-- TV Company Database - Requirement Queries
-- This file contains SQL queries to answer the specific questions from the requirements

-- Question 1: Which actors play in the series Big Sister?
SELECT
    emp.name as actor_name,
    esr.character_name,
    s.title as series_title
FROM employee_series_roles esr
JOIN employees emp ON esr.employee_uuid = emp.uuid
JOIN tv_series s ON esr.series_uuid = s.uuid
JOIN roles r ON esr.role_uuid = r.uuid
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND esr.deleted = FALSE
    AND s.deleted = FALSE
    AND emp.deleted = FALSE
    AND r.deleted = FALSE
ORDER BY emp.name;

-- Question 2: In which series does the actor Bertil Bom participate?
SELECT
    emp.name as actor_name,
    s.title as series_title,
    esr.character_name,
    s.start_date,
    s.end_date
FROM employee_series_roles esr
JOIN employees emp ON esr.employee_uuid = emp.uuid
JOIN tv_series s ON esr.series_uuid = s.uuid
JOIN roles r ON esr.role_uuid = r.uuid
WHERE emp.name = 'Bertil Bom'
    AND r.name = 'Actor'
    AND esr.deleted = FALSE
    AND s.deleted = FALSE
    AND emp.deleted = FALSE
    AND r.deleted = FALSE
ORDER BY s.start_date;

-- Question 3: Which actors participate in more than one series?
SELECT
    emp.name as actor_name,
    COUNT(DISTINCT s.uuid) as series_count,
    STRING_AGG(s.title, ', ') as series_list
FROM employee_series_roles esr
JOIN employees emp ON esr.employee_uuid = emp.uuid
JOIN tv_series s ON esr.series_uuid = s.uuid
JOIN roles r ON esr.role_uuid = r.uuid
WHERE r.name = 'Actor'
    AND esr.deleted = FALSE
    AND s.deleted = FALSE
    AND emp.deleted = FALSE
    AND r.deleted = FALSE
GROUP BY emp.uuid, emp.name
HAVING COUNT(DISTINCT s.uuid) > 1
ORDER BY series_count DESC, emp.name;

-- Question 4: How many times has the first episode of the series Wild Lies been transmitted? At what times?
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    COUNT(t.uuid) as transmission_count,
    STRING_AGG(t.transmission_time::text, ', ') as transmission_times,
    STRING_AGG(c.name, ', ') as channels
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = FALSE
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = FALSE
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = FALSE
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND e.deleted = FALSE
    AND s.deleted = FALSE
GROUP BY s.title, e.episode_number, e.title;

-- Question 5: How many directors are employed by the company?
SELECT
    COUNT(DISTINCT emp.uuid) as director_count
FROM employees emp
JOIN employee_roles er ON emp.uuid = er.employee_uuid
JOIN roles r ON er.role_uuid = r.uuid
WHERE r.name = 'Director'
    AND er.is_active = TRUE
    AND emp.status = 'active'
    AND emp.deleted = FALSE
    AND er.deleted = FALSE
    AND r.deleted = FALSE;

-- Question 6: Which director has directed the greatest number of episodes?
SELECT
    emp.name as director_name,
    emp.email as director_email,
    COUNT(e.uuid) as episodes_directed,
    STRING_AGG(DISTINCT s.title, ', ') as series_directed
FROM employees emp
JOIN episodes e ON emp.uuid = e.director_uuid
JOIN tv_series s ON e.series_uuid = s.uuid
WHERE e.deleted = FALSE
    AND s.deleted = FALSE
    AND emp.deleted = FALSE
    AND emp.status = 'active'
GROUP BY emp.uuid, emp.name, emp.email
ORDER BY episodes_directed DESC
LIMIT 1;

-- Additional Bonus Queries

-- Bonus 1: Show all series with their episode counts and average viewership
SELECT
    s.title as series_title,
    sd.name as domain,
    COUNT(e.uuid) as episode_count,
    ROUND(AVG(t.viewership), 0) as avg_viewership,
    SUM(t.viewership) as total_viewership
FROM tv_series s
JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = FALSE
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = FALSE
WHERE s.deleted = FALSE
GROUP BY s.uuid, s.title, sd.name
ORDER BY avg_viewership DESC NULLS LAST;

-- Bonus 2: Show multi-channel transmissions (episodes broadcast on multiple channels)
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    t.transmission_time,
    COUNT(tc.channel_uuid) as channel_count,
    STRING_AGG(c.name, ', ') as channels
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid
JOIN channels c ON tc.channel_uuid = c.uuid
WHERE t.deleted = FALSE
    AND e.deleted = FALSE
    AND s.deleted = FALSE
    AND tc.deleted = FALSE
    AND c.deleted = FALSE
GROUP BY s.title, e.episode_number, e.title, t.uuid, t.transmission_time
HAVING COUNT(tc.channel_uuid) > 1
ORDER BY channel_count DESC, t.transmission_time;

-- Bonus 3: Show employee participation across different roles
SELECT
    emp.name as employee_name,
    emp.email,
    COUNT(DISTINCT er.role_uuid) as company_roles,
    COUNT(DISTINCT esr.series_uuid) as series_participation,
    STRING_AGG(DISTINCT r.name, ', ') as roles_held
FROM employees emp
LEFT JOIN employee_roles er ON emp.uuid = er.employee_uuid AND er.is_active = TRUE
LEFT JOIN employee_series_roles esr ON emp.uuid = esr.employee_uuid AND esr.deleted = FALSE
LEFT JOIN roles r ON er.role_uuid = r.uuid
WHERE emp.deleted = FALSE
    AND emp.status = 'active'
GROUP BY emp.uuid, emp.name, emp.email
ORDER BY company_roles DESC, series_participation DESC;
