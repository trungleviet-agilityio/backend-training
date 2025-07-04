# Introduction to Design Patterns

## 1. What is a Design Pattern?

Design Patterns are common solutions to frequently occurring problems in software design. They are like pre-made blueprints that you can customize to solve recurring design problems in your code.

🧱 Important Note:
Design patterns are not code snippets that can be copy-pasted like libraries or built-in functions.

They are ideas, abstract concepts, not specific source code.

You need to understand them and implement them yourself with code appropriate for your application.

## 2. How are Design Patterns Different from Algorithms?

| Attribute | Algorithm | Design Pattern |
|-----------|-----------|----------------|
| Goal | Solve a specific problem | Solve a reusable design problem |
| Specific actions? | Yes - clear step-by-step | No - describes ideas, organization methods |
| Equivalent example | Cooking recipe | Architectural blueprint |

## 3. What Does a Pattern Consist Of?

Each design pattern is typically described in great detail so it can be applied repeatedly:

🔹 **Intent** – Purpose: What is the problem? What is the solution?

🔹 **Motivation** – Motivation: Why did this pattern emerge?

🔹 **Structure** – Structure: The classes and how they interact with each other.

🔹 **Code Example** – Code example: To help with understanding.

🔹 Additionally: When to use (applicability), how to implement (implementation), and related patterns.

## 4. Classification of Design Patterns

Design patterns can be categorized by:

⚙️ **By scope of use:**
- **Idioms**: Very low level, dependent on specific programming language.
- **Architectural Patterns**: High level, used to design the architecture of entire systems (e.g., MVC, Microservices).

🧭 **By purpose (intent), there are 3 main groups:**

| Group | Main Purpose | Common Pattern Examples |
|-------|--------------|------------------------|
| Creational | Create objects flexibly and optimize reusability | Singleton, Factory, Builder, Prototype |
| Structural | Organize classes/objects into large structures that are easy to extend | Adapter, Decorator, Composite, Facade |
| Behavioral | Communication between objects, reasonable distribution of responsibilities | Observer, Strategy, Command, State |

## 5. Who Invented Design Patterns?

**Christopher Alexander** – architect, the first to introduce the concept of "pattern" in the book A Pattern Language (in urban architecture).

**Gang of Four (GOF)** – Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides:
- In 1995, they wrote the famous book "Design Patterns: Elements of Reusable Object-Oriented Software" with 23 design patterns for OOP.
- The name "Gang of Four" comes from these 4 authors.

## 6. Why Should You Learn Design Patterns?

You can program well without learning Design Patterns, but if you learn them, you will:

✅ **Improve design skills**: Know how to solve problems more effectively and flexibly.
✅ **Better reusability**: Avoid rewriting code from scratch.
✅ **Effective team communication**: You just need to say "Use Singleton" and the whole team immediately understands what you want.
✅ **Better understanding of source code**: Many frameworks, libraries, or complex systems use design patterns.

✅ **In summary:**

| What to remember | Meaning |
|------------------|---------|
| What is a design pattern? | General solution for software design problems. |
| Not specific code | But abstract models that you must implement according to context. |
| Different from algorithms | Algorithms are specific steps, patterns are organizational and design solutions. |
| 3 main types | Creational, Structural, Behavioral. |
| Why learn? | Better design, faster code understanding, more effective team communication. |

---

# Software Design Principles - Essential Guide

## Core Principles (Remember These!)

### 1. **Encapsulate What Varies**
- **What**: Separate changing parts from stable parts
- **Why**: Minimize impact of changes
- **How**: Extract methods/classes for variable behavior

### 2. **Program to Interface, Not Implementation**
- **What**: Depend on abstractions, not concrete classes
- **Why**: Flexibility and extensibility
- **How**: Use interfaces/abstract classes for dependencies

### 3. **Favor Composition Over Inheritance**
- **What**: Use "has-a" relationships instead of "is-a"
- **Why**: Avoid inheritance problems (tight coupling, interface pollution)
- **How**: Delegate behavior to other objects

## SOLID Principles (Quick Reference)

| Principle | What | Why |
|-----------|------|-----|
| **S** - Single Responsibility | One reason to change per class | Reduce complexity, easier maintenance |
| **O** - Open/Closed | Open for extension, closed for modification | Prevent breaking existing code |
| **L** - Liskov Substitution | Subclasses must be substitutable | Maintain polymorphism contracts |
| **I** - Interface Segregation | Keep interfaces focused and small | Avoid forcing clients to depend on unused methods |
| **D** - Dependency Inversion | Depend on abstractions, not concretions | Reduce coupling, increase flexibility |

## Practical Tips

### When to Apply Principles:
- **Small projects** (< 200 lines): Don't over-engineer
- **Growing projects**: Apply principles as complexity increases
- **Team projects**: Focus on communication and maintainability

### Common Patterns You'll See:
- **Singleton**: One instance globally
- **Factory**: Create objects without specifying exact classes
- **Observer**: Notify objects of state changes
- **Strategy**: Encapsulate algorithms, make them interchangeable
- **Adapter**: Make incompatible interfaces work together

### Red Flags (When You're Violating Principles):
- Classes with 500+ lines
- Methods with 20+ parameters
- Inheritance hierarchies 4+ levels deep
- Classes that change for unrelated reasons
- Hard-coded dependencies everywhere

## Quick Decision Framework

**Before writing code, ask:**
1. What might change in the future?
2. How can I make this more flexible?
3. Is this the simplest solution that works?
4. Will my team understand this easily?

**Remember**: Principles are guidelines, not laws. Be pragmatic - sometimes a simple solution is better than a "perfect" one.
