# Business Rules: TV Company Database

## 🎬 Overview

This document defines the business rules that govern the TV Company Database, ensuring data integrity, consistency, and proper operation of TV series production and broadcasting systems.

## 📋 Core Business Rules

### 1. **Series Domain Management**

#### BR-001: Series Domain Uniqueness
- **Rule**: Each series domain name must be unique across the system
- **Implementation**: Database UNIQUE constraint on `series_domains.name`
- **Validation**: Application-level validation before insertion
- **Error Handling**: Return error if duplicate domain name attempted

#### BR-002: Series Domain Assignment
- **Rule**: Every TV series must be assigned to exactly one domain
- **Implementation**: NOT NULL constraint on `tv_series.domain_uuid`
- **Validation**: Foreign key constraint to `series_domains.uuid`
- **Error Handling**: Prevent series creation without valid domain

### 2. **TV Series Management**

#### BR-003: Series Title Uniqueness
- **Rule**: Series titles must be unique within the same domain
- **Implementation**: Application-level validation + database trigger
- **Validation**: Check for existing series with same title in domain
- **Error Handling**: Return error if duplicate title in domain

#### BR-004: Series Date Validation
- **Rule**: If both start_date and end_date are provided, end_date must be after start_date
- **Implementation**: Database CHECK constraint
- **Validation**: `tv_series.end_date > tv_series.start_date`
- **Error Handling**: Prevent invalid date range insertion

#### BR-005: Series Lifecycle Tracking
- **Rule**: Series must have either start_date or end_date (or both) for production tracking
- **Implementation**: Application-level validation
- **Validation**: At least one date field must be provided
- **Error Handling**: Warning if no dates provided, but allow insertion

### 3. **Episode Management**

#### BR-006: Episode Number Uniqueness
- **Rule**: Episode numbers must be unique within the same series
- **Implementation**: Application-level validation + database trigger
- **Validation**: Check for existing episode with same number in series
- **Error Handling**: Return error if duplicate episode number

#### BR-007: Episode Duration Validation
- **Rule**: Episode duration must be positive and reasonable (1-300 minutes)
- **Implementation**: Database CHECK constraint
- **Validation**: `episodes.duration_minutes > 0 AND episodes.duration_minutes <= 300`
- **Error Handling**: Prevent invalid duration insertion

#### BR-008: Episode Director Assignment
- **Rule**: Each episode must have exactly one director assigned
- **Implementation**: NOT NULL constraint on `episodes.director_uuid`
- **Validation**: Foreign key constraint to `employees.uuid`
- **Error Handling**: Prevent episode creation without director

#### BR-009: Director Role Validation
- **Rule**: Episode directors must have the "Director" role in the system
- **Implementation**: Application-level validation + database trigger
- **Validation**: Check if employee has Director role in series_cast or roles table
- **Error Handling**: Return error if employee doesn't have Director role

#### BR-010: Flexible Director Assignment
- **Rule**: Different episodes within the same series may be directed by different directors
- **Implementation**: No constraint (allows flexibility)
- **Validation**: Application logic supports multiple directors per series
- **Business Logic**: Enables creative diversity and scheduling flexibility

### 4. **Employee Management**

#### BR-011: Employee Email Uniqueness
- **Rule**: Employee email addresses must be unique across the system
- **Implementation**: Database UNIQUE constraint on `employees.email`
- **Validation**: Application-level email format validation
- **Error Handling**: Return error if duplicate email or invalid format

#### BR-012: Employee Status Management
- **Rule**: Employee status must be one of: available, busy, unavailable
- **Implementation**: Database ENUM constraint
- **Validation**: Application-level status validation
- **Error Handling**: Prevent invalid status assignment

#### BR-013: Employment Date Validation
- **Rule**: Employment date must not be in the future
- **Implementation**: Application-level validation
- **Validation**: `employees.employment_date <= CURRENT_DATE`
- **Error Handling**: Warning if future date, but allow insertion

#### BR-014: Employee Birthdate Validation
- **Rule**: Employee birthdate must be reasonable (not in future, not too far in past)
- **Implementation**: Application-level validation
- **Validation**: `employees.birthdate <= CURRENT_DATE AND employees.birthdate >= '1900-01-01'`
- **Error Handling**: Warning if unreasonable date, but allow insertion

### 5. **Role Management**

#### BR-015: Role Name Uniqueness
- **Rule**: Role names must be unique across the system
- **Implementation**: Database UNIQUE constraint on `roles.name`
- **Validation**: Application-level validation before insertion
- **Error Handling**: Return error if duplicate role name

#### BR-016: TV Production Role Focus
- **Rule**: Roles must be focused on TV production (Actor, Director, Producer, Writer, etc.)
- **Implementation**: Application-level validation
- **Validation**: Check against allowed production roles
- **Error Handling**: Return error if non-production role attempted

### 6. **Series Cast Management**

