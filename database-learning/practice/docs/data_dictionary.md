# 📄 Database Table & Field Documentation

---

## 1. Table & Field Definitions

### SeriesDomain
| Field         | Type      | Description | Notes              |
|--------------|-----------|-------------|--------------------|
| uuid           | UUID      | Unique identifier for the series domain/genre | 🔑 Primary Key     |
| name         | VARCHAR   | Name of the domain/genre (e.g., Drama, Comedy) | Unique, max 100 chars |
| description  | TEXT      | Detailed description of the domain/genre | Optional, max 500 chars |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete        |
| created_time | TIMESTAMP | When the record was created | Record creation time|
| updated_time | TIMESTAMP | When the record was last updated | Last update time   |

### TVSeries
| Field         | Type      | Description | Notes                                  |
|--------------|-----------|-------------|----------------------------------------|
| uuid           | UUID      | Unique identifier for the TV series | 🔑 Primary Key                         |
| title        | VARCHAR   | Title of the TV series | Not unique; duplicate titles allowed |
| description  | TEXT      | Description or synopsis of the series | Optional                               |
| domain_uuid    | UUID      | Reference to the series domain/genre | FK → SeriesDomain(uuid)               |
| start_date   | DATE      | Date when production or airing started | Should not be in the future            |
| end_date     | DATE      | Date when production or airing ended (nullable for ongoing series) | Nullable, must be >= start_date        |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time | TIMESTAMP | When the record was last updated | Last update time                       |

> **Note:** TVSeries.title is not unique. Multiple series may have the same title (e.g., remakes, reboots). Use the uuid for uniqueness.

### Episode
| Field           | Type      | Description | Notes                                  |
|-----------------|-----------|-------------|----------------------------------------|
| uuid              | UUID      | Unique identifier for the episode | 🔑 Primary Key                         |
| series_uuid       | UUID      | Reference to the parent TV series | FK → TVSeries(uuid)                   |
| episode_number  | INT       | Sequential number of the episode within the series | Unique with series_uuid (composite unique) |
| title           | VARCHAR   | Title of the episode | Not unique; duplicate titles allowed  |
| duration_minutes| INT       | Length of the episode in minutes | 1-600                                  |
| air_date        | DATE      | Date the episode was first aired | Optional, must be >= TVSeries.start_date |
| director_uuid     | UUID      | Reference to the director (employee) | FK → Employee(uuid)                   |
| deleted         | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time    | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time    | TIMESTAMP | When the record was last updated | Last update time                       |

> **Note:** Episode.title is not unique. Use (series_uuid, episode_number) as a unique identifier for episodes within a series.

### Transmission
| Field            | Type        | Description | Notes                                |
|------------------|-------------|-------------|--------------------------------------|
| uuid               | UUID        | Unique identifier for the transmission event | 🔑 Primary Key                       |
| episode_uuid       | UUID        | Reference to the episode being transmitted | FK → Episode(uuid)                  |
| transmission_time| TIMESTAMPTZ | Date and time of the transmission (with timezone) |                                    |
| viewership       | BIGINT      | Number of viewers (if available) | Optional, supports global scale      |
| deleted          | BOOLEAN     | Marks record as deleted without physical removal | Soft delete                          |
| created_time     | TIMESTAMP   | When the record was created | Record creation time                 |
| updated_time     | TIMESTAMP   | When the record was last updated | Last update time                     |

### TransmissionChannel (linking table for multi-channel broadcasts)
| Field            | Type      | Description | Notes                                |
|------------------|-----------|-------------|--------------------------------------|
| transmission_uuid  | UUID      | Reference to the transmission | 🔑 Composite PK, FK → Transmission(uuid) |
| channel_uuid       | UUID      | Reference to the channel | 🔑 Composite PK, FK → Channel(uuid)      |
| created_time     | TIMESTAMP | When the record was created | Record creation time                 |
| updated_time     | TIMESTAMP | When the record was last updated | Last update time                     |
| deleted          | BOOLEAN   | Marks record as deleted without physical removal | Soft delete, default false           |

