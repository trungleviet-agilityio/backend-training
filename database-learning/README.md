# Database Learning Path

## 📚 Reading: Theory & Notes

<div align="left" style="background:#f9f9f9; border-left:4px solid #0074D9; padding:12px 16px; margin-bottom:16px;">
<b>Note:</b><br>
The Reading section is structured according to the classic book <b>“Database Design for Mere Mortals”</b>.<br>
You can access the book here: <a href="https://drive.google.com/file/d/1IVYpYFCDDr253MrP85kNGtVGL7a-eDak/view">Database Design for Mere Mortals (PDF)</a>.<br>
Each chapter folder in <code>reading/</code> corresponds to a topic or chapter from the book, with notes, summaries, and exercises.
</div>

All theoretical content, notes, and chapter summaries are organized in the [`reading/`](reading/) directory.

This section covers:
- **DBMS Fundamentals**: Concepts, architecture, and types of DBMS.
- **Relational Database Design**: E/R modeling, normalization, schema design.
- **SQL & Operations**: DDL, DML, advanced queries, views, triggers.
- **Administration & Tuning**: Security, optimization, and maintenance.
- **Chapter Notes**: Each chapter (e.g., keys, relationships, business rules, data integrity) has its own folder with detailed notes and examples.

**Start here if you want to build a strong theoretical foundation.**

---

## 🛠️ Practice: TV Company Database Project

All practical, hands-on work is in the [`practice/`](practice/) directory.
This is a complete, production-style database project for a TV company, including:

- **ERD & Schema:** See [`diagrams/`](practice/diagrams/) for the entity-relationship diagram.
- **SQL Scripts:** All schema, business rules, test data, and queries in [`sql/`](practice/sql/).
- **Docs:** Business rules, data dictionary, and more in [`docs/`](practice/docs/).
- **Dockerized Setup:** Start, stop, and manage the database with Docker and scripts.
- **Mock Data Generation:** Easily generate large, realistic datasets.
- **Requirement Queries:** Real-world business questions and their SQL solutions.

**Start here for hands-on experience and to apply what you've learned.**

---

### 📋 Requirement

A TV company wishes to develop a database to store data about the TV series that the company produces. The data includes information about actors who play in the series, and directors who direct the episodes of the series.

- **Actors and directors** are employed by the company.
- A **TV series** is divided into episodes.
- Each **episode** may be transmitted at several occasions (broadcasts).
- An **actor** is hired to participate in a series, but may participate in many series.
- Each episode of a series is **directed by one director**, but different episodes may be directed by different directors.

**Example Database Queries:**
- Which actors play in the series *Big Sister*?
- In which series does the actor *Bertil Bom* participate?
- Which actors participate in more than one series?
- How many times has the first episode of the series *Wild Lies* been transmitted? At what times?
- How many directors are employed by the company?
- Which director has directed the greatest number of episodes?

---

### 🛠️ Project Tasks & Design Steps

1. **Analyze Requirements**
   - Identify entities (e.g., Series, Episode, Actor, Director, Transmission)
   - Identify attributes (e.g., names, dates, roles)
   - Identify relationships (e.g., actors in series, directors of episodes)

2. **E/R Modeling**
   - Draw an Entity-Relationship (E/R) diagram for the system
   - Find attributes for each entity set
   - Determine primary keys for each entity

3. **Relational Schema & SQL**
   - Convert the E/R model to a relational schema
   - Write SQL commands to create tables, define primary/foreign keys, and constraints

4. **Database Implementation**
   - Execute SQL commands in a relational database (using Docker for easy setup)
   - Ensure all relationships and constraints are enforced

5. **Data Population**
   - Write a script (shell, JavaScript, or Python) to generate and insert at least 1000 fake records into the main tables

6. **Query Implementation**
   - Write and execute SQL queries to answer the example questions above

---

### 💡 Tips for Database Design

- **Step 1:** Identify entities, attributes, and relationships from the problem description.
- **Step 2:** Construct an E/R diagram to represent the results of step 1.
- **Step 3:** Review the E/R diagram for issues (especially many-to-many relationships) and resolve them.
- **Step 4:** Create database tables to represent the information in your E/R diagram.

---

**For full setup instructions, schema details, and hands-on practice:**
👉 **See [`practice/README.md`](practice/README.md)**

---

## 📂 Project Structure

```
database-learning/
├── reading/      # Chapter notes, theory, and learning resources
├── practice/     # TV Company Database project (Docker, SQL, docs, ERD)
└── README.md     # This file
```

---

## 📖 Key Resources

- **Book Reference:** [Database Design for Mere Mortals (PDF)](https://drive.google.com/file/d/1IVYpYFCDDr253MrP85kNGtVGL7a-eDak/view)
- **Practice Project Docs:**
  - [Practice README](practice/README.md)
  - [Data Dictionary](practice/docs/data_dictionary.md)
  - [Business Rules](practice/docs/business_rules.md)
  - [ERD Diagram](practice/diagrams/tv_company_erd.png)

---

## 📝 Next Steps

1. **Start with DBMS fundamentals in `reading/`.**
2. **Move to database design and normalization chapters.**
3. **Switch to `practice/` and set up the TV Company Database.**
4. **Experiment with queries and extend the schema as you learn.**
5. **Document your progress and insights.**

---

## 🏁 License

This project is created from Trung with love.
