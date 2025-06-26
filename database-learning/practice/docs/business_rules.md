# Business Rules: TV Company Database

## 🎬 Overview

This document defines the business rules that govern the TV Company Database, ensuring data integrity, consistency, and proper operation of TV series production and broadcasting systems. Business rules are constraints based on how the TV company perceives and uses its data, derived from the way it functions and conducts business operations.

## 📋 Business Rule Categories

### Database-Oriented Business Rules
Constraints that can be established within the logical design of the database through field specifications, relationship characteristics, and database constraints.

### Application-Oriented Business Rules
Constraints that cannot be established in the logical design and must be implemented in the physical design or application code.

## 🔧 Field-Specific Business Rules

### BR-001: Series Domain Name Uniqueness
- **Statement**: Each series domain name must be unique across the system
- **Constraint**: Prevents duplicate domain names that could cause confusion
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `series_domains.name`
- **Field Elements Affected**: Uniqueness, Range of Values
- **Implementation**: Database UNIQUE constraint on `series_domains.name`
- **Action Taken**: UNIQUE constraint added to field specification

### BR-002: Series Domain Assignment
- **Statement**: Every TV series must be assigned to exactly one domain
- **Constraint**: Ensures proper categorization and organization of series
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `tv_series.domain_uuid`
- **Field Elements Affected**: Required Value, Range of Values
- **Implementation**: NOT NULL constraint + FOREIGN KEY to `series_domains.uuid`
- **Action Taken**: NOT NULL and FOREIGN KEY constraints added

### BR-003: Series Title Uniqueness Within Domain
- **Statement**: Series titles must be unique within the same domain
- **Constraint**: Prevents confusion between series in the same category
- **Type**: Application-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `tv_series.title`, `tv_series.domain_uuid`
- **Field Elements Affected**: Uniqueness, Range of Values
- **Implementation**: Application-level validation + database trigger
- **Action Taken**: Trigger function created to validate uniqueness within domain

### BR-004: Series Date Range Validation
- **Statement**: If both start_date and end_date are provided, end_date must be after start_date
- **Constraint**: Ensures logical chronological order of series production
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `tv_series.start_date`, `tv_series.end_date`
- **Field Elements Affected**: Range of Values
- **Implementation**: Database CHECK constraint
- **Action Taken**: CHECK constraint added: `end_date > start_date`

### BR-005: Episode Number Uniqueness Within Series
- **Statement**: Episode numbers must be unique within the same series
- **Constraint**: Prevents duplicate episode numbering within a series
- **Type**: Application-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `episodes.episode_number`, `episodes.series_uuid`
- **Field Elements Affected**: Uniqueness, Range of Values
- **Implementation**: Application-level validation + database trigger
- **Action Taken**: Trigger function created to validate uniqueness within series

### BR-006: Episode Duration Validation
- **Statement**: Episode duration must be positive and reasonable (1-300 minutes)
- **Constraint**: Ensures realistic episode lengths for TV production
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `episodes.duration_minutes`
- **Field Elements Affected**: Range of Values
- **Implementation**: Database CHECK constraint
- **Action Taken**: CHECK constraint added: `duration_minutes > 0 AND duration_minutes <= 300`

### BR-007: Episode Director Assignment
- **Statement**: Each episode must have exactly one director assigned
- **Constraint**: Ensures every episode has responsible creative leadership
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `episodes.director_uuid`
- **Field Elements Affected**: Required Value, Range of Values
- **Implementation**: NOT NULL constraint + FOREIGN KEY to `employees.uuid`
- **Action Taken**: NOT NULL and FOREIGN KEY constraints added

### BR-008: Director Role Validation
- **Statement**: Episode directors must have the "Director" role in the system (any series)
- **Constraint**: Ensures only qualified directors can be assigned to episodes
- **Type**: Application-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `episodes.director_uuid`, `series_cast.role_uuid`, `roles.name`
- **Field Elements Affected**: Range of Values
- **Implementation**: Application-level validation + database trigger
- **Action Taken**: Trigger function created to validate director role assignment

### BR-009: Employee Email Uniqueness
- **Statement**: Employee email addresses must be unique across the system
- **Constraint**: Prevents duplicate email addresses for employee identification
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `employees.email`
- **Field Elements Affected**: Uniqueness, Range of Values
- **Implementation**: Database UNIQUE constraint
- **Action Taken**: UNIQUE constraint added to email field