### Channel
| Field         | Type      | Description | Notes                        |
|--------------|-----------|-------------|-----------------------------|
| uuid           | UUID      | Unique channel ID | 🔑 Primary key               |
| name         | VARCHAR   | Channel name (e.g., HBO, Netflix, Youtube) | Unique, max 100 chars         |
| type         | VARCHAR   | Type of channel (e.g., Cable, OTT, Web) | Optional                      |
| description  | TEXT      | Channel info or notes | Optional                    |
| deleted      | BOOLEAN   | Soft delete | Default: false               |
| created_time | TIMESTAMP | Record creation time |                             |
| updated_time | TIMESTAMP | Last updated time    |                             |

### Employee
| Field           | Type      | Description | Notes                        |
|-----------------|-----------|-------------|-----------------------------|
| uuid              | UUID      | Unique identifier for the employee | 🔑 Primary Key               |
| first_name      | VARCHAR   | Employee's first name |                             |
| last_name       | VARCHAR   | Employee's last name |                             |
| email           | VARCHAR   | Employee's email address (must be unique) | Unique                      |
| birthdate       | DATE      | Date of birth of the employee |                             |
| employment_date | DATE      | Date the employee was hired |                             |
| is_internal     | BOOLEAN   | Whether the employee is internal (true) or external/freelance (false) | Default: TRUE               |
| status          | ENUM      | Employee status (active, on_leave, terminated) | Default: active             |
| deleted         | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                 |
| created_time    | TIMESTAMP | When the record was created | Record creation time        |
| updated_time    | TIMESTAMP | When the record was last updated | Last update time            |

### Role
| Field         | Type      | Description | Notes                                  |
|--------------|-----------|-------------|----------------------------------------|
| uuid           | UUID      | Unique identifier for the role | 🔑 Primary Key                         |
| name         | VARCHAR   | Name of the role (e.g., Actor, Director) | Unique, max 100 chars                |
| department_uuid| UUID      | Reference to the department this role belongs to | FK → Department(uuid)                 |
| description  | TEXT      | Description of the role's responsibilities | Optional                               |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time | TIMESTAMP | When the record was last updated | Last update time                       |

### Department
| Field         | Type      | Description | Notes                        |
|--------------|-----------|-------------|-----------------------------|
| uuid           | UUID      | Unique identifier for the department | 🔑 Primary Key               |
| name         | VARCHAR   | Name of the department (must be unique) | Unique, max 100 chars        |
| description  | TEXT      | Description of the department's function | Optional                    |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                 |
| created_time | TIMESTAMP | When the record was created | Record creation time        |
| updated_time | TIMESTAMP | When the record was last updated | Last update time            |

### EmployeeRole (Global: employee & company-wide role)
| Field        | Type      | Description | Notes                                  |
|-------------|-----------|-------------|----------------------------------------|
| employee_uuid | UUID      | Reference to the employee | 🔑 Composite PK, FK → Employee(uuid)  |
| role_uuid     | UUID      | Reference to the role | 🔑 Composite PK, FK → Role(uuid)      |
| assigned_at | DATE      | Date the role was assigned to the employee | Optional                               |
| is_active   | BOOLEAN   | Whether the role assignment is currently active | Default: true                          |
| created_time| TIMESTAMP | When the record was created | Record creation time                   |
| updated_time| TIMESTAMP | When the record was last updated | Last update time                       |

### EmployeeSeriesRole (employee participates in TVSeries)
| Field          | Type      | Description | Notes                                  |
|---------------|-----------|-------------|----------------------------------------|
| employee_uuid   | UUID      | Reference to the employee | 🔑 Composite PK, FK → Employee(uuid)  |
| series_uuid     | UUID      | Reference to the TV series | 🔑 Composite PK, FK → TVSeries(uuid)  |
| role_uuid       | UUID      | Reference to the role in the series (e.g., Actor, Director) | 🔑 Composite PK, FK → Role(uuid)      |
| character_name| VARCHAR   | Name of the character played (if applicable) | Required if role is 'Actor', NULL otherwise |
| start_date    | DATE      | Date the employee started participating in the series | Optional                               |
| end_date      | DATE      | Date the employee stopped participating in the series | Optional                               |
| deleted       | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time  | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time  | TIMESTAMP | When the record was last updated | Last update time                       |

