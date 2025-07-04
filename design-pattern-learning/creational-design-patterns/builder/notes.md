# Builder Pattern

**Also known as:** None
**Category:** Creational Design Patterns
**Main Goal:** Construct complex objects step by step, allowing you to produce different types and representations using the same construction code.

## Intent

**Builder** is a creational design pattern that lets you construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.

## Problem

Imagine a complex object that requires laborious, step-by-step initialization of many fields and nested objects. Such initialization code is usually buried inside a monstrous constructor with lots of parameters. Or even worse: scattered all over the client code.

**Two problematic approaches:**

### 1. Subclass Explosion
You might make the program too complex by creating a subclass for every possible configuration of an object.

For example, let's think about how to create a `House` object. To build a simple house, you need to construct four walls and a floor, install a door, fit a pair of windows, and build a roof. But what if you want a bigger, brighter house, with a backyard and other goodies (like a heating system, plumbing, and electrical wiring)?

The simplest solution is to extend the base `House` class and create a set of subclasses to cover all combinations of the parameters. But eventually you'll end up with a considerable number of subclasses. Any new parameter, such as the porch style, will require growing this hierarchy even more.

### 2. Telescoping Constructor
You can create a giant constructor right in the base `House` class with all possible parameters that control the house object. While this approach indeed eliminates the need for subclasses, it creates another problem.

The constructor with lots of parameters has its downside: not all the parameters are needed at all times. In most cases most of the parameters will be unused, making the constructor calls pretty ugly. For instance, only a fraction of houses have swimming pools, so the parameters related to swimming pools will be useless nine times out of ten.

## Solution

The Builder pattern suggests that you extract the object construction code out of its own class and move it to separate objects called **builders**.

The Builder pattern lets you construct complex objects step by step. The Builder doesn't allow other objects to access the product while it's being built.

The pattern organizes object construction into a set of steps (`buildWalls`, `buildDoor`, etc.). To create an object, you execute a series of these steps on a builder object. The important part is that you don't need to call all of the steps. You can call only those steps that are necessary for producing a particular configuration of an object.

Some of the construction steps might require different implementation when you need to build various representations of the product. For example, walls of a cabin may be built of wood, but the castle walls must be built with stone.

In this case, you can create several different builder classes that implement the same set of building steps, but in a different manner. Then you can use these builders in the construction process to produce different kinds of objects.

### Director

You can go further and extract a series of calls to the builder steps you use to construct a product into a separate class called **director**. The director class defines the order in which to execute the building steps, while the builder provides the implementation for those steps.

Having a director class in your program isn't strictly necessary. You can always call the building steps in a specific order directly from the client code. However, the director class might be a good place to put various construction routines so you can reuse them across your program.

In addition, the director class completely hides the details of product construction from the client code. The client only needs to associate a builder with a director, launch the construction with the director, and get the result from the builder.

## Structure

```
                    +------------------+
                    |     Director     |
                    |------------------|
                    | + construct()    |
                    +--------^---------+
                             |
                    +--------+---------+
                    |    Builder        |
                    |------------------|
                    | + reset()         |
                    | + buildPartA()    |
                    | + buildPartB()    |
                    | + buildPartC()    |
                    +--------^---------+
                             |
         +-------------------+-------------------+
         |                                       |
+----------------+                    +------------------+
| ConcreteBuilder1|                    | ConcreteBuilder2 |
|----------------|                    |------------------|
| + reset()      |                    | + reset()        |
| + buildPartA() |                    | + buildPartA()   |
| + buildPartB() |                    | + buildPartB()   |
| + buildPartC() |                    | + buildPartC()   |
| + getResult()  |                    | + getResult()    |
+--------^-------+                    +--------^---------+
         |                                       |
         v                                       v
+----------------+                    +------------------+
|   Product1     |                    |   Product2       |
+----------------+                    +------------------+
```

## Pseudocode Example

