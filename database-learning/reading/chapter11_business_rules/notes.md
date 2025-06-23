# Chapter 11: Business Rules

## 📖 Summary

This chapter introduces business rules as the final component of overall data integrity in database design. Business rules are constraints based on how an organization perceives and uses its data, derived from the way it functions or conducts business. The chapter explains the two major types of business rules (database-oriented and application-oriented), their categories (field-specific and relationship-specific), and the process for defining and establishing them. It also covers the use of validation tables to enforce business rules, the structure and use of Business Rule Specifications sheets, and the importance of reviewing and maintaining business rules as the organization evolves.

## 📝 Guided Notes

### 🎯 What Are Business Rules?

- **Definition:** A business rule is a statement that imposes a constraint on a specific aspect of the database, such as a field specification or relationship characteristic.
- **Basis:** Business rules are based on how the organization functions and uses its data.
- **Purpose:** Guide choices in database design, influence data collection, relationships, information output, and data security.
- **Example:** "A SHIP DATE cannot be prior to an ORDER DATE for any given order."

### 🏷️ Types of Business Rules

1. **Database-Oriented Business Rules**
   - Constraints that can be established within the logical design of the database.
   - Implemented by modifying field specifications or relationship characteristics.
   - Example: Limiting VENDSTATE values to specific states.

2. **Application-Oriented Business Rules**
   - Constraints that cannot be established in the logical design; must be implemented in the physical design or application code.
   - Example: "A customer with a 'Preferred' status receives a 15% discount on all purchases."

> **Note:** The book focuses on database-oriented business rules for this stage of design.

### 🗂️ Categories of Business Rules

1. **Field-Specific Business Rules**
   - Impose constraints on elements of a field specification for a particular field.
   - May affect one or multiple elements (e.g., Data Type, Length, Range of Values).
   - Example: "Order dates cannot be earlier than May 16, 2018."

2. **Relationship-Specific Business Rules**
   - Impose constraints on the characteristics of a relationship (e.g., degree/type of participation).
   - Example: "Each class must have a minimum of five students, but cannot have more than 20."

### 🛠️ Defining and Establishing Business Rules

#### Field-Specific Business Rules
1. Select a table.
2. Review each field for necessary constraints.
3. Define the business rule(s) for the field.
4. Establish the rule by modifying field specification elements.
5. Determine what actions test the rule (insert, update, delete).
6. Record the rule on a Business Rule Specifications sheet.

#### Relationship-Specific Business Rules
1. Select a relationship.
2. Review the relationship for necessary constraints.
3. Define the business rule(s) for the relationship.
4. Establish the rule by modifying relationship characteristics.
5. Determine what actions test the rule.
6. Record the rule on a Business Rule Specifications sheet.

> **Tip:** Work with users and management to ensure rules are meaningful and necessary.

### 📝 Business Rule Specifications Sheet
- **Statement:** Clear, succinct text of the business rule.
- **Constraint:** Brief explanation of how the constraint applies.
- **Type:** Database-oriented or application-oriented.
- **Category:** Field-specific or relationship-specific.
- **Test On:** Actions that test the rule (insert, update, delete).
- **Structures Affected:** Fields or tables affected.
- **Field Elements Affected:** For field-specific rules, which elements are affected.
- **Relationship Characteristics Affected:** For relationship-specific rules, which characteristics are affected.
- **Action Taken:** Modifications made, with date and author.

### 🗃️ Validation Tables
- **Definition:** Tables (lookup tables) that store valid values for a field to enforce data integrity.
- **Structure:** Usually two fields (primary key and value).
- **Usage:** Used when a business rule limits a field's range of values.
- **Process:**
  1. Define a relationship between the parent table and the validation table.
  2. Modify the Range of Values element in the field specification to reference the validation table.
- **Example:** SUPPLIERS table draws valid state values from a STATES validation table.

### 🔄 Reviewing and Maintaining Business Rules
- Review all Business Rule Specifications sheets for accuracy and completeness.
- Modify, add, or remove rules as the organization evolves.
- Business rules are ongoing and may require updates over time.

## 🧠 Mind Map Structure

### Central Topic: Business Rules
- **Definition & Purpose** → Constraints, Data Integrity, Organizational Context
- **Types** → Database-Oriented, Application-Oriented
- **Categories** → Field-Specific, Relationship-Specific
- **Defining Process** → Steps for Field/Relationship Rules, User Involvement
- **Business Rule Specifications Sheet** → Documentation, Elements
- **Validation Tables** → Definition, Usage, Structure, Enforcement
- **Review & Maintenance** → Ongoing Process, Adaptation

## 🔑 Key Takeaways

1. **Business rules are essential** for enforcing organizational data integrity.
2. **Two main types:** database-oriented (enforced in logical design) and application-oriented (enforced in code/app).
3. **Categories:** field-specific (affect field specs) and relationship-specific (affect relationship characteristics).
4. **Validation tables** are powerful tools for enforcing field value constraints.
5. **Business Rule Specifications sheets** provide a standard, clear way to document and maintain rules.
6. **Review and update rules** as the organization and its needs change.

## 🚫 Common Pitfalls to Avoid

- Not distinguishing between database- and application-oriented rules.
- Failing to document business rules clearly and completely.
- Overlooking the need for validation tables for large sets of valid values.
- Not involving users/management in rule definition.
- Neglecting to review and update business rules as requirements change.

## 📚 Review Questions

1. What is a business rule?
2. Name the two major types of business rules.
3. Can you establish application-oriented business rules within the logical design of the database?
4. What are the two categories of database-oriented business rules?
5. What is a field-specific business rule?
6. When is a business rule tested?
7. How do you document a business rule?
8. State two advantages a Business Rule Specifications sheet provides.
9. What is the purpose of the Action Taken section of a Business Rule Specifications sheet?
10. What is the purpose of a validation table?
11. What is the typical structure of a validation table?
12. What is the association between a business rule and a validation table?
13. Why should you review all of your completed Business Rule Specifications sheets?

## 💡 Reflection

- Why is it important to distinguish between database- and application-oriented business rules?
- How do validation tables contribute to data integrity?
- What are the risks of not documenting business rules?
- How can business rules evolve as an organization changes?

## 📋 Analysis Deliverables

1. **Business Rule Specifications Sheets** - For all field- and relationship-specific rules.
2. **Validation Table Structures** - For fields with constrained value sets.
3. **Updated Relationship Diagrams** - Reflecting business rule constraints.
4. **Review Checklist** - Ensuring all rules are established and documented.

## 🔧 Key Techniques Learned

- Identifying and classifying business rules.
- Working with users/management to define rules.
- Modifying field specs and relationship characteristics to enforce rules.
- Using validation tables for value constraints.
- Documenting rules with Business Rule Specifications sheets.
- Reviewing and maintaining business rules as a living process.

---

- Add diagrams, ERDs, or illustrations in `diagrams.md`
- Add SQL examples or commands in `examples.sql`

## Notes

-
