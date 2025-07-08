/**
 * Adapter Pattern Example (Object Adapter)
 *
 * Scenario: Integrate a stock chart app (expects JSON) with a legacy XML data provider.
 * The Adapter converts XML to JSON so the app can use the provider without any changes.
 */

// Target Interface: what the client expects
export interface StockDataProvider {
  getStockData(): object; // returns JSON
}

// Adaptee: incompatible interface (cannot modify)
export class XmlStockDataProvider {
  getStockDataXml(): string {
    // Simulate XML data
    return `<stock><symbol>ABC</symbol><price>123.45</price></stock>`;
  }
}

// Adapter: implements Target Interface, wraps Adaptee
export class XmlToJsonStockDataAdapter implements StockDataProvider {
  constructor(private xmlProvider: XmlStockDataProvider) {}

  getStockData(): object {
    const xml = this.xmlProvider.getStockDataXml();
    // Simple XML to JSON conversion (for demo purposes only)
    const symbolMatch = xml.match(/<symbol>(.*?)<\/symbol>/);
    const priceMatch = xml.match(/<price>(.*?)<\/price>/);
    return {
      symbol: symbolMatch ? symbolMatch[1] : "",
      price: priceMatch ? parseFloat(priceMatch[1]) : 0,
    };
  }
}

// Client: only knows about StockDataProvider
export class StockChartApp {
  constructor(private provider: StockDataProvider) {}

  display(): void {
    const data = this.provider.getStockData();
    console.log("Stock Chart Data:", data);
    // ...render chart with JSON data
  }
}

// Demo function
export function demonstrateAdapterPattern(): void {
  console.log("=== Adapter Pattern Demo ===\n");

  // Legacy XML provider
  const xmlProvider = new XmlStockDataProvider();
  // Adapter wraps the XML provider
  const adapter = new XmlToJsonStockDataAdapter(xmlProvider);
  // Client uses the adapter as if it were a JSON provider
  const app = new StockChartApp(adapter);

  app.display();
  // Output: Stock Chart Data: { symbol: 'ABC', price: 123.45 }
}
