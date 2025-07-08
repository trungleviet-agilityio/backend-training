# 🏛️ Interface Segregation Principle (ISP)

## ✅ Definition
The Interface Segregation Principle states that **a class should not be forced to depend on methods it does not use**. Interfaces should be specific and focused, not "fat" or overly general. Instead of large, catch-all interfaces, split them into smaller, more meaningful generalizations that describe separate functionalities.

---

## 🧩 The Problem with Large Interfaces
- Large interfaces force implementing classes to provide dummy or irrelevant method implementations.
- This leads to low cohesion, unnecessary dependencies, and more maintenance work.
- Clients may become dependent on methods they don't need, increasing coupling and reducing flexibility.

---

## ✅ The Solution: Split Interfaces
- **Split large interfaces** into smaller, more specific ones that group related behaviors.
- Classes implement only the interfaces that are relevant to their functionality.
- This keeps interfaces precise and implementation clean.
- Avoid forcing classes to implement "dummy" methods they do not use.
- Each interface should describe a distinct, separate aspect of your system's functionality.

---

## 🧪 Practical Example
- Suppose you have an `ICashier` interface for both human cashiers and self-serve machines.
- Human cashiers need methods like `clockIn()`, `takeBreak()`, but self-serve machines do not.
- Instead of forcing self-serve machines to implement irrelevant methods, split the interface:
  - `ICashier`: General cashier behaviors (scan, accept payment, dispense change)
  - `IHumanWorker`: Human-specific behaviors (clock in/out, take break)
- Now, `HumanCashier` implements both, while `SelfServeMachine` only implements `ICashier`.

---

## 💡 Summary
> The Interface Segregation Principle states:
> - A class should not be forced to depend on methods it does not use.
> - Interfaces should be split up in such a way that they properly describe the separate functionalities of your system.
> - Avoid dummy implementations by keeping interfaces focused and relevant.
>
> This helps you design flexible, maintainable systems by keeping interfaces clean and decoupled. Classes should only depend on the methods they actually use—split interfaces as needed to keep your codebase robust and easy to maintain.
