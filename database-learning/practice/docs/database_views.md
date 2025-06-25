# Database Views: TV Company Database

## 🎬 Overview

This document defines the database views for the TV Company Database, providing simplified access to complex data relationships and supporting common business queries for TV series production and broadcasting operations.

## 📊 Core Business Views

### 1. **Series Overview View**

#### `v_series_overview`
Provides comprehensive series information with domain and episode counts.

```sql
CREATE OR REPLACE VIEW v_series_overview AS
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
```

**Usage Examples:**
```sql
-- Get all series with episode counts
SELECT title, domain_name, episode_count FROM v_series_overview;

-- Find series with most episodes
SELECT title, episode_count
FROM v_series_overview
ORDER BY episode_count DESC
LIMIT 10;
```

### 2. **Episode Details View**

#### `v_episode_details`
Comprehensive episode information with series, director, and transmission data.

```sql
CREATE OR REPLACE VIEW v_episode_details AS
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
```

**Usage Examples:**
```sql
-- Get episode details with director information
SELECT episode_title, series_title, director_first_name, director_last_name
FROM v_episode_details;

-- Find episodes with highest viewership
SELECT episode_title, series_title, total_viewership
FROM v_episode_details
ORDER BY total_viewership DESC;
```

### 3. **Cast and Crew View**

#### `v_series_cast_details`
Detailed cast and crew information for each series.

```sql
CREATE OR REPLACE VIEW v_series_cast_details AS
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
```

**Usage Examples:**
```sql
-- Get all actors in a specific series
SELECT first_name, last_name, character_name, role_name
FROM v_series_cast_details
WHERE series_title = 'Breaking Bad' AND role_name = 'Actor';

-- Find employees with multiple roles
SELECT first_name, last_name, COUNT(DISTINCT role_name) as role_count
FROM v_series_cast_details
GROUP BY first_name, last_name
HAVING COUNT(DISTINCT role_name) > 1;
```

### 4. **Employee Participation View**

#### `v_employee_participation`
Employee participation across multiple series and roles.

```sql
CREATE OR REPLACE VIEW v_employee_participation AS
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
```

**Usage Examples:**
```sql
-- Find most active employees
SELECT first_name, last_name, series_count, role_count
FROM v_employee_participation
ORDER BY series_count DESC;

-- Find employees who are both actors and directors
SELECT first_name, last_name, roles_played
FROM v_employee_participation
WHERE roles_played LIKE '%Actor%' AND roles_played LIKE '%Director%';
```

### 5. **Transmission Schedule View**

#### `v_transmission_schedule`
Comprehensive transmission information with episode and channel details.

```sql
CREATE OR REPLACE VIEW v_transmission_schedule AS
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
```

**Usage Examples:**
```sql
-- Get transmission schedule for a specific date
SELECT episode_title, series_title, transmission_time, channels
FROM v_transmission_schedule
WHERE DATE(transmission_time) = '2024-01-15';

-- Find multi-channel transmissions
SELECT episode_title, channel_count, channels
FROM v_transmission_schedule
WHERE channel_count > 1;
```

### 6. **Viewership Analytics View**

#### `v_viewership_analytics`
Viewership performance analytics across series, episodes, and channels.

```sql
CREATE OR REPLACE VIEW v_viewership_analytics AS
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
```

**Usage Examples:**
```sql
-- Get viewership by channel type
SELECT channel_type, AVG(avg_viewership) as avg_viewership_by_type
FROM v_viewership_analytics
GROUP BY channel_type;

-- Find highest-rated episodes
SELECT episode_title, series_title, avg_viewership
FROM v_viewership_analytics
ORDER BY avg_viewership DESC
LIMIT 10;
```

### 7. **Production Status View**

#### `v_production_status`
Current production status and employee availability.

```sql
CREATE OR REPLACE VIEW v_production_status AS
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
```

**Usage Examples:**
```sql
-- Get production status overview
SELECT title, production_status, episode_count, cast_count
FROM v_production_status;

-- Find series in production
SELECT title, available_employees, busy_employees
FROM v_production_status
WHERE production_status = 'In Production';
```

## 🔐 Access Control Views

### 8. **Role-Based Access View**

#### `v_employee_roles`
Employee role assignments for access control.

```sql
CREATE OR REPLACE VIEW v_employee_roles AS
SELECT
    emp.uuid as employee_uuid,
    emp.first_name,
    emp.last_name,
    emp.email,
    emp.status,
    r.uuid as role_uuid,
    r.name as role_name,
    r.description as role_description,
    COUNT(DISTINCT sc.series_uuid) as series_involved,
    sc.character_name,
    sc.start_date as role_start,
    sc.end_date as role_end
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = false
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE emp.deleted = false
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.status,
         r.uuid, r.name, r.description, sc.character_name, sc.start_date, sc.end_date;
```

**Usage Examples:**
```sql
-- Get all directors
SELECT first_name, last_name, email, series_involved
FROM v_employee_roles
WHERE role_name = 'Director';

-- Find employees with specific roles
SELECT first_name, last_name, role_name, character_name
FROM v_employee_roles
WHERE role_name IN ('Actor', 'Director');
```

## 📈 Performance Views

### 9. **Series Performance View**

#### `v_series_performance`
Series performance metrics and analytics.

```sql
CREATE OR REPLACE VIEW v_series_performance AS
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
            EXTRACT(EPOCH FROM (s.end_date - s.start_date)) / 86400
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
```

**Usage Examples:**
```sql
-- Get top-performing series
SELECT series_title, total_viewership, avg_viewership_per_transmission
FROM v_series_performance
ORDER BY total_viewership DESC;

-- Compare series by domain
SELECT domain_name, AVG(avg_viewership_per_transmission) as avg_viewership
FROM v_series_performance
GROUP BY domain_name;
```

## 🔧 Maintenance Views

### 10. **Data Quality View**

#### `v_data_quality_check`
Data quality and consistency checks.

```sql
CREATE OR REPLACE VIEW v_data_quality_check AS
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
```

**Usage Examples:**
```sql
-- Check for data quality issues
SELECT issue_type, COUNT(*) as issue_count
FROM v_data_quality_check
GROUP BY issue_type;

-- Get detailed quality issues
SELECT record_title, description
FROM v_data_quality_check
WHERE issue_type = 'episodes_without_director';
```

## 📊 View Usage Guidelines

### Performance Considerations
- Views are read-only for business users
- Complex views may require indexing on underlying tables
- Consider materialized views for frequently accessed data
- Monitor view performance and optimize as needed

### Security Considerations
- Views provide data access control
- Sensitive data can be filtered out in views
- Role-based access can be implemented through views
- Audit logging should be maintained for view access

### Maintenance Procedures
- Regular review of view performance
- Update views when underlying schema changes
- Document view dependencies and relationships
- Test view performance with production data volumes

---

*These views provide simplified access to complex TV series data relationships and support common business queries for production and broadcasting operations.*
