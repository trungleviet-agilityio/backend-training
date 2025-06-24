# 📄 Database Table & Field Documentation

---

## 1. Table & Field Definitions

### SeriesDomain
| Field         | Type      | Description | Notes              |
|--------------|-----------|-------------|--------------------|
| id           | UUID      | Unique identifier for the series domain/genre | 🔑 Primary Key     |
| name         | VARCHAR   | Name of the domain/genre (e.g., Drama, Comedy) | Unique             |
| description  | TEXT      | Detailed description of the domain/genre | Optional           |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete        |
| created_time | TIMESTAMP | When the record was created | Record creation time|
| updated_time | TIMESTAMP | When the record was last updated | Last update time   |

### TVSeries
| Field         | Type      | Description | Notes                                  |
|--------------|-----------|-------------|----------------------------------------|
| id           | UUID      | Unique identifier for the TV series | 🔑 Primary Key                         |
| title        | VARCHAR   | Title of the TV series |                                        |
| description  | TEXT      | Description or synopsis of the series | Optional                               |
| domain_id    | UUID      | Reference to the series domain/genre | 🔗 FK → SeriesDomain(id)               |
| start_date   | DATE      | Date when production or airing started |                                        |
| end_date     | DATE      | Date when production or airing ended (nullable for ongoing series) | Nullable                               |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time | TIMESTAMP | When the record was last updated | Last update time                       |

### Episode
| Field           | Type      | Description | Notes                                  |
|-----------------|-----------|-------------|----------------------------------------|
| id              | UUID      | Unique identifier for the episode | 🔑 Primary Key                         |
| series_id       | UUID      | Reference to the parent TV series | 🔗 FK → TVSeries(id)                   |
| episode_number  | INT       | Sequential number of the episode within the series |                                        |
| title           | VARCHAR   | Title of the episode | Optional                               |
| duration_minutes| INT       | Length of the episode in minutes |                                        |
| air_date        | DATE      | Date the episode was first aired | Optional                               |
| director_id     | UUID      | Reference to the director (employee) | 🔗 FK → Employee(id)                   |
| deleted         | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time    | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time    | TIMESTAMP | When the record was last updated | Last update time                       |

### Transmission
| Field            | Type      | Description | Notes                                |
|------------------|-----------|-------------|--------------------------------------|
| id               | UUID      | Unique identifier for the transmission event | 🔑 Primary Key                       |
| episode_id       | UUID      | Reference to the episode being transmitted | 🔗 FK → Episode(id)                  |
| transmission_time| TIMESTAMP | Date and time of the transmission |                                      |
| channel          | VARCHAR   | Channel or platform where the episode aired |                                      |
| viewership       | INT       | Number of viewers (if available) | Optional                             |
| deleted          | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                          |
| created_time     | TIMESTAMP | When the record was created | Record creation time                 |
| updated_time     | TIMESTAMP | When the record was last updated | Last update time                     |

### Employee
| Field           | Type      | Description | Notes                        |
|-----------------|-----------|-------------|-----------------------------|
| id              | UUID      | Unique identifier for the employee | 🔑 Primary Key               |
| name            | VARCHAR   | Full name of the employee (actor, director, etc.) |                             |
| email           | VARCHAR   | Employee's email address (must be unique) | Unique                      |
| birthdate       | DATE      | Date of birth of the employee |                             |
| employment_date | DATE      | Date the employee was hired |                             |
| is_internal     | BOOLEAN   | Whether the employee is internal (true) or external/freelance (false) |                             |
| deleted         | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                 |
| created_time    | TIMESTAMP | When the record was created | Record creation time        |
| updated_time    | TIMESTAMP | When the record was last updated | Last update time            |

### Role
| Field         | Type      | Description | Notes                                  |
|--------------|-----------|-------------|----------------------------------------|
| id           | UUID      | Unique identifier for the role | 🔑 Primary Key                         |
| name         | VARCHAR   | Name of the role (e.g., Actor, Director) |                                        |
| department_id| UUID      | Reference to the department this role belongs to | 🔗 FK → Department(id)                 |
| description  | TEXT      | Description of the role's responsibilities | Optional                               |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time | TIMESTAMP | When the record was last updated | Last update time                       |

