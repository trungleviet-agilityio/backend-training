# 📜 Business Rules for TV Company Database

---

## 1. Introduction
This document defines all business rules for the TV company database system, organized by table and field. Rules are based on project requirements and best practices from database design literature (see chapters 9, 10, 11, and 13). Rules are categorized as database-oriented (enforced by schema/constraints) or application-oriented (enforced by application logic).

---

## 2. Business Rules by Table

### 2.1. SeriesDomain
- **id**: Must be unique, not null (PK, UUID)
- **name**: Must be unique, not null, max 100 characters
- **description**: Optional, max 500 characters
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - No TVSeries may reference a deleted SeriesDomain (application logic)

### 2.2. TVSeries
- **id**: Must be unique, not null (PK, UUID)
- **title**: Not null (not unique; duplicate titles allowed for remakes, reboots)
- **description**: Optional
- **domain_id**: Must reference existing, non-deleted SeriesDomain (FK, not null)
- **start_date**: Not null; should not be in the future (recommend only past or present dates)
- **end_date**: Nullable, if present must be >= start_date
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each TVSeries must belong to a SeriesDomain
  - Each TVSeries may have multiple Episodes
  - No Episode may reference a deleted TVSeries (application logic)
  - **Business Rule:** A TV series must have at least one episode (enforced by application/reporting logic)
  - **Business Rule:** Multiple series may have the same title (e.g., remakes, reboots); use id for uniqueness

### 2.3. Episode
- **id**: Must be unique, not null (PK, UUID)
- **series_id**: Must reference existing, non-deleted TVSeries (FK, not null)
- **episode_number**: Must be positive integer, unique within series (composite unique)
- **title**: Optional (not unique; duplicate titles allowed)
- **duration_minutes**: Must be between 1 and 600
- **air_date**: Optional, if present must be >= TVSeries.start_date (enforced by application logic or trigger)
- **director_id**: Must reference Employee with 'Director' role, not null; must be validated by application logic or trigger before insert/update. The director must be active (is_internal = TRUE, deleted = FALSE, is_active = TRUE in EmployeeRole).
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each Episode must belong to a TVSeries
  - Each Episode must have a Director (Employee with 'Director' role)
  - Each Episode may have multiple Transmissions
  - No Transmission may reference a deleted Episode (application logic)
  - **Business Rule:** The first episode of each series must have episode_number = 1
  - **Business Rule:** An episode can only be directed by one director at a time
  - **Business Rule:** Use (series_id, episode_number) as unique identifier for episodes within a series

### 2.4. Transmission
- **id**: Must be unique, not null (PK, UUID)
- **episode_id**: Must reference existing, non-deleted Episode (FK, not null)
- **transmission_time**: Not null, TIMESTAMPTZ (with timezone support for global broadcasts)
- **viewership**: Optional, BIGINT, if present must be >= 0 (supports global scale)
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each Transmission must belong to an Episode
  - Each Transmission may be broadcast on multiple Channels (via TransmissionChannel)
  - No TransmissionChannel may reference a deleted Transmission (application logic)
  - **Business Rule:** An episode can be transmitted multiple times, but each transmission_time must be unique for the same episode (no duplicate airings at the same time)
  - **Business Rule:** A transmission can be broadcast simultaneously on multiple channels/platforms (e.g., global sports events, multi-platform releases)

### 2.5. Channel
- **id**: Must be unique, not null (PK, UUID)
- **name**: Must be unique, not null, max 100 characters
- **type**: Optional (e.g., Cable, OTT, Web, Streaming)
- **description**: Optional
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each Channel may be used for multiple Transmissions (via TransmissionChannel)
  - No TransmissionChannel may reference a deleted Channel (application logic)
  - **Business Rule:** Channel names must be unique across all active channels
  - **Business Rule:** A channel cannot be deleted if it has active transmission records

### 2.6. TransmissionChannel
- **transmission_id, channel_id**: Composite PK, both must reference existing, non-deleted Transmission and Channel
- **created_time, updated_time**: Set automatically
- **deleted**: Boolean, default FALSE (soft delete)
- **Relationships**:
  - Each TransmissionChannel links one Transmission and one Channel
  - No TransmissionChannel may reference a deleted Transmission or Channel (application logic)
  - **Business Rule:** A transmission can be broadcast on multiple channels simultaneously
  - **Business Rule:** A channel can be used for multiple transmissions
  - **Business Rule:** The combination of transmission_id and channel_id must be unique (no duplicate channel assignments for the same transmission)

