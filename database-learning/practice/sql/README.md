# TV Company Database SQL Files

This directory contains the SQL files for setting up and managing the TV Company database.

## File Structure

### 1. `01_create_schema.sql`
- **Purpose**: Creates all database tables
- **Contains**: Table creation statements with foreign key relationships
- **Run first**: This must be executed before any other files

### 2. `02_business_rules.sql`
- **Purpose**: Applies business rules, constraints, and triggers
- **Contains**:
  - Indexes for performance optimization
  - Check constraints for data validation
  - Triggers for automatic field updates
  - Business rule enforcement functions
- **Run second**: After schema creation

### 3. `03_test_data.sql`
- **Purpose**: Populates the database with test data
- **Contains**: Sample data for all tables including:
  - Series: Big Sister, Wild Lies, Laugh Factory, Reality Check
  - Actors: Bertil Bom, Anna Andersson, etc.
  - Multi-channel transmissions
  - Employee roles and series participation
- **Run third**: After business rules are applied

### 4. `04_create_views.sql`
- **Purpose**: Creates database views for different user access patterns
- **Contains**: 11 views organized by category:
  - Production Views (3)
  - HR Views (3)
  - Analytics Views (3)
  - Management Views (2)
- **Run fourth**: After test data is loaded

### 5. `05_delete_data.sql`
- **Purpose**: Cleans all test data from the database
- **Contains**: DELETE statements in proper dependency order
- **Use when**: You want to start fresh with clean data

### 6. `06_requirement_queries.sql`
- **Purpose**: Answers the specific questions from the requirements
- **Contains**: SQL queries for:
  - Which actors play in Big Sister?
  - In which series does Bertil Bom participate?
  - Which actors participate in more than one series?
  - How many times has Wild Lies episode 1 been transmitted?
  - How many directors are employed?
  - Which director has directed the most episodes?
- **Run anytime**: After test data is loaded

## Usage Instructions

### Initial Setup
```bash
# 1. Create the database schema
psql -d tv_company_db -f 01_create_schema.sql

# 2. Apply business rules and constraints
psql -d tv_company_db -f 02_business_rules.sql

# 3. Load test data
psql -d tv_company_db -f 03_test_data.sql

# 4. Create views
psql -d tv_company_db -f 04_create_views.sql
```

### Testing Requirements
```bash
# Run the requirement queries
psql -d tv_company_db -f 06_requirement_queries.sql
```

### Clean Database
```bash
# Remove all test data
psql -d tv_company_db -f 05_delete_data.sql
```

## Expected Results

### Requirement Query Results

1. **Big Sister Actors**: Bertil Bom (John Smith), Anna Andersson (Sarah Johnson), Diana Dahl (Mike Wilson)

2. **Bertil Bom's Series**: Big Sister (John Smith), Wild Lies (Detective Brown)

3. **Multi-series Actors**: Bertil Bom (2 series), Anna Andersson (2 series), Diana Dahl (2 series), Frida Fredriksson (2 series), Helena Holm (2 series)

4. **Wild Lies Episode 1 Transmissions**: 4 transmissions on multiple channels

5. **Director Count**: 4 directors employed

6. **Top Director**: Bertil Bom with 3 episodes directed

## Database Features

### Multi-Channel Broadcasting
- Transmissions can be broadcast on multiple channels simultaneously
- Example: Wild Lies episode 1 was broadcast on TV1, StreamTV, and GlobalTV

### Soft Delete
- All tables use soft delete (deleted boolean field)
- Queries automatically filter out deleted records

### Business Rules Enforced
- Directors must have active Director role
- Character names required for Actor roles
- Episode air dates must be >= series start date
- Employment dates must be >= birthdate

### Performance Optimized
- Indexes on foreign keys and frequently queried fields
- Composite indexes for common query patterns
- Soft delete filtering indexes

## Troubleshooting

### Common Issues

1. **Foreign Key Violations**: Ensure files are run in the correct order
2. **Permission Errors**: Make sure you have proper database permissions
3. **UUID Extension**: The schema automatically enables the uuid-ossp extension
4. **Constraint Violations**: Check that test data follows business rules

### Verification Queries

```sql
-- Check table counts
SELECT 'series_domains' as table_name, COUNT(*) as count FROM series_domains
UNION ALL SELECT 'tv_series', COUNT(*) FROM tv_series
UNION ALL SELECT 'episodes', COUNT(*) FROM episodes
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'transmissions', COUNT(*) FROM transmissions;

-- Check views
SELECT viewname FROM pg_views WHERE schemaname = 'public' ORDER BY viewname;
```
