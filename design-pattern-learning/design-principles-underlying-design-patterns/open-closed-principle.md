# 🏛️ Open/Closed Principle (OCP)

## ✅ Definition
The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be **open for extension** but **closed for modification**.

---

## 🎯 Purpose
- Keep the stable (unchanging) parts of your system separate from the varying (changeable) parts.
- Allow new features to be added without disrupting existing, working code.

---

## 🚀 Key Benefits
- **Stability:** Stable code is protected from changes and side effects.
- **Extensibility:** New behavior can be added by extending existing code (e.g., via inheritance or interfaces), not by modifying it.
- **Maintainability:** Reduces risk of bugs when adding features.

---

## 🛠️ How It Works
- Use **extension over change**: Add new functionality by creating new subclasses or implementing new interfaces, rather than altering existing code.
- Design your system so that core logic is "closed" to modification, but "open" to new requirements via extension points.

---

## 🧠 Object-Oriented Design Goal
- **Keep a system stable** by "closing" classes to changes.
- **Allow a system to be open for extension** through inheritance or interfaces.

---

## 💡 Summary
> The Open/Closed Principle helps you build systems that are robust, flexible, and easy to extend—without introducing unwanted side effects into stable parts of your code.
