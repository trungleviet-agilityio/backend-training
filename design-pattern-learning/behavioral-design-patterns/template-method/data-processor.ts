/**
 * Template Method Pattern - Data Processor Example
 *
 * This example demonstrates how to use the Template Method pattern
 * to process different types of data files (CSV, JSON, XML) while
 * sharing common processing logic.
 */

// Abstract class defining the template method
abstract class DataProcessor {
  /**
   * Template method - defines the algorithm structure
   * This method cannot be overridden by subclasses
   */
  public processData(filePath: string): void {
    console.log(`\n=== Processing ${filePath} ===`);

    // Step 1: Validate file
    this.validateFile(filePath);

    // Step 2: Read file (abstract - must be implemented by subclasses)
    const rawData = this.readFile(filePath);

    // Step 3: Parse data (abstract - must be implemented by subclasses)
    const parsedData = this.parseData(rawData);

    // Step 4: Transform data (concrete - can be overridden)
    const transformedData = this.transformData(parsedData);

    // Step 5: Validate data (hook - optional override)
    if (this.shouldValidateData()) {
      this.validateData(transformedData);
    }

    // Step 6: Save results (concrete - can be overridden)
    this.saveResults(transformedData, filePath);

    // Step 7: Cleanup (hook - optional override)
    this.cleanup();

    console.log("=== Processing completed ===\n");
  }

  // Abstract methods - must be implemented by subclasses
  protected abstract readFile(filePath: string): string;
  protected abstract parseData(rawData: string): any;

  // Concrete methods - default implementation, can be overridden
  protected validateFile(filePath: string): void {
    console.log(`Validating file: ${filePath}`);
    if (!filePath || filePath.trim() === '') {
      throw new Error('File path is required');
    }
    console.log('✓ File validation passed');
  }

  protected transformData(data: any): any {
    console.log('Transforming data...');
    // Default transformation: convert to uppercase if string
    if (typeof data === 'string') {
      return data.toUpperCase();
    }
    if (Array.isArray(data)) {
      return data.map(item =>
        typeof item === 'string' ? item.toUpperCase() : item
      );
    }
    if (typeof data === 'object') {
      const transformed: any = {};
      for (const [key, value] of Object.entries(data)) {
        transformed[key.toUpperCase()] =
          typeof value === 'string' ? value.toUpperCase() : value;
      }
      return transformed;
    }
    return data;
  }

  protected saveResults(data: any, originalPath: string): void {
    console.log('Saving results...');
    const outputPath = originalPath.replace(/\.[^/.]+$/, '_processed.txt');
    console.log(`Results saved to: ${outputPath}`);
  }

  // Hook methods - optional override
  protected shouldValidateData(): boolean {
    return true; // Default behavior
  }

  protected validateData(data: any): void {
    console.log('Validating processed data...');
    if (!data) {
      throw new Error('Data validation failed: empty data');
    }
    console.log('✓ Data validation passed');
  }

  protected cleanup(): void {
    console.log('Performing cleanup...');
    // Default cleanup is empty
  }
}

// Concrete implementation for CSV files
class CSVProcessor extends DataProcessor {
  protected readFile(filePath: string): string {
    console.log('Reading CSV file...');
    // Simulate reading CSV file
    return 'name,age,city\nJohn,25,New York\nJane,30,Los Angeles';
  }

  protected parseData(rawData: string): any {
    console.log('Parsing CSV data...');
    const lines = rawData.trim().split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim();
      });
      return row;
    });
    return data;
  }

  // Override hook method
  protected shouldValidateData(): boolean {
    return true; // Always validate CSV data
  }

  protected validateData(data: any): void {
    console.log('Validating CSV data...');
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('CSV validation failed: no data rows');
    }

    // Check if all rows have required fields
    const requiredFields = ['name', 'age', 'city'];
    for (const row of data) {
      for (const field of requiredFields) {
        if (!row[field]) {
          throw new Error(`CSV validation failed: missing field '${field}'`);
        }
      }
    }
    console.log('✓ CSV data validation passed');
  }
}

// Concrete implementation for JSON files
class JSONProcessor extends DataProcessor {
  protected readFile(filePath: string): string {
    console.log('Reading JSON file...');
    // Simulate reading JSON file
    return JSON.stringify({
      users: [
        { name: 'Alice', age: 28, department: 'Engineering' },
        { name: 'Bob', age: 32, department: 'Marketing' }
      ],
      metadata: {
        total: 2,
        lastUpdated: '2024-01-15'
      }
    });
  }

  protected parseData(rawData: string): any {
    console.log('Parsing JSON data...');
    try {
      return JSON.parse(rawData);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  // Override concrete method
  protected transformData(data: any): any {
    console.log('Transforming JSON data...');
    if (data.users && Array.isArray(data.users)) {
      // Add a processed timestamp to each user
      data.users = data.users.map((user: any) => ({
        ...user,
        processedAt: new Date().toISOString()
      }));
    }
    return data;
  }

  // Override hook method
  protected shouldValidateData(): boolean {
    return false; // Skip validation for JSON
  }

  // Override hook method
  protected cleanup(): void {
    console.log('Cleaning up JSON processor resources...');
    // Simulate cleanup operations
  }
}

// Concrete implementation for XML files
class XMLProcessor extends DataProcessor {
  protected readFile(filePath: string): string {
    console.log('Reading XML file...');
    // Simulate reading XML file
    return `
      <employees>
        <employee id="1">
          <name>Charlie</name>
          <position>Developer</position>
          <salary>75000</salary>
        </employee>
        <employee id="2">
          <name>Diana</name>
          <position>Designer</position>
          <salary>65000</salary>
        </employee>
      </employees>
    `;
  }

  protected parseData(rawData: string): any {
    console.log('Parsing XML data...');
    // Simple XML parsing simulation
    const employees: any[] = [];
    const employeeMatches = rawData.match(/<employee[^>]*>([\s\S]*?)<\/employee>/g);

    if (employeeMatches) {
      for (const match of employeeMatches) {
        const idMatch = match.match(/id="([^"]*)"/);
        const nameMatch = match.match(/<name>([^<]*)<\/name>/);
        const positionMatch = match.match(/<position>([^<]*)<\/position>/);
        const salaryMatch = match.match(/<salary>([^<]*)<\/salary>/);

        employees.push({
          id: idMatch?.[1],
          name: nameMatch?.[1],
          position: positionMatch?.[1],
          salary: salaryMatch?.[1]
        });
      }
    }

    return { employees };
  }

  // Override concrete method
  protected saveResults(data: any, originalPath: string): void {
    console.log('Saving XML results...');
    const outputPath = originalPath.replace(/\.[^/.]+$/, '_processed.json');
    console.log(`XML results converted and saved to: ${outputPath}`);
  }
}

// Standalone demonstration function
export function demonstrateTemplateMethod() {
  console.log('🧠 Template Method Pattern - Data Processor Example\n');

  try {
    // Process different file types
    const csvProcessor = new CSVProcessor();
    csvProcessor.processData('data.csv');

    const jsonProcessor = new JSONProcessor();
    jsonProcessor.processData('data.json');

    const xmlProcessor = new XMLProcessor();
    xmlProcessor.processData('data.xml');

  } catch (error) {
    console.error('Error during processing:', (error as Error).message);
  }
}

// Run the demonstration
demonstrateTemplateMethod();
