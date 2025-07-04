# Abstract Factory Pattern

**Also known as:** Kit
**Category:** Creational Design Patterns
**Main Goal:** Create families of related objects without specifying their concrete classes.

## Intent

**Abstract Factory** is a creational design pattern that lets you produce families of related objects without specifying their concrete classes.

## Problem

Imagine that you're creating a furniture shop simulator. Your code consists of classes that represent:

1. **A family of related products**, say: `Chair` + `Sofa` + `CoffeeTable`
2. **Several variants of this family**. For example, products `Chair` + `Sofa` + `CoffeeTable` are available in these variants: `Modern`, `Victorian`, `ArtDeco`

**Key Issues:**

- You need a way to create individual furniture objects so that they match other objects of the same family
- Customers get quite mad when they receive non-matching furniture (e.g., a Modern-style sofa doesn't match Victorian-style chairs)
- You don't want to change existing code when adding new products or families of products to the program
- Furniture vendors update their catalogs very often, and you wouldn't want to change the core code each time it happens

**Problems with direct instantiation:**

- Hard to ensure consistency between products
- Client code becomes dependent on concrete classes → difficult to extend and maintain
- Violates Open/Closed Principle
- Code becomes messy with many conditional statements

## Solution

The Abstract Factory pattern suggests a systematic approach:

### Step 1: Declare Abstract Product Interfaces
Explicitly declare interfaces for each distinct product of the product family (e.g., chair, sofa, coffee table). Then make all variants of products follow those interfaces.

- All chair variants implement the `Chair` interface
- All sofa variants implement the `Sofa` interface
- All coffee table variants implement the `CoffeeTable` interface

### Step 2: Create Abstract Factory Interface
Declare the **Abstract Factory**—an interface with a list of creation methods for all products that are part of the product family (e.g., `createChair`, `createSofa`, `createCoffeeTable`). These methods must return **abstract** product types represented by the interfaces.

### Step 3: Implement Concrete Factories
For each variant of a product family, create a separate factory class based on the `AbstractFactory` interface. Each factory returns products of a particular kind:

- `ModernFurnitureFactory` → creates `ModernChair`, `ModernSofa`, `ModernCoffeeTable`
- `VictorianFurnitureFactory` → creates `VictorianChair`, `VictorianSofa`, `VictorianCoffeeTable`
- `ArtDecoFurnitureFactory` → creates `ArtDecoChair`, `ArtDecoSofa`, `ArtDecoCoffeeTable`

### Step 4: Client Code Works with Abstractions
The client code works with both factories and products via their respective abstract interfaces. This lets you change the type of factory and product variants without breaking the client code.

**Benefits:**

- When client wants to create a Modern furniture set, it only needs to use `ModernFactory`
- All created products will be consistent and compatible
- Client doesn't need to know concrete classes
- Easy to extend with new variants without modifying existing code

## Structure

```
                        +----------------------+
                        |   AbstractFactory    |
                        |----------------------|
                        | + createChair()      |
                        | + createSofa()       |
                        | + createCoffeeTable()|
                        +----------^-----------+
                                   |
         +-------------------------+--------------------------+
         |                                                    |
+-------------------+                             +---------------------+
|   ModernFactory    |                             |  VictorianFactory   |
|-------------------|                             |---------------------|
| + createChair()   |                             | + createChair()     |
| + createSofa()    |                             | + createSofa()      |
| + createCoffeeTable|                            | + createCoffeeTable |
+---------^---------+                             +----------^----------+
          |                                                   |
  +-------+------+                                   +--------+--------+
  |   ModernChair |                                   | VictorianChair |
  |   ModernSofa  |                                   | VictorianSofa  |
  |ModernCoffeeTable|                                 |VictorianCoffeeTable|
  +---------------+                                   +----------------+
```

## Pseudocode Example

```typescript
// Abstract Products
interface Chair {
  sitOn(): void;
}

interface Sofa {
  lieOn(): void;
}

interface CoffeeTable {
  putCoffee(): void;
}

// Concrete Products - Modern
class ModernChair implements Chair {
  sitOn(): void {
    console.log("Sitting on a modern chair.");
  }
}

class ModernSofa implements Sofa {
  lieOn(): void {
    console.log("Lying on a modern sofa.");
  }
}

class ModernCoffeeTable implements CoffeeTable {
  putCoffee(): void {
    console.log("Putting coffee on a modern coffee table.");
  }
}

// Concrete Products - Victorian
class VictorianChair implements Chair {
  sitOn(): void {
    console.log("Sitting on a victorian chair.");
  }
}

class VictorianSofa implements Sofa {
  lieOn(): void {
    console.log("Lying on a victorian sofa.");
  }
}

class VictorianCoffeeTable implements CoffeeTable {
  putCoffee(): void {
    console.log("Putting coffee on a victorian coffee table.");
  }
}

// Abstract Factory
interface FurnitureFactory {
  createChair(): Chair;
  createSofa(): Sofa;
  createCoffeeTable(): CoffeeTable;
}

// Concrete Factories
class ModernFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new ModernChair();
  }

  createSofa(): Sofa {
    return new ModernSofa();
  }

  createCoffeeTable(): CoffeeTable {
    return new ModernCoffeeTable();
  }
}

class VictorianFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new VictorianChair();
  }

  createSofa(): Sofa {
    return new VictorianSofa();
  }

  createCoffeeTable(): CoffeeTable {
    return new VictorianCoffeeTable();
  }
}

// Client code
function clientCode(factory: FurnitureFactory): void {
  const chair = factory.createChair();
  const sofa = factory.createSofa();
  const coffeeTable = factory.createCoffeeTable();

  chair.sitOn();
  sofa.lieOn();
  coffeeTable.putCoffee();
}

// Usage
clientCode(new ModernFurnitureFactory());  // All modern
clientCode(new VictorianFurnitureFactory());  // All victorian
```

## When to Use (Applicability)

**Use the Abstract Factory when your code needs to work with various families of related products, but you don't want it to depend on the concrete classes of those products—they might be unknown beforehand or you simply want to allow for future extensibility.**

| Situation | Should Use Abstract Factory? |
|-----------|------------------------------|
| Need to create multiple related objects that are consistent with each other | Yes - Very suitable |
| Want to hide concrete classes and work only with common interfaces | Yes |
| Need to easily extend the program when adding new variants | Yes |
| Have many factory methods in the same class → should separate factories | Yes |
| Want to ensure product compatibility within families | Yes - Perfect use case |
| Need to support multiple product families with different variants | Yes |

**Consider implementing the Abstract Factory when you have a class with a set of Factory Methods that blur its primary responsibility.**

In a well-designed program, each class is responsible only for one thing. When a class deals with multiple product types, it may be worth extracting its factory methods into a stand-alone factory class or a full-blown Abstract Factory implementation.

## How to Implement

1. **Map out a matrix** of distinct product types versus variants of these products.
2. **Declare abstract product interfaces** for all product types. Then make all concrete product classes implement these interfaces.
3. **Declare the abstract factory interface** with a set of creation methods for all abstract products.
4. **Implement a set of concrete factory classes**, one for each product variant.
5. **Create factory initialization code** somewhere in the app. It should instantiate one of the concrete factory classes, depending on the application configuration or the current environment. Pass this factory object to all classes that construct products.
6. **Scan through the code** and find all direct calls to product constructors. Replace them with calls to the appropriate creation method on the factory object.

## Pros and Cons

### Pros
- **Product Compatibility**: You can be sure that the products you're getting from a factory are compatible with each other.
- **Loose Coupling**: You avoid tight coupling between concrete products and client code.
- **Single Responsibility Principle**: You can extract the product creation code into one place, making the code easier to support.
- **Open/Closed Principle**: You can introduce new variants of products without breaking existing client code.
- **Consistency**: Ensures all products from the same factory follow the same design theme.

### Cons
- **Complexity**: The code may become more complicated than it should be, since a lot of new interfaces and classes are introduced along with the pattern.
- **Over-engineering**: For simple scenarios, this pattern might be overkill.
- **Learning curve**: More complex than Factory Method pattern.

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| **Factory Method** | Abstract Factory = collection of multiple Factory Methods. Many designs start with Factory Method and evolve toward Abstract Factory. |
| **Builder** | Builder focuses on constructing complex objects step by step. Abstract Factory specializes in creating families of related objects. Abstract Factory returns the product immediately, whereas Builder lets you run additional construction steps. |
| **Prototype** | Uses cloning to create copies instead of new (sometimes combined with Abstract Factory). Abstract Factory classes are often based on a set of Factory Methods, but you can also use Prototype to compose the methods. |
| **Facade** | Abstract Factory can serve as an alternative to Facade when you only want to hide the way subsystem objects are created from the client code. |
| **Bridge** | You can use Abstract Factory along with Bridge. This pairing is useful when some abstractions defined by Bridge can only work with specific implementations. Abstract Factory can encapsulate these relations. |
| **Singleton** | Abstract Factories, Builders and Prototypes can all be implemented as Singletons. |

## Real-World Applications

- **UI Frameworks**: Creating consistent UI components for different platforms (Windows, macOS, Linux)
- **Database Drivers**: Creating related database objects (connection, query, result) for different database systems
- **Cross-Platform Applications**: Creating platform-specific implementations while maintaining consistent interfaces
- **Game Development**: Creating consistent game objects for different themes or difficulty levels
- **E-commerce Systems**: Creating product families with different pricing tiers or categories
- **Configuration Management**: Creating sets of related configuration objects for different environments

## Quick Summary

**Goal**: Create families of related objects that are consistent with each other.

**Core**: Abstract Factory interface + Concrete Factories that create related product families.

**Key Benefit**: Ensures product consistency and compatibility within families.

**When to Use**: When you need multiple related objects that must work together harmoniously.

**Complexity**: More complex than Factory Method, but provides better product family management.

---

**Reference:** [Abstract Factory Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/abstract-factory)
