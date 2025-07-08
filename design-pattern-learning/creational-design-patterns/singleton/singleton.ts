/**
 * Singleton Pattern - TypeScript Implementation
 *
 * This example demonstrates the Singleton pattern using various real-world scenarios
 * like database connections, logging services, and configuration managers.
 *
 * IMPORTANT: Singleton should be used carefully to avoid:
 * - God Object anti-pattern (too many responsibilities)
 * - Hidden dependencies (hard to test)
 * - Tight coupling across the application
 * - Thread-safety issues in multi-threaded environments
 */

// ============================================================================
// BASIC SINGLETON IMPLEMENTATION
// ============================================================================

/**
 * Database Singleton - Example of a resource-intensive singleton
 *
 * FLOW:
 * 1. Client calls Database.getInstance()
 * 2. If no instance exists → create new instance (lazy initialization)
 * 3. If instance exists → return existing instance
 * 4. All subsequent calls return the same instance
 *
 * ISSUES TO CONSIDER:
 * - Thread safety in multi-threaded environments
 * - Memory leaks if not properly managed
 * - Testing difficulties (hard to mock)
 * - Lifecycle management (when to destroy?)
 */
class Database {
  // PRIVATE STATIC INSTANCE - The single instance that will be shared
  // This is the core of the Singleton pattern
  private static instance: Database;

  // PRIVATE FIELDS - Instance-specific data
  private connectionString: string;
  private isConnected: boolean = false;

  /**
   * PRIVATE CONSTRUCTOR - Prevents direct instantiation with 'new'
   *
   * This is crucial for Singleton pattern:
   * - Prevents: new Database() (not allowed)
   * - Forces: Database.getInstance() (required)
   *
   * ISSUE: Makes inheritance impossible (breaks Liskov Substitution Principle)
   */
  private constructor() {
    this.connectionString = 'postgresql://localhost:5432/mydb';
    console.log('Database: Initializing connection...');
  }

  /**
   * GLOBAL ACCESS POINT - The only way to get the instance
   *
   * FLOW:
   * 1. Check if instance exists
   * 2. If not → create new instance (lazy initialization)
   * 3. If yes → return existing instance
   *
   * BENEFITS:
   * - Lazy initialization (saves resources)
   * - Guaranteed single instance
   *
   * ISSUES:
   * - Not thread-safe by default
   * - Can become a bottleneck in high-concurrency scenarios
   */
  public static getInstance(): Database {
    // CHECK IF INSTANCE EXISTS
    if (!Database.instance) {  // If the instance is not created, create it
      // CREATE NEW INSTANCE (lazy initialization)
      Database.instance = new Database();
    }
    // RETURN EXISTING INSTANCE
    return Database.instance;
  }

  /**
   * CONNECT TO DATABASE
   *
   * Since this is a singleton, all parts of the application
   * will share the same connection state
   */
  public connect(): void {
    if (!this.isConnected) {
      console.log(`Database: Connecting to ${this.connectionString}...`);
      this.isConnected = true;
      console.log('Database: Connected successfully!');
    } else {
      console.log('Database: Already connected!');
    }
  }

  /**
   * DISCONNECT FROM DATABASE
   *
   * WARNING: Disconnecting affects ALL parts of the application
   * that use this singleton
   */
  public disconnect(): void {
    if (this.isConnected) {
      console.log('Database: Disconnecting...');
      this.isConnected = false;
      console.log('Database: Disconnected!');
    } else {
      console.log('Database: Not connected!');
    }
  }

  /**
   * EXECUTE QUERY
   *
   * All queries go through the same connection
   * - Good: Resource efficient
   * - Bad: Single point of failure
   */
  public query(sql: string): void {
    if (!this.isConnected) {
      console.log('Database: Error - Not connected!');
      return;
    }
    console.log(`Database: Executing query: ${sql}`);
  }

