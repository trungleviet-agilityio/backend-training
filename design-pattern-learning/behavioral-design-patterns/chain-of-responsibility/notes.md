# 🧠 Chain of Responsibility – Chain of Responsibility Pattern

## ✅ Definition
Chain of Responsibility is a behavioral design pattern that lets you pass requests along a chain of handlers. Each handler can either process the request or pass it to the next handler in the chain.

---

## 🧩 Problem
You have a system with multiple processing steps before the main action, such as:
- User authentication
- Admin permission check
- Brute-force protection
- Cache check
- Data validation

Without CoR, you often write all logic in a single method—making code long, hard to maintain, and not reusable.

---

## 🧪 Solution
- Each processing step is separated into an independent handler implementing a common interface.
- Each handler holds a reference to the next handler.
- When a request arrives:
  - If the handler can process it, it may stop the chain.
  - Otherwise, it passes the request to the next handler.

---

## 🧰 Class Structure

```
+----------------------+
| Handler (interface)  |
|----------------------|
| +setNext(handler)    |
| +handle(request)     |
+----------------------+
           ▲
           |
+----------------------+
| BaseHandler (optional)|
|----------------------|
| +setNext(handler)     |
| +handle(request)      | --> calls next.handle(request)
+----------------------+
           ▲
     implements
           |
+----------------------+
| AuthHandler          |
| BruteForceHandler    |
| CacheHandler         |
| ...                  |
+----------------------+
```

---

## 🖼️ Real-World Example: GUI Help Chain
When a user presses F1 on a button, the `showHelp()` call starts from the button, moves up to the panel, dialog, etc., until some element can show help info.
Each GUI element is a handler.

---

## ⚙️ How to Implement

1. **Declare the handler interface** with a method for handling requests (e.g., `handle(request)`).
2. **(Optional) Create an abstract base handler** to store the next handler and provide default forwarding logic.
3. **Implement concrete handlers** for each processing step. Each handler decides:
   - Will it process the request?
   - Will it pass the request along the chain?
4. **Client assembles the chain** (can be done at runtime or via a factory).
5. **Client triggers the chain** by calling `handle(request)` on the first handler.
6. **Be prepared for edge cases**:
   - The chain may have only one handler.
   - Some requests may not be handled at all.

---

## 🧾 Pseudocode Example

```python
class Handler:
    def set_next(self, handler): ...
    def handle(self, request): ...

class AbstractHandler(Handler):
    def __init__(self):
        self.next_handler = None
    def set_next(self, handler):
        self.next_handler = handler
        return handler
    def handle(self, request):
        if self.next_handler:
            return self.next_handler.handle(request)
        return None

class AuthHandler(AbstractHandler):
    def handle(self, request):
        if not request.user_authenticated:
            raise Exception('Not Authenticated')
        return super().handle(request)

class AdminHandler(AbstractHandler):
    def handle(self, request):
        if request.user_is_admin:
            return 'Admin Access Granted'
        return super().handle(request)
```

---

## 🎯 When to Use

**Use when:**
- Requests may require multiple processing steps.
- Steps may change order, be added/removed flexibly.
- You don’t know in advance which handler will process the request.
- You want to decouple logic into independent, testable modules.

**Don’t use when:**
- All handlers must process the request (use Composite or Observer).
- You need a combined result from all steps.

---

## ⚖️ Pros & Cons

| Pros                                      | Cons                                      |
|--------------------------------------------|-------------------------------------------|
| ✅ Separate logic for each step            | ❌ Some requests may go unhandled          |
| ✅ Easy to add new handlers (OCP)          | ❌ Debugging can be hard in long chains    |
| ✅ Client is decoupled from handler logic  |                                           |
| ✅ Chain can be configured at runtime      |                                           |

---

## 🔁 Related Patterns

| Pattern     | Key Difference                                      |
|-------------|-----------------------------------------------------|
| Command     | CoR: request through many handlers; Command: one object per action |
| Observer    | Observer: broadcast to all; CoR: linear chain       |
| Mediator    | Mediator: centralized communication; CoR: distributed, sequential |
| Decorator   | Decorator always calls next; CoR can stop anytime   |

---

## 🧠 Quick Comparison: Template Method vs CoR

|                | Template Method         | Chain of Responsibility      |
|----------------|------------------------|-----------------------------|
| Extension      | Inheritance            | Composition (runtime)       |
| Nature         | Fixed skeleton, override steps | Flexible, each handler does part |
| Order          | Fixed                  | Flexible, runtime changeable|
| Can stop early | No                     | Yes                         |

---

## 💡 Note: Combining with Template Method
Chain of Responsibility can be combined with Template Method. For example, each handler in the chain can use a template method to define its own internal processing steps, while the chain itself manages the sequence of handlers. This allows for both flexible handler composition (CoR) and reusable step-by-step logic within each handler (Template Method).
