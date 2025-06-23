# Chapter 7: Establishing Table Structures

## 📖 Summary

This chapter covers the process of identifying, defining, and refining the tables that will form the foundation of your database. It explains how to use the Preliminary Field List, the list of subjects, and the mission objectives to create a comprehensive Preliminary Table List, which is then refined into the Final Table List. The chapter also details how to assign fields to tables, improve field and table names, resolve structural anomalies, and establish subset tables. The goal is to ensure that each table represents a single subject, is well-defined, and is free from common design pitfalls such as multivalued fields, multipart fields, and unnecessary duplicate fields.

## 📝 Guided Notes

### Defining the Preliminary Table List

**Three Sources for Table Development**
1. **Preliminary Field List**: Review fields to identify implied subjects (let the fields "talk" to you)
2. **List of Subjects**: Merge with the first version of the Preliminary Table List, resolving duplicates and synonyms
3. **Mission Objectives**: Use the Subject-Identification Technique to find any overlooked subjects

**Why Start with the Preliminary Field List?**
- Provides unbiased viewpoint - you're letting the fields "talk" to you
- Helps identify subjects from an objective perspective
- Cross-checks previous work from interview process
- Ensures new database includes all necessary subjects
- Helps verify subjects identified during interviews

**Identifying Implied Subjects**
- Ask: "Does a certain set of fields define or describe a particular subject?"
- Move on if nothing readily comes to mind
- When you can infer a subject, enter it on Preliminary Table List
- Continue until you've scanned all fields and identified as many subjects as possible

**Using the List of Subjects**
- Create second version by merging list of subjects with first version of Preliminary Table List
- Three-step merging process:
  1. **Resolve Duplicate Items**: Cross-check each item, determine if same or different subjects
  2. **Resolve Items Representing Same Subject**: Choose best name when different names represent same subject
  3. **Combine Remaining Items**: Add remaining items from list of subjects to Preliminary Table List

**Using the Mission Objectives**
- Final opportunity to add tables to Preliminary Table List
- Use Subject-Identification Technique on each mission objective
- Cross-check identified subjects against Preliminary Table List
- Apply same techniques as previous procedure

### Defining the Final Table List

**Transformation Process**
- Refine table names using guidelines
- Add table type (data, linking, subset, validation)
- Compose clear, concise table description (definition + importance)
- At this stage, all tables are typically data tables

**Guidelines for Creating Table Names**

1. **Create unique, descriptive name meaningful to entire organization**
   - Ensures each table clearly represents different subject
   - Everyone should understand what table represents
   - Example: "Vehicle Maintenance" is good, descriptive name

2. **Create name that accurately, clearly, and unambiguously identifies subject**
   - Vague names usually indicate table represents more than one subject
   - Example: "Dates" is vague - could be appointments or booking dates
   - Avoid "Miscellaneous" - doesn't identify single subject

3. **Use minimum number of words necessary**
   - Everyone should identify table without reading description
   - Avoid minimalist approach (e.g., "TD_1")
   - Avoid overly long names (e.g., "Multiuse Vehicle Maintenance Equipment" → "Equipment")

4. **Do not use words conveying physical characteristics**
   - Avoid: file, record, table
   - Example: "Patient Record" may represent patients, doctors, and examinations

5. **Do not use acronyms and abbreviations**
   - Hard to decipher and often lead to misunderstanding
   - Example: "SC" could mean "Steering Committees," "System Configurations," or "Security Codes"

6. **Do not use proper names or restrictive words**
   - Avoid names that unduly restrict data entry
   - Example: "Southwest Region Employees" restricts to one region
   - Creates need for duplicate structures as organization grows

7. **Do not use names identifying more than one subject**
   - Contains words like "and," "or," "/", "&"
   - Examples: "Department or Branch," "Facility\Building"
   - Indicates unclear subject identification during analysis

8. **Use plural form of name**
   - Table represents collection of similar objects or events
   - Example: "Boats" not "Boat"
   - Helps differentiate table names from field names

**Guidelines for Composing Table Descriptions**

1. **Include statement that accurately defines table**
   - Anyone should easily determine table identity without confusion
   - Example: "The people and organizations from which we purchase ingredients and equipment"

2. **Include statement explaining why table is important to organization**
   - Explain why data is important, not just what needs to be stored
   - Example: "Supplier information is vital because it allows us to maintain constant supply of ingredients"

3. **Compose description that is clear and succinct**
   - Avoid restating table name
   - Don't be too brief or too verbose
   - Provide definition and importance explanation

4. **Do not include implementation-specific information**
   - Avoid how/where table is used
   - No references to specific programs or menus
   - Focus on logical design, not physical implementation

