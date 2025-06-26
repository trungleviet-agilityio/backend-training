# Chapter 8: Keys

## 📖 Summary

This chapter covers the crucial process of establishing keys for each table in the database. Keys are fundamental to database design as they ensure proper identification of records, establish various types of integrity, and enable table relationships. The chapter explains the four main types of keys (candidate, primary, foreign, and non-keys), the Elements of a Candidate Key, how to establish artificial candidate keys when needed, the process of selecting primary keys, and how to ensure table-level integrity. The chapter emphasizes that keys are essential for creating sound table structures and maintaining data integrity throughout the database.

## 📝 Guided Notes

### 🎯 Why Keys Are Important

**Three Critical Reasons:**

1. **Ensure precise identification of each record**
   - Table represents collection of similar objects or events
   - Each record represents unique instance of table's subject
   - Key provides means to accurately identify each instance

2. **Help establish and enforce various types of integrity**
   - Major component of table-level integrity
   - Major component of relationship-level integrity
   - Enable unique records and matching values in relationships

3. **Serve to establish table relationships**
   - Keys used to establish relationships between tables
   - Foundation for connecting related data across tables

**Key Benefits:**
- Guarantee sound table structures
- Minimize redundant data within each table
- Ensure solid relationships between tables

### 🔑 Establishing Keys for Each Table

**Four Main Types of Keys:**
1. **Candidate Keys** - Fields that uniquely identify single instance of table's subject
2. **Primary Keys** - Most important key, exclusively identifies table throughout database
3. **Foreign Keys** - Used to establish relationships (assigned in Chapter 10)
4. **Non-keys** - Fields that don't serve as any type of key

### 🔍 Candidate Keys

**Definition:**
- Field or set of fields that uniquely identifies single instance of table's subject
- Each table must have at least one candidate key
- One candidate key will be designated as primary key

**Elements of a Candidate Key:**

1. **Cannot be a multipart field**
   - Multipart fields cause problems and cannot serve as identifiers

2. **Must contain unique values**
   - Guards against duplicating records within table
   - Duplicate records are as bad as duplicate fields

3. **Cannot contain Nulls**
   - Null represents absence of value
   - Cannot identify record if value is Null

4. **Value cannot cause breach of security or privacy rules**
   - Values like passwords and Social Security numbers not suitable
   - Must protect organization's security and privacy

5. **Value is not optional in whole or in part**
   - Optional value may be null at some point
   - Violates previous element (cannot contain Nulls)
   - Especially important for composite candidate keys

6. **Comprises minimum number of fields necessary to define uniqueness**
   - Can use combination of fields as single unit
   - Each field must contribute to defining unique value
   - Use as few fields as possible
   - Overly complex keys difficult to work with and understand

7. **Values must uniquely and exclusively identify each record in table**
   - Guards against duplicate records
   - Ensures accurate reference from other tables

8. **Value must exclusively identify value of each field within given record**
   - Provides only means of identifying each field value
   - Critical for primary key selection

9. **Value can be modified only in rare or extreme cases**
   - Should never change value unless absolutely necessary
   - Arbitrary changes indicate field may not conform to other elements

**Establishing Candidate Keys:**
- Look for field or set of fields conforming to all Elements of a Candidate Key
- Can define more than one candidate key for given table
- Loading table with sample data helps identify potential candidate keys accurately

**Example: EMPLOYEES Table Analysis:**
- **EMPLOYEE ID**: Eligible - conforms to every element
- **SOCIAL SECURITY NUMBER**: Ineligible - could contain nulls, compromises privacy
- **EMPLAST NAME**: Ineligible - can contain duplicate values
- **EMPFIRST NAME and EMPLAST NAME**: Eligible - combined values supply unique identifier
- **EMPZIPCODE**: Ineligible - can contain duplicate values
- **EMPHOME PHONE**: Ineligible - can contain duplicates, subject to change

**Marking Candidate Keys:**
- Write "CK" next to field name for candidate key
- Write "CCK" for composite candidate key (two or more fields)
- Use numbers to distinguish multiple composite keys (CCK1, CCK2)

### 🤖 Artificial Candidate Keys

**When to Create:**
- Table does not contain candidate key
- Existing candidate key is weaker than artificial one would be
- Need stronger, more appropriate candidate key

**Creation Process:**
- Create new field conforming to all Elements of a Candidate Key
- Add field to table
- Field automatically conforms because created from scratch

**Example: PARTS Table:**
- No existing field qualifies as candidate key
- Create artificial candidate key called "PART NUMBER"
- Mark with "CK" in table structure

**Common Practice:**
- Create ID fields (EMPLOYEE ID, VENDOR ID, DEPARTMENT ID, CATEGORY ID)
- Always conforms to Elements of a Candidate Key
- Makes great primary key
- Easier to establish table relationships

