# Decorator Pattern

**Also known as:** Wrapper
**Category:** Structural Design Patterns
**Main Goal:** Add new behavior to objects dynamically by wrapping them, without altering their structure or using subclassing.

## Problem

You want to add new responsibilities (logging, validation, notification channels, etc.) to objects, but:
- You can't (or don't want to) modify the original class
- Inheritance leads to a combinatorial explosion of subclasses for every feature combination
- You want to add/remove features at runtime, flexibly

## Solution

Decorator Pattern lets you:
- Define a common interface for both the core object and decorators
- Create a base decorator class that wraps the core object (or another decorator)
- Each decorator adds its own behavior before/after delegating to the wrapped object
- Stack multiple decorators as needed

## Real-World Analogy

**Wearing clothes in layers:**
- Your body is the core object
- Sweater, jacket, raincoat are decorators
- You can wear any combination, in any order, and remove them as needed

## Structure

```
      +------------------+       +----------------------+
      |   Notifier       |<------|   BaseDecorator      |
      | (Interface)      |       | - wrappee: Notifier  |
      +------------------+       +----------------------+
              ^                              ^
              |                              |
      +---------------+       +----------------------------+
      | EmailNotifier |       | SMSDecorator               |
      | (Concrete)    |       | SlackDecorator             |
      +---------------+       +----------------------------+

Client --> SMSDecorator( SlackDecorator( EmailNotifier ) )
```

## Pseudocode Example: Notifier

```typescript
// Notifier interface
interface Notifier {
  send(message: string): void;
}

// Concrete component
class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

// Base decorator
class NotifierDecorator implements Notifier {
  constructor(protected wrappee: Notifier) {}
  send(message: string): void {
    this.wrappee.send(message);
  }
}

// Concrete decorators
class SMSDecorator extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`SMS: ${message}`);
  }
}
class SlackDecorator extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`Slack: ${message}`);
  }
}

// Usage
let notifier: Notifier = new EmailNotifier();
notifier = new SlackDecorator(notifier);
notifier = new SMSDecorator(notifier);
notifier.send("Hello!");
// Output:
// Email: Hello!
// Slack: Hello!
// SMS: Hello!
```

## How to Implement

1. Make sure your business domain can be represented as a primary component with multiple optional layers over it.
2. Figure out what methods are common to both the primary component and the optional layers. Create a component interface and declare those methods there.
3. Create a concrete component class and define the base behavior in it.
4. Create a base decorator class. It should have a field for storing a reference to a wrapped object. The field should be declared with the component interface type to allow linking to concrete components as well as decorators. The base decorator must delegate all work to the wrapped object.
5. Make sure all classes implement the component interface.
6. Create concrete decorators by extending them from the base decorator. A concrete decorator must execute its behavior before or after the call to the parent method (which always delegates to the wrapped object).
7. The client code must be responsible for creating decorators and composing them in the way the client needs.

## When to Use (Applicability)

| Situation | Should Use Decorator? |
|-----------|----------------------|
| Want to add responsibilities to objects at runtime | Yes |
| Can't or don't want to modify the original class | Yes |
| Want to avoid subclass explosion for every feature combination | Yes |
| Need to add/remove features flexibly | Yes |

## Pros and Cons

| Pros | Cons |
|------|------|
| Add behavior without modifying original class | Many small classes if overused |
| Combine features flexibly at runtime | Order of decorators affects result |
| Follows Open/Closed Principle | Harder to debug if many layers |
| Single Responsibility Principle | Removing a decorator in the middle is tricky |

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Adapter | Adapter changes interface, Decorator adds behavior |
| Proxy | Proxy controls access, Decorator adds features |
| Composite | Composite organizes tree, Decorator only wraps one object |
| Chain of Responsibility | Chain can stop request, Decorator always passes through |
| Strategy | Strategy changes logic, Decorator changes outer behavior |

## Quick Summary

**Goal:** Add new behavior to objects dynamically, without subclassing or modifying the original class.

**Core:** Common interface → Base decorator wraps component → Concrete decorators add features → Client stacks decorators as needed.

**Real applications:** Notification systems, Java I/O streams, UI components, logging, validation, security wrappers.

**Reference:** [Decorator Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/decorator)
