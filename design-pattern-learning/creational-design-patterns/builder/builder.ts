/**
 * Builder Pattern - TypeScript Implementation (Best Practice: Immutable Product)
 *
 * This example demonstrates the Builder pattern using a car manufacturing system
 * where the same construction process can be used to build both cars and their manuals.
 *
 * Car and Manual are now immutable and constructed via constructor.
 */

// ============================================================================
// PRODUCTS
// ============================================================================

class Car {
  constructor(
    private readonly seats: number,
    private readonly engine: string,
    private readonly tripComputer: boolean,
    private readonly gps: boolean
  ) {}

  getSpecifications(): string {
    return `Car with ${this.seats} seats, ${this.engine} engine${this.tripComputer ? ', trip computer' : ''}${this.gps ? ', GPS' : ''}`;
  }
}

class Manual {
  constructor(
    private readonly seats: number,
    private readonly engine: string,
    private readonly tripComputer: boolean,
    private readonly gps: boolean
  ) {}

  getInstructions(): string {
    const parts = [
      `This car has ${this.seats} seats.`,
      `This car has a ${this.engine} engine.`,
      this.tripComputer ? 'This car has a trip computer.' : '',
      this.gps ? 'This car has GPS navigation.' : ''
    ];
    return parts.filter(Boolean).join(' ');
  }
}

// ============================================================================
// BUILDER INTERFACE
// ============================================================================

interface Builder {
  reset(): void;
  setSeats(seats: number): void;
  setEngine(engine: string): void;
  setTripComputer(): void;
  setGPS(): void;
}

// ============================================================================
// CONCRETE BUILDERS
// ============================================================================

class CarBuilder implements Builder {
  private seats: number = 0;
  private engine: string = '';
  private tripComputer: boolean = false;
  private gps: boolean = false;

  reset(): void {
    this.seats = 0;
    this.engine = '';
    this.tripComputer = false;
    this.gps = false;
  }

  setSeats(seats: number): void { this.seats = seats; }
  setEngine(engine: string): void { this.engine = engine; }
  setTripComputer(): void { this.tripComputer = true; }
  setGPS(): void { this.gps = true; }

  getResult(): Car {
    const car = new Car(this.seats, this.engine, this.tripComputer, this.gps);
    this.reset();
    return car;
  }
}

class CarManualBuilder implements Builder {
  private seats: number = 0;
  private engine: string = '';
  private tripComputer: boolean = false;
  private gps: boolean = false;

  reset(): void {
    this.seats = 0;
    this.engine = '';
    this.tripComputer = false;
    this.gps = false;
  }

  setSeats(seats: number): void { this.seats = seats; }
  setEngine(engine: string): void { this.engine = engine; }
  setTripComputer(): void { this.tripComputer = true; }
  setGPS(): void { this.gps = true; }

  getResult(): Manual {
    const manual = new Manual(this.seats, this.engine, this.tripComputer, this.gps);
    this.reset();
    return manual;
  }
}

// ============================================================================
// DIRECTOR
// ============================================================================

class Director {
  setBuilder(_builder: Builder): void {
    // Not used in this implementation, but kept for compatibility
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

  constructCityCar(builder: Builder): void {
    builder.reset();
    builder.setSeats(5);
    builder.setEngine("electric");
    builder.setGPS();
  }

  constructLuxuryCar(builder: Builder): void {
    builder.reset();
    builder.setSeats(4);
    builder.setEngine("v8");
    builder.setTripComputer();
    builder.setGPS();
  }
}

// ============================================================================
// CLIENT CODE
// ============================================================================

class CarManufacturingClient {
  private director: Director;
  private carBuilder: CarBuilder;
  private manualBuilder: CarManualBuilder;

  constructor() {
    this.director = new Director();
    this.carBuilder = new CarBuilder();
    this.manualBuilder = new CarManualBuilder();
  }

  buildSportsCar(): { car: Car; manual: Manual } {
    this.director.constructSportsCar(this.carBuilder);
    const car = this.carBuilder.getResult();
    this.director.constructSportsCar(this.manualBuilder);
    const manual = this.manualBuilder.getResult();
    return { car, manual };
  }

  buildSUV(): { car: Car; manual: Manual } {
    this.director.constructSUV(this.carBuilder);
    const car = this.carBuilder.getResult();
    this.director.constructSUV(this.manualBuilder);
    const manual = this.manualBuilder.getResult();
    return { car, manual };
  }

  buildCityCar(): { car: Car; manual: Manual } {
    this.director.constructCityCar(this.carBuilder);
    const car = this.carBuilder.getResult();
    this.director.constructCityCar(this.manualBuilder);
    const manual = this.manualBuilder.getResult();
    return { car, manual };
  }

  buildLuxuryCar(): { car: Car; manual: Manual } {
    this.director.constructLuxuryCar(this.carBuilder);
    const car = this.carBuilder.getResult();
    this.director.constructLuxuryCar(this.manualBuilder);
    const manual = this.manualBuilder.getResult();
    return { car, manual };
  }
}

// ============================================================================
// DEMONSTRATION FUNCTIONS
// ============================================================================

function demonstrateBuilderPattern(): void {
  console.log("=== Builder Pattern Demo ===\n");

  const client = new CarManufacturingClient();

  // Build different types of cars with their manuals
  const carTypes = [
    { name: "Sports Car", method: () => client.buildSportsCar() },
    { name: "SUV", method: () => client.buildSUV() },
    { name: "City Car", method: () => client.buildCityCar() },
    { name: "Luxury Car", method: () => client.buildLuxuryCar() }
  ];

  carTypes.forEach(({ name, method }) => {
    console.log(`--- ${name} ---`);
    const { car, manual } = method();

    console.log(`Car: ${car.getSpecifications()}`);
    console.log(`Manual: ${manual.getInstructions()}`);
    console.log();
  });
}

function demonstrateStepByStepConstruction(): void {
  console.log("=== Step-by-Step Construction Demo ===\n");

  const carBuilder = new CarBuilder();

  // Build a custom car step by step
  console.log("Building custom car step by step:");

  carBuilder.reset();
  console.log("1. Reset builder");

  carBuilder.setSeats(6);
  console.log("2. Set 6 seats");

  carBuilder.setEngine("hybrid");
  console.log("3. Set hybrid engine");

  carBuilder.setGPS();
  console.log("4. Add GPS");

  const customCar = carBuilder.getResult();
  console.log(`5. Result: ${customCar.getSpecifications()}\n`);
}

function demonstrateDirectorReusability(): void {
  console.log("=== Director Reusability Demo ===\n");

  const director = new Director();
  const carBuilder = new CarBuilder();
  const manualBuilder = new CarManualBuilder();

  // Use the same director with different builders
  console.log("Using director with car builder:");
  director.constructSportsCar(carBuilder);
  const car = carBuilder.getResult();
  console.log(`Car: ${car.getSpecifications()}`);

  console.log("\nUsing director with manual builder:");
  director.constructSportsCar(manualBuilder);
  const manual = manualBuilder.getResult();
  console.log(`Manual: ${manual.getInstructions()}`);

  console.log("\nSame construction process, different results!");
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

demonstrateBuilderPattern();
demonstrateStepByStepConstruction();
demonstrateDirectorReusability();

export {
  Car,
  Manual,
  Builder,
  CarBuilder,
  CarManualBuilder,
  Director,
  CarManufacturingClient,
  demonstrateBuilderPattern,
  demonstrateStepByStepConstruction,
  demonstrateDirectorReusability
};
