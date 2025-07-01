# Chapter 07: Design a Unique ID Generator in Distributed Systems

## Key Concepts

### What is a Unique ID Generator?
- **Definition**: System that generates globally unique identifiers across distributed nodes
- **Purpose**: Ensure no duplicate IDs across the entire system
- **Problem**: Auto-increment doesn't work in distributed environment
- **Challenge**: Single database server not large enough, generating unique IDs across multiple databases with minimal delay is challenging

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: What are the characteristics of unique IDs?
Interviewer: IDs must be unique and sortable.

Candidate: For each new record, does ID increment by 1?
Interviewer: The ID increments by time but not necessarily only increments by 1. IDs created in the evening are larger than those created in the morning on the same day.

Candidate: Do IDs only contain numerical values?
Interviewer: Yes, that is correct.

Candidate: What is the ID length requirement?
Interviewer: IDs should fit into 64-bit.

Candidate: What is the scale of the system?
Interviewer: The system should be able to generate 10,000 IDs per second.
```

### Requirements Summary
- **Uniqueness**: IDs must be unique
- **Numerical**: IDs are numerical values only
- **64-bit**: IDs fit into 64-bit
- **Time-ordered**: IDs are ordered by date
- **Performance**: Ability to generate over 10,000 unique IDs per second

## Step 2: Propose High-Level Design and Get Buy-in

### Multiple Options Considered
1. **Multi-master replication**
2. **Universally unique identifier (UUID)**
3. **Ticket server**
4. **Twitter snowflake approach**

### Option 1: Multi-Master Replication
- **Approach**: Use databases' auto_increment feature
- **Strategy**: Increase next ID by k (number of database servers) instead of 1
- **Example**: Next ID = previous ID + 2 (with 2 servers)
- **Pros**: IDs scale with number of database servers
- **Cons**:
  - Hard to scale with multiple data centers
  - IDs do not go up with time across multiple servers
  - Does not scale well when server is added or removed

### Option 2: UUID
- **Definition**: 128-bit number used to identify information in computer systems
- **Collision Probability**: Very low - "after generating 1 billion UUIDs every second for approximately 100 years would the probability of creating a single duplicate reach 50%"
- **Example**: `09c93e62-50b4-468d-bf8a-c07e1040bfb2`
- **Design**: Each web server contains ID generator, generates IDs independently
- **Pros**:
  - Simple generation, no coordination between servers
  - No synchronization issues
  - Easy to scale with web servers
- **Cons**:
  - IDs are 128 bits long (requirement is 64 bits)
  - IDs do not go up with time
  - IDs could be non-numeric

### Option 3: Ticket Server
- **Origin**: Flicker developed ticket servers for distributed primary keys
- **Approach**: Use centralized auto_increment feature in single database server
- **Pros**:
  - Numeric IDs
  - Easy to implement
  - Works for small to medium-scale applications
- **Cons**:
  - Single point of failure
  - If ticket server goes down, all dependent systems face issues
  - Multiple ticket servers introduce data synchronization challenges

### Option 4: Twitter Snowflake Approach
- **Strategy**: Divide and conquer - divide ID into different sections
- **Layout**: 64-bit ID with specific bit allocation

## Twitter Snowflake Design

### 64-Bit ID Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ 1 bit  │ 41 bits                    │ 5 bits   │ 5 bits   │ 12 bits │
│ sign   │ timestamp (milliseconds)   │ datacenter│ machine │ sequence│
└─────────────────────────────────────────────────────────────────┘
```

### Bit Allocation Details
- **Sign bit**: 1 bit, always 0 (reserved for future uses)
- **Timestamp**: 41 bits, milliseconds since epoch
  - Default epoch: 1288834974657 (Nov 04, 2010, 01:42:54 UTC)
- **Datacenter ID**: 5 bits = 2^5 = 32 datacenters
- **Machine ID**: 5 bits = 2^5 = 32 machines per datacenter
- **Sequence number**: 12 bits = 2^12 = 4096 combinations per millisecond

### Configuration
- **Datacenter IDs and Machine IDs**: Chosen at startup time, generally fixed
- **Changes**: Require careful review to avoid ID conflicts
- **Timestamp and Sequence**: Generated when ID generator is running

## Step 3: Design Deep Dive

### Timestamp Section
- **Most Important**: 41 bits make up timestamp section
- **Sortability**: As timestamps grow with time, IDs are sortable by time
- **Binary to UTC**: Can convert binary representation to UTC and vice versa
- **Maximum Timestamp**: 2^41 - 1 = 2,199,023,255,551 milliseconds
- **Duration**: ~69 years = 2,199,023,255,551 ms / 1000 / 365 / 24 / 3600
- **Overflow**: After 69 years, need new epoch time or migration techniques

### Sequence Number
- **Size**: 12 bits = 4,096 combinations
- **Usage**: 0 unless more than one ID generated in same millisecond on same server
- **Maximum**: 4,096 new IDs per millisecond per machine
- **Reset**: Sequence number resets to 0 every millisecond

## Step 4: Wrap Up

### Selected Approach
- **Final Choice**: Twitter snowflake-like unique ID generator
- **Reason**: Supports all use cases and is scalable in distributed environment

### Additional Talking Points

#### Clock Synchronization
- **Assumption**: ID generation servers have same clock
- **Problem**: Assumption may not be true in multi-core or multi-machine scenarios
- **Solution**: Network Time Protocol (NTP) is most popular solution
- **Scope**: Clock synchronization solutions beyond book scope

#### Section Length Tuning
- **Example**: Fewer sequence numbers but more timestamp bits
- **Use Case**: Effective for low concurrency and long-term applications
- **Flexibility**: Can adjust bit allocation based on requirements

#### High Availability
- **Critical System**: ID generator is mission-critical system
- **Requirement**: Must be highly available
- **Consideration**: Redundancy and failover mechanisms

## Implementation Considerations

### Performance
- **Throughput**: Can generate 10,000+ IDs per second
- **Latency**: Sub-millisecond generation time
- **Scalability**: Scales with number of machines

### Fault Tolerance
- **Node Failures**: Multiple ID generation nodes
- **Clock Issues**: Handle clock drift and synchronization
- **Network Partitions**: Continue generating IDs locally

### Monitoring
- **Clock Accuracy**: Monitor clock synchronization
- **Sequence Overflow**: Track sequence number usage
- **ID Conflicts**: Detect and alert on potential conflicts

## Use Cases
- **Database Primary Keys**: Unique keys across distributed databases
- **Message IDs**: Unique message identifiers
- **Transaction IDs**: Financial transaction identifiers
- **User IDs**: Unique user identifiers
- **Order IDs**: E-commerce order numbers

## Trade-offs
- **Uniqueness vs Performance**: Coordination vs local generation
- **Size vs Functionality**: 64-bit limit vs rich metadata
- **Centralization vs Distribution**: Simplicity vs fault tolerance

---

*Next: Chapter 08 - Design a URL Shortener*
