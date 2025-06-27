# Chapter 6: Code Composition

## 📖 Summary

This chapter explores the principles and patterns of code composition in software architecture, focusing on how to build systems from smaller, reusable components for maintainability, testability, and scalability.

### What is Code Composition?
- **Definition:** The process of building complex systems by combining smaller, well-defined components or modules.
- **Goal:** Achieve modularity, reusability, and separation of concerns.

### Composition Patterns
- **Function Composition:** Building complex logic by combining simple functions.
- **Object Composition:** Creating objects from smaller objects or traits (favor composition over inheritance).
- **Service Composition:** Combining microservices or APIs to deliver business capabilities.
- **Pipeline Composition:** Chaining processing steps (e.g., middleware, data processing pipelines).

### Benefits of Code Composition
- **Reusability:** Components can be reused across different parts of the system.
- **Testability:** Smaller units are easier to test in isolation.
- **Maintainability:** Changes in one component have minimal impact on others.
- **Scalability:** Components can be scaled independently if needed.
- **Flexibility:** Easy to replace or upgrade individual components.

### Best Practices for Code Composition
- **Single Responsibility Principle:** Each component should do one thing well.
- **Loose Coupling:** Minimize dependencies between components.
- **Explicit Interfaces:** Define clear contracts for how components interact.
- **Dependency Injection:** Pass dependencies explicitly to improve testability and flexibility.
- **Immutability:** Favor immutable data structures for safer composition.

### Code Composition Anti-Patterns
- **God Object:** One object does too much, violating modularity.
- **Tight Coupling:** Components are overly dependent on each other.
- **Hidden Dependencies:** Dependencies are not explicit, making code hard to understand.
- **Overuse of Inheritance:** Inheritance chains make code rigid and hard to change.

### Composition in Modern Architectures
- **Functional Programming:** Emphasizes pure functions and composition.
- **Component-Based UI:** Frameworks like React use component composition for UIs.
- **Microservices:** Services are composed to build larger systems.
- **Middleware:** Web frameworks use middleware composition for request handling.

### Key Principles
1. **Favor Composition Over Inheritance:** Prefer building systems from small, composable units.
2. **Keep Components Small and Focused:** Easier to test, maintain, and reuse.
3. **Make Dependencies Explicit:** Use dependency injection and clear interfaces.
4. **Design for Change:** Components should be easy to replace or upgrade.
5. **Document Component Contracts:** Make it clear how components interact.

## Review Questions
1. What is code composition and why is it important?
2. What are the main patterns of code composition?
3. How does composition improve testability and maintainability?
4. What are the risks of tight coupling and hidden dependencies?
5. How does functional programming encourage composition?
6. What is the difference between composition and inheritance?
7. How can dependency injection improve code composition?
8. What are common anti-patterns in code composition?
9. How do modern UI frameworks use composition?
10. Why is explicit interface definition important?

## Key Concepts

### Example: Function Composition in JavaScript
```javascript
const add = x => y => x + y;
const multiply = x => y => x * y;
const addThenMultiply = (a, b, c) => multiply(c)(add(a)(b));
// addThenMultiply(2, 3, 4) => (2 + 3) * 4 = 20
```

### Example: Dependency Injection
```python
class EmailService:
    def send(self, to, subject, body):
        pass

class NotificationManager:
    def __init__(self, email_service):
        self.email_service = email_service
    def notify(self, user, message):
        self.email_service.send(user.email, "Notification", message)
```

## Pros & Cons

### Pros
- Modular and reusable code
- Easier testing and maintenance
- Flexible and adaptable systems

### Cons
- Too many small components can increase complexity
- Overhead in managing dependencies

## Real-World Applications
- **React/Vue Components:** UI built from reusable components
- **Express/Koa Middleware:** Web request pipelines
- **Microservices:** Composing business capabilities from services

## Practice Exercises

### Exercise 1: Refactor for Composition
**Task:** Refactor a class with many responsibilities into smaller, composable functions or objects.

### Exercise 2: Implement Dependency Injection
**Task:** Rewrite a tightly coupled module to use dependency injection.

## Questions & Doubts

### Questions for Clarification
1. How do you balance granularity and complexity in composition?
2. What tools help visualize component dependencies?

### Areas Needing More Research
- Advanced patterns for large-scale composition
- Automated tools for dependency management

## Summary

### Key Takeaways
1. Code composition enables modular, maintainable, and testable systems.
2. Favor composition over inheritance and keep components small.
3. Make dependencies explicit and use clear interfaces.

### Next Steps
- [ ] Review your codebase for composition opportunities.
- [ ] Practice refactoring for better composition.
- [ ] Explore frameworks that encourage composition.

---

*Notes taken on: [Date]*
*Pages covered: [Page range]*
*Index System: A → G (Main sections), A.1 → G.2 (Subsections), A.1.1 → G.2.2 (Details)*