  /**
   * GET CONNECTION STATUS
   *
   * Returns the shared state across the entire application
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// ============================================================================
// LOGGER SINGLETON
// ============================================================================

/**
 * Logger Singleton - Example of a stateful singleton
 *
 * FLOW:
 * 1. All parts of the application call Logger.getInstance()
 * 2. They all get the same logger instance
 * 3. All logs are collected in the same place
 * 4. Log level is shared across the entire application
 *
 * BENEFITS:
 * - Centralized logging
 * - Consistent log format
 * - Shared log level across the app
 *
 * ISSUES:
 * - Global state can be problematic
 * - Hard to test (logs are side effects)
 * - Memory growth (logs accumulate)
 * - No log rotation by default
 */
class Logger {
  // PRIVATE STATIC INSTANCE - Shared across the entire application
  private static instance: Logger;

  // SHARED STATE - All parts of the app see the same logs and log level
  private logs: string[] = [];
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  /**
   * PRIVATE CONSTRUCTOR - Prevents multiple logger instances
   */
  private constructor() {
    console.log('Logger: Initializing logging service...');
  }

  /**
   * GLOBAL ACCESS POINT - Returns the single logger instance
   *
   * ISSUE: This creates a hidden dependency
   * - Code doesn't explicitly declare it needs a logger
   * - Makes testing difficult
   * - Creates tight coupling
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {  // If the instance is not created, create it
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * SET LOG LEVEL - Affects the entire application
   *
   * ISSUE: Global state mutation
   * - Changing log level affects ALL parts of the app
   * - Can cause unexpected behavior in other modules
   */
  public setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {  // Set the log level
    this.logLevel = level;
    console.log(`Logger: Log level set to ${level}`);
  }

  /**
   * LOG MESSAGE - Adds to the shared log collection
   *
   * ISSUE: Memory leak potential
   * - Logs accumulate indefinitely
   * - No automatic cleanup
   * - Can cause memory issues in long-running apps
   */
  public log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {  // Log a message
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    this.logs.push(logEntry);
    console.log(logEntry);
  }

  public debug(message: string): void {  // Log a debug message
    this.log('debug', message);
  }

  public info(message: string): void {
    this.log('info', message);
  }

  public warn(message: string): void {
    this.log('warn', message);
  }

  public error(message: string): void {
    this.log('error', message);
  }

  /**
   * GET LOGS - Returns a copy to prevent external modification
   *
   * GOOD PRACTICE: Return defensive copy
   * - Prevents external code from modifying internal state
   * - Maintains encapsulation
   */
  public getLogs(): string[] {
    return [...this.logs]; // Return a copy to prevent external modification
  }

  /**
   * CLEAR LOGS - Clears all logs from memory
   *
   * WARNING: This affects ALL parts of the application
   * - Any code that has a reference to logs will see them disappear
   * - Can cause unexpected behavior
   */
  public clearLogs(): void {
    this.logs = [];
    console.log('Logger: Logs cleared');
  }
}

// ============================================================================
// CONFIGURATION MANAGER SINGLETON
// ============================================================================

/**
 * Configuration interface - Defines the structure of application configuration
 *
 * ISSUE: Configuration is often environment-specific
 * - Singleton makes it hard to have different configs for different environments
 * - Testing becomes difficult (can't easily mock different configs)
 */
interface AppConfig {
  databaseUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  maxConnections: number;
  timeout: number;
}

/**
 * ConfigurationManager Singleton - Example of a configuration singleton
 *
 * FLOW:
 * 1. Application starts → ConfigurationManager.getInstance()
 * 2. Configuration is loaded once → loadConfig()
 * 3. All parts of the app access the same configuration
 * 4. Changes to config affect the entire application
 *
 * BENEFITS:
 * - Single source of truth for configuration
 * - Consistent configuration across the app
 * - Easy to access from anywhere
 *
 * ISSUES:
 * - Hard to test with different configurations
 * - No environment-specific configs
 * - Global state mutation
 * - Hidden dependencies
 */
class ConfigurationManager {
  // PRIVATE STATIC INSTANCE - Shared configuration across the app
  private static instance: ConfigurationManager;

