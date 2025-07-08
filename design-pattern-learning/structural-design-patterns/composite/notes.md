# Composite Pattern

**Category:** Structural Design Patterns
**Main Goal:** Treat individual objects and compositions of objects uniformly via a common interface, enabling tree-like structures.

## Problem

You need to build a system (e.g., an order system) where:
- An order can contain individual products (leaves)
- Or boxes (composites), which can contain products or other boxes, nested to any depth

Calculating the total price or performing operations on such a nested structure is complex if you must flatten the structure or check types (product vs. box) everywhere.

## Solution

Composite Pattern allows you to:
- Define a common interface (e.g., `IItem`) for both products (leaves) and boxes (composites)
- Let composites (boxes) contain a list of `IItem` (which can be products or other boxes)
- Call the same method (e.g., `getPrice()`) on both products and boxes, letting recursion handle the tree

## Real-World Analogy

**File system:**
- Files are leaves
- Folders (directories) are composites that can contain files or other folders
- You can perform operations like `getSize()` or `delete()` on both files and folders using the same interface

## Structure

```
      +-----------------+
      |   IItem         |  <--- Component (interface)
      +-----------------+
           ^        ^
   +------------+  +--------------+
   |  Product   |  |     Box      |
   |  (Leaf)    |  | (Composite)  |
   +------------+  +--------------+
                      |
           contains list of IItem
```

## Pseudocode Example (TypeScript)

```typescript
// Component
interface IItem {
  getPrice(): number;
  getName(): string;
}

// Leaf
class Product implements IItem {
  constructor(private name: string, private price: number) {}
  getPrice(): number { return this.price; }
  getName(): string { return this.name; }
}

// Composite
class Box implements IItem {
  private items: IItem[] = [];
  constructor(private name: string) {}
  add(item: IItem): void { this.items.push(item); }
  getPrice(): number { return this.items.reduce((sum, item) => sum + item.getPrice(), 0); }
  getName(): string { return this.name; }
}

// Usage
const pen = new Product("Pen", 2);
const notebook = new Product("Notebook", 5);
const smallBox = new Box("Small Box");
smallBox.add(pen);
const bigBox = new Box("Big Box");
bigBox.add(smallBox);
bigBox.add(notebook);
console.log(bigBox.getPrice()); // Output: 7
```

## How to Implement

1. **Define a common interface** for both leaves and composites (e.g., `IItem` with `getPrice()`)
2. **Implement the leaf class** (e.g., `Product`) that implements the interface
3. **Implement the composite class** (e.g., `Box`) that also implements the interface and contains a list of the interface type
4. **Composite methods** (e.g., `getPrice()`) should call the same method on all children, enabling recursion
5. **Client code** works only with the interface, not caring if it is a leaf or composite

## When to Use (Applicability)

| Situation | Should Use Composite? |
|-----------|----------------------|
| Need to represent part-whole hierarchies (tree structures) | Yes |
| Want to treat individual objects and groups uniformly | Yes |
| Need to support recursive structures (folders, menus, etc.) | Yes |

## Pros and Cons

| Pros | Cons |
|------|------|
| Uniformity: treat leaves and composites the same | Interface may be overgeneralized (leaves may have unused methods) |
| Easy to add new leaf/composite types | Debugging can be harder due to recursion |
| Supports recursive operations naturally | |

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Decorator | Also uses composition, but for adding behavior, not tree structure |
| Facade | Simplifies interface, but does not create tree structures |
| Visitor | Can be used to perform operations across the composite tree |
| Iterator | Can traverse composite trees without exposing structure |

## Quick Summary

**Goal:** Treat individual objects and compositions uniformly, enabling recursive tree structures.

**Core:** Common interface → Leaf and Composite both implement → Composite contains list of interface type → Client uses interface only.

**Real applications:** File systems, DOM trees, graphics editors, organization charts, menus, military hierarchies.

**Reference:** [Composite Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/composite)
