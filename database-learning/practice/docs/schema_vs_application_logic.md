# 🔍 Schema Logic vs Application Logic

## Overview
This document clearly explains the distinction between **schema logic** (database-enforced) and **application logic** (code-enforced) business rules in the TV company database system.

---

## 📊 Quick Comparison

| Aspect | Schema Logic | Application Logic |
|--------|-------------|-------------------|
| **Where enforced** | Database level | Application level |
| **How enforced** | Declarative constraints | Procedural code |
| **Reliability** | High (DBMS enforced) | Medium (depends on code) |
| **Performance** | Optimized by DBMS | Depends on implementation |
| **Maintenance** | Centralized in schema | Distributed across codebase |
| **Bypass possibility** | Very difficult | Possible if code is flawed |

---

## 🗄️ Schema Logic (Database-Enforced)

### What It Is
Constraints, triggers, and rules enforced directly by the database management system.

### Where It's Implemented
- `01_create_schema.sql` - Table structures, primary keys, foreign keys
- `02_business_rules.sql` - CHECK constraints, triggers, indexes

### Examples from TV Company Database

#### Field-Level Constraints
```sql
-- Duration must be between 1-600 minutes
ALTER TABLE episodes
ADD CONSTRAINT check_duration
CHECK (duration_minutes BETWEEN 1 AND 600);

-- Employment date must be after birthdate
ALTER TABLE employees
ADD CONSTRAINT check_employment_date
CHECK (employment_date >= birthdate);
```

#### Business Rule Triggers
```sql
-- Director validation
CREATE TRIGGER validate_director_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION validate_director_role();

-- Character name validation for actors
CREATE TRIGGER validate_character_name_trigger
    BEFORE INSERT OR UPDATE ON employee_series_roles
    FOR EACH ROW
    EXECUTE FUNCTION validate_character_name();
```

#### Performance Indexes
```sql
-- Foreign key indexes for join performance
CREATE INDEX idx_episodes_series_id ON episodes(series_id);
CREATE INDEX idx_employees_deleted ON employees(deleted);
```

### Benefits
- ✅ **Automatic enforcement** - No application code needed
- ✅ **High reliability** - DBMS guarantees enforcement
- ✅ **Centralized** - Single source of truth
- ✅ **Performance optimized** - DBMS handles efficiently

### Limitations
- ❌ **Simple rules only** - Cannot handle complex business workflows
- ❌ **Limited flexibility** - Cannot provide user-friendly error messages
- ❌ **Database-specific** - Tied to specific DBMS features

---

## 💻 Application Logic (Code-Enforced)

### What It Is
Business rules and validation logic implemented in application code, service layers, or business objects.

### Where It's Implemented
- Application service layers
- Business validation logic
- User interface validation
- Reporting and analytics services

### Examples from TV Company Database

#### Soft Delete Referential Integrity
```python
# Application must filter deleted records
def get_active_episodes(series_id):
    return Episode.objects.filter(
        series_id=series_id,
        deleted=False
    )
```

#### Business Workflow Rules
```python
# First episode must have episode_number = 1
def create_episode(series_id, episode_number, **kwargs):
    if episode_number == 1:
        existing = Episode.objects.filter(
            series_id=series_id,
            episode_number=1,
            deleted=False
        )
        if existing.exists():
            raise ValidationError("Episode 1 already exists")

    return Episode.objects.create(
        series_id=series_id,
        episode_number=episode_number,
        **kwargs
    )
```

#### Complex Validation
```python
# Email format validation
def validate_employee_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValidationError("Invalid email format")
```

### Benefits
- ✅ **Complex rules** - Can handle sophisticated business workflows
- ✅ **User-friendly** - Can provide detailed error messages
- ✅ **Flexible** - Can integrate with external systems
- ✅ **Temporary rules** - Can implement conditional logic

### Limitations
- ❌ **Manual enforcement** - Requires careful coding
- ❌ **Distributed logic** - Rules may be scattered across codebase
- ❌ **Potential bypass** - Can be circumvented if code is flawed
- ❌ **Performance overhead** - Additional application processing

---

## 🎯 When to Use Each Type

### Use Schema Logic For:
- ✅ **Field format and range validation**
- ✅ **Referential integrity** (foreign keys)
- ✅ **Atomic business rules** (single table)
- ✅ **Audit trail requirements**
- ✅ **Performance-critical constraints**
- ✅ **Data consistency guarantees**

### Use Application Logic For:
- ✅ **Cross-table validation**
- ✅ **Complex business workflows**
- ✅ **User interface validation**
- ✅ **External system integration**
- ✅ **Temporary or conditional rules**
- ✅ **User-friendly error handling**

---

## 🔧 Implementation Guidelines

### Schema Logic Implementation
```sql
-- 1. Define constraints in schema
ALTER TABLE episodes
ADD CONSTRAINT check_episode_air_date
CHECK (air_date IS NULL OR air_date >= (
    SELECT start_date FROM tv_series WHERE id = episodes.series_id
));

-- 2. Create triggers for complex validation
CREATE TRIGGER validate_director_trigger
    BEFORE INSERT OR UPDATE ON episodes
    FOR EACH ROW
    EXECUTE FUNCTION validate_director_role();

-- 3. Add performance indexes
CREATE INDEX idx_episodes_series_episode ON episodes(series_id, episode_number);
```

### Application Logic Implementation
```python
# 1. Service layer validation
class EpisodeService:
    def create_episode(self, series_id, episode_number, **kwargs):
        # Validate business rules
        self._validate_episode_number(series_id, episode_number)
        self._validate_series_active(series_id)

        # Create episode
        return Episode.objects.create(
            series_id=series_id,
            episode_number=episode_number,
            **kwargs
        )

    def _validate_episode_number(self, series_id, episode_number):
        # Application logic for episode numbering
        pass

# 2. Query filtering
def get_active_series():
    return TVSeries.objects.filter(deleted=False)

# 3. User interface validation
def validate_employee_form(data):
    errors = []
    if not is_valid_email(data['email']):
        errors.append("Invalid email format")
    return errors
```

---

## 📋 Checklist for Implementation

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

## 🎯 Key Takeaways

1. **Schema Logic** = Database enforces it automatically
2. **Application Logic** = Your code must enforce it manually
3. **Both are essential** for a robust system
4. **Choose wisely** based on complexity and requirements
5. **Document clearly** what is enforced where

---

## 📚 References
- Chapter 11: Business Rules (Database Design Book)
- `business_rules.md` - Detailed business rules documentation
- `02_business_rules.sql` - Schema logic implementation
