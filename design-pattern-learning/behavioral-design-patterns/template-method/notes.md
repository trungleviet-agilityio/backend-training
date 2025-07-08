# Template Method Pattern

## 🧠 Definition

Template Method is a behavioral pattern that defines the skeleton of an algorithm in a superclass, but lets subclasses override specific steps without changing the algorithm's structure.

## 🧩 When to Use? (Problem)

You're dealing with multiple objects that have similar algorithms, for example:

- Extracting data from different file formats: DOC, CSV, PDF
- Each type has different ways to open, parse, and close files
- But the data processing or content analysis logic is the same

➡ If you copy-paste logic to different classes, you will:
- Violate DRY (Don't Repeat Yourself)
- Make maintenance difficult if the algorithm changes

## 🧪 Solution

Create an abstract class containing:
- A template method (overall algorithm) — cannot be overridden
- Calls to multiple sub-steps (step1(), step2()...)

Subclasses can:
- Override specific steps
- But cannot change the template structure

## 📦 Types of Steps in Template Method

| Step Type | Description |
|-----------|-------------|
| abstract step | Must be overridden |
| concrete step | Available in parent class, subclasses can reuse |
| hook | Optional step that can be overridden or skipped (default is empty) |

## 🏠 Real-world Example: Pre-built House

- Blueprint (design plan) is the template method
- Customers can choose paint color, door style, flooring → hook methods
- But cannot change structure: foundation, roof, electrical system...

## 👷‍♀️ Structure

```
+----------------------+
| AbstractClass        | <--- contains templateMethod()
|----------------------|
| +templateMethod()    |  <--- order of step calls
| +step1()             |  <--- abstract or default
| +step2()             |
| +hookStep()          |
+----------------------+
         ▲
         |
+------------------+
| ConcreteSubclass |
|------------------|
| +step1()         |
| +step2()         |
| +hookStep()      |
+------------------+
```

## 📜 Pseudocode (From game AI example)

```python
class GameAI:
    def turn(self):
        self.collectResources()
        self.buildStructures()
        self.buildUnits()
        self.attack()

    def collectResources(self):
        for s in self.builtStructures:
            s.collect()

    def attack(self):
        enemy = self.closestEnemy()
        if enemy is None:
            self.sendScouts(map.center)
        else:
            self.sendWarriors(enemy.position)

    # abstract methods
    def buildStructures(self): pass
    def buildUnits(self): pass
    def sendScouts(self, pos): pass
    def sendWarriors(self, pos): pass
```

```python
class OrcsAI(GameAI):
    def buildStructures(self):
        # Build farms, barracks, stronghold

    def buildUnits(self):
        # Build peon or grunt

    def sendScouts(self, pos):
        # Send scouts

    def sendWarriors(self, pos):
        # Send warriors
```

## 🚦 When to Use (Applicability)

### ✅ Use when:
- Multiple classes have similar logic
- Need to avoid code duplication
- Want to let subclasses extend behavior without changing algorithm framework

### ❌ Don't use when:
- Subclasses need to change the order of steps
- Algorithm cannot be represented as a fixed sequence of steps

## ⚖️ Advantages / Disadvantages

| Advantages | Disadvantages |
|------------|---------------|
| ✅ Reduces code duplication by sharing common parts in parent class | ❌ Hard to maintain if too many steps or overly complex algorithm |
| ✅ Allows extending individual parts without affecting the whole | ❌ May violate Liskov if subclass doesn't meet expectations |
| ✅ Follows Open/Closed Principle | |

## 🛠️ How to Implement

1. **Analyze the target algorithm** to see whether you can break it into steps. Consider which steps are common to all subclasses and which ones will always be unique.

2. **Create the abstract base class** and declare the template method and a set of abstract methods representing the algorithm's steps. Outline the algorithm's structure in the template method by executing corresponding steps. Consider making the template method final to prevent subclasses from overriding it.

3. **It's okay if all the steps end up being abstract**. However, some steps might benefit from having a default implementation. Subclasses don't have to implement those methods.

4. **Think of adding hooks** between the crucial steps of the algorithm.

5. **For each variation of the algorithm**, create a new concrete subclass. It must implement all of the abstract steps, but may also override some of the optional ones.

## 🔁 Relationship with Other Patterns

| Pattern | Key Difference |
|---------|----------------|
| Strategy | Template = inheritance (compile-time), Strategy = composition (runtime) |
| Factory Method | A specific case of Template Method — creating objects |
| Hook Method | Optional extension that can be overridden in Template |

## 🎯 Quick Summary

- ✅ Template Method: defines algorithm framework in parent class, subclasses can only override specific steps
- 🔐 Template method is usually final (or non-overrideable)
- 🔁 Very useful for reusing logic & avoiding duplication
- 🧱 Works at class level (static polymorphism), unlike Strategy (dynamic)
