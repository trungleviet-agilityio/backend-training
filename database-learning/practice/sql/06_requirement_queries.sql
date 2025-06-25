-- TV Company Database - Requirement Queries
-- This file contains SQL queries to answer the specific questions from the requirements

-- Question 1: Which actors play in the series Big Sister?
SELECT
    emp.first_name,
    emp.last_name,
    sc.character_name,
    s.title as series_title
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY emp.first_name, emp.last_name;

-- Question 2: In which series does the actor Bertil Bom participate?
SELECT
    emp.first_name,
    emp.last_name,
    s.title as series_title,
    sc.character_name,
    s.start_date
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE emp.first_name = 'Bertil'
    AND emp.last_name = 'Bom'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY s.start_date;

-- Question 3: Which actors participate in more than one series?
SELECT
    emp.first_name,
    emp.last_name,
    COUNT(DISTINCT s.uuid) as series_count
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Actor'
    AND sc.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name
HAVING COUNT(DISTINCT s.uuid) > 1
ORDER BY series_count DESC, emp.first_name;

-- Question 4: How many times has the first episode of the series Wild Lies been transmitted?
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    COUNT(t.uuid) as transmission_count
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND e.deleted = false
GROUP BY s.title, e.episode_number, e.title;

-- Question 5: How many directors are employed by the company?
SELECT
    COUNT(DISTINCT emp.uuid) as director_count
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Director'
    AND emp.status = 'available'
    AND sc.deleted = false;

-- Question 6: Which director has directed the greatest number of episodes?
SELECT
    emp.first_name,
    emp.last_name,
    emp.email,
    COUNT(e.uuid) as episodes_directed
FROM employees emp
JOIN episodes e ON emp.uuid = e.director_uuid
WHERE e.deleted = false
    AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email
ORDER BY episodes_directed DESC
LIMIT 1;

-- Additional Simple Queries

-- Bonus 1: Show all series with their episode counts
SELECT
    s.title as series_title,
    sd.name as domain,
    COUNT(e.uuid) as episode_count
FROM tv_series s
JOIN series_domains sd ON s.domain_uuid = sd.uuid
LEFT JOIN episodes e ON s.uuid = e.series_uuid
WHERE s.deleted = false
GROUP BY s.uuid, s.title, sd.name
ORDER BY episode_count DESC;

-- Bonus 2: Show episodes broadcast on multiple channels
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    COUNT(tc.channel_uuid) as channel_count
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid
WHERE t.deleted = false
GROUP BY s.title, e.episode_number, e.title, t.uuid
HAVING COUNT(tc.channel_uuid) > 1
ORDER BY channel_count DESC;

-- Bonus 3: Show employees with their roles
SELECT
    emp.first_name,
    emp.last_name,
    emp.email,
    r.name as role_name
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE sc.deleted = false
ORDER BY emp.first_name, emp.last_name, r.name;

-- Bonus 4: Show series by domain
SELECT
    sd.name as domain,
    COUNT(s.uuid) as series_count
FROM series_domains sd
LEFT JOIN tv_series s ON sd.uuid = s.domain_uuid
WHERE s.deleted = false OR s.deleted IS NULL
GROUP BY sd.uuid, sd.name
ORDER BY series_count DESC;

-- Bonus 5: Show employees who work in multiple series
SELECT
    emp.first_name,
    emp.last_name,
    COUNT(DISTINCT sc.series_uuid) as series_count
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
WHERE sc.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name
HAVING COUNT(DISTINCT sc.series_uuid) > 1
ORDER BY series_count DESC, emp.first_name;

-- Simple demonstration queries

-- Show all actors in a specific series
SELECT
    emp.first_name,
    emp.last_name,
    sc.character_name
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY emp.first_name;

-- Show all episodes of a series
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    e.duration_minutes,
    e.air_date
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
WHERE s.title = 'Wild Lies'
    AND e.deleted = false
ORDER BY e.episode_number;

-- Show all transmissions for an episode
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    t.transmission_time,
    t.viewership
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid
JOIN tv_series s ON e.series_uuid = s.uuid
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND t.deleted = false
ORDER BY t.transmission_time;

-- Show all channels
SELECT
    name,
    type,
    description
FROM channels
WHERE deleted = false
ORDER BY name;

-- Show all employees by status
SELECT
    first_name,
    last_name,
    email,
    status
FROM employees
WHERE deleted = false
ORDER BY status, first_name, last_name;
