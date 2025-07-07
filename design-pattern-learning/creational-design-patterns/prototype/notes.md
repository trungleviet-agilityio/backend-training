# Prototype Pattern

**Also known as:** Clone Pattern
**Category:** Creational Design Patterns
**Main Goal:** Create new objects by cloning existing ones, avoiding the need to know their specific classes.

## Problem

You have an object and want to create an exact copy of it.

The simplest approach would be:
- Create a new object of the same class
- Copy all fields from the original object to the new one

**But there are several issues:**
- You can't access private fields when copying from outside the class
- You must know the exact class to call its constructor → code becomes coupled to that class
- Sometimes you only know the interface, not the concrete class (e.g., when receiving objects from 3rd-party libraries)

## Solution

The Prototype pattern solves this by:

- Defining a `Prototype` interface with a `clone()` method
- Each object knows how to clone itself through the `clone()` method
- Cloning can copy private fields (since objects of the same class can access each other)
- You only need to call `someObject.clone()` without caring about its actual class
- No dependency on concrete classes → flexible and extensible code

## Real-World Analogy

The process of mitotic division in biology:
- A cell duplicates itself → creates an exact copy
- The original cell acts as a prototype and directly participates in creating the copy

## Structure

```
      +------------------------+       +------------------------+
      |     Prototype          |       |      Client           |
      |------------------------|       |------------------------|
      | + clone(): Prototype   |<------| + operation()          |
      +------------------------+       +------------------------+
                 ^
                 |
         +-------+-------+
         |               |
+----------------+ +----------------+
| ConcretePrototype1 | | ConcretePrototype2 |
|------------------| |------------------|
| + clone()        | | + clone()        |
+----------------+ +----------------+
```

## Pseudocode Example

```typescript
// Prototype interface
interface Shape {
  clone(): Shape;
  getInfo(): string;
}

// Concrete prototype
class Circle implements Shape {
  private x: number;
  private y: number;
  private radius: number;
  private color: string;

  constructor(source?: Circle) {
    if (source) {
      this.x = source.x;
      this.y = source.y;
      this.radius = source.radius;
      this.color = source.color;
    } else {
      this.x = 0;
      this.y = 0;
      this.radius = 0;
      this.color = 'black';
    }
  }

  clone(): Shape {
    return new Circle(this);
  }

  getInfo(): string {
    return `Circle at (${this.x}, ${this.y}) with radius ${this.radius}, color: ${this.color}`;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setRadius(radius: number): void {
    this.radius = radius;
  }

  setColor(color: string): void {
    this.color = color;
  }
}

// Client code
const originalCircle = new Circle();
originalCircle.setPosition(10, 20);
originalCircle.setRadius(5);
originalCircle.setColor('red');

const clonedCircle = originalCircle.clone(); // Exact copy
```

## How to Implement

1. **Create the prototype interface**
   - Declare a `clone()` method in the interface
   - All classes that want to use this pattern must implement it

2. **Create a copy constructor**
   - Each class has a constructor that accepts a source object to copy fields from
   - If it's a subclass → must call `super(source)` to copy fields from parent class

3. **Implement clone() by calling the copy constructor**
   ```typescript
   clone(): Prototype {
     return new ConcreteClass(this);
   }
   ```

4. **Optionally create a prototype registry**
   - A class that stores ready-made prototypes
   ```typescript
   const registry = {
     'default_circle': new Circle(10),
     'small_rect': new Rectangle(5, 5),
   };
   ```
   - Client just needs: `registry['default_circle'].clone()`

## When to Use (Applicability)

| Situation | Should Use Prototype? |
|-----------|----------------------|
| Want to create objects without knowing their exact classes | Yes |
| Want to reduce number of subclasses used only for preset configurations | Yes |
| Need to copy complex objects with many configurations | Yes |
| Working with objects from external sources, only knowing their interface | Yes |
| Want to avoid building objects step by step | Yes |

## Pros and Cons

| Pros | Cons |
|------|------|
| No dependency on concrete classes | Cloning complex objects with circular references is difficult |
| Reduces number of subclasses | Must write clone logic for each class |
| Easy to copy pre-configured objects | May need deep copy if objects are nested |
| Don't need to recreate objects from scratch | Not suitable if objects need to recreate external resources (network, files, etc.) |

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Factory Method | Prototype is simpler when you need to clone objects |
| Abstract Factory | Can use Prototype to create sample objects |
| Memento | Prototype is an alternative if objects are simple |
| Composite / Decorator | Use Prototype to clone complex structure trees |
| Singleton | Prototype registry can be a Singleton |

## Quick Summary

**Goal**: Create new objects by cloning existing ones without knowing their classes.

**Core**: Prototype → defines `clone()` method → ConcretePrototype implements it → Client calls `clone()` instead of `new`.

**Real applications**: Object pools, configuration management, game development (spawning enemies), document templates.

**Reference:** [Prototype Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/prototype)
