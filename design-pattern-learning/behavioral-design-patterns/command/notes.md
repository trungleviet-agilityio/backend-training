# 🧠 Command Pattern – Turn Actions into Objects

## ✅ Definition
Command is a behavioral design pattern that turns a request into a stand-alone object containing all information about the request. This allows you to parameterize actions, delay or queue execution, and support undo/redo.

---

## 🧩 Problem
Suppose you have a Button class for all UI buttons. Each button must perform a different action (copy, paste, etc.). If you:
- Create a subclass for each action → ❌ too many classes
- Put logic directly in the UI → ❌ UI depends on business logic

Example: CopyButton, PasteButton, UndoButton… leads to code duplication and makes extension difficult.

---

## ✅ Solution
Extract the action into a Command object with a single method: `execute()`.
- The UI (Button) does not need to know the details of the action.
- The Command knows:
  - Who will perform the action (receiver)
  - What to do (logic in `execute`)
  - Any parameters (passed via constructor)
- When the user interacts, the UI calls `execute()` on the command, not the business logic directly.

---

## 🍱 Real-World Analogy
In a restaurant:
- You order food → the waiter writes it on a ticket
- The waiter gives the ticket to the chef
- The chef reads the ticket, cooks the food, gives it to the waiter, who serves it

👉 The ticket is a Command:
- Can be queued
- Decouples ordering and cooking
- Can be reused, checked, or delayed

---

## ⚙️ Structure

```
Client --> [Command] --> [Receiver]
             |
         [Invoker]

Role         | Description
-------------|---------------------------------------------------
Client       | Creates command and assigns it to invoker
Command      | Interface with execute()
ConcreteCmd  | Implements the request
Receiver     | Performs the real action
Invoker      | Calls execute() to run the command
```

---

## 🗂️ UML Diagram & Explanation

```mermaid
direction LR
classDiagram
    class Invoker
    class Command {
      +execute()
      +unexecute()
      +isReversible() boolean
    }
    class ConcreteCommand {
      +execute()
      +unexecute()
      +isReversible() boolean
    }
    class Receiver {
      +action()
    }
    Invoker o-- Command
    Command <|-- ConcreteCommand
    ConcreteCommand --> Receiver
```

**Explanation:**
- **Invoker**: Stores and triggers commands. It only knows the Command interface, not the details of the action or the receiver.
- **Command (interface/abstract class)**: Declares the methods `execute()`, `unexecute()` (for undo), and `isReversible()` (to check if the command can be undone).
- **ConcreteCommand**: Implements the Command interface. Stores all information needed to perform and undo the action, and holds a reference to the Receiver.
- **Receiver**: The actual object that performs the work (e.g., text editor, alarm service). ConcreteCommand calls methods on the Receiver to perform or undo the action.
- **Undo/Redo logic**: The `unexecute()` method allows the command to reverse its effect. The `isReversible()` method lets the Invoker check if undo is possible before calling `unexecute()`.

This structure allows you to queue, log, undo, or redo commands, and decouples the invoker from the details of the action and its receiver.

---

## 🧩 About Command Objects

**Command objects** are the core of the Command Pattern—they encapsulate an action (request) as a separate class.

### ✅ Simple Definition
A Command object is an object that represents a specific action or operation. It contains all the information needed to execute that action later, anywhere, by anyone.

### 🧩 What does a Command object usually contain?
| Component            | Role                                                        |
|----------------------|-------------------------------------------------------------|
| ✅ `execute()`       | Performs the action (required in every command object)       |
| 📝 Receiver          | The object that actually performs the action                 |
| 📦 Data              | Parameters needed to perform the action                      |
| 🔙 Backup/undo logic | (Optional) Used to support undoing the performed action      |

### 🧠 Real Example – Text Editor
```python
class CutCommand(Command):
    def __init__(self, editor):
        self.editor = editor
        self.backup = ""

    def execute(self):
        self.backup = self.editor.getSelection()
        self.editor.cut()
        return True

    def undo(self):
        self.editor.restore(self.backup)
```
Here, `CutCommand` is a command object:
- Knows which editor to operate on
- Knows how to perform the cut via `editor.cut()`
- Can undo the action by restoring the previous text

