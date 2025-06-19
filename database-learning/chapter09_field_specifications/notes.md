# Chapter 9: Field Specifications

## 📖 Summary

This chapter covers the crucial process of defining field specifications for each field in the database. Field specifications are the bedrock of database design and are essential for establishing field-level integrity, ensuring data consistency and validity, and creating a comprehensive data dictionary. The chapter explains the three categories of elements (General, Physical, Logical), three types of specifications (Unique, Generic, Replica), and provides detailed guidelines for creating complete and accurate field specifications through collaboration with users and management.

## 📝 Guided Notes

### 🎯 Why Field Specifications Are Important

**Core Benefits:**
- **Field-level integrity establishment** - Ensures consistent and valid data
- **Enhanced overall data integrity** - One of four components of data integrity
- **Complete data understanding** - Forces deep analysis of data nature and purpose
- **Data dictionary creation** - Comprehensive documentation of database structure
- **Implementation guidance** - Blueprint for RDBMS implementation

**Investment vs. Time:**
- Time spent on field specifications = investment in data quality
- Neglecting this process leads to 3x more time fixing problems later
- Quality of data/information directly proportional to specification completeness

### 🔧 Field-Level Integrity

**Four Key Warranties:**
1. **Clear identity and purpose** - Field purpose and parent tables properly identified
2. **Consistent definitions** - Field definitions consistent throughout database
3. **Consistent and valid values** - Data values meet established criteria
4. **Clear modification rules** - Types of modifications clearly identified

**Elements of the Ideal Field (Review):**
- Represents distinct characteristic of table subject
- Contains only single value
- Cannot be deconstructed into smaller components
- Does not contain calculated/concatenated values
- Unique within entire database structure
- Retains characteristics when used as foreign key

### 📋 Anatomy of a Field Specification

**Three Element Categories:**

#### 1. General Elements
**Purpose:** Most fundamental attributes of the field

**Elements:**
- **Field Name** - Absolute minimal words that uniquely identify field
- **Parent Table** - Table that incorporates the field
- **Specification Type** - Unique, Generic, or Replica
- **Source Specification** - For Replica specifications only
- **Shared By** - Other tables that share this field
- **Alias(es)** - Alternative names for rare circumstances
- **Description** - Complete interpretation of the field

**Field Description Guidelines:**
- Use statement that accurately identifies field and states purpose
- Write clear and succinct statement
- Refrain from restating field name
- Avoid technical jargon, acronyms, abbreviations
- Do not include implementation-specific information
- Do not make description dependent on other fields
- Do not use examples

#### 2. Physical Elements
**Purpose:** Structure of the field

**Elements:**
- **Data Type** - Nature of data stored (Alphanumeric, Numeric, DateTime)
- **Length** - Total number of characters allowed
- **Decimal Places** - Number of digits right of decimal point
- **Character Support** - Types of characters allowed

**Character Support Options:**
- Letters (including foreign language letters)
- Numbers (0-9)
- Keyboard characters (comma, dollar sign, etc.)
- Special characters (copyright, trademark, mathematical symbols)

#### 3. Logical Elements
**Purpose:** Values within the field

**Elements:**
- **Key Type** - Role within table (Non-key, Primary, Alternate, Foreign)
- **Key Structure** - Simple or composite primary key
- **Uniqueness** - Whether field values are unique
- **Null Support** - Whether field accepts Null values
- **Values Entered By** - Source of values (User or System)
- **Required Value** - Whether value entry is mandatory
- **Range of Values** - Every possible valid value
- **Edit Rule** - When and how values can be modified

**Edit Rule Options:**
1. Enter Now, Edits Allowed
2. Enter Later, Edits Allowed
3. Enter Now, Edits Not Allowed
4. Enter Later, Edits Not Allowed
5. Not Determined At This Time

### 🔄 Using Unique, Generic, and Replica Field Specifications

#### 1. Unique Specifications
**When to Use:**
- Fields appearing only once in entire database
- Fields serving as primary keys

**Characteristics:**
- Default specification type
- All elements except Source Specification can be incorporated
- Settings apply only to indicated field

