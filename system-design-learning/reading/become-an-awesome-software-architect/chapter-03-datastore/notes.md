# Chapter 3: Datastore

## 📖 Summary

This chapter addresses the fundamental question of system component dependencies through a team discussion and introduces proper datastore architecture patterns that support business logic changes rather than constraining them.

### The Team Discussion: Dependency Puzzle
- **Scenario:** Team asked to determine dependencies between three components (UI, Business Logic, Datastore)
- **Tom's Initial Answer:** UI depends on Business Logic, Business Logic depends on Datastore
- **Team's Reasoning:** "Datastore is hardest to change, so Business Logic must depend on it"
- **The Trap:** Team fell into thinking Datastore should be the most stable component
- **Correct Answer:** Both UI and Datastore must depend on Business Logic
- **Key Insight:** Business Logic is the core value-generating component; everything else serves it

### Dependency Definition
- **Component A depends on Component B** if changes to B may trigger changes to A
- **Code Expression:** Import statements, interfaces, classes, or functions from Component B
- **Correct Architecture:** Datastore imports from Business Logic, not vice versa

### The Dependency Inversion Solution

#### Incorrect Implementation (Business Logic depends on Datastore)
```typescript
// module datastore.ts
export interface UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
};
export const readUserProfile = (userId: string): UserProfile => {
    // read user from the database
};

// module business-logic.ts
import { readUserProfile, UserProfile } from './datastore';
const printUser = (userId: string): void => {
    let user: UserProfile = readUserProfile(userId);
    console.log(`user: ${user.userId} ${user.firstName}`);
};
```

#### Correct Implementation (Datastore depends on Business Logic)
```typescript
// module business-logic-defs.ts
export interface UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
};
export interface UserDataAccess {
    readUserProfile(userId: string): UserProfile;
};

// module business-logic-impl.ts
import { UserDataAccess, UserProfile } from './business-logic-defs';
const printUser = (da: UserDataAccess, userId: string): void => {
    let user: UserProfile = da.readUserProfile(userId);
    console.log(`user: ${user.userId} ${user.firstName}`);
};

// module datastore.ts
import { UserDataAccess, UserProfile } from './business-logic-defs';
export class UserDataAccessImpl implements UserDataAccess {
    readUserProfile(userId: string): UserProfile {
        // read user from the database
    }
};
```

### Data Persistence Patterns

#### CRUD (Create, Read, Update, Delete)
- **Definition:** Traditional approach maintaining current application state in datastore
- **Origin:** Days of scarce computing resources, limited disk space, slow databases
- **Example:** Shopping cart as set of records (Cart and CartItem tables)
- **Problem:** Inherent design flaw - same data structure for all operations
- **Specific Issues:**
  - Must update Cart record every time CartItem is manipulated (inefficient)
  - totalPrice should be excluded and recomputed
  - price for CartItem could be calculated automatically
  - cartItemId could be auto-generated
  - Limiting updates breaks traditional CRUD paradigm

#### CQRS (Command Query Responsibility Segregation)
- **Definition:** Two separate data models instead of one
- **Query Model:** Responsible for data retrieval (Read action from CRUD)
- **Command Model:** Manipulates data by processing commands
- **Benefits:**
  - Separate models for different operations
  - Commands accept only relevant data
  - Clearer interfaces
  - More flexible than CRUD
  - totalPrice and price available from Query Model only (calculated)
  - Different commands accept only relevant data

#### Event Store Pattern
- **Definition:** Stores all commands/events directly in database
- **Alternative Names:** Command Store, Immutable Store
- **Key Principle:** Only events are recorded, not current state
- **Operation Mode:** Append-only (immutable)
- **State Reconstruction:** Query Model rebuilds state by "replaying" events
- **Implementation:** Commands through Command Model stored directly in database

### Event Store Benefits
- **Natural Fit:** Banking (credits/debits), accounting (immutable transactions)
- **Reliability:** Complete transaction history always available
- **Flexibility:** Same events can construct different application states
- **Scalability:** Better performance, less locking, fewer transaction isolation issues
- **Storage Options:** Beyond traditional relational engines
- **Business Examples:** Banking data with credits/debits, accounting data models

