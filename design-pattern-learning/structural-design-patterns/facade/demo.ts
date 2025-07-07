/**
 * Facade Pattern Demo
 *
 * This file demonstrates all the Facade pattern examples
 * and shows the benefits of using the Facade pattern.
 */

import { demonstrateBankingFacade } from './banking-facade';
import { demonstrateVideoConversionFacade } from './video-conversion-facade';
import { demonstrateHomeTheaterFacade } from './home-theater-facade';

// Demo function to show Facade benefits
function demonstrateFacadeBenefits(): void {
  console.log("=== Facade Benefits Demo ===\n");

  console.log("Without Facade (Complex):");
  console.log("const chequing = new ChequingAccount('Alice');");
  console.log("const savings = new SavingsAccount('Alice');");
  console.log("const investment = new InvestmentAccount('Alice');");
  console.log("chequing.open();");
  console.log("savings.open();");
  console.log("investment.open();");
  console.log("chequing.deposit(1000);");
  console.log("savings.deposit(1000);");
  console.log("investment.deposit(1000);");
  console.log();

  console.log("With Facade (Simple):");
  console.log("const bankManager = new BankAccountManager('Alice');");
  console.log("bankManager.openAllAccounts();");
  console.log("bankManager.depositToAllAccounts(1000);");
  console.log();

  console.log("Benefits:");
  console.log("- Hides complexity of subsystem");
  console.log("- Reduces coupling between client and subsystem");
  console.log("- Provides simple interface");
  console.log("- Makes code easier to maintain");
  console.log();
}

// Run all demonstrations
function runAllDemos(): void {
  console.log("🎭 FACADE PATTERN DEMONSTRATIONS\n");
  console.log("=====================================\n");

  // Run banking facade demo
  demonstrateBankingFacade();

//   // Run video conversion facade demo
//   demonstrateVideoConversionFacade();

//   // Run home theater facade demo
//   demonstrateHomeTheaterFacade();

//   // Show benefits
//   demonstrateFacadeBenefits();

  console.log("✅ All Facade pattern demonstrations completed!");
}

// Run demos if this file is executed directly
runAllDemos();

export {
  runAllDemos,
  demonstrateFacadeBenefits
};
