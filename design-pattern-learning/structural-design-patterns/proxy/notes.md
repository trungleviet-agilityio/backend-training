# Proxy Pattern

**Category:** Structural Design Patterns
**Main Goal:** Provide a substitute or placeholder for another object to control access, add behavior, or delay instantiation.

## Problem

You have a resource-intensive object (e.g., database connection, remote API, large file) or want to control access to an object (e.g., permissions, logging, caching). You don't want to modify the real object's code, or it comes from a third-party library.

## Solution

Proxy Pattern introduces a class (Proxy) that:
- Implements the same interface as the real object (Subject)
- Controls access to the real object (RealSubject)
- Can add behavior before/after delegating to the real object (e.g., logging, caching, lazy loading, security)

## Real-World Analogy

**Credit Card:**
- You don't interact directly with your bank account (real object)
- You use a credit card (proxy) that represents your account
- The card controls access, logs transactions, and interacts with the bank on your behalf

## Structure

```
      +-------------------+
      |   ISubject        |  <--- Common interface
      +-------------------+
              ▲
         _____|______
        |            |
   RealSubject     Proxy
   (Real object)   (Controls access, delegates to RealSubject)

Client --> Proxy --> RealSubject
```

## Pseudocode Example (TypeScript, Caching Proxy)

```typescript
// Subject interface
interface IYouTubeLib {
  listVideos(): string[];
  getVideoInfo(videoId: string): string;
}

// Real service (resource-intensive)
class ThirdPartyYouTubeClass implements IYouTubeLib {
  listVideos(): string[] {
    // Simulate API call
    console.log("Fetching video list from YouTube API...");
    return ["video1", "video2", "video3"];
  }
  getVideoInfo(videoId: string): string {
    // Simulate API call
    console.log(`Fetching info for ${videoId} from YouTube API...");
    return `Info for ${videoId}`;
  }
}

// Proxy (adds caching)
class CachedYouTubeClass implements IYouTubeLib {
  private cacheList: string[] | null = null;
  private cacheInfo: { [id: string]: string } = {};
  constructor(private service: IYouTubeLib) {}

  listVideos(): string[] {
    if (!this.cacheList) {
      this.cacheList = this.service.listVideos();
    } else {
      console.log("Returning cached video list");
    }
    return this.cacheList;
  }

  getVideoInfo(videoId: string): string {
    if (!(videoId in this.cacheInfo)) {
      this.cacheInfo[videoId] = this.service.getVideoInfo(videoId);
    } else {
      console.log(`Returning cached info for ${videoId}`);
    }
    return this.cacheInfo[videoId];
  }
}

// Client code
const realService = new ThirdPartyYouTubeClass();
const proxy = new CachedYouTubeClass(realService);
proxy.listVideos(); // Fetches from API
proxy.listVideos(); // Returns cached
proxy.getVideoInfo("video1"); // Fetches from API
proxy.getVideoInfo("video1"); // Returns cached
```

## How to Implement

1. **Define a common interface** for both the real object and the proxy (e.g., `ISubject`)
2. **Implement the real object** (e.g., `RealSubject`)
3. **Implement the proxy class** that implements the same interface and holds a reference to the real object
4. **Proxy methods** can add behavior before/after delegating to the real object
5. **Client code** interacts only with the interface, not knowing if it's using the proxy or the real object

## When to Use (Applicability)

| Situation | Should Use Proxy? |
|-----------|------------------|
| Need to control access to an object (security, permissions) | Yes |
| Want to add caching, logging, or lazy loading | Yes |
| Real object is resource-intensive or remote | Yes |
| Want to add behavior without modifying the real object | Yes |

## Types of Proxy

| Type | Description |
|------|-------------|
| Virtual Proxy | Delays creation of expensive objects (lazy loading) |
| Protection Proxy | Controls access (authentication, roles) |
| Remote Proxy | Accesses objects over a network |
| Caching Proxy | Caches results to reduce cost |
| Logging Proxy | Logs access and operations |
| Smart Reference | Manages references, e.g., auto-release |

## Pros and Cons

| Pros | Cons |
|------|------|
| Controls access, adds behavior without modifying real object | Increases number of classes, can add complexity |
| Supports lazy loading, caching, logging, security | If not managed well, can cause unexpected delays |
| Follows Open/Closed Principle | Client may not know where logic is coming from |

## Relations with Other Patterns

| Pattern | Difference |
|---------|-----------|
| Decorator | Adds behavior, but not for access control |
| Adapter | Converts interface, Proxy keeps interface the same |
| Facade | Simplifies interface, not a stand-in for another object |
| Singleton | Can be used to manage a single real object for proxies |
| Factory | Can create proxies or real objects as needed |

## Quick Summary

**Goal:** Provide a stand-in for another object to control access, add behavior, or delay instantiation.

**Core:** Proxy implements the same interface as the real object, holds a reference to it, and delegates calls, adding behavior as needed.

**Real applications:** Database connections, remote APIs, file access, caching, security, logging, smart references.

**Reference:** [Proxy Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/proxy)
