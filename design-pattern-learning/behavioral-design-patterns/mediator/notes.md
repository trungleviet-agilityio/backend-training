# 🧠 Mediator Pattern – Centralized Communication

## ✅ Definition
Mediator is a behavioral design pattern that reduces chaotic dependencies between objects by forcing them to communicate through a central mediator object, rather than directly with each other.

---

## 🧩 Problem
When you have many components (e.g., UI elements, smart home devices) that need to interact, direct communication between them leads to a complex web of dependencies. This makes the system hard to maintain, extend, and reuse.

Example: In a smart home, if every device (phone, thermostat, coffee maker, etc.) talks directly to every other device, adding or changing rules becomes a nightmare.

---

## ✅ Solution
- Components (colleagues) do **not** communicate directly.
- Instead, they send all requests and notifications to a **mediator**.
- The mediator handles coordination, logic, and communication between components.

**Result:**
- Components are decoupled and reusable.
- All interaction logic is centralized in the mediator.

---

## ⚙️ Structure

```
Component <----> Mediator <----> Other Component
```

- **Component:** Any individual part (Button, Checkbox, Device, etc.)
- **Mediator:** Central object that coordinates communication and logic

**UML Class Diagram:**
```mermaid
direction LR
classDiagram
    class Mediator {
      +notify(sender, event)
    }
    class Component {
      -mediator: Mediator
    }
    class Button
    class Checkbox
    class Dialog
    Mediator <|-- Dialog
    Component <|-- Button
    Component <|-- Checkbox
    Button --> Mediator : notify()
    Checkbox --> Mediator : notify()
    Dialog --> Button
    Dialog --> Checkbox
```

---

## 🧪 Example – UI Form
```python
class Mediator:
    def notify(self, sender, event):
        pass

class Component:
    def __init__(self, mediator: Mediator):
        self.mediator = mediator

class Button(Component):
    def click(self):
        self.mediator.notify(self, "click")

class Checkbox(Component):
    def check(self):
        self.mediator.notify(self, "check")

class Dialog(Mediator):
    def __init__(self):
        self.login_checkbox = Checkbox(self)
        self.submit_btn = Button(self)

    def notify(self, sender, event):
        if sender == self.login_checkbox and event == "check":
            print("Show login fields")
        elif sender == self.submit_btn and event == "click":
            print("Validate and submit form")
```

---

## 🏠 Real-World Analogy: Air Traffic Control
Airplanes do **not** communicate directly with each other when landing. Instead, all planes communicate with the control tower (mediator), which coordinates all landings and takeoffs. This centralization prevents chaos and collisions.

---

## 🎯 Applicability
Use Mediator when:
- Components are tightly coupled and hard to reuse
- You want to centralize complex coordination logic
- You need to define new ways for components to interact without changing them

---

## ⚖️ Pros & Cons
| Pros                                      | Cons                                  |
|--------------------------------------------|---------------------------------------|
| ✅ Reduces coupling between classes        | ❌ Mediator can become a God Object    |
| ✅ Easier to maintain and understand       | ❌ Too much logic in one place         |
| ✅ Components are more reusable            |                                       |
| ✅ Can extend by replacing mediator        |                                       |

---

## 🛠️ How to Implement
1. **Identify tightly coupled classes** that would benefit from being more independent (easier maintenance, reuse).
2. **Declare the mediator interface** and define the communication protocol (usually a single `notify(sender, event)` method). This allows components to work with any mediator implementation.
3. **Implement the concrete mediator**. This class should store references to all components it coordinates.
4. Optionally, **let the mediator create/destroy components** (it may act as a factory or facade).
5. **Components should store a reference to the mediator** (usually passed in the constructor).
6. **Update components** to call the mediator’s notification method instead of calling other components directly. Move all inter-component logic into the mediator.

---

## 🔁 Relations with Other Patterns
- **Chain of Responsibility, Command, Mediator, and Observer** all address different ways of connecting senders and receivers:
  - **Chain of Responsibility:** Passes a request sequentially along a chain of potential receivers until one handles it.
  - **Command:** Establishes unidirectional connections between senders and receivers via command objects.
  - **Mediator:** Eliminates direct connections between senders and receivers, forcing all communication through a mediator.
  - **Observer:** Lets receivers dynamically subscribe/unsubscribe to notifications from senders.
- **Facade vs. Mediator:**
  - **Facade** provides a simplified interface to a subsystem, but the subsystem is unaware of the facade and its objects can still communicate directly.
  - **Mediator** centralizes communication between components, which only know about the mediator and do not communicate directly.
- **Mediator vs. Observer:**
  - **Mediator** aims to remove mutual dependencies among components by centralizing communication.
  - **Observer** establishes dynamic, one-way connections (publish/subscribe) between objects.
  - Sometimes, Mediator can be implemented using Observer (mediator as publisher, components as subscribers). In this case, the patterns may look similar, but the intent is different: Mediator centralizes logic, Observer distributes it.
  - If all components become publishers, you have a distributed Observer system, not a Mediator.

---

## 🧠 Conclusion
Mediator centralizes and manages communication between components, making systems easier to maintain, extend, and reuse. However, be careful not to overload the mediator with too much logic (God Object anti-pattern).
