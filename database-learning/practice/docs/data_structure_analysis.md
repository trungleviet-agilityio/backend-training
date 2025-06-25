# 📊 Data Structure Analysis & Field Specifications

---

## 1. Subject Identification

Based on the mission objectives and TV series requirements, the following subjects were identified for the TV series database:

### 1.1. Primary Subjects (Data Tables)
1. **SeriesDomain** - Content categorization and genre management
2. **TVSeries** - Television series information and lifecycle
3. **Episode** - Individual episode details and production information
4. **Transmission** - Broadcasting events and scheduling
5. **Channel** - Broadcasting platforms and outlets
6. **Employee** - Actor and director personnel information
7. **Role** - Job functions (Actor, Director, etc.)
8. **Department** - Organizational structure

### 1.2. Linking Subjects (Junction Tables)
1. **TransmissionChannel** - Links transmissions to channels (M:N relationship)
2. **SeriesCast** - Links actors and directors to series with specific roles (M:N relationship)

### 1.3. Validation Subjects
1. **SeriesDomain** - Validates series genres/domains
2. **Channel** - Validates transmission channels
3. **Role** - Validates employee roles (Actor, Director, etc.)
4. **Department** - Validates organizational departments

---

## 2. Field Analysis & Refinement

### 2.1. Initial Field Collection
From TV series requirements analysis, the following fields were initially identified:

**Series Management:**
- Series title, description, genre, start date, end date, status
- Episode number, title, duration, air date, director
- Transmission time, channel, viewership

**Actor and Director Management:**
- Employee name, email, birthdate, hire date, department, role
- Character name, start date, end date (for series participation)

**Organizational:**
- Department name, description
- Role name, description, department

### 2.2. Field Refinement Process

#### 2.2.1. Removed Calculated Fields
- **Episode count per series** → Calculated from Episode table
- **Total viewership per episode** → Calculated from Transmission table
- **Employee age** → Calculated from birthdate
- **Years of employment** → Calculated from employment_date

#### 2.2.2. Resolved Multipart Fields
- **Employee name** → Split into first_name, last_name (later refined to single name field)
- **Address information** → Not needed for current scope
- **Contact information** → Simplified to email only

#### 2.2.3. Resolved Multivalued Fields
- **Employee roles** → Resolved via SeriesCast linking table
- **Series participation** → Resolved via SeriesCast linking table
- **Transmission channels** → Resolved via TransmissionChannel linking table

#### 2.2.4. Field Consolidation
- **Employee name** → Consolidated to single name field for simplicity
- **Role information** → Separated into Role and Department tables
- **Channel information** → Enhanced with type and description fields

---

## 3. Field Specifications

### 3.1. General Elements

#### SeriesDomain Fields
| Field | Description | Source | Table | Key Type | Key Structure | Uniqueness |
|-------|-------------|--------|-------|----------|---------------|------------|
| uuid | Unique identifier | System | SeriesDomain | Primary | Single | Unique |
| name | Domain/genre name | User | SeriesDomain | Non-key | Single | Unique |
| description | Detailed description | User | SeriesDomain | Non-key | Single | Non-unique |

#### TVSeries Fields
| Field | Description | Source | Table | Key Type | Key Structure | Uniqueness |
|-------|-------------|--------|-------|----------|---------------|------------|
| uuid | Unique identifier | System | TVSeries | Primary | Single | Unique |
| title | Series title | User | TVSeries | Non-key | Single | Non-unique |
| description | Series description | User | TVSeries | Non-key | Single | Non-unique |
| domain_uuid | Reference to domain | System | TVSeries | Foreign | Single | Non-unique |
| start_date | Production start date | User | TVSeries | Non-key | Single | Non-unique |
| end_date | Production end date | User | TVSeries | Non-key | Single | Non-unique |

#### Episode Fields
| Field           | Description | Source | Table | Key Type | Key Structure | Uniqueness |
|-----------------|-------------|--------|-------|----------|---------------|------------|
| uuid | Unique identifier | System | Episode | Primary | Single | Unique |
| series_uuid | Reference to series | System | Episode | Foreign | Single | Non-unique |
| episode_number | Sequential number | User | Episode | Non-key | Single | Composite unique |
| title | Episode title | User | Episode | Non-key | Single | Non-unique |
| duration_minutes | Episode length | User | Episode | Non-key | Single | Non-unique |
| air_date | First air date | User | Episode | Non-key | Single | Non-unique |
| director_uuid | Reference to director | System | Episode | Foreign | Single | Non-unique; must be assigned as Director in SeriesCast for this series |

> **Note:** The director_uuid for an episode must reference an employee who is assigned the Director role for the same series in the SeriesCast table. This is enforced by a business rule or trigger. Different episodes within the same series may be directed by different directors, providing creative flexibility.

