/**
 * Prototype Pattern - TypeScript Implementation
 *
 * This example demonstrates the Prototype pattern using a document management system
 * where different types of documents can be cloned without knowing their specific classes.
 */

// ============================================================================
// PROTOTYPE INTERFACE
// ============================================================================

interface Document {
  clone(): Document;
  getInfo(): string;
  setTitle(title: string): void;
  setContent(content: string): void;
}

// ============================================================================
// CONCRETE PROTOTYPES
// ============================================================================

class Report implements Document {
  private title: string;
  private content: string;
  private author: string;
  private date: Date;
  private isConfidential: boolean;

  constructor(source?: Report) {
    if (source) {
      this.title = source.title;
      this.content = source.content;
      this.author = source.author;
      this.date = new Date(source.date.getTime()); // Deep copy of date
      this.isConfidential = source.isConfidential;
    } else {
      this.title = '';
      this.content = '';
      this.author = '';
      this.date = new Date();
      this.isConfidential = false;
    }
  }

  clone(): Document {
    return new Report(this);
  }

  getInfo(): string {
    return `Report: "${this.title}" by ${this.author} (${this.date.toLocaleDateString()}) - ${this.isConfidential ? 'Confidential' : 'Public'}`;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setContent(content: string): void {
    this.content = content;
  }

  setAuthor(author: string): void {
    this.author = author;
  }

  setConfidential(isConfidential: boolean): void {
    this.isConfidential = isConfidential;
  }

  getContent(): string {
    return this.content;
  }
}

class Email implements Document {
  private subject: string;
  private body: string;
  private sender: string;
  private recipients: string[];
  private priority: 'low' | 'medium' | 'high';

  constructor(source?: Email) {
    if (source) {
      this.subject = source.subject;
      this.body = source.body;
      this.sender = source.sender;
      this.recipients = [...source.recipients]; // Deep copy of array
      this.priority = source.priority;
    } else {
      this.subject = '';
      this.body = '';
      this.sender = '';
      this.recipients = [];
      this.priority = 'medium';
    }
  }

  clone(): Document {
    return new Email(this);
  }

  getInfo(): string {
    return `Email: "${this.subject}" from ${this.sender} to ${this.recipients.length} recipients (${this.priority} priority)`;
  }

  setTitle(subject: string): void {
    this.subject = subject;
  }

  setContent(body: string): void {
    this.body = body;
  }

  setSender(sender: string): void {
    this.sender = sender;
  }

  addRecipient(recipient: string): void {
    this.recipients.push(recipient);
  }

  setPriority(priority: 'low' | 'medium' | 'high'): void {
    this.priority = priority;
  }

  getBody(): string {
    return this.body;
  }
}

class Contract implements Document {
  private title: string;
  private content: string;
  private parties: string[];
  private effectiveDate: Date;
  private expirationDate: Date;
  private isSigned: boolean;

  constructor(source?: Contract) {
    if (source) {
      this.title = source.title;
      this.content = source.content;
      this.parties = [...source.parties]; // Deep copy of array
      this.effectiveDate = new Date(source.effectiveDate.getTime()); // Deep copy
      this.expirationDate = new Date(source.expirationDate.getTime()); // Deep copy
      this.isSigned = source.isSigned;
    } else {
      this.title = '';
      this.content = '';
      this.parties = [];
      this.effectiveDate = new Date();
      this.expirationDate = new Date();
      this.isSigned = false;
    }
  }

  clone(): Document {
    return new Contract(this);
  }

  getInfo(): string {
    return `Contract: "${this.title}" between ${this.parties.length} parties - ${this.isSigned ? 'Signed' : 'Unsigned'}`;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setContent(content: string): void {
    this.content = content;
  }

  addParty(party: string): void {
    this.parties.push(party);
  }

  setEffectiveDate(date: Date): void {
    this.effectiveDate = date;
  }

  setExpirationDate(date: Date): void {
    this.expirationDate = date;
  }

  sign(): void {
    this.isSigned = true;
  }

  getContent(): string {
    return this.content;
  }
}

// ============================================================================
// PROTOTYPE REGISTRY
// ============================================================================

class DocumentRegistry {
  private prototypes: Map<string, Document> = new Map();

