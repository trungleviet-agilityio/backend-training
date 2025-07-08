/**
 * Banking Facade Pattern Example
 *
 * This demonstrates how a Facade can simplify complex banking operations
 * by providing a simple interface to manage multiple account types.
 */

// Complex subsystem classes
export interface IAccount {
  open(): void;
  close(): void;
  deposit(amount: number): void;
  withdraw(amount: number): void;
  getBalance(): number;
}

export class ChequingAccount implements IAccount {
  private balance: number = 0;
  private isOpen: boolean = false;

  constructor(private customerName: string) {}

  open(): void {
    this.isOpen = true;
    console.log(`Opening Chequing Account for ${this.customerName}`);
  }

  close(): void {
    this.isOpen = false;
    console.log(`Closing Chequing Account for ${this.customerName}`);
  }

  deposit(amount: number): void {
    if (!this.isOpen) {
      console.log("Account is not open");
      return;
    }
    this.balance += amount;
    console.log(`Deposited $${amount} to Chequing Account`);
  }

  withdraw(amount: number): void {
    if (!this.isOpen) {
      console.log("Account is not open");
      return;
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`Withdrew $${amount} from Chequing Account`);
    } else {
      console.log("Insufficient funds in Chequing Account");
    }
  }

  getBalance(): number {
    return this.balance;
  }
}

export class SavingsAccount implements IAccount {
  private balance: number = 0;
  private isOpen: boolean = false;

  constructor(private customerName: string) {}

  open(): void {
    this.isOpen = true;
    console.log(`Opening Savings Account for ${this.customerName}`);
  }

  close(): void {
    this.isOpen = false;
    console.log(`Closing Savings Account for ${this.customerName}`);
  }

  deposit(amount: number): void {
    if (!this.isOpen) {
      console.log("Account is not open");
      return;
    }
    this.balance += amount;
    console.log(`Deposited $${amount} to Savings Account`);
  }

  withdraw(amount: number): void {
    if (!this.isOpen) {
      console.log("Account is not open");
      return;
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`Withdrew $${amount} from Savings Account`);
    } else {
      console.log("Insufficient funds in Savings Account");
    }
  }

  getBalance(): number {
    return this.balance;
  }
}

export class InvestmentAccount implements IAccount {
  private balance: number = 0;
  private isOpen: boolean = false;

  constructor(private customerName: string) {}

  open(): void {
    this.isOpen = true;
    console.log(`Opening Investment Account for ${this.customerName}`);
  }

  close(): void {
    this.isOpen = false;
    console.log(`Closing Investment Account for ${this.customerName}`);
  }

  deposit(amount: number): void {
    if (!this.isOpen) {
      console.log("Account is not open");
      return;
    }
    this.balance += amount;
    console.log(`Deposited $${amount} to Investment Account`);
  }

  withdraw(amount: number): void {
    if (!this.isOpen) {
      console.log("Account is not open");
      return;
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`Withdrew $${amount} from Investment Account`);
    } else {
      console.log("Insufficient funds in Investment Account");
    }
  }

  getBalance(): number {
    return this.balance;
  }
}

// Facade class
export class BankAccountManager {
  private chequing: ChequingAccount;
  private savings: SavingsAccount;
  private investment: InvestmentAccount;

  constructor(private customerName: string) {
    this.chequing = new ChequingAccount(customerName);
    this.savings = new SavingsAccount(customerName);
    this.investment = new InvestmentAccount(customerName);
  }

  openAllAccounts(): void {
    console.log(`--- Opening all accounts for ${this.customerName} ---`);
    this.chequing.open();
    this.savings.open();
    this.investment.open();
    console.log("All accounts opened successfully");
  }

  closeAllAccounts(): void {
    console.log(`--- Closing all accounts for ${this.customerName} ---`);
    this.chequing.close();
    this.savings.close();
    this.investment.close();
    console.log("All accounts closed successfully");
  }

  depositToAllAccounts(amount: number): void {
    console.log(`--- Depositing $${amount} to all accounts ---`);
    this.chequing.deposit(amount);
    this.savings.deposit(amount);
    this.investment.deposit(amount);
  }

  getTotalBalance(): number {
    const total = this.chequing.getBalance() +
                  this.savings.getBalance() +
                  this.investment.getBalance();
    console.log(`Total balance across all accounts: $${total}`);
    return total;
  }

  transferBetweenAccounts(fromAccount: string, toAccount: string, amount: number): void {
    console.log(`--- Transferring $${amount} from ${fromAccount} to ${toAccount} ---`);

    let from: IAccount;
    let to: IAccount;

    switch (fromAccount.toLowerCase()) {
      case 'chequing':
        from = this.chequing;
        break;
      case 'savings':
        from = this.savings;
        break;
      case 'investment':
        from = this.investment;
        break;
      default:
        console.log("Invalid from account");
        return;
    }

    switch (toAccount.toLowerCase()) {
      case 'chequing':
        to = this.chequing;
        break;
      case 'savings':
        to = this.savings;
        break;
      case 'investment':
        to = this.investment;
        break;
      default:
        console.log("Invalid to account");
        return;
    }

    const currentBalance = from.getBalance();
    if (currentBalance >= amount) {
      from.withdraw(amount);
      to.deposit(amount);
      console.log("Transfer completed successfully");
    } else {
      console.log("Insufficient funds for transfer");
    }
  }
}

// Demo function
export function demonstrateBankingFacade(): void {
  console.log("=== Banking Facade Demo ===\n");

  const bankManager = new BankAccountManager("Alice Johnson");

  // Open all accounts
  bankManager.openAllAccounts();

  // Deposit to all accounts
  bankManager.depositToAllAccounts(1000);

  // Transfer between accounts
  bankManager.transferBetweenAccounts("chequing", "savings", 500);

  // Get total balance
  bankManager.getTotalBalance();

  // Close all accounts
  bankManager.closeAllAccounts();
  console.log();
}
