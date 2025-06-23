# Chapter 3: Characteristics and Benefits of a Database

## 📖 Summary

This chapter introduces and explains the essential terminology used in relational database design. Understanding these terms is crucial for grasping the concepts, following the design process, and communicating effectively about databases. The chapter organizes terms into four main categories: value-related, structure-related, relationship-related, and integrity-related. Each term is defined and discussed in detail, with examples and notes on its importance in the design process.

## 📝 Guided Notes

### Why This Terminology Is Important
- Database design has its own set of terms, many derived from set theory and logic.
- Knowing these terms helps you understand the model, the design process, and communicate with others in the field.
- Terms are used in documentation, software, books, and online resources.

### Value-Related Terms
- **Data:** The raw values stored in the database; static until modified.
- **Information:** Data processed to be meaningful and useful; dynamic and can be presented in many ways.
  - *Key axiom:* Data is what you store; information is what you retrieve.
- **Null:** Represents a missing or unknown value (not zero or blank). Useful for representing missing, unknown, or inapplicable values, but can cause issues in calculations and aggregate functions.

### Structure-Related Terms
- **Table:** The main structure in a relational database, representing a single subject (object or event). Each table has a primary key and is composed of records (rows) and fields (columns).
  - *Data table:* Stores dynamic, modifiable data.
  - *Validation table (lookup table):* Stores static data for integrity checks.
- **Field:** The smallest structure, representing a characteristic of the table's subject. Each field should store only one value and be clearly named.
  - *Multipart field:* Contains multiple distinct items.
  - *Multivalued field:* Contains multiple instances of the same type of value.
  - *Calculated field:* Stores a value derived from other fields.
- **Record:** A unique instance of the table's subject, identified by the primary key.
- **View:** A virtual table composed of fields from one or more tables. Useful for combining data, restricting access, and implementing integrity.
- **Keys:** Special fields for identifying records and establishing relationships.
  - *Primary key:* Uniquely identifies each record in a table.
  - *Foreign key:* A primary key from another table, used to establish relationships.
- **Index:** A physical structure used to optimize data processing; not part of the logical design.

### Relationship-Related Terms
- **Relationship:** An association between two tables, established via keys or a linking table.
  - *Types of relationships:*
    - One-to-one: Each record in Table A relates to one (or zero) in Table B, and vice versa.
    - One-to-many: One record in Table A relates to many in Table B; most common.
    - Many-to-many: Records in both tables relate to many in the other; resolved with a linking table.
  - *Types of participation:*
    - Mandatory: A record must exist in one table before it can exist in the other.
    - Optional: No such requirement.
  - *Degree of participation:* Minimum and maximum number of related records.

### Integrity-Related Terms
- **Field Specification (Domain):** Defines all elements of a field (general, physical, logical).
- **Data Integrity:** The validity, consistency, and accuracy of data in the database.
  - *Types of data integrity:*
    1. Table-level (entity integrity): No duplicate records; unique, non-null primary key.
    2. Field-level (domain integrity): Fields are well-defined and values are valid and consistent.
    3. Relationship-level (referential integrity): Relationships are sound and records are synchronized.
    4. Business rules: Organization-specific restrictions that affect design and integrity.

## 💡 Reflection
- Why is it important to distinguish between data and information?
- How can improper use of Null values affect your database?
- Why must every table have a primary key?
- How do business rules influence data integrity?

---

## Review Questions
1. Why is terminology important?
2. Name the four categories of terms.
3. What is the difference between data and information?
4. What does Null represent?
5. What is the major disadvantage of Null?
6. What are the chief structures in the database?
7. Name the three types of tables.
8. What is a view?
9. State the difference between a key and an index.
10. What are the three types of relationships that can exist between a pair of tables?
11. What are the three ways in which you can characterize a relationship?
12. What is a field specification?
13. What three types of elements does a field specification incorporate?
14. What is data integrity?
15. Name the four types of data integrity.

---

- Add diagrams, ERDs, or illustrations in `diagrams.md`.
- Add SQL examples or commands in `examples.sql`.

> Use this template for each chapter. Add more sections as needed for exercises, review questions, or additional resources.

## Notes

-
