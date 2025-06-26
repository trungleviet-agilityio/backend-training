# Chapter 3: Datastore

## 📖 Summary

This chapter addresses the fundamental question of system component dependencies and introduces proper datastore architecture patterns that support business logic changes rather than constraining them.

### The Dependency Puzzle
- **Question:** Which component depends on which in a three-component system (UI, Business Logic, Datastore)?
- **Common Misconception:** Business Logic depends on Datastore because "Datastore is hardest to change"
- **Correct Answer:** Both UI and Datastore must depend on Business Logic
- **Reasoning:** Business Logic is the core value-generating component; everything else serves it

### Dependency Definition
- **Component A depends on Component B** if changes to B may trigger changes to A
- **Code Expression:** Import statements, interfaces, classes, or functions from Component B
- **Correct Architecture:** Datastore imports from Business Logic, not vice versa

### The Dependency Inversion Solution

#### Incorrect Implementation (Business Logic depends on Datastore)
```typescript
// datastore.ts
export interface UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
};
export const readUserProfile = (userId: string): UserProfile => {
    // read user from database
};

// business-logic.ts
import { readUserProfile, UserProfile } from './datastore';
const printUser = (userId: string): void => {
    let user: UserProfile = readUserProfile(userId);
    console.log(`user: ${user.userId} ${user.firstName}`);
};
```

#### Correct Implementation (Datastore depends on Business Logic)
```typescript
// business-logic-defs.ts
export interface UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
};
export interface UserDataAccess {
    readUserProfile(userId: string): UserProfile;
};

// business-logic-impl.ts
import { UserDataAccess, UserProfile } from './business-logic-defs';
const printUser = (da: UserDataAccess, userId: string): void => {
    let user: UserProfile = da.readUserProfile(userId);
    console.log(`user: ${user.userId} ${user.firstName}`);
};

// datastore.ts
import { UserDataAccess, UserProfile } from './business-logic-defs';
export class UserDataAccessImpl implements UserDataAccess {
    readUserProfile(userId: string): UserProfile {
        // read user from database
    }
};
```

### Data Persistence Patterns

#### CRUD (Create, Read, Update, Delete)
- **Definition:** Traditional approach maintaining current application state in datastore
- **Origin:** Days of scarce computing resources, limited disk space, slow databases
- **Example:** Shopping cart as set of records (Cart and CartItem tables)
- **Problem:** Inherent design flaw - same data structure for all operations
- **Limitation:** Changes to data model break traditional CRUD paradigm

#### CQRS (Command Query Responsibility Segregation)
- **Definition:** Two separate data models instead of one
- **Query Model:** Responsible for data retrieval (Read operations)
- **Command Model:** Manipulates data by processing commands
- **Benefits:**
  - Separate models for different operations
  - Commands accept only relevant data
  - Clearer interfaces
  - More flexible than CRUD

#### Event Store Pattern
- **Definition:** Stores all commands/events directly in database
- **Alternative Names:** Command Store, Immutable Store
- **Key Principle:** Only events are recorded, not current state
- **Operation Mode:** Append-only (immutable)
- **State Reconstruction:** Query Model rebuilds state by "replaying" events

### Event Store Benefits
- **Natural Fit:** Banking (credits/debits), accounting (immutable transactions)
- **Reliability:** Complete transaction history always available
- **Flexibility:** Same events can construct different application states
- **Scalability:** Better performance, less locking, fewer transaction isolation issues
- **Storage Options:** Beyond traditional relational engines

### Performance Optimization: Snapshot Builder
- **Problem:** Query Model processing too many events affects performance
- **Solution:** Asynchronous Snapshot Builder creates periodic state snapshots
- **Process:**
  1. Snapshot Builder creates persistent state periodically
  2. Query Model reads latest snapshot
  3. Updates with events after snapshot creation
  4. Serves final current state to Business Logic
- **Benefits:** Query Model only processes recent events
- **Flexibility:** Multiple snapshot stores for different purposes

### Key Architectural Principles
1. **Business Logic is King:** Everything serves the business logic, not the other way around
2. **Dependency Inversion:** Datastore must depend on Business Logic
3. **Event Store Flexibility:** Allows model changes without data restructuring
4. **Performance Balance:** Snapshots optimize event processing
5. **Immutable Data:** Append-only approach for reliability and audit trails

### Pattern Selection Guidelines
- **Ditch CRUD:** In favor of CQRS for better flexibility
- **Consider Event Store:** For systems requiring audit trails and flexibility
- **Use Snapshots:** When performance becomes an issue with pure event sourcing
- **Multiple Models:** Different views for different purposes (online users, BI, accounting)

## Review Questions
1. Why should the Datastore depend on Business Logic instead of the other way around?
2. What is the definition of dependency between components?
3. How does Dependency Inversion solve the datastore dependency problem?
4. What are the three main data persistence patterns discussed?
5. What is the fundamental problem with the CRUD approach?
6. How does CQRS solve the limitations of CRUD?
7. What is the Event Store pattern and how does it work?
8. Why is the Event Store particularly suitable for banking and accounting systems?
9. What is the purpose of the Asynchronous Snapshot Builder?
10. How do snapshots help with performance in Event Store implementations?

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