5. **Do not make description dependent on other table descriptions**
   - Each description should be self-explanatory
   - No cross-references to other tables
   - Independent from every other table description

6. **Do not use examples**
   - Well-defined description is clear and self-explanatory
   - Examples require supplemental information
   - Focus on clear, succinct definition

**Interviewing Users and Management**
- Conduct interviews with both groups together
- Get consensus on general descriptions for tables
- Compose final descriptions following guidelines
- Confer again to ensure descriptions are acceptable and understood
- Final Table List complete when everyone agrees

### Associating Fields with Each Table

**Assignment Process**
- Assign fields from Preliminary Field List to each table
- Determine which fields best represent characteristics of table's subject
- Repeat for every table on Final Table List
- If field could belong to multiple tables, assign as appropriate (refine later)

**Setup Process**
- Use sheets of paper (avoid RDBMS programs during design)
- Write table names across top of paper
- Leave space between names for lengthy field names
- Use multiple sheets if needed

**Assignment Guidelines**
- Select fields that best describe or define table's subject
- List fields underneath table name
- Move to next table and repeat process
- Continue until all tables have assigned fields

### Refining the Fields

**Improving Field Names**

**Guidelines for Creating Field Names**

1. **Create unique, descriptive name meaningful to entire organization**
   - Field name should appear only once in entire database
   - Exception: fields establishing relationships between tables
   - Make name descriptive enough to convey accurate meaning

2. **Create name that accurately, clearly, and unambiguously identifies characteristic**
   - Be specific: "Phone Number" → "Home Phone," "Work Phone," "Cell Phone"
   - Use table name as prefix for generic names: "Employee Address," "Customer Address"
   - Can abbreviate prefix: "EmpAddress," "CustAddress"

3. **Use minimum number of words necessary**
   - Avoid lengthy field names
   - Avoid single inappropriate words
   - Example: "Hired" too short, "Date That Employee Was Hired" too long, "Date Hired" appropriate

4. **Do not use acronyms and use abbreviations judiciously**
   - Acronyms hard to decipher and lead to misunderstanding
   - Use abbreviations sparingly and carefully
   - Only if they supplement or enhance field name positively

5. **Do not use words that could confuse meaning**
   - Avoid redundant words or synonyms
   - Example: "Digital Identification Code Number" → "Identification Code" or "Identification Number"

6. **Do not use names identifying more than one characteristic**
   - Contains words like "and," "or," "/", "&"
   - Examples: "Area or Location," "Phone\Fax"
   - Identify each characteristic and create new field for each

7. **Use singular form of name**
   - Field represents single characteristic
   - Plural name implies multiple values (not good)
   - Helps distinguish from table names (plural)

**Elements of the Ideal Field**

1. **Represents distinct characteristic of subject**
   - Field represents specific aspect of table's subject

2. **Contains only single value**
   - No multivalued fields (can store multiple occurrences of same value)
   - Multivalued fields cause data redundancy and usage problems

3. **Cannot be deconstructed into smaller components**
   - No multipart/composite fields (can store multiple distinct items)
   - Multipart fields cause editing, deleting, sorting problems

4. **Does not contain calculated or concatenated value**
   - Values should be mutually independent
   - Calculated fields depend on other fields for their value
   - Creates update burden when participating fields change

5. **Unique within entire database structure**
   - Only duplicate fields should establish relationships
   - Other duplicates cause redundant data and inconsistency

6. **Retains majority of properties when appearing in multiple tables**
   - Relationship fields maintain properties across tables
   - Structural component of each table

**Resolving Multipart Fields**

**Identification**
- Field value contains two or more distinct items
- Difficult to retrieve, sort, or group information
- Example: "INSTNAME" contains first name and last name
- Example: "INSTADDRESS" contains street, city, state, ZIP code

**Resolution Process**
- Ask: "What specific items does this field's value represent?"
- Transform each item into new field
- Example: "INSTNAME" → "INSTFIRST NAME" and "INSTLAST NAME"
- Example: "INSTADDRESS" → "INSTSTREET ADDRESS," "INSTCITY," "INSTSTATE," "INSTZIPCODE"

**Hidden Multipart Fields**
- Some multipart fields are hard to recognize
- Example: "INSTRUMENT ID" contains category (AMP, GUIT, MFX, SFX) and identification number
- Deconstruct to avoid parsing problems during updates

**Resolving Multivalued Fields**

**Identification**
- Field name often plural
- Value contains commas separating various occurrences
- Example: "CATEGORIES TAUGHT" contains "WP, DB, SS, WP"

