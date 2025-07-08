/**
 * Template Method Pattern - Car Manufacturing Example
 *
 * This example demonstrates how to use the Template Method pattern
 * to manufacture different types of cars while sharing common assembly steps.
 */

// Abstract class defining the car manufacturing template
abstract class CarManufacturing {
  /**
   * Template method - defines the manufacturing algorithm structure
   * This method cannot be overridden by subclasses
   */
  public manufactureCar(): void {
    console.log(`\n🏭 Manufacturing ${this.getCarModel()} 🏭`);
    console.log('=' .repeat(50));

    // Step 1: Prepare materials
    this.prepareMaterials();

    // Step 2: Assemble chassis
    this.assembleChassis();

    // Step 3: Install engine (abstract - must be implemented by subclasses)
    this.installEngine();

    // Step 4: Install interior (concrete - can be overridden)
    this.installInterior();

    // Step 5: Install electronics (hook - optional)
    if (this.shouldInstallElectronics()) {
      this.installElectronics();
    }

    // Step 6: Paint car (hook - optional)
    if (this.shouldPaint()) {
      this.paintCar();
    }

    // Step 7: Quality check
    this.qualityCheck();

    // Step 8: Final assembly
    this.finalAssembly();

    console.log('=' .repeat(50));
    console.log(`✅ ${this.getCarModel()} manufacturing completed!\n`);
  }

  // Abstract methods - must be implemented by subclasses
  protected abstract getCarModel(): string;
  protected abstract installEngine(): void;

  // Concrete methods - default implementation, can be overridden
  protected prepareMaterials(): void {
    console.log('📦 Preparing materials...');
    console.log('  - Steel sheets');
    console.log('  - Aluminum components');
    console.log('  - Plastic parts');
    console.log('  - Electronic components');
    console.log('✅ Materials prepared');
  }

  protected assembleChassis(): void {
    console.log('🔧 Assembling chassis...');
    console.log('  - Welding frame');
    console.log('  - Installing suspension');
    console.log('  - Adding wheels');
    console.log('✅ Chassis assembled');
  }

  protected installInterior(): void {
    console.log('🪑 Installing interior...');
    console.log('  - Installing seats');
    console.log('  - Adding dashboard');
    console.log('  - Installing steering wheel');
    console.log('  - Adding basic controls');
    console.log('✅ Interior installed');
  }

  protected qualityCheck(): void {
    console.log('🔍 Performing quality check...');
    console.log('  - Testing engine');
    console.log('  - Checking brakes');
    console.log('  - Testing electronics');
    console.log('  - Safety inspection');
    console.log('✅ Quality check passed');
  }

  protected finalAssembly(): void {
    console.log('🎯 Final assembly...');
    console.log('  - Installing bumpers');
    console.log('  - Adding mirrors');
    console.log('  - Installing lights');
    console.log('  - Final inspection');
    console.log('✅ Final assembly completed');
  }

  // Hook methods - optional override
  protected shouldInstallElectronics(): boolean {
    return true; // Default: install electronics
  }

  protected installElectronics(): void {
    console.log('💻 Installing electronics...');
    console.log('  - Installing infotainment system');
    console.log('  - Adding navigation');
    console.log('  - Installing safety systems');
    console.log('✅ Electronics installed');
  }

  protected shouldPaint(): boolean {
    return true; // Default: paint the car
  }

  protected paintCar(): void {
    console.log('🎨 Painting car...');
    console.log('  - Applying primer');
    console.log('  - Applying base coat');
    console.log('  - Applying clear coat');
    console.log('✅ Car painted');
  }
}

// Concrete implementation for Sedan
class SedanManufacturing extends CarManufacturing {
  protected getCarModel(): string {
    return 'Luxury Sedan';
  }

  protected installEngine(): void {
    console.log('🚗 Installing sedan engine...');
    console.log('  - Installing V6 engine');
    console.log('  - Connecting transmission');
    console.log('  - Installing exhaust system');
    console.log('  - Adding fuel system');
    console.log('✅ Sedan engine installed');
  }

  // Override concrete method
  protected installInterior(): void {
    console.log('🪑 Installing luxury interior...');
    console.log('  - Installing leather seats');
    console.log('  - Adding premium dashboard');
    console.log('  - Installing wood trim');
    console.log('  - Adding climate control');
    console.log('✅ Luxury interior installed');
  }

  // Override hook method
  protected installElectronics(): void {
    console.log('💻 Installing premium electronics...');
    console.log('  - Installing premium sound system');
    console.log('  - Adding advanced navigation');
    console.log('  - Installing driver assistance');
    console.log('  - Adding parking sensors');
    console.log('✅ Premium electronics installed');
  }
}

// Concrete implementation for SUV
class SUVManufacturing extends CarManufacturing {
  protected getCarModel(): string {
    return 'Sport Utility Vehicle';
  }

  protected installEngine(): void {
    console.log('🚙 Installing SUV engine...');
    console.log('  - Installing V8 engine');
    console.log('  - Adding 4-wheel drive system');
    console.log('  - Installing heavy-duty transmission');
    console.log('  - Adding towing package');
    console.log('✅ SUV engine installed');
  }

  // Override concrete method
  protected installInterior(): void {
    console.log('🪑 Installing SUV interior...');
    console.log('  - Installing 7-seat configuration');
    console.log('  - Adding cargo space');
    console.log('  - Installing roof rails');
    console.log('  - Adding storage compartments');
    console.log('✅ SUV interior installed');
  }

  // Override hook method
  protected shouldPaint(): boolean {
    return true; // SUV needs paint
  }

  protected paintCar(): void {
    console.log('🎨 Painting SUV...');
    console.log('  - Applying protective coating');
    console.log('  - Applying metallic paint');
    console.log('  - Adding off-road styling');
    console.log('✅ SUV painted');
  }
}

// Concrete implementation for Electric Car
class ElectricCarManufacturing extends CarManufacturing {
  protected getCarModel(): string {
    return 'Electric Vehicle';
  }

  protected installEngine(): void {
    console.log('⚡ Installing electric motor...');
    console.log('  - Installing electric motor');
    console.log('  - Adding battery pack');
    console.log('  - Installing charging system');
    console.log('  - Adding regenerative braking');
    console.log('✅ Electric motor installed');
  }

  // Override hook method
  protected shouldInstallElectronics(): boolean {
    return true; // EVs need advanced electronics
  }

  protected installElectronics(): void {
    console.log('💻 Installing EV electronics...');
    console.log('  - Installing battery management system');
    console.log('  - Adding charging interface');
    console.log('  - Installing energy monitoring');
    console.log('  - Adding smart connectivity');
    console.log('✅ EV electronics installed');
  }

  // Override hook method
  protected shouldPaint(): boolean {
    return false; // EVs often have special coating instead of paint
  }
}

// Standalone demonstration function
export function demonstrateCarManufacturing() {
  console.log('🏭 Template Method Pattern - Car Manufacturing Example\n');

  try {
    // Manufacture different types of cars
    const sedanFactory = new SedanManufacturing();
    sedanFactory.manufactureCar();

    const suvFactory = new SUVManufacturing();
    suvFactory.manufactureCar();

    const evFactory = new ElectricCarManufacturing();
    evFactory.manufactureCar();

  } catch (error) {
    console.error('Error during manufacturing:', (error as Error).message);
  }
}

// Run the demonstration
demonstrateCarManufacturing();
