# Behavioral Design Patterns

Behavioral patterns focus on communication between objects, how objects interact, and how responsibility is distributed.

---

## 📋 Overview
Behavioral design patterns define how objects collaborate and delegate tasks, promoting loose coupling and flexible, maintainable code.

---

## 🎯 Key Characteristics
- **Communication Focus**: Define how objects interact
- **Responsibility Distribution**: Delegate tasks among objects
- **Loose Coupling**: Reduce dependencies
- **Runtime Flexibility**: Enable dynamic behavior changes

---

## 🧩 Pattern Summaries

| Pattern | Intent | Key Concept |
|---------|--------|-------------|
| **Template Method** | Define algorithm skeleton, let subclasses override steps | Inheritance-based algorithm structure |
| **Observer** | Notify multiple objects of state changes | Event subscription/notification |
| **Mediator** | Centralize complex communication | Communication hub, decoupling |
| **Command** | Encapsulate requests as objects | Request encapsulation, undo/redo |
| **Chain of Responsibility** | Pass requests along a chain of handlers | Request processing pipeline |
| **State** | Change object behavior by changing state | State-driven behavior |

---

## 🏗️ Visual Metaphor: Restaurant Kitchen
- **Template Method**: Recipe template (same steps, different ingredients)
- **Observer**: Order notification system (chef notifies when dish is ready)
- **Mediator**: Kitchen coordinator (manages communication between stations)
- **Command**: Order tickets (encapsulate cooking requests)
- **Chain of Responsibility**: Food prep pipeline (prep → cook → plate)
- **State**: Cooking states (preparing → cooking → plating → ready)

---

## 📊 Pattern Comparison

| Aspect | Template Method | Observer | Mediator | Command | Chain of Responsibility | State |
|--------|----------------|----------|----------|---------|------------------------|-------|
| **Primary Use** | Algorithm structure | Event notification | Communication hub | Request encapsulation | Request pipeline | State-driven behavior |
| **Coupling** | Inheritance | Loose | Centralized | Decoupled | Sequential | State-dependent |
| **Flexibility** | Compile-time | Runtime | Runtime | Runtime | Runtime | Runtime |
| **Complexity** | Low | Medium | Medium | Low | Medium | Medium |

---

## 🚦 When to Use Each Pattern

### Template Method
- ✅ Similar algorithms with different steps
- ✅ Want to control algorithm structure
- ❌ Need to change algorithm order at runtime

### Observer
- ✅ One-to-many event notification
- ✅ Dynamic relationships
- ❌ Performance critical (many observers)

### Mediator
- ✅ Complex object communication
- ✅ Reduce coupling
- ❌ Simple relationships

### Command
- ✅ Parameterize, queue, or undo requests
- ✅ Decouple sender/receiver
- ❌ Simple direct calls

### Chain of Responsibility
- ✅ Multiple handlers for requests
- ✅ Flexible request processing
- ❌ Need guaranteed handling

### State
- ✅ Object behavior depends on state
- ✅ Avoid large conditionals
- ❌ Simple state transitions

---

## 🛠️ Implementation Guidelines

### Template Method
- Make template method final/private to prevent override
- Use hooks for optional steps
- Keep abstract methods focused

### Observer
- Use event objects for complex notifications
- Prevent memory leaks (unsubscribe properly)
- Use weak references if possible

### Mediator
- Focus mediator on communication only
- Avoid god object anti-pattern
- Use interfaces for mediator contracts

### Command
- Keep commands immutable if possible
- Implement undo where appropriate
- Use macro-commands for complex operations

### Chain of Responsibility
- Ensure at least one handler can process each request
- Use default handlers if needed
- Be careful with chain order and performance

### State
- Keep state transitions explicit
- Use state machines for complex logic
- Avoid state explosion

---

## 🔁 Relations Between Patterns
- **Chain of Responsibility, Command, Mediator, and Observer** all connect senders and receivers in different ways:
  - **Chain of Responsibility**: Passes a request along a chain until handled.
  - **Command**: Encapsulates requests, decoupling sender and receiver.
  - **Mediator**: Centralizes communication, eliminating direct links.
  - **Observer**: Lets receivers dynamically subscribe/unsubscribe to notifications.
- **Mediator vs. Observer**:
  - Mediator centralizes logic; Observer distributes it.
  - Mediator can use Observer internally (mediator as publisher, components as subscribers).
  - If all components are publishers, you have a distributed Observer system, not a Mediator.
- **Facade vs. Mediator**:
  - Facade simplifies subsystem interface, but subsystem is unaware of facade.
  - Mediator centralizes communication; components only know the mediator.

---

## 🔧 Common Implementation Patterns

### Template Method
```typescript
abstract class AbstractClass {
  public templateMethod(): void {
    this.step1();
    this.step2();
    this.hook();
  }
  protected abstract step1(): void;
  protected abstract step2(): void;
  protected hook(): void {} // Optional
}
```

### Observer
```typescript
interface Observer {
  update(data: any): void;
}
class Subject {
  private observers: Observer[] = [];
  attach(observer: Observer): void {
    this.observers.push(observer);
  }
  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}
```

### Mediator
```typescript
interface Mediator {
  notify(sender: Colleague, event: string): void;
}
class ConcreteMediator implements Mediator {
  notify(sender: Colleague, event: string): void {
    // Handle communication between colleagues
  }
}
```

### Command
```typescript
interface Command {
  execute(): void;
  undo?(): void;
}
class Invoker {
  private history: Command[] = [];
  run(command: Command) {
    command.execute();
    this.history.push(command);
  }
  undo() {
    const cmd = this.history.pop();
    if (cmd && cmd.undo) cmd.undo();
  }
}
```

### Chain of Responsibility
```typescript
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: any): any;
}
abstract class BaseHandler implements Handler {
  private nextHandler: Handler | null = null;
  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }
  handle(request: any): any {
    if (this.nextHandler) return this.nextHandler.handle(request);
    return null;
  }
}
```

### State
```typescript
interface State {
  handle(context: Context): void;
}
class Context {
  private state: State;
  setState(state: State) { this.state = state; }
  request() { this.state.handle(this); }
}
```

---

## 📚 References
- **Design Patterns: Elements of Reusable Object-Oriented Software** (GoF)
- **Head First Design Patterns**
- **Refactoring Guru**
- **Patterns.dev**

---

## 🎯 Quick Reference Table

| Pattern | When to Use | Key Benefit |
|---------|-------------|-------------|
| Template Method | Similar algorithms with different steps | Code reuse, algorithm control |
| Observer | Event-driven communication | Loose coupling, flexibility |
| Mediator | Complex object communication | Centralized control, reduced coupling |
| Command | Request encapsulation | Decoupling, undo/redo support |
| Chain of Responsibility | Multiple handlers for requests | Flexible request processing |
| State | State-dependent behavior | Clean state management |

---

*Behavioral patterns are about communication and responsibility. Choose the pattern that best fits your system’s needs for flexibility, decoupling, and clarity.*
