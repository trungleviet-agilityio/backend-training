// Abstraction Example: Messaging Service Domain
// Demonstrates abstraction with message services

// IMessageService: Interface for message services
interface IMessageService {
  sendMessage(to: string, message: string): void;
}

// MessageService: Abstract base class for message services
abstract class MessageService implements IMessageService {
  abstract sendMessage(to: string, message: string): void;
}

// EmailService: Concrete class for email services
class EmailService extends MessageService {
  sendMessage(to: string, message: string): void {
    console.log(`Email sent to ${to}: ${message}`);
  }
}

// SmsService: Concrete class for SMS services
class SmsService extends MessageService {
  sendMessage(to: string, message: string): void {
    console.log(`SMS sent to ${to}: ${message}`);
  }
}

// --- DEMO ---
const email = new EmailService();
const sms = new SmsService();
email.sendMessage('alice@example.com', 'Hello Alice!');
sms.sendMessage('123-456-7890', 'Hi there!');