### Event Store Practical Considerations
- **Event Filtering:** Query Model doesn't need entire history, only relevant events
- **Example:** Shopping cart only needs events for specific cart/user since last order
- **Multiple Views:** Same events can construct different application states
- **Use Cases:** Online users, business intelligence, accounting
- **Flexibility:** Modify model without restructuring stored data

### Performance Optimization: Snapshot Builder
- **Problem:** Query Model processing too many events affects performance
- **Example:** Bank looking at 10 years of transactions just to show balance
- **Solution:** Asynchronous Snapshot Builder creates periodic state snapshots
- **Process:**
  1. Snapshot Builder creates persistent state periodically
  2. Query Model reads latest snapshot
  3. Updates with events after snapshot creation
  4. Serves final current state to Business Logic
- **Benefits:** Query Model only processes recent events
- **Flexibility:** Multiple snapshot stores for different purposes
- **Compatibility:** Full application state in relational database enables third-party tools (reporting, analytics, ETL)

### Key Architectural Principles
1. **Business Logic is King:** Everything serves the business logic, not the other way around
2. **Dependency Inversion:** Datastore must depend on Business Logic
3. **Event Store Flexibility:** Allows model changes without data restructuring
4. **Performance Balance:** Snapshots optimize event processing
5. **Immutable Data:** Append-only approach for reliability and audit trails
6. **NoSQL Limitation:** Schema-less databases are a band-aid, not a real solution

### Pattern Selection Guidelines
- **Ditch CRUD:** In favor of CQRS for better flexibility
- **Consider Event Store:** For systems requiring audit trails and flexibility
- **Use Snapshots:** When performance becomes an issue with pure event sourcing
- **Multiple Models:** Different views for different purposes (online users, BI, accounting)
- **Snapshot Rebuilding:** Can be rebuilt anytime if data model changes

## Review Questions
1. What was the team's initial answer to the dependency puzzle and why was it wrong?
2. Why should the Datastore depend on Business Logic instead of the other way around?
3. What is the definition of dependency between components?
4. How does Dependency Inversion solve the datastore dependency problem?
5. What are the three main data persistence patterns discussed?
6. What is the fundamental problem with the CRUD approach in the shopping cart example?
7. How does CQRS solve the limitations of CRUD?
8. What is the Event Store pattern and how does it work?
9. Why is the Event Store particularly suitable for banking and accounting systems?
10. What is the purpose of the Asynchronous Snapshot Builder and when should it be used?

## Key Concepts

### Monolithic Architecture
- **Definition:**
- **Characteristics:**
- **Use Cases:**

### Microservices Architecture
- **Definition:**
- **Characteristics:**
- **Use Cases:**

### Event-Driven Architecture
- **Definition:**
- **Characteristics:**
- **Use Cases:**

### Layered Architecture
- **Definition:**
- **Characteristics:**
- **Use Cases:**

## Examples

### Architecture Comparison
```python
# Monolithic Example
class MonolithicApp:
    def handle_user_request(self):
        # Database operations
        # Business logic
        # UI rendering
        pass

# Microservices Example
class UserService:
    def handle_user_request(self):
        # Only user-related operations
        pass
```

## Pros & Cons

### Monolithic Architecture
- **Pros:**
- **Cons:**

### Microservices Architecture
- **Pros:**
- **Cons:**

### Event-Driven Architecture
- **Pros:**
- **Cons:**

## Real-World Applications

### Industry Examples
- **Netflix:** Microservices
- **Uber:** Event-driven
- **Traditional Banks:** Monolithic

## Practice Exercises

### Exercise 1: Architecture Decision
**Description:** Choose architecture for a given scenario
**Solution:**

### Exercise 2: Migration Plan
**Description:** Plan migration from monolithic to microservices
**Solution:**

## Questions & Doubts

### Questions for Clarification
1.
2.

### Areas Needing More Research
-

## Summary

### Key Takeaways
1.
2.
3.

### Next Steps
- [ ]
- [ ]

---

*Notes taken on: [Date]*
*Pages covered: [Page range]*
