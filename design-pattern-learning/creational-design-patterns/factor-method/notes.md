# Factory Method Pattern

**Also known as:** Virtual Constructor
**Category:** Creational Design Patterns
**Main Goal:** Avoid creating concrete objects directly in code, delegate this responsibility to subclasses.

## Problem

You're developing a logistics management application that initially only supports truck transportation. Most of your code is tightly coupled to the `Truck` class.

When you need to extend with new transportation methods like `Ship`, you must:

- Change many places in the code
- Write many if-else or switch statements to select transportation types
- Modify existing code each time you add a new transportation method (violating Open/Closed Principle)
- Code becomes messy and hard to extend

## Solution

Factory Method suggests:

- Instead of calling `new Truck()` directly, call a factory method: `createTransport()`
- Base class defines `createTransport()` (can be abstract)
- Subclasses (Concrete Creators) override this method to return specific objects like `Truck`, `Ship`, `Bike`, etc.

**Benefits:**

- Client code only works with common interface (`Transport`), doesn't know/care about specific objects
- Easy to extend with new transports without modifying client code

## Structure

```
      +------------------------+       +------------------------+
      |     Creator            |<>-----|       Product          |
      |------------------------|       |------------------------|
      | + factoryMethod()      |       | + deliver()            |
      | + render()             |       +------------------------+
      +-----------^------------+
                  |
         +--------+---------+
         |                  |
+----------------+   +----------------+
| RoadLogistics  |   | SeaLogistics   |
|----------------|   |----------------|
| + factoryMethod|   | + factoryMethod|
+----------------+   +----------------+
        |                      |
        v                      v
+---------------+      +---------------+
|    Truck      |      |     Ship      |
+---------------+      +---------------+
```

## Pseudocode Example

```typescript
// Product interface
interface Transport {
  deliver(): void;
}

// Concrete Products
class Truck implements Transport {
  deliver(): void {
    console.log("Deliver by land in a box.");
  }
}

class Ship implements Transport {
  deliver(): void {
    console.log("Deliver by sea in a container.");
  }
}

// Creator (abstract)
abstract class Logistics {
  planDelivery(): void {
    const transport = this.createTransport();
    transport.deliver();
  }

  abstract createTransport(): Transport;
}

// Concrete Creators
class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}

// Client Code
function main() {
  const logistics = new SeaLogistics();
  logistics.planDelivery(); // Output: Deliver by sea in a container.
}
```

## When to Use (Applicability)

| Situation | Should Use Factory Method? |
|-----------|---------------------------|
| Don't know exact object types beforehand | Yes |
| Want to easily extend system (add new products) | Yes |
| Want to encapsulate object initialization logic | Yes |
| Have existing inheritance hierarchy | Very suitable |
| Want to reuse objects (object pool, caching) | Can apply |

## How to Implement

1. **Make all products follow the same interface.** This interface should declare methods that make sense in every product.

2. **Add an empty factory method inside the creator class.** The return type of the method should match the common product interface.

3. **In the creator's code find all references to product constructors.** One by one, replace them with calls to the factory method, while extracting the product creation code into the factory method.

   You might need to add a temporary parameter to the factory method to control the type of returned product.

   At this point, the code of the factory method may look pretty ugly. It may have a large switch operator that picks which product class to instantiate. But don't worry, we'll fix it soon enough.

4. **Now, create a set of creator subclasses for each type of product listed in the factory method.** Override the factory method in the subclasses and extract the appropriate bits of construction code from the base method.

5. **If there are too many product types and it doesn't make sense to create subclasses for all of them, you can reuse the control parameter from the base class in subclasses.**

   For instance, imagine that you have the following hierarchy of classes: the base `Mail` class with a couple of subclasses: `AirMail` and `GroundMail`; the `Transport` classes are `Plane`, `Truck` and `Train`. While the `AirMail` class only uses `Plane` objects, `GroundMail` may work with both `Truck` and `Train` objects. You can create a new subclass (say `TrainMail`) to handle both cases, but there's another option. The client code can pass an argument to the factory method of the `GroundMail` class to control which product it wants to receive.

6. **If, after all of the extractions, the base factory method has become empty, you can make it abstract.** If there's something left, you can make it a default behavior of the method.

## Pros and Cons

| Pros | Cons |
|------|------|
| Reduces coupling between client and concrete classes | Increases number of classes in system |
| Follows Open/Closed Principle | Code becomes slightly complex for beginners |
| Easy to extend — adding new products doesn't affect existing code | |
| Allows object reuse (object pool/cache) easily | |

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Abstract Factory | Uses multiple Factory Methods to create product families |
| Prototype | Avoids inheritance by cloning objects instead of creating new ones |
| Template Method | Factory Method is a specific step in Template Method |
| Builder | If complex initialization with multiple steps — use Builder instead of Factory |

## Quick Summary

**Goal**: Separate object creation logic from usage logic.

**Core**: Creator → defines `createProduct()` method → overridden by ConcreteCreator to return ConcreteProduct.

**Real applications**: UI frameworks, plugin systems, cross-platform applications.

**Reference:** [Factory Method Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/factory-method)
