# Structural Design Patterns

Structural patterns help organize classes and objects into larger, flexible, and extensible structures. Here's an overview of the 5 most important patterns:

---

## 🌉 1. Facade – "Simplify complex system interfaces"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Provide a simple interface to a complex system |
| 🧱 Structure| One class calls multiple subsystems internally |
| 👤 Client   | Interacts only with the Facade, doesn't see subsystems |
| 💡 Summary  | Centralizes communication – hides complexity |
| 🧵 Compare  | Unlike Adapter/Decorator, Facade wraps a whole system, not just an object |

**Use case:** When using a complex library (e.g., FFmpeg), you write a `VideoConverterFacade` to call the right sequence of functions so the client doesn't need to know the details.

---

## 🔌 2. Adapter – "Convert incompatible interfaces"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Convert the interface of a class to match what the client expects |
| 🧱 Structure| Can use object adapter (composition) or class adapter (inheritance) |
| 👤 Client   | Calls methods via the expected interface |
| 💡 Summary  | Makes a class look like what the client needs |
| 🧵 Compare  | Unlike Decorator, Adapter doesn't add behavior, just changes interface |

**Use case:** You have `OldLogger` but the client wants to call `log.info(msg)`. Adapter wraps `OldLogger.write(msg)` as `log.info()`.

---

## 🌲 3. Composite – "Organize objects as a tree"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Organize objects in a tree structure; both leaf and container have the same interface |
| 🧱 Structure| Has Component (interface), Leaf, Composite |
| 👤 Client   | Treats everything as a Component, whether Leaf or Composite |
| 💡 Summary  | Uniform treatment – operate on the tree as if each node is the same |
| 🧵 Compare  | Unlike Decorator, Composite is for collections, Decorator wraps a single object |

**Use case:** UI layout – Panel contains Text, Image, Button → all implement `draw()`.

---

## 🕵️ 4. Proxy – "Control access to another object"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Acts as the real object, but adds features like lazy load, logging, caching |
| 🧱 Structure| Proxy implements the same interface as RealObject and holds a reference to it |
| 👤 Client   | Doesn't know if it's talking to Proxy or Real Object |
| 💡 Summary  | Replaces the real object to control access |
| 🧵 Compare  | Like Decorator in interface, but Proxy's goal is access control, not adding behavior |

**Use case:** You have `RemoteService`, but want caching or to limit user access → create `ProxyRemoteService`.

---

## 🎁 5. Decorator – "Add dynamic behavior to objects"
| Feature     | Explanation |
|-------------|-------------|
| 🎯 Purpose  | Add new behavior without changing the original class |
| 🧱 Structure| Decorator has a wrappee and implements the same interface |
| 👤 Client   | Talks via the interface, doesn't know about decorators |
| 💡 Summary  | Each layer adds behavior, stacked like "wrapping a gift" |
| 🧵 Compare  | Unlike Proxy: Proxy controls access, Decorator extends behavior |

**Use case:** You have `TextView`, then wrap with `BorderDecorator`, then `ShadowDecorator`, still call `render()`.

---

## 🧭 Quick Comparison Map of 5 Structural Patterns
| Pattern   | Main Goal                        | Adds behavior? | Changes interface? | Controls access? | Multiple objects? | Quick memory aid                |
|-----------|----------------------------------|:--------------:|:------------------:|:----------------:|:-----------------:|-------------------------------|
| Facade    | Simplify complex system          |      ❌        |        ✅          |        ❌        |        ✅         | "Curtain for a complex system" |
| Adapter   | Convert interface                |      ❌        |        ✅          |        ❌        |        ❌         | "Power plug adapter"           |
| Composite | Tree structure, uniform handling |      ❌        |        ❌          |        ❌        |        ✅         | "Folder tree"                  |
| Proxy     | Control access                   |      ⚠        |        ❌          |        ✅        |        ❌         | "Gatekeeper"                   |
| Decorator | Add dynamic behavior             |      ✅        |        ❌          |        ❌        |        ❌         | "Gift wrap – layered"          |

---

## 🧠 Visual memory aids
| Name      | Visual metaphor                  |
|-----------|----------------------------------|
| Facade    | 🎛️ Simple control panel          |
| Adapter   | 🔌 Power adapter                  |
| Composite | 🌳 Folder tree                    |
| Proxy     | 🧍‍♂️ Bodyguard / representative   |
| Decorator | 🎁 Gift wrap – layers             |

---

## 📚 When to Use Each Pattern

### 🎯 Facade
- **Use when:** You have a complex subsystem that clients need to interact with
- **Don't use when:** The subsystem is simple or you need fine-grained control
- **Real examples:** Database connection pools, video processing libraries, payment gateways

### 🔌 Adapter
- **Use when:** You need to integrate third-party libraries or legacy code
- **Don't use when:** You can modify the source code directly
- **Real examples:** XML to JSON converters, old API wrappers, hardware drivers

### 🌲 Composite
- **Use when:** You have hierarchical structures that need uniform treatment
- **Don't use when:** Your objects don't naturally form a tree structure
- **Real examples:** File systems, UI components, organization charts, menu systems

### 🕵️ Proxy
- **Use when:** You need to control access to expensive or sensitive resources
- **Don't use when:** The object is simple and doesn't need access control
- **Real examples:** Virtual proxies for large images, protection proxies for sensitive data, remote proxies for network services

### 🎁 Decorator
- **Use when:** You need to add/remove features dynamically at runtime
- **Don't use when:** You have a fixed set of features that won't change
- **Real examples:** Java I/O streams, UI styling, logging systems, validation layers

---

## 🔄 Pattern Relationships & Trade-offs

| Pattern Combination | When to Use | Benefits | Drawbacks |
|-------------------|-------------|----------|-----------|
| **Facade + Adapter** | Complex third-party system | Clean interface + compatibility | Additional abstraction layer |
| **Composite + Decorator** | UI with dynamic styling | Tree structure + flexible styling | Complex debugging |
| **Proxy + Decorator** | Cached service with logging | Performance + observability | Multiple layers of indirection |
| **Adapter + Decorator** | Legacy system with new features | Compatibility + extensibility | Complex wrapper chain |

---

## 🚀 Implementation Tips

### Best Practices
1. **Keep interfaces simple** - Don't add methods just for one decorator
2. **Use composition over inheritance** - Especially for Adapter and Decorator
3. **Consider the order** - Decorator order matters, Proxy order usually doesn't
4. **Document the contract** - Make it clear what each pattern does

### Common Pitfalls
- **Facade:** Becoming a "god object" that knows too much
- **Adapter:** Creating adapters for everything instead of fixing the real problem
- **Composite:** Making the interface too generic for all use cases
- **Proxy:** Adding too much logic that should be in the real object
- **Decorator:** Creating too many small decorators that are hard to manage

---

## 📖 Further Reading
- [Refactoring.Guru - Structural Patterns](https://refactoring.guru/design-patterns/structural-patterns)
- [Head First Design Patterns](https://www.oreilly.com/library/view/head-first-design/0596007124/)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)