### BR-010: Employee Status Validation
- **Statement**: Employee status must be one of: available, busy, unavailable
- **Constraint**: Ensures consistent status tracking across the organization
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `employees.status`
- **Field Elements Affected**: Range of Values
- **Implementation**: Database CHECK constraint or ENUM
- **Action Taken**: CHECK constraint added with valid status values

### BR-011: Role Name Uniqueness
- **Statement**: Role names must be unique across the system
- **Constraint**: Prevents duplicate role definitions
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `roles.name`
- **Field Elements Affected**: Uniqueness, Range of Values
- **Implementation**: Database UNIQUE constraint
- **Action Taken**: UNIQUE constraint added to role name field

### BR-012: Cast Assignment Uniqueness
- **Statement**: No duplicate employee-series-role combinations allowed
- **Constraint**: Prevents duplicate cast assignments
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `series_cast.employee_uuid`, `series_cast.series_uuid`, `series_cast.role_uuid`
- **Field Elements Affected**: Uniqueness
- **Implementation**: Database UNIQUE constraint
- **Action Taken**: UNIQUE constraint added to composite key

### BR-013: Character Name Requirements
- **Statement**: Character names are required for Actor roles, optional for other roles
- **Constraint**: Ensures proper character identification for actors
- **Type**: Application-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `series_cast.character_name`, `series_cast.role_uuid`
- **Field Elements Affected**: Required Value
- **Implementation**: Application-level validation
- **Action Taken**: Validation logic implemented in application code

### BR-014: Viewership Data Validation
- **Statement**: Viewership numbers must be non-negative
- **Constraint**: Ensures realistic viewership data
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `transmissions.viewership`
- **Field Elements Affected**: Range of Values
- **Implementation**: Database CHECK constraint
- **Action Taken**: CHECK constraint added: `viewership >= 0`

### BR-015: Channel Name Uniqueness
- **Statement**: Channel names must be unique across the system
- **Constraint**: Prevents duplicate channel definitions
- **Type**: Database-oriented
- **Category**: Field-specific
- **Test On**: INSERT, UPDATE
- **Structures Affected**: `channels.name`
- **Field Elements Affected**: Uniqueness, Range of Values
- **Implementation**: Database UNIQUE constraint
- **Action Taken**: UNIQUE constraint added to channel name field

## 🔗 Relationship-Specific Business Rules

### BR-016: Series Domain Relationship
- **Statement**: Every TV series must be associated with exactly one domain
- **Constraint**: Ensures proper series categorization
- **Type**: Database-oriented
- **Category**: Relationship-specific
- **Test On**: INSERT, UPDATE, DELETE
- **Structures Affected**: `tv_series` ↔ `series_domains`
- **Relationship Characteristics Affected**: Degree of participation (mandatory)
- **Implementation**: Foreign key constraint with NOT NULL
- **Action Taken**: Foreign key relationship established

### BR-017: Episode Series Relationship
- **Statement**: Every episode must belong to exactly one series
- **Constraint**: Ensures proper episode organization
- **Type**: Database-oriented
- **Category**: Relationship-specific
- **Test On**: INSERT, UPDATE, DELETE
- **Structures Affected**: `episodes` ↔ `tv_series`
- **Relationship Characteristics Affected**: Degree of participation (mandatory)
- **Implementation**: Foreign key constraint with NOT NULL
- **Action Taken**: Foreign key relationship established

### BR-018: Episode Director Relationship
- **Statement**: Every episode must have exactly one director
- **Constraint**: Ensures creative responsibility assignment
- **Type**: Database-oriented
- **Category**: Relationship-specific
- **Test On**: INSERT, UPDATE, DELETE
- **Structures Affected**: `episodes` ↔ `employees`
- **Relationship Characteristics Affected**: Degree of participation (mandatory)
- **Implementation**: Foreign key constraint with NOT NULL
- **Action Taken**: Foreign key relationship established

### BR-019: Series Cast Relationship
- **Statement**: Series cast assignments link employees, series, and roles
- **Constraint**: Enables proper cast management and role tracking
- **Type**: Database-oriented
- **Category**: Relationship-specific
- **Test On**: INSERT, UPDATE, DELETE
- **Structures Affected**: `series_cast` ↔ `employees`, `series_cast` ↔ `tv_series`, `series_cast` ↔ `roles`
- **Relationship Characteristics Affected**: Degree of participation (mandatory)
- **Implementation**: Foreign key constraints
- **Action Taken**: Foreign key relationships established

