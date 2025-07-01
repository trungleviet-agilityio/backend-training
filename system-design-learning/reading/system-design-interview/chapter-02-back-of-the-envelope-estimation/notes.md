# Chapter 02: Back-of-the-Envelope Estimation

## Key Concepts

### What is Back-of-the-Envelope Estimation?
- **Definition**: Estimates created using thought experiments and common performance numbers
- **Purpose**: Get a good feel for which designs will meet requirements
- **Source**: Jeff Dean, Google Senior Fellow
- **Importance**: Critical for system design interviews

### Power of Two
- **Fundamental concept**: Data volume units using power of 2
- **Basic unit**: Byte = 8 bits
- **ASCII character**: 1 byte of memory (8 bits)
- **Table 2-1**: Data volume unit table (not shown in notes but referenced)

### Latency Numbers Every Programmer Should Know
- **Source**: Dr. Dean from Google (2010 numbers, updated for 2020)
- **Units**:
  - ns = nanosecond (10^-9 seconds)
  - µs = microsecond (10^-6 seconds = 1,000 ns)
  - ms = millisecond (10^-3 seconds = 1,000 µs = 1,000,000 ns)

#### Key Latency Numbers (2020)
- **L1 cache reference**: 0.5 ns
- **Branch mispredict**: 5 ns
- **L2 cache reference**: 7 ns
- **Mutex lock/unlock**: 100 ns
- **Main memory reference**: 100 ns
- **Compress 1KB with Zippy**: 10,000 ns (10 µs)
- **Send 2KB over 1 Gbps network**: 20,000 ns (20 µs)
- **Read 1MB sequentially from memory**: 250,000 ns (250 µs)
- **Round trip within same datacenter**: 500,000 ns (500 µs)
- **Disk seek**: 10,000,000 ns (10 ms)
- **Read 1MB sequentially from disk**: 20,000,000 ns (20 ms)
- **Send packet CA→Netherlands→CA**: 150,000,000 ns (150 ms)

#### Key Conclusions from Latency Analysis
- **Memory is fast but disk is slow**
- **Avoid disk seeks if possible**
- **Simple compression algorithms are fast**
- **Compress data before sending over internet if possible**
- **Data centers in different regions take time to communicate**

### Availability Numbers
- **High Availability**: System continuously operational for desirably long period
- **Measurement**: Percentage, with 100% = 0 downtime
- **Typical range**: 99% to 100%
- **SLA (Service Level Agreement)**: Agreement between service provider and customer
- **Cloud provider SLAs**: Amazon, Google, Microsoft set at 99.9% or above
- **Uptime measurement**: Traditionally measured in "nines"

#### Table 2-3: Availability and Downtime
- **99%**: 3.65 days downtime per year
- **99.9%**: 8.76 hours downtime per year
- **99.99%**: 52.56 minutes downtime per year
- **99.999%**: 5.26 minutes downtime per year

## Example: Twitter QPS and Storage Requirements

### Assumptions (Exercise Only - Not Real Twitter Numbers)
- **300 million monthly active users**
- **50% of users use Twitter daily**
- **Users post 2 tweets per day on average**
- **10% of tweets contain media**
- **Data stored for 5 years**

### QPS Estimation
- **Daily active users (DAU)**: 300 million × 50% = 150 million
- **Tweets QPS**: 150 million × 2 tweets / 24 hours / 3600 seconds = ~3500
- **Peak QPS**: 2 × QPS = ~7000

### Storage Estimation (Media Only)
- **Average tweet size**:
  - tweet_id: 64 bytes
  - text: 140 bytes
  - media: 1 MB
- **Media storage per day**: 150 million × 2 × 10% × 1 MB = 30 TB per day
- **5-year media storage**: 30 TB × 365 × 5 = ~55 PB

## Tips for Back-of-the-Envelope Estimation

### Rounding and Approximation
- **Don't solve complicated math**: Example: "99987 / 9.1" → "100,000 / 10"
- **Use round numbers**: Precision not expected
- **Focus on process**: Solving the problem more important than exact results

### Best Practices
- **Write down assumptions**: Reference later during discussion
- **Label units**: "5 MB" not just "5" to avoid ambiguity
- **Common calculations to practice**:
  - QPS (Queries Per Second)
  - Peak QPS
  - Storage requirements
  - Cache sizing
  - Number of servers

### Interview Focus
- **Problem-solving skills**: Interviewers test your approach
- **Process over precision**: Show your thinking
- **Practice makes perfect**: Practice these calculations before interviews

## Estimation Process

### Step 1: Clarify Requirements
- **Scale**: Number of users, requests per second
- **Data**: Size of data being stored/transferred
- **Performance**: Response time requirements

### Step 2: Break Down the Problem
- **Traffic**: Requests per second (RPS)
- **Storage**: Data size and growth rate
- **Bandwidth**: Data transfer requirements
- **Memory**: Working set size

### Step 3: Calculate Components
- **QPS**: Queries per second
- **Storage per user**: Average data per user
- **Total storage**: Users × storage per user
- **Bandwidth**: QPS × data per request

### Step 4: Identify Bottlenecks
- **CPU**: Processing capacity
- **Memory**: RAM requirements
- **Disk**: I/O capacity
- **Network**: Bandwidth limits

## Common Estimation Scenarios

### Social Media Platform
- **Users**: 1M daily active users
- **Posts per user**: 2 per day
- **Storage per post**: 1KB text + 100KB image
- **Total posts**: 2M per day
- **Storage per day**: 2M × 101KB = 202GB per day

### Video Streaming Service
- **Users**: 100K concurrent viewers
- **Video quality**: 1Mbps per stream
- **Total bandwidth**: 100K × 1Mbps = 100Gbps

### E-commerce Platform
- **Users**: 10K concurrent users
- **Orders per user**: 0.1 per session
- **Order data**: 1KB per order
- **QPS**: 10K × 0.1 = 1K orders per second
- **Storage per second**: 1KB × 1K = 1MB per second

## Common Mistakes

1. **Ignoring Growth**: Plan for future scale
2. **Over-Engineering**: Start simple
3. **Under-Estimating**: Add safety margins
4. **Not Considering Bottlenecks**: Identify limiting factors
5. **Forgetting Network**: Consider latency and bandwidth

## Practice Problems

### Problem 1: URL Shortener
- **Scale**: 100M URLs per day
- **Storage**: 500 bytes per URL
- **QPS**: 100M / 86400 = 1,157 RPS
- **Daily storage**: 100M × 500B = 50GB per day

### Problem 2: Chat System
- **Users**: 1M concurrent users
- **Messages**: 10 per user per minute
- **Message size**: 100 bytes
- **QPS**: 1M × 10 / 60 = 167K RPS
- **Bandwidth**: 167K × 100B = 16.7MB/s

---

*Next: Chapter 03 - A Framework for System Design Interviews*