#### BR-017: Cast Assignment Uniqueness
- **Rule**: No duplicate employee-series-role combinations allowed
- **Implementation**: Database UNIQUE constraint on `series_cast(employee_uuid, series_uuid, role_uuid)`
- **Validation**: Application-level validation before insertion
- **Error Handling**: Return error if duplicate assignment

#### BR-018: Character Name Requirements
- **Rule**: Character names are required for Actor roles, optional for other roles
- **Implementation**: Application-level validation
- **Validation**: If role is "Actor", character_name must not be null
- **Error Handling**: Return error if Actor role missing character name

#### BR-019: Cast Assignment Date Validation
- **Rule**: If both start_date and end_date are provided, end_date must be after start_date
- **Implementation**: Application-level validation
- **Validation**: `series_cast.end_date > series_cast.start_date`
- **Error Handling**: Return error if invalid date range

#### BR-020: Multi-Role Employee Support
- **Rule**: Employees can have multiple roles in the same series
- **Implementation**: No constraint (allows multiple records per employee-series)
- **Validation**: Application logic supports multiple role assignments
- **Business Logic**: Enables actors who also direct, producers who act, etc.

### 7. **Transmission Management**

#### BR-021: Transmission Episode Validation
- **Rule**: Every transmission must reference a valid episode
- **Implementation**: NOT NULL constraint on `transmissions.episode_uuid`
- **Validation**: Foreign key constraint to `episodes.uuid`
- **Error Handling**: Prevent transmission creation without valid episode

#### BR-022: Viewership Data Validation
- **Rule**: Viewership numbers must be non-negative
- **Implementation**: Database CHECK constraint
- **Validation**: `transmissions.viewership >= 0`
- **Error Handling**: Prevent negative viewership insertion

#### BR-023: Transmission Time Validation
- **Rule**: Transmission time should be after episode air_date if both are provided
- **Implementation**: Application-level validation
- **Validation**: `transmissions.transmission_time > episodes.air_date`
- **Error Handling**: Warning if transmission before air date, but allow insertion

### 8. **Channel Management**

#### BR-024: Channel Name Uniqueness
- **Rule**: Channel names must be unique across the system
- **Implementation**: Database UNIQUE constraint on `channels.name`
- **Validation**: Application-level validation before insertion
- **Error Handling**: Return error if duplicate channel name

#### BR-025: Channel Type Validation
- **Rule**: Channel types must be valid (cable, satellite, streaming, broadcast, etc.)
- **Implementation**: Application-level validation
- **Validation**: Check against allowed channel types
- **Error Handling**: Return error if invalid channel type

### 9. **Multi-Channel Broadcasting**

#### BR-026: Transmission-Channel Assignment
- **Rule**: Every transmission must be assigned to at least one channel
- **Implementation**: Application-level validation
- **Validation**: At least one record in transmission_channels for each transmission
- **Error Handling**: Return error if transmission without channel assignment

#### BR-027: Unique Transmission-Channel Combinations
- **Rule**: No duplicate transmission-channel combinations allowed
- **Implementation**: Composite primary key on `transmission_channels(transmission_uuid, channel_uuid)`
- **Validation**: Database constraint prevents duplicates
- **Error Handling**: Return error if duplicate assignment

#### BR-028: Multi-Channel Broadcasting Support
- **Rule**: Transmissions can be broadcast on multiple channels simultaneously
- **Implementation**: No constraint (allows multiple channels per transmission)
- **Validation**: Application logic supports multiple channel assignments
- **Business Logic**: Enables simultaneous broadcasting across platforms

### 10. **Data Integrity and Soft Deletes**

#### BR-029: Soft Delete Implementation
- **Rule**: All tables support soft delete operations
- **Implementation**: `deleted` boolean field with default FALSE
- **Validation**: Application logic filters out deleted records
- **Business Logic**: Preserves data integrity while allowing logical deletion

#### BR-030: Timestamp Management
- **Rule**: All records must have created_time and updated_time timestamps
- **Implementation**: Database DEFAULT values and triggers
- **Validation**: Automatic timestamp management
- **Business Logic**: Provides audit trail for all data changes

## 🔧 Implementation Guidelines

### Database-Level Enforcement
- Use CHECK constraints for data validation
- Implement UNIQUE constraints for uniqueness rules
- Use FOREIGN KEY constraints for referential integrity
- Create triggers for complex business rule validation

### Application-Level Enforcement
- Implement validation logic in application code
- Provide clear error messages for rule violations
- Support transaction rollback on rule violations
- Log business rule violations for audit purposes

### Error Handling Strategy
- Return specific error codes for different rule violations
- Provide user-friendly error messages
- Support partial validation (warnings vs errors)
- Implement retry mechanisms where appropriate

## 📊 Monitoring and Compliance

### Rule Violation Tracking
- Log all business rule violations
- Monitor violation frequency and patterns
- Alert administrators for critical violations
- Generate compliance reports

### Data Quality Metrics
- Track data completeness and accuracy
- Monitor constraint violation rates
- Measure business rule compliance
- Generate data quality dashboards

---

*These business rules ensure the integrity, consistency, and proper operation of the TV Company Database for TV series production and broadcasting operations.*
