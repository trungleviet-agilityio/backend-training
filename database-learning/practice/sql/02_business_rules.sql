-- TV Company Database - Schema Logic (Database-Enforced Business Rules)
-- This file contains ONLY database-level constraints, triggers, and indexes
-- Application-level business rules are handled in application code

-- ============================================================================
-- PERFORMANCE INDEXES (Schema Logic)
-- ============================================================================

-- Foreign key indexes for join performance
DROP INDEX IF EXISTS idx_tv_series_domain_uuid;
CREATE INDEX idx_tv_series_domain_uuid ON tv_series(domain_uuid);
DROP INDEX IF EXISTS idx_episodes_series_uuid;
CREATE INDEX idx_episodes_series_uuid ON episodes(series_uuid);
DROP INDEX IF EXISTS idx_episodes_director_uuid;
CREATE INDEX idx_episodes_director_uuid ON episodes(director_uuid);
DROP INDEX IF EXISTS idx_transmissions_episode_uuid;
CREATE INDEX idx_transmissions_episode_uuid ON transmissions(episode_uuid);
DROP INDEX IF EXISTS idx_roles_department_uuid;
CREATE INDEX idx_roles_department_uuid ON roles(department_uuid);
DROP INDEX IF EXISTS idx_employee_roles_employee_uuid;
CREATE INDEX idx_employee_roles_employee_uuid ON employee_roles(employee_uuid);
DROP INDEX IF EXISTS idx_employee_roles_role_uuid;
CREATE INDEX idx_employee_roles_role_uuid ON employee_roles(role_uuid);
DROP INDEX IF EXISTS idx_employee_series_roles_employee_uuid;
CREATE INDEX idx_employee_series_roles_employee_uuid ON employee_series_roles(employee_uuid);
DROP INDEX IF EXISTS idx_employee_series_roles_series_uuid;
CREATE INDEX idx_employee_series_roles_series_uuid ON employee_series_roles(series_uuid);
DROP INDEX IF EXISTS idx_employee_series_roles_role_uuid;
CREATE INDEX idx_employee_series_roles_role_uuid ON employee_series_roles(role_uuid);
DROP INDEX IF EXISTS idx_transmission_channels_transmission_uuid;
CREATE INDEX idx_transmission_channels_transmission_uuid ON transmission_channels(transmission_uuid);
DROP INDEX IF EXISTS idx_transmission_channels_channel_uuid;
CREATE INDEX idx_transmission_channels_channel_uuid ON transmission_channels(channel_uuid);

-- Soft delete indexes for filtering (application logic will use these)
DROP INDEX IF EXISTS idx_tv_series_deleted;
CREATE INDEX idx_tv_series_deleted ON tv_series(deleted);
DROP INDEX IF EXISTS idx_episodes_deleted;
CREATE INDEX idx_episodes_deleted ON episodes(deleted);
DROP INDEX IF EXISTS idx_employees_deleted;
CREATE INDEX idx_employees_deleted ON employees(deleted);
DROP INDEX IF EXISTS idx_transmissions_deleted;
CREATE INDEX idx_transmissions_deleted ON transmissions(deleted);

-- Common query pattern indexes
DROP INDEX IF EXISTS idx_episodes_series_episode;
CREATE INDEX idx_episodes_series_episode ON episodes(series_uuid, episode_number);
DROP INDEX IF EXISTS idx_transmissions_time;
CREATE INDEX idx_transmissions_time ON transmissions(transmission_time);
DROP INDEX IF EXISTS idx_employees_status;
CREATE INDEX idx_employees_status ON employees(status);
DROP INDEX IF EXISTS idx_employee_roles_active;
CREATE INDEX idx_employee_roles_active ON employee_roles(is_active);

-- ============================================================================
-- FIELD-LEVEL CONSTRAINTS (Schema Logic)
-- ============================================================================