  constructor() {
    // Initialize with some default prototypes
    this.initializeDefaultPrototypes();
  }

  private initializeDefaultPrototypes(): void {
    // Default report template
    const defaultReport = new Report();
    defaultReport.setTitle('Monthly Report Template');
    defaultReport.setContent('This is a template for monthly reports.');
    defaultReport.setAuthor('System');
    defaultReport.setConfidential(false);
    this.prototypes.set('default_report', defaultReport);

    // Confidential report template
    const confidentialReport = new Report();
    confidentialReport.setTitle('Confidential Report Template');
    confidentialReport.setContent('This is a template for confidential reports.');
    confidentialReport.setAuthor('System');
    confidentialReport.setConfidential(true);
    this.prototypes.set('confidential_report', confidentialReport);

    // Default email template
    const defaultEmail = new Email();
    defaultEmail.setTitle('Meeting Invitation Template');
    defaultEmail.setContent('You are invited to attend the following meeting:');
    defaultEmail.setSender('noreply@company.com');
    defaultEmail.addRecipient('team@company.com');
    defaultEmail.setPriority('medium');
    this.prototypes.set('meeting_email', defaultEmail);

    // High priority email template
    const urgentEmail = new Email();
    urgentEmail.setTitle('Urgent Notification Template');
    urgentEmail.setContent('This is an urgent notification that requires immediate attention.');
    urgentEmail.setSender('alerts@company.com');
    urgentEmail.addRecipient('management@company.com');
    urgentEmail.setPriority('high');
    this.prototypes.set('urgent_email', urgentEmail);

    // Contract template
    const contractTemplate = new Contract();
    contractTemplate.setTitle('Service Agreement Template');
    contractTemplate.setContent('This agreement is made between the parties listed below.');
    contractTemplate.addParty('Company A');
    contractTemplate.addParty('Company B');
    contractTemplate.setEffectiveDate(new Date());
    contractTemplate.setExpirationDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)); // 1 year
    this.prototypes.set('service_contract', contractTemplate);
  }

  addPrototype(key: string, prototype: Document): void {
    this.prototypes.set(key, prototype);
  }

  getPrototype(key: string): Document | undefined {
    const prototype = this.prototypes.get(key);
    return prototype ? prototype.clone() : undefined;
  }

  listAvailablePrototypes(): string[] {
    return Array.from(this.prototypes.keys());
  }
}

// ============================================================================
// CLIENT CODE
// ============================================================================

function demonstratePrototypePattern(): void {
  console.log("=== Prototype Pattern Demo ===\n");

  // 1. Basic cloning example
  console.log("1. Basic Cloning Example:");
  const originalReport = new Report();
  originalReport.setTitle("Q4 Sales Report");
  originalReport.setContent("Sales increased by 15% in Q4.");
  originalReport.setAuthor("John Doe");
  originalReport.setConfidential(true);

  console.log("Original:", originalReport.getInfo());

  const clonedReport = originalReport.clone() as Report;
  clonedReport.setTitle("Q4 Sales Report - Copy");
  console.log("Cloned:", clonedReport.getInfo());
  console.log();

  // 2. Email cloning example
  console.log("2. Email Cloning Example:");
  const originalEmail = new Email();
  originalEmail.setTitle("Weekly Update");
  originalEmail.setContent("Here's this week's progress update.");
  originalEmail.setSender("manager@company.com");
  originalEmail.addRecipient("team@company.com");
  originalEmail.addRecipient("stakeholders@company.com");
  originalEmail.setPriority("high");

  console.log("Original:", originalEmail.getInfo());

  const clonedEmail = originalEmail.clone() as Email;
  clonedEmail.setTitle("Weekly Update - Revised");
  clonedEmail.addRecipient("newmember@company.com");
  console.log("Cloned:", clonedEmail.getInfo());
  console.log();

  // 3. Contract cloning example
  console.log("3. Contract Cloning Example:");
  const originalContract = new Contract();
  originalContract.setTitle("Service Agreement");
  originalContract.setContent("Terms and conditions for service provision.");
  originalContract.addParty("Client Corp");
  originalContract.addParty("Service Provider Inc");
  originalContract.setEffectiveDate(new Date());
  originalContract.setExpirationDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)); // 6 months
  originalContract.sign();

  console.log("Original:", originalContract.getInfo());

  const clonedContract = originalContract.clone() as Contract;
  clonedContract.setTitle("Service Agreement - Amendment");
  clonedContract.addParty("Third Party LLC");
  console.log("Cloned:", clonedContract.getInfo());
  console.log();
}

