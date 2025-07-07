# Adapter Pattern

**Also known as:** Wrapper
**Category:** Structural Design Patterns
**Main Goal:** Allow objects with incompatible interfaces to work together by converting the interface of one class into another expected by the client.

## Problem

You want to use a class (or library) whose interface is incompatible with the rest of your code. For example:

- Your app receives stock data in XML format, but a third-party analytics library only accepts JSON.
- You cannot modify the third-party library or the data provider.
- You need a way to connect these systems without changing their code.

## Solution

The Adapter pattern introduces a class (the Adapter) that:

- Implements the interface expected by the client (Target Interface)
- Wraps the incompatible class (Adaptee)
- Converts data or calls as needed so the client can use the Adaptee as if it were compatible

## Real-World Analogy

**Power plug adapters:** When you travel to another country, your device's plug may not fit the local socket. A power adapter lets you plug your device into the socket without modifying either the device or the socket.

## Structure

```
      +---------+         +-------------------+
      | Client  |-------> | Target Interface  |
      +---------+         +-------------------+
                               ^
                               |
                        +-------------+
                        |  Adapter    |
                        +-------------+
                               |
                        +-------------+
                        |  Adaptee    |
                        +-------------+
```

## Pseudocode Example

```typescript
// Target Interface: what the client expects
interface StockDataProvider {
  getStockData(): object; // returns JSON
}

// Adaptee: incompatible interface (cannot modify)
class XmlStockDataProvider {
  getStockDataXml(): string {
    return `<stock><symbol>ABC</symbol><price>123.45</price></stock>`;
  }
}

// Adapter: implements Target Interface, wraps Adaptee
class XmlToJsonStockDataAdapter implements StockDataProvider {
  constructor(private xmlProvider: XmlStockDataProvider) {}

  getStockData(): object {
    const xml = this.xmlProvider.getStockDataXml();
    // Simple XML to JSON conversion (for demo)
    const symbolMatch = xml.match(/<symbol>(.*?)<\\/symbol>/);
    const priceMatch = xml.match(/<price>(.*?)<\\/price>/);
    return {
      symbol: symbolMatch ? symbolMatch[1] : "",
      price: priceMatch ? parseFloat(priceMatch[1]) : 0,
    };
  }
}

// Client: only knows about StockDataProvider
class StockChartApp {
  constructor(private provider: StockDataProvider) {}

  display() {
    const data = this.provider.getStockData();
    console.log("Stock Chart Data:", data);
  }
}

// Usage
const xmlProvider = new XmlStockDataProvider();
const adapter = new XmlToJsonStockDataAdapter(xmlProvider);
const app = new StockChartApp(adapter);
app.display();
// Output: Stock Chart Data: { symbol: 'ABC', price: 123.45 }
```

## How to Implement

1. **Identify the incompatible interfaces**: The client expects one interface, but the service (adaptee) provides another.
2. **Define the Target Interface**: This is what the client expects.
3. **Create the Adapter class**: Implement the Target Interface, and wrap an instance of the Adaptee.
4. **Implement conversion logic**: In each method, convert calls/data as needed and delegate to the Adaptee.
5. **Use the Adapter in client code**: The client only interacts with the Target Interface, not the Adaptee directly.

## When to Use (Applicability)

| Situation | Should Use Adapter? |
|-----------|---------------------|
| Need to use an existing class but its interface is incompatible | Yes |
| Want to integrate with a third-party or legacy system | Yes |
| Cannot modify the source code of the service/adaptee | Yes |
| Need to reuse several subclasses that lack a common interface | Yes |

## Pros and Cons

| Pros | Cons |
|------|------|
| Allows reuse of existing code without modification | Adds extra classes and complexity |
| Follows SOLID (SRP, OCP) | Sometimes direct modification is simpler (if allowed) |
| Decouples client from service implementation | |
| Makes integration with third-party/legacy code easy | |

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Facade | Facade provides a new interface for a subsystem; Adapter makes an existing interface usable. Adapter usually wraps one object, Facade wraps a subsystem. |
| Proxy | Proxy and Adapter have similar structure, but Proxy controls access, Adapter changes interface. |
| Decorator | Decorator adds behavior, Adapter changes interface. Both wrap objects. |
| Bridge | Bridge separates abstraction from implementation; Adapter makes existing implementation compatible. |

## Quick Summary

**Goal**: Make incompatible interfaces compatible without modifying their code.

**Core**: Adapter implements Target Interface, wraps Adaptee, converts calls/data as needed.

**Real applications**: Integrating third-party libraries, legacy system integration, format conversion (XML↔JSON), hardware adapters.

**Reference:** [Adapter Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/adapter)

---

## Key Points / Reminders

Remember that an adapter is meant to:
- **Wrap the adaptee** and expose a target interface to the client.
- **Indirectly change the adaptee's interface** into one that the client is expecting by implementing a target interface.
- **Indirectly translate the client's request** into one that the adaptee is expecting.
- **Reuse an existing adaptee** with an incompatible interface.
