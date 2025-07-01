# Chapter 13: Design a Search Autocomplete System

## Key Concepts

### What is a Search Autocomplete System?
- **Definition**: Feature that presents matching search terms as user types
- **Alternative Names**: Typeahead, search-as-you-type, incremental search
- **Examples**: Google search, Amazon shopping search
- **Popular Interview Question**: Also called "design top k" or "design top k most searched queries"

### System Purpose
- **Real-time Suggestions**: Show relevant matches as user types
- **User Experience**: Improve search efficiency and speed
- **Popularity-Based**: Return most frequently searched terms

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: Is the matching only supported at the beginning of a search query or in the middle as well?
Interviewer: Only at the beginning of a search query.

Candidate: How many autocomplete suggestions should the system return?
Interviewer: 5

Candidate: How does the system know which 5 suggestions to return?
Interviewer: This is determined by popularity, decided by the historical query frequency.

Candidate: Does the system support spell check?
Interviewer: No, spell check or autocorrect is not supported.

Candidate: Are search queries in English?
Interviewer: Yes. If time allows at the end, we can discuss multi-language support.

Candidate: Do we allow capitalization and special characters?
Interviewer: No, we assume all search queries have lowercase alphabetic characters.

Candidate: How many users use the product?
Interviewer: 10 million DAU.
```

### System Requirements
- **Matching**: Only at beginning of search query
- **Suggestions**: 5 autocomplete results
- **Ranking**: By historical query frequency
- **Language**: English only (lowercase alphabetic characters)
- **Scale**: 10 million DAU
- **No Spell Check**: Not supported

### Functional Requirements
- **Fast Response Time**: Results within 100ms (Facebook's requirement)
- **Relevant**: Suggestions relevant to search term
- **Sorted**: Results sorted by popularity
- **Scalable**: Handle high traffic volume
- **Highly Available**: Remain accessible during partial failures

## Back of the Envelope Estimation

### Traffic Calculation
- **Users**: 10 million DAU
- **Searches per User**: 10 searches per day
- **Characters per Query**: 20 characters average (4 words × 5 characters)
- **Requests per Query**: 20 requests (one per character typed)
- **Daily Queries**: 10M × 10 = 100M queries/day
- **QPS**: 100M × 20 / 24h / 3600s = ~24,000 QPS
- **Peak QPS**: 24,000 × 2 = ~48,000 QPS

### Storage Calculation
- **New Data**: 20% of daily queries are new
- **Daily Storage**: 10M × 10 × 20 bytes × 20% = 0.4 GB/day
- **Data per Query**: 20 bytes (ASCII encoding)

### Example Request Flow
For typing "dinner":
```
search?q=d
search?q=di
search?q=din
search?q=dinn
search?q=dinne
search?q=dinner
```

## Step 2: Propose High-Level Design and Get Buy-in

### Two Main Components

#### 1. Data Gathering Service
- **Purpose**: Gather user input queries and aggregate in real-time
- **Function**: Build frequency table of search queries
- **Note**: Real-time processing not practical for large datasets

#### 2. Query Service
- **Purpose**: Return 5 most frequently searched terms for given prefix
- **Input**: Search query or prefix
- **Output**: Top 5 suggestions sorted by frequency

### Data Gathering Service Example
**Frequency Table Structure**:
- **Query**: Stores the query string
- **Frequency**: Number of times query has been searched

**Example Updates**:
1. User searches "twitch" → frequency: 1
2. User searches "twitter" → frequency: 1
3. User searches "twitter" again → frequency: 2
4. User searches "twillo" → frequency: 1

### Query Service Example
**SQL Query for Top 5**:
```sql
SELECT query, frequency
FROM frequency_table
WHERE query LIKE 'tw%'
ORDER BY frequency DESC
LIMIT 5;
```

**Result for prefix "tw"**:
- twitter (frequency: 2)
- twitch (frequency: 1)
- twillo (frequency: 1)

## Step 3: Design Deep Dive

### Trie Data Structure

#### Basic Trie Overview
- **Definition**: Tree-like data structure for string storage
- **Name Origin**: From "retrieval"
- **Structure**:
  - Root represents empty string
  - Each node stores a character
  - 26 children per node (one for each letter)
  - Each node represents a word or prefix

#### Optimized Trie with Frequency
**Enhancement**: Add frequency information to nodes
**Purpose**: Support sorting by popularity

#### Autocomplete Algorithm
**Steps**:
1. **Find Prefix**: O(p) where p = prefix length
2. **Traverse Subtree**: O(c) where c = number of children
3. **Sort and Get Top k**: O(c log c)

**Total Complexity**: O(p) + O(c) + O(c log c)

#### Optimizations

##### 1. Limit Max Prefix Length
- **Assumption**: Users rarely type long queries
- **Limit**: 50 characters maximum
- **Benefit**: O(p) becomes O(1)

##### 2. Cache Top Queries at Each Node
- **Strategy**: Store top k queries at every node
- **Benefit**: Avoid traversing entire trie
- **Trade-off**: More space for faster retrieval
- **Result**: O(1) time complexity

**Final Algorithm**:
1. Find prefix node: O(1)
2. Return top k (cached): O(1)
3. **Total**: O(1)

### Data Gathering Service (Improved)

#### Components

##### 1. Analytics Logs
- **Purpose**: Store raw search query data
- **Characteristics**: Append-only, not indexed
- **Example**:
  ```
  query: "system design interview"
  timestamp: "2023-01-01 12:00:00"
  user_id: "user123"
  ```

##### 2. Aggregators
- **Purpose**: Process large analytics logs
- **Function**: Aggregate data for system processing
- **Frequency**: Weekly aggregation (configurable)
- **Output**: Weekly frequency data

##### 3. Workers
- **Purpose**: Asynchronous job processing
- **Function**: Build trie data structure
- **Schedule**: Regular intervals
- **Output**: Store trie in Trie DB

##### 4. Trie Cache
- **Purpose**: Distributed cache for fast reads
- **Function**: Keep trie in memory
- **Update**: Weekly snapshots from DB

##### 5. Trie DB
- **Purpose**: Persistent storage
- **Options**:
  - **Document Store**: MongoDB for serialized trie data
  - **Key-Value Store**: Hash table representation

#### Trie to Hash Table Mapping
**Logic**:
- Every prefix → key in hash table
- Trie node data → value in hash table

**Example**:
```
Trie Node "be" → Key: "be", Value: [best:35, bet:29, bee:20, be:15, beer:10]
```

### Query Service (Improved)

#### Architecture
1. **Load Balancer**: Routes search queries
2. **API Servers**: Get trie data from cache
3. **Trie Cache**: Fast retrieval of autocomplete data
4. **Cache Miss Handling**: Replenish data to cache

#### Optimizations

##### 1. AJAX Requests
- **Purpose**: Web application support
- **Benefit**: No page refresh required
- **Implementation**: Asynchronous JavaScript requests

##### 2. Browser Caching
- **Purpose**: Reduce server load
- **Strategy**: Cache suggestions for short time
- **Example**: Google caches for 1 hour
- **Headers**: `Cache-Control: private, max-age=3600`

##### 3. Data Sampling
- **Purpose**: Reduce processing overhead
- **Strategy**: Log 1 out of every N requests
- **Benefit**: Significant resource savings

### Trie Operations

#### Create Operation
- **Process**: Workers build trie from aggregated data
- **Source**: Analytics Log/DB
- **Frequency**: Weekly rebuild

#### Update Operation

##### Option 1: Weekly Update
- **Process**: Replace entire trie
- **Benefit**: Simple, consistent
- **Drawback**: Not real-time

##### Option 2: Individual Node Update
- **Process**: Update specific trie nodes
- **Requirement**: Update ancestors up to root
- **Use Case**: Small trie size only
- **Example**: Update "beer" frequency from 10 to 30

#### Delete Operation
- **Purpose**: Remove inappropriate suggestions
- **Filter Layer**: Remove hateful, violent, explicit content
- **Process**: Physical removal from database
- **Timing**: Asynchronous, next update cycle

### Scale the Storage

#### Sharding Strategy

##### First Level Sharding
- **Basis**: First character of query
- **Examples**:
  - 2 servers: 'a'-'m' and 'n'-'z'
  - 3 servers: 'a'-'i', 'j'-'r', 's'-'z'
  - 26 servers: one per letter

##### Problem: Uneven Distribution
- **Issue**: More words start with 'c' than 'x'
- **Solution**: Smart sharding based on historical data

##### Smart Sharding
- **Strategy**: Analyze historical distribution patterns
- **Example**: 's' queries ≈ 'u'-'z' combined queries
- **Implementation**: Shard map manager with lookup database

## Step 4: Wrap Up

### System Summary
- **Core Data Structure**: Optimized trie with frequency caching
- **Architecture**: Data gathering + query service
- **Performance**: O(1) autocomplete retrieval
- **Scale**: 48,000 peak QPS, 0.4GB daily storage

### Additional Talking Points

#### Multi-Language Support
- **Implementation**: Store Unicode characters in trie nodes
- **Unicode**: Encoding standard for all world writing systems
- **Consideration**: Different character sets and languages

#### Geographic Variations
- **Challenge**: Different top queries per country
- **Solution**: Build different tries for different countries
- **Optimization**: Store tries in CDNs for better response time

#### Real-Time Trending Queries
**Challenge**: Breaking news creates sudden popularity spikes
**Problems**:
- Weekly updates too slow
- Trie building takes too long

**Solutions**:
- Reduce working dataset by sharding
- Change ranking model (more weight to recent queries)
- Stream processing systems:
  - Apache Hadoop MapReduce
  - Apache Spark Streaming
  - Apache Storm
  - Apache Kafka

### Key Metrics
- **Response Time**: < 100ms for autocomplete
- **QPS**: Handle 48,000 peak requests/second
- **Storage**: 0.4GB new data daily
- **Cache Hit Rate**: Trie cache performance
- **Update Frequency**: Weekly trie rebuilds

### Technical Specifications
- **Data Structure**: Trie with top-k caching
- **Storage**: Key-value store or document store
- **Caching**: Multi-layer (browser, distributed cache)
- **Processing**: Batch aggregation with real-time options
- **Sharding**: Smart distribution based on query patterns

---

*Next: Chapter 14 - Design YouTube*
