// Polymorphism Example: Payment Gateway Domain
// Demonstrates polymorphism with payment gateways

abstract class PaymentGateway {
  // abstract method
  abstract pay(amount: number): void;
}

class PaypalGateway extends PaymentGateway {
  // implementation of the abstract method
  pay(amount: number): void {
    console.log(`Paid $${amount} using PayPal.`);
  }
}

class StripeGateway extends PaymentGateway {
  // implementation of the abstract method
  pay(amount: number): void {
    console.log(`Paid $${amount} using Stripe.`);
  }
}

const gateways: PaymentGateway[] = [new PaypalGateway(), new StripeGateway()];
for (const gateway of gateways) {
  gateway.pay(100); // Dynamic dispatch
}