function demonstratePrototypeRegistry(): void {
  console.log("=== Prototype Registry Demo ===\n");

  const registry = new DocumentRegistry();

  console.log("Available prototypes:");
  registry.listAvailablePrototypes().forEach(key => {
    console.log(`- ${key}`);
  });
  console.log();

  // Create documents from registry
  const templates = ['default_report', 'confidential_report', 'meeting_email', 'urgent_email', 'service_contract'];

  templates.forEach(templateKey => {
    const document = registry.getPrototype(templateKey);
    if (document) {
      console.log(`Creating document from '${templateKey}':`);
      console.log(`  ${document.getInfo()}`);

      // Customize the cloned document
      document.setTitle(`${document.getInfo().split(':')[0]}: Customized ${templateKey}`);
      console.log(`  Customized: ${document.getInfo()}`);
      console.log();
    }
  });
}

function demonstrateDeepCopyVsShallowCopy(): void {
  console.log("=== Deep Copy vs Shallow Copy Demo ===\n");

  // Create a complex object with nested data
  const originalEmail = new Email();
  originalEmail.setTitle("Project Update");
  originalEmail.setContent("Project status update for Q1.");
  originalEmail.setSender("pm@company.com");
  originalEmail.addRecipient("dev@company.com");
  originalEmail.addRecipient("qa@company.com");
  originalEmail.addRecipient("design@company.com");
  originalEmail.setPriority("high");

  console.log("Original email recipients:", (originalEmail as any).recipients);

  // Clone the email (deep copy)
  const clonedEmail = originalEmail.clone() as Email;

  // Modify the original
  (originalEmail as any).recipients.push("new@company.com");

  console.log("Original email recipients after modification:", (originalEmail as any).recipients);
  console.log("Cloned email recipients (should be unchanged):", (clonedEmail as any).recipients);
  console.log("Deep copy successful: Cloned object is independent of original");
}

// ============================================================================
// ADVANCED EXAMPLE: Document Builder with Prototype
// ============================================================================

class DocumentBuilder {
  private prototype: Document;

  constructor(prototype: Document) {
    this.prototype = prototype;
  }

  withTitle(title: string): DocumentBuilder {
    const newPrototype = this.prototype.clone();
    newPrototype.setTitle(title);
    return new DocumentBuilder(newPrototype);
  }

  withContent(content: string): DocumentBuilder {
    const newPrototype = this.prototype.clone();
    newPrototype.setContent(content);
    return new DocumentBuilder(newPrototype);
  }

  build(): Document {
    return this.prototype.clone();
  }
}

function demonstrateDocumentBuilder(): void {
  console.log("=== Document Builder with Prototype Demo ===\n");

  const registry = new DocumentRegistry();
  const defaultReport = registry.getPrototype('default_report');

  if (defaultReport) {
    const builder = new DocumentBuilder(defaultReport);

    const customReport = builder
      .withTitle("Custom Q1 Report")
      .withContent("This is a customized report with specific content.")
      .build();

    console.log("Built document:", customReport.getInfo());
  }
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

// Run examples if this file is executed directly
demonstratePrototypePattern();
demonstratePrototypeRegistry();
demonstrateDeepCopyVsShallowCopy();
demonstrateDocumentBuilder();

export {
  Document,
  Report,
  Email,
  Contract,
  DocumentRegistry,
  DocumentBuilder,
  demonstratePrototypePattern,
  demonstratePrototypeRegistry,
  demonstrateDeepCopyVsShallowCopy,
  demonstrateDocumentBuilder
};
