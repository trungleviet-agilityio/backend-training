/**
 * State Pattern - Vending Machine Example
 *
 * This example demonstrates a vending machine with three states:
 * - IdleState: waiting for money
 * - HasOneDollarState: has received $1, ready to dispense
 * - OutOfStockState: no products left
 *
 * The VendingMachine context delegates actions to the current state.
 */

// State interface
interface State {
  insertDollar(): void;
  ejectMoney(): void;
  dispense(): void;
}

// Context: VendingMachine
class VendingMachine {
  private state: State;
  private count: number;

  // States
  private idleState: State;
  private hasOneDollarState: State;
  private outOfStockState: State;

  constructor(count: number) {
    this.count = count;
    this.idleState = new IdleState(this);
    this.hasOneDollarState = new HasOneDollarState(this);
    this.outOfStockState = new OutOfStockState(this);
    this.state = count > 0 ? this.idleState : this.outOfStockState;
  }

  setState(state: State) {
    this.state = state;
  }

  getIdleState() {
    return this.idleState;
  }
  getHasOneDollarState() {
    return this.hasOneDollarState;
  }
  getOutOfStockState() {
    return this.outOfStockState;
  }
  getCount() {
    return this.count;
  }
  releaseProduct() {
    if (this.count > 0) {
      console.log('🧃 Product dispensed!');
      this.count--;
    }
  }

  // API methods
  insertDollar() {
    this.state.insertDollar();
  }
  ejectMoney() {
    this.state.ejectMoney();
  }
  dispense() {
    this.state.dispense();
  }
}

// IdleState
class IdleState implements State {
  constructor(private machine: VendingMachine) {}

  insertDollar(): void {
    console.log('💵 Dollar inserted.');
    this.machine.setState(this.machine.getHasOneDollarState());
  }
  ejectMoney(): void {
    console.log('No money to eject.');
  }
  dispense(): void {
    console.log('Insert $1 first.');
  }
}

// HasOneDollarState
class HasOneDollarState implements State {
  constructor(private machine: VendingMachine) {}

  insertDollar(): void {
    console.log('Already has $1. Returning extra dollar.');
    this.machine.ejectMoney();
  }
  ejectMoney(): void {
    console.log('💸 Money returned.');
    this.machine.setState(this.machine.getIdleState());
  }
  dispense(): void {
    if (this.machine.getCount() > 1) {
      this.machine.releaseProduct();
      this.machine.setState(this.machine.getIdleState());
    } else if (this.machine.getCount() === 1) {
      this.machine.releaseProduct();
      this.machine.setState(this.machine.getOutOfStockState());
    } else {
      console.log('Out of stock!');
      this.machine.setState(this.machine.getOutOfStockState());
    }
  }
}

// OutOfStockState
class OutOfStockState implements State {
  constructor(private machine: VendingMachine) {}

  insertDollar(): void {
    console.log('❌ Out of stock. Returning money.');
    this.machine.ejectMoney();
  }
  ejectMoney(): void {
    console.log('💸 Money returned.');
  }
  dispense(): void {
    console.log('❌ Out of stock. Cannot dispense.');
  }
}

// Demo usage
export function demonstrateVendingMachineState() {
  const machine = new VendingMachine(2);
  console.log('\n--- Scenario 1: Normal purchase ---');
  machine.insertDollar();
  machine.dispense();

  console.log('\n--- Scenario 2: Buy last product ---');
  machine.insertDollar();
  machine.dispense();

  console.log('\n--- Scenario 3: Try to buy when out of stock ---');
  machine.insertDollar();
  machine.dispense();
}

demonstrateVendingMachineState();
