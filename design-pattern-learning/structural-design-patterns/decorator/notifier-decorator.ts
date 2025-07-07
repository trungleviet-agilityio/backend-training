// Decorator Pattern - Notifier Example
// Allows adding notification channels dynamically without modifying the base notifier

// Component Interface
interface Notifier {
  send(message: string): void;
}

// Concrete Component - Base Notifier
class EmailNotifier implements Notifier {
  constructor(private email: string) {}

  send(message: string): void {
    console.log(`📧 Email sent to ${this.email}: ${message}`);
  }
}

// Base Decorator
abstract class NotifierDecorator implements Notifier {
  constructor(protected wrappee: Notifier) {}

  send(message: string): void {
    this.wrappee.send(message);
  }
}

// Concrete Decorators
class SMSDecorator extends NotifierDecorator {
  constructor(wrappee: Notifier, private phoneNumber: string) {
    super(wrappee);
  }

  send(message: string): void {
    super.send(message);
    console.log(`📱 SMS sent to ${this.phoneNumber}: ${message}`);
  }
}

class SlackDecorator extends NotifierDecorator {
  constructor(wrappee: Notifier, private channel: string) {
    super(wrappee);
  }

  send(message: string): void {
    super.send(message);
    console.log(`💬 Slack message sent to #${this.channel}: ${message}`);
  }
}

class FacebookDecorator extends NotifierDecorator {
  constructor(wrappee: Notifier, private userId: string) {
    super(wrappee);
  }

  send(message: string): void {
    super.send(message);
    console.log(`📘 Facebook message sent to user ${this.userId}: ${message}`);
  }
}

// Optional: Logging Decorator for debugging
class LoggingDecorator extends NotifierDecorator {
  send(message: string): void {
    console.log(`🔍 [LOG] About to send: ${message}`);
    super.send(message);
    console.log(`✅ [LOG] Message sent successfully`);
  }
}

// Usage Examples
function demonstrateDecoratorPattern() {
  console.log("=== Decorator Pattern - Notifier Example ===\n");

  // 1. Basic Email Notifier
  console.log("1. Basic Email Notifier:");
  let notifier: Notifier = new EmailNotifier("user@example.com");
  notifier.send("Hello from basic email!");
  console.log();

  // 2. Email + SMS
  console.log("2. Email + SMS:");
  notifier = new EmailNotifier("user@example.com");
  notifier = new SMSDecorator(notifier, "+1234567890");
  notifier.send("Hello from email and SMS!");
  console.log();

  // 3. Email + Slack + SMS
  console.log("3. Email + Slack + SMS:");
  notifier = new EmailNotifier("user@example.com");
  notifier = new SlackDecorator(notifier, "general");
  notifier = new SMSDecorator(notifier, "+1234567890");
  notifier.send("Hello from all channels!");
  console.log();

  // 4. Email + Facebook + Slack + SMS + Logging
  console.log("4. Email + Facebook + Slack + SMS + Logging:");
  notifier = new EmailNotifier("user@example.com");
  notifier = new FacebookDecorator(notifier, "john_doe");
  notifier = new SlackDecorator(notifier, "notifications");
  notifier = new SMSDecorator(notifier, "+1234567890");
  notifier = new LoggingDecorator(notifier);
  notifier.send("Urgent: System maintenance in 5 minutes!");
  console.log();

  // 5. Different order - SMS first, then others
  console.log("5. Different order (SMS first):");
  notifier = new EmailNotifier("user@example.com");
  notifier = new SMSDecorator(notifier, "+1234567890");
  notifier = new SlackDecorator(notifier, "alerts");
  notifier = new FacebookDecorator(notifier, "john_doe");
  notifier.send("Order of decorators matters!");
  console.log();
}

// Run the demonstration
demonstrateDecoratorPattern();
