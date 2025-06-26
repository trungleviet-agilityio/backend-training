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
- **Purpose**: Populates the database with sample data
- **Contains**: Example data for all tables (series, employees, roles, etc.)
- **Run third**: After business rules are applied

### 4. `04_create_views.sql`
- **Purpose**: Creates database views for different user access patterns
- **Contains**: Views for production, analytics, and validation
- **Run fourth**: After test data is loaded

### 5. `05_delete_data.sql`
- **Purpose**: Cleans all test data from the database
- **Contains**: DELETE statements in proper dependency order
- **Use when**: You want to start fresh with clean data

### 6. `06_requirement_queries.sql`
- **Purpose**: Answers the specific questions from the requirements
- **Contains**: SQL queries for business requirements (see file for details)
- **Run anytime**: After test data is loaded

## Usage Instructions (Docker-first)

### Initial Setup
```bash
# 1. Create the database schema
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/01_create_schema.sql

# 2. Apply business rules and constraints
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/02_business_rules.sql

# 3. Load test data
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/03_test_data.sql

# 4. Create views
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/04_create_views.sql
```

### Load Generated Mock Data
```bash
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < scripts/data/generated_mock_data.sql
```

### Run Requirement Queries
```bash
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/06_requirement_queries.sql
```

### Clean Database
```bash
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/05_delete_data.sql
```

## Documentation & Resources
- **ERD:** [../diagrams/tv_company_erd.png](../diagrams/tv_company_erd.png)
- **Data Dictionary:** [../docs/data_dictionary.md](../docs/data_dictionary.md)
- **Business Rules:** [../docs/business_rules.md](../docs/business_rules.md)
- **Data Structure Analysis:** [../docs/data_structure_analysis.md](../docs/data_structure_analysis.md)
- **View

## Troubleshooting
- **Foreign Key Violations:** Ensure files are run in the correct order
- **Permission Errors:** Make sure you have proper database permissions
- **UUID Extension:** The schema automatically enables the uuid-ossp extension
- **Constraint Violations:** Check that test data follows business rules

## Verification Queries
```sql
-- Check table counts
SELECT 'series_domains' as table_name, COUNT(*) as count FROM series_domains
UNION ALL SELECT 'tv_series', COUNT(*) FROM tv_series
UNION ALL SELECT 'episodes', COUNT(*) FROM episodes
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'series_cast', COUNT(*) FROM series_cast
UNION ALL SELECT 'transmissions', COUNT(*) FROM transmissions;

-- Check views
SELECT viewname FROM pg_views WHERE schemaname = 'public' ORDER BY viewname;
```
