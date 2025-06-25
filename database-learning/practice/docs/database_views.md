# 👁️ Database Views for TV Series Database

---

## 1. Introduction

This document defines the views needed to support different user access patterns and reporting requirements for the TV series database. Views provide a way to present data in different formats for various user groups while maintaining data security and simplifying complex queries.

---

## 2. View Categories

### 2.1. Production Views
Views for production staff to manage series and episodes.

### 2.2. Cast Management Views
Views for managing actors and directors participating in series.

### 2.3. Analytics Views
Views for analytics team to generate reports and performance metrics.

### 2.4. Management Views
Views for management to monitor overall performance and trends.

---

## 3. Production Views

### 3.1. Series Overview View
**Purpose:** Provide production staff with complete series information including episode counts and status.

```sql
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
```

**Access:** Production Staff
**Use Cases:** Series management, episode planning, status tracking

### 3.2. Episode Production View
**Purpose:** Show episode details with director information and transmission status.

```sql
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
```

**Access:** Production Staff, Directors
**Use Cases:** Episode tracking, director assignments, production scheduling

### 3.3. Cast and Crew View
**Purpose:** Display all actors and directors participating in a specific series with their roles and characters.

```sql
CREATE VIEW cast_and_crew AS
SELECT
    s.title as series_title,
    emp.first_name || ' ' || emp.last_name as employee_name,
    emp.email as employee_email,
    r.name as role_name,
    sc.character_name,
    sc.start_date,
    sc.end_date,
    d.name as department_name
FROM series_cast sc
JOIN tv_series s ON sc.series_uuid = s.uuid
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN roles r ON sc.role_uuid = r.uuid
JOIN departments d ON r.department_uuid = d.uuid
WHERE sc.deleted = FALSE
    AND s.deleted = FALSE
    AND emp.deleted = FALSE
    AND r.deleted = FALSE
ORDER BY s.title, r.name, emp.first_name, emp.last_name;
```

**Access:** Production Staff, Cast Management
**Use Cases:** Cast management, role assignments, character tracking

---

## 4. Cast Management Views

### 4.1. Actor and Director Directory View
**Purpose:** Provide complete information about actors and directors including their series participation.

```sql
CREATE VIEW actor_director_directory AS
SELECT
    emp.uuid,
    emp.first_name || ' ' || emp.last_name as employee_name,
    emp.email,
    emp.birthdate,
    emp.employment_date,
    emp.is_internal,
    emp.status,
    STRING_AGG(DISTINCT r.name, ', ') as roles_in_series,
    COUNT(DISTINCT sc.series_uuid) as series_participation_count
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = FALSE
LEFT JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = FALSE
WHERE emp.deleted = FALSE
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.birthdate, emp.employment_date, emp.is_internal, emp.status;
```

**Access:** Cast Management, Production Staff
**Use Cases:** Actor and director management, participation tracking, availability checking

### 4.2. Available Cast View
**Purpose:** Show only available actors and directors for current production needs.

```sql
CREATE VIEW available_cast AS
SELECT
    emp.uuid,
    emp.first_name || ' ' || emp.last_name as employee_name,
    emp.email,
    emp.employment_date,
    emp.is_internal,
    STRING_AGG(DISTINCT r.name, ', ') as roles
FROM employees emp
JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = FALSE
JOIN roles r ON sc.role_uuid = r.uuid AND r.deleted = FALSE
WHERE emp.deleted = FALSE
    AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, emp.employment_date, emp.is_internal;
```

**Access:** Production Staff, Cast Management
**Use Cases:** Available actor/director lookups, role assignments, availability checking

### 4.3. Cast Performance View
**Purpose:** Track actor and director participation across series and episodes.

```sql
CREATE VIEW cast_performance AS
SELECT
    emp.uuid,
    emp.first_name || ' ' || emp.last_name as employee_name,
    emp.email,
    r.name as role_name,
    COUNT(DISTINCT sc.series_uuid) as series_participation_count,
    COUNT(DISTINCT e.uuid) as episodes_directed,
    MAX(e.air_date) as last_episode_date
FROM employees emp
LEFT JOIN series_cast sc ON emp.uuid = sc.employee_uuid AND sc.deleted = FALSE
LEFT JOIN roles r ON sc.role_uuid = r.uuid
LEFT JOIN episodes e ON emp.uuid = e.director_uuid AND e.deleted = FALSE
WHERE emp.deleted = FALSE AND emp.status = 'available'
GROUP BY emp.uuid, emp.first_name, emp.last_name, emp.email, r.name;
```