**Review Process:**
- Review all candidate keys to ensure compliance with Elements
- Remove "CK" designator if field is not truly a candidate key
- Establish artificial candidate key if only candidate key is invalid

### 👑 Primary Keys

**Definition:**
- Most important key of all
- Exclusively identifies table throughout database structure
- Helps establish relationships with other tables
- Uniquely identifies given record within table
- Exclusively represents record throughout entire database
- Guards against duplicate records

**Selection Process:**
- Select from table's pool of available candidate keys
- Similar to presidential election - choose one from qualified candidates
- Must conform to exact same elements as candidate key

**Selection Guidelines:**

1. **Choose simple candidate key over composite candidate key**
   - Always best to use candidate key with least number of fields

2. **Choose candidate key incorporating part of table name**
   - Example: SALES INVOICE NUMBER for SALES INVOICES table
   - Makes identification clearer

3. **Choose most meaningful to organization**
   - Select key that most accurately identifies table's subject
   - Choose key most meaningful to everyone in organization

**Elements of a Primary Key:**
- Same as Elements of a Candidate Key
- Must enforce to the letter

**Critical Test: Exclusive Identification**
Before finalizing primary key selection, ensure it complies with this element:
**"Its value must exclusively identify the value of each field within a given record."**

**Testing Process:**
1. Load table with sample data
2. Select record for test purposes and note current primary key value
3. Examine value of first field and ask:
   "Does this primary key value exclusively identify the current value of <fieldname>?"
4. If "yes" - move to next field and repeat
5. If "no" - remove field from table, move to next field, repeat
6. Continue until examined every field value in record

**Field Removal Process:**
- Field value not exclusively identified by primary key indicates unnecessary field
- Remove field and reconfirm table complies with Elements of the Ideal Table
- Add field to another table if appropriate, or discard if truly unnecessary

**Example: SALES INVOICES Table:**
- INVOICE NUMBER as primary key
- Test each field value:
  - INVOICE DATE: Yes - invoice number identifies specific date
  - CUSTFIRST NAME: Yes - invoice number identifies specific customer first name
  - CUSTLAST NAME: Yes - invoice number identifies specific customer last name
  - EMPFIRST NAME: Yes - invoice number identifies specific employee first name
  - EMPLAST NAME: Yes - invoice number identifies specific employee last name
  - EMPHOME PHONE: No - invoice number indirectly identifies via employee name
  - Remove EMPHOME PHONE (unnecessary field, already in EMPLOYEES table)

**Marking Primary Keys:**
- Remove "CK" and replace with "PK"
- Use "CPK" for composite primary key (two or more fields)

**Rules for Establishing Primary Keys:**

1. **Each table must have one—and only one—primary key**
   - Only one primary key necessary per table
   - Must conform to all governing elements

2. **Each primary key within database must be unique**
   - No two tables should have same primary key
   - Exception: one-to-one relationships or subset tables
   - Each table must have unique primary key to avoid confusion

### 🔄 Alternate Keys

**Definition:**
- Remaining candidate keys after primary key selection
- Provide alternative means of uniquely identifying record within table
- Useful in RDBMS programs

**Marking:**
- Mark with "AK" (alternate key) or "CAK" (composite alternate key)
- Or remove designation and return to normal field status
- Not concerned with alternate keys for remainder of design process
- Will work with them again during RDBMS implementation

### 📝 Non-keys

**Definition:**
- Field that does not serve as candidate, primary, alternate, or foreign key
- Sole purpose: represent characteristic of table's subject
- Value determined by primary key
- No particular designation needed

### 🏗️ Table-Level Integrity

**Definition:**
- Major component of overall data integrity
- Ensures proper table structure and data quality

**Four Key Requirements:**

1. **No duplicate records in table**
   - Each record must be unique

2. **Primary key exclusively identifies each record in table**
   - Primary key provides unique identification

3. **Every primary key value is unique**
   - No duplicate primary key values allowed

4. **Primary key values are not null**
   - Primary key must always have a value

**Establishment Process:**
- Began when defined primary key for each table
- Ensured enforcement by making primary key comply with Elements
- Enhanced further in next chapter with field specifications

### 🔍 Reviewing the Initial Table Structures

**Purpose:**
- Conduct interviews with users and management
- Review work performed so far
- Fairly straightforward and relatively easy to conduct

**Five Key Tasks:**

1. **Ensure appropriate subjects represented in database**
   - Highly unlikely important subject missing at this stage
   - If missing, identify subject, transform into table, develop to same degree

2. **Make certain table names and descriptions suitable and meaningful**
   - Work with organization to clarify confusing or ambiguous items
   - Common for names and descriptions to improve during interview process