**Problems with Multivalued Fields**
- Difficult to retrieve information for specific value
- Cannot sort data meaningfully
- Limited space for values
- Must make field larger when more values needed

**Incorrect Resolution Methods**

1. **Flattening into Multiple Fields**
   - Creates fields like "CATEGORY1," "CATEGORY2," "CATEGORY3"
   - Problems:
     - Retrieving information becomes tedious
     - No meaningful sorting possible
     - Structure is volatile (must add more fields)

2. **Single Value with Redundancy**
   - Duplicate instructor record for each category
   - Creates unacceptable data redundancy

**Correct Resolution Process**

1. **Remove field from table and use as basis for new table**
   - Rename field appropriately (e.g., "CATEGORY TAUGHT")

2. **Use field(s) from original table to relate tables**
   - Select fields representing subject as closely as possible
   - These fields will appear in both tables

3. **Assign appropriate name, type, and description to new table**
   - Add to Final Table List
   - Indicate table type as "Data"

**Example Resolution**
- Remove "CATEGORIES TAUGHT" from INSTRUCTORS table
- Create new "INSTRUCTOR CATEGORIES" table
- Use "INSTFIRST NAME" and "INSTLAST NAME" as connecting fields
- New table contains single "CATEGORY TAUGHT" field

**Dependent Fields**
- When field depends on multivalued field, include it in new table
- Example: "MAXIMUM LEVEL TAUGHT" depends on "CATEGORIES TAUGHT"
- Include dependent field in new table structure

### Refining the Table Structures

**Elements of the Ideal Table**

1. **Represents single subject (object or event)**
   - Cannot overemphasize this point
   - Reduces risk of data integrity problems
   - Validates analysis and interview work

2. **Has primary key**
   - Uniquely identifies each record
   - Plays key role in establishing relationships
   - Helps implement and enforce data integrity

3. **Does not contain multipart or multivalued fields**
   - Should have resolved these during field refinement
   - Review one last time to ensure complete removal

4. **Does not contain calculated fields**
   - Review structures again for overlooked calculated fields
   - Remove any found

5. **Does not contain unnecessary duplicate fields**
   - Exception: fields used to relate tables together
   - Hallmark of poorly designed table
   - Added for reference information or multiple occurrences

6. **Contains only absolute minimum amount of redundant data**
   - Relational database will never be completely free of redundant data
   - Goal: minimize redundant data as much as possible

**Redundant Data and Duplicate Fields**

**Redundant Data Definition**
- Value repeated in field due to:
  - Field's participation in relating two tables (acceptable)
  - Field or table anomaly (unacceptable)
- Acceptable redundant data: by definition, relationship fields contain redundant data
- Unacceptable redundant data: causes consistency and integrity problems

**Duplicate Field Definition**
- Field appearing in two or more tables for reasons:
  - Used to relate tables together (necessary)
  - Indicates multiple occurrences of particular type of value (unnecessary)
  - Perceived need for supplemental information (unnecessary)
- Only necessary when establishing relationships
- Unnecessary in all other cases

**Resolving Unnecessary Duplicate Fields**

**Reference Fields**
- Duplicate fields providing reference information
- Example: "MANPHONE" and "WEB SITE" in INSTRUMENTS table
- Already part of MANUFACTURERS table structure
- Remove from table to resolve unnecessary duplication
- Use views to combine data from multiple tables for reports

**Multiple Occurrence Fields**
- Duplicate fields indicating multiple occurrences of same type of value
- Example: "INSTRUMENT 1," "INSTRUMENT 2," "INSTRUMENT 3"
- Similar to flattened multivalued field
- Limit number of occurrences (e.g., only 3 instruments per student)

**Resolution Process**
1. Visualize duplicate fields as singular multivalued field
2. Apply three-step multivalued field resolution process
3. Results in revised table and new table
4. Can enter any number of occurrences for particular record

**Multiple Sets of Duplicate Fields**
- Table can contain two or more sets of duplicate fields
- Example: "INSTRUMENT 1/2/3" and "CHECKOUT DATE 1/2/3"
- Each set represents different multivalued field
- May have one-to-one association between sets
- Apply same resolution process

### Establishing Subset Tables

**When to Consider Subset Tables**
- Fields in table do not always contain values
- Many blank values in records
- Can indicate table represents more than one subject
- Users get nervous seeing many blank values

**Identifying Subset Tables**
- Table with many blank values usually represents more than one subject
- Analyze field sets to identify distinct aspects
- Example: Equipment inventory fields vs. Books inventory fields
- Both share common characteristics (ITEM NAME, ITEM DESCRIPTION, CURRENT VALUE)

