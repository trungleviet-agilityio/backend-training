# Chapter 05: Design Consistent Hashing

## Key Concepts

### What is Consistent Hashing?
- **Definition**: Distributed hashing scheme that minimizes reorganization when nodes are added or removed
- **Purpose**: Enable horizontal scaling by distributing requests/data efficiently and evenly across servers
- **Problem Solved**: Traditional hashing requires rehashing all data when cluster size changes

### The Rehashing Problem

#### Traditional Hashing Method
- **Formula**: `serverIndex = hash(key) % N` where N is the size of the server pool
- **Example**: 4 servers, 8 string keys with their hashes
- **Process**: Perform modular operation to determine server for key storage

#### Problems with Traditional Hashing
- **Server Removal**: When server 1 goes offline, pool size becomes 3
- **Rehashing**: Same hash values but different server indexes due to modulo operation
- **Cache Storm**: Most keys are redistributed, causing cache misses
- **Impact**: Cache clients connect to wrong servers to fetch data

### Consistent Hashing Solution
- **Wikipedia Definition**: "Only k/n keys need to be remapped on average, where k is the number of keys, and n is the number of slots"
- **Benefit**: Minimizes key redistribution when servers are added/removed

## How Consistent Hashing Works

### Hash Space and Hash Ring
- **Hash Function**: SHA-1 with output range from 0 to 2^160 - 1
- **Hash Space**: Linear space from x0 (0) to xn (2^160 - 1)
- **Hash Ring**: Circular representation by connecting both ends of hash space

### Basic Algorithm Steps
1. **Hash Servers**: Map servers based on IP or name onto the ring
2. **Hash Keys**: Map cache keys onto the ring (no modular operation)
3. **Server Lookup**: Go clockwise from key position until first server is found

### Example Distribution
```
Hash Ring: 0 -------- 2^160-1
Servers:   S0    S1    S2    S3
Keys:      K0    K1    K2    K3
Assignment: K0→S0, K1→S1, K2→S2, K3→S3
```

### Adding a Server
- **New Server**: Server 4 added to ring
- **Affected Keys**: Only key0 needs redistribution
- **Logic**: Key0 now maps to server 4 (first server clockwise)
- **Other Keys**: K1, K2, K3 remain on same servers

### Removing a Server
- **Server Removal**: Server 1 removed from ring
- **Affected Keys**: Only key1 must be remapped to server 2
- **Other Keys**: Rest of keys unaffected

## Two Issues in the Basic Approach

### Problem 1: Uneven Partition Sizes
- **Issue**: Impossible to keep same partition size for all servers
- **Example**: If s1 is removed, s2's partition becomes twice as large as s0 and s3's partitions
- **Impact**: Some servers handle much more data than others

### Problem 2: Non-Uniform Key Distribution
- **Issue**: Possible to have most keys stored on one server
- **Example**: Most keys stored on server 2, while server 1 and 3 have no data
- **Solution**: Virtual nodes technique

## Virtual Nodes (Replicas)

### Concept
- **Definition**: Real node represented by multiple virtual nodes on the ring
- **Example**: Server 0 and Server 1 each have 3 virtual nodes
- **Representation**: s0_0, s0_1, s0_2 for server 0; s1_0, s1_1, s1_2 for server 1

### How It Works
- **Multiple Partitions**: Each server responsible for multiple partitions
- **Server Lookup**: Go clockwise from key location, find first virtual node
- **Example**: Key k0 maps to virtual node s1_1, which refers to server 1

### Benefits
- **Balanced Distribution**: More virtual nodes = more balanced key distribution
- **Standard Deviation**: Decreases with more virtual nodes
- **Research Results**:
  - 200 virtual nodes: 5% standard deviation
  - 100 virtual nodes: 10% standard deviation
- **Trade-off**: More virtual nodes = more memory usage

### Tuning
- **Flexibility**: Can tune number of virtual nodes to fit system requirements
- **Balance**: Between distribution quality and memory usage

## Finding Affected Keys

### Adding a Server
- **Affected Range**: From newly added node (s4) anticlockwise until server found (s3)
- **Redistribution**: Keys between s3 and s4 need to be redistributed to s4

### Removing a Server
- **Affected Range**: From removed node (s1) anticlockwise until server found (s0)
- **Redistribution**: Keys between s0 and s1 must be redistributed to s2

## System Design Considerations

### Hash Function Selection
- **SHA-1**: Used in examples, 160-bit output
- **Uniform Distribution**: Important for even key distribution
- **Cryptographic vs Non-cryptographic**: Choose based on security requirements

### Ring Representation
- **Data Structure**: Efficient lookup for finding next server clockwise
- **Sorted Array**: Binary search for O(log n) lookup
- **Tree Structure**: Balanced tree for efficient operations

### Server Management
- **Health Checks**: Monitor server availability
- **Automatic Removal**: Remove failed servers from ring
- **Replication**: Backup data on multiple servers

## Scaling Considerations

### Horizontal Scaling
- **Easy Addition**: Add servers with minimal key redistribution
- **Graceful Removal**: Remove servers with minimal impact
- **Load Distribution**: Virtual nodes provide good distribution

### Performance Optimization
- **Lookup Speed**: Efficient algorithms for finding next server
- **Memory Usage**: Balance virtual nodes with memory constraints
- **Network Overhead**: Minimize data movement during rebalancing

## Real-World Applications

### Notable Systems Using Consistent Hashing
- **Amazon Dynamo**: Partitioning component of key-value store
- **Apache Cassandra**: Data partitioning across cluster
- **Discord**: Chat application scaling
- **Akamai**: Content delivery network
- **Maglev**: Network load balancer

### Use Cases
- **Distributed Caching**: Redis, Memcached clusters
- **Load Balancing**: Application and network load balancers
- **Database Sharding**: Distribute data across database nodes
- **Microservices**: Service discovery and routing

## Benefits of Consistent Hashing

### Key Advantages
- **Minimal Redistribution**: Only affected keys move when cluster changes
- **Horizontal Scaling**: Easy to add/remove servers
- **Hotspot Mitigation**: Distributes data more evenly, preventing server overload
- **Fault Tolerance**: Graceful handling of server failures

### Example Scenarios
- **Celebrity Data**: Prevents Katy Perry, Justin Bieber, Lady Gaga data all ending up on same shard
- **Cache Efficiency**: Reduces cache miss storms during server changes
- **Load Balance**: More even distribution of requests and data

## Trade-offs

### Advantages
- **Scalability**: Easy horizontal scaling
- **Fault Tolerance**: Minimal impact from server failures
- **Load Distribution**: Better than traditional hashing

### Disadvantages
- **Complexity**: More complex than simple modulo hashing
- **Memory Usage**: Virtual nodes increase memory usage
- **Lookup Cost**: O(log n) lookup time vs O(1) for simple hashing
- **Tuning Required**: Need to tune virtual node count

## Implementation Considerations

### Algorithm Choice
- **Basic Consistent Hashing**: Simple but may have uneven distribution
- **Virtual Nodes**: Better distribution but more complex
- **Bounded Loads**: Additional technique for even better distribution

### Monitoring
- **Key Distribution**: Monitor how evenly keys are distributed
- **Server Load**: Track load on individual servers
- **Performance Metrics**: Measure lookup times and redistribution costs

---

*Next: Chapter 06 - Design a Key-Value Store*