### BR-020: Transmission Episode Relationship
- **Statement**: Every transmission must reference a valid episode
- **Constraint**: Ensures proper transmission tracking
- **Type**: Database-oriented
- **Category**: Relationship-specific
- **Test On**: INSERT, UPDATE, DELETE
- **Structures Affected**: `transmissions` ↔ `episodes`
- **Relationship Characteristics Affected**: Degree of participation (mandatory)
- **Implementation**: Foreign key constraint with NOT NULL
- **Action Taken**: Foreign key relationship established

### BR-021: Multi-Channel Broadcasting Relationship
- **Statement**: Transmissions can be broadcast on multiple channels simultaneously
- **Constraint**: Enables modern multi-platform broadcasting
- **Type**: Database-oriented
- **Category**: Relationship-specific
- **Test On**: INSERT, UPDATE, DELETE
- **Structures Affected**: `transmission_channels` ↔ `transmissions`, `transmission_channels` ↔ `channels`
- **Relationship Characteristics Affected**: Degree of participation (optional)
- **Implementation**: Linking table with foreign keys
- **Action Taken**: Many-to-many relationship established via linking table

## 🗃️ Validation Tables

### VT-001: Employee Status Validation Table
- **Purpose**: Enforce valid employee status values
- **Structure**:
  - `status_code` (Primary Key)
  - `status_name` (Description)
- **Valid Values**: available, busy, unavailable
- **Usage**: Reference table for employee status validation

### VT-002: Channel Type Validation Table
- **Purpose**: Enforce valid channel type values
- **Structure**:
  - `type_code` (Primary Key)
  - `type_name` (Description)
- **Valid Values**: Cable, Satellite, Streaming, Broadcast, Web
- **Usage**: Reference table for channel type validation

### VT-003: Role Type Validation Table
- **Purpose**: Enforce valid TV production role types
- **Structure**:
  - `role_code` (Primary Key)
  - `role_name` (Description)
- **Valid Values**: Actor, Director, Producer, Writer, Cameraman
- **Usage**: Reference table for role validation

## 📊 Business Rule Compliance Monitoring

### Rule Violation Tracking
- **Logging**: All business rule violations are logged with timestamp and context
- **Alerting**: Critical violations trigger administrator notifications
- **Reporting**: Monthly compliance reports generated
- **Trend Analysis**: Violation patterns analyzed for process improvement

### Data Quality Metrics
- **Completeness**: Track percentage of required fields populated
- **Accuracy**: Monitor constraint violation rates
- **Consistency**: Measure relationship integrity compliance
- **Timeliness**: Track data freshness and update frequency

## 🔄 Review and Maintenance Process

### Quarterly Reviews
- **Rule Effectiveness**: Assess if rules still serve their intended purpose
- **Performance Impact**: Monitor rule enforcement performance
- **User Feedback**: Collect feedback on rule usability and clarity
- **Compliance Status**: Review violation trends and patterns

### Annual Updates
- **Rule Modifications**: Update rules based on business changes
- **New Rules**: Add rules for new business requirements
- **Rule Removal**: Remove obsolete or overly restrictive rules
- **Documentation Updates**: Update all related documentation

## 📋 Implementation Guidelines

### Database-Level Enforcement
- **Constraints**: Use CHECK, UNIQUE, and FOREIGN KEY constraints
- **Triggers**: Implement complex validation logic in triggers
- **Indexes**: Create appropriate indexes for performance
- **Default Values**: Set sensible defaults for required fields

### Application-Level Enforcement
- **Validation Logic**: Implement complex business rules in application code
- **Error Handling**: Provide clear, user-friendly error messages
- **Transaction Management**: Ensure atomic operations for rule compliance
- **Audit Logging**: Log all rule violations for compliance tracking

### Error Handling Strategy
- **Specific Error Codes**: Return distinct error codes for different violations
- **User Guidance**: Provide actionable error messages
- **Graceful Degradation**: Handle partial validation failures appropriately
- **Retry Mechanisms**: Support retry logic where appropriate

---

*These business rules ensure the integrity, consistency, and proper operation of the TV Company Database for TV series production and broadcasting operations. Regular review and maintenance of these rules is essential as the organization evolves.*
