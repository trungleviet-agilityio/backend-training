# OOP Notes

This folder contains concise notes on Object-Oriented Programming (OOP) concepts, based on the book's examples.

## Notes
- `objects-and-classes.md`: Explains objects and classes with cat examples.
- `class-hierarchies.md`: Describes class hierarchies using Animal, Cat, Dog, etc.
- `abstraction.md`: Covers abstraction with airplane examples.
- `encapsulation.md`: Explains encapsulation with car and interface examples.
- `inheritance.md`: Discusses inheritance with Animal, Cat, Dog.
- `polymorphism.md`: Explains polymorphism with makeSound example.
- `relations-between-objects.md`: Describes association, dependency, composition, aggregation.

## Practice
A subfolder `practice-typescript/` is provided for you to implement and experiment with the book's examples in TypeScript. Each OOP concept has its own folder, and each folder contains multiple real-world example files.

---

## How to Test the TypeScript Practice Files

### Prerequisites
- Node.js (v18 or newer recommended)
- TypeScript and ts-node installed globally:
  ```sh
  npm install -g typescript ts-node
  ```
- (Optional) A `tsconfig.json` is already provided in the project root.

### Running an Example

1. Navigate to the `practice-typescript` folder:
   ```sh
   cd design-parttern-learning/oop/practice-typescript
   ```
2. Run an example file using ts-node:
   ```sh
   ts-node abstraction/ecommerce-product-example.ts
   ts-node abstraction/messaging-service-example.ts
   ts-node advanced/plugin-system-example.ts
   # ...and so on for any file
   ```
   - If you use Node.js v20+ and encounter ESM errors, add the loader flag:
     ```sh
     ts-node --loader ts-node/esm abstraction/ecommerce-product-example.ts
     ```
3. You should see output in your terminal demonstrating the concept.

### Tips
- Each file is self-contained and can be run independently.
- You can add your own examples or extend the folders as you learn.
- If you install ts-node locally, use `npx ts-node ...` instead of `ts-node ...`.

---