-- 1. Episode air_date must be >= TVSeries.start_date
-- Enforced by trigger (cannot use subquery in CHECK constraint)
DROP TRIGGER IF EXISTS check_episode_air_date_trigger ON episodes;
DROP FUNCTION IF EXISTS check_episode_air_date_fn();
CREATE OR REPLACE FUNCTION check_episode_air_date_fn()
RETURNS TRIGGER AS $$
DECLARE
    series_start_date DATE;
BEGIN
    IF NEW.air_date IS NOT NULL THEN
        SELECT start_date INTO series_start_date FROM tv_series WHERE uuid = NEW.series_uuid;
        IF series_start_date IS NOT NULL AND NEW.air_date < series_start_date THEN
            RAISE EXCEPTION 'Episode air_date (%) cannot be before series start_date (%)', NEW.air_date, series_start_date;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER check_episode_air_date_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION check_episode_air_date_fn();

-- 2. TVSeries end_date must be >= start_date
ALTER TABLE tv_series DROP CONSTRAINT IF EXISTS check_series_end_date;
ALTER TABLE tv_series
ADD CONSTRAINT check_series_end_date
CHECK (end_date IS NULL OR end_date >= start_date);

-- 3. Employee employment_date must be >= birthdate
ALTER TABLE employees DROP CONSTRAINT IF EXISTS check_employment_date;
ALTER TABLE employees
ADD CONSTRAINT check_employment_date
CHECK (employment_date >= birthdate);

-- 4. EmployeeSeriesRole end_date must be >= start_date (if both are present)
ALTER TABLE employee_series_roles DROP CONSTRAINT IF EXISTS check_employee_series_end_date;
ALTER TABLE employee_series_roles
ADD CONSTRAINT check_employee_series_end_date
CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);

-- ============================================================================
-- BUSINESS RULE TRIGGERS (Schema Logic)
-- ============================================================================

