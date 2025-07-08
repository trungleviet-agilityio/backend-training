/**
 * Mediator Pattern - Smart Home Example
 *
 * Devices (colleagues) communicate only via a central Mediator.
 * The Mediator coordinates actions between devices.
 */

// Mediator interface
interface SmartHomeMediator {
  notify(sender: SmartDevice, event: string): void;
}

// Abstract device (colleague)
abstract class SmartDevice {
  constructor(protected mediator: SmartHomeMediator, public name: string) {}
}

// Concrete devices
class Phone extends SmartDevice {
  alarm(): void {
    console.log('⏰ Phone alarm goes off!');
    this.mediator.notify(this, 'alarm');
  }
}

class Tablet extends SmartDevice {
  loadNews(): void {
    console.log('📰 Tablet loads the latest news.');
  }
}

class MotionDetector extends SmartDevice {
  detectMotion(): void {
    console.log('🚶 Motion detected!');
    this.mediator.notify(this, 'motion');
  }
}

class IndoorThermostat extends SmartDevice {
  setTemperature(temp: number): void {
    console.log(`🌡️ Indoor thermostat set to ${temp}°C.`);
  }
}

class OutdoorThermostat extends SmartDevice {
  getTemperature(): number {
    const temp = 15; // Simulated value
    console.log(`🌤️ Outdoor temperature is ${temp}°C.`);
    return temp;
  }
}

class CoffeeMaker extends SmartDevice {
  brew(): void {
    console.log('☕ Coffee maker starts brewing!');
  }
}

class AirConditioning extends SmartDevice {
  turnOn(): void {
    console.log('❄️ Air conditioning turns ON.');
  }
  turnOff(): void {
    console.log('❌ Air conditioning turns OFF.');
  }
}

// Concrete Mediator
class HomeMediator implements SmartHomeMediator {
  constructor(
    public phone: Phone,
    public tablet: Tablet,
    public motionDetector: MotionDetector,
    public indoorThermostat: IndoorThermostat,
    public outdoorThermostat: OutdoorThermostat,
    public coffeeMaker: CoffeeMaker,
    public airConditioning: AirConditioning
  ) {}

  notify(sender: SmartDevice, event: string): void {
    if (sender === this.phone && event === 'alarm') {
      this.coffeeMaker.brew();
      if (this.isSaturdayMorning()) {
        this.tablet.loadNews();
      }
    }
    if (sender === this.motionDetector && event === 'motion') {
      this.airConditioning.turnOn();
    }
  }

  isSaturdayMorning(): boolean {
    // Simulate: always Saturday morning for demo
    return true;
  }
}

// Demo
export function demonstrateSmartHomeMediator() {
  // Create mediator and devices
  const mediator = {} as HomeMediator; // placeholder for circular refs
  const phone = new Phone(mediator, 'Phone');
  const tablet = new Tablet(mediator, 'Tablet');
  const motionDetector = new MotionDetector(mediator, 'Motion Detector');
  const indoorThermostat = new IndoorThermostat(mediator, 'Indoor Thermostat');
  const outdoorThermostat = new OutdoorThermostat(mediator, 'Outdoor Thermostat');
  const coffeeMaker = new CoffeeMaker(mediator, 'Coffee Maker');
  const airConditioning = new AirConditioning(mediator, 'Air Conditioning');

  // Now wire up the real mediator
  const realMediator = new HomeMediator(
    phone,
    tablet,
    motionDetector,
    indoorThermostat,
    outdoorThermostat,
    coffeeMaker,
    airConditioning
  );
  // Patch mediator references
  phone['mediator'] = realMediator;
  tablet['mediator'] = realMediator;
  motionDetector['mediator'] = realMediator;
  indoorThermostat['mediator'] = realMediator;
  outdoorThermostat["mediator"] = realMediator;
  coffeeMaker["mediator"] = realMediator;
  airConditioning["mediator"] = realMediator;

  // Demo scenarios
  console.log('\n--- Scenario 1: Phone alarm goes off ---');
  phone.alarm();

  console.log('\n--- Scenario 2: Motion detected ---');
  motionDetector.detectMotion();
}

demonstrateSmartHomeMediator();