### ValidationLog / AuditLog (Optional)
| Field         | Type      | Description | Notes                        |
|--------------|-----------|-------------|-----------------------------|
| uuid           | UUID      | Unique log entry ID | 🔑 Primary Key               |
| table_name   | VARCHAR   | Name of the table affected |                             |
| record_uuid    | UUID      | ID of the record affected |                             |
| action       | VARCHAR   | Action performed (insert, update, delete) |                             |
| changed_by   | VARCHAR   | User or system who made the change |                             |
| change_time  | TIMESTAMPTZ | When the change was made (with timezone) |                             |
| reason       | TEXT      | Reason for the change | Optional                    |

---

## 2. Adjacency Matrix (Table Relationships)

|                   | SeriesDomain | TVSeries | Episode | Employee | Role | Department | EmployeeRole | EmployeeSeriesRole | TransmissionChannel | Transmission | Channel |
|-------------------|:-----------:|:--------:|:-------:|:--------:|:----:|:----------:|:------------:|:------------------:|:------------------:|:------------:|:-------:|
| **SeriesDomain**        |      -      |   1:N    |         |          |      |            |              |                    |                    |              |         |
| **TVSeries**            |    N:1      |    -     |   1:N   |          |      |            |              |        1:N         |                    |              |         |
| **Episode**             |             |   N:1    |    -    |   N:1*   |      |            |              |                    |                    |     1:N      |         |
| **Employee**            |             |          |   1:N*  |    -     |      |     1:N    |     1:N      |        1:N         |                    |              |         |
| **Role**                |             |          |         |          |  -   |    N:1     |     1:N      |        1:N         |                    |              |         |
| **Department**          |             |          |         |          |  1:N |     -      |              |                    |                    |              |         |
| **EmployeeRole**        |             |          |         |   N:1    |  N:1 |            |      -       |                    |                    |              |         |
| **EmployeeSeriesRole**  |             |   N:1    |         |   N:1    |  N:1 |            |              |         -          |                    |              |         |
| **TransmissionChannel** |             |          |         |          |      |            |              |                    |        -           |     N:1      |   N:1   |
| **Transmission**        |             |          |   N:1   |          |      |            |              |                    |        1:N         |      -       |         |
| **Channel**             |             |          |         |          |      |            |              |                    |        1:N         |              |    -    |

- **1:N**: Row table has one, column table has many (e.g., TVSeries 1:N Episode)
- **N:1**: Row table has many, column table has one (e.g., Episode N:1 TVSeries)
- **N:1\***: Episode.director_uuid → Employee.uuid (each episode has one director, an employee)

> **Note:** All M:N relationships in the logical model are implemented as two 1:N relationships via linking (junction) tables in the physical schema. For example, EmployeeSeriesRole links Employee and TVSeries with two 1:N relationships.

---

## 3. Notes & Best Practices
- All primary keys are UUIDs for global uniqueness.
- All foreign keys are explicitly defined.
- Composite primary keys are used in linking tables for M:N relationships.
- Soft delete (`deleted` boolean) is used for logical deletion.
- All tables include `created_time` and `updated_time` timestamps.
- Field specifications (type, nullability, uniqueness, description) follow best practices from chapters 8–10.
- Use BIGINT for viewership to support global platforms.
- Use TIMESTAMPTZ for all timestamps that may be global (e.g., transmission_time, audit logs).
- TVSeries.title and Episode.title are not unique; use composite keys or UUIDs for uniqueness.
- Channel is a validation table for allowed transmission channels; Transmission.channel_uuid must reference Channel.uuid (FK).
- Employee.status supports reporting and admin logic (active, on_leave, terminated).
- Consider using a ValidationLog or AuditLog table for tracking changes, editors, and reasons.
