-- TV Company Database - Requirement Queries
-- This file contains SQL queries to answer the specific questions from the requirements
-- Requirements: TV company database for series, actors, directors, episodes, and transmissions
-- Examples: Big Sister, Bertil Bom, Wild Lies

-- Question 1: Which actors play in the series Big Sister?
-- Requirements: "Which actors play in the series Big Sister?"
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
    AND emp.deleted = false
    AND s.deleted = false
ORDER BY emp.first_name, emp.last_name;

-- Question 2: In which series does the actor Bertil Bom participate?
-- Requirements: "In which series does the actor Bertil Bom participate?"
SELECT
    emp.first_name,
    emp.last_name,
    s.title as series_title,
    sc.character_name,
    s.start_date,
    s.end_date
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE emp.first_name = 'Bertil'
    AND emp.last_name = 'Bom'
    AND r.name = 'Actor'
    AND sc.deleted = false
    AND emp.deleted = false
    AND s.deleted = false
ORDER BY s.start_date;

-- Question 3: Which actors participate in more than one series?
-- Requirements: "Which actors participate in more than one series?"
SELECT
    emp.first_name,
    emp.last_name,
    COUNT(DISTINCT s.uuid) as series_count,
    STRING_AGG(DISTINCT s.title, ', ') as series_list
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Actor'
    AND sc.deleted = false
    AND emp.deleted = false
    AND s.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name
HAVING COUNT(DISTINCT s.uuid) > 1
ORDER BY series_count DESC, emp.first_name;

-- Question 4: How many times has the first episode of the series Wild Lies been transmitted? At what times?
-- Requirements: "How many times has the first episode of the series Wild Lies been transmitted? At what times?"
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    COUNT(t.uuid) as transmission_count,
    STRING_AGG(t.transmission_time::text, ', ') as transmission_times
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND e.deleted = false
    AND s.deleted = false
GROUP BY s.title, e.episode_number, e.title;

-- Question 5: How many directors are employed by the company?
-- Requirements: "How many directors are employed by the company?"
SELECT
    COUNT(DISTINCT emp.uuid) as director_count
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Director'
    AND emp.status = 'available'
    AND sc.deleted = false
    AND emp.deleted = false
    AND r.deleted = false;

-- Question 6: Which director has directed the greatest number of episodes?
-- Requirements: "Which director has directed the greatest number of episodes?"
SELECT
    emp.first_name,
    emp.last_name,
    emp.email,
    COUNT(e.uuid) as episodes_directed,
    STRING_AGG(DISTINCT s.title, ', ') as series_directed
FROM employees emp
JOIN episodes e ON emp.uuid = e.director_uuid
JOIN tv_series s ON e.series_uuid = s.uuid
WHERE e.deleted = false
    AND emp.status = 'available'
    AND emp.deleted = false
    AND s.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email
ORDER BY episodes_directed DESC
LIMIT 1;

-- Additional Queries Based on Requirements Analysis

-- Show all actors in Big Sister (detailed view)
SELECT
    emp.first_name,
    emp.last_name,
    sc.character_name,
    sc.start_date,
    sc.end_date
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
    AND emp.deleted = false
    AND s.deleted = false
ORDER BY emp.first_name, emp.last_name;

-- Show all episodes of Wild Lies with transmission details
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    e.duration_minutes,
    e.air_date,
    CONCAT(dir.first_name, ' ', dir.last_name) as director,
    COUNT(t.uuid) as transmission_count
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN employees dir ON e.director_uuid = dir.uuid
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.deleted = false
    AND s.deleted = false
    AND dir.deleted = false
GROUP BY s.title, e.episode_number, e.title, e.duration_minutes, e.air_date, dir.first_name, dir.last_name
ORDER BY e.episode_number;

-- Show Bertil Bom's participation across all series
SELECT
    emp.first_name,
    emp.last_name,
    s.title as series_title,
    r.name as role_name,
    sc.character_name,
    sc.start_date,
    sc.end_date
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE emp.first_name = 'Bertil'
    AND emp.last_name = 'Bom'
    AND sc.deleted = false
    AND emp.deleted = false
    AND s.deleted = false
ORDER BY s.start_date, r.name;

-- Show all transmissions for Wild Lies Episode 1 with channel information
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    t.transmission_time,
    t.viewership,
    STRING_AGG(c.name, ', ') as channels
FROM transmissions t
JOIN episodes e ON t.episode_uuid = e.uuid
JOIN tv_series s ON e.series_uuid = s.uuid
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND t.deleted = false
    AND e.deleted = false
    AND s.deleted = false
GROUP BY s.title, e.episode_number, e.title, t.uuid, t.transmission_time, t.viewership
ORDER BY t.transmission_time;

-- Show all directors with their episode counts
SELECT
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status,
    COUNT(e.uuid) as episodes_directed,
    COUNT(DISTINCT s.uuid) as series_directed
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
JOIN roles r ON sc.role_uuid = r.uuid
LEFT JOIN episodes e ON emp.uuid = e.director_uuid AND e.deleted = false
LEFT JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE r.name = 'Director'
    AND sc.deleted = false
    AND emp.deleted = false
    AND r.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.status
ORDER BY episodes_directed DESC, emp.first_name;

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
    AND emp.deleted = false
    AND s.deleted = false
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
    AND s.deleted = false
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
    AND e.deleted = false
    AND s.deleted = false
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

-- Show all roles
SELECT
    name,
    description
FROM roles
WHERE deleted = false
ORDER BY name;

-- Show all series domains
SELECT
    name,
    description
FROM series_domains
WHERE deleted = false
ORDER BY name;

-- List all employees with their roles (Improved version)
SELECT DISTINCT
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status,
    emp.employment_date,
    r.name as role_name,
    r.description as role_description,
    STRING_AGG(DISTINCT s.title, ', ') as series_participated,
    COUNT(DISTINCT s.uuid) as series_count,
    STRING_AGG(DISTINCT sc.character_name, ', ') as characters_played
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
LEFT JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
WHERE emp.deleted = false
GROUP BY
    emp.uuid, emp.first_name, emp.last_name, emp.email,
    emp.status, emp.employment_date, r.name, r.description
ORDER BY
    r.name, emp.last_name, emp.first_name;