#### Employee Fields (Actors and Directors)
| Field | Description | Source | Table | Key Type | Key Structure | Uniqueness |
|-------|-------------|--------|-------|----------|---------------|------------|
| uuid | Unique identifier | System | Employee | Primary | Single | Unique |
| first_name | Employee's first name | User | Employee | Non-key | Single | Non-unique |
| last_name | Employee's last name | User | Employee | Non-key | Single | Non-unique |
| email | Employee's email address | User | Employee | Non-key | Single | Unique |
| birthdate | Date of birth | User | Employee | Non-key | Single | Non-unique |
| employment_date | Hire date | User | Employee | Non-key | Single | Non-unique |
| is_internal | Internal employee flag | System | Employee | Non-key | Single | Non-unique |
| status | Production status | System | Employee | Non-key | Single | Non-unique |
| deleted | Soft delete flag | System | Employee | Non-key | Single | Non-unique |
| created_time | Record creation time | System | Employee | Non-key | Single | Non-unique |
| updated_time | Last update time | System | Employee | Non-key | Single | Non-unique |

#### SeriesCast Fields
| Field | Description | Source | Table | Key Type | Key Structure | Uniqueness |
|-------|-------------|--------|-------|----------|---------------|------------|
| uuid | Unique identifier | System | SeriesCast | Primary | Single | Unique |
| employee_uuid | Reference to employee | System | SeriesCast | Foreign | Single | Non-unique |
| series_uuid | Reference to series | System | SeriesCast | Foreign | Single | Non-unique |
| role_uuid | Reference to role | System | SeriesCast | Foreign | Single | Non-unique |
| character_name | Character name | User | SeriesCast | Non-key | Single | Non-unique |
| start_date | Participation start date | User | SeriesCast | Non-key | Single | Non-unique |
| end_date | Participation end date | User | SeriesCast | Non-key | Single | Non-unique |

> **Note:** (employee_uuid, series_uuid, role_uuid) has a UNIQUE constraint to prevent duplicate assignments.

### 3.2. Physical Elements

#### Data Types & Sizes
- **UUID**: Used for all primary keys (36 characters)
- **VARCHAR(100)**: Used for names and titles
- **TEXT**: Used for descriptions (unlimited)
- **DATE**: Used for dates (YYYY-MM-DD format)
- **TIMESTAMPTZ**: Used for transmission times (with timezone)
- **BIGINT**: Used for viewership (supports global scale)
- **BOOLEAN**: Used for flags and status fields
- **ENUM**: Used for employee production status (available, busy, unavailable)

#### Character Support
- **Encoding**: UTF-8 for international character support
- **Collation**: Case-insensitive for name fields
- **Special Characters**: Support for apostrophes, hyphens, and accented characters

### 3.3. Logical Elements

#### Required Fields
- All primary keys (uuid fields)
- All foreign keys (reference fields)
- Name fields (series titles, episode titles, employee names)
- Critical business fields (episode_number, director_uuid, transmission_time)

#### Optional Fields
- Description fields (can be NULL)
- End dates (for ongoing series)
- Character names (only for actors)
- Viewership data (may not be available)

#### Default Values
- **deleted**: FALSE (soft delete default)
- **is_internal**: TRUE (employees are internal by default)
- **status**: 'available' (employee production status default)

#### Validation Rules
- **Episode duration**: 1-600 minutes
- **Episode number**: Positive integer, unique within series
- **Employment date**: Must be >= birthdate
- **End date**: Must be >= start_date (if present)
- **Viewership**: Must be >= 0 (if present)

---

## 4. Table Structure Validation

### 4.1. Subject-Verb-Noun Analysis
Each table represents a single subject:

- **SeriesDomain** → "A domain/genre of television content"
- **TVSeries** → "A television series"
- **Episode** → "An episode of a television series"
- **Transmission** → "A transmission/broadcast of an episode"
- **Channel** → "A broadcasting channel/platform"
- **Employee** → "An actor or director employed by the TV company"
- **Role** → "A role/job function (Actor, Director, etc.)"
- **Department** → "A department in the company"

### 4.2. Field Relevance Check
All fields in each table are directly related to the table's subject:

- **TVSeries** fields all describe characteristics of a television series
- **Episode** fields all describe characteristics of an episode
- **Employee** fields all describe characteristics of an actor or director
- **Transmission** fields all describe characteristics of a transmission

### 4.3. Duplicate Field Elimination
No duplicate fields exist across tables:
- Each field appears only once in the database
- Related fields (like names) are properly contextualized
- Foreign keys are clearly identified and properly named

---

## 5. Primary Key Establishment

### 5.1. Single-Field Primary Keys
- **SeriesDomain.uuid**: UUID, auto-generated
- **TVSeries.uuid**: UUID, auto-generated
- **Episode.uuid**: UUID, auto-generated
- **Transmission.uuid**: UUID, auto-generated
- **Channel.uuid**: UUID, auto-generated
- **Employee.uuid**: UUID, auto-generated
- **Role.uuid**: UUID, auto-generated
- **Department.uuid**: UUID, auto-generated
- **SeriesCast.uuid**: UUID, auto-generated

### 5.2. Composite Primary Keys
- **TransmissionChannel**: (transmission_uuid, channel_uuid)
- **SeriesCast**: (employee_uuid, series_uuid, role_uuid) UNIQUE constraint

### 5.3. Primary Key Characteristics
- **Uniqueness**: All primary keys are guaranteed unique
- **Stability**: UUIDs remain stable throughout record lifecycle
- **Simplicity**: Simple, single-purpose identifiers
- **Non-intelligence**: No business meaning embedded in keys

---

## 6. References
- Chapter 4: Conceptual Overview (Database Design Book)
- Chapter 5: Starting the Process (Database Design Book)
- Mission Statement & Objectives Document
- TV Series Production Requirements
