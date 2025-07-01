# Chapter 06: Design a Key-Value Store

## Key Concepts

### What is a Key-Value Store?
- **Definition**: Non-relational database that stores data as key-value pairs
- **Structure**: Each unique identifier (key) stored with associated value
- **Characteristics**: Simple data model, fast access, horizontal scalability

### Key-Value Pair Structure
- **Key**: Must be unique, can be plain text or hashed values
- **Value**: Can be strings, lists, objects, etc. (treated as opaque object)
- **Examples**:
  - Plain text key: "last_logged_in_at"
  - Hashed key: 253DDEC4

### Supported Operations
- **put(key, value)**: Insert "value" associated with "key"
- **get(key)**: Get "value" associated with "key"

## System Requirements

### Design Characteristics
- **Small key-value pairs**: Less than 10 KB
- **Big data support**: Ability to store large datasets
- **High availability**: Quick response even during failures
- **High scalability**: Scale to support large datasets
- **Automatic scaling**: Automatic server addition/deletion based on traffic
- **Tunable consistency**: Configurable consistency levels
- **Low latency**: Fast response times

## Single Server Key-Value Store

### Basic Approach
- **Hash Table**: Store key-value pairs in memory hash table
- **Memory Constraint**: Fitting everything in memory may be impossible
- **Optimizations**:
  - Data compression
  - Store frequently used data in memory, rest on disk
- **Limitation**: Single server reaches capacity quickly
- **Solution**: Distributed key-value store required

## Distributed Key-Value Store

### CAP Theorem
- **Definition**: Impossible for distributed system to simultaneously provide more than 2 of 3 guarantees
- **Three Properties**:
  - **Consistency**: All clients see same data at same time
  - **Availability**: Any client gets response even if some nodes down
  - **Partition Tolerance**: System continues operating despite network partitions

### CAP Classifications
- **CP Systems**: Consistency + Partition tolerance, sacrifice availability
- **AP Systems**: Availability + Partition tolerance, sacrifice consistency
- **CA Systems**: Consistency + Availability, sacrifice partition tolerance (not practical)

### Real-World Example
- **3 Replica Nodes**: n1, n2, n3
- **Ideal Situation**: No network partitions, automatic replication
- **Partition Scenario**: n3 goes down, n1 and n2 can't communicate with n3
- **CP Choice**: Block all writes to n1 and n2 (bank systems)
- **AP Choice**: Keep accepting reads/writes, sync later (social media)

## System Components

### Data Partition
- **Challenge**: Distribute data evenly across multiple servers
- **Solution**: Consistent hashing (from Chapter 5)
- **Process**:
  1. Place servers on hash ring (s0, s1, ..., s7)
  2. Hash key onto ring, store on first server clockwise
  3. Example: key0 stored in s1
- **Advantages**:
  - Automatic scaling
  - Heterogeneity (virtual nodes proportional to server capacity)

### Data Replication
- **Purpose**: High availability and reliability
- **Process**: Replicate data asynchronously over N servers
- **Selection Logic**: After key mapped to ring position, walk clockwise and choose first N servers
- **Example**: N=3, key0 replicated at s1, s2, s3
- **Virtual Nodes**: Choose unique servers to avoid multiple replicas on same physical server
- **Data Center Placement**: Place replicas in distinct data centers for better reliability

### Consistency

#### Quorum Consensus
- **Definitions**:
  - N = Number of replicas
  - W = Write quorum size (write acknowledged from W replicas)
  - R = Read quorum size (read waits for R replica responses)
- **Example**: N=3, W=1, R=1
  - Data replicated at s0, s1, s2
  - W=1: Coordinator needs 1 acknowledgment
  - R=1: Coordinator waits for 1 response

#### Configuration Trade-offs
- **R=1, W=N**: Optimized for fast read
- **W=1, R=N**: Optimized for fast write
- **W+R>N**: Strong consistency guaranteed (usually N=3, W=R=2)
- **W+R≤N**: Strong consistency not guaranteed

#### Consistency Models
- **Strong Consistency**: Read returns most updated write result
- **Weak Consistency**: Subsequent reads may not see most updated value
- **Eventual Consistency**: All updates propagate over time, all replicas become consistent
- **Recommendation**: Eventual consistency (Dynamo, Cassandra)

### Inconsistency Resolution: Versioning

#### Problem Example
- **Initial State**: Both n1 and n2 have same value
- **Concurrent Writes**: n1 changes to "johnSanFrancisco", n2 changes to "johnNewYork"
- **Conflict**: Two versions v1 and v2 with no clear resolution

#### Vector Clocks
- **Definition**: [server, version] pair associated with data item
- **Purpose**: Check if version precedes, succeeds, or conflicts with others
- **Format**: D([S1, v1], [S2, v2], ..., [Sn, vn])
- **Rules**:
  - If [Si, vi] exists, increment vi
  - Otherwise, create new entry [Si, 1]

