-- TV Company Database - Requirement Queries
-- This file contains SQL queries to answer the specific questions from the requirements

-- Question 1: Which actors play in the series Big Sister?
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as actor_name,
    sc.character_name,
    s.title as series_title
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE s.title = 'Big Sister'
    AND r.name = 'Actor'
    AND sc.deleted = false
    AND s.deleted = false
    AND emp.deleted = false
    AND r.deleted = false
ORDER BY emp.first_name, emp.last_name;

-- Question 2: In which series does the actor Bertil Bom participate?
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as actor_name,
    s.title as series_title,
    sc.character_name,
    s.start_date,
    s.end_date
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE emp.first_name = 'Bertil' AND emp.last_name = 'Bom'
    AND r.name = 'Actor'
    AND sc.deleted = false
    AND s.deleted = false
    AND emp.deleted = false
    AND r.deleted = false
ORDER BY s.start_date;

-- Question 3: Which actors participate in more than one series?
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as actor_name,
    COUNT(DISTINCT s.uuid) as series_count,
    STRING_AGG(s.title, ', ') as series_list
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Actor'
    AND sc.deleted = false
    AND s.deleted = false
    AND emp.deleted = false
    AND r.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name
HAVING COUNT(DISTINCT s.uuid) > 1
ORDER BY series_count DESC, emp.first_name, emp.last_name;

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
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE s.title = 'Wild Lies'
    AND e.episode_number = 1
    AND e.deleted = false
    AND s.deleted = false
GROUP BY s.title, e.episode_number, e.title;

-- Question 5: How many directors are employed by the company?
SELECT
    COUNT(DISTINCT emp.uuid) as director_count
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name = 'Director'
    AND emp.status = 'available'
    AND emp.deleted = false
    AND sc.deleted = false
    AND r.deleted = false;

-- Question 6: Which director has directed the greatest number of episodes?
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as director_name,
    emp.email as director_email,
    COUNT(e.uuid) as episodes_directed,
    STRING_AGG(DISTINCT s.title, ', ') as series_directed
FROM employees emp
JOIN episodes e ON emp.uuid = e.director_uuid
JOIN tv_series s ON e.series_uuid = s.uuid
WHERE e.deleted = false
    AND s.deleted = false
    AND emp.deleted = false
    AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email
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
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE s.deleted = false
    AND sd.deleted = false
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
WHERE t.deleted = false
    AND e.deleted = false
    AND s.deleted = false
    AND tc.deleted = false
    AND c.deleted = false
GROUP BY s.title, e.episode_number, e.title, t.uuid, t.transmission_time
HAVING COUNT(tc.channel_uuid) > 1
ORDER BY channel_count DESC, t.transmission_time;

-- Bonus 3: Show employee participation across different roles
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as employee_name,
    emp.email,
    COUNT(DISTINCT sc.role_uuid) as roles_played,
    COUNT(DISTINCT sc.series_uuid) as series_participation,
    STRING_AGG(DISTINCT r.name, ', ') as roles_held
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.deleted = false
    AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email
ORDER BY roles_played DESC, series_participation DESC;

-- Bonus 4: Show series performance by domain with transmission statistics
SELECT
    sd.name as domain,
    COUNT(DISTINCT s.uuid) as series_count,
    COUNT(DISTINCT e.uuid) as total_episodes,
    COUNT(DISTINCT t.uuid) as total_transmissions,
    ROUND(AVG(t.viewership), 0) as avg_viewership_per_transmission,
    SUM(t.viewership) as total_viewership
FROM series_domains sd
LEFT JOIN tv_series s ON sd.uuid = s.domain_uuid AND s.deleted = false
LEFT JOIN episodes e ON s.uuid = e.series_uuid AND e.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE sd.deleted = false
GROUP BY sd.uuid, sd.name
ORDER BY total_viewership DESC NULLS LAST;

-- Bonus 5: Show employee role distribution and multi-role employees
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as employee_name,
    emp.status,
    COUNT(DISTINCT sc.role_uuid) as roles_played,
    COUNT(DISTINCT sc.series_uuid) as series_participation,
    STRING_AGG(DISTINCT r.name, ', ') as roles_held,
    STRING_AGG(DISTINCT sc.character_name, ', ') as characters_played
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.status
HAVING COUNT(DISTINCT sc.role_uuid) > 1 OR COUNT(DISTINCT sc.series_uuid) > 1
ORDER BY roles_played DESC, series_participation DESC;

-- =====================
-- Demonstration Queries: Why role_uuid in series_cast is NOT redundant
-- =====================

-- Example 1: CORRECT - Querying the actual role of an employee in each series (using role_uuid in series_cast)
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as employee_name,
    s.title as series_title,
    r.name as role_in_series,
    sc.character_name
FROM series_cast sc
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE emp.first_name = 'Bertil' AND emp.last_name = 'Bom'
    AND sc.deleted = false
    AND s.deleted = false
    AND emp.deleted = false
    AND r.deleted = false;

-- Example 2: Show all employees who are both actors and directors in different series
SELECT
    CONCAT(emp.first_name, ' ', emp.last_name) as employee_name,
    emp.email,
    STRING_AGG(DISTINCT r.name, ', ') as roles_played,
    COUNT(DISTINCT sc.series_uuid) as series_count
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE r.name IN ('Actor', 'Director')
    AND sc.deleted = false
    AND emp.deleted = false
    AND r.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email
HAVING COUNT(DISTINCT r.name) > 1
ORDER BY series_count DESC;

-- Example 3: Show series with their cast breakdown by role
SELECT
    s.title as series_title,
    r.name as role_name,
    COUNT(sc.employee_uuid) as employee_count,
    STRING_AGG(CONCAT(emp.first_name, ' ', emp.last_name), ', ') as employees
FROM tv_series s
JOIN series_cast sc ON s.uuid = sc.series_uuid
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE s.deleted = false
    AND sc.deleted = false
    AND emp.deleted = false
    AND r.deleted = false
GROUP BY s.uuid, s.title, r.uuid, r.name
ORDER BY s.title, r.name;

-- Example 4: Show episodes with their directors and cast
SELECT
    s.title as series_title,
    e.episode_number,
    e.title as episode_title,
    CONCAT(dir.first_name, ' ', dir.last_name) as director,
    COUNT(sc.employee_uuid) as cast_size,
    STRING_AGG(CONCAT(emp.first_name, ' ', emp.last_name, ' (', r.name, ')'), ', ') as cast_members
FROM episodes e
JOIN tv_series s ON e.series_uuid = s.uuid
JOIN employees dir ON e.director_uuid = dir.uuid
LEFT JOIN series_cast sc ON s.uuid = sc.series_uuid
LEFT JOIN employees emp ON sc.employee_uuid = emp.uuid
LEFT JOIN roles r ON sc.role_uuid = r.uuid
WHERE e.deleted = false
    AND s.deleted = false
    AND dir.deleted = false
    AND (sc.deleted = false OR sc.deleted IS NULL)
    AND (emp.deleted = false OR emp.deleted IS NULL)
    AND (r.deleted = false OR r.deleted IS NULL)
GROUP BY s.uuid, s.title, e.uuid, e.episode_number, e.title, dir.uuid, dir.first_name, dir.last_name
ORDER BY s.title, e.episode_number;

-- =====================
-- End of demonstration
-- =====================
