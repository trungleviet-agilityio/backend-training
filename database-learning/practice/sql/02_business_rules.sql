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

-- Soft delete indexes for filtering (application logic will use these)
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

-- Common query pattern indexes
DROP INDEX IF EXISTS idx_episodes_series_episode;
CREATE INDEX idx_episodes_series_episode ON episodes(series_uuid, episode_number);
DROP INDEX IF EXISTS idx_transmissions_time;
CREATE INDEX idx_transmissions_time ON transmissions(transmission_time);
DROP INDEX IF EXISTS idx_employees_status;
CREATE INDEX idx_employees_status ON employees(status);
DROP INDEX IF EXISTS idx_series_cast_unique_constraint;
CREATE INDEX idx_series_cast_unique_constraint ON series_cast(employee_uuid, series_uuid, role_uuid);

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

-- 4. SeriesCast end_date must be >= start_date (if both are present)
ALTER TABLE series_cast DROP CONSTRAINT IF EXISTS check_series_cast_end_date;
ALTER TABLE series_cast
ADD CONSTRAINT check_series_cast_end_date
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
    -- Check if the director has a 'Director' role in series_cast
    IF NOT EXISTS (
        SELECT 1 FROM series_cast sc
        JOIN roles r ON sc.role_uuid = r.uuid
        WHERE sc.employee_uuid = NEW.director_uuid
        AND r.name = 'Director'
        AND sc.deleted = FALSE
        AND r.deleted = FALSE
    ) THEN
        RAISE EXCEPTION 'Director must have a Director role assigned in series_cast';
    END IF;

    -- Check if director is available employee
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

-- Character name validation trigger
DROP TRIGGER IF EXISTS validate_character_name_trigger ON series_cast;
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

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER validate_character_name_trigger
    BEFORE INSERT OR UPDATE ON series_cast
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
-- AUTOMATIC TIMESTAMP UPDATES (Schema Logic)
-- ============================================================================

-- Function to automatically update updated_time
DROP FUNCTION IF EXISTS update_updated_time();
CREATE OR REPLACE FUNCTION update_updated_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all tables
CREATE TRIGGER update_series_domains_updated_time
    BEFORE UPDATE ON series_domains
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_tv_series_updated_time
    BEFORE UPDATE ON tv_series
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_episodes_updated_time
    BEFORE UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_transmissions_updated_time
    BEFORE UPDATE ON transmissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_channels_updated_time
    BEFORE UPDATE ON channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_employees_updated_time
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_roles_updated_time
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_transmission_channels_updated_time
    BEFORE UPDATE ON transmission_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

CREATE TRIGGER update_series_cast_updated_time
    BEFORE UPDATE ON series_cast
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_time();

-- ============================================================================
-- ADDITIONAL BUSINESS RULES (Schema Logic)
-- ============================================================================

-- 1. Episode number uniqueness within series (already enforced by UNIQUE constraint)
-- 2. Employee email uniqueness (already enforced by UNIQUE constraint)
-- 3. Series title uniqueness within domain (application-level enforcement)
-- 4. Channel name uniqueness (already enforced by UNIQUE constraint)
-- 5. Role name uniqueness (already enforced by UNIQUE constraint)

-- ============================================================================
-- AUDIT AND VALIDATION FUNCTIONS (Schema Logic)
-- ============================================================================

-- Function to validate director assignment in series_cast
DROP FUNCTION IF EXISTS check_director_in_series_cast();
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

CREATE TRIGGER trg_check_director_in_series_cast
BEFORE INSERT OR UPDATE ON episodes
FOR EACH ROW EXECUTE FUNCTION check_director_in_series_cast();

-- ============================================================================
-- NOTES ON APPLICATION-LEVEL BUSINESS RULES
-- ============================================================================

/*
The following business rules are enforced at the application level:

1. Series title uniqueness within domain
2. Complex validation workflows
3. Soft delete operations
4. User access control
5. Business process validation
6. Cross-table validation that cannot be expressed as triggers
7. External system integration validation

These rules are implemented in the application code and service layers.
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
COMMENT ON COLUMN employees.status IS 'Employment status (available, busy, unavailable)';
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
-- series_cast table
-- =============================
COMMENT ON COLUMN series_cast.employee_uuid IS 'Employee assigned to the role (FK, PK)';
COMMENT ON COLUMN series_cast.series_uuid IS 'TV series for the role assignment (FK, PK)';
COMMENT ON COLUMN series_cast.role_uuid IS 'Role assigned in the series (FK, PK)';
COMMENT ON COLUMN series_cast.character_name IS 'Character name (required for Actor role, NULL otherwise)';
COMMENT ON COLUMN series_cast.start_date IS 'Start date of the role assignment in the series';
COMMENT ON COLUMN series_cast.end_date IS 'End date of the role assignment in the series';
COMMENT ON COLUMN series_cast.deleted IS 'Soft delete flag (TRUE if deleted)';
COMMENT ON COLUMN series_cast.created_time IS 'Timestamp when the record was created';
COMMENT ON COLUMN series_cast.updated_time IS 'Timestamp when the record was last updated';
