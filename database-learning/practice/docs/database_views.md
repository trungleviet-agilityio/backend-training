# Database Views: TV Company Database

## 🎬 Overview

This document defines the database views for the TV Company Database, providing simplified access to complex data relationships and supporting common business queries for TV series production and broadcasting operations. Based on Chapter 12: Views principles, we implement three main types: Data Views, Aggregate Views, and Validation Views.

## 📊 View Types and Categories

### 1. **Data Views** - For examining and manipulating data
- Can be modified (changes flow to base tables)
- Provide current information from multiple tables
- Examples: `v_episode_details`, `v_series_cast_details`, `v_transmission_schedule`

### 2. **Aggregate Views** - For reports and statistical information
- Cannot be modified (all fields are grouping or calculated)
- Use aggregate functions: COUNT, SUM, AVG, MAX, MIN
- Examples: `v_series_overview`, `v_employee_participation`, `v_series_performance`

### 3. **Validation Views** - For data integrity and business rules
- Help implement data integrity
- Enforce business rules
- Provide valid range of values for fields
- Examples: `v_data_quality_check`, `v_valid_employee_roles`

## 📊 Core Business Views

### 1. **Series Overview View (Aggregate)**

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
LEFT JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
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

### 2. **Episode Details View (Data View)**

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
JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
JOIN employees emp ON e.director_uuid = emp.uuid AND emp.deleted = false
LEFT JOIN transmissions t ON e.uuid = t.episode_uuid AND t.deleted = false
WHERE e.deleted = false
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

### 3. **Cast and Crew View (Data View)**

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
JOIN tv_series s ON sc.series_uuid = s.uuid AND s.deleted = false
JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = false
JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = false
WHERE sc.deleted = false;
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

### 4. **Employee Participation View (Aggregate View)**

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

### 5. **Available Employees View (Data View with Filter)**

#### `v_available_employees`
Shows only available employees for casting and production.

```sql
CREATE OR REPLACE VIEW v_available_employees AS
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
```

**Usage Examples:**
```sql
-- Get all available employees
SELECT first_name, last_name, roles
FROM v_available_employees;

-- Find available internal employees
SELECT first_name, last_name
FROM v_available_employees
WHERE is_internal = true;
```

### 6. **Transmission Schedule View (Data View)**

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
JOIN episodes e ON t.episode_uuid = e.uuid AND e.deleted = false
JOIN tv_series s ON e.series_uuid = s.uuid AND s.deleted = false
JOIN series_domains sd ON s.domain_uuid = sd.uuid AND sd.deleted = false
LEFT JOIN transmission_channels tc ON t.uuid = tc.transmission_uuid AND tc.deleted = false
LEFT JOIN channels c ON tc.channel_uuid = c.uuid AND c.deleted = false
WHERE t.deleted = false
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

## 📈 Performance and Analytics Views

### 7. **Series Performance View (Aggregate View)**

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

### 8. **Channel Performance View (Aggregate View)**

#### `v_channel_performance`
Channel performance metrics and analytics.

```sql
CREATE OR REPLACE VIEW v_channel_performance AS
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
```

**Usage Examples:**
```sql
-- Get channel performance ranking
SELECT channel_name, total_viewership, avg_viewership
FROM v_channel_performance
ORDER BY total_viewership DESC;

-- Compare channel types
SELECT channel_type, AVG(avg_viewership) as avg_viewership_by_type
FROM v_channel_performance
GROUP BY channel_type;
```

### 9. **Production Status View (Data View with Calculated Fields)**

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

### 10. **Executive Dashboard View (Aggregate View)**

#### `v_executive_dashboard`
High-level metrics for executive reporting.

```sql
CREATE OR REPLACE VIEW v_executive_dashboard AS
SELECT
    (SELECT COUNT(*) FROM tv_series WHERE deleted = false) as active_series,
    (SELECT COUNT(*) FROM episodes WHERE deleted = false) as total_episodes,
    (SELECT COUNT(*) FROM employees WHERE deleted = false AND status = 'available') as available_cast,
    (SELECT COUNT(*) FROM transmissions WHERE deleted = false) as total_transmissions,
    (SELECT SUM(viewership) FROM transmissions WHERE deleted = false) as total_viewership,
    (SELECT COUNT(*) FROM channels WHERE deleted = false) as active_channels,
    (SELECT COUNT(DISTINCT series_uuid) FROM series_cast WHERE deleted = false) as series_with_cast;
```

**Usage Examples:**
```sql
-- Get executive summary
SELECT * FROM v_executive_dashboard;

-- Monitor key metrics
SELECT active_series, total_episodes, available_cast
FROM v_executive_dashboard;
```

## 🔐 Validation Views (Data Integrity)

### 11. **Data Quality Check View (Validation View)**

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

### 12. **Valid Employee Roles View (Validation View)**

#### `v_valid_employee_roles`
Employee role assignments for access control and validation.

```sql
CREATE OR REPLACE VIEW v_valid_employee_roles AS
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
FROM v_valid_employee_roles
WHERE role_name = 'Director';

-- Find employees with specific roles
SELECT first_name, last_name, role_name, character_name
FROM v_valid_employee_roles
WHERE role_name IN ('Actor', 'Director');
```

### 13. **Valid Transmission Channels View (Validation View)**

#### `v_valid_transmission_channels`
Valid transmission-channel relationships for data integrity.

```sql
CREATE OR REPLACE VIEW v_valid_transmission_channels AS
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
```

**Usage Examples:**
```sql
-- Get all valid transmission-channel assignments
SELECT episode_title, series_title, channel_name, transmission_time
FROM v_valid_transmission_channels;

-- Find transmissions by channel type
SELECT channel_type, COUNT(*) as transmission_count
FROM v_valid_transmission_channels
GROUP BY channel_type;
```

## 📊 View Usage Guidelines

### Performance Considerations
- Views are read-only for business users (except data views)
- Complex views may require indexing on underlying tables
- Consider materialized views for frequently accessed data
- Monitor view performance and optimize as needed
- All views include proper `deleted = false` filters

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

### View Type Guidelines
- **Data Views**: Use for data entry, editing, and current information display
- **Aggregate Views**: Use for reports, dashboards, and statistical analysis
- **Validation Views**: Use for data integrity checks and business rule enforcement

---

*These views provide simplified access to complex TV series data relationships and support common business queries for production and broadcasting operations, following Chapter 12: Views principles for proper view design and implementation.*
