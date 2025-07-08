/**
 * Chain of Responsibility Pattern - Authentication Example
 *
 * This example demonstrates a request passing through a chain of handlers:
 * - AuthHandler: checks if user is authenticated
 * - BruteForceHandler: checks for brute-force attempts
 * - ValidationHandler: checks if request data is valid
 * - MainLogicHandler: processes the request if all checks pass
 */

// Handler interface
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: Request): any;
}

// Request type for demonstration
interface Request {
  userAuthenticated: boolean;
  isBruteForce: boolean;
  dataValid: boolean;
  userIsAdmin?: boolean;
}

// BaseHandler with default chain logic
abstract class BaseHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: Request): any {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

// Concrete handler: AuthHandler
class AuthHandler extends BaseHandler {
  handle(request: Request): any {
    if (!request.userAuthenticated) {
      console.log('❌ Not Authenticated. Stopping chain.');
      return 'Authentication failed';
    }
    console.log('✅ Authenticated. Passing to next handler...');
    return super.handle(request);
  }
}

// Concrete handler: BruteForceHandler
class BruteForceHandler extends BaseHandler {
  handle(request: Request): any {
    if (request.isBruteForce) {
      console.log('❌ Brute-force detected. Stopping chain.');
      return 'Blocked: Brute-force detected';
    }
    console.log('✅ No brute-force. Passing to next handler...');
    return super.handle(request);
  }
}

// Concrete handler: ValidationHandler
class ValidationHandler extends BaseHandler {
  handle(request: Request): any {
    if (!request.dataValid) {
      console.log('❌ Invalid data. Stopping chain.');
      return 'Invalid request data';
    }
    console.log('✅ Data valid. Passing to next handler...');
    return super.handle(request);
  }
}

// Concrete handler: MainLogicHandler
class MainLogicHandler extends BaseHandler {
  handle(request: Request): any {
    console.log('🎯 All checks passed. Processing main logic...');
    return 'Request processed successfully!';
  }
}

// Demo function
export function demonstrateChainOfResponsibility() {
  // Create handlers
  const auth = new AuthHandler();
  const brute = new BruteForceHandler();
  const validation = new ValidationHandler();
  const mainLogic = new MainLogicHandler();

  // Assemble the chain: auth -> brute -> validation -> mainLogic
  auth.setNext(brute).setNext(validation).setNext(mainLogic);

  // Test cases
  const requests: Request[] = [
    { userAuthenticated: false, isBruteForce: false, dataValid: true },
    { userAuthenticated: true, isBruteForce: true, dataValid: true },
    { userAuthenticated: true, isBruteForce: false, dataValid: false },
    { userAuthenticated: true, isBruteForce: false, dataValid: true },
  ];

  requests.forEach((req, idx) => {
    console.log(`\n--- Test Case ${idx + 1} ---`);
    const result = auth.handle(req);
    console.log('Result:', result);
  });
}

// Run the demonstration
demonstrateChainOfResponsibility();