3. **Make certain field names suitable and meaningful**
   - Generates great deal of discussion, especially with existing databases
   - People accustomed to certain field names from existing systems
   - Diplomatically explain renaming for new database standards
   - Can use familiar name for display in RDBMS implementation

4. **Verify all appropriate fields assigned to each table**
   - Best opportunity to ensure all necessary characteristics in place
   - Commonly discover overlooked characteristics
   - Identify characteristics, transform into fields, add to table

5. **Complete interviews and move to next phase**
   - Establish field specifications for every field in database

## 🧠 Mind Map Structure

### Central Topic: Keys
- **Why Important** → Three Critical Reasons, Key Benefits
- **Types of Keys** → Four Main Types
  - **Candidate Keys** → 9 Elements, Establishment Process, Marking (CK/CCK)
  - **Primary Keys** → Selection Guidelines, Critical Test, Marking (PK/CPK)
  - **Alternate Keys** → Definition, Marking (AK/CAK)
  - **Non-keys** → Definition, Purpose
- **Artificial Keys** → When to Create, Creation Process, Common Practice
- **Table-Level Integrity** → Four Requirements, Establishment Process
- **Review Process** → Five Key Tasks, Interview Process

## 🔑 Key Takeaways

1. **Keys are the foundation** of database relationships and data integrity
2. **Nine Elements of a Candidate Key** must be strictly followed
3. **Primary key selection** requires testing exclusive identification of all field values
4. **Artificial candidate keys** solve structural problems when natural keys unavailable
5. **Table-level integrity** ensures proper table structure and data quality
6. **Key marking system** provides clear identification of key types
7. **Review process** validates work with users and management
8. **Exclusive identification test** helps maintain table structural integrity

## 🚫 Common Pitfalls to Avoid

- **Using multipart fields as keys** - Decompose into separate fields first
- **Using fields with null values** - Keys cannot contain nulls
- **Using sensitive data as keys** - Avoid Social Security numbers, passwords
- **Using optional fields as keys** - Keys must always have values
- **Using fields that change frequently** - Keys should be stable
- **Not testing with sample data** - Always verify with realistic data
- **Not testing exclusive identification** - Critical for primary key validation
- **Using composite keys when simple keys available** - Prefer simpler keys
- **Duplicate primary keys across tables** - Each table needs unique primary key

## 📚 Review Questions

1. **State the three reasons** why keys are important
2. **What are the four main types** of keys?
3. **What is the purpose** of a candidate key?
4. **State four items** of the Elements of a Candidate Key
5. **True or False:** A candidate key can be composed of more than one field
6. **Can a table have more than one** candidate key?
7. **What is an artificial** candidate key?
8. **What is the most important key** you assign to a table?
9. **Why is this key important?**
10. **How do you establish** a primary key?
11. **State four items** of the Elements of a Primary Key
12. **What must you do before** you finalize your selection of a primary key?
13. **What is an alternate key?**
14. **What do you ensure** by establishing table-level integrity?
15. **Why should you review** the initial table structures?

## 💡 Reflection

- **Why is it critical** to test candidate keys with sample data before designating them?
- **How does the exclusive identification test** help maintain table structural integrity?
- **What are the risks** of using Social Security numbers or other sensitive data as keys?
- **Why is it important** to have only one primary key per table?
- **How do artificial candidate keys** help solve structural problems in tables?

## 📋 Analysis Deliverables

1. **Candidate Keys** - All fields/sets of fields that uniquely identify records
2. **Primary Keys** - Selected candidate key for each table
3. **Alternate Keys** - Remaining candidate keys marked appropriately
4. **Table-Level Integrity** - Ensured through proper key establishment
5. **Reviewed Table Structures** - Validated with users and management

## 🔧 Key Techniques Learned

**Candidate Key Establishment:**
- Using Elements of a Candidate Key to evaluate fields
- Testing with sample data to verify compliance
- Creating artificial candidate keys when needed
- Marking candidate keys with CK/CCK designations

**Primary Key Selection:**
- Choosing from pool of candidate keys
- Applying selection guidelines (simple over composite, meaningful names)
- Testing exclusive identification of all field values
- Removing fields not exclusively identified by primary key

**Key Marking System:**
- CK: Candidate Key
- CCK: Composite Candidate Key
- PK: Primary Key
- CPK: Composite Primary Key
- AK: Alternate Key
- CAK: Composite Alternate Key

**Table-Level Integrity:**
- Ensuring no duplicate records
- Primary key exclusively identifies each record
- Every primary key value is unique
- Primary key values are not null

---

- Add diagrams, ERDs, or illustrations in `diagrams.md`
- Add SQL examples or commands in `examples.sql`
