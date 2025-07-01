# Chapter 08: Design a URL Shortener

## Key Concepts

### What is a URL Shortener?
- **Definition**: Service that creates short URLs that redirect to longer original URLs
- **Purpose**: Save space, improve user experience, track clicks
- **Examples**: bit.ly, TinyURL, goo.gl
- **Classic System Design Question**: Designing a URL shortening service like tinyurl

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: Can you give an example of how a URL shortener work?
Interviewer: Assume URL https://www.systeminterview.com/q=chatsystem&c=loggedin&v=v3&l=long is the original URL. Your service creates an alias with shorter length: https://tinyurl.com/y7keocwj. If you click the alias, it redirects you to the original URL.

Candidate: What is the traffic volume?
Interviewer: 100 million URLs are generated per day.

Candidate: How long is the shortened URL?
Interviewer: As short as possible.

Candidate: What characters are allowed in the shortened URL?
Interviewer: Shortened URL can be a combination of numbers (0-9) and characters (a-z, A-Z).

Candidate: Can shortened URLs be deleted or updated?
Interviewer: For simplicity, let us assume shortened URLs cannot be deleted or updated.
```

### Basic Use Cases
1. **URL shortening**: Given a long URL → return a much shorter URL
2. **URL redirecting**: Given a shorter URL → redirect to the original URL
3. **High availability, scalability, and fault tolerance considerations**

### Back of the Envelope Estimation
- **Write operation**: 100 million URLs generated per day
- **Write operation per second**: 100 million / 24 / 3600 = 1,160
- **Read operation**: Assuming 10:1 read-to-write ratio, read operation per second: 1,160 × 10 = 11,600
- **10-year support**: 100 million × 365 × 10 = 365 billion records
- **Average URL length**: 100 bytes
- **Storage requirement over 10 years**: 365 billion × 100 bytes = 36.5 TB

## Step 2: Propose High-Level Design and Get Buy-in

### API Endpoints
**REST-style API design** with two primary endpoints:

1. **URL Shortening**:
   ```
   POST api/v1/data/shorten
   - Request parameter: {longUrl: longURLString}
   - Return: shortURL
   ```

2. **URL Redirecting**:
   ```
   GET api/v1/shortUrl
   - Return: longURL for HTTP redirection
   ```

### URL Redirecting
- **Process**: Server receives tinyurl request, changes short URL to long URL with 301 redirect
- **301 vs 302 Redirect**:
  - **301 redirect**: "Permanently" moved to long URL
    - Browser caches response
    - Subsequent requests go directly to long URL server
    - Reduces server load
  - **302 redirect**: "Temporarily" moved to long URL
    - Subsequent requests sent to URL shortening service first
    - Better for analytics (track click rate and source)

### URL Shortening
- **Format**: `www.tinyurl.com/{hashValue}`
- **Requirement**: Hash function fx that maps long URL to hashValue
- **Hash Function Requirements**:
  - Each longURL must be hashed to one hashValue
  - Each hashValue can be mapped back to the longURL

## Step 3: Design Deep Dive

### Data Model
- **Storage**: Relational database instead of hash table (memory limitations)
- **Table Design**: 3 columns - id, shortURL, longURL

### Hash Function

#### Hash Value Length
- **Characters**: [0-9, a-z, A-Z] = 62 possible characters
- **Requirement**: Find smallest n such that 62^n ≥ 365 billion
- **Calculation**: When n = 7, 62^7 = ~3.5 trillion (sufficient for 365 billion URLs)
- **Result**: Hash value length = 7 characters

#### Two Hash Function Approaches

##### 1. Hash + Collision Resolution
- **Method**: Use well-known hash functions (CRC32, MD5, SHA-1)
- **Problem**: Even shortest hash (CRC32) is too long (>7 characters)
- **Solution**: Collect first 7 characters, handle collisions
- **Collision Resolution**: Recursively append predefined string until no collision
- **Performance Issue**: Expensive database queries for collision checking
- **Optimization**: Bloom filters for performance improvement

##### 2. Base 62 Conversion
- **Method**: Convert numbers between different number representation systems
- **Character Mapping**: 0-0, ..., 9-9, 10-a, 11-b, ..., 35-z, 36-A, ..., 61-Z
- **Example**: Convert 11157 (base 10) to base 62
  - 11157 = 2 × 62² + 55 × 62¹ + 59 × 62⁰ = [2, 55, 59] → [2, T, X]
  - Result: `https://tinyurl.com/2TX`

#### Comparison of Approaches
| Aspect | Hash + Collision Resolution | Base 62 Conversion |
|--------|------------------------------|-------------------|
| Collision | Possible | No collision |
| Length | Fixed | Fixed |
| Predictable | No | Yes |
| Implementation | Complex | Simple |

### URL Shortening Deep Dive

#### Flow Process (Using Base 62 Conversion)
1. **Input**: longURL
2. **Check**: Is longURL in database?
3. **If exists**: Fetch shortURL from database and return
4. **If new**: Generate new unique ID (primary key) using unique ID generator
5. **Convert**: Convert ID to shortURL using base 62 conversion
6. **Save**: Create new database row with ID, shortURL, and longURL

#### Concrete Example
- **Input**: `https://en.wikipedia.org/wiki/Systems_design`
- **Unique ID**: 2009215674938
- **Base 62 conversion**: 2009215674938 → "zn9edcu"
- **Result**: Save ID, shortURL ("zn9edcu"), and longURL to database

#### Distributed Unique ID Generator
- **Purpose**: Generate globally unique IDs for creating shortURLs
- **Reference**: Chapter 7 - Design a Unique ID Generator in Distributed Systems

### URL Redirecting Deep Dive

#### Flow Process
1. **User clicks**: `https://tinyurl.com/zn9edcu`
2. **Load balancer**: Forwards request to web servers
3. **Cache check**: If shortURL in cache, return longURL directly
4. **Database lookup**: If not in cache, fetch from database
5. **Error handling**: If not in database, likely invalid shortURL
6. **Return**: longURL to user

#### Performance Optimization
- **Caching**: Store <shortURL, longURL> mapping in cache (more reads than writes)
- **Cache-first**: Check cache before database lookup

## Step 4: Wrap Up

### Additional Talking Points

#### Rate Limiter
- **Security Problem**: Malicious users sending overwhelming number of URL shortening requests
- **Solution**: Rate limiter based on IP address or other filtering rules
- **Reference**: Chapter 4 - Design a rate limiter

#### Web Server Scaling
- **Stateless Design**: Web tier is stateless
- **Scaling**: Easy to scale by adding/removing web servers

#### Database Scaling
- **Techniques**: Database replication and sharding
- **Purpose**: Handle high traffic and data volume

#### Analytics
- **Importance**: Data increasingly important for business success
- **Questions**: How many people click on a link? When do they click?
- **Integration**: Analytics solution for URL shortener

#### Availability, Consistency, and Reliability
- **Core Concepts**: Essential for any large system's success
- **Reference**: Chapter 1 for detailed discussion

## Technical Specifications

### Storage Requirements
- **10-year capacity**: 365 billion records
- **Average URL size**: 100 bytes
- **Total storage**: 36.5 TB

### Performance Requirements
- **Write throughput**: 1,160 URLs per second
- **Read throughput**: 11,600 redirects per second
- **Read-to-write ratio**: 10:1

### Hash Function Details
- **Length**: 7 characters
- **Character set**: 62 characters (0-9, a-z, A-Z)
- **Capacity**: 3.5 trillion unique URLs

---

*Next: Chapter 09 - Design a Web Crawler*
