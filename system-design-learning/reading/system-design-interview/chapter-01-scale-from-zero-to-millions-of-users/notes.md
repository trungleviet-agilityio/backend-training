# Chapter 01: Scale from Zero to Millions of Users

## Key Concepts

### Single Server Setup
- **Everything on one server**: Web app, database, cache, etc.
- **Request Flow**:
  1. Users access websites through domain names (e.g., api.mysite.com)
  2. DNS returns IP address to browser/mobile app (e.g., 15.125.23.214)
  3. HTTP requests sent directly to web server
  4. Web server returns HTML pages or JSON response
- **Traffic Sources**:
  - **Web application**: Server-side languages (Java, Python) + client-side (HTML, JavaScript)
  - **Mobile application**: HTTP protocol, JSON API responses

### Database Separation
- **Why separate**: One server not enough with user base growth
- **Independent scaling**: Web/mobile traffic and database can scale separately
- **Database choices**:
  - **Relational databases (RDBMS/SQL)**: MySQL, Oracle, PostgreSQL
    - Store data in tables and rows
    - Support join operations across tables
    - Best for most developers (40+ years of proven track record)
  - **Non-relational databases (NoSQL)**: CouchDB, Neo4j, Cassandra, HBase, DynamoDB
    - Four categories: key-value stores, graph stores, column stores, document stores
    - No join operations generally supported
    - Choose when: super-low latency needed, unstructured data, massive data storage

### Vertical Scaling vs Horizontal Scaling
- **Vertical Scaling (Scale Up)**:
  - Add more power (CPU, RAM) to existing servers
  - **Pros**: Great for low traffic, simplicity
  - **Cons**: Hard limits, no failover/redundancy, expensive
- **Horizontal Scaling (Scale Out)**:
  - Add more servers to resource pool
  - **Pros**: More desirable for large-scale applications
  - **Cons**: More complex

### Load Balancer
- **Purpose**: Evenly distribute incoming traffic among web servers
- **How it works**:
  - Users connect to public IP of load balancer
  - Web servers unreachable directly by clients (security)
  - Private IPs used for server-to-server communication
- **Benefits**:
  - **Failover**: If server 1 goes offline, traffic routed to server 2
  - **Scalability**: Add more servers to handle traffic growth
  - **Availability**: Website stays online during server failures

### Database Replication
- **Master-Slave Relationship**:
  - **Master**: Handles write operations only
  - **Slaves**: Get copies from master, handle read operations only
  - **Ratio**: More slaves than masters (higher read-to-write ratio)
- **Advantages**:
  - **Better performance**: More queries processed in parallel
  - **Reliability**: Data preserved across multiple locations
  - **High availability**: Website remains operational if database goes offline
- **Failover scenarios**:
  - **Slave failure**: Redirect reads to other healthy slaves or master temporarily
  - **Master failure**: Promote slave to new master, run data recovery scripts

### Cache
- **Purpose**: Temporary storage for expensive responses or frequently accessed data
- **Cache Tier**: Separate temporary data store layer, faster than database
- **Read-through Cache Strategy**:
  1. Web server checks cache first
  2. If available, return cached data
  3. If not, query database, store in cache, return to client
- **Considerations**:
  - **When to use**: Data read frequently but modified infrequently
  - **Expiration policy**: Implement TTL (not too short, not too long)
  - **Consistency**: Keep data store and cache in sync
  - **Failure mitigation**: Multiple cache servers across data centers
  - **Eviction policy**: LRU (Least Recently Used) most popular

### Content Delivery Network (CDN)
- **Purpose**: Geographically dispersed servers for static content delivery
- **Static content**: Images, videos, CSS, JavaScript files
- **How CDN works**:
  1. User requests image.png from CDN URL (e.g., mysite.cloudfront.net/logo.jpg)
  2. If not cached, CDN requests from origin (web server or S3)
  3. Origin returns file with optional TTL header
  4. CDN caches and returns to user
  5. Subsequent requests served from cache until TTL expires
