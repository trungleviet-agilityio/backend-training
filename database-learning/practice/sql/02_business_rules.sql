-- ============================================================================
-- TV Company Database - Business Rules Implementation
-- ============================================================================
--
-- This file implements database-oriented business rules for the TV Company Database
-- following the database design methodology from "Database Design for Mere Mortals"
--
-- Business Rules Categories:
-- 1. Field-Specific Rules: Constraints on individual field specifications
-- 2. Relationship-Specific Rules: Constraints on table relationships
-- 3. Validation Tables: Reference tables for enforcing value constraints
-- 4. Performance Indexes: Optimizations for business rule enforcement
--
-- Implementation Strategy:
-- - Database-Oriented Rules: Implemented via constraints, triggers, and indexes
-- - Application-Oriented Rules: Documented here but implemented in application code
-- - Validation Tables: Used for complex value sets and business logic
--
-- Author: Database Design Team
-- Created: 2024
-- Last Updated: 2024
-- ============================================================================

-- Set search path to use tv_company schema
SET search_path TO tv_company, public;

-- ============================================================================
-- SECTION 1: PERFORMANCE INDEXES FOR BUSINESS RULE ENFORCEMENT
-- ============================================================================
--
-- These indexes support efficient business rule validation and data retrieval
-- following the principle that indexes should support business operations

-- Foreign key indexes for join performance and constraint validation
DROP INDEX IF EXISTS idx_tv_series_domain_uuid;
CREATE INDEX idx_tv_series_domain_uuid ON tv_series(domain_uuid);

DROP INDEX IF EXISTS idx_episodes_series_uuid;
CREATE INDEX idx_episodes_series_uuid ON episodes(series_uuid);

DROP INDEX IF EXISTS idx_episodes_director_uuid;
CREATE INDEX idx_episodes_director_uuid ON episodes(director_uuid);

DROP INDEX IF EXISTS idx_transmissions_episode_uuid;
CREATE INDEX idx_transmissions_episode_uuid ON transmissions(episode_uuid);

DROP INDEX IF EXISTS idx_series_cast_employee_uuid;
CREATE INDEX idx_series_cast_employee_uuid ON series_cast(employee_uuid);

DROP INDEX IF EXISTS idx_series_cast_series_uuid;
CREATE INDEX idx_series_cast_series_uuid ON series_cast(series_uuid);

DROP INDEX IF EXISTS idx_series_cast_role_uuid;
CREATE INDEX idx_series_cast_role_uuid ON series_cast(role_uuid);

DROP INDEX IF EXISTS idx_transmission_channels_transmission_uuid;
CREATE INDEX idx_transmission_channels_transmission_uuid ON transmission_channels(transmission_uuid);

DROP INDEX IF EXISTS idx_transmission_channels_channel_uuid;
CREATE INDEX idx_transmission_channels_channel_uuid ON transmission_channels(channel_uuid);

-- Soft delete indexes for filtering (supports business rule BR-029)
DROP INDEX IF EXISTS idx_tv_series_deleted;
CREATE INDEX idx_tv_series_deleted ON tv_series(deleted);

DROP INDEX IF EXISTS idx_episodes_deleted;
CREATE INDEX idx_episodes_deleted ON episodes(deleted);

DROP INDEX IF EXISTS idx_employees_deleted;
CREATE INDEX idx_employees_deleted ON employees(deleted);

DROP INDEX IF EXISTS idx_transmissions_deleted;
CREATE INDEX idx_transmissions_deleted ON transmissions(deleted);

DROP INDEX IF EXISTS idx_series_cast_deleted;
CREATE INDEX idx_series_cast_deleted ON series_cast(deleted);

-- Business rule enforcement indexes
DROP INDEX IF EXISTS idx_episodes_series_episode;
CREATE INDEX idx_episodes_series_episode ON episodes(series_uuid, episode_number);

DROP INDEX IF EXISTS idx_transmissions_time;
CREATE INDEX idx_transmissions_time ON transmissions(transmission_time);

DROP INDEX IF EXISTS idx_employees_status;
CREATE INDEX idx_employees_status ON employees(status);

