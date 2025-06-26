# Chapter 1: The Relational Database

## 📖 Summary

This chapter introduces the fundamental concepts of databases, with a special focus on the relational database model. It begins by defining what a database is - an organized collection of data used for modeling organizations or processes.

### Types of Databases
- **Operational Databases (OLTP)**
  - Used for daily operations
  - Dynamic data that changes frequently
  - Examples: Retail stores, hospitals, manufacturing
  - Primary use: Online transaction processing

- **Analytical Databases (OLAP)**
  - Used for analysis and historical data
  - Static data that rarely changes
  - Examples: Chemical labs, marketing analysis
  - Primary use: Online analytical processing

### The Relational Database Model
- **History & Origin**
  - Conceived by Dr. Edgar F. Codd in 1969
  - Published in 1970: "A Relational Model of Data for Large Shared Databanks"
  - Based on mathematical foundations: set theory and first-order predicate logic

- **Key Components**
  - Relations (Tables)
  - Tuples (Records/Rows)
  - Attributes (Fields/Columns)
  - Relationships between tables

- **Relationship Types**
  - One-to-One
  - One-to-Many
  - Many-to-Many

### Data Retrieval: SQL
- Standard language for relational databases
- Basic components:
  - SELECT...FROM statement
  - WHERE clause
  - ORDER BY clause
- Can be used directly or through query builders

### Advantages of Relational Databases
1. **Built-in Multilevel Integrity**
   - Field level
   - Table level
   - Relationship level
   - Business level

2. **Data Independence**
   - Logical independence
   - Physical independence

3. **Data Consistency & Accuracy**
   - Enforced through integrity rules
   - Reduced redundancy

4. **Flexible Data Retrieval**
   - Access from single or multiple tables
   - Complex query capabilities

### Relational Database Management Systems (RDBMS)
- Software for creating and managing relational databases
- Examples:
  - IBM DB2
  - Microsoft SQL Server
  - MySQL
  - Oracle
  - PostgreSQL
  - SQLite

### Evolution and Future
- 50+ years of development
- Continues to dominate the database market
- Adapts to modern needs while maintaining core principles
- Coexists with newer database types (NoSQL) for specific use cases

## Review Questions
1. What are the two main types of databases in use today?
2. What type of data does an analytical database store?
3. True or False: An operational database is used primarily in OLTP scenarios.
4. Name one of the branches of mathematics on which the relational model is based.
5. How does a relational database store data?
6. Name the three types of relationships in a relational database.
7. How do you retrieve data in a relational database?
8. State two advantages of a relational database.
9. What is a relational database management system?
10. True or False: Mobile devices are limited to gigabytes of storage.
11. State why database software companies have had a hard time implementing the relational database.
