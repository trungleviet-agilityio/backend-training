# Chapter 10: Table Relationships

## 📖 Summary

This chapter covers the crucial process of identifying and establishing relationships between tables in a database. Relationships are fundamental to relational database design as they establish logical connections between related data, enable data retrieval from multiple tables, and ensure relationship-level integrity. The chapter explains the three main types of relationships (one-to-one, one-to-many, many-to-many), self-referencing relationships, the process of identifying existing relationships using a table matrix, establishing relationships through primary and foreign keys or linking tables, and defining relationship characteristics including deletion rules, participation types, and degrees of participation.

## 📝 Guided Notes

### 🎯 Why Relationships Are Important

**Four Critical Reasons:**

1. **Establish logical connections between related data**
   - Connect tables that are logically related via the data they contain
   - Enable meaningful associations between different subjects/objects
   - Example: STUDENTS table logically related to STUDENT INSTRUMENTS table

2. **Refine table structures and minimize redundant data**
   - Minor modifications to table structures during relationship establishment
   - Make structures more efficient and eliminate redundant data
   - Improve overall database design quality

3. **Enable data retrieval from multiple tables simultaneously**
   - Mechanism for drawing data from multiple tables at once
   - Foundation for creating views and complex queries
   - Essential for meaningful information presentation

4. **Ensure relationship-level integrity**
   - Guarantee reliable and sound relationships
   - Component of overall data integrity
   - Prevent problems with insert, update, delete operations

**Key Benefits:**
- Properly defined relationships enable relational database benefits
- Careful establishment prevents data integrity problems
- Sound relationships facilitate efficient data operations

### 🔗 Types of Relationships

**Three Main Types:**

#### 1. One-to-One Relationships
**Definition:** Single record in first table related to only one record in second table, and vice versa

**Characteristics:**
- Usually involves subset tables
- Can involve security/privacy considerations
- Example: EMPLOYEES and COMPENSATION tables

**Diagramming:** Simple line between tables

**Establishment:** Primary key from parent table becomes foreign key in child table

#### 2. One-to-Many Relationships
**Definition:** Single record in first table can be related to one or more records in second table, but single record in second table can be related to only one record in first table

**Characteristics:**
- Most common relationship type
- Easiest to identify
- Crucial for data integrity
- Eliminates duplicate data and minimizes redundancy

**Diagramming:** Crow's foot symbol on "many" side

**Establishment:** Primary key from "one" side becomes foreign key on "many" side

**Example:** CUSTOMERS and CUSTOMER RENTALS tables

#### 3. Many-to-Many Relationships
**Definition:** Single record in first table can be related to one or more records in second table, and single record in second table can be related to one or more records in first table

**Characteristics:**
- Second most common relationship type
- More difficult to identify than one-to-many
- Requires careful examination of table structures

**Problems with Many-to-Many Relationships:**
- Difficult to associate records between tables
- Tedious information retrieval
- Large amount of redundant data
- Duplicate data in both tables
- Difficult insert, update, delete operations

**Common Incorrect Solutions:**
1. **Multiple field copies** - Incorporating field multiple times in one table
2. **Single field incorporation** - Taking fields from one table into another

**Proper Solution:** Use linking table to establish relationship

**Diagramming:** Crow's foot symbols on both sides

### 🔄 Self-Referencing Relationships

**Definition:** Relationship that exists between records within a single table

**Types:**
1. **One-to-One** - Given record related to only one other record
2. **One-to-Many** - Given record related to one or more other records
3. **Many-to-Many** - Given record related to multiple records and vice versa

**Establishment:**
- **One-to-One/One-to-Many:** Primary key and foreign key in same table
- **Many-to-Many:** Linking table with fields from same parent table

**Considerations:**
- Can be tedious to retrieve information
- May indicate need for new field/table structures
- Should serve useful purpose

### 🔍 Identifying Existing Relationships

**Process Overview:**
1. Create table matrix
2. Work with users and management
3. Ask appropriate questions
4. Use relationship formulas
5. Diagram relationships

**Table Matrix Creation:**
- List tables across top and down left side
- Same order for both dimensions
- Work systematically through matrix
- Look for direct relationships only

**Two Types of Questions:**

#### 1. Associative Questions
**Format:** "Can a single record in (first table) be associated with one or more records in (second table)?"

**Self-referencing modification:** "Can a single (singular form) be associated with one or more (plural form)?"

**Example:** "Can a single record in CLASSES be associated with one or more records in BUILDINGS?"

#### 2. Contextual Questions
**Two Categories:**

**a) Ownership-oriented:**
- Include words: own, has, is part of, contain
- Example: "Can a single order contain one or more products?"

**b) Action-oriented:**
- Include action verbs: make, visit, place, teach, attend
- Example: "Does a single flight instructor teach one or more types of classes?"

**Relationship Formulas:**
- 1:1 + 1:1 = 1:1 (One-to-one relationship)
- 1:N + 1:1 = 1:N (One-to-many relationship)
- 1:N + 1:N = M:N (Many-to-many relationship)

**Procedure for Official Relationship:**
1. Select pair of tables and note junction entry
2. Locate second table and note opposite junction entry
3. Apply appropriate formula
4. Diagram relationship
5. Cross out both entries on matrix