#### 2. Generic Specifications
**When to Use:**
- Fields serving as templates for other fields
- Fields with same general meaning but different contexts

**Characteristics:**
- Use nonspecific field name
- Element settings as broad and general as possible
- Cannot incorporate Parent Table, Shared By, Alias(es), Source Specification

**Example:** Generic STATE field for CUSTSTATE, EMPSTATE, VENDSTATE

#### 3. Replica Specifications
**When to Use:**
- Fields based on generic fields
- Fields serving as foreign keys

**Characteristics:**
- Draw majority of element settings from existing specification
- Can incorporate additional elements not in source
- Can alter any element settings from source
- Default for foreign key fields

### 📊 Range of Values Categories

**Three Categories:**
1. **General** - Complete collection of every possible value
2. **Integrity-specific** - Values based on field's role in table relationships
3. **Business-specific** - Values generated by business requirements

**Important Notes:**
- Avoid "Other" and "Miscellaneous" values
- These indicate need for field refinement
- Focus on general range during this stage

### 🎯 Defining Field Specifications Process

**Strategy:**
1. **Define as many specifications as possible** - Use best judgment
2. **Work with participants** - Users and management
3. **Review and refine** - Complete remaining specifications
4. **Schedule multiple meetings** - Don't rush the process

**Meeting Process:**
1. **Explain elements** - Educate participants on specification components
2. **Review existing specifications** - Confirm settings are suitable and correct
3. **Work on remaining fields** - Define specifications for unfamiliar fields
4. **Refine as needed** - Make adjustments based on participant input

**Best Practices:**
- Work with representative number of people familiar with data
- Take time to be thorough
- Don't rush through this phase
- Use participants' insights for logical elements
- Mark settings on Field Specifications sheet

### 🚫 Null Values Guidelines

**Key Points:**
- Null ≠ blank
- Null represents missing or unknown value
- Don't use blanks to represent meaningful values
- Use Nulls judiciously
- Include meaningful values in Range of Values element

**Common Mistakes:**
- Using blank for "None," "Not Applicable," "No Response"
- Using blank when Null is appropriate
- Overusing Nulls

### 📋 Field Specifications Sheet

**Complete Template Includes:**
- All three element categories
- Space for detailed settings
- Examples and guidelines
- Reference for implementation

**Usage:**
- Record all element settings
- Use as blueprint for RDBMS implementation
- Serve as data dictionary
- Guide data entry and validation procedures

## 🧠 Mind Map Structure

### Central Topic: Field Specifications
- **Why Important** → Investment, Data Quality, Implementation Guide
- **Field-Level Integrity** → Four Warranties, Ideal Field Elements
- **Anatomy** → Three Element Categories
  - **General Elements** → 7 Elements (Name, Parent, Type, etc.)
  - **Physical Elements** → 4 Elements (Data Type, Length, etc.)
  - **Logical Elements** → 8 Elements (Key Type, Uniqueness, etc.)
- **Specification Types** → Three Types
  - **Unique** → Single occurrence, Primary keys
  - **Generic** → Templates, Broad settings
  - **Replica** → Based on generic, Foreign keys
- **Process** → Strategy, Meetings, Best Practices
- **Implementation** → RDBMS Guide, Data Dictionary

## 🔑 Key Takeaways

1. **Field specifications are the foundation** of database design and data integrity
2. **Three element categories** provide comprehensive field definition
3. **Three specification types** enable consistency and reuse
4. **Collaboration with users** is essential for accurate specifications
5. **Complete specifications** lead to better data quality and fewer problems
6. **Field-level integrity** is crucial for overall database integrity
7. **Specifications serve as data dictionary** for implementation
8. **Time investment** in specifications saves 3x time fixing problems later

## 📚 Review Questions

1. **Two major reasons** field specifications are important
2. **Benefits** of establishing field-level integrity
3. **Three categories** of elements in field specification
4. **Three types** of specifications
5. **Benefits** of composing proper field description
6. **What Data Type element** indicates
7. **What Character Support element** indicates
8. **Types of keys** indicated on field specification
9. **True/False:** Null represents blank value
10. **Significance** of Range of Values element
11. **Purpose** of Edit Rule
12. **When** to use generic specification