#### Vector Clock Example
1. **D1**: Client writes to Sx → D1[(Sx, 1)]
2. **D2**: Client updates D1 to D2 on Sx → D2([Sx, 2])
3. **D3**: Client updates D2 to D3 on Sy → D3([Sx, 2], [Sy, 1])
4. **D4**: Client updates D2 to D4 on Sz → D4([Sx, 2], [Sz, 1])
5. **D5**: Conflict resolution → D5([Sx, 3], [Sy, 1], [Sz, 1])

#### Conflict Detection
- **Ancestor**: Version X is ancestor of Y if all counters in Y ≥ counters in X
- **Sibling**: Conflict exists if any counter in Y < corresponding counter in X
- **Example**: D([s0, 1], [s1, 1]) is ancestor of D([s0, 1], [s1, 2])
- **Conflict**: D([s0, 1], [s1, 2]) and D([s0, 2], [s1, 1])

#### Vector Clock Limitations
- **Client Complexity**: Client must implement conflict resolution
- **Size Growth**: [server: version] pairs can grow rapidly
- **Solution**: Set threshold, remove oldest pairs if exceeded
- **Note**: Amazon hasn't encountered this problem in production

### Handling Failures

#### Failure Detection
- **Requirement**: At least two independent sources to mark server down
- **All-to-All Multicasting**: Straightforward but inefficient
- **Gossip Protocol**: Decentralized failure detection
  - Each node maintains membership list with heartbeat counters
  - Nodes periodically increment heartbeat counters
  - Nodes send heartbeats to random nodes
  - If heartbeat not increased for predefined periods, mark as offline

#### Handling Temporary Failures
- **Sloppy Quorum**: Choose first W healthy servers for writes, first R for reads
- **Hinted Handoff**: Offline servers ignored, another server processes temporarily
- **Recovery**: When down server comes back, changes pushed back for consistency

#### Handling Permanent Failures
- **Anti-Entropy Protocol**: Compare data on replicas, update to newest version
- **Merkle Tree**: Used for inconsistency detection and minimizing data transfer

#### Merkle Tree Process
- **Wikipedia Definition**: "A hash tree or Merkle tree is a tree in which every non-leaf node is labeled with the hash of the labels or values (in case of leaves) of its child nodes. Hash trees allow efficient and secure verification of the contents of large data structures."
- **Key Space Example**: Keys 1 to 12
1. **Divide Key Space**: Into buckets (4 buckets for keys 1-12)
2. **Hash Keys**: Uniform hashing method for each key in bucket
3. **Create Hash Nodes**: One hash node per bucket
4. **Build Tree**: Calculate hashes of children upwards to root
5. **Compare Trees**: Start with root hashes, traverse to find unsynchronized buckets
- **Efficiency**: Amount of data to synchronize proportional to differences between replicas, not total data
- **Real-world Configuration**: One million buckets per one billion keys (1000 keys per bucket)

#### Data Center Outage
- **Replication Strategy**: Replicate data across multiple data centers
- **Availability**: Users can access data through other data centers

## System Architecture

### Architecture Features
- **Simple APIs**: get(key) and put(key, value)
- **Coordinator**: Node acting as proxy between client and key-value store
- **Consistent Hashing**: Nodes distributed on ring
- **Decentralized**: Automatic adding and moving nodes
- **Replication**: Data replicated at multiple nodes
- **No Single Point of Failure**: Every node has same responsibilities

### Write Path (Based on Cassandra)
1. **Commit Log**: Write request persisted on commit log file
2. **Memory Cache**: Data saved in memory cache
3. **SSTable**: When cache full, data flushed to SSTable on disk
- **SSTable**: Sorted-string table, sorted list of <key, value> pairs

### Read Path

#### Memory Hit
- Check if data in memory cache
- Return data to client if found

#### Memory Miss
1. **Memory Check**: If not in memory, proceed to step 2
2. **Bloom Filter**: Check which SSTables might contain key
3. **SSTable Lookup**: SSTables return data set result
4. **Client Response**: Return result to client

## Summary Table

| Feature | Technique |
|---------|-----------|
| Data Partition | Consistent Hashing |
| Data Replication | Multi-datacenter replication |
| Consistency | Quorum consensus |
| Inconsistency Resolution | Vector clocks |
| Failure Detection | Gossip protocol |
| Temporary Failure | Hinted handoff |
| Permanent Failure | Merkle tree |
| Write Path | Commit log + Memory cache + SSTable |
| Read Path | Memory cache + Bloom filter + SSTable |

## Real-World Systems
- **Amazon Dynamo**: Highly available key-value store
- **Apache Cassandra**: Distributed storage system
- **Google BigTable**: Distributed storage for structured data
- **Redis**: In-memory data structure store
- **Memcached**: Distributed memory caching system

---

*Next: Chapter 07 - Design a Unique ID Generator in Distributed Systems*