```typescript
// Products
class Car {
  // A car can have a GPS, trip computer and some number of seats.
  // Different models of cars might have different features installed.
}

class Manual {
  // Each car should have a user manual that corresponds to
  // the car's configuration and describes all its features.
}

// Builder Interface
interface Builder {
  reset(): void;
  setSeats(seats: number): void;
  setEngine(engine: string): void;
  setTripComputer(): void;
  setGPS(): void;
}

// Concrete Builders
class CarBuilder implements Builder {
  private car: Car;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.car = new Car();
  }

  setSeats(seats: number): void {
    // Set the number of seats in the car.
  }

  setEngine(engine: string): void {
    // Install a given engine.
  }

  setTripComputer(): void {
    // Install a trip computer.
  }

  setGPS(): void {
    // Install a global positioning system.
  }

  getResult(): Car {
    const result = this.car;
    this.reset();
    return result;
  }
}

class CarManualBuilder implements Builder {
  private manual: Manual;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.manual = new Manual();
  }

  setSeats(seats: number): void {
    // Document car seat features.
  }

  setEngine(engine: string): void {
    // Add engine instructions.
  }

  setTripComputer(): void {
    // Add trip computer instructions.
  }

  setGPS(): void {
    // Add GPS instructions.
  }

  getResult(): Manual {
    const result = this.manual;
    this.reset();
    return result;
  }
}

// Director
class Director {
  private builder: Builder;

  setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  constructSportsCar(builder: Builder): void {
    builder.reset();
    builder.setSeats(2);
    builder.setEngine("sport");
    builder.setTripComputer();
    builder.setGPS();
  }

  constructSUV(builder: Builder): void {
    builder.reset();
    builder.setSeats(4);
    builder.setEngine("diesel");
    builder.setGPS();
  }
}

// Client Code
function clientCode(): void {
  const director = new Director();
  const carBuilder = new CarBuilder();
  const manualBuilder = new CarManualBuilder();

  // Build a sports car
  director.constructSportsCar(carBuilder);
  const sportsCar = carBuilder.getResult();

  // Build a manual for the sports car
  director.constructSportsCar(manualBuilder);
  const sportsCarManual = manualBuilder.getResult();
}
```

## When to Use (Applicability)

| Situation | Should Use Builder? |
|-----------|-------------------|
| Constructor has many optional parameters | Yes - Perfect use case |
| Need to create different representations of the same product | Yes |
| Building complex objects with many steps and nested objects | Yes |
| Want to hide construction details from client | Yes |
| Need to reuse construction process for different products | Yes |

## How to Implement

1. **Make sure that you can clearly define the common construction steps** for building all available product representations. Otherwise, you won't be able to proceed with implementing the pattern.

2. **Declare these steps in the base builder interface.**

3. **Create a concrete builder class for each of the product representations** and implement their construction steps. Don't forget about implementing a method for fetching the result of the construction.

4. **Think about creating a director class.** It may encapsulate various ways to construct a product using the same builder object.

5. **The client code creates both the builder and the director objects.** Before construction starts, the client must pass a builder object to the director.

6. **The construction result can be obtained directly from the director** only if all products follow the same interface. Otherwise, the client should fetch the result from the builder.

## Pros and Cons

### Pros
- **Step-by-step construction**: You can construct objects step-by-step, defer construction steps or run steps recursively.
- **Reusability**: You can reuse the same construction code when building various representations of products.
- **Single Responsibility Principle**: You can isolate complex construction code from the business logic of the product.
- **Flexibility**: Can create different representations using the same construction process.

### Cons
- **Complexity**: The overall complexity of the code increases since the pattern requires creating multiple new classes.
- **Over-engineering**: For simple objects, this pattern might be overkill.

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| **Factory Method** | Builder is more flexible but more complex than Factory Method |
| **Abstract Factory** | Abstract Factory returns the product immediately, whereas Builder lets you run additional construction steps |
| **Prototype** | Builder can use Prototype to clone parts of the construction process |
| **Bridge** | Director class plays the role of abstraction, while different builders act as implementations |
| **Singleton** | Builders can be implemented as Singletons if needed |

## Quick Summary

**Goal**: Construct complex objects step by step with flexible configuration.

**Core**: Builder interface + Concrete Builders + Director (optional) + Client.

**Key Benefit**: Reusable construction process for different product representations.

**When to Use**: Complex objects with many optional parameters or different representations.

**Real applications**: Configuration builders, query builders, UI component builders.

---

**Reference:** [Builder Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/builder)
