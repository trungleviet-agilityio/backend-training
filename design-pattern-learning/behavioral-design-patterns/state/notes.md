# 🔄 State Pattern – Dynamic Behavior via State

## ✅ Definition
State is a behavioral design pattern that allows an object to change its behavior when its internal state changes. It appears as if the object has changed its class.

---

## 🧩 Problem
Suppose you have a system (e.g., Document, AudioPlayer, Vending Machine) with multiple states:
- Draft → Moderation → Published
- Idle → Has One Dollar → Out of Stock

Each method (e.g., `publish()`, `clickPlay()`, `dispense()`) behaves differently depending on the current state.
A common (but problematic) approach is to use long `if`/`switch` statements:

```python
switch (state):
  case 'draft':
    ...
  case 'moderation':
    ...
```

Problems:
- Code becomes long and messy
- Hard to extend or change
- Duplicated logic, hard to control

---

## 🧪 Solution
- Extract each state into its own class, all implementing a common `State` interface.
- The main object (context) holds a reference to a `State` object.
- The context delegates all state-dependent logic to the current state object.
- To change behavior, simply swap the current state object.

---

## 🧰 Class Structure

```
+---------------------+           +------------------+
|     Context         | --------> |     State        |
|---------------------|           |------------------|
| - state: State      |           | + clickPlay()    |
| + changeState()     |           | + clickLock()    |
| + clickPlay()       |           | + clickNext()    |
| delegates to state  |           | ...              |
+---------------------+           +------------------+
                                         ▲
              +--------------------------+------------------------+
              |                          |                        |
      +---------------+       +----------------+      +----------------+
      | LockedState   |       | ReadyState     |      | PlayingState   |
      +---------------+       +----------------+      +----------------+
```

---

## 🖼️ Real-World Example: Audio Player

- **LockedState**: All buttons do nothing.
- **ReadyState**: Can start playing music.
- **PlayingState**: Can stop, play next, etc.

---

## ⚙️ How to Implement

1. **Decide the context class** (the main object whose behavior changes).
2. **Declare the state interface** (methods that may have state-specific behavior).
3. **Create a class for each state** implementing the state interface. Move state-specific code from the context to these classes.
4. **In the context**, add a reference to the state interface and a setter to change it.
5. **Replace state conditionals** in the context with calls to the state object.
6. **Switch state** by assigning a new state object to the context (can be done by the context, state, or client).

---

## 🧾 Pseudocode – AudioPlayer Example

**Context: AudioPlayer**
```python
class AudioPlayer:
    def __init__(self):
        self.state = ReadyState(self)

    def change_state(self, state):
        self.state = state

    def click_play(self):
        self.state.click_play()

    def click_lock(self):
        self.state.click_lock()

    def click_next(self):
        self.state.click_next()
```

**State Interface**
```python
class State:
    def __init__(self, player):
        self.player = player

    def click_play(self): pass
    def click_lock(self): pass
    def click_next(self): pass
```

**Concrete States**
```python
class ReadyState(State):
    def click_play(self):
        print("Start playing")
        self.player.change_state(PlayingState(self.player))

class PlayingState(State):
    def click_play(self):
        print("Stop playing")
        self.player.change_state(ReadyState(self.player))

class LockedState(State):
    def click_play(self):
        print("Locked: can't play")
```

---

## 🎯 When to Use

**Use State Pattern when:**
- The behavior of an object changes depending on its internal state.
- There are many states and complex state transition rules.
- Your code has many `if`/`switch` statements checking state.
- You want to apply Single Responsibility and Open/Closed principles.

**Don’t use when:**
- There are very few states or they rarely change (may overcomplicate).

---

## ⚖️ Pros & Cons

| Pros                                         | Cons                                      |
|-----------------------------------------------|-------------------------------------------|
| ✅ Separate logic for each state (SRP)        | ❌ Can over-engineer if few states         |
| ✅ Add new states without changing old code   | ❌ May create many small classes           |
| ✅ Removes long if/switch statements          | ❌ Context depends on concrete state classes|
| ✅ State object can change context’s state    |                                           |

---

## 🔁 Quick Comparison: State vs Strategy

|                | State Pattern                        | Strategy Pattern                      |
|----------------|-------------------------------------|---------------------------------------|
| Main goal      | Change behavior by internal state    | Select algorithm at runtime           |
| Know each other?| States can know and switch each other| Strategies don’t know each other      |
| Runtime change?| State can change itself or context   | Only client changes strategy          |
| When to use?   | When object changes behavior         | When you want to swap algorithms      |

---

## 🧠 Conclusion
State Pattern is ideal when you need:
- To change behavior based on state
- To organize and simplify complex conditional logic
- To easily extend state-dependent logic as requirements grow

---

## 💡 Note: State & Template Method
Each state class can use the Template Method pattern to define its own internal step-by-step logic, making state transitions and behaviors even more reusable and organized.