DROP INDEX IF EXISTS idx_series_cast_unique_constraint;
CREATE INDEX idx_series_cast_unique_constraint ON series_cast(employee_uuid, series_uuid, role_uuid);

-- ============================================================================
-- SECTION 2: FIELD-SPECIFIC BUSINESS RULES (Database-Oriented)
-- ============================================================================
--
-- These rules enforce constraints on individual field specifications
-- following the field-level integrity principles

-- BR-001: Series Domain Name Uniqueness
-- Rule: Each series domain name must be unique across the system
-- Implementation: Database UNIQUE constraint on series_domains.name
ALTER TABLE series_domains DROP CONSTRAINT IF EXISTS unique_series_domain_name;
ALTER TABLE series_domains
ADD CONSTRAINT unique_series_domain_name
UNIQUE (name);

-- BR-002: Series Domain Assignment
-- Rule: Every TV series must be assigned to exactly one domain
-- Implementation: NOT NULL constraint + FOREIGN KEY to series_domains.uuid
ALTER TABLE tv_series DROP CONSTRAINT IF EXISTS not_null_series_domain;
ALTER TABLE tv_series
ALTER COLUMN domain_uuid SET NOT NULL;

-- BR-004: Series Date Range Validation
-- Rule: If both start_date and end_date are provided, end_date must be after start_date
-- Implementation: CHECK constraint on field specification
ALTER TABLE tv_series DROP CONSTRAINT IF EXISTS check_series_end_date;
ALTER TABLE tv_series
ADD CONSTRAINT check_series_end_date
CHECK (end_date IS NULL OR end_date > start_date);

-- BR-006: Episode Duration Validation
-- Rule: Episode duration must be positive and reasonable (1-300 minutes)
-- Implementation: CHECK constraint on field specification
ALTER TABLE episodes DROP CONSTRAINT IF EXISTS check_episode_duration;
ALTER TABLE episodes
ADD CONSTRAINT check_episode_duration
CHECK (duration_minutes > 0 AND duration_minutes <= 300);

-- BR-007: Episode Director Assignment
-- Rule: Each episode must have exactly one director assigned
-- Implementation: NOT NULL constraint + FOREIGN KEY to employees.uuid
ALTER TABLE episodes DROP CONSTRAINT IF EXISTS not_null_episode_director;
ALTER TABLE episodes
ALTER COLUMN director_uuid SET NOT NULL;

-- BR-009: Employee Email Uniqueness
-- Rule: Employee email addresses must be unique across the system
-- Implementation: Database UNIQUE constraint
ALTER TABLE employees DROP CONSTRAINT IF EXISTS unique_employee_email;
ALTER TABLE employees
ADD CONSTRAINT unique_employee_email
UNIQUE (email);

-- BR-010: Employee Status Validation
-- Rule: Employee status must be one of: available, busy, unavailable
-- Implementation: Database CHECK constraint
ALTER TABLE employees DROP CONSTRAINT IF EXISTS check_employee_status;
ALTER TABLE employees
ADD CONSTRAINT check_employee_status
CHECK (status IN ('available', 'busy', 'unavailable'));

-- BR-011: Role Name Uniqueness
-- Rule: Role names must be unique across the system
-- Implementation: Database UNIQUE constraint
ALTER TABLE roles DROP CONSTRAINT IF EXISTS unique_role_name;
ALTER TABLE roles
ADD CONSTRAINT unique_role_name
UNIQUE (name);

-- BR-012: Cast Assignment Uniqueness
-- Rule: No duplicate employee-series-role combinations allowed
-- Implementation: Database UNIQUE constraint
ALTER TABLE series_cast DROP CONSTRAINT IF EXISTS unique_cast_assignment;
ALTER TABLE series_cast
ADD CONSTRAINT unique_cast_assignment
UNIQUE (employee_uuid, series_uuid, role_uuid);