-- Director validation trigger
DROP TRIGGER IF EXISTS validate_director_trigger ON episodes;
DROP FUNCTION IF EXISTS validate_director_role();
CREATE OR REPLACE FUNCTION validate_director_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the director has an active 'Director' role
    IF NOT EXISTS (
        SELECT 1 FROM employee_roles er
        JOIN roles r ON er.role_uuid = r.uuid
        WHERE er.employee_uuid = NEW.director_uuid
        AND r.name = 'Director'
        AND er.is_active = TRUE
        AND er.deleted = FALSE
        AND r.deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Director must have an active Director role';
    END IF;

    -- Check if director is active employee
    IF NOT EXISTS (
        SELECT 1 FROM employees
        WHERE uuid = NEW.director_uuid
        AND status = 'active'
        AND deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Director must be an active employee';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER validate_director_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION validate_director_role();

-- Character name validation trigger
DROP TRIGGER IF EXISTS validate_character_name_trigger ON employee_series_roles;
DROP FUNCTION IF EXISTS validate_character_name();
CREATE OR REPLACE FUNCTION validate_character_name()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is 'Actor', character_name must be provided
    IF EXISTS (
        SELECT 1 FROM roles
        WHERE uuid = NEW.role_uuid
        AND name = 'Actor'
        AND deleted = FALSE
    ) AND (NEW.character_name IS NULL OR NEW.character_name = '') THEN
        RAISE EXCEPTION 'Character name is required for Actor role';
    END IF;

    -- If role is not 'Actor', character_name must be NULL
    IF NOT EXISTS (
        SELECT 1 FROM roles
        WHERE uuid = NEW.role_uuid
        AND name = 'Actor'
        AND deleted = FALSE
    ) AND NEW.character_name IS NOT NULL THEN
        RAISE EXCEPTION 'Character name should be NULL for non-Actor roles';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER validate_character_name_trigger
    BEFORE INSERT OR UPDATE ON employee_series_roles
    FOR EACH ROW
    EXECUTE FUNCTION validate_character_name();

-- Channel deletion prevention trigger
DROP TRIGGER IF EXISTS prevent_channel_deletion_trigger ON channels;
DROP FUNCTION IF EXISTS prevent_channel_deletion();
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

-- ============================================================================
-- AUDIT FIELD TRIGGERS (Schema Logic)
-- ============================================================================

-- Automatic updated_time function
DROP FUNCTION IF EXISTS update_updated_time();
CREATE OR REPLACE FUNCTION update_updated_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Schema Logic: Database automatically updates audit fields on all table modifications
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

DROP TRIGGER IF EXISTS update_departments_updated_time ON departments;
CREATE TRIGGER update_departments_updated_time
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_transmission_channels_updated_time ON transmission_channels;
CREATE TRIGGER update_transmission_channels_updated_time
    BEFORE UPDATE ON transmission_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_employee_roles_updated_time ON employee_roles;
CREATE TRIGGER update_employee_roles_updated_time
    BEFORE UPDATE ON employee_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

DROP TRIGGER IF EXISTS update_employee_series_roles_updated_time ON employee_series_roles;
CREATE TRIGGER update_employee_series_roles_updated_time
    BEFORE UPDATE ON employee_series_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

-- ============================================================================
-- NOTES ON APPLICATION LOGIC (NOT ENFORCED HERE)
-- ============================================================================

/*
APPLICATION LOGIC RULES (enforced in application code, NOT in this file):

1. Soft Delete Referential Integrity:
   - Application queries must filter deleted = FALSE
   - No reference to deleted records across tables

2. Business Workflow Rules:
   - Only active employees can be assigned to new episodes/series
   - First episode of each series must have episode_number = 1
   - A TV series must have at least one episode

3. Complex Validation:
   - Email format validation
   - Channel name uniqueness across active channels
   - Employee must have at least one active role

4. Reporting and Analytics:
   - All queries must filter deleted records unless explicitly required
   - Complex aggregations and business metrics

These rules are implemented in application code, service layers, and business logic.
*/

-- =============================
-- series_domains table
-- =============================
COMMENT ON COLUMN series_domains.uuid IS 'Unique identifier for each series domain (UUID, PK)';
COMMENT ON COLUMN series_domains.name IS 'Name of the series domain (unique)';
COMMENT ON COLUMN series_domains.description IS 'Description of the series domain';
COMMENT ON COLUMN series_domains.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN series_domains.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN series_domains.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- departments table
-- =============================
COMMENT ON COLUMN departments.uuid IS 'Unique identifier for each department (UUID, PK)';
COMMENT ON COLUMN departments.name IS 'Name of the department (unique)';
COMMENT ON COLUMN departments.description IS 'Description of the department';
COMMENT ON COLUMN departments.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN departments.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN departments.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- tv_series table
-- =============================
COMMENT ON COLUMN tv_series.uuid IS 'Unique identifier for each TV series (UUID, PK)';
COMMENT ON COLUMN tv_series.title IS 'Title of the TV series';
COMMENT ON COLUMN tv_series.description IS 'Description of the TV series';
COMMENT ON COLUMN tv_series.domain_uuid IS 'Domain to which the series belongs (FK to series_domains)';
COMMENT ON COLUMN tv_series.start_date IS 'Date when the series started airing';
COMMENT ON COLUMN tv_series.end_date IS 'Date when the series ended (nullable)';
COMMENT ON COLUMN tv_series.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN tv_series.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN tv_series.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- roles table
-- =============================
COMMENT ON COLUMN roles.uuid IS 'Unique identifier for each role (UUID, PK)';
COMMENT ON COLUMN roles.name IS 'Name of the role (unique, e.g., Actor, Director)';
COMMENT ON COLUMN roles.department_uuid IS 'Department to which the role belongs (FK to departments)';
COMMENT ON COLUMN roles.description IS 'Description of the role';
COMMENT ON COLUMN roles.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN roles.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN roles.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- employees table
-- =============================
COMMENT ON COLUMN employees.uuid IS 'Unique identifier for each employee (UUID, PK)';
COMMENT ON COLUMN employees.first_name IS 'First name of the employee';
COMMENT ON COLUMN employees.last_name IS 'Last name of the employee';
COMMENT ON COLUMN employees.email IS 'Email address of the employee (unique)';
COMMENT ON COLUMN employees.birthdate IS 'Birthdate of the employee';
COMMENT ON COLUMN employees.employment_date IS 'Date the employee was hired';
COMMENT ON COLUMN employees.is_internal IS 'TRUE if the employee is internal, FALSE if external';
COMMENT ON COLUMN employees.status IS 'Employment status (active, on_leave, terminated)';
COMMENT ON COLUMN employees.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN employees.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN employees.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- episodes table
-- =============================
COMMENT ON COLUMN episodes.uuid IS 'Unique identifier for each episode (UUID, PK)';
COMMENT ON COLUMN episodes.series_uuid IS 'TV series to which the episode belongs (FK to tv_series)';
COMMENT ON COLUMN episodes.episode_number IS 'Episode number within the series (unique per series)';
COMMENT ON COLUMN episodes.title IS 'Title of the episode';
COMMENT ON COLUMN episodes.duration_minutes IS 'Duration of the episode in minutes (1-600)';
COMMENT ON COLUMN episodes.air_date IS 'Air date of the episode';
COMMENT ON COLUMN episodes.director_uuid IS 'Director of the episode (FK to employees)';
COMMENT ON COLUMN episodes.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN episodes.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN episodes.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- channels table
-- =============================
COMMENT ON COLUMN channels.uuid IS 'Unique identifier for each channel (UUID, PK)';
COMMENT ON COLUMN channels.name IS 'Name of the channel (unique)';
COMMENT ON COLUMN channels.type IS 'Type of channel (e.g., cable, streaming)';
COMMENT ON COLUMN channels.description IS 'Description of the channel';
COMMENT ON COLUMN channels.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN channels.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN channels.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- transmissions table
-- =============================
COMMENT ON COLUMN transmissions.uuid IS 'Unique identifier for each transmission (UUID, PK)';
COMMENT ON COLUMN transmissions.episode_uuid IS 'Episode being transmitted (FK to episodes)';
COMMENT ON COLUMN transmissions.transmission_time IS 'Timestamp when the transmission occurred';
COMMENT ON COLUMN transmissions.viewership IS 'Number of viewers for the transmission';
COMMENT ON COLUMN transmissions.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN transmissions.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN transmissions.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- transmission_channels table
-- =============================
COMMENT ON COLUMN transmission_channels.transmission_uuid IS 'Transmission associated with the channel (FK, PK)';
COMMENT ON COLUMN transmission_channels.channel_uuid IS 'Channel broadcasting the transmission (FK, PK)';
COMMENT ON COLUMN transmission_channels.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN transmission_channels.updated_time IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN transmission_channels.deleted IS 'Soft delete flag (TRUE if deleted)';

-- =============================
-- employee_roles table
-- =============================
COMMENT ON COLUMN employee_roles.employee_uuid IS 'Employee assigned to the role (FK, PK)';
COMMENT ON COLUMN employee_roles.role_uuid IS 'Role assigned to the employee (FK, PK)';
COMMENT ON COLUMN employee_roles.assigned_at IS 'Date when the role was assigned';
COMMENT ON COLUMN employee_roles.is_active IS 'TRUE if the role assignment is active';
COMMENT ON COLUMN employee_roles.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN employee_roles.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN employee_roles.updated_time IS 'Timestamp when the record was last updated';

-- =============================
-- employee_series_roles table
-- =============================
COMMENT ON COLUMN employee_series_roles.employee_uuid IS 'Employee assigned to the series and role (FK, PK)';
COMMENT ON COLUMN employee_series_roles.series_uuid IS 'TV series for the role assignment (FK, PK)';
COMMENT ON COLUMN employee_series_roles.role_uuid IS 'Role assigned in the series (FK, PK)';
COMMENT ON COLUMN employee_series_roles.character_name IS 'Character name (required for Actor role, NULL otherwise)';
COMMENT ON COLUMN employee_series_roles.start_date IS 'Start date of the role assignment in the series';
COMMENT ON COLUMN employee_series_roles.end_date IS 'End date of the role assignment in the series';
COMMENT ON COLUMN employee_series_roles.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN employee_series_roles.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN employee_series_roles.updated_time IS 'Timestamp when the record was last updated';
