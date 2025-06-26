-- TV Company Database - Requirement Queries
-- This file contains SQL queries to answer the specific questions from the requirements
-- Requirements: TV company database for series, actors, directors, episodes, and transmissions
-- Examples: Big Sister, Bertil Bom, Wild Lies

-- JOIN Best Practices Applied:
-- 1. Always specify JOIN type explicitly (INNER, LEFT, RIGHT, FULL)
-- 2. Use meaningful table aliases
-- 3. Ensure proper indexing on JOIN columns
-- 4. Handle deleted flags in JOIN conditions for better performance

-- ============================================================================
-- CORE REQUIREMENT QUERIES
-- ============================================================================

-- Question 1: Which actors play in the series Big Sister?
-- Requirements: "Which actors play in the series Big Sister?"
-- JOIN Type: INNER JOIN (we only want actors who are actually in the series)
SELECT
    emp.first_name,
    emp.last_name,
    sc.character_name,
    s.title as series_title
FROM series_cast sc
INNER JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
INNER JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY emp.first_name, emp.last_name;

-- Question 2: In which series does the actor Bertil Bom participate?
-- Requirements: "In which series does the actor Bertil Bom participate?"
-- JOIN Type: INNER JOIN (we only want series where Bertil Bom actually participates)
SELECT
    emp.first_name,
    emp.last_name,
    s.title as series_title,
    sc.character_name,
    s.start_date,
    s.end_date
FROM series_cast sc
INNER JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
INNER JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.first_name = 'Bertil'
    AND emp.last_name = 'Bom'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY s.start_date;

-- Question 3: Which actors participate in more than one series?
-- Requirements: "Which actors participate in more than one series?"
-- JOIN Type: INNER JOIN (we only want actors who actually participate in series)
SELECT
    emp.first_name,
    emp.last_name,
    COUNT(DISTINCT s.uuid) as series_count,
    STRING_AGG(DISTINCT s.title, ', ') as series_list
FROM series_cast sc
INNER JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
INNER JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE r.name = 'Actor'
    AND sc.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name
HAVING COUNT(DISTINCT s.uuid) > 1
ORDER BY series_count DESC, emp.first_name;

-- Question 4: How many times has the first episode of the series Wild Lies been transmitted? At what times?
-- Requirements: "How many times has the first episode of the series Wild Lies been transmitted? At what times?"
-- JOIN Type: INNER JOIN for episodes/series, LEFT JOIN for transmissions (episode might not have transmissions)
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    COUNT(t.uuid) as transmission_count,
    STRING_AGG(t.transmission_time::text, ', ') as transmission_times
FROM episodes e
INNER JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND e.deleted = false
GROUP BY s.title, e.episode_number, e.title;

-- Question 5: How many directors are employed by the company?
-- Requirements: "How many directors are employed by the company?"
-- JOIN Type: INNER JOIN (we only want employees who are actually directors)
SELECT
    COUNT(DISTINCT emp.uuid) as director_count
FROM employees emp
INNER JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE r.name = 'Director'
    AND emp.status = 'available'
    AND emp.deleted = false;

-- Question 6: Which director has directed the greatest number of episodes?
-- Requirements: "Which director has directed the greatest number of episodes?"
-- JOIN Type: INNER JOIN (we only want directors who have actually directed episodes)
SELECT
    emp.first_name,
    emp.last_name,
    emp.email,
    COUNT(e.uuid) as episodes_directed,
    STRING_AGG(DISTINCT s.title, ', ') as series_directed
FROM employees emp
INNER JOIN episodes e ON emp.uuid = e.director_uuid AND e.deleted = false
INNER JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE emp.status = 'available'
    AND emp.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email
ORDER BY episodes_directed DESC
LIMIT 1;

-- ============================================================================
-- DETAILED ANALYSIS QUERIES
-- ============================================================================

-- Show all actors in Big Sister (detailed view)
-- JOIN Type: INNER JOIN (we only want actual cast members)
SELECT
    emp.first_name,
    emp.last_name,
    sc.character_name,
    sc.start_date,
    sc.end_date
FROM series_cast sc
INNER JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
INNER JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY emp.first_name, emp.last_name;

-- Show all episodes of Wild Lies with transmission details
-- JOIN Type: INNER JOIN for episodes/series/director, LEFT JOIN for transmissions
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    e.duration_minutes,
    e.air_date,
    CONCAT(dir.first_name, ' ', dir.last_name) as director,
    COUNT(t.uuid) as transmission_count
FROM episodes e
INNER JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
INNER JOIN employees dir ON e.director_uuid = dir.uuid AND dir.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.deleted = false
GROUP BY s.title, e.episode_number, e.title, e.duration_minutes, e.air_date, dir.first_name, dir.last_name
ORDER BY e.episode_number;

-- Show Bertil Bom's participation across all series
-- JOIN Type: INNER JOIN (we only want actual participations)
SELECT
    emp.first_name,
    emp.last_name,
    s.title as series_title,
    r.name as role_name,
    sc.character_name,
    sc.start_date,
    sc.end_date
FROM series_cast sc
INNER JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
INNER JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.first_name = 'Bertil'
    AND emp.last_name = 'Bom'
    AND sc.deleted = false
ORDER BY s.start_date, r.name;

-- Show all transmissions for Wild Lies Episode 1 with channel information
-- JOIN Type: INNER JOIN for transmissions/episodes/series, LEFT JOIN for channels
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    t.transmission_time,
    t.viewership,
    STRING_AGG(c.name, ', ') as channels
FROM transmissions t
INNER JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
INNER JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND t.deleted = false
GROUP BY s.title, e.episode_number, e.title, t.uuid, t.transmission_time, t.viewership
ORDER BY t.transmission_time;

