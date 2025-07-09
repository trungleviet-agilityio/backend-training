# NestJS Learning Guide

---

## 1. Express vs Fastify as NestJS Platforms

| Feature         | Express                        | Fastify                        |
|----------------|--------------------------------|-------------------------------|
| **Performance**| Good (mature, stable)          | Excellent (faster, lower overhead) |
| **Ecosystem**  | Huge, many middlewares         | Growing, modern plugins        |
| **Compatibility** | Default for NestJS, wide support | Supported by NestJS, some 3rd-party gaps |
| **API**        | Classic, callback-based        | Modern, async/await, schema-first |
| **Use Cases**  | Legacy, broad compatibility    | High-performance, modern APIs  |

**Summary:**
- **Express** is the default, most compatible, and best for legacy or broad ecosystem needs.
- **Fastify** is faster, more modern, and great for high-performance APIs, but may lack some middleware.
- **NestJS** lets you choose either platform with minimal code changes.

---

## 2. Design Patterns in NestJS Core

NestJS is built on top of TypeScript and OOP/FP best practices, applying many classic design patterns:

- **Dependency Injection (DI):**
  - Core to NestJS, enables loose coupling, testability, and modularity.
- **Decorator Pattern:**
  - Used everywhere: `@Controller()`, `@Injectable()`, `@Get()`, custom decorators.
- **Module Pattern:**
  - Organizes code into cohesive, reusable modules.
- **Facade Pattern:**
  - Abstracts complex subsystems (e.g., HTTP, microservices) behind simple interfaces.
- **Singleton Pattern:**
  - Providers are singletons by default (per module or global scope).
- **Adapter Pattern:**
  - Platform adapters (Express, Fastify) allow the same codebase to run on different HTTP engines.
- **Chain of Responsibility:**
  - Middleware, guards, interceptors process requests in a chain.
- **Observer/Event Emitter:**
  - Event-based communication, microservices, CQRS.
- **Command Pattern:**
  - CQRS, custom command handlers.

**Tip:** If you know design patterns, you'll recognize and leverage them everywhere in NestJS!

---

## 3. Getting Started with NestJS

### Step 1: Install Nest CLI
```bash
npm i -g @nestjs/cli
```

### Step 2: Create a New Project
```bash
nest new my-nest-app
```

### Step 3: Choose Platform (Express or Fastify)
- **Default:** Express (no config needed)
- **To use Fastify:**
  1. Install Fastify adapter:
     ```bash
     npm install @nestjs/platform-fastify
     ```
  2. In `main.ts`:
     ```typescript
     import { NestFactory } from '@nestjs/core';
     import { AppModule } from './app.module';
     import { FastifyAdapter } from '@nestjs/platform-fastify';

     async function bootstrap() {
       const app = await NestFactory.create(AppModule, new FastifyAdapter());
       await app.listen(3000);
     }
     bootstrap();
     ```

### Step 4: Run Your First App
```bash
npm run start:dev
```

---

## 4. Tips for TypeScript/Design Patterns Devs
- Recognize and use DI, modules, and decorators everywhere.
- Refactor code into providers/services for testability.
- Use custom decorators and middleware to apply patterns.
- Explore advanced features: Guards, Interceptors, CQRS, Event Emitter, Microservices.

---

> **NestJS = TypeScript + OOP + Design Patterns + Modern Backend Architecture**
