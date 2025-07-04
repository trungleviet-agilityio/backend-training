// Encapsulation Example: Banking Domain
// Demonstrates encapsulation with a bank account

class BankAccount {

  // private field
  private balance: number;
  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  // public method
  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited $${amount}. New balance: $${this.balance}`);
    }
  }

  // public method
  withdraw(amount: number): void {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrew $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Insufficient funds or invalid amount.');
    }
  }

  // public method
  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
account.withdraw(30);
console.log('Final balance:', account.getBalance());