### 🏗️ Establishing Each Relationship

#### One-to-One and One-to-Many Relationships
**Method:** Use primary key and foreign key

**Process:**
1. Take copy of parent table's primary key
2. Incorporate into child table structure
3. Designate as foreign key
4. Update relationship diagram

**Parent/Child Role Assignment:**
- Usually depends on subjects represented
- Child table must have related record in parent table
- Subset tables usually assigned child role

**Example:** STAFF (parent) and COMPENSATION (child) tables

#### Many-to-Many Relationships
**Method:** Use linking table

**Three-Step Procedure:**
1. **Define linking table** - Take copies of primary keys from both tables
2. **Name linking table** - Represent nature of relationship
3. **Add to table list** - Proper entries for type and description

**Results of Linking Table:**
- Original many-to-many relationship dissolved
- Replaced by two one-to-many relationships
- Linking table contains two foreign keys
- Composite primary key in linking table
- Minimal redundant data

**Example:** STUDENTS and CLASSES → STUDENT CLASSES linking table

#### Self-Referencing Relationships
**One-to-One and One-to-Many:**
- Primary key and foreign key in same table
- Foreign key often already exists in structure
- Create new foreign key if needed

**Many-to-Many:**
- Use linking table with fields from same parent table
- Example: PARTS table → PART COMPONENTS linking table

### 🔧 Refining All Foreign Keys

**Elements of a Foreign Key:**

#### 1. Same Name as Parent Primary Key
**Rule:** Foreign key should have same name as primary key from which it was copied

**Exceptions:** Only for compelling reasons (e.g., self-referencing relationships)

**Benefits:**
- No ambiguity about foreign key validity
- Clear relationship identification
- Saves time on testing and verification

#### 2. Replica Field Specifications
**General Elements Modifications:**
- **Specification Type:** Set to "Replica"
- **Parent Table:** Foreign key's parent table name
- **Source Specification:** Parent primary key name (include table name)
- **Description:** Indicate foreign key's purpose within table

**Logical Elements Modifications:**
- **Key Type:** Set to "Foreign"
- **Uniqueness:** Set to "Non-unique" (except one-to-one relationships)
- **Values Entered By:** Set to "User"
- **Range of Values:** Only existing values from parent primary key
- **Edit Rule:** Usually "Enter Now, Edits Allowed"

#### 3. Values from Parent Primary Key
**Rule:** Foreign key must draw values exclusively from parent primary key

**Benefits:**
- Ensures consistency between tables
- Establishes relationship-level integrity
- Prevents invalid foreign key values

### 🎛️ Establishing Relationship Characteristics

#### 1. Deletion Rules
**Purpose:** Determine what happens when deleting parent table record

**Five Types:**

**a) Deny (D):**
- RDBMS keeps record but designates as "inactive"
- Use when: Cannot delete employee record, must mark inactive

**b) Restrict (R):**
- RDBMS prevents deletion if related records exist
- Must delete child records first
- Use as matter of course

**c) Cascade (C):**
- RDBMS deletes parent record and all related child records
- Use when: Delete employee and all associated orders

**d) Nullify (N):**
- RDBMS deletes parent record and sets foreign keys to Null
- Requires Null Support = "Nulls Allowed"

**e) Set Default (S):**
- RDBMS deletes parent record and sets foreign keys to default value
- Requires default value setting

**Question Format:** "When a record in (parent table) is deleted, what should happen to related records in (child table)?"

#### 2. Type of Participation
**Two Types:**

**a) Mandatory:**
- At least one record must exist before entering related records
- Symbol: Vertical line (|)

**b) Optional:**
- No requirement for records to exist before entering related records
- Symbol: Circle (○)

**Determination Factors:**
- Obvious circumstances
- Common sense
- Conformance to standards
- Business rules

#### 3. Degree of Participation
**Format:** (minimum, maximum) numbers

**Examples:**
- (1,1): Exactly one record required
- (0,15): No minimum, maximum of 15
- (0,N): No minimum, unlimited maximum

**Determination Factors:**
- Same as type of participation
- Business policies and requirements
- Organizational standards

**Unlimited Participation:** Use "N" for maximum number

### 🔍 Verifying Table Relationships

**Checklist:**
1. Properly identified each relationship
2. Properly established each relationship
3. Foreign keys comply with Elements of a Foreign Key
4. Appropriate deletion rule for each relationship
5. Proper type of participation for each table
6. Proper degree of participation for each table

**Review Process:**
- Work with users and management
- Use checklist systematically
- Verify all relationships
- Ensure agreement on assessment

### 🛡️ Relationship-Level Integrity

**Definition:** Relationship attains integrity after proper establishment and characteristic setting

**Four Warranties:**

1. **Sound connection between tables**
   - Accomplished through primary/foreign keys or linking tables
   - Proper relationship establishment

2. **Meaningful record insertion**
   - Appropriate type of participation designation
   - Clear insertion rules

3. **Safe record deletion**
   - Appropriate deletion rule assignment
   - No adverse effects from deletion