- **Considerations**:
  - **Cost**: Charged for data transfers, consider moving infrequent assets out
  - **Cache expiry**: Balance between freshness and performance
  - **CDN fallback**: Handle temporary CDN outages
  - **File invalidation**: Use APIs or object versioning (e.g., image.png?v=2)

### Stateless Web Tier
- **Stateful vs Stateless**:
  - **Stateful**: Server remembers client data between requests
  - **Stateless**: Server keeps no state information
- **Stateless Architecture Benefits**:
  - HTTP requests can be sent to any web server
  - Fetch state data from shared data store
  - Simpler, more robust, scalable
  - Easy auto-scaling
- **Session Storage**: Store in persistent data store (relational DB, Redis, NoSQL)

### Data Centers
- **Multi-data center setup**: Two data centers for international users
- **GeoDNS routing**: Route users to closest data center
- **Traffic split**: x% in US-East, (100-x)% in US-West
- **Failover**: 100% traffic to healthy data center during outage
- **Technical challenges**:
  - **Traffic redirection**: GeoDNS for location-based routing
  - **Data synchronization**: Replicate data across data centers
  - **Test and deployment**: Automated deployment tools for consistency

### Message Queue
- **Purpose**: Durable component for asynchronous communication
- **Architecture**: Producers create messages → Queue → Consumers process messages
- **Benefits**:
  - **Decoupling**: Producer and consumer can be unavailable independently
  - **Scalability**: Scale producer and consumer independently
  - **Reliability**: Messages persist even if services are down
- **Use case example**: Photo customization tasks
  - Web servers publish photo processing jobs to queue
  - Photo processing workers pick up jobs asynchronously
  - Scale workers based on queue size

### Logging, Metrics, Automation
- **Logging**: Monitor error logs for problem identification
  - Per-server level or centralized service
- **Metrics**:
  - **Host level**: CPU, Memory, disk I/O
  - **Aggregated level**: Database tier, cache tier performance
  - **Business metrics**: Daily active users, retention, revenue
- **Automation**:
  - Continuous integration for early problem detection
  - Automated build, test, deploy processes
  - Improved developer productivity

### Database Scaling
- **Vertical Scaling (Scale Up)**:
  - Add more power to existing machine
  - Example: Amazon RDS with 24TB RAM
  - **Drawbacks**: Hardware limits, single point of failure, high cost
- **Horizontal Scaling (Sharding)**:
  - Add more servers, separate large databases into shards
  - **Sharding key**: Determines data distribution (e.g., user_id)
  - **Hash function**: user_id % 4 to determine shard
- **Sharding challenges**:
  - **Resharding**: When shard can't hold more data or uneven distribution
  - **Celebrity problem**: Hotspot key causing server overload
  - **Join operations**: Hard to perform across shards, requires denormalization

## Scaling Phases Summary

### Phase 1: Single Server
- Everything on one server
- Suitable for MVP, low traffic

### Phase 2: Database Separation
- Separate web and database servers
- Independent scaling

### Phase 3: Load Balancer
- Multiple web servers behind load balancer
- Failover and redundancy

### Phase 4: Database Replication
- Master-slave setup
- Read replicas for performance

### Phase 5: Cache
- Application-level caching
- CDN for static content

### Phase 6: Stateless Web Tier
- Move session data to persistent storage
- Enable auto-scaling

### Phase 7: Data Centers
- Multiple data centers
- GeoDNS routing

### Phase 8: Message Queue
- Asynchronous communication
- Decoupled services

### Phase 9: Database Sharding
- Horizontal partitioning
- Handle massive data growth

## Key Principles for Millions of Users

1. **Keep web tier stateless**
2. **Build redundancy at every tier**
3. **Cache data as much as you can**
4. **Support multiple data centers**
5. **Host static assets in CDN**
6. **Scale your data tier by sharding**
7. **Split tiers into individual services**
8. **Monitor your system and use automation tools**

---

*Next: Chapter 02 - Back-of-the-Envelope Estimation*
