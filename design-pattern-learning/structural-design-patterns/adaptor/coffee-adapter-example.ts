/**
 * Coffee Machine Adapter Example (TypeScript)
 *
 * Scenario: Integrate a new touchscreen interface with an old coffee machine using Adapter Pattern.
 * UML: CoffeeMachineInterface <-- CoffeeTouchscreenAdapter --> OldCoffeeMachine
 */

// Target Interface: what the touchscreen expects
export interface CoffeeMachineInterface {
  chooseFirstSelection(): void;
  chooseSecondSelection(): void;
}

// Adaptee: the old coffee machine (cannot modify)
export class OldCoffeeMachine {
  selectA(): void {
    console.log("Dispensing coffee flavor A (Old Machine)");
  }
  selectB(): void {
    console.log("Dispensing coffee flavor B (Old Machine)");
  }
}

// Adapter: implements the new interface, wraps the old machine
export class CoffeeTouchscreenAdapter implements CoffeeMachineInterface {
  private oldMachine: OldCoffeeMachine;

  constructor(oldMachine: OldCoffeeMachine) {
    this.oldMachine = oldMachine;
  }

  chooseFirstSelection(): void {
    this.oldMachine.selectA();
  }

  chooseSecondSelection(): void {
    this.oldMachine.selectB();
  }
}

// Demo function
export function demonstrateCoffeeAdapter(): void {
  console.log("=== Coffee Machine Adapter Demo ===\n");

  const oldMachine = new OldCoffeeMachine();
  const touchscreen: CoffeeMachineInterface = new CoffeeTouchscreenAdapter(oldMachine);

  touchscreen.chooseFirstSelection();   // Output: Dispensing coffee flavor A (Old Machine)
  touchscreen.chooseSecondSelection();  // Output: Dispensing coffee flavor B (Old Machine)
}