### Department
| Field         | Type      | Description | Notes                        |
|--------------|-----------|-------------|-----------------------------|
| id           | UUID      | Unique identifier for the department | 🔑 Primary Key               |
| name         | VARCHAR   | Name of the department (must be unique) | Unique                      |
| description  | TEXT      | Description of the department's function | Optional                    |
| deleted      | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                 |
| created_time | TIMESTAMP | When the record was created | Record creation time        |
| updated_time | TIMESTAMP | When the record was last updated | Last update time            |

### EmployeeRole (Global: employee & company-wide role)
| Field        | Type      | Description | Notes                                  |
|-------------|-----------|-------------|----------------------------------------|
| employee_id | UUID      | Reference to the employee | 🔑 Composite PK, 🔗 FK → Employee(id)  |
| role_id     | UUID      | Reference to the role | 🔑 Composite PK, 🔗 FK → Role(id)      |
| assigned_at | DATE      | Date the role was assigned to the employee | Optional                               |
| is_active   | BOOLEAN   | Whether the role assignment is currently active | Default: true                          |
| created_time| TIMESTAMP | When the record was created | Record creation time                   |
| updated_time| TIMESTAMP | When the record was last updated | Last update time                       |

### EmployeeSeriesRole (employee participates in TVSeries)
| Field          | Type      | Description | Notes                                  |
|---------------|-----------|-------------|----------------------------------------|
| employee_id   | UUID      | Reference to the employee | 🔑 Composite PK, 🔗 FK → Employee(id)  |
| series_id     | UUID      | Reference to the TV series | 🔑 Composite PK, 🔗 FK → TVSeries(id)  |
| role_id       | UUID      | Reference to the role in the series (e.g., Actor, Director) | 🔑 Composite PK, 🔗 FK → Role(id)      |
| character_name| VARCHAR   | Name of the character played (if applicable) | Optional (if actor)                    |
| start_date    | DATE      | Date the employee started participating in the series | Optional                               |
| end_date      | DATE      | Date the employee stopped participating in the series | Optional                               |
| deleted       | BOOLEAN   | Marks record as deleted without physical removal | Soft delete                            |
| created_time  | TIMESTAMP | When the record was created | Record creation time                   |
| updated_time  | TIMESTAMP | When the record was last updated | Last update time                       |

---

## 2. Adjacency Matrix (Table Relationships)

|                   | SeriesDomain | TVSeries | Episode | Transmission | Employee | Role | Department | EmployeeRole | EmployeeSeriesRole |
|-------------------|:-----------:|:--------:|:-------:|:------------:|:--------:|:----:|:----------:|:------------:|:------------------:|
| **SeriesDomain**        |      -      |   1:N    |         |              |          |      |            |              |                    |
| **TVSeries**            |    N:1      |    -     |   1:N   |              |          |      |            |              |        1:N         |
| **Episode**             |             |   N:1    |    -    |     1:N      |   N:1*   |      |            |              |                    |
| **Transmission**        |             |          |   N:1   |      -       |          |      |            |              |                    |
| **Employee**            |             |          |   1:N*  |              |    -     |      |     1:N    |     1:N      |        1:N         |
| **Role**                |             |          |         |              |          |  -   |    N:1     |     1:N      |        1:N         |
| **Department**          |             |          |         |              |          |  1:N |     -      |              |                    |
| **EmployeeRole**        |             |          |         |              |   N:1    |  N:1 |            |      -       |                    |
| **EmployeeSeriesRole**  |             |   N:1    |         |              |   N:1    |  N:1 |            |              |         -          |

- **1:N**: Row table has one, column table has many (e.g., TVSeries 1:N Episode)
- **N:1**: Row table has many, column table has one (e.g., Episode N:1 TVSeries)
- **N:1\***: Episode.director_id → Employee.id (each episode has one director, an employee)

> **Note:** All M:N relationships in the logical model are implemented as two 1:N relationships via linking (junction) tables in the physical schema. For example, EmployeeSeriesRole links Employee and TVSeries with two 1:N relationships.

---

## 3. Notes & Best Practices
- All primary keys are UUIDs for global uniqueness.
- All foreign keys are explicitly defined.
- Composite primary keys are used in linking tables for M:N relationships.
- Soft delete (`deleted` boolean) is used for logical deletion.
- All tables include `created_time` and `updated_time` timestamps.
- Field specifications (type, nullability, uniqueness, description) follow best practices from chapters 8–10.