### 🚀 Uses of Command Objects
| Situation                        | How Command objects help                                 |
|-----------------------------------|---------------------------------------------------------|
| 🖱 Assign actions to buttons/menus | Assign a command to each button (no custom logic needed) |
| ⏳ Delay/execute later             | Store commands in a queue to run later                   |
| 🔁 Undo/Redo                       | Store command + previous state for undo                  |
| 🧪 Reuse actions in many places    | Button, shortcut, and menu can share one command object  |
| 🌐 Send actions over the network   | Serialize command object to send remotely                |

### 🧠 Summary
| Attribute                | Command Object |
|--------------------------|:-------------:|
| Encapsulates action      |      ✅        |
| Caller-agnostic          |      ✅        |
| Can be sent/stored/undone|      ✅        |
| Can be attached to many UI|     ✅        |

👉 Think of each action (copy, paste, undo...) as a "brick"—the Command object is that brick: you can move it anywhere, use it anytime, and stack it however you want.

**Relation to the Diagram:**
- In the UML diagram above, the `Command` and `ConcreteCommand` classes represent these command objects. Each command object encapsulates all logic and data needed to perform and (optionally) undo an action, and can be passed to any invoker (button, scheduler, etc.) or stored for later use. This enables features like undo, queuing, and UI decoupling.

---

## 🔗 Decoupling in Command Pattern

One of the most important benefits of the Command pattern is **decoupling**:

- **Decoupling sender and receiver:** The object that triggers an action (Invoker, e.g., a button or menu) does not need to know anything about how the action is performed or who performs it. It only knows about the Command interface.
- **Decoupling UI and business logic:** UI elements (buttons, menus, schedulers) are not tied to business logic. You can assign, swap, or reuse commands without changing the UI code.
- **Decoupling action creation and execution:** Commands can be created, stored, and executed at different times and places. This enables features like undo, queuing, logging, and remote execution.

**Why is this powerful?**
- You can add new actions without changing the UI or invoker code (Open/Closed Principle).
- You can reuse the same command in multiple places (button, shortcut, macro, etc.).
- You can easily implement undo/redo, macro commands, and event queues.

**Summary:**
> The Command pattern separates the responsibility of issuing a request from the responsibility of handling it, making your codebase more flexible, maintainable, and extensible.

---

## 🧲 Applicability
**Use Command when:**
- You want to parameterize actions (instead of calling directly)
- You want to queue, schedule, or send requests remotely
- You need undo/redo
- You want a more flexible UI (UI elements decoupled from business logic)

---

## 💡 Pros & Cons

| Pros                                         | Cons                                 |
|-----------------------------------------------|--------------------------------------|
| ✅ SRP: Decouples UI and business logic       | ❌ Increases number of classes        |
| ✅ OCP: Add new commands without changing old | ❌ Initial code is more complex       |
| ✅ Easy undo/redo support                     |                                      |
| ✅ Can queue, delay, or send remotely         |                                      |
| ✅ Easy to combine commands (macro-command)   |                                      |

---

## 🛠️ How to Implement
1. Declare the command interface with a single execution method.
2. Extract requests into concrete command classes implementing the interface. Each class stores arguments and a reference to the receiver, initialized via the constructor.
3. Identify sender classes (invokers). Add fields to store commands. Senders should interact with commands only via the interface.
4. Change senders to execute the command instead of calling the receiver directly.
5. The client should:
   - Create receivers
   - Create commands and associate them with receivers
   - Create senders and assign commands to them

---

## 🔁 Comparison with Other Patterns

| Compared to... | Key Difference                                      |
|----------------|-----------------------------------------------------|
| Strategy       | Strategy: swap algorithms; Command: encapsulate actions (can delay/undo) |
| Memento        | Memento: stores state; often used with Command for undo |
| Chain of Resp. | CoR: passes request through handlers; Command can be a handler |

---

## 🚀 Conclusion
Command pattern:
- Decouples the action from the place where it is triggered
- Makes it easy to extend and reuse logic
- Great for: Undo, Macro Command, Event Queue, Remote Calls, UI Frameworks

---
