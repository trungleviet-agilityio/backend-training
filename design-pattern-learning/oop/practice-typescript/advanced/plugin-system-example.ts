// Advanced OOP Example: Plugin System Domain
// Demonstrates interfaces, abstract classes, generics, type guards, error handling

// AdvancedPlugin: Interface for plugins in this example
interface AdvancedPlugin {
  name: string;
  execute(): void;
}

// AdvancedBasePlugin: Abstract base class for plugins
abstract class AdvancedBasePlugin implements AdvancedPlugin {
  constructor(public name: string) {}
  abstract execute(): void;
}

// AdvancedLoggerPlugin: Concrete logger plugin
class AdvancedLoggerPlugin extends AdvancedBasePlugin {
  execute(): void {
    console.log(`[LoggerPlugin] Logging data...`);
  }
}

// AdvancedAuthPlugin: Concrete auth plugin
class AdvancedAuthPlugin extends AdvancedBasePlugin {
  execute(): void {
    console.log(`[AuthPlugin] Authenticating user...`);
  }
}

// AdvancedPluginManager: Manages plugins using generics
class AdvancedPluginManager<T extends AdvancedPlugin> {
  private plugins: T[] = [];
  register(plugin: T): void {
    this.plugins.push(plugin);
    console.log(`Registered plugin: ${plugin.name}`);
  }
  runAll(): void {
    for (const plugin of this.plugins) {
      plugin.execute();
    }
  }
}

// Type guard for AdvancedLoggerPlugin
function isAdvancedLoggerPlugin(plugin: AdvancedPlugin): plugin is AdvancedLoggerPlugin {
  return plugin.name === 'Logger';
}

// --- DEMO ---
const manager = new AdvancedPluginManager<AdvancedPlugin>();
manager.register(new AdvancedLoggerPlugin('Logger'));
manager.register(new AdvancedAuthPlugin('Auth'));
manager.runAll();
