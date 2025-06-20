# Chapter 12: Views

## 📖 Summary

This chapter introduces views as virtual tables that provide flexible ways to access and present data from one or more base tables. Views are essential tools in database design that enable working with data from multiple tables simultaneously, provide current information, customize data presentation, enforce data integrity, and enhance security. The chapter covers three main types of views (data, aggregate, and validation), their anatomy and characteristics, the process of determining and defining views, using calculated fields and filters, and documenting views with View Specifications sheets.

## 📝 Guided Notes

### 🎯 What Are Views?

**Definition:**
- A view is a virtual table composed of fields from one or more tables in the database
- Can also include fields from other views
- Tables that comprise a view are known as base tables
- Views are "virtual" because they draw data from base tables rather than storing data

**Key Characteristics:**
- Only structure is stored in database; RDBMS rebuilds and repopulates view each time accessed
- Many RDBMS programs refer to views as "saved queries"
- Some vendors support indexed/materialized views that do store data

**Why Views Are Valuable:**

1. **Work with data from multiple tables simultaneously**
   - Leverage relationships established during design process
   - Resolve many-to-many relationships via linking tables

2. **Reflect most current information**
   - RDBMS rebuilds view each time accessed
   - Always shows latest changes to base table data

3. **Customize to specific needs**
   - Build views for particular reports or requirements
   - Suit needs of individuals or departments

4. **Help enforce data integrity**
   - Define validation views similar to validation tables
   - Provide valid range of values for fields

5. **Security and confidentiality**
   - Control what data is available to specific users
   - Restrict access to select fields from base tables

### 🔍 Anatomy of a View

**Three Types of Views:**

#### 1. Data View
**Purpose:** Examine and manipulate data from single or multiple base tables

**Single-Table Data View:**
- Usually uses selected fields (not all fields from base table)
- Example: EMPLOYEE PHONE LIST view with EMPLOYEE ID, EMPFIRST NAME, EMPLAST NAME, EMPPHONE NUMBER
- Can modify data; changes flow through to base table
- Field specifications and business rules determine modification capabilities

**Multitable Data View:**
- Uses two or more related tables
- Tables must bear relationship to each other
- Example: CLASS ROSTER view showing class names and student names
- Redundant data is acceptable (not physically stored)
- Cannot modify primary key values
- No primary key of its own (not a true table)

#### 2. Aggregate View
**Purpose:** Display information produced by aggregating data in specific manner

**Characteristics:**
- Uses aggregate functions: Sum, Average, Minimum, Maximum, Count
- Includes calculated fields with aggregate functions
- Data fields become grouping fields
- Cannot modify any data (all fields are grouping or calculated)
- Useful for reports and statistical information

**Example:** CLASS REGISTRATION view with TOTAL STUDENTS REGISTERED calculated field

#### 3. Validation View
**Purpose:** Help implement data integrity (similar to validation tables)

**Characteristics:**
- Can enforce business rules limiting field range of values
- Draws data from base tables (unlike validation tables that store data)
- Usually uses single base table with 2-3 fields
- Structure similar to validation tables

**Example:** APPROVED SUBCONTRACTORS view restricting access to specific fields

### 🛠️ Determining and Defining Views

**Working with Users and Management:**

**Review Process:**
1. Review notes from entire design process
2. Review data entry, report, and presentation samples
3. Examine tables and subjects they represent
4. Analyze table relationships
5. Study business rules

**Key Considerations:**
- Focus on report requirements (organizations spend much time on reports)
- Look for multitable views based on relationships
- Consider validation views for business rules
- Identify security/confidentiality needs

**Defining Views Process:**

1. **Select appropriate base tables and fields**
   - Review relationship diagrams
   - Identify required fields for view purpose
   - Ensure tables are related for multitable views

2. **Create view diagram**
   - Show base tables and selected fields
   - Use view symbol (different from table symbol)
   - No primary key indicators in view symbol

3. **Add calculated fields where appropriate**
   - Use concatenation, expressions, or aggregate functions
   - Provide pertinent and meaningful information
   - Enhance data presentation

**Using Calculated Fields:**

**Types of Calculated Fields:**
- **Concatenation:** Combine field values (e.g., "Hernandez, Michael")
- **Expressions:** Mathematical or logical operations
- **Aggregate Functions:** Sum, Average, Count, Min, Max

**Examples:**
- `Max(Order Date)` for last purchase date
- `CustLast Name & ", " & CustFirst Name` for full name
- `Count(StudentID)` for student count per class

**Imposing Criteria to Filter Data:**

**Purpose:** Display specific subset of records

**Criteria Examples:**
- `CustState = "WA"` (Washington customers only)
- `CustCity In ("Bellevue", "Olympia", "Redmond", "Seattle", "Spokane", "Tacoma")`

**Important Notes:**
- Field being tested must be included in view structure
- Use minimum criteria needed for desired results
- Consider city name conflicts across states

### 📋 View Specifications Sheet