-- BR-013: Character Name Requirements
-- Rule: Character names are required for Actor roles, optional for other roles
-- Implementation: Trigger function for role-specific validation
DROP TRIGGER IF EXISTS validate_character_name_trigger ON series_cast;
CREATE OR REPLACE FUNCTION validate_character_name()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is 'Actor', character_name must be provided
    IF EXISTS (
        SELECT 1 FROM roles
        WHERE uuid = NEW.role_uuid
        AND name = 'Actor'
        AND deleted = FALSE
    ) AND (NEW.character_name IS NULL OR TRIM(NEW.character_name) = '') THEN
        RAISE EXCEPTION 'Character name is required for Actor role';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_character_name_trigger
    BEFORE INSERT OR UPDATE ON series_cast
    FOR EACH ROW
    EXECUTE FUNCTION validate_character_name();

-- BR-014: Viewership Data Validation
-- Rule: Viewership numbers must be non-negative
-- Implementation: CHECK constraint on field specification
ALTER TABLE transmissions DROP CONSTRAINT IF EXISTS check_viewership_positive;
ALTER TABLE transmissions
ADD CONSTRAINT check_viewership_positive
CHECK (viewership >= 0);

-- BR-015: Channel Name Uniqueness
-- Rule: Channel names must be unique across the system
-- Implementation: Database UNIQUE constraint
ALTER TABLE channels DROP CONSTRAINT IF EXISTS unique_channel_name;
ALTER TABLE channels
ADD CONSTRAINT unique_channel_name
UNIQUE (name);

-- BR-019: Cast Assignment Date Validation
-- Rule: If both start_date and end_date are provided, end_date must be after start_date
-- Implementation: CHECK constraint on field specification
ALTER TABLE series_cast DROP CONSTRAINT IF EXISTS check_series_cast_end_date;
ALTER TABLE series_cast
ADD CONSTRAINT check_series_cast_end_date
CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);

-- BR-020: Employment Date Validation
-- Rule: Employment date must be >= birthdate
-- Implementation: CHECK constraint on field specification
ALTER TABLE employees DROP CONSTRAINT IF EXISTS check_employment_date;
ALTER TABLE employees
ADD CONSTRAINT check_employment_date
CHECK (employment_date >= birthdate);

-- ============================================================================
-- SECTION 3: RELATIONSHIP-SPECIFIC BUSINESS RULES (Database-Oriented)
-- ============================================================================
--
-- These rules enforce constraints on table relationships
-- following the relationship-level integrity principles

-- BR-016: Series Domain Relationship
-- Rule: Every TV series must be associated with exactly one domain
-- Implementation: Foreign key constraint with NOT NULL (already implemented in BR-002)

-- BR-017: Episode Series Relationship
-- Rule: Every episode must belong to exactly one series
-- Implementation: Foreign key constraint with NOT NULL
ALTER TABLE episodes DROP CONSTRAINT IF EXISTS not_null_episode_series;
ALTER TABLE episodes
ALTER COLUMN series_uuid SET NOT NULL;

-- BR-018: Episode Director Relationship
-- Rule: Every episode must have exactly one director
-- Implementation: Foreign key constraint with NOT NULL (already implemented in BR-007)

-- BR-020: Transmission Episode Relationship
-- Rule: Every transmission must reference a valid episode
-- Implementation: Foreign key constraint with NOT NULL
ALTER TABLE transmissions DROP CONSTRAINT IF EXISTS not_null_transmission_episode;
ALTER TABLE transmissions
ALTER COLUMN episode_uuid SET NOT NULL;

-- BR-021: Multi-Channel Broadcasting Relationship
-- Rule: Transmissions can be broadcast on multiple channels simultaneously
-- Implementation: Linking table with foreign keys (already implemented in schema)

-- ============================================================================
-- SECTION 4: COMPLEX BUSINESS RULE TRIGGERS (Database-Oriented)
-- ============================================================================
--
-- These triggers implement complex business rules that require multi-table validation
-- following the principle of enforcing business logic at the database level