**Subset Table Definition**
- Represents subordinate subject of particular data table
- Contains fields germane to subordinate subject
- Includes field(s) from data table to relate tables
- Does not contain fields common to both tables

**Creating Subset Tables**

**Steps for Creating Subset Tables**
1. Use unique fields to create new subset table
2. Add common field to relate subset table to data table
3. Compose suitable description for subset table
4. Add to Final Table List with type "Subset"

**Example: INVENTORY Table**
- Contains equipment fields: MANUFACTURER, MODEL, WARRANTY EXPIRATION DATE
- Contains book fields: PUBLISHER, AUTHOR, ISBN, CATEGORY
- Common fields: ITEM NAME, ITEM DESCRIPTION, CURRENT VALUE
- Create EQUIPMENT subset table with equipment fields + ITEM NAME
- Create BOOKS subset table with book fields + ITEM NAME

**Previously Unidentified Subset Tables**
- Tables with almost identical structures
- Only few unique fields distinguish one from another
- Example: FULL-TIME EMPLOYEES and PART-TIME EMPLOYEES
- Common fields: first name, last name, date hired, street address, city, state

**Refining Previously Unidentified Subset Tables**

**Steps for Refining**
1. Remove all common fields and use as basis for new data table
2. Identify subject new data table represents and give appropriate name
3. Ensure subset tables represent subordinate subjects of data table
4. Compose suitable description for data table and add to Final Table List

**Example Refinement**
- Remove common fields from FULL-TIME EMPLOYEES and PART-TIME EMPLOYEES
- Create new EMPLOYEES data table with common fields
- Rename subset tables appropriately
- Add EMPLOYEES to Final Table List with type "Data"

## 💡 Reflection

- Why is it important to use multiple sources (fields, subjects, mission objectives) to define tables?
- How do the guidelines for naming tables and fields help prevent confusion and errors?
- What are the risks of leaving multivalued or multipart fields unresolved?
- Why is it important to minimize redundant data and unnecessary duplicate fields?
- How do subset tables help clarify and organize your database structure?

## Review Questions

1. How do you identify and establish tables for a new database?
2. Why do you use the Preliminary Field List to help you define tables for the database?
3. What action do you take when an item on the list of subjects and a differently named item on the Preliminary Table List both represent the same subject?
4. What information does the Final Table List provide?
5. State three guidelines for creating table names.
6. State two guidelines for composing table descriptions.
7. How do you assign fields to a table on the Final Table List?
8. State three guidelines for creating field names.
9. What two problems can poorly designed fields cause?
10. What can you use to resolve field anomalies?
11. State three of the Elements of the Ideal Field.
12. Under what condition is redundant data acceptable?
13. In general terms, what three steps do you follow to resolve a multi-valued field?

---

- Add diagrams, ERDs, or illustrations in `diagrams.md`.
- Add SQL examples or commands in `examples.sql`.

> Use this template for each chapter. Add more sections as needed for exercises, review questions, or additional resources.

## Notes

### Key Techniques Learned

**Table Development Process**
- Using Preliminary Field List to identify implied subjects
- Merging lists with three-step process (resolve duplicates, resolve synonyms, combine)
- Using mission objectives for final verification
- Transforming Preliminary Table List to Final Table List

**Naming Guidelines**
- Table names: unique, descriptive, unambiguous, plural form
- Field names: unique, descriptive, unambiguous, singular form
- Avoid physical terms, acronyms, proper names, multiple subjects

**Field Refinement**
- Elements of the Ideal Field (6 characteristics)
- Resolving multipart fields (decompose into separate fields)
- Resolving multivalued fields (create new table with relationship)

**Table Refinement**
- Elements of the Ideal Table (6 characteristics)
- Resolving unnecessary duplicate fields
- Creating subset tables for subordinate subjects

### Analysis Deliverables

1. **Preliminary Table List** - Initial list of tables from three sources
2. **Final Table List** - Refined list with names, types, and descriptions
3. **Table Structures** - Tables with assigned fields
4. **Refined Fields** - Fields complying with Elements of the Ideal Field
5. **Subset Tables** - Tables for subordinate subjects

### Common Pitfalls to Avoid

- **Vague table names** - Use descriptive, unambiguous names
- **Multipart fields** - Decompose into separate fields
- **Multivalued fields** - Create new table with relationship
- **Unnecessary duplicate fields** - Remove reference fields and multiple occurrence fields
- **Poor field names** - Use specific, descriptive names
- **Multiple subjects in one table** - Create separate tables or subset tables
- **Calculated fields in tables** - Handle separately from stored fields
