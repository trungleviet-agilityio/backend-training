# 🎬 TV Company Database – Practice Environment

## Project Overview
A sample database for managing TV company operations: series, episodes, employees, roles, transmissions, and channels.
Designed for learning and practicing database design, business rules, and SQL querying.

---

## Directory Structure
```
practice/
├── diagrams/         # ERD and relationship diagrams (PNG, D2)
├── docs/             # Business rules, data dictionary, and documentation
├── scripts/          # Shell and data generation scripts
│   └── data/         # Mock data generator and output
├── sql/              # All SQL files (schema, rules, test data, views, queries)
├── docker-compose.yaml
└── README.md         # This file
```

---

## How to Run with Docker

### 1. Start the Database
```bash
cd database-learning/practice
./scripts/start-db.sh start
```

### 2. Check Database Status
```bash
./scripts/start-db.sh status
```

### 3. Connect to the Database
```bash
./scripts/start-db.sh connect
```
Or use any PostgreSQL client with:
- Host: `localhost`
- Port: `5432`
- Database: `tv_company_db`
- User: `tv_company_user`
- Password: `tv_company_pass`

### 4. Load Schema, Business Rules, and Data
The schema is loaded automatically on first run.
To (re)load or update, use:
```bash
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/01_create_schema.sql
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/02_business_rules.sql
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/03_test_data.sql
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/04_create_views.sql
```
**Or, to load large generated mock data:**
```bash
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < scripts/data/generated_mock_data.sql
```

### 5. Run Requirement Queries
```bash
docker exec -i tv_company_db psql -U tv_company_user -d tv_company_db < sql/06_requirement_queries.sql
```

---

## Database Schema

**Main Tables:**
- `series_domains` – TV series genres/domains
- `tv_series` – Television series information
- `episodes` – Individual episode details
- `transmissions` – Broadcasting events
- `channels` – Broadcasting platforms
- `employees` – Personnel information
- `roles` – Job functions
- `series_cast` – Employee participation in series (with roles)
- `transmission_channels` – Links transmissions to channels (M:N)

**See the ERD:**
- [ERD PNG](diagrams/tv_company_erd.png)
- [ERD Source (D2)](diagrams/tv_company_rd.d2)

---

## Key Features
- **Business Rules:** Enforced via constraints, triggers, and documentation ([docs/business_rules.md](docs/business_rules.md))
- **Soft Delete:** All tables support logical deletion (`deleted` flag)
- **Audit Fields:** Automatic timestamps for creation and updates
- **Multi-Channel Broadcasting:** Transmissions can be broadcast on multiple channels
- **Performance:** Indexes and optimized queries

---

## Documentation & Resources
- **Mission Statement:** [docs/mission_statement.md](docs/mission_statement.md)
- **Data Dictionary:** [docs/data_dictionary.md](docs/data_dictionary.md)
- **Data Structure Analysis:** [docs/data_structure_analysis.md](docs/data_structure_analysis.md)
- **Business Rules:** [docs/business_rules.md](docs/business_rules.md)
- **Schema vs Application Logic:** [docs/schema_vs_application_logic.md](docs/schema_vs_application_logic.md)
- **SQL Syntax Reference:** [docs/SQL_SYNTAX_QUICK_REFERENCE.md](docs/SQL_SYNTAX_QUICK_REFERENCE.md)

---

## Example Queries
See `sql/06_requirement_queries.sql` for ready-to-run business questions, such as:
- Which actors play in a given series?
- How many times has a specific episode been transmitted?
- Which director has directed the most episodes?

---

## Extending the Database
- **Add new business rules:** Edit `sql/02_business_rules.sql` and document in `docs/business_rules.md`
- **Add new tables or fields:** Update `sql/01_create_schema.sql` and ERD in `diagrams/`
- **Generate more mock data:** Use `scripts/data/generate-mock-data.js`

---

## Troubleshooting
- **Database won't start:**
  Check if port 5432 is in use (`sudo lsof -i :5432`)
- **Permission errors:**
  Ensure your user has access to Docker and PostgreSQL
- **Foreign key/constraint errors:**
  Run SQL files in the correct order

---

## Contact & Contribution
For questions or contributions, open an issue or submit a pull request.

---

## Changelog
- [ ] Add your own changelog entries here as the project evolves.