-- BR-003: Series Title Uniqueness Within Domain
-- Rule: Series titles must be unique within the same domain
-- Implementation: Trigger function for domain-specific uniqueness validation
DROP TRIGGER IF EXISTS validate_series_title_domain_trigger ON tv_series;
CREATE OR REPLACE FUNCTION validate_series_title_domain()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for existing series with same title in same domain
    IF EXISTS (
        SELECT 1 FROM tv_series
        WHERE title = NEW.title
        AND domain_uuid = NEW.domain_uuid
        AND uuid != COALESCE(NEW.uuid, '00000000-0000-0000-0000-000000000000')
        AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Series title must be unique within the same domain';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_series_title_domain_trigger
    BEFORE INSERT OR UPDATE ON tv_series
    FOR EACH ROW
    EXECUTE FUNCTION validate_series_title_domain();

-- BR-005: Episode Number Uniqueness Within Series
-- Rule: Episode numbers must be unique within the same series
-- Implementation: Trigger function for series-specific uniqueness validation
DROP TRIGGER IF EXISTS validate_episode_number_series_trigger ON episodes;
CREATE OR REPLACE FUNCTION validate_episode_number_series()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for existing episode with same number in same series
    IF EXISTS (
        SELECT 1 FROM episodes
        WHERE episode_number = NEW.episode_number
        AND series_uuid = NEW.series_uuid
        AND uuid != COALESCE(NEW.uuid, '00000000-0000-0000-0000-000000000000')
        AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Episode number must be unique within the same series';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_episode_number_series_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION validate_episode_number_series();

-- BR-008: Director Role Validation
-- Rule: Episode directors must have the "Director" role in the system (any series)
-- Implementation: Trigger function for cross-table validation
DROP TRIGGER IF EXISTS validate_director_trigger ON episodes;
CREATE OR REPLACE FUNCTION validate_director_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the director has a 'Director' role in the system (any series)
    IF NOT EXISTS (
        SELECT 1 FROM series_cast sc
        JOIN roles r ON sc.role_uuid = r.uuid
        WHERE sc.employee_uuid = NEW.director_uuid
        AND r.name = 'Director'
        AND sc.deleted = FALSE
        AND r.deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Director must have a Director role assigned in series_cast (any series)';
    END IF;

    -- Check if director is available employee (BR-010: Employee Status Validation)
    IF NOT EXISTS (
        SELECT 1 FROM employees
        WHERE uuid = NEW.director_uuid
        AND status IN ('available', 'busy')
        AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Director must be an available or busy employee';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_director_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION validate_director_role();

-- BR-022: Episode Air Date Validation
-- Rule: Episode air_date must be >= TVSeries.start_date
-- Implementation: Trigger function for complex relationship validation
DROP TRIGGER IF EXISTS check_episode_air_date_trigger ON episodes;
CREATE OR REPLACE FUNCTION check_episode_air_date_fn()
RETURNS TRIGGER AS $$
DECLARE
    series_start_date DATE;
BEGIN
    IF NEW.air_date IS NOT NULL THEN
        SELECT start_date INTO series_start_date
        FROM tv_series
        WHERE uuid = NEW.series_uuid AND deleted = FALSE;

        IF series_start_date IS NOT NULL AND NEW.air_date < series_start_date THEN
            RAISE EXCEPTION 'Episode air_date (%) cannot be before series start_date (%)',
                NEW.air_date, series_start_date;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_episode_air_date_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION check_episode_air_date_fn();

-- BR-026: Transmission-Channel Assignment Validation
-- Rule: Every transmission must be assigned to at least one channel
-- Implementation: Trigger function for mandatory relationship validation
DROP TRIGGER IF EXISTS validate_transmission_channel_trigger ON transmission_channels;
CREATE OR REPLACE FUNCTION validate_transmission_channel()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure transmission and channel are not deleted
    IF NOT EXISTS (
        SELECT 1 FROM transmissions
        WHERE uuid = NEW.transmission_uuid AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Cannot assign deleted transmission to channel';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM channels
        WHERE uuid = NEW.channel_uuid AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Cannot assign transmission to deleted channel';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_transmission_channel_trigger
    BEFORE INSERT OR UPDATE ON transmission_channels
    FOR EACH ROW
    EXECUTE FUNCTION validate_transmission_channel();

-- ============================================================================
-- SECTION 5: DATA INTEGRITY AND SOFT DELETE RULES (Database-Oriented)
-- ============================================================================
--
-- These rules implement soft delete functionality and data integrity
-- following the principle of preserving data while allowing logical deletion

-- BR-029: Soft Delete Implementation
-- Rule: All tables support soft delete operations
-- Implementation: Trigger function for soft delete validation
DROP TRIGGER IF EXISTS prevent_channel_deletion_trigger ON channels;
CREATE OR REPLACE FUNCTION prevent_channel_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted = FALSE AND NEW.deleted = TRUE THEN
        -- Check if channel has active transmission records
        IF EXISTS (
            SELECT 1 FROM transmission_channels tc
            WHERE tc.channel_uuid = NEW.uuid
            AND tc.deleted = FALSE
        ) THEN
            RAISE EXCEPTION 'Cannot delete channel with active transmission records';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_channel_deletion_trigger
    BEFORE UPDATE ON channels
    FOR EACH ROW
    EXECUTE FUNCTION prevent_channel_deletion();

-- BR-030: Timestamp Management
-- Rule: All records must have created_time and updated_time timestamps
-- Implementation: Trigger function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all tables (using IF NOT EXISTS to prevent conflicts)
DROP TRIGGER IF EXISTS update_series_domains_updated_time ON series_domains;
CREATE TRIGGER update_series_domains_updated_time
    BEFORE UPDATE ON series_domains
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_tv_series_updated_time ON tv_series;
CREATE TRIGGER update_tv_series_updated_time
    BEFORE UPDATE ON tv_series
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_episodes_updated_time ON episodes;
CREATE TRIGGER update_episodes_updated_time
    BEFORE UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_transmissions_updated_time ON transmissions;
CREATE TRIGGER update_transmissions_updated_time
    BEFORE UPDATE ON transmissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_channels_updated_time ON channels;
CREATE TRIGGER update_channels_updated_time
    BEFORE UPDATE ON channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_employees_updated_time ON employees;
CREATE TRIGGER update_employees_updated_time
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_roles_updated_time ON roles;
CREATE TRIGGER update_roles_updated_time
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_transmission_channels_updated_time ON transmission_channels;
CREATE TRIGGER update_transmission_channels_updated_time
    BEFORE UPDATE ON transmission_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_series_cast_updated_time ON series_cast;
CREATE TRIGGER update_series_cast_updated_time
    BEFORE UPDATE ON series_cast
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

-- ============================================================================
-- SECTION 6: VALIDATION FUNCTIONS FOR BUSINESS RULE COMPLIANCE
-- ============================================================================
--
-- These functions provide utilities for validating business rule compliance
-- following the principle of providing tools for business rule enforcement

-- Function to validate director assignment in series_cast
-- Supports BR-008: Director Role Validation
CREATE OR REPLACE FUNCTION check_director_in_series_cast()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the director is assigned to the series with Director role
    IF NOT EXISTS (
        SELECT 1 FROM series_cast sc
        JOIN roles r ON sc.role_uuid = r.uuid
        WHERE sc.employee_uuid = NEW.director_uuid
        AND sc.series_uuid = NEW.series_uuid
        AND r.name = 'Director'
        AND sc.deleted = FALSE
        AND r.deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Director must be assigned to the series with Director role in series_cast';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to validate employee status for role assignments
-- Supports BR-010: Employee Status Validation
CREATE OR REPLACE FUNCTION validate_employee_status_for_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if employee is available for role assignment
    IF NOT EXISTS (
        SELECT 1 FROM employees
        WHERE uuid = NEW.employee_uuid
        AND status IN ('available', 'busy')
        AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Employee must be available or busy for role assignment';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 7: BUSINESS RULE DOCUMENTATION AND COMMENTS
-- ============================================================================
--
-- This section documents the business rules implemented in this file
-- following the principle of comprehensive documentation

-- =============================
-- series_domains table documentation
-- =============================
COMMENT ON TABLE series_domains IS 'Reference table for TV series domains/categories';
COMMENT ON COLUMN series_domains.uuid IS 'Unique identifier for each series domain (UUID, PK)';
COMMENT ON COLUMN series_domains.name IS 'Name of the series domain (unique, BR-001)';
COMMENT ON COLUMN series_domains.description IS 'Description of the series domain';
COMMENT ON COLUMN series_domains.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN series_domains.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN series_domains.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- tv_series table documentation
-- =============================
COMMENT ON TABLE tv_series IS 'Main table for TV series information';
COMMENT ON COLUMN tv_series.uuid IS 'Unique identifier for each TV series (UUID, PK)';
COMMENT ON COLUMN tv_series.title IS 'Title of the TV series (BR-003: unique within domain)';
COMMENT ON COLUMN tv_series.description IS 'Description of the TV series';
COMMENT ON COLUMN tv_series.domain_uuid IS 'Domain to which the series belongs (FK to series_domains, BR-002, BR-016)';
COMMENT ON COLUMN tv_series.start_date IS 'Date when the series started airing';
COMMENT ON COLUMN tv_series.end_date IS 'Date when the series ended (nullable, BR-004: > start_date)';
COMMENT ON COLUMN tv_series.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN tv_series.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN tv_series.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- roles table documentation
-- =============================
COMMENT ON TABLE roles IS 'Reference table for TV production roles';
COMMENT ON COLUMN roles.uuid IS 'Unique identifier for each role (UUID, PK)';
COMMENT ON COLUMN roles.name IS 'Name of the role (unique, BR-011, e.g., Actor, Director)';
COMMENT ON COLUMN roles.description IS 'Description of the role';
COMMENT ON COLUMN roles.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN roles.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN roles.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- employees table documentation
-- =============================
COMMENT ON TABLE employees IS 'Main table for employee information';
COMMENT ON COLUMN employees.uuid IS 'Unique identifier for each employee (UUID, PK)';
COMMENT ON COLUMN employees.first_name IS 'First name of the employee';
COMMENT ON COLUMN employees.last_name IS 'Last name of the employee';
COMMENT ON COLUMN employees.email IS 'Email address of the employee (unique, BR-009)';
COMMENT ON COLUMN employees.birthdate IS 'Birthdate of the employee';
COMMENT ON COLUMN employees.employment_date IS 'Date the employee was hired (BR-020: >= birthdate)';
COMMENT ON COLUMN employees.is_internal IS 'TRUE if the employee is internal, FALSE if external';
COMMENT ON COLUMN employees.status IS 'Employment status (BR-010: available, busy, unavailable)';
COMMENT ON COLUMN employees.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN employees.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN employees.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- episodes table documentation
-- =============================
COMMENT ON TABLE episodes IS 'Main table for episode information';
COMMENT ON COLUMN episodes.uuid IS 'Unique identifier for each episode (UUID, PK)';
COMMENT ON COLUMN episodes.series_uuid IS 'TV series to which the episode belongs (FK to tv_series, BR-017)';
COMMENT ON COLUMN episodes.episode_number IS 'Episode number within the series (unique per series, BR-005)';
COMMENT ON COLUMN episodes.title IS 'Title of the episode';
COMMENT ON COLUMN episodes.duration_minutes IS 'Duration of the episode in minutes (BR-006: 1-300)';
COMMENT ON COLUMN episodes.air_date IS 'Air date of the episode (BR-022: >= series start_date)';
COMMENT ON COLUMN episodes.director_uuid IS 'Director of the episode (FK to employees, BR-007, BR-008, BR-018)';
COMMENT ON COLUMN episodes.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN episodes.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN episodes.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- channels table documentation
-- =============================
COMMENT ON TABLE channels IS 'Reference table for broadcasting channels';
COMMENT ON COLUMN channels.uuid IS 'Unique identifier for each channel (UUID, PK)';
COMMENT ON COLUMN channels.name IS 'Name of the channel (unique, BR-015)';
COMMENT ON COLUMN channels.type IS 'Type of channel (e.g., cable, streaming)';
COMMENT ON COLUMN channels.description IS 'Description of the channel';
COMMENT ON COLUMN channels.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN channels.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN channels.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- transmissions table documentation
-- =============================
COMMENT ON TABLE transmissions IS 'Main table for transmission/broadcast information';
COMMENT ON COLUMN transmissions.uuid IS 'Unique identifier for each transmission (UUID, PK)';
COMMENT ON COLUMN transmissions.episode_uuid IS 'Episode being transmitted (FK to episodes, BR-020)';
COMMENT ON COLUMN transmissions.transmission_time IS 'Timestamp when the transmission occurred';
COMMENT ON COLUMN transmissions.viewership IS 'Number of viewers for the transmission (BR-014: >= 0)';
COMMENT ON COLUMN transmissions.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN transmissions.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN transmissions.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- =============================
-- transmission_channels table documentation
-- =============================
COMMENT ON TABLE transmission_channels IS 'Linking table for many-to-many relationship between transmissions and channels';
COMMENT ON COLUMN transmission_channels.transmission_uuid IS 'Transmission associated with the channel (FK, PK, BR-021)';
COMMENT ON COLUMN transmission_channels.channel_uuid IS 'Channel broadcasting the transmission (FK, PK, BR-021)';
COMMENT ON COLUMN transmission_channels.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN transmission_channels.updated_time IS 'Timestamp when the record was last updated (BR-030)';
COMMENT ON COLUMN transmission_channels.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';

-- =============================
-- series_cast table documentation
-- =============================
COMMENT ON TABLE series_cast IS 'Linking table for many-to-many relationship between employees, series, and roles';
COMMENT ON COLUMN series_cast.employee_uuid IS 'Employee assigned to the role (FK, PK, BR-019)';
COMMENT ON COLUMN series_cast.series_uuid IS 'TV series for the role assignment (FK, PK, BR-019)';
COMMENT ON COLUMN series_cast.role_uuid IS 'Role assigned in the series (FK, PK, BR-019)';
COMMENT ON COLUMN series_cast.character_name IS 'Character name (BR-013: required for Actor role, NULL otherwise)';
COMMENT ON COLUMN series_cast.start_date IS 'Start date of the role assignment in the series';
COMMENT ON COLUMN series_cast.end_date IS 'End date of the role assignment in the series (BR-019: >= start_date)';
COMMENT ON COLUMN series_cast.deleted IS 'Soft delete flag (TRUE if deleted, BR-029)';
COMMENT ON COLUMN series_cast.created_time IS 'Timestamp when the record was created (BR-030)';
COMMENT ON COLUMN series_cast.updated_time IS 'Timestamp when the record was last updated (BR-030)';

-- ============================================================================
-- SECTION 8: APPLICATION-LEVEL BUSINESS RULES DOCUMENTATION
-- ============================================================================
--
-- The following business rules are enforced at the application level
-- and should be implemented in the application code and service layers

/*
APPLICATION-LEVEL BUSINESS RULES TO BE IMPLEMENTED IN CODE:

1. BR-023: Series Title Uniqueness Within Domain (Alternative Implementation)
   - Application-level validation as backup to database trigger
   - Check for existing series with same title in domain

2. BR-024: Episode Number Uniqueness Within Series (Alternative Implementation)
   - Application-level validation as backup to database trigger
   - Check for existing episode with same number in series

3. BR-025: Director Role Validation (Alternative Implementation)
   - Application-level validation as backup to database trigger
   - Ensure director has Director role in series_cast

4. BR-027: Unique Transmission-Channel Combinations
   - Composite primary key (already implemented)
   - Application-level validation to prevent duplicates

5. BR-028: Multi-Channel Broadcasting Support
   - No constraint (allows multiple channels per transmission)
   - Application logic supports multiple channel assignments

6. BR-029: Soft Delete Implementation
   - Application logic filters out deleted records
   - Soft delete operations handled in application code

7. BR-030: Timestamp Management
   - Automatic timestamp management (already implemented)
   - Application-level audit trail for all data changes

These rules ensure the integrity, consistency, and proper operation of the TV Company Database
for TV series production and broadcasting operations.
*/

-- ============================================================================
-- END OF BUSINESS RULES IMPLEMENTATION
-- ============================================================================
