/**
 * Proxy Pattern Example: Order Fulfillment System
 *
 * Demonstrates a proxy (OrderFulfillment) that delegates order processing to real warehouses.
 * The proxy controls which warehouse fulfills the order based on stock availability.
 */

// ===== Interface =====
interface IOrder {
  fulfillOrder(order: Order): void;
}

// ===== Order class =====
class Order {
  constructor(public item: string, public quantity: number) {}
}

// ===== RealSubject: Warehouse =====
class Warehouse implements IOrder {
  private stock: Map<string, number>;
  constructor(public address: string, initialStock: { [item: string]: number }) {
    this.stock = new Map(Object.entries(initialStock));
  }

  fulfillOrder(order: Order): void {
    const available = this.stock.get(order.item) || 0;
    if (available >= order.quantity) {
      this.stock.set(order.item, available - order.quantity);
      console.log(
        `Order for ${order.quantity} ${order.item}(s) fulfilled by warehouse at ${this.address}`
      );
    } else {
      console.log(
        `Warehouse at ${this.address} cannot fulfill order for ${order.quantity} ${order.item}(s). Only ${available} in stock.`
      );
    }
  }

  // For proxy to check stock
  canFulfill(order: Order): boolean {
    return (this.stock.get(order.item) || 0) >= order.quantity;
  }
}

// ===== Proxy: OrderFulfillment =====
class OrderFulfillment implements IOrder {
  private warehouses: Warehouse[] = [];

  addWarehouse(warehouse: Warehouse): void {
    this.warehouses.push(warehouse);
  }

  fulfillOrder(order: Order): void {
    // Try to find a warehouse that can fulfill the order
    for (const warehouse of this.warehouses) {
      if (warehouse.canFulfill(order)) {
        warehouse.fulfillOrder(order);
        return;
      }
    }
    console.log(
      `Order for ${order.quantity} ${order.item}(s) could not be fulfilled by any warehouse.`
    );
  }
}

// ===== Demo =====
const warehouse1 = new Warehouse("Hanoi", { pen: 10, notebook: 5 });
const warehouse2 = new Warehouse("Saigon", { pen: 2, notebook: 20 });

const fulfillment = new OrderFulfillment();
fulfillment.addWarehouse(warehouse1);
fulfillment.addWarehouse(warehouse2);

const order1 = new Order("pen", 3);
const order2 = new Order("notebook", 15);
const order3 = new Order("pen", 20);

// Fulfilled by Hanoi
fulfillment.fulfillOrder(order1); // Fulfilled by Hanoi
fulfillment.fulfillOrder(order2); // Fulfilled by Saigon
fulfillment.fulfillOrder(order3); // Cannot be fulfilled
