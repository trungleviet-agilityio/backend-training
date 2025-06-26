# Chapter 2: Programming Languages

## 📖 Summary

This chapter discusses the critical importance of programming language selection in software architecture and provides a systematic approach to evaluating languages based on business needs rather than personal preferences.

### The Business Perspective on Language Choice
- **Personal vs Business:** Personal favorites are acceptable, but business decisions must be 100% logical
- **First Choice:** Programming language selection affects everything in a project
- **Objective Approach:** Must put feelings aside and use cold, heartless selection process

### Key Language Characteristics for Evaluation

#### Strong Static Typing
- **Definition:** Language imposes strict restrictions on intermixing values of different data types
- **Benefits:** Catches type-related bugs early, pinpoints root causes
- **Example Problem:** JavaScript allows string + number operations, leading to unexpected results
- **Solution:** TypeScript provides compile-time error detection
- **Critical Requirement:** Both strong typing AND static type checking for reliable code

#### Explicitly Defined Data Structures
- **Definition:** Language's ability to define data structures and validate compliance at compile time
- **Benefits:** Catches structural errors early, accelerates development, creates stable software
- **Example:** TypeScript interfaces catch typos in object properties at compile time
- **IDE Support:** Modern IDEs provide real-time error highlighting and code completion

#### Support for Interfaces
- **Purpose:** Creates abstraction/contract for data structures or classes
- **Benefits:** Enables Dependency Injection pattern and Dependency Inversion Principle
- **Example:** Function can work with any logger implementation as long as it follows the interface
- **Alternative:** Abstract classes in languages without interface support (like Python)

#### Isomorphism
- **Definition:** Language's ability to run across multiple platforms
- **Three Levels:**
  - **Native:** Works on all platforms natively (e.g., JavaScript)
  - **Transpiled:** Cross-compiled into natively isomorphic language (e.g., TypeScript → JavaScript)
  - **Generated:** Generates platform-specific code independently (e.g., Kotlin)
- **Best Options:** Native and Transpiled isomorphism are sufficient for most projects

#### Third-Party Libraries
- **Impact:** Choice affects ability to use pre-existing solutions
- **Best Supported:** JavaScript/TypeScript, Java, Python
- **Consideration:** More "esoteric" languages may require writing additional code

#### Ease of Refactoring
- **Definition:** Restructuring existing code without changing external behavior
- **Importance:** Essential for architecture changes and data model migrations
- **Best Support:** Compiled languages with strong static type checking
- **Examples:** Java (excellent), Python/PHP (weak)

#### Functional vs Object-Oriented Programming
- **OOP Approach:** Objects with state, encapsulation, inheritance, interfaces
- **FP Approach:** Separate data and behaviors, stateless, pure functions
- **When to Use OOP:** Modeling real-life objects with self-contained behaviors
- **When FP Works Better:** Complex interactions between multiple objects
- **Modern Trend:** Most languages support both paradigms to varying degrees
- **Recommendation:** Use best of both worlds - interfaces from OOP, pure functions from FP

#### Human Factors
- **Ease of Hiring:** Consider job market and cost (Python engineers cheaper than Java)
- **Learning Curve:** How quickly can new hires become productive
- **Readability:** How easily business logic can be discerned from code

### Language Comparison Table

| Language | Explicit Data Structures | Strong Static Typing | Interfaces | Isomorphism | OOP vs FP | Third Party Libraries | Refactoring | Hiring | Learning Curve | Readability |
|----------|-------------------------|---------------------|------------|-------------|-----------|---------------------|-------------|---------|----------------|-------------|
| Java | Yes | Yes | Yes | Generated | OOP first | Many | Strong | Expensive | Medium | Great |
| Kotlin | Yes | Yes | Yes | Generated | OOP first | Few | Strong | Expensive, hard to find | Steep | Medium |
| JavaScript | No | No | No | Native | FP first | Many | Weak | Inexpensive, easy to find | Flat | Medium |
| TypeScript | Yes | Yes | Yes | Transpiled | FP first + interfaces | Many | Medium | Inexpensive, easy to find | Flat | Medium |
| Python | No | No | No | No | OOP first | Many | Weak | Inexpensive, easy to find | Flat | Poor |

### Use Case Recommendations

#### Strictly Optimize for Cost and Time
- **Server:** TypeScript
- **Web:** TypeScript with React/Redux
- **Mobile:** Cordova hybrid apps (shared code)

#### Maximize Server Reliability, Then Optimize Cost & Time
- **Server:** Java (consider Kotlin/Scala as expensive options)
- **Web:** TypeScript with React/Redux
- **Mobile:** Cordova hybrid apps
- **Communication:** Protobufs IDL

#### Provide Smooth Native Mobile Experience, Then Optimize Cost & Time
- **Server:** TypeScript
- **Web:** TypeScript with React/Redux
- **Mobile:** React Native or Flutter/Dart (shared code)

#### Maximize Server Reliability + Native Mobile Experience, Then Optimize Cost & Time
- **Server:** Java (consider Kotlin/Scala)
- **Web:** TypeScript with React/Redux
- **Mobile:** React Native or Flutter/Dart
- **Communication:** Protobufs IDL

### Key Principles
1. **Business Logic Over Personal Preference:** Language choice must be based on business needs
2. **Strong Static Typing is Essential:** For reliable, bug-free code
3. **Consider the Complete Ecosystem:** Libraries, tooling, hiring, learning curve
4. **Isomorphism Matters:** For cross-platform development efficiency
5. **Refactoring Support is Critical:** For long-term maintainability

## Review Questions
1. Why should programming language choice be based on business logic rather than personal preference?
2. What are the two critical requirements for reliable code regarding typing?
3. What are the three levels of isomorphism and which are most practical?
4. How do interfaces support software architecture principles?
5. What is the difference between OOP and FP approaches?
6. Why is refactoring support important in language selection?
7. What are the main factors to consider when evaluating third-party library support?
8. How does the job market affect language choice for large projects?
9. What are the recommended language combinations for cost optimization vs reliability?
10. Why is readability important and how can it be evaluated?

---

*Notes taken on: [Date]*
*Pages covered: [Page range]*
*Index System: A → G (Main sections), A.1 → G.2 (Subsections), A.1.1 → G.2.2 (Details)*
