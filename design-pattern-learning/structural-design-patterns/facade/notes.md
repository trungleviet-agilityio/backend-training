# Facade Pattern

**Also known as:** Frontend
**Category:** Structural Design Patterns
**Main Goal:** Provide a simplified interface to a complex subsystem, library, or framework.

## Problem

Imagine you need to work with a complex subsystem that contains dozens of objects. You would need to:

- Initialize all objects in the correct order
- Keep track of dependencies between objects
- Execute methods in the proper sequence
- Understand the complex relationships between components

This makes your business logic tightly coupled to the implementation details of the subsystem, making it hard to understand and maintain.

## Solution

The Facade pattern provides a simple interface to a complex subsystem. The facade:

- Hides the complexity of the subsystem behind a simple interface
- Coordinates the work of the subsystem classes
- Manages the lifecycle of subsystem objects
- Provides only the features that clients really care about

## Real-World Analogy

**Placing orders by phone**: When you call a shop to place an order, an operator serves as your facade to all the shop's services and departments. The operator provides you with a simple voice interface to the ordering system, payment gateways, and delivery services.

## Structure

```
      +------------------------+       +------------------------+
      |      Client            |       |       Facade           |
      |------------------------|       |------------------------|
      | + main()               |------>| + operationA()         |
      +------------------------+       | + operationB()         |
                                       +------------------------+
                                                |
                                                |
                                       +--------+---------+
                                       |                  |
                              +----------------+   +----------------+
                              | Subsystem Class|   | Subsystem Class|
                              | A              |   | B              |
                              +----------------+   +----------------+
```

## Pseudocode Example

```typescript
// Complex subsystem classes
class VideoFile {
  constructor(filename: string) {
    console.log(`Loading video file: ${filename}`);
  }
}

class CodecFactory {
  static extract(file: VideoFile): string {
    console.log("Extracting codec from video file");
    return "h264";
  }
}

class MPEG4CompressionCodec {
  compress(): void {
    console.log("Compressing with MPEG4 codec");
  }
}

class OggCompressionCodec {
  compress(): void {
    console.log("Compressing with Ogg codec");
  }
}

class BitrateReader {
  static read(filename: string, codec: string): string {
    console.log(`Reading bitrate with ${codec} codec`);
    return "compressed_data";
  }

  static convert(buffer: string, codec: any): string {
    console.log("Converting bitrate");
    return "converted_data";
  }
}

class AudioMixer {
  fix(result: string): string {
    console.log("Fixing audio");
    return "final_result";
  }
}

// Facade class
class VideoConverter {
  convert(filename: string, format: string): string {
    console.log(`Converting ${filename} to ${format}`);

    const file = new VideoFile(filename);
    const sourceCodec = CodecFactory.extract(file);

    let destinationCodec;
    if (format === "mp4") {
      destinationCodec = new MPEG4CompressionCodec();
    } else {
      destinationCodec = new OggCompressionCodec();
    }

    const buffer = BitrateReader.read(filename, sourceCodec);
    let result = BitrateReader.convert(buffer, destinationCodec);
    result = new AudioMixer().fix(result);

    return result;
  }
}

// Client code
function main() {
  const converter = new VideoConverter();
  const result = converter.convert("youtubevideo.ogg", "mp4");
  console.log(`Conversion result: ${result}`);
}
```

## How to Implement

1. **Check if you can provide a simpler interface** than what the existing subsystem provides. You're on the right track if this interface makes the client code independent from many of the subsystem's classes.

2. **Declare and implement this interface** in a new facade class. The facade should redirect calls from the client code to appropriate objects of the subsystem. The facade should be responsible for initializing the subsystem and managing its lifecycle.

3. **Make all client code communicate** with the subsystem only via the facade. Now the client code is protected from any changes in the subsystem code.

4. **If the facade becomes too big**, consider extracting part of its behavior to a new, refined facade class.

## When to Use (Applicability)

| Situation | Should Use Facade? |
|-----------|-------------------|
| Need a limited but straightforward interface to a complex subsystem | Yes |
| Want to structure a subsystem into layers | Yes |
| Working with a complex 3rd-party library or framework | Yes |
| Need to reduce coupling between multiple subsystems | Yes |
| Want to provide a simple interface to a complex video conversion framework | Yes |

## Pros and Cons

| Pros | Cons |
|------|------|
| Isolates your code from the complexity of a subsystem | A facade can become a god object coupled to all classes of an app |
| Makes the subsystem easier to use | |
| Reduces coupling between subsystems | |
| Provides a simple interface to complex functionality | |

## Relations with Other Patterns

| Related Pattern | Relationship |
|-----------------|--------------|
| Adapter | Facade defines a new interface for existing objects, whereas Adapter tries to make the existing interface usable. Adapter usually wraps just one object, while Facade works with an entire subsystem. |
| Abstract Factory | Can serve as an alternative to Facade when you only want to hide the way subsystem objects are created from the client code. |
| Flyweight | Shows how to make lots of little objects, whereas Facade shows how to make a single object that represents an entire subsystem. |
| Mediator | Both try to organize collaboration between lots of tightly coupled classes. Facade defines a simplified interface to a subsystem, while Mediator centralizes communication between components. |
| Singleton | A Facade class can often be transformed into a Singleton since a single facade object is sufficient in most cases. |
| Proxy | Both buffer a complex entity and initialize it on their own. Unlike Facade, Proxy has the same interface as its service object. |

## Quick Summary

**Goal**: Provide a simplified interface to a complex subsystem.

**Core**: Facade class → provides simple interface → coordinates complex subsystem → client uses facade instead of subsystem directly.

**Real applications**: Video conversion frameworks, complex libraries, multi-layered systems, API wrappers.

**Reference:** [Facade Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/facade)
