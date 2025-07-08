# 🏛️ Design Principles Underlying Design Patterns

## Introduction
These six core design principles form the foundation of robust, flexible, and maintainable object-oriented systems. They guide the creation and use of design patterns, helping you write code that is easy to extend, test, and reason about. Mastering these principles will make your software more resilient to change and easier to evolve.

---

## 1. Open/Closed Principle (OCP)
**Definition:** Software entities should be **open for extension** but **closed for modification**.
- **Motivation:** Prevent breaking stable code when adding new features.
- **Guideline:** Add new behavior by extending existing code (e.g., via inheritance or interfaces), not by changing it.
- **Benefit:** Enables safe, incremental evolution of your system.

---

## 2. Liskov Substitution Principle (LSP)
**Definition:** Subtypes must be substitutable for their base types—objects of a base class should be replaceable with objects of a derived class without affecting correctness.
- **Motivation:** Ensure reliable polymorphism and proper use of inheritance.
- **Guideline:** Subclasses should extend, not break, the behavior of their base classes.
- **Benefit:** Promotes predictable, correct, and maintainable code.

---

## 3. Dependency Inversion Principle (DIP)
**Definition:** High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces or abstract classes).
- **Motivation:** Reduce coupling and make systems flexible to change.
- **Guideline:** Depend on abstractions, not concretions. Reference interfaces, not concrete classes.
- **Benefit:** Makes it easy to swap implementations and adapt to new requirements.

---

## 4. Composing Objects Principle (Favor Composition Over Inheritance)
**Definition:** Achieve code reuse and flexibility by composing objects (aggregation, delegation) rather than inheriting from classes.
- **Motivation:** Avoid the rigidity and fragility of deep inheritance hierarchies.
- **Guideline:** Build complex behavior by combining simple, interchangeable components.
- **Benefit:** Increases flexibility and enables dynamic behavior changes at runtime.

---

## 5. Interface Segregation Principle (ISP)
**Definition:** A class should not be forced to depend on methods it does not use. Split large interfaces into smaller, focused ones.
- **Motivation:** Prevent unnecessary dependencies and "dummy" implementations.
- **Guideline:** Design interfaces that are specific to client needs; keep them cohesive and relevant.
- **Benefit:** Leads to cleaner, more maintainable, and decoupled code.

---

## 6. Principle of Least Knowledge (Law of Demeter)
**Definition:** Classes should know about and interact with as few other classes as possible—only their immediate "friends".
- **Motivation:** Reduce coupling and prevent cascading changes.
- **Guideline:** A method should only call methods of itself, its parameters, locally instantiated objects, or its instance variables. Avoid chained calls and "reaching through" objects.
- **Benefit:** Makes code more robust, stable, and easier to maintain.

---

> **Summary:** These principles are the backbone of good object-oriented design and the effective use of design patterns. They help you build systems that are extensible, reliable, and easy to understand—qualities essential for modern software development.
