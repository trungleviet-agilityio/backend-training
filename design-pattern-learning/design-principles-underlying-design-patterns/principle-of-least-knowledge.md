# 🏛️ Principle of Least Knowledge (Law of Demeter)

## ✅ Definition
The Principle of Least Knowledge (Law of Demeter) states that **classes should know about and interact with as few other classes as possible**. Each class should only communicate with its immediate "friends"—objects it directly knows about. This minimizes dependencies and reduces the risk of cascading changes.

---

## 🎯 Motivation
- Reduces coupling and complexity in your system.
- Makes code easier to maintain, extend, and test.
- Prevents cascading changes and unwanted side effects.

---

## 📜 Law of Demeter Rules
A method M of object O should only call methods that belong to:
1. **Itself** (other methods in the same object)
2. **Method parameters** (objects passed as arguments)
3. **Objects instantiated locally** within M
4. **Instance variables** (direct components of O)

**Do NOT:**
- Allow a method to access another method by "reaching through" an object (e.g., `a.getB().getC().doSomething()`).
- Invoke methods of any object that is not local, not a parameter, not instantiated locally, or not an instance variable.

**Returned objects must be of the same type as:**
- Those declared in the method parameter
- Those declared and instantiated locally in the method
- Those declared in instance variables of the class that encapsulates the method

**In summary:**
- A method should only call other methods if they are:
  - Encapsulated within the same object
  - Encapsulated within an object that is in the parameters of the method
  - Encapsulated within an object that is instantiated inside the method
  - Encapsulated within an object that is referenced in an instance variable of the class for the method

---

## 🧪 Example & Violation
- **Good:** A `Driver` class calls methods on its `Car` instance (which it owns), or on a `RentalStore` passed as a parameter.
- **Violation:** The `Driver` calls methods on the `Engine` of the `Car` (which it does not own directly), or on a `Motorcycle` returned from a method (which it does not know about).

---

## 🚀 Benefits
- **Lower Coupling:** Classes are less dependent on the internal structure of others.
- **Greater Stability:** Changes in one class are less likely to break others.
- **Easier Maintenance:** Fewer dependencies to track and update.

---

## ⚠️ Tradeoffs
- May require more design and implementation effort.
- Some coupling is unavoidable; use judgment to balance flexibility and practicality.

---

## 💡 Summary
> The Principle of Least Knowledge (Law of Demeter) helps you design robust, maintainable systems by limiting the dependencies between classes. Classes should only interact with their immediate friends, not the whole system. Avoid chained calls and "reaching through" objects—keep interactions local and direct.
