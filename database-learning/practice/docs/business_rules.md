# 📜 Business Rules for TV Company Database

---

## 1. Introduction
This document defines all business rules for the TV company database system, organized by enforcement type and table. Rules are categorized as **schema logic** (enforced by database constraints/triggers) or **application logic** (enforced by application code) based on database design best practices.

**Key Distinction:**
- **Schema Logic**: Enforced at database level (constraints, triggers, foreign keys)
- **Application Logic**: Enforced at application level (code validation, business workflows)

---

## 2. Schema Logic (Database-Enforced Rules)

### 2.1. Field-Level Constraints

#### SeriesDomain
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **name**: UNIQUE NOT NULL, max 100 chars (enforced by schema)
- **description**: max 500 chars (enforced by schema)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### TVSeries
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **title**: NOT NULL (enforced by schema)
- **domain_uuid**: FOREIGN KEY to SeriesDomain (enforced by schema)
- **start_date**: NOT NULL (enforced by schema)
- **end_date**: Must be >= start_date (enforced by CHECK constraint)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### Episode
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **series_uuid**: FOREIGN KEY to TVSeries (enforced by schema)
- **episode_number**: Positive integer (enforced by schema)
- **duration_minutes**: BETWEEN 1 AND 600 (enforced by CHECK constraint)
- **air_date**: Must be >= TVSeries.start_date (enforced by CHECK constraint)
- **director_uuid**: FOREIGN KEY to Employee (enforced by schema)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### Transmission
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **episode_uuid**: FOREIGN KEY to Episode (enforced by schema)
- **transmission_time**: NOT NULL TIMESTAMPTZ (enforced by schema)
- **viewership**: BIGINT >= 0 (enforced by CHECK constraint)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### Channel
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **name**: UNIQUE NOT NULL, max 100 chars (enforced by schema)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### Employee
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **name**: NOT NULL (enforced by schema)
- **email**: UNIQUE NOT NULL (enforced by schema)
- **birthdate**: NOT NULL (enforced by schema)
- **employment_date**: Must be >= birthdate (enforced by CHECK constraint)
- **is_internal**: BOOLEAN DEFAULT TRUE (enforced by schema)
- **status**: ENUM('active', 'on_leave', 'terminated') (enforced by schema)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### Role
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **name**: UNIQUE NOT NULL (enforced by schema)
- **department_uuid**: FOREIGN KEY to Department (enforced by schema)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

#### Department
- **uuid**: UUID PRIMARY KEY (enforced by schema)
- **name**: UNIQUE NOT NULL (enforced by schema)
- **deleted**: BOOLEAN DEFAULT FALSE (enforced by schema)
- **created_time, updated_time**: Set automatically (enforced by triggers)

### 2.2. Relationship-Level Constraints

#### Composite Unique Constraints
- **Episode**: (series_uuid, episode_number) UNIQUE (enforced by schema)
- **EmployeeRole**: (employee_uuid, role_uuid) PRIMARY KEY (enforced by schema)
- **EmployeeSeriesRole**: (employee_uuid, series_uuid, role_uuid) PRIMARY KEY (enforced by schema)
- **TransmissionChannel**: (transmission_uuid, channel_uuid) PRIMARY KEY (enforced by schema)

#### Foreign Key Constraints
- All foreign keys enforce referential integrity (enforced by schema)
- Cascade rules prevent orphaned records (enforced by schema)

### 2.3. Business Rule Triggers

#### Director Validation
- **Rule**: Director must have active 'Director' role and be active employee
- **Enforcement**: Trigger on episodes table
- **Function**: `validate_director_role()`

#### Character Name Validation
- **Rule**: Character name required for Actor role, NULL for others
- **Enforcement**: Trigger on employee_series_roles table
- **Function**: `validate_character_name()`

#### Channel Deletion Prevention
- **Rule**: Cannot delete channel with active transmission records
- **Enforcement**: Trigger on channels table
- **Function**: `prevent_channel_deletion()`

#### Audit Field Updates
- **Rule**: updated_time automatically set on record modification
- **Enforcement**: Triggers on all tables
- **Function**: `update_updated_time()`

### 2.4. Performance Indexes
- Foreign key indexes for join performance
- Soft delete indexes for filtering
- Composite indexes for common query patterns
- Unique constraint indexes

---

## 3. Application Logic (Code-Enforced Rules)

### 3.1. Cross-Table Validation Rules

#### Soft Delete Referential Integrity
- **Rule**: No reference to deleted records across tables
- **Enforcement**: Application queries must filter `deleted = FALSE`
- **Examples**:
  - Episodes cannot reference deleted TVSeries
  - Transmissions cannot reference deleted Episodes
  - EmployeeSeriesRoles cannot reference deleted Employees/Series/Roles

#### Business Workflow Rules
- **Rule**: Only active employees can be assigned to new episodes/series
- **Enforcement**: Application validation before database operations
- **Rule**: First episode of each series must have episode_number = 1
- **Enforcement**: Application logic during episode creation

#### Complex Business Rules
- **Rule**: A TV series must have at least one episode
- **Enforcement**: Application/reporting logic, not database constraint
- **Rule**: An employee must have at least one active role
- **Enforcement**: Application validation during role management

### 3.2. User Interface Rules
- **Rule**: Channel names must be unique across active channels
- **Enforcement**: Application validation with user-friendly error messages
- **Rule**: Email format validation
- **Enforcement**: Application-level regex validation

### 3.3. Reporting and Analytics Rules
- **Rule**: All queries must filter deleted records unless explicitly required
- **Enforcement**: Application query patterns and reporting logic
- **Rule**: Complex aggregations and business metrics
- **Enforcement**: Application reporting services

---

## 4. Implementation Guidelines

### 4.1. Schema Logic Implementation
- **Location**: `02_business_rules.sql` and schema files
- **Tools**: CHECK constraints, triggers, foreign keys, indexes
- **Benefits**: Automatic enforcement, high reliability, centralized
- **Limitations**: Simple rules only, no complex business workflows

### 4.2. Application Logic Implementation
- **Location**: Application code, service layers, validation logic
- **Tools**: Programming language validation, business objects, workflows
- **Benefits**: Complex rules, user-friendly errors, business workflows
- **Limitations**: Manual enforcement, distributed logic, potential bypass

### 4.3. When to Use Each Type

#### Use Schema Logic For:
- ✅ Field format and range validation
- ✅ Referential integrity
- ✅ Atomic business rules (single table)
- ✅ Audit trail requirements
- ✅ Performance-critical constraints

#### Use Application Logic For:
- ✅ Cross-table validation
- ✅ Complex business workflows
- ✅ User interface validation
- ✅ External system integration
- ✅ Temporary or conditional rules

---

## 5. Data Integrity Review Checklist

### Schema Logic Checklist
- [ ] All primary keys properly defined
- [ ] All foreign keys with appropriate constraints
- [ ] Field-level constraints (CHECK, NOT NULL, UNIQUE)
- [ ] Business rule triggers implemented and tested
- [ ] Performance indexes created
- [ ] Audit fields automatically maintained

### Application Logic Checklist
- [ ] Soft delete filtering in all queries
- [ ] Cross-table validation implemented
- [ ] User input validation
- [ ] Business workflow enforcement
- [ ] Error handling and user feedback
- [ ] Reporting logic implemented

---

## 6. References
- Project requirements
- Chapter 9: Field Specifications (Database Design Book)
- Chapter 10: Table Relationships (Database Design Book)
- Chapter 11: Business Rules (Database Design Book)
- Chapter 13: Reviewing Data Integrity (Database Design Book)
