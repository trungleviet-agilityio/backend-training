# 🏛️ Liskov Substitution Principle (LSP)

## ✅ Definition
The Liskov Substitution Principle states that **subtypes must be substitutable for their base types**. In other words, if class S is a subtype of class B, then objects of type B may be replaced with objects of type S without altering the correctness of the program.

---

## 🎯 Purpose
- Ensure that inheritance is used properly in object-oriented design.
- Allow subclasses to extend base classes without changing expected program behavior.
- Promote reliable polymorphism and code reuse.

---

## 🛠️ Key Guidelines for Inheritance
- **Substitutability:** Any subclass should be usable anywhere its base class is expected, without causing errors or unexpected behavior.
- **Preconditions:** Subclasses must not strengthen the preconditions of base class methods (i.e., cannot require more to call a method).
- **Postconditions:** Subclasses must not weaken the postconditions of base class methods (i.e., must guarantee at least what the base class does, or more).
- **Invariants:** Subclasses must preserve all invariants of the base class.
- **Immutability:** Subclasses must not change immutable characteristics of the base class.
- **Behavioral Consistency:** Subclasses can override methods to improve performance or add detail, but must not change the expected results.

---

## 🧠 Practical Example
If a base class provides a method to search a list, a subclass can override it with a faster algorithm, as long as the result is the same. If a subclass changes the meaning or expected result, it violates LSP.

---

## 💡 Summary
> The Liskov Substitution Principle helps ensure that inheritance leads to correct, predictable, and maintainable code. Subclasses should extend, not break, the behavior of their base classes.
