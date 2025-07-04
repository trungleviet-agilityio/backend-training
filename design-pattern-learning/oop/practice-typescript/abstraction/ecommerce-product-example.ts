// Abstraction Example: E-commerce Domain
// Demonstrates abstraction with products using best practices

// EcommerceAbstractionIProduct: Interface for all products
interface EcommerceAbstractionIProduct {
  getPrice(): number;
  getDescription(): string;
}

// EcommerceAbstractionProduct: Abstract base class for products
abstract class EcommerceAbstractionProduct implements EcommerceAbstractionIProduct {
  constructor(protected name: string, protected basePrice: number) {}
  abstract getPrice(): number;
  abstract getDescription(): string;
}

// EcommerceAbstractionDigitalProduct: Concrete class for digital products
class EcommerceAbstractionDigitalProduct extends EcommerceAbstractionProduct {
  // Returns the base price (no shipping)
  getPrice() { return this.basePrice; }
  // Returns a description for digital product
  getDescription() { return `${this.name} (Digital)`; }
}

// EcommerceAbstractionPhysicalProduct: Concrete class for physical products
class EcommerceAbstractionPhysicalProduct extends EcommerceAbstractionProduct {
  constructor(name: string, basePrice: number, private shipping: number) {
    super(name, basePrice);
  }
  // Returns the total price including shipping
  getPrice() { return this.basePrice + this.shipping; }
  // Returns a description for physical product
  getDescription() { return `${this.name} (Physical)`; }
}

// --- DEMO ---
const ebook = new EcommerceAbstractionDigitalProduct('TypeScript Guide', 20);
const tshirt = new EcommerceAbstractionPhysicalProduct('T-Shirt', 15, 5);
console.log(ebook.getDescription(), ebook.getPrice()); // TypeScript Guide (Digital) 20
console.log(tshirt.getDescription(), tshirt.getPrice()); // T-Shirt (Physical) 20