**Access:** Cast Management, Production Staff
**Use Cases:** Performance evaluation, career development, resource planning

---

## 5. Analytics Views

### 5.1. Transmission Analytics View
**Purpose:** Provide comprehensive transmission data for analytics and reporting.

```sql
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
```

**Access:** Analytics Team, Management
**Use Cases:** Viewership analysis, channel performance, trend reporting

### 5.2. Series Performance View
**Purpose:** Track series performance across all episodes and transmissions.

```sql
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
```

**Access:** Analytics Team, Management
**Use Cases:** Series success analysis, content strategy, performance comparison

### 5.3. Channel Performance View
**Purpose:** Analyze performance by individual channels.

```sql
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
```

**Access:** Analytics Team, Management
**Use Cases:** Channel strategy, platform performance, distribution analysis

---

## 6. Management Views

### 6.1. Executive Dashboard View
**Purpose:** Provide high-level metrics for executive decision making.

```sql
CREATE VIEW executive_dashboard AS
SELECT
    (SELECT COUNT(*) FROM tv_series WHERE deleted = FALSE) as active_series,
    (SELECT COUNT(*) FROM episodes WHERE deleted = FALSE) as total_episodes,
    (SELECT COUNT(*) FROM employees WHERE deleted = FALSE AND status = 'available') as available_cast,
    (SELECT COUNT(*) FROM transmissions WHERE deleted = FALSE) as total_transmissions,
    (SELECT SUM(viewership) FROM transmissions WHERE deleted = FALSE) as total_viewership,
    (SELECT COUNT(*) FROM channels WHERE deleted = FALSE) as active_channels,
    (SELECT COUNT(DISTINCT series_uuid) FROM series_cast WHERE deleted = FALSE) as series_with_cast;
```

**Access:** Executive Management
**Use Cases:** Executive reporting, strategic planning, KPI monitoring

### 6.2. Department Overview View
**Purpose:** Show organizational structure and employee distribution.

```sql
CREATE VIEW department_overview AS
SELECT
    d.uuid,
    d.name as department_name,
    d.description,
    COUNT(DISTINCT r.uuid) as roles_count,
    COUNT(DISTINCT emp.uuid) as employees_count,
    COUNT(DISTINCT CASE WHEN emp.status = 'available' THEN emp.uuid END) as available_employees
FROM departments d
LEFT JOIN roles r ON d.uuid = r.department_uuid AND r.deleted = FALSE
LEFT JOIN series_cast sc ON r.uuid = sc.role_uuid AND sc.deleted = FALSE
LEFT JOIN employees emp ON sc.employee_uuid = emp.uuid AND emp.deleted = FALSE
WHERE d.deleted = FALSE
GROUP BY d.uuid, d.name, d.description;
```

**Access:** Management, Cast Management
**Use Cases:** Organizational planning, resource allocation, department management

---

## 7. Security Considerations

### 7.1. Access Control
- **Production Views:** Access for production staff only
- **Cast Management Views:** Access for cast management and production staff
- **Analytics Views:** Access for analytics team and management
- **Management Views:** Access for executive management only

### 7.2. Data Filtering
- All views automatically filter out deleted records
- Employee views respect status-based access (available employees only)
- Sensitive information (birthdates, emails) restricted to appropriate views

### 7.3. Row-Level Security
- Consider implementing row-level security for multi-tenant scenarios
- Department-based access control for organizational data
- Role-based access for employee information

---

## 8. Performance Considerations

### 8.1. Indexing Strategy
- Index foreign key columns used in view joins
- Index date columns for time-based filtering
- Index status columns for active record filtering

### 8.2. Materialized Views
- Consider materializing frequently accessed views
- Refresh strategies for real-time vs. batch updates
- Storage considerations for large datasets

### 8.3. Query Optimization
- Use appropriate join types (INNER vs LEFT)
- Limit result sets with WHERE clauses
- Consider pagination for large result sets

---

## 9. References
- Chapter 4: Conceptual Overview (Database Design Book)
- Mission Statement & Objectives Document
- TV Series Production Requirements
- User Access Pattern Analysis
