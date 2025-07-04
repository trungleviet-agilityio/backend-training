/**
 * Abstract Factory Pattern - TypeScript Implementation
 *
 * This example demonstrates the Abstract Factory pattern using a furniture store
 * where different style families (Modern, Victorian, ArtDeco) can create
 * consistent sets of furniture products.
 */

// ============================================================================
// ABSTRACT PRODUCTS
// ============================================================================

interface Chair {
  sitOn(): void;
  getStyle(): string;
  getPrice(): number;
}

interface Sofa {
  lieOn(): void;
  getStyle(): string;
  getPrice(): number;
}

interface CoffeeTable {
  putCoffee(): void;
  getStyle(): string;
  getPrice(): number;
}

// ============================================================================
// CONCRETE PRODUCTS - MODERN STYLE
// ============================================================================

class ModernChair implements Chair {
  sitOn(): void {
    console.log("Sitting on a sleek, minimalist modern chair");
  }

  getStyle(): string {
    return "Modern";
  }

  getPrice(): number {
    return 150;
  }
}

class ModernSofa implements Sofa {
  lieOn(): void {
    console.log("Lying on a comfortable modern sofa with clean lines");
  }

  getStyle(): string {
    return "Modern";
  }

  getPrice(): number {
    return 800;
  }
}

class ModernCoffeeTable implements CoffeeTable {
  putCoffee(): void {
    console.log("Placing coffee on a glass and metal modern coffee table");
  }

  getStyle(): string {
    return "Modern";
  }

  getPrice(): number {
    return 200;
  }
}

// ============================================================================
// CONCRETE PRODUCTS - VICTORIAN STYLE
// ============================================================================

class VictorianChair implements Chair {
  sitOn(): void {
    console.log("Sitting on an ornate, upholstered Victorian chair");
  }

  getStyle(): string {
    return "Victorian";
  }

  getPrice(): number {
    return 300;
  }
}

class VictorianSofa implements Sofa {
  lieOn(): void {
    console.log("Lying on a luxurious Victorian sofa with detailed carvings");
  }

  getStyle(): string {
    return "Victorian";
  }

  getPrice(): number {
    return 1200;
  }
}

class VictorianCoffeeTable implements CoffeeTable {
  putCoffee(): void {
    console.log("Placing coffee on an elegant wooden Victorian coffee table");
  }

  getStyle(): string {
    return "Victorian";
  }

  getPrice(): number {
    return 400;
  }
}

// ============================================================================
// CONCRETE PRODUCTS - ART DECO STYLE
// ============================================================================

class ArtDecoChair implements Chair {
  sitOn(): void {
    console.log("Sitting on a geometric, luxurious Art Deco chair");
  }

  getStyle(): string {
    return "ArtDeco";
  }

  getPrice(): number {
    return 250;
  }
}

class ArtDecoSofa implements Sofa {
  lieOn(): void {
    console.log("Lying on a sophisticated Art Deco sofa with bold patterns");
  }

  getStyle(): string {
    return "ArtDeco";
  }

  getPrice(): number {
    return 1000;
  }
}

class ArtDecoCoffeeTable implements CoffeeTable {
  putCoffee(): void {
    console.log("Placing coffee on a stylish Art Deco coffee table");
  }

  getStyle(): string {
    return "ArtDeco";
  }

  getPrice(): number {
    return 350;
  }
}

// ============================================================================
// ABSTRACT FACTORY
// ============================================================================

interface FurnitureFactory {
  createChair(): Chair;
  createSofa(): Sofa;
  createCoffeeTable(): CoffeeTable;
}

// ============================================================================
// CONCRETE FACTORIES
// ============================================================================

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

class ArtDecoFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new ArtDecoChair();
  }

  createSofa(): Sofa {
    return new ArtDecoSofa();
  }

  createCoffeeTable(): CoffeeTable {
    return new ArtDecoCoffeeTable();
  }
}

// ============================================================================
// CLIENT CODE
// ============================================================================

class FurnitureClient {
  private factory: FurnitureFactory;

  constructor(factory: FurnitureFactory) {
    this.factory = factory;
  }

  createLivingRoomSet(): void {
    console.log(`Creating a ${this.factory.createChair().getStyle()} living room set:`);

    const chair = this.factory.createChair();
    const sofa = this.factory.createSofa();
    const coffeeTable = this.factory.createCoffeeTable();

    console.log("\nTesting the furniture:");
    chair.sitOn();
    sofa.lieOn();
    coffeeTable.putCoffee();

    const totalPrice = chair.getPrice() + sofa.getPrice() + coffeeTable.getPrice();
    console.log(`\nTotal price: $${totalPrice}`);
    console.log("All furniture is consistent in style!");
  }

  createOfficeSet(): void {
    console.log(`Creating a ${this.factory.createChair().getStyle()} office set:`);

    const chair = this.factory.createChair();
    const coffeeTable = this.factory.createCoffeeTable();

    console.log("\nTesting the office furniture:");
    chair.sitOn();
    coffeeTable.putCoffee();

    const totalPrice = chair.getPrice() + coffeeTable.getPrice();
    console.log(`\nTotal price: $${totalPrice}`);
  }
}

// ============================================================================
// FACTORY SELECTOR
// ============================================================================

type FurnitureStyle = 'modern' | 'victorian' | 'artdeco';

class FurnitureFactorySelector {
  static createFactory(style: FurnitureStyle): FurnitureFactory {
    switch (style) {
      case 'modern':
        return new ModernFurnitureFactory();
      case 'victorian':
        return new VictorianFurnitureFactory();
      case 'artdeco':
        return new ArtDecoFurnitureFactory();
      default:
        throw new Error(`Unknown furniture style: ${style}`);
    }
  }
}

// ============================================================================
// DEMONSTRATION FUNCTIONS
// ============================================================================

function demonstrateAbstractFactory(): void {
  console.log("=== Abstract Factory Pattern Demo ===\n");

  const styles: FurnitureStyle[] = ['modern', 'victorian', 'artdeco'];

  styles.forEach(style => {
    console.log(`\n--- ${style.toUpperCase()} STYLE ---`);
    const factory = FurnitureFactorySelector.createFactory(style);
    const client = new FurnitureClient(factory);
    client.createLivingRoomSet();
  });
}

function demonstrateOfficeFurniture(): void {
  console.log("\n=== Office Furniture Demo ===\n");

  const modernFactory = FurnitureFactorySelector.createFactory('modern');
  const client = new FurnitureClient(modernFactory);
  client.createOfficeSet();
}

function demonstrateFactoryConsistency(): void {
  console.log("\n=== Factory Consistency Demo ===\n");

  const modernFactory = new ModernFurnitureFactory();

  // Create multiple pieces from the same factory
  const chair1 = modernFactory.createChair();
  const chair2 = modernFactory.createChair();
  const sofa = modernFactory.createSofa();

  console.log("All pieces from Modern Factory:");
  console.log(`Chair 1 style: ${chair1.getStyle()}`);
  console.log(`Chair 2 style: ${chair2.getStyle()}`);
  console.log(`Sofa style: ${sofa.getStyle()}`);
  console.log("All pieces are consistent in style!");
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

demonstrateAbstractFactory();
demonstrateOfficeFurniture();
demonstrateFactoryConsistency();

export {
  Chair,
  Sofa,
  CoffeeTable,
  FurnitureFactory,
  ModernFurnitureFactory,
  VictorianFurnitureFactory,
  ArtDecoFurnitureFactory,
  FurnitureClient,
  FurnitureFactorySelector,
  demonstrateAbstractFactory,
  demonstrateOfficeFurniture,
  demonstrateFactoryConsistency
};
