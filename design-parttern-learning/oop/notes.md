# Object-Oriented Programming (OOP) Summary

## Table of Contents
1. [Objects and Classes](#1-objects-and-classes)
2. [Class Hierarchies](#2-class-hierarchies)
3. [Abstraction](#3-abstraction)
4. [Encapsulation](#4-encapsulation)
5. [Inheritance](#5-inheritance)
6. [Polymorphism](#6-polymorphism)
7. [Relations Between Objects](#7-relations-between-objects)

---

## 1. Objects and Classes
Object-oriented programming is a paradigm based on the concept of wrapping pieces of data and related behavior into special bundles called **objects**. Objects are constructed from blueprints called **classes**.

- **Class**: A blueprint that defines the structure and behavior for objects. Example: `Cat` class.
- **Object**: An instance of a class. Example: `Oscar` and `Luna` are objects (cats) created from the `Cat` class.

### Example (from the book):
- The `Cat` class has fields (state): name, gender, age, weight, color, etc.
- The `Cat` class has methods (behavior): breathe(), eat(food), run(destination), sleep(hours), meow().

#### UML Example:
```
Cat
----------------------
+ name
+ gender
+ age
+ weight
+ color
...
----------------------
+ breathe()
+ eat(food)
+ run(destination)
+ sleep(hours)
+ meow()
```

#### Instances:
- Oscar: name = "Oscar", sex = "male", age = 3, weight = 7, color = brown, texture = striped
- Luna: name = "Luna", sex = "female", age = 2, weight = 5, color = gray, texture = plain

> Objects are instances of classes. Data stored in fields is called **state**; methods define **behavior**.

---

## 2. Class Hierarchies
A class hierarchy organizes classes in a parent-child relationship, where subclasses inherit attributes and behaviors from their parent (superclass).

### Example (from the book):
- Both `Cat` and `Dog` share common attributes: name, sex, age, weight, color.
- These can be moved to a superclass: `Animal`.
- `Cat` and `Dog` become subclasses of `Animal`.

#### UML Example:
```
Animal
----------------------
+ name
+ sex
+ age
+ weight
+ color
+ breathe()
+ eat(food)
+ run(destination)
+ sleep(hours)
----------------------
   ^
   |
----------------------
|      |             |
Cat   Dog         (other animals)
```
- `Cat` adds: isNasty: bool, meow()
- `Dog` adds: bestFriend: Human, bark()

> Subclasses inherit state and behavior from their parent, and can override or extend them.

### Hierarchy Example:
- You can have more general classes (e.g., `Organism` as a superclass for `Animal` and `Plant`).
- The hierarchy can be as deep as needed for the domain.

---

## 3. Abstraction
Abstraction is the process of modeling a real-world object or phenomenon in a specific context, representing only the details relevant to that context and omitting the rest.

### Example (from the book):
- An `Airplane` class in a flight simulator might have:
  - speed, altitude, rollAngle, pitchAngle, yawAngle, fly()
- An `Airplane` class in a flight booking application might have:
  - seats, reserveSeat(n)

> Both are models of the same real-world object, but each abstraction focuses on different aspects depending on the context.

### Key Point
- Abstraction helps manage complexity by focusing only on what matters for the current problem.

---

## 4. Encapsulation
Encapsulation is the ability of an object to hide parts of its state and behaviors from other objects, exposing only a limited interface to the rest of the program.

### Example (from the book):
- To start a car engine, you only need to turn a key or press a button. You don't need to know the internal details (wires, crankshaft, cylinders, etc.).
- The car exposes a simple interface: start switch, steering wheel, pedals.

### How is Encapsulation Achieved?
- By making fields/methods `private` or `protected`, only allowing access through public methods (the interface).
- In OOP languages, interfaces and abstract classes help define what is exposed.

### Key Point
- Encapsulation protects internal state, reduces dependencies, and makes code easier to maintain and extend.

---

## 5. Inheritance
Inheritance is the ability to build new classes on top of existing ones, reusing code and structure. The new class (subclass) inherits fields and methods from the parent class (superclass).

### Example (from the book):
- `Animal` is a superclass with fields and methods common to all animals.
- `Cat` and `Dog` are subclasses that inherit from `Animal`.
- `Cat` adds/overrides: isNasty, meow()
- `Dog` adds/overrides: bestFriend, bark()

#### UML Example:
```
Animal
  ^
  |
Cat   Dog
```

### Key Points
- Subclasses can override or extend behaviors from the superclass.
- In most languages, a class can extend only one superclass, but can implement multiple interfaces.

---

## 6. Polymorphism
Polymorphism is the ability of a program to detect the real class of an object and call its implementation, even when its real type is unknown in the current context.

### Example (from the book):
- `Animal` class has an abstract method: makeSound().
- `Cat` and `Dog` override makeSound():
  - Cat: makeSound() → "Meow!"
  - Dog: makeSound() → "Woof!"
- If you have a list of `Animal` objects (some cats, some dogs), you can call makeSound() on each, and the correct sound will be produced.

#### Example code:
```java
bag = [new Cat(), new Dog()];
foreach (Animal a : bag)
  a.makeSound();
// Output:
// Meow!
// Woof!
```

### Key Point
- Polymorphism allows objects to "pretend" to be their superclass or interface, enabling flexible and extensible code.

---

## 7. Relations Between Objects

### 1. Association
- One object uses or interacts with another, typically via a reference as a property or method parameter.
- Can be unidirectional or bidirectional.
- Represents "has a" or "relates to" relationships.

### 2. Dependency
- A weaker form of association. An object temporarily uses another (e.g., as a method parameter or local variable).
- No long-term ownership or storage.
- If class B changes, class A may need to change as well.

### 3. Composition
- Strong "whole-part" relationship; the component's lifecycle is bound to the container.
- If the container is destroyed, so are its components.

### 4. Aggregation
- Similar to composition, but looser. Components can exist independently or belong to multiple containers.
- "Has a" relationship, but does not control lifecycle.

> UML diagrams represent relations between classes, not individual objects. Quantities can be shown if needed.

## 7.1. Relations Between Objects: Detailed Explanation and TypeScript Examples

### 1. Association (Liên kết)
**Description:**
- One object uses or interacts with another, typically via a reference as a property or method parameter.
- Can be unidirectional or bidirectional.
- Represents "has a" or "relates to" relationships.

**UML:** Solid line with arrow between classes.

**TypeScript Example:**
```typescript
class Student {
  constructor(public name: string) {}
}

class Professor {
  students: Student[];
  constructor(students: Student[]) {
    this.students = students; // Association: Professor has Students
  }
}

const alice = new Student("Alice");
const bob = new Student("Bob");
const prof = new Professor([alice, bob]);
```

---

### 2. Dependency (Phụ thuộc)
**Description:**
- A weaker form of association. An object temporarily uses another (e.g., as a method parameter or local variable).
- No long-term ownership or storage.
- If class B changes, class A may need to change as well.

**UML:** Dashed line with arrow.

**TypeScript Example:**
```typescript
class SalaryCalculator {
  calculate(professor: Professor): number {
    // ... logic
    return 1000;
  }
}

class Professor {
  requestSalary(calculator: SalaryCalculator): number {
    // Dependency: only uses SalaryCalculator temporarily
    return calculator.calculate(this);
  }
}
```

---

### 3. Composition (Thành phần bắt buộc - Quan hệ sở hữu mạnh)
**Description:**
- Strong "whole-part" relationship; the component's lifecycle is bound to the container.
- If the container is destroyed, so are its components.

**UML:** Filled diamond at the container end.

**TypeScript Example:**
```typescript
class Department {}

class University {
  departments: Department[];
  constructor() {
    // Departments are created and owned by University
    this.departments = [new Department(), new Department()];
  }
  // When University is destroyed, so are its Departments
}
```

---

### 4. Aggregation (Thành phần không bắt buộc - Quan hệ sở hữu yếu)
**Description:**
- Similar to composition, but looser. Components can exist independently or belong to multiple containers.
- "Has a" relationship, but does not control lifecycle.

**UML:** Empty diamond at the container end.

**TypeScript Example:**
```typescript
class Professor {}

class Department {
  professors: Professor[];
  constructor(professors: Professor[]) {
    // Professors can belong to multiple departments
    this.professors = professors;
  }
}

const profA = new Professor();
const profB = new Professor();
const dept1 = new Department([profA, profB]);
const dept2 = new Department([profA]); // profA belongs to both
```

---

### Summary Table

| Relationship   | Lifecycle Control      | UML Notation         | Notes                                      |
|---------------|-----------------------|----------------------|---------------------------------------------|
| Association   | Normal reference      | ─────────►           | As property, can be bidirectional           |
| Dependency    | Temporary use         | - - - - - - - -►     | Via parameter or local variable             |
| Composition   | Strong ownership      | ◆────────►           | Component cannot exist independently        |
| Aggregation   | Weak ownership        | ◇────────►           | Component can be shared/independent         |

---

**Summary:**
- **Association:** "has a" or "relates to"; stores a reference.
- **Dependency:** "uses temporarily"; no long-term reference.
- **Composition:** "owns strongly"; component's lifecycle tied to container.
- **Aggregation:** "owns weakly"; component can exist independently or be shared.
