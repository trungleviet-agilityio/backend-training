/**
 * Factory Method Pattern - TypeScript Implementation
 *
 * This example demonstrates the Factory Method pattern using a logistics management system
 * where different types of transportation can be created without coupling the client code
 * to concrete classes.
 */

// ============================================================================
// PRODUCT INTERFACE
// ============================================================================

interface Transport {
  deliver(): void;
  getTransportInfo(): string;
}

// ============================================================================
// CONCRETE PRODUCTS
// ============================================================================

class Truck implements Transport {
  deliver(): void {
    console.log("Truck: Delivering cargo by land in a box");
  }

  getTransportInfo(): string {
    return "Truck - Land transportation";
  }
}

class Ship implements Transport {
  deliver(): void {
    console.log("Ship: Delivering cargo by sea in a container");
  }

  getTransportInfo(): string {
    return "Ship - Sea transportation";
  }
}

class Airplane implements Transport {
  deliver(): void {
    console.log("Airplane: Delivering cargo by air");
  }

  getTransportInfo(): string {
    return "Airplane - Air transportation";
  }
}

// ============================================================================
// CREATOR (ABSTRACT)
// ============================================================================

abstract class Logistics {
  /**
   * The factory method that subclasses must implement
   */
  abstract createTransport(): Transport;

  /**
   * Template method that uses the factory method
   * This is the main business logic that works with the product
   */
  planDelivery(): void {
    console.log("Planning delivery...");
    const transport = this.createTransport();
    console.log(`Using: ${transport.getTransportInfo()}`);
    transport.deliver();
    console.log("Delivery completed!");
  }

  /**
   * Additional business logic that can be overridden
   */
  calculateCost(): number {
    const transport = this.createTransport();
    // Different transport types have different costs
    if (transport instanceof Truck) return 100;
    if (transport instanceof Ship) return 200;
    if (transport instanceof Airplane) return 500;
    return 0;
  }
}

// ============================================================================
// CONCRETE CREATORS
// ============================================================================

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

class AirLogistics extends Logistics {
  createTransport(): Transport {
    return new Airplane();
  }
}

// ============================================================================
// CLIENT CODE
// ============================================================================

function demonstrateFactoryMethod(): void {
  console.log("=== Factory Method Pattern Demo ===\n");

  // Create different logistics types
  const roadLogistics = new RoadLogistics();
  const seaLogistics = new SeaLogistics();
  const airLogistics = new AirLogistics();

  // Use them without knowing the concrete transport classes
  console.log("1. Road Logistics:");
  roadLogistics.planDelivery();
  console.log(`Cost: $${roadLogistics.calculateCost()}\n`);

  console.log("2. Sea Logistics:");
  seaLogistics.planDelivery();
  console.log(`Cost: $${seaLogistics.calculateCost()}\n`);

  console.log("3. Air Logistics:");
  airLogistics.planDelivery();
  console.log(`Cost: $${airLogistics.calculateCost()}\n`);
}

// ============================================================================
// ADVANCED EXAMPLE: Factory with Configuration
// ============================================================================

type TransportType = 'truck' | 'ship' | 'airplane';

class ConfigurableLogistics extends Logistics {
  private transportType: TransportType;

  constructor(transportType: TransportType) {
    super();
    this.transportType = transportType;
  }

  createTransport(): Transport {
    switch (this.transportType) {
      case 'truck':
        return new Truck();
      case 'ship':
        return new Ship();
      case 'airplane':
        return new Airplane();
      default:
        throw new Error(`Unknown transport type: ${this.transportType}`);
    }
  }
}

function demonstrateConfigurableFactory(): void {
  console.log("=== Configurable Factory Demo ===\n");

  const configs: TransportType[] = ['truck', 'ship', 'airplane'];

  configs.forEach(type => {
    const logistics = new ConfigurableLogistics(type);
    console.log(`Using ${type.toUpperCase()} configuration:`);
    logistics.planDelivery();
    console.log(`Cost: $${logistics.calculateCost()}\n`);
  });
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

// Run examples if this file is executed directly
demonstrateFactoryMethod();
demonstrateConfigurableFactory();

export {
  Transport,
  Truck,
  Ship,
  Airplane,
  Logistics,
  RoadLogistics,
  SeaLogistics,
  AirLogistics,
  ConfigurableLogistics,
  demonstrateFactoryMethod,
  demonstrateConfigurableFactory
};
