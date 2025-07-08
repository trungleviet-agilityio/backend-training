# 🏛️ Dependency Inversion Principle (DIP)

## ✅ Definition
The Dependency Inversion Principle states that **high-level modules should not depend on low-level modules; both should depend on abstractions** (interfaces or abstract classes). Abstractions should not depend on details; details should depend on abstractions.

---

## 🔗 Coupling & Dependency
- **Coupling** is the degree of reliance between software components.
  - **High coupling**: Components are tightly bound to specific implementations (hard to change, inflexible).
  - **Low coupling**: Components interact through abstractions (flexible, easier to maintain).
- **Dependency** is a form of coupling—how much one part of your system relies on another.

---

## 🧩 The Problem
- Directly referencing concrete classes (low-level modules) makes your system rigid and hard to change.
- If you need to swap out a concrete implementation (e.g., a sorting algorithm), you must change all references in your codebase.
- This leads to fragile, hard-to-maintain systems with unwanted side effects.

---

## ✅ The Solution
- **Change referencing of concrete classes from direct to indirect:**
  - Use interfaces or abstract classes as the point of reference, not concrete implementations.
- **Generalize behaviors of concrete classes into abstract classes and interfaces:**
  - Define common behaviors in abstractions, and let concrete classes implement them.
- **Have client classes interact with your system through generalizations:**
  - Clients depend on abstractions, not on specific resources.
- **Emphasize high-level dependency over low-level concrete dependency:**
  - Design your system so that high-level modules depend on abstractions, not details.
- This allows you to swap implementations easily, without changing client code.
- Use **indirection**: Interact with functionality through interfaces, not direct class references.

---

## 🛠️ How It Works
- Generalize behaviors into interfaces or abstract classes.
- Clients depend on these generalizations.
- Concrete classes implement the interfaces.
- At runtime, inject the desired implementation (e.g., via constructor or setter).

---

## 💡 Summary
> The Dependency Inversion Principle is a means to:
> - Change the referencing of concrete classes from being direct to indirect
> - Generalize the behaviors of your concrete classes into abstract classes and interfaces
> - Have client classes interact with your system through a generalization rather than directly with concrete resources
> - Put emphasis on high-level dependency over low-level concrete dependency
>
> This helps you build flexible, maintainable, and robust systems by reducing direct dependencies on concrete classes. Always program to abstractions, not implementations.