  // SHARED CONFIGURATION STATE - All parts of the app see the same config
  private config: AppConfig;
  private isLoaded: boolean = false;

  /**
   * PRIVATE CONSTRUCTOR - Prevents multiple configuration managers
   *
   * ISSUE: Default values are hardcoded
   * - Makes it hard to have different defaults for different environments
   * - Testing becomes difficult
   */
  private constructor() {
    console.log('ConfigurationManager: Initializing...');
    this.config = {
      databaseUrl: '',
      apiKey: '',
      environment: 'development',
      maxConnections: 10,
      timeout: 5000
    };
  }

  /**
   * GLOBAL ACCESS POINT - Returns the single configuration manager
   *
   * ISSUE: Hidden dependency
   * - Code doesn't explicitly declare it needs configuration
   * - Makes testing and refactoring difficult
   */
  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  /**
   * LOAD CONFIGURATION - Sets the configuration for the entire application
   *
   * ISSUE: Global state mutation
   * - Changing config affects ALL parts of the app
   * - Can cause race conditions if called from multiple places
   * - No validation of configuration values
   */
  public loadConfig(config: Partial<AppConfig>): void {
    this.config = { ...this.config, ...config };
    this.isLoaded = true;
    console.log('ConfigurationManager: Configuration loaded');
  }

  /**
   * GET CONFIGURATION - Returns a copy to prevent external modification
   *
   * GOOD PRACTICE: Defensive copy
   * - Prevents external code from modifying internal config
   * - Maintains encapsulation
   */
  public getConfig(): AppConfig {
    if (!this.isLoaded) {
      console.warn('ConfigurationManager: Configuration not loaded yet');
    }
    return { ...this.config }; // Return a copy to prevent external modification
  }

  /**
   * GET CONFIGURATION VALUE - Type-safe access to config values
   *
   * GOOD: Type safety with generics
   * - Compile-time checking of config keys
   * - Prevents runtime errors from typos
   */
  public getValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  /**
   * SET CONFIGURATION VALUE - Updates configuration for the entire app
   *
   * ISSUE: Global state mutation
   * - Changes affect ALL parts of the application
   * - No validation of new values
   * - Can cause unexpected behavior in other modules
   */
  public setValue<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
    console.log(`ConfigurationManager: ${key} updated to ${value}`);
  }

  /**
   * CHECK IF CONFIGURATION IS LOADED
   *
   * Useful for ensuring configuration is available before using it
   */
  public isConfigLoaded(): boolean {
    return this.isLoaded;
  }
}

// ============================================================================
// CACHE MANAGER SINGLETON
// ============================================================================

/**
 * CacheManager Singleton - Example of a resource management singleton
 *
 * FLOW:
 * 1. Application starts → CacheManager.getInstance()
 * 2. Cache is initialized with cleanup timer
 * 3. All parts of the app share the same cache
 * 4. Automatic cleanup prevents memory leaks
 *
 * BENEFITS:
 * - Shared cache across the application
 * - Automatic TTL management
 * - Memory leak prevention
 * - Centralized cache management
 *
 * ISSUES:
 * - Global state (all parts see the same cache)
 * - Memory usage (cache grows with app usage)
 * - No cache partitioning
 * - Hard to test with different cache states
 */
class CacheManager {
  // PRIVATE STATIC INSTANCE - Shared cache across the application
  private static instance: CacheManager;

  // SHARED CACHE STATE - All parts of the app share the same cache
  private cache: Map<string, any> = new Map();
  private maxSize: number = 100;
  private ttl: Map<string, number> = new Map(); // Time to live in milliseconds

