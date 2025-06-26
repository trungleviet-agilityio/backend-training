# SQL Syntax Quick Reference Guide

## 📋 Table of Contents
1. [Basic SELECT Statement](#basic-select-statement)
2. [JOINs](#joins)
3. [WHERE Clauses](#where-clauses)
4. [Aggregate Functions](#aggregate-functions)
5. [GROUP BY and HAVING](#group-by-and-having)
6. [ORDER BY](#order-by)
7. [Subqueries](#subqueries)
8. [Common Table Expressions (CTEs)](#common-table-expressions-ctes)
9. [Window Functions](#window-functions)
10. [Data Modification](#data-modification)
11. [Indexes and Performance](#indexes-and-performance)

---

## 🔍 Basic SELECT Statement

### What is SELECT?
The SELECT statement is the foundation of SQL queries. It retrieves data from one or more tables and allows you to specify exactly what columns you want to see, how to filter the data, and how to organize the results.

### Basic Syntax
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
GROUP BY column1, column2, ...
HAVING group_condition
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC]
LIMIT number;
```

### Examples
```sql
-- Select all columns
SELECT * FROM employees;

-- Select specific columns
SELECT first_name, last_name, email FROM employees;

-- Select with aliases
SELECT
    first_name AS fname,
    last_name AS lname,
    email AS contact_email
FROM employees;

-- Select with calculations
SELECT
    first_name,
    last_name,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthdate)) AS age
FROM employees;

-- Select distinct values
SELECT DISTINCT status FROM employees;
```

### Key Points:
- **SELECT**: Specifies which columns to retrieve
- **FROM**: Specifies the table(s) to query
- **WHERE**: Filters rows before grouping/aggregation
- **GROUP BY**: Groups rows for aggregation
- **HAVING**: Filters groups after aggregation
- **ORDER BY**: Sorts the final result set
- **LIMIT**: Restricts the number of rows returned

---

## 🔗 JOINs

### What are JOINs?
JOINs combine data from multiple tables based on related columns. They're essential for working with normalized databases where data is spread across multiple tables.

### Types of JOINs:

#### INNER JOIN
**What it does**: Returns only rows that have matching values in both tables.
**When to use**: When you need data that exists in both tables.
**Example**:
```sql
SELECT e.first_name, e.last_name, r.name as role_name
FROM employees e
INNER JOIN series_cast sc ON e.uuid = sc.employee_uuid
INNER JOIN roles r ON sc.role_uuid = r.uuid;
```

#### LEFT JOIN (LEFT OUTER JOIN)
**What it does**: Returns all rows from the left table and matching rows from the right table. If no match, NULL values are returned for right table columns.
**When to use**: When you want all records from the main table, even if there's no match in the related table.
**Example**:
```sql
SELECT e.first_name, e.last_name, COUNT(e2.uuid) as episodes_directed
FROM employees e
LEFT JOIN episodes e2 ON e.uuid = e2.director_uuid
GROUP BY e.uuid, e.first_name, e.last_name;
```

#### RIGHT JOIN (RIGHT OUTER JOIN)
**What it does**: Returns all rows from the right table and matching rows from the left table.
**When to use**: When you want all records from the secondary table, even if there's no match in the main table.
**Example**:
```sql
SELECT r.name as role_name, COUNT(sc.uuid) as assignments
FROM roles r
RIGHT JOIN series_cast sc ON r.uuid = sc.role_uuid
GROUP BY r.name;
```

#### FULL JOIN (FULL OUTER JOIN)
**What it does**: Returns all rows from both tables, with NULL values where there's no match.
**When to use**: When you want to see all records from both tables, including unmatched records.
**Example**:
```sql
SELECT e.first_name, e.last_name, r.name as role_name
FROM employees e
FULL JOIN series_cast sc ON e.uuid = sc.employee_uuid
FULL JOIN roles r ON sc.role_uuid = r.uuid;
```

#### CROSS JOIN
**What it does**: Returns the Cartesian product of both tables (every row from first table paired with every row from second table).
**When to use**: Rarely used, mainly for generating combinations or when you need every possible pairing.
**Example**:
```sql
SELECT e.first_name, r.name as role_name
FROM employees e
CROSS JOIN roles r;
```

### JOIN Best Practices:
- Always specify the JOIN type explicitly (INNER, LEFT, RIGHT, FULL)
- Use meaningful table aliases
- Ensure proper indexing on JOIN columns
- Be careful with CROSS JOINs as they can produce large result sets

---

## 🔍 WHERE Clauses

### What is WHERE?
The WHERE clause filters rows from the result set based on specified conditions. It's applied before GROUP BY and aggregation, making it efficient for reducing the dataset early in the query execution.

### Basic Conditions
```sql
-- Equality
WHERE status = 'active'

-- Inequality
WHERE salary > 50000

-- Multiple conditions
WHERE status = 'active' AND salary > 50000

-- IN clause
WHERE status IN ('active', 'pending')

-- LIKE patterns
WHERE first_name LIKE 'J%'  -- Starts with J
WHERE last_name LIKE '%son' -- Ends with son
WHERE email LIKE '%@gmail.com' -- Contains @gmail.com

-- NULL checks
WHERE manager_id IS NULL
WHERE email IS NOT NULL

-- BETWEEN
WHERE salary BETWEEN 30000 AND 60000

-- Date comparisons
WHERE hire_date >= '2020-01-01'
WHERE created_time > CURRENT_TIMESTAMP - INTERVAL '30 days'
```

### Complex WHERE Examples
```sql
-- Multiple conditions with parentheses
WHERE (status = 'active' OR status = 'pending')
  AND (salary > 50000 OR department = 'IT')
  AND created_time > '2023-01-01';

-- Using EXISTS
WHERE EXISTS (
    SELECT 1 FROM series_cast sc
    WHERE sc.employee_uuid = e.uuid
);

-- Using NOT EXISTS
WHERE NOT EXISTS (
    SELECT 1 FROM episodes ep
    WHERE ep.director_uuid = e.uuid
);
```

### WHERE Clause Tips:
- **Use indexes**: WHERE clauses on indexed columns are much faster
- **Order conditions**: Put most selective conditions first
- **Avoid functions**: Functions on columns prevent index usage
- **Use EXISTS for subqueries**: Often faster than IN for large datasets

---

## 📊 Aggregate Functions

### What are Aggregate Functions?
Aggregate functions perform calculations on sets of values and return a single result. They're essential for summarizing data and creating reports.

### Common Aggregate Functions
```sql
-- COUNT: Counts rows or non-NULL values
SELECT COUNT(*) FROM employees;
SELECT COUNT(DISTINCT department) FROM employees;

-- SUM: Adds up numeric values
SELECT SUM(salary) FROM employees;

-- AVG: Calculates the average of numeric values
SELECT AVG(salary) FROM employees;

-- MIN/MAX: Finds minimum or maximum values
SELECT MIN(salary), MAX(salary) FROM employees;

-- STRING_AGG (PostgreSQL): Concatenates string values
SELECT STRING_AGG(first_name, ', ') FROM employees;
SELECT STRING_AGG(DISTINCT first_name, ', ') FROM employees;
```

### Aggregate with Conditions
```sql
-- Conditional aggregation
SELECT
    COUNT(*) as total_employees,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_employees,
    COUNT(CASE WHEN salary > 50000 THEN 1 END) as high_earners
FROM employees;
```

### Aggregate Function Behavior:
- **NULL handling**: Most aggregates ignore NULL values
- **DISTINCT**: Can be used with most aggregates to remove duplicates
- **Performance**: Aggregates can be expensive on large datasets
- **Grouping required**: When using aggregates with non-aggregated columns, GROUP BY is needed

---

## 📈 GROUP BY and HAVING

### What is GROUP BY?
GROUP BY groups rows that have the same values in specified columns, allowing you to apply aggregate functions to each group separately.

### What is HAVING?
HAVING filters groups after aggregation, similar to how WHERE filters rows before aggregation.

### Basic GROUP BY
```sql
SELECT department, COUNT(*) as employee_count
FROM employees
GROUP BY department;
```

### GROUP BY with Multiple Columns
```sql
SELECT
    department,
    status,
    COUNT(*) as count,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department, status;
```

### HAVING Clause
```sql
SELECT department, COUNT(*) as employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
```

### Complex GROUP BY Example
```sql
SELECT
    s.title as series_title,
    r.name as role_name,
    COUNT(DISTINCT sc.employee_uuid) as employee_count,
    STRING_AGG(DISTINCT emp.first_name, ', ') as employees
FROM tv_series s
JOIN series_cast sc ON s.uuid = sc.series_uuid
JOIN employees emp ON sc.employee_uuid = emp.uuid
JOIN roles r ON sc.role_uuid = r.uuid
WHERE s.deleted = false
GROUP BY s.title, r.name
HAVING COUNT(DISTINCT sc.employee_uuid) > 1
ORDER BY s.title, r.name;
```

### GROUP BY vs HAVING:
- **GROUP BY**: Groups rows before aggregation
- **HAVING**: Filters groups after aggregation
- **WHERE**: Filters rows before grouping
- **Execution order**: WHERE → GROUP BY → HAVING → SELECT → ORDER BY

---

## 📋 ORDER BY

### What is ORDER BY?
ORDER BY sorts the final result set by specified columns. It's the last operation in query execution and doesn't affect the data, only the presentation.

### Basic ORDER BY
```sql
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC;
```

### Multiple Column ORDER BY
```sql
SELECT first_name, last_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC, last_name ASC;
```

### ORDER BY with Expressions
```sql
SELECT first_name, last_name, hire_date
FROM employees
ORDER BY EXTRACT(YEAR FROM hire_date) DESC, last_name;
```

### ORDER BY Tips:
- **ASC/DESC**: ASC is default, DESC for descending order
- **NULL handling**: NULLs are typically sorted last
- **Performance**: ORDER BY can be expensive on large datasets
- **Indexes**: ORDER BY on indexed columns is much faster

---

## 🔄 Subqueries

### What are Subqueries?
Subqueries are queries nested within other queries. They can be used in SELECT, FROM, WHERE, and HAVING clauses to create more complex and flexible queries.

### Subquery in WHERE
**What it does**: Uses the result of a subquery to filter the main query.
**When to use**: When you need to compare against a calculated value or check for existence.
```sql
SELECT first_name, last_name
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### Subquery in SELECT
**What it does**: Uses a subquery to calculate a value for each row in the main query.
**When to use**: When you need related data that can't be easily joined.
```sql
SELECT
    first_name,
    last_name,
    (SELECT COUNT(*) FROM episodes WHERE director_uuid = e.uuid) as episodes_directed
FROM employees e;
```

### Subquery in FROM
**What it does**: Uses a subquery as a temporary table in the FROM clause.
**When to use**: When you need to pre-process data before the main query.
```sql
SELECT avg_salary, department
FROM (
    SELECT department, AVG(salary) as avg_salary
    FROM employees
    GROUP BY department
) dept_stats
WHERE avg_salary > 50000;
```

### EXISTS Subquery
**What it does**: Checks for the existence of related records.
**When to use**: Often more efficient than IN for large datasets.
```sql
SELECT first_name, last_name
FROM employees e
WHERE EXISTS (
    SELECT 1 FROM series_cast sc
    WHERE sc.employee_uuid = e.uuid
);
```

### Subquery Performance Tips:
- **EXISTS vs IN**: EXISTS is often faster for large datasets
- **Correlated subqueries**: Can be slow, consider JOINs instead
- **Indexes**: Ensure subqueries use indexed columns
- **CTEs**: Consider using CTEs for complex subqueries

---

## 🏗️ Common Table Expressions (CTEs)

### What are CTEs?
CTEs (Common Table Expressions) are temporary named result sets that exist only within the scope of a single SQL statement. They make complex queries more readable and maintainable.

### Basic CTE
**What it does**: Creates a temporary result set that can be referenced multiple times in the main query.
**When to use**: When you need to use the same subquery multiple times or want to break down complex queries.
```sql
WITH employee_stats AS (
    SELECT
        department,
        COUNT(*) as employee_count,
        AVG(salary) as avg_salary
    FROM employees
    GROUP BY department
)
SELECT * FROM employee_stats
WHERE avg_salary > 50000;
```

### Multiple CTEs
**What it does**: Creates multiple temporary result sets that can reference each other.
**When to use**: For complex queries that need multiple intermediate steps.
```sql
WITH
active_employees AS (
    SELECT * FROM employees WHERE status = 'active'
),
director_stats AS (
    SELECT
        director_uuid,
        COUNT(*) as episodes_directed
    FROM episodes
    GROUP BY director_uuid
)
SELECT
    ae.first_name,
    ae.last_name,
    COALESCE(ds.episodes_directed, 0) as episodes_directed
FROM active_employees ae
LEFT JOIN director_stats ds ON ae.uuid = ds.director_uuid;
```

### Recursive CTE
**What it does**: Creates a CTE that references itself, useful for hierarchical data.
**When to use**: For organizational charts, file systems, or any hierarchical data structure.
```sql
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: employees with no manager
    SELECT uuid, first_name, last_name, manager_uuid, 1 as level
    FROM employees
    WHERE manager_uuid IS NULL

    UNION ALL

    -- Recursive case: employees with managers
    SELECT e.uuid, e.first_name, e.last_name, e.manager_uuid, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_uuid = eh.uuid
)
SELECT * FROM employee_hierarchy;
```

### CTE Benefits:
- **Readability**: Makes complex queries easier to understand
- **Reusability**: Can reference the same CTE multiple times
- **Maintainability**: Easier to modify and debug
- **Performance**: Can be more efficient than repeated subqueries

---

## 🪟 Window Functions

### What are Window Functions?
Window functions perform calculations across a set of rows that are related to the current row. Unlike aggregate functions, they don't reduce the number of rows returned.

### Basic Window Functions
**What they do**: Provide ranking, lag/lead analysis, and running totals without grouping.
**When to use**: When you need to compare rows to other rows or create rankings.
```sql
SELECT
    first_name,
    last_name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as salary_rank,
    RANK() OVER (ORDER BY salary DESC) as salary_rank_with_ties,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank,
    LAG(salary) OVER (ORDER BY hire_date) as prev_salary,
    LEAD(salary) OVER (ORDER BY hire_date) as next_salary
FROM employees;
```

### Window Functions with PARTITION BY
**What it does**: Divides the result set into partitions and applies the window function to each partition separately.
**When to use**: When you need rankings or calculations within groups.
```sql
SELECT
    department,
    first_name,
    last_name,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg_salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees;
```

### Running Totals
**What it does**: Calculates cumulative sums or other running calculations.
**When to use**: For financial reports, time series analysis, or any cumulative metrics.
```sql
SELECT
    first_name,
    last_name,
    salary,
    SUM(salary) OVER (ORDER BY hire_date) as running_total
FROM employees;
```

### Common Window Functions:
- **ROW_NUMBER()**: Unique sequential numbers
- **RANK()**: Ranks with gaps for ties
- **DENSE_RANK()**: Ranks without gaps for ties
- **LAG()**: Previous row's value
- **LEAD()**: Next row's value
- **SUM()/AVG()/COUNT()**: Running totals/averages/counts

---

## ✏️ Data Modification

### What is Data Modification?
Data modification statements (INSERT, UPDATE, DELETE) change the data in your database tables.

### INSERT
**What it does**: Adds new rows to a table.
**When to use**: When you need to add new data to your database.

```sql
-- Insert single row
INSERT INTO employees (first_name, last_name, email, status)
VALUES ('John', 'Doe', 'john.doe@email.com', 'active');

-- Insert multiple rows
INSERT INTO employees (first_name, last_name, email, status)
VALUES
    ('Jane', 'Smith', 'jane.smith@email.com', 'active'),
    ('Bob', 'Johnson', 'bob.johnson@email.com', 'pending');

-- Insert from SELECT
INSERT INTO employee_archive (first_name, last_name, email)
SELECT first_name, last_name, email
FROM employees
WHERE status = 'inactive';
```

### UPDATE
**What it does**: Modifies existing rows in a table.
**When to use**: When you need to change existing data.

```sql
-- Basic UPDATE
UPDATE employees
SET status = 'active', updated_time = CURRENT_TIMESTAMP
WHERE status = 'pending';

-- UPDATE with JOIN
UPDATE employees e
SET manager_uuid = m.uuid
FROM managers m
WHERE e.department = m.department;

-- UPDATE with subquery
UPDATE employees
SET salary = salary * 1.1
WHERE salary < (SELECT AVG(salary) FROM employees);
```

### DELETE
**What it does**: Removes rows from a table.
**When to use**: When you need to remove data (consider soft deletes for production).

```sql
-- Basic DELETE
DELETE FROM employees
WHERE status = 'inactive';

-- DELETE with JOIN
DELETE FROM employees e
USING departments d
WHERE e.department_id = d.id AND d.name = 'IT';

-- Soft DELETE (using deleted flag)
UPDATE employees
SET deleted = true, updated_time = CURRENT_TIMESTAMP
WHERE status = 'inactive';
```

### Data Modification Best Practices:
- **Always use WHERE**: Prevent accidental updates/deletes
- **Test first**: Use SELECT to verify your WHERE clause
- **Use transactions**: Wrap modifications in transactions
- **Consider soft deletes**: Mark as deleted instead of removing
- **Backup first**: Always backup before major changes

---

## ⚡ Indexes and Performance

### What are Indexes?
Indexes are database objects that improve the speed of data retrieval operations. They work like book indexes, providing quick access to specific data.

### Creating Indexes
```sql
-- Single column index
CREATE INDEX idx_employees_email ON employees(email);

-- Composite index
CREATE INDEX idx_employees_status_department ON employees(status, department);

-- Unique index
CREATE UNIQUE INDEX idx_employees_email_unique ON employees(email);

-- Partial index
CREATE INDEX idx_employees_active ON employees(department)
WHERE status = 'active';
```

### Performance Tips
```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN SELECT * FROM employees WHERE status = 'active';

-- Use EXPLAIN ANALYZE for detailed analysis
EXPLAIN ANALYZE SELECT * FROM employees WHERE status = 'active';

-- Avoid SELECT * in production
-- Instead of: SELECT * FROM employees
-- Use: SELECT id, first_name, last_name, email FROM employees

-- Use LIMIT for large result sets
SELECT * FROM employees LIMIT 1000;

-- Use appropriate data types
-- Use UUID for unique identifiers
-- Use TIMESTAMPTZ for timezone-aware timestamps
-- Use TEXT for variable-length strings
```

### Index Best Practices:
- **Index frequently queried columns**: WHERE, JOIN, ORDER BY columns
- **Composite indexes**: Order matters (most selective first)
- **Avoid over-indexing**: Too many indexes slow down INSERT/UPDATE
- **Monitor usage**: Remove unused indexes
- **Consider partial indexes**: For filtered queries

---

## 🎯 Best Practices

### Query Structure
**Recommended order of clauses** for optimal performance and readability:
```sql
SELECT column1, column2, ...
FROM table1 t1
JOIN table2 t2 ON t1.id = t2.id
WHERE condition1 AND condition2
GROUP BY column1, column2
HAVING aggregate_condition
ORDER BY column1, column2
LIMIT 100;
```

### Naming Conventions
```sql
-- Use meaningful aliases
SELECT
    e.first_name,
    e.last_name,
    d.name as department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- Use consistent naming
-- Tables: employees, departments, roles
-- Columns: first_name, last_name, email
-- Aliases: e, d, r (first letter of table name)
```

### Error Handling
```sql
-- Use COALESCE for NULL handling
SELECT
    first_name,
    COALESCE(manager_name, 'No Manager') as manager
FROM employees;

-- Use CASE for conditional logic
SELECT
    first_name,
    CASE
        WHEN salary < 30000 THEN 'Low'
        WHEN salary < 60000 THEN 'Medium'
        ELSE 'High'
    END as salary_level
FROM employees;
```

### General Best Practices:
- **Readability**: Write clear, well-formatted queries
- **Performance**: Use indexes and avoid expensive operations
- **Security**: Use parameterized queries to prevent SQL injection
- **Testing**: Always test queries with sample data
- **Documentation**: Comment complex queries

---

## 📚 Common Patterns

### Pivot-like Queries
**What it does**: Transforms rows into columns for reporting.
**When to use**: For creating summary reports with categories as columns.
```sql
SELECT
    department,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
FROM employees
GROUP BY department;
```

### Date Range Queries
**What it does**: Filters data by date ranges.
**When to use**: For time-based analysis and reporting.
```sql
-- Last 30 days
WHERE created_time >= CURRENT_DATE - INTERVAL '30 days'

-- Current month
WHERE created_time >= DATE_TRUNC('month', CURRENT_DATE)

-- Last year
WHERE created_time >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
```

### Top N Queries
**What it does**: Retrieves the top N records based on some criteria.
**When to use**: For leaderboards, rankings, or limiting result sets.

```sql
-- Top 10 highest paid employees
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10;

-- Top 3 employees per department
SELECT department, first_name, last_name, salary
FROM (
    SELECT
        department,
        first_name,
        last_name,
        salary,
        ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn
    FROM employees
) ranked
WHERE rn <= 3;
```

### Pattern Benefits:
- **Reusability**: These patterns can be adapted for different scenarios
- **Performance**: Optimized for common use cases
- **Maintainability**: Well-tested and proven approaches
- **Readability**: Clear intent and structure

---

## 🔍 Query Execution Order

Understanding the order in which SQL clauses are executed helps in writing efficient queries:

1. **FROM**: Determines the source tables
2. **JOIN**: Combines tables
3. **WHERE**: Filters rows
4. **GROUP BY**: Groups rows
5. **HAVING**: Filters groups
6. **SELECT**: Selects columns
7. **ORDER BY**: Sorts results
8. **LIMIT**: Limits results

### Why This Matters:
- **WHERE before GROUP BY**: Filter early to reduce data
- **HAVING after GROUP BY**: Filter groups after aggregation
- **ORDER BY last**: Sorting is expensive, do it last
- **Indexes matter**: WHERE and JOIN clauses benefit most from indexes

---

*This comprehensive guide covers SQL syntax with detailed explanations for each concept. Understanding when and why to use each feature will help you write more efficient and maintainable queries.*