### 2.7. Employee
- **id**: Must be unique, not null (PK, UUID)
- **name**: Not null
- **email**: Not null, unique, valid email format
- **birthdate**: Not null, must be in the past
- **employment_date**: Not null, must be >= birthdate
- **is_internal**: Not null, boolean, default TRUE (company employees are internal by default)
- **status**: ENUM (active, on_leave, terminated), default 'active'
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each Employee may have multiple Roles (via EmployeeRole)
  - Each Employee may participate in multiple Series (via EmployeeSeriesRole)
  - No Episode or EmployeeSeriesRole may reference a deleted Employee (application logic)
  - **Business Rule:** An employee can be both an actor and a director (multi-role allowed)
  - **Business Rule:** A director must be employed by the company (is_internal = TRUE)
  - **Business Rule:** There must always be at least one director employed by the company (enforced by reporting/administration)
  - **Business Rule:** Only employees with status 'active' can be assigned to new episodes or series

### 2.8. Role
- **id**: Must be unique, not null (PK, UUID)
- **name**: Not null, unique
- **department_id**: Must reference existing, non-deleted Department (FK, not null)
- **description**: Optional
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each Role must belong to a Department
  - Each Role may be assigned to multiple Employees (via EmployeeRole)
  - **Business Rule:** Only employees with the 'Actor' role can be assigned a character_name in EmployeeSeriesRole

### 2.9. Department
- **id**: Must be unique, not null (PK, UUID)
- **name**: Not null, unique
- **description**: Optional
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each Department may have multiple Roles

### 2.10. EmployeeRole
- **employee_id, role_id**: Composite PK, both must reference existing, non-deleted Employee and Role
- **assigned_at**: Optional
- **is_active**: Boolean, default TRUE
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each EmployeeRole links one Employee and one Role
  - No EmployeeRole may reference a deleted Employee or Role (application logic)
  - **Business Rule:** An employee must have at least one active role at all times

### 2.11. EmployeeSeriesRole
- **employee_id, series_id, role_id**: Composite PK, all must reference existing, non-deleted Employee, TVSeries, and Role
- **character_name**: Required if role is 'Actor', must be NULL otherwise
- **start_date, end_date**: Optional
- **deleted**: Boolean, default FALSE (soft delete)
- **created_time, updated_time**: Set automatically
- **Relationships**:
  - Each EmployeeSeriesRole links one Employee, one TVSeries, and one Role
  - No EmployeeSeriesRole may reference a deleted Employee, TVSeries, or Role (application logic)
  - **Business Rule:** An actor can participate in multiple series, and a series can have multiple actors
  - **Business Rule:** An actor can play different characters in different series
  - **Business Rule:** An actor can participate in more than one series at the same time

---

## 3. General Business Rules
- All tables: No duplicate records (enforced by PK/unique constraints)
- All tables: Soft delete only, never hard delete
- All tables: created_time and updated_time must be set and maintained
- All FKs: Must reference non-deleted records (application logic; referential integrity must be maintained for active data)
- All queries: Must filter out deleted records unless explicitly required
- All validation fields: Must reference values in validation tables (e.g., domains, roles, departments, channels)
- **Multi-channel Broadcasting:** Transmissions can be broadcast on multiple channels simultaneously through the TransmissionChannel linking table
- **Global Support:** Transmission times use TIMESTAMPTZ for timezone support, viewership uses BIGINT for global scale
- **Indexing:** Indexes should be created on frequently joined or filtered fields (e.g., series_id, episode_id, role_id, employee_id, transmission_id, channel_id) to support efficient queries and reporting.
- **Reporting/Analytics:**
  - It must be possible to answer:
    - Which actors play in a given series (e.g., "Big Sister")
    - In which series a given actor (e.g., "Bertil Bom") participates
    - Which actors participate in more than one series
    - How many times (and when) an episode was transmitted
    - How many directors are employed by the company
    - Which director has directed the greatest number of episodes
    - **New Multi-channel Queries:**
      - Which channels broadcast a specific episode
      - How many channels broadcast each transmission
      - Which episodes were broadcast on multiple channels simultaneously
      - Channel performance comparison (viewership by channel)
      - Global transmission reach (total viewership across all channels)

---

## 4. Data Integrity Review Checklist
- [ ] No duplicate, calculated, multivalued, or multipart fields
- [ ] No duplicate records
- [ ] Every record identified by a primary key
- [ ] Each primary key conforms to best practices
- [ ] Each field conforms to the Elements of the Ideal Field
- [ ] Field specifications are complete
- [ ] All relationships properly established
- [ ] Deletion rules are appropriate (soft delete)
- [ ] Participation and degree are correct
- [ ] Each rule imposes a meaningful constraint
- [ ] Proper category and type are determined
- [ ] Rules are documented and maintained
- [ ] Validation tables are used where appropriate

---

## 5. References
- Project requirements
- Chapter 9: Field Specifications (Database Design Book)
- Chapter 10: Table Relationships (Database Design Book)
- Chapter 11: Business Rules (Database Design Book)
- Chapter 13: Reviewing Data Integrity (Database Design Book)
