# Chapter 1: The Architect's Hit List

## 📖 Summary

This chapter introduces the fundamental problem with current software development practices and presents a comprehensive "hit list" of considerations that must be addressed in software architecture.

### The Tour Operator Project Failure (2004)
- **Project Scope:** Replace legacy system with new travel booking solution
- **Complexity Factors:**
  - Large variety of travel options
  - Non-standard vendor contracts
  - Multiple packaging variants
  - Daily pricing changes based on availability, demand, seasonality
- **Process Timeline:**
  - 10 months gathering requirements
  - 3 months architecture planning
  - Initial estimate: 2 years, 30 engineers, 8-digit budget
- **Actual Result:** 8 years, 6x budget overrun, outdated upon completion
- **Root Cause:** Focused only on functional requirements, ignored operational concerns

### The Fundamental Flaw in Software Development
- **Current Practice:** Collect functional requirements and build around them
- **Problem:** Ignores non-functional concerns (maintainability, scalability, operational efficiency)
- **Result:** Systems that are "drivable but impossible to fix"
- **Pattern:** The "rewrite" cycle - repeatedly rebuilding systems without addressing fundamental issues

### Automotive Industry Comparison
- **Comprehensive Approach:** Automakers consider all aspects beyond just drivability
- **Key Considerations:**
  - Maintainability by third parties (independent mechanics, dealerships)
  - Parts interchangeability (independent body shops)
  - Assembly line efficiency (quick and inexpensive assembly)
  - Quality control (error detection and prevention)
  - Production flexibility (switching between car models)
- **Software Lesson:** We should think the same way about software architecture

### The "Rewrite" Cycle Problem
- **Pattern:** Build → Suffer → Propose Rewrite → Repeat Same Mistakes
- **Causes:**
  - Focus only on functional requirements
  - Ignore non-functional concerns
  - Don't architect the "assembly line" for efficient implementation
- **Impact:** Wastes resources, creates technical debt, slows innovation

### The Architect's Hit List (20 Items)

#### Technical Considerations
- Programming languages, their features, readability, and interoperation
- Code reuse across platforms (server vs web vs mobile)
- Early error detection (compile-time vs runtime error detection, breadth of validation)
- Readability and refactorability of code
- Approach to code composition, embracing the change

#### Human & Operational Factors
- Availability and cost of hiring the right talent; learning curve for new hires
- Enabling multiple concurrent development workstreams
- Enabling testability
- Fast-tracking development by adopting third-party frameworks

#### Data & Performance
- Datastore and general approach to data modeling
- Application-specific data model, and the blast radius from changing it
- Performance and latency in all tiers and platforms
- Scalability and redundancy
- Spiky traffic patterns, autoscaling, capacity planning

#### Reliability & Operations
- Error recovery
- Logging, telemetry, and other instrumentation
- Reducing complexity
- Hardware and human costs of the infrastructure and its maintenance

#### User Experience & Security
- User interfaces and their maintainability
- External APIs
- User identity and security

### Key Principles
1. **Architecture Must Address Non-Functional Requirements**
   - Beyond just what the system should do
   - Consider how it will be built, maintained, and operated

2. **Consider Everything Before Writing Code**
   - Have answers to all hit list items before implementation
   - Make fundamentally correct choices early

3. **Avoid the Functional-Only Trap**
   - Don't just collect functional requirements
   - Invest in architecting the "assembly line" for efficient implementation

4. **The Hit List is a Starting Point**
   - Your list might be larger
   - Reflect on it and expand as needed
   - Ensure your architecture addresses every concern

### Book's Promise
- The rest of the book provides recipes and design patterns to address the hit list
- Solutions may address multiple items or provide partial answers
- As a whole, will provide comprehensive coverage of all concerns

## Review Questions
1. What was the main problem with the tour operator project in 2004?
2. What are the five key considerations automakers address beyond drivability?
3. What is the "rewrite" cycle and why does it occur?
4. How many items are on the architect's hit list?
5. What should be considered before writing any code?
6. What are the five categories of considerations in the hit list?
7. Why is focusing only on functional requirements problematic?
8. What is the relationship between the hit list and the rest of the book?
9. How can the hit list help prevent project failures?
10. What is the author's recommendation for expanding the hit list?