  /**
   * PRIVATE CONSTRUCTOR - Initializes cache and cleanup timer
   *
   * GOOD: Automatic cleanup prevents memory leaks
   * - Timer runs every 30 seconds
   * - Removes expired entries
   * - Prevents unbounded memory growth
   */
  private constructor() {
    console.log('CacheManager: Initializing cache...');
    this.startCleanupTimer();
  }

  /**
   * GLOBAL ACCESS POINT - Returns the single cache manager
   *
   * ISSUE: Hidden dependency
   * - Code doesn't explicitly declare it needs cache
   * - Makes testing difficult
   */
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * SET CACHE ENTRY - Stores value with TTL
   *
   * GOOD: Automatic eviction when cache is full
   * - Prevents memory overflow
   * - Uses LRU-like eviction (oldest TTL first)
   *
   * ISSUE: Global state mutation
   * - Affects all parts of the application
   * - Can cause race conditions
   */
  public set(key: string, value: any, ttlMs: number = 60000): void { // Default 1 minute
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
    console.log(`CacheManager: Set ${key} (TTL: ${ttlMs}ms)`);
  }

  /**
   * GET CACHE ENTRY - Retrieves value if not expired
   *
   * GOOD: Automatic expiration handling
   * - Checks TTL on every access
   * - Removes expired entries automatically
   * - Returns null for missing/expired entries
   */
  public get(key: string): any {
    const value = this.cache.get(key);
    const expiry = this.ttl.get(key);

    if (value && expiry && Date.now() < expiry) {
      console.log(`CacheManager: Hit for ${key}`);
      return value;
    } else {
      if (value) {
        this.cache.delete(key);
        this.ttl.delete(key);
        console.log(`CacheManager: Expired ${key}`);
      } else {
        console.log(`CacheManager: Miss for ${key}`);
      }
      return null;
    }
  }

  /**
   * DELETE CACHE ENTRY - Removes specific entry
   *
   * GOOD: Clean removal of both cache and TTL
   */
  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.ttl.delete(key);
    if (deleted) {
      console.log(`CacheManager: Deleted ${key}`);
    }
    return deleted;
  }

  /**
   * CLEAR CACHE - Removes all entries
   *
   * WARNING: Affects ALL parts of the application
   * - Any code that has cached data will lose it
   * - Can cause unexpected behavior
   */
  public clear(): void {
    this.cache.clear();
    this.ttl.clear();
    console.log('CacheManager: Cache cleared');
  }

  /**
   * GET CACHE SIZE - Returns current number of entries
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * EVICT OLDEST ENTRY - Removes entry with oldest TTL
   *
   * GOOD: Prevents cache overflow
   * - Called automatically when cache is full
   * - Uses TTL-based eviction strategy
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, expiry] of this.ttl.entries()) {
      if (expiry < oldestTime) {
        oldestTime = expiry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
   * START CLEANUP TIMER - Automatically removes expired entries
   *
   * GOOD: Prevents memory leaks
   * - Runs every 30 seconds
   * - Removes expired entries automatically
   * - No manual cleanup required
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, expiry] of this.ttl.entries()) {
        if (now >= expiry) {
          this.cache.delete(key);
          this.ttl.delete(key);
        }
      }
    }, 30000); // Clean up every 30 seconds
  }
}

// ============================================================================
// THREAD-SAFE SINGLETON (FOR DEMONSTRATION)
// ============================================================================

/**
 * ThreadSafeSingleton - Example of thread-safe singleton implementation
 *
 * IMPORTANT: This is a simplified demonstration
 * - Real thread safety requires proper synchronization primitives
 * - In Node.js, this is typically not needed (single-threaded)
 * - In multi-threaded environments, use proper locks/mutexes
 *
 * FLOW:
 * 1. Multiple threads call getInstance() simultaneously
 * 2. Lock mechanism prevents multiple instance creation
 * 3. Only one thread creates the instance
 * 4. All threads get the same instance
 *
 * ISSUES TO CONSIDER:
 * - Performance impact of locking
 * - Deadlock potential
 * - Memory barriers in some architectures
 * - Double-checked locking optimization
 */