-- Show all directors with their episode counts
-- JOIN Type: INNER JOIN for series_cast/roles, LEFT JOIN for episodes/series
SELECT
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status,
    COUNT(e.uuid) as episodes_directed,
    COUNT(DISTINCT s.uuid) as series_directed
FROM employees emp
INNER JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
LEFT JOIN episodes e ON emp.uuid = e.director_uuid AND e.deleted = false
LEFT JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE r.name = 'Director'
    AND emp.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.status
ORDER BY episodes_directed DESC, emp.first_name;

-- ============================================================================
-- DEMONSTRATION QUERIES
-- ============================================================================

-- Show all actors in a specific series
-- JOIN Type: INNER JOIN (we only want actual cast members)
SELECT
    emp.first_name,
    emp.last_name,
    sc.character_name
FROM series_cast sc
INNER JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
INNER JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
ORDER BY emp.first_name;

-- Show all episodes of a series
-- JOIN Type: INNER JOIN (we only want actual episodes)
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    e.duration_minutes,
    e.air_date
FROM episodes e
INNER JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.deleted = false
ORDER BY e.episode_number;

-- Show all transmissions for an episode
-- JOIN Type: INNER JOIN (we only want actual transmissions)
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    t.transmission_time,
    t.viewership
FROM transmissions t
INNER JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
INNER JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND t.deleted = false
ORDER BY t.transmission_time;

-- ============================================================================
-- REFERENCE QUERIES
-- ============================================================================

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

-- ============================================================================
-- ADVANCED QUERIES WITH PROPER JOIN USAGE
-- ============================================================================

-- List all employees with their roles (Improved version with proper JOINs)
-- JOIN Type: INNER JOIN for series_cast/roles, LEFT JOIN for series (employee might not be in any series)
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
INNER JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
INNER JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
LEFT JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
WHERE emp.deleted = false
GROUP BY
    emp.uuid, emp.first_name, emp.last_name, emp.email,
    emp.status, emp.employment_date, r.name, r.description
ORDER BY
    r.name, emp.last_name, emp.first_name;

-- Show series with their cast and crew counts
-- JOIN Type: LEFT JOIN (we want all series, even those without cast)
SELECT
    s.title as series_title,
    sd.name as domain_name,
    COUNT(DISTINCT CASE WHEN r.name = 'Actor' THEN sc.employee_uuid END) as actor_count,
    COUNT(DISTINCT CASE WHEN r.name = 'Director' THEN sc.employee_uuid END) as director_count,
    COUNT(DISTINCT e.uuid) as episode_count,
    COUNT(DISTINCT t.uuid) as transmission_count
FROM tv_series s
LEFT JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
LEFT JOIN series_cast sc ON s.uuid = sc.series_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE s.deleted = false
GROUP BY s.uuid, s.title, sd.name
ORDER BY s.title;

-- Show channel performance with transmission details
-- JOIN Type: LEFT JOIN (we want all channels, even those without transmissions)
SELECT
    c.name as channel_name,
    c.type as channel_type,
    COUNT(DISTINCT t.uuid) as transmission_count,
    COUNT(DISTINCT e.uuid) as episode_count,
    COUNT(DISTINCT s.uuid) as series_count,
    SUM(t.viewership) as total_viewership,
    AVG(t.viewership) as avg_viewership
FROM channels c
LEFT JOIN transmission_channels tc ON c.uuid = tc.channel_uuid AND tc.deleted = false
LEFT JOIN transmissions t ON tc.transmission_uuid = t.uuid AND t.deleted = false
LEFT JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
LEFT JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
WHERE c.deleted = false
GROUP BY c.uuid, c.name, c.type
ORDER BY total_viewership DESC NULLS LAST;


-- Query: How many employees participated in the specific channel A
SELECT *
FROM tv_company.series_cast sc
JOIN tv_company.episodes e ON sc.series_uuid = e.series_uuid
JOIN tv_company.transmissions t ON e.uuid = t.episode_uuid
JOIN tv_company.transmission_channels tc ON t.uuid = tc.transmission_uuid
JOIN tv_company.channels c ON tc.channel_uuid = c.uuid
WHERE c.name = 'TV1'  -- Replace 'Channel A' with the actual channel name
  AND sc.deleted = FALSE
  AND e.deleted = FALSE
  AND t.deleted = FALSE
  AND tc.deleted = FALSE
  AND c.deleted = FALSE;


-- How many employees with role "Actor" participated in series transmitted on channel "TV1"
SELECT DISTINCT
    e.first_name,
    e.last_name,
    e.email,
    r.name as role_name,
    ts.title as series_title
FROM tv_company.series_cast sc
JOIN tv_company.employees e ON sc.employee_uuid = e.uuid
JOIN tv_company.roles r ON sc.role_uuid = r.uuid
JOIN tv_company.tv_series ts ON sc.series_uuid = ts.uuid
JOIN tv_company.episodes ep ON sc.series_uuid = ep.series_uuid
JOIN tv_company.transmissions t ON ep.uuid = t.episode_uuid
JOIN tv_company.transmission_channels tc ON t.uuid = tc.transmission_uuid
JOIN tv_company.channels c ON tc.channel_uuid = c.uuid
WHERE c.name = 'TV1' AND r.name = 'Actor'
  AND sc.deleted = FALSE
  AND e.deleted = FALSE
  AND r.deleted = FALSE
  AND ts.deleted = FALSE
  AND ep.deleted = FALSE
  AND t.deleted = FALSE
  AND tc.deleted = FALSE
  AND c.deleted = FALSE
ORDER BY e.last_name, e.first_name;
