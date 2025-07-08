/**
 * Composite Pattern Example: Order System (Product & Box)
 *
 * Demonstrates treating individual products and boxes (which can contain products or other boxes)
 * uniformly using a common interface (IItem).
 */

// Component interface
export interface IItem {
  getPrice(): number;
  getName(): string;
}

// Leaf: Product
export class Product implements IItem {
  constructor(private name: string, private price: number) {}
  getPrice(): number { return this.price; }
  getName(): string { return this.name; }
}

// Composite: Box
export class Box implements IItem {
  private items: IItem[] = [];
  constructor(private name: string) {}
  add(item: IItem): void { this.items.push(item); }
  getPrice(): number { return this.items.reduce((sum, item) => sum + item.getPrice(), 0); }
  getName(): string { return this.name; }
  listContents(indent: string = ""): void {
    console.log(`${indent}${this.getName()} (Box)`);
    for (const item of this.items) {
      if (item instanceof Box) {
        (item as Box).listContents(indent + "  ");
      } else {
        console.log(`${indent}  ${item.getName()} (Product): $${item.getPrice()}`);
      }
    }
  }
}

// Demo function
export function demonstrateCompositePattern(): void {
  console.log("=== Composite Pattern Demo ===\n");

  // Create products
  const pen = new Product("Pen", 2);
  const notebook = new Product("Notebook", 5);
  const pencil = new Product("Pencil", 1);

  // Small box with a pen and pencil
  const smallBox = new Box("Small Box");
  smallBox.add(pen);
  smallBox.add(pencil);

  // Big box with small box and notebook
  const bigBox = new Box("Big Box");
  bigBox.add(smallBox);
  bigBox.add(notebook);

  // List contents and total price
  bigBox.listContents();
  console.log(`\nTotal price: $${bigBox.getPrice()}`);
}