class ThreadSafeSingleton {
  // PRIVATE STATIC INSTANCE - Shared across all threads
  private static instance: ThreadSafeSingleton;

  // LOCK MECHANISM - Prevents multiple instance creation
  // In real implementation, use proper synchronization primitives
  private static readonly lock = new Map<string, boolean>();

  /**
   * PRIVATE CONSTRUCTOR - Prevents direct instantiation
   */
  private constructor() {
    console.log('ThreadSafeSingleton: Instance created');
  }

  /**
   * THREAD-SAFE GLOBAL ACCESS POINT
   *
   * WARNING: This is a simplified implementation
   * - Real thread safety requires proper synchronization
   * - This demonstration uses a simple lock mechanism
   * - In production, use language-specific synchronization primitives
   *
   * FLOW:
   * 1. Check if another thread is creating instance
   * 2. If yes → wait for it to finish
   * 3. If no → acquire lock and create instance
   * 4. Release lock and return instance
   *
   * ISSUES:
   * - Busy waiting (inefficient)
   * - Not truly thread-safe in all scenarios
   * - Performance bottleneck in high-concurrency
   */
  public static getInstance(): ThreadSafeSingleton {
    // CHECK IF ANOTHER THREAD IS CREATING INSTANCE
    if (ThreadSafeSingleton.lock.get('creating')) {
      // WAIT FOR OTHER THREAD TO FINISH CREATING
      while (ThreadSafeSingleton.lock.get('creating')) {
        // In real implementation, you'd use proper synchronization
        // This is just for demonstration
        // Consider using: mutex, semaphore, or atomic operations
      }
    }

    // CHECK IF INSTANCE EXISTS
    if (!ThreadSafeSingleton.instance) {
      // ACQUIRE LOCK
      ThreadSafeSingleton.lock.set('creating', true);

      // CREATE NEW INSTANCE (only one thread does this)
      ThreadSafeSingleton.instance = new ThreadSafeSingleton();

      // RELEASE LOCK
      ThreadSafeSingleton.lock.set('creating', false);
    }

    // RETURN EXISTING INSTANCE
    return ThreadSafeSingleton.instance;
  }

  /**
   * BUSINESS METHOD - Example of singleton functionality
   */
  public doSomething(): void {
    console.log('ThreadSafeSingleton: Doing something...');
  }
}

// ============================================================================
// DEMONSTRATION FUNCTIONS
// ============================================================================

function demonstrateBasicSingleton(): void {
  console.log("=== Basic Singleton Demo ===\n");

  // Get database instances
  const db1 = Database.getInstance();
  const db2 = Database.getInstance();

  console.log('Are db1 and db2 the same instance?', db1 === db2); // Should be true

  // Test database operations
  db1.connect();
  db1.query('SELECT * FROM users');
  db2.query('SELECT * FROM products'); // Uses same connection

  console.log('Connection status:', db1.getConnectionStatus());
  console.log();
}

function demonstrateLoggerSingleton(): void {
  console.log("=== Logger Singleton Demo ===\n");

  const logger1 = Logger.getInstance();
  const logger2 = Logger.getInstance();

  console.log('Are logger1 and logger2 the same instance?', logger1 === logger2);

  logger1.setLogLevel('debug');
  logger1.info('Application started');
  logger1.warn('High memory usage detected');
  logger1.error('Failed to connect to external service');

  // Both loggers share the same state
  console.log('Logs from logger2:', logger2.getLogs().length, 'entries');
  console.log();
}

