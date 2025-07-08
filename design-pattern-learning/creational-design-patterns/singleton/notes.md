# Singleton Pattern

**Also known as:** Single Instance
**Category:** Creational Design Patterns
**Main Goal:** Ensure a class has only one instance and provide a global access point to that instance.

## Problem

Singleton solves two main problems:

### 1. Ensure Only One Instance Exists
When you want to control access to shared resources, such as:
- Database connections
- Configuration managers
- Logging services

You don't want to create new objects every time you use them, as this would:
- Waste resources
- Cause errors due to inconsistent state

### 2. Provide Safe Global Access Point
Instead of using global variables—which can be overwritten at any time—Singleton allows:
- Access from anywhere in the application
- Protection of the instance from being overwritten

## Solution

The Singleton pattern implements two key steps:

1. **Hide the constructor** (make it private or protected) → Cannot create instances with `new`
2. **Provide a static method** (e.g., `getInstance()`) to create or return the existing instance

## Real-World Analogy

**Government of a country**: There's only one government representing the entire nation.

**Logger**: You don't want each module to have its own logger with different configurations → you need just one unique logger.

## Structure

```
      +------------------------+
      |      Singleton         |
      |------------------------|
      | - instance: Singleton  |
      | - constructor()        |
      | + getInstance()        |
      | + businessMethod()     |
      +------------------------+
                 ^
                 |
      +----------+----------+
      |                     |
+----------------+   +----------------+
|     Client     |   |     Client     |
+----------------+   +----------------+
```

## Pseudocode Example

```typescript
class Database {
  private static instance: Database;

  // Private constructor to prevent direct instantiation
  private constructor() {
    console.log("Connecting to the database...");
    // Initialize DB connection
  }

  // Global access point
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string): void {
    console.log(`Running query: ${sql}`);
  }
}

// Client code
const db1 = Database.getInstance();
db1.query("SELECT * FROM users");

const db2 = Database.getInstance();
db2.query("SELECT * FROM products");

console.log(db1 === db2); // ✅ true: same instance
```

## How to Implement

1. **Add a private static field** to the class to store the singleton instance
   ```typescript
   private static instance: ClassName;
   ```

2. **Make the constructor private** to prevent direct instantiation
   ```typescript
   private constructor() { }
   ```

3. **Add a static method** `getInstance()` that:
   - Creates a new instance if one doesn't exist
   - Returns the existing instance if it does
   ```typescript
   public static getInstance(): ClassName {
     if (!ClassName.instance) {
       ClassName.instance = new ClassName();
     }
     return ClassName.instance;
   }
   ```

4. **Replace all `new Class()` calls** with `Class.getInstance()`

## When to Use (Applicability)

| Situation | Should Use Singleton? |
|-----------|----------------------|
| Need exactly one instance of a class | Yes |
| Need shared state but still encapsulated | Yes |
| Want to replace global variables with safer alternative | Yes |
| Need lazy initialization of expensive resources | Yes |
| Want to control access to shared resources | Yes |

## Pros and Cons

| Pros | Cons |
|------|------|
| Ensures only one instance exists | Violates Single Responsibility Principle |
| Provides controlled global access | Makes unit testing difficult |
| Lazy initialization | Can cause tight coupling across the application |
| Thread-safe (with proper implementation) | Complex thread-safety implementation |
| Saves memory and resources | Can become a "God Object" if overused |

## Thread Safety Considerations

For multi-threaded environments (like Node.js with clusters or workers), you may need to implement locks/mutexes. Since TypeScript doesn't natively support threads, this is typically not needed in single-threaded environments.

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Facade | Can use Singleton to expose a single facade instance |
| Flyweight | Similar to Singleton in sharing instances, but Flyweight is for multiple intrinsic states |
| Abstract Factory / Builder / Prototype | These factory classes can also be implemented as Singletons |
| Global State | Singleton is a safer alternative to global variables |

## Anti-Patterns to Avoid

- **God Object**: Singleton containing too many responsibilities
- **Hidden Dependencies**: Code implicitly depending on Singleton without clear declaration
- **Overuse**: Using Singleton everywhere instead of proper dependency injection

## Best Practices

- Use only when you truly need one and only one instance
- Be careful with multi-threaded environments
- Don't combine Singleton with excessive state mutation → prefer immutability
- Ensure code is testable, use techniques like Dependency Injection if you need to override the instance in tests
- Consider alternatives like Dependency Injection containers

## Quick Summary

**Goal**: Ensure a class has only one instance and provide global access to it.

**Core**: Private constructor + Static `getInstance()` method + Private static instance field.

**Real applications**: Database connections, logging services, configuration managers, cache managers.

**Reference:** [Singleton Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/singleton)
