# 🎬 TV Company Database Setup

This directory contains the database setup for the TV Company project.

## Quick Start

### 1. Start the Database
```bash
# Navigate to the practice directory
cd database-learning/practice

# Start the database
./scripts/start-db.sh start
```

### 2. Connect to Database
```bash
# Connect with psql
./scripts/start-db.sh connect

# Or use any PostgreSQL client with these details:
# Host: localhost
# Port: 5432
# Database: tv_company_db
# User: tv_company_user
# Password: tv_company_pass
```

### 3. Create Schema
The database schema will be automatically created when the container starts up. The SQL script is located at:
- `sql/01_create_schema.sql`

## Database Management

### Available Commands
```bash
./scripts/start-db.sh start     # Start database
./scripts/start-db.sh stop      # Stop database
./scripts/start-db.sh restart   # Restart database
./scripts/start-db.sh status    # Show status
./scripts/start-db.sh connect   # Connect to database
./scripts/start-db.sh logs      # Show logs
./scripts/start-db.sh reset     # Reset database (WARNING: deletes all data)
./scripts/start-db.sh help      # Show help
```

### Manual Docker Commands
```bash
# Start with docker-compose
docker-compose up -d

# Stop with docker-compose
docker-compose down

# View logs
docker-compose logs postgres

# Connect directly
docker exec -it tv_company_db psql -U tv_company_user -d tv_company_db
```

## Database Schema

The database includes the following tables (based on `diagrams/tv_company_rd.d2`):

### Core Tables
- `series_domains` - TV series genres/domains
- `tv_series` - Television series information
- `episodes` - Individual episode details
- `transmissions` - Broadcasting events
- `channels` - Broadcasting platforms
- `employees` - Personnel information
- `roles` - Job functions
- `departments` - Organizational structure

### Linking Tables
- `transmission_channels` - Links transmissions to channels (M:N)
- `employee_roles` - Links employees to company-wide roles (M:N)
- `employee_series_roles` - Links employees to series with specific roles (M:N)

## Features

- ✅ **UUID Primary Keys** - All tables use UUIDs for global uniqueness
- ✅ **Soft Delete** - All tables support logical deletion
- ✅ **Audit Fields** - Created and updated timestamps
- ✅ **Foreign Key Constraints** - Proper referential integrity
- ✅ **Indexes** - Optimized for common query patterns
- ✅ **Data Validation** - Check constraints for business rules
- ✅ **Multi-channel Support** - Transmissions can be on multiple channels

## Business Rules & Data Integrity

### Documentation
- 📜 [`docs/business_rules.md`](docs/business_rules.md) - Complete business rules documentation
- 🔍 [`docs/schema_vs_application_logic.md`](docs/schema_vs_application_logic.md) - Schema vs Application logic distinction
- 📊 [`docs/data_dictionary.md`](docs/data_dictionary.md) - Detailed field specifications

### Implementation
- 🗄️ [`sql/01_create_schema.sql`](sql/01_create_schema.sql) - Table structures and basic constraints
- ⚡ [`sql/02_business_rules.sql`](sql/02_business_rules.sql) - Schema logic (database-enforced rules)
- 📝 [`sql/03_test_data.sql`](sql/03_test_data.sql) - Sample data for testing
- 👁️ [`sql/04_create_views.sql`](sql/04_create_views.sql) - Database views for common queries
- 🗑️ [`sql/05_delete_data.sql`](sql/05_delete_data.sql) - Data cleanup utilities
- 🔍 [`sql/06_requirement_queries.sql`](sql/06_requirement_queries.sql) - Example queries for business requirements

### Key Concepts

#### Schema Logic (Database-Enforced)
- Field-level constraints (CHECK, NOT NULL, UNIQUE)
- Foreign key relationships
- Business rule triggers (director validation, character names)
- Performance indexes
- Audit field maintenance

#### Application Logic (Code-Enforced)
- Soft delete referential integrity
- Complex business workflows
- User interface validation
- Cross-table validation rules
- Reporting and analytics logic

## Connection Details

| Parameter | Value |
|-----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | tv_company_db |
| User | tv_company_user |
| Password | tv_company_pass |

## Next Steps

1. **Start the database** using the script above
2. **Review the documentation** to understand business rules and data integrity
3. **Connect to the database** and verify the schema
4. **Insert sample data** to test the design
5. **Run queries** to validate the business requirements

## Troubleshooting

### Database won't start
```bash
# Check if port 5432 is already in use
sudo lsof -i :5432

# Check Docker logs
./scripts/start-db.sh logs
```

### Can't connect to database
```bash
# Check if container is running
./scripts/start-db.sh status

# Restart the database
./scripts/start-db.sh restart
```

### Reset everything
```bash
# WARNING: This deletes all data
./scripts/start-db.sh reset
```
