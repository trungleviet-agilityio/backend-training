# Chapter 04: Design a Rate Limiter

## Key Concepts

### What is a Rate Limiter?
- **Definition**: System that controls the rate of traffic sent by a client or service
- **HTTP Context**: Limits number of client requests allowed over specified period
- **Behavior**: Blocks excess calls when API request count exceeds threshold

### Examples of Rate Limiting
- **User posts**: No more than 2 posts per second
- **Account creation**: Maximum 10 accounts per day from same IP address
- **Rewards claiming**: No more than 5 times per week from same device

### Benefits of API Rate Limiting
- **Prevent DoS attacks**: Block excess calls (intentional or unintentional)
  - Twitter: 300 tweets per 3 hours
  - Google Docs: 300 read requests per user per 60 seconds
- **Reduce cost**: Fewer servers, allocate resources to high-priority APIs
  - Essential for paid third-party APIs (credit checks, payments, health records)
- **Prevent server overload**: Filter excess requests from bots or user misbehavior

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: What kind of rate limiter are we going to design? Is it a client-side rate limiter or server-side API rate limiter?
Interviewer: Great question. We focus on the server-side API rate limiter.

Candidate: Does the rate limiter throttle API requests based on IP, the user ID, or other properties?
Interviewer: The rate limiter should be flexible enough to support different sets of throttle rules.

Candidate: What is the scale of the system? Is it built for a startup or a big company with a large user base?
Interviewer: The system must be able to handle a large number of requests.

Candidate: Will the system work in a distributed environment?
Interviewer: Yes.

Candidate: Is the rate limiter a separate service or should it be implemented in application code?
Interviewer: It is a design decision up to you.