4. **Meaningful relationship limits**
   - Appropriate degree of participation designation
   - Clear relationship boundaries

**Component of Overall Data Integrity:**
- Third component (after table-level and field-level integrity)
- Essential for complete data integrity
- Foundation for business rules establishment

## 🧠 Mind Map Structure

### Central Topic: Table Relationships
- **Why Important** → Four Critical Reasons, Key Benefits
- **Types of Relationships** → Three Main Types
  - **One-to-One** → Definition, Characteristics, Diagramming, Establishment
  - **One-to-Many** → Definition, Characteristics, Diagramming, Establishment
  - **Many-to-Many** → Definition, Problems, Solutions, Linking Tables
- **Self-Referencing** → Three Types, Establishment, Considerations
- **Identification Process** → Table Matrix, Questions, Formulas, Procedure
- **Establishment Methods** → Primary/Foreign Keys, Linking Tables
- **Foreign Key Refinement** → Three Elements, Field Specifications
- **Relationship Characteristics** → Deletion Rules, Participation Types, Degrees
- **Verification** → Checklist, Review Process
- **Relationship-Level Integrity** → Four Warranties, Data Integrity Component

## 🔑 Key Takeaways

1. **Relationships are the foundation** of relational database design and data integrity
2. **Three main relationship types** each require different establishment methods
3. **Many-to-many relationships** must be resolved using linking tables
4. **Self-referencing relationships** can be complex but follow similar patterns
5. **Table matrix method** provides systematic approach to relationship identification
6. **Foreign keys must comply** with specific elements for proper relationship establishment
7. **Relationship characteristics** ensure data integrity and proper operations
8. **Relationship-level integrity** is crucial component of overall data integrity
9. **Proper relationship establishment** enables efficient data retrieval and manipulation
10. **Verification with users** is essential for accurate relationship identification

## 🚫 Common Pitfalls to Avoid

- **Not using linking tables** for many-to-many relationships
- **Incorrect foreign key naming** that differs from parent primary key
- **Inappropriate deletion rules** that don't match business requirements
- **Missing relationship characteristics** that affect data integrity
- **Not verifying relationships** with users and management
- **Using multipart fields** in relationship establishment
- **Ignoring self-referencing relationships** when they exist
- **Not reviewing table structures** after relationship establishment
- **Incorrect participation types** that don't reflect business rules
- **Missing relationship diagrams** that document connections

## 📚 Review Questions

1. **State two major reasons** why a relationship is important
2. **Name the three types** of relationships
3. **Which relationship will pose** the most problems?
4. **State two problems** you could possibly encounter with a many-to-many relationship
5. **What is a self-referencing** relationship?
6. **How do you begin** the process of identifying relationships among tables?
7. **What are the two types** of questions you can ask to identify existing relationships?
8. **What shorthand symbol** do you use for one-to-many relationship in table matrix?
9. **How do you determine** the official relationship between table pairs in matrix?
10. **How do you establish** a one-to-many relationship?
11. **True or False:** Retrieving information from self-referencing relationships can be tedious
12. **How do you establish** a self-referencing many-to-many relationship?
13. **How do you refine** the foreign keys in the database?
14. **What two element categories** must you modify for foreign key field specifications?
15. **What is the function** of a deletion rule?
16. **What two types** of participation can you designate for a table?
17. **What does the degree** of participation indicate?
18. **When does a relationship** attain relationship-level integrity?

## 💡 Reflection

- **Why is it critical** to use linking tables for many-to-many relationships?
- **How do relationship characteristics** contribute to overall data integrity?
- **What are the risks** of not properly establishing relationships?
- **Why is verification with users** essential in relationship identification?
- **How do self-referencing relationships** differ from dual-table relationships?

## 📋 Analysis Deliverables

1. **Table Matrix** - Complete matrix showing all identified relationships
2. **Relationship Diagrams** - Visual representation of each relationship
3. **Foreign Key Specifications** - All foreign keys refined and documented
4. **Relationship Characteristics** - Deletion rules, participation types, degrees
5. **Verified Relationships** - All relationships confirmed with users and management

## 🔧 Key Techniques Learned

**Relationship Identification:**
- Using table matrix for systematic identification
- Asking associative and contextual questions
- Applying relationship formulas (1:1 + 1:1 = 1:1, etc.)
- Working with users and management

**Relationship Establishment:**
- Using primary/foreign keys for one-to-one and one-to-many
- Creating linking tables for many-to-many relationships
- Handling self-referencing relationships
- Reviewing table structures after establishment

**Foreign Key Refinement:**
- Ensuring same name as parent primary key
- Modifying field specifications for foreign keys
- Setting appropriate logical elements
- Validating values from parent primary key

**Relationship Characteristics:**
- Defining appropriate deletion rules
- Identifying participation types (Mandatory/Optional)
- Setting degree of participation (min, max)
- Documenting characteristics on relationship diagrams

**Verification Process:**
- Using systematic checklist
- Reviewing with users and management
- Ensuring relationship-level integrity
- Documenting all relationships properly

---

- Add diagrams, ERDs, or illustrations in `diagrams.md`
- Add SQL examples or commands in `examples.sql`
