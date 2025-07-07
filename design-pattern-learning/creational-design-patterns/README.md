# Creational Design Patterns

Creational patterns provide various object creation mechanisms, increasing flexibility and reusability of existing code. Here's an overview of the 5 fundamental creational patterns:

---

## 🔒 1. Singleton – "Ensure only one instance exists"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Ensure a class has only one instance and provide global access to it |
| 🧱 Structure| Private constructor, static instance, public getter method |
| 👤 Client   | Always gets the same instance via getInstance() |
| 💡 Summary  | One instance, global access, controlled creation |
| 🧵 Compare  | Unlike other patterns, Singleton restricts creation rather than enabling it |

**Use case:** Database connection, logging service, configuration manager – where you need exactly one instance across the entire application.

---

## 🧬 2. Prototype – "Clone existing objects"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Create new objects by cloning an existing instance |
| 🧱 Structure| Prototype interface with clone() method, concrete prototypes |
| 👤 Client   | Creates new objects by cloning, not by calling constructors |
| 💡 Summary  | Avoid expensive object creation by copying existing ones |
| 🧵 Compare  | Unlike Factory, Prototype copies existing objects rather than creating new ones |

**Use case:** Game objects (enemies, weapons), document templates, complex objects that are expensive to create from scratch.

---

## 🏭 3. Factory Method – "Defer instantiation to subclasses"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Define an interface for creating objects, let subclasses decide which class to instantiate |
| 🧱 Structure| Creator abstract class with factory method, concrete creators |
| 👤 Client   | Uses creator's factory method, doesn't know concrete class |
| 💡 Summary  | Encapsulate object creation, let subclasses choose the type |
| 🧵 Compare  | Unlike Abstract Factory, Factory Method creates one product family |

**Use case:** UI framework where different platforms (Windows, Mac, Linux) create different button implementations.

---

## 🏗️ 4. Abstract Factory – "Create families of related objects"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Create families of related objects without specifying their concrete classes |
| 🧱 Structure| Abstract factory interface, concrete factories for each family |
| 👤 Client   | Uses factory to create entire product families |
| 💡 Summary  | Ensures products from the same family work together |
| 🧵 Compare  | Unlike Factory Method, Abstract Factory creates multiple related products |

**Use case:** Cross-platform UI where you need buttons, checkboxes, and text fields that all match the same design theme.

---

## 🧱 5. Builder – "Construct complex objects step by step"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Construct complex objects step by step, allowing different representations |
| 🧱 Structure| Builder interface, concrete builders, director (optional) |
| 👤 Client   | Uses builder to construct objects piece by piece |
| 💡 Summary  | Separate construction from representation, control object creation process |
| 🧵 Compare  | Unlike Factory, Builder focuses on the construction process, not just creation |

**Use case:** SQL query builders, HTML generators, complex configuration objects with many optional parameters.

---

## 🧭 Quick Comparison Map of 5 Creational Patterns
| Pattern        | Main Goal                    | Creates Objects? | Controls Creation? | Multiple Types? | Complex Setup? | Quick Memory Aid           |
|----------------|------------------------------|:----------------:|:------------------:|:----------------:|:---------------:|---------------------------|
| Singleton      | Ensure single instance        |        ❌        |         ✅         |        ❌        |       ❌        | "One and only one"        |
| Prototype      | Clone existing objects        |        ✅        |         ❌         |        ✅        |       ❌        | "Copy machine"            |
| Factory Method | Defer creation to subclasses |        ✅        |         ✅         |        ✅        |       ❌        | "Let subclasses decide"   |
| Abstract Factory| Create product families      |        ✅        |         ✅         |        ✅        |       ✅        | "Family creator"          |
| Builder        | Build complex objects        |        ✅        |         ✅         |        ✅        |       ✅        | "Step-by-step construction"|

---

## 🧠 Visual Memory Aids
| Name            | Visual Metaphor               |
|-----------------|-------------------------------|
| Singleton       | 🔒 Locked box (only one key)  |
| Prototype       | 🧬 DNA cloning                |
| Factory Method  | 🏭 Assembly line              |
| Abstract Factory| 🏗️ Furniture factory          |
| Builder         | 🧱 Construction site          |

---

## 📚 When to Use Each Pattern

### 🔒 Singleton
- **Use when:** You need exactly one instance of a class (database connection, logger)
- **Don't use when:** You need multiple instances or want to test with different instances
- **Real examples:** Database connection pools, application configuration, logging services

### 🧬 Prototype
- **Use when:** Object creation is expensive or you want to avoid subclassing
- **Don't use when:** Objects are simple to create or you need different types
- **Real examples:** Game sprites, document templates, complex data structures

### 🏭 Factory Method
- **Use when:** You want to delegate object creation to subclasses
- **Don't use when:** You know the exact class at compile time
- **Real examples:** UI frameworks, plugin systems, cross-platform applications

### 🏗️ Abstract Factory
- **Use when:** You need to create families of related objects
- **Don't use when:** You only need to create one type of object
- **Real examples:** Cross-platform UI libraries, database drivers, theme systems

### 🧱 Builder
- **Use when:** You need to create complex objects with many optional parameters
- **Don't use when:** Objects are simple or have few parameters
- **Real examples:** SQL query builders, HTML generators, configuration objects

---

## 🔄 Pattern Relationships & Trade-offs

| Pattern Combination | When to Use | Benefits | Drawbacks |
|-------------------|-------------|----------|-----------|
| **Singleton + Factory Method** | Global factory with controlled creation | Centralized creation + single instance | Tight coupling to global state |
| **Prototype + Builder** | Complex object cloning with customization | Efficient creation + flexible construction | Complex object state management |
| **Abstract Factory + Builder** | Family creation with complex setup | Consistent families + detailed control | Very complex, many classes |
| **Factory Method + Prototype** | Flexible creation with cloning | Multiple creation strategies | Potential confusion about when to use which |

---

## 🚀 Implementation Tips

### Best Practices
1. **Singleton:** Consider thread safety and lazy initialization
2. **Prototype:** Implement deep vs shallow copy based on your needs
3. **Factory Method:** Keep the factory method simple, delegate complex logic
4. **Abstract Factory:** Ensure products from same factory work together
5. **Builder:** Use fluent interface for better readability

### Common Pitfalls
- **Singleton:** Overuse leading to global state issues and testing difficulties
- **Prototype:** Shallow copying when deep copy is needed
- **Factory Method:** Creating too many subclasses for simple variations
- **Abstract Factory:** Making factories too specific, reducing reusability
- **Builder:** Making the builder too complex or not providing sensible defaults

---

## 🎯 Pattern Selection Guide

| Scenario | Recommended Pattern | Why |
|----------|-------------------|------|
| Need exactly one instance | **Singleton** | Ensures single instance with global access |
| Expensive object creation | **Prototype** | Avoids expensive initialization by copying |
| Different object types at runtime | **Factory Method** | Lets subclasses decide what to create |
| Related object families | **Abstract Factory** | Ensures compatible product families |
| Complex object with many options | **Builder** | Provides step-by-step construction control |

---

## 📖 Further Reading
- [Refactoring.Guru - Creational Patterns](https://refactoring.guru/design-patterns/creational-patterns)
- [Head First Design Patterns](https://www.oreilly.com/library/view/head-first-design/0596007124/)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)