Candidate: Do we need to inform users who are throttled?
Interviewer: Yes.
```

### Requirements Summary
- **Accurately limit excessive requests**
- **Low latency**: Should not slow down HTTP response time
- **Minimal memory usage**: Use as little memory as possible
- **Distributed rate limiting**: Shared across multiple servers or processes
- **Exception handling**: Show clear exceptions to users when throttled
- **High fault tolerance**: Rate limiter problems should not affect entire system

## Step 2: Propose High-Level Design and Get Buy-in

### Where to Put the Rate Limiter?

#### Client-side vs Server-side Implementation
- **Client-side**: Unreliable, requests can be forged, no control over implementation
- **Server-side**: More reliable and secure

#### Rate Limiter Middleware
- **Alternative approach**: Create rate limiter middleware instead of API servers
- **API Gateway**: Fully managed service supporting rate limiting, SSL termination, authentication, IP whitelisting, etc.

#### Implementation Guidelines
- **Evaluate current technology stack**: Programming language, cache service efficiency
- **Identify suitable algorithm**: Full control vs third-party gateway limitations
- **Consider microservices**: Add rate limiter to existing API gateway
- **Engineering resources**: Commercial API gateway vs building custom service

### Rate Limiting Algorithms

#### 1. Token Bucket Algorithm
- **Widely used**: Amazon and Stripe use this algorithm
- **How it works**:
  - Container with pre-defined capacity
  - Tokens added at preset rates periodically
  - Each request consumes one token
  - Request goes through if enough tokens, dropped if not
- **Parameters**:
  - **Bucket size**: Maximum tokens allowed
  - **Refill rate**: Tokens added per second
- **Bucket examples**:
  - Different buckets for different API endpoints
  - One bucket per IP address
  - Global bucket for system-wide limits
- **Pros**: Easy to implement, memory efficient, allows burst traffic
- **Cons**: Challenging to tune bucket size and refill rate

#### 2. Leaking Bucket Algorithm
- **Similar to token bucket**: But processes requests at fixed rate
- **Implementation**: First-in-first-out (FIFO) queue
- **How it works**:
  - Check if queue is full when request arrives
  - Add to queue if not full, drop if full
  - Process requests at regular intervals
- **Parameters**:
  - **Bucket size**: Equal to queue size
  - **Outflow rate**: Requests processed per second
- **Used by**: Shopify for rate limiting
- **Pros**: Memory efficient, stable outflow rate
- **Cons**: Burst traffic fills queue with old requests, two parameters to tune

#### 3. Fixed Window Counter Algorithm
- **How it works**:
  - Divide timeline into fixed-sized time windows
  - Assign counter for each window
  - Increment counter for each request
  - Drop requests when counter reaches threshold
- **Example**: 3 requests per second, time unit = 1 second
- **Major problem**: Burst traffic at window edges allows more requests than quota
- **Example**: 5 requests per minute, but 10 requests between 2:00:30-2:01:30
- **Pros**: Memory efficient, easy to understand
- **Cons**: Spike in traffic at window edges

#### 4. Sliding Window Log Algorithm
- **Fixes fixed window issue**: Tracks request timestamps
- **Implementation**: Timestamps kept in cache (Redis sorted sets)
- **How it works**:
  - Remove outdated timestamps (older than current window start)
  - Add new request timestamp to log
  - Accept if log size ≤ allowed count, reject otherwise
- **Example**: 2 requests per minute
  - 1:00:01: Log empty, request allowed
  - 1:00:30: Log size 2, request allowed
  - 1:00:50: Log size 3, request rejected
  - 1:01:40: Remove outdated timestamps, log size 2, request accepted
- **Pros**: Very accurate rate limiting
- **Cons**: High memory consumption

#### 5. Sliding Window Counter Algorithm
- **Hybrid approach**: Combines fixed window counter and sliding window log
- **Formula**: Requests in current window + requests in previous window × overlap percentage
- **Example**: 7 requests per minute, 5 in previous minute, 3 in current minute
  - Calculation: 3 + 5 × 0.7 = 6.5 (rounded down to 6)
  - Request allowed (limit is 7)
- **Pros**: Smooths out traffic spikes, memory efficient
- **Cons**: Approximation, assumes even distribution in previous window
- **Accuracy**: According to Cloudflare, only 0.003% wrong decisions among 400M requests

### High-Level Architecture
- **Basic idea**: Counter to track requests from same user/IP
- **Storage**: In-memory cache (Redis) instead of database
- **Redis commands**:
  - **INCR**: Increase counter by 1
  - **EXPIRE**: Set timeout for counter
- **Flow**:
  1. Client sends request to rate limiting middleware
  2. Middleware fetches counter from Redis bucket
  3. Check if limit reached
  4. If reached: reject request
  5. If not reached: send to API servers, increment counter

## Step 3: Design Deep Dive

### Rate Limiting Rules
- **Configuration**: Rules written in configuration files, saved on disk
- **Example 1** (Lyft open-source component):
  ```
  domain: messaging
  descriptors:
  - key: message_type
    value: marketing
    rate_limit:
      unit: day
      requests_per_unit: 5
  ```
- **Example 2**:
  ```
  domain: auth
  descriptors:
  - key: auth_type
    value: login
    rate_limit:
      unit: minute
      requests_per_unit: 5
  ```

### Handling Rate-Limited Requests
- **HTTP 429**: Return "too many requests" response code
- **Optional**: Enqueue rate-limited requests for later processing
- **Rate limiter headers**:
  - **X-Ratelimit-Remaining**: Remaining allowed requests
  - **X-Ratelimit-Limit**: Calls per time window
  - **X-Ratelimit-Retry-After**: Seconds to wait before retry

### Detailed Design
- **Rules storage**: Disk → Workers pull → Cache
- **Request flow**: Client → Rate limiter middleware → Load rules → Fetch counters → Decision
- **Decision**: Forward to API servers or return 429 error

### Rate Limiter in Distributed Environment

#### Race Condition
- **Problem**: Concurrent requests read/write counter without synchronization
- **Example**: Two requests read counter=3, both increment to 4, correct value should be 5
- **Solutions**: Lua script, Redis sorted sets data structure

#### Synchronization Issue
- **Problem**: Multiple rate limiter servers need shared state
- **Bad solution**: Sticky sessions (not scalable/flexible)
- **Good solution**: Centralized data store (Redis)

### Performance Optimization

#### Multi-Data Center Setup
- **Importance**: Reduce latency for users far from data center
- **Example**: Cloudflare has 194 geographically distributed edge servers
- **Benefit**: Automatic routing to closest edge server

#### Eventual Consistency Model
- **Approach**: Synchronize data with eventual consistency
- **Reference**: See "Consistency" section in Chapter 6

### Monitoring
- **Analytics data**: Check rate limiter effectiveness
- **Key questions**:
  - Is the rate limiting algorithm effective?
  - Are the rate limiting rules effective?
- **Scenarios**:
  - **Too strict rules**: Relax rules if many valid requests dropped
  - **Ineffective during traffic spikes**: Replace algorithm (token bucket for burst traffic)

## Step 4: Wrap Up

### Additional Talking Points

#### Hard vs Soft Rate Limiting
- **Hard**: Number of requests cannot exceed threshold
- **Soft**: Requests can exceed threshold for short period

#### Rate Limiting at Different Levels
- **Application level (HTTP, Layer 7)**: Discussed in this chapter
- **Network level (IP, Layer 3)**: Using Iptables
- **OSI Model**: 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application)

#### Best Practices for Clients
- **Use client cache**: Avoid frequent API calls
- **Understand limits**: Don't send too many requests in short time
- **Handle exceptions**: Graceful recovery from errors
- **Add backoff time**: Retry logic with sufficient delays

### Algorithms Summary
1. **Token bucket**: Easy, memory efficient, allows bursts
2. **Leaking bucket**: Stable outflow, memory efficient
3. **Fixed window**: Simple, but allows edge bursts
4. **Sliding window log**: Accurate, but high memory usage
5. **Sliding window counter**: Smooths spikes, memory efficient, approximation

---

*Next: Chapter 05 - Design Consistent Hashing*