**Purpose:** Document view characteristics and specifications

**Components:**

1. **Name:** View name (follow table naming guidelines, can identify multiple subjects)

2. **Type:** Data, Aggregate, or Validation view

3. **Base Tables:** Names of tables used to build view

4. **Calculated Field Expressions:**
   - Record expressions for calculated fields
   - Use familiar syntax (modify for RDBMS later)
   - Follow field naming guidelines

5. **Filters:**
   - Field being tested and expression used
   - Criteria for filtering records

**Documentation Requirements:**
- Complete View Specifications sheet for each view
- Attach to view diagram
- Both items serve as complete documentation

### 🔍 Reviewing View Documentation

**Quality Check Points:**

1. **Proper View Definition:**
   - Correct view type for required information
   - Appropriate base tables used
   - All necessary fields included
   - Only necessary fields included

2. **Suitable Calculated Fields:**
   - Provide pertinent and meaningful information
   - Enhance data display manner
   - Serve view's purpose effectively

3. **Effective Filters:**
   - Filter needed for this view?
   - Exact records to display identified?
   - Filter will work correctly?

4. **Complete Documentation:**
   - View diagram and View Specifications sheet for each view
   - Documentation useful for RDBMS implementation

## 🧠 Mind Map Structure

### Central Topic: Views
- **Definition & Purpose** → Virtual Tables, Data Access, Flexibility
- **Types of Views** → Data Views, Aggregate Views, Validation Views
  - **Data Views** → Single-Table, Multitable, Data Manipulation
  - **Aggregate Views** → Aggregate Functions, Grouping Fields, Statistical Information
  - **Validation Views** → Data Integrity, Business Rules, Field Constraints
- **Determining Views** → User Requirements, Report Analysis, Relationship Analysis
- **Defining Views** → Base Tables, Fields, View Diagrams
- **Calculated Fields** → Concatenation, Expressions, Aggregate Functions
- **Filters & Criteria** → Data Filtering, Record Selection, Criteria Expressions
- **Documentation** → View Specifications Sheet, View Diagrams, Implementation Guide

## 🔑 Key Takeaways

1. **Views are virtual tables** that provide flexible data access without storing data
2. **Three main types:** data views (examine/manipulate), aggregate views (statistical), validation views (integrity)
3. **Views reflect current data** as RDBMS rebuilds them each time accessed
4. **Multitable views require relationships** between base tables for valid, meaningful information
5. **Calculated fields enhance views** with concatenation, expressions, and aggregate functions
6. **Filters control data display** by applying criteria to specific fields
7. **Complete documentation** requires both view diagrams and View Specifications sheets
8. **Views support security** by restricting access to specific fields or data subsets

## 🚫 Common Pitfalls to Avoid

- Creating views without relationships between base tables
- Including unnecessary fields in view structure
- Not documenting calculated field expressions clearly
- Applying filters to fields not included in view structure
- Forgetting that aggregate views cannot be modified
- Not considering security implications of view access
- Failing to review view documentation for completeness
- Not testing filters with realistic data scenarios

## 📚 Review Questions

1. Why can you refer to a view as a virtual table?
2. State two reasons why views are valuable.
3. Name the types of views you can define as you design the logical structure of the database.
4. What does your RDBMS do each time you access a data view (or any type of view, for that matter)?
5. What determines the type of modifications you can make to a view's data?
6. What is the only requirement you must fulfill to define a multitable data view?
7. Why doesn't a data view contain its own primary key?
8. What is the purpose of an aggregate view?
9. What are the most common aggregate functions that you can apply to a set of data?
10. What is a grouping field?
11. True or False: You can modify the data in an aggregate view.
12. What is the difference between a validation table and a validation view?
13. Name two points you would consider when identifying view requirements.
14. When should you use calculated fields?
15. How do you define a view that displays only science-fiction books?
16. Why must you complete a View Specifications sheet for every view in the database?

## 💡 Reflection

- How do views contribute to data security and access control?
- What are the advantages of using views over direct table access?
- How can calculated fields enhance the usefulness of views?
- Why is it important to document view specifications thoroughly?

## 📋 Analysis Deliverables

1. **View Diagrams** - Visual representation of each view structure
2. **View Specifications Sheets** - Complete documentation for each view
3. **Calculated Field Documentation** - Expressions and purposes for calculated fields
4. **Filter Criteria Documentation** - Criteria used for data filtering
5. **Review Checklist** - Ensuring all views are properly defined and documented

## 🔧 Key Techniques Learned

- Identifying appropriate view requirements through user collaboration
- Selecting base tables and fields for view construction
- Creating calculated fields with appropriate expressions
- Applying filters to control data display
- Documenting views with diagrams and specifications sheets
- Reviewing view quality and completeness
- Understanding view types and their specific purposes
- Implementing validation views for data integrity

---

- Add diagrams, ERDs, or illustrations in `diagrams.md`
- Add SQL examples or commands in `examples.sql`