function demonstrateConfigurationSingleton(): void {
  console.log("=== Configuration Singleton Demo ===\n");

  const config1 = ConfigurationManager.getInstance();
  const config2 = ConfigurationManager.getInstance();

  console.log('Are config1 and config2 the same instance?', config1 === config2);

  // Load configuration
  config1.loadConfig({
    databaseUrl: 'postgresql://localhost:5432/production',
    apiKey: 'secret-api-key-123',
    environment: 'production',
    maxConnections: 50,
    timeout: 10000
  });

  // Access configuration from different instances
  console.log('Database URL:', config2.getValue('databaseUrl'));
  console.log('Environment:', config2.getValue('environment'));
  console.log('Max Connections:', config2.getValue('maxConnections'));

  // Update configuration
  config1.setValue('timeout', 15000);
  console.log('Updated timeout:', config2.getValue('timeout'));
  console.log();
}

function demonstrateCacheSingleton(): void {
  console.log("=== Cache Singleton Demo ===\n");

  const cache1 = CacheManager.getInstance();
  const cache2 = CacheManager.getInstance();

  console.log('Are cache1 and cache2 the same instance?', cache1 === cache2);

  // Set some cache entries
  cache1.set('user:123', { id: 123, name: 'John Doe' }, 30000); // 30 seconds
  cache1.set('product:456', { id: 456, name: 'Laptop' }, 60000); // 1 minute

  // Retrieve from different instance
  const user = cache2.get('user:123');
  const product = cache2.get('product:456');

  console.log('Cached user:', user);
  console.log('Cached product:', product);
  console.log('Cache size:', cache2.size());

  // Test cache miss
  const nonExistent = cache1.get('nonexistent');
  console.log('Non-existent key:', nonExistent);
  console.log();
}

function demonstrateThreadSafeSingleton(): void {
  console.log("=== Thread-Safe Singleton Demo ===\n");

  const instance1 = ThreadSafeSingleton.getInstance();
  const instance2 = ThreadSafeSingleton.getInstance();

  console.log('Are instance1 and instance2 the same?', instance1 === instance2);

  instance1.doSomething();
  instance2.doSomething();
  console.log();
}

function demonstrateSingletonAntiPatterns(): void {
  console.log("=== Singleton Anti-Patterns Demo ===\n");

  console.log("Anti-Pattern: God Object");
  console.log("   - Singleton with too many responsibilities");
  console.log("   - Hard to test and maintain");
  console.log("   - Violates Single Responsibility Principle");
  console.log("   - Example: A singleton that handles logging, caching, config, and DB");
  console.log();

  console.log("Anti-Pattern: Hidden Dependencies");
  console.log("   - Code implicitly depends on Singleton");
  console.log("   - Difficult to mock in tests");
  console.log("   - Makes refactoring dangerous");
  console.log("   - Example: Logger.getInstance() scattered throughout code");
  console.log();

  console.log("Anti-Pattern: Global State Mutation");
  console.log("   - Changing singleton state affects entire application");
  console.log("   - Can cause race conditions");
  console.log("   - Hard to track state changes");
  console.log("   - Example: ConfigManager.setValue() affects all modules");
  console.log();

  console.log("Best Practice: Use Dependency Injection");
  console.log("   - Inject dependencies instead of using Singleton everywhere");
  console.log("   - Makes code more testable and flexible");
  console.log("   - Example: constructor(logger: ILogger) instead of Logger.getInstance()");
  console.log();

  console.log("Best Practice: Consider Alternatives");
  console.log("   - Use object pools for resource management");
  console.log("   - Use service locator pattern for global access");
  console.log("   - Use dependency injection containers");
  console.log("   - Use environment variables for configuration");
  console.log();
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

// Run examples if this file is executed directly
demonstrateBasicSingleton();
demonstrateLoggerSingleton();
demonstrateConfigurationSingleton();
demonstrateCacheSingleton();
demonstrateThreadSafeSingleton();
demonstrateSingletonAntiPatterns();

export {
  Database,
  Logger,
  ConfigurationManager,
  CacheManager,
  ThreadSafeSingleton,
  demonstrateBasicSingleton,
  demonstrateLoggerSingleton,
  demonstrateConfigurationSingleton,
  demonstrateCacheSingleton,
  demonstrateThreadSafeSingleton,
  demonstrateSingletonAntiPatterns
};
