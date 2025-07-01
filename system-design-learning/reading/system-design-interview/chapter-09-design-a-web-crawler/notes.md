# Chapter 09: Design a Web Crawler

## Key Concepts

### What is a Web Crawler?
- **Definition**: Robot or spider used by search engines to discover new or updated content on the web
- **Content Types**: Web pages, images, videos, PDF files, etc.
- **Process**: Starts with few web pages, follows links to collect new content
- **Classic System Design Question**: Interesting and complex system design interview question

### Use Cases
- **Search Engine Indexing**: Most common use case - collect web pages to create local index
  - Example: Googlebot for Google search engine
- **Web Archiving**: Collect information to preserve data for future uses
  - Examples: US Library of Congress, EU web archive
- **Web Mining**: Discover useful knowledge from internet
  - Example: Financial firms download shareholder meetings and annual reports
- **Web Monitoring**: Monitor copyright and trademark infringements
  - Example: Digimarc discovers pirated works

### Complexity Factors
- **Scale**: Small school project (few hours) vs gigantic project (dedicated engineering team)
- **Continuous Improvement**: Requires ongoing development and optimization

## Step 1: Understand the Problem and Establish Design Scope

### Basic Algorithm
1. Given a set of URLs, download all web pages addressed by URLs
2. Extract URLs from these web pages
3. Add new URLs to list of URLs to be downloaded
4. Repeat these 3 steps

### Reality Check
- **Simple Algorithm**: Basic algorithm is simple
- **Complex Implementation**: Designing vastly scalable web crawler is extremely complex
- **Interview Reality**: Unlikely to design massive web crawler within interview duration

### Interview Questions and Requirements
```
Candidate: What is the main purpose of the crawler? Is it used for search engine indexing, data mining, or something else?
Interviewer: Search engine indexing.

Candidate: How many web pages does the web crawler collect per month?
Interviewer: 1 billion pages.

Candidate: What content types are included? HTML only or other content types such as PDFs and images as well?
Interviewer: HTML only.

Candidate: Shall we consider newly added or edited web pages?
Interviewer: Yes, we should consider the newly added or edited web pages.

Candidate: Do we need to store HTML pages crawled from the web?
Interviewer: Yes, up to 5 years.

Candidate: How do we handle web pages with duplicate content?
Interviewer: Pages with duplicate content should be ignored.
```

### Characteristics of a Good Web Crawler
- **Scalability**: Web is very large (billions of pages), crawling should be extremely efficient using parallelization
- **Robustness**: Web is full of traps (bad HTML, unresponsive servers, crashes, malicious links), crawler must handle edge cases
- **Politeness**: Should not make too many requests to website within short time interval
- **Extensibility**: System flexible to support new content types with minimal changes

### Back of the Envelope Estimation
- **Assumption**: 1 billion web pages downloaded every month
- **QPS**: 1,000,000,000 / 30 days / 24 hours / 3600 seconds = ~400 pages per second
- **Peak QPS**: 2 × QPS = 800
- **Average web page size**: 500k
- **Storage per month**: 1 billion × 500k = 500 TB
- **5-year storage**: 500 TB × 12 months × 5 years = 30 PB

## Step 2: Propose High-Level Design and Get Buy-in

### System Components

#### Seed URLs
- **Purpose**: Starting point for crawl process
- **Strategy**: Divide entire URL space into smaller ones
- **Approaches**:
  - **Locality-based**: Different countries have different popular websites
  - **Topic-based**: Divide into shopping, sports, healthcare, etc.
- **Example**: University domain name for crawling university website

#### URL Frontier
- **Definition**: Component that stores URLs to be downloaded
- **Structure**: First-in-First-out (FIFO) queue
- **Purpose**: Split crawl state into "to be downloaded" and "already downloaded"

#### HTML Downloader
- **Function**: Downloads web pages from internet
- **Input**: URLs provided by URL Frontier

#### DNS Resolver
- **Function**: Translates URL to IP address
- **Example**: www.wikipedia.org → 198.35.26.96
- **Usage**: HTML Downloader calls DNS Resolver

#### Content Parser
- **Function**: Parses and validates downloaded web pages
- **Purpose**: Handle malformed web pages that could cause problems
- **Design**: Separate component to avoid slowing down crawling process

#### Content Seen?
- **Purpose**: Eliminate data redundancy and shorten processing time
- **Problem**: 29% of web pages are duplicate content
- **Solution**: Compare hash values of web pages (more efficient than character-by-character)
- **Function**: Detect new content previously stored in system

#### Content Storage
- **Storage System**: For storing HTML content
- **Strategy**: Hybrid approach
  - **Disk**: Most content stored on disk (dataset too big for memory)
  - **Memory**: Popular content kept in memory to reduce latency

#### URL Extractor
- **Function**: Parses and extracts links from HTML pages
- **Process**: Converts relative paths to absolute URLs
- **Example**: Add "https://en.wikipedia.org" prefix to relative paths

#### URL Filter
- **Function**: Excludes certain content types, file extensions, error links, and URLs in "blacklisted" sites

#### URL Seen?
- **Purpose**: Track URLs visited before or already in Frontier
- **Benefit**: Avoid adding same URL multiple times (prevents infinite loops)
- **Implementation**: Bloom filter and hash table

#### URL Storage
- **Function**: Stores already visited URLs

### Web Crawler Workflow
1. **Add seed URLs** to URL Frontier
2. **HTML Downloader** fetches URLs from URL Frontier
3. **HTML Downloader** gets IP addresses from DNS resolver and starts downloading
4. **Content Parser** parses HTML pages and checks for malformed pages
5. **Content Seen?** component checks if HTML page already in storage
6. **If in storage**: HTML page discarded (duplicate content)
7. **If not in storage**: Content passed to Link Extractor
8. **Link Extractor** extracts links from HTML pages
9. **URL Filter** filters extracted links
10. **URL Seen?** component checks if URL already processed
11. **If not processed**: URL added to URL Frontier

## Step 3: Design Deep Dive

### DFS vs BFS
- **Web as Graph**: Web pages as nodes, hyperlinks as edges
- **Crawl Process**: Traversing directed graph from one web page to others
- **DFS Issues**: Depth can be very deep (not good choice)
- **BFS**: Commonly used, implemented by FIFO queue
- **BFS Problems**:
  - Most links from same page link back to same host
  - Standard BFS doesn't consider URL priority

### URL Frontier

#### Politeness
- **Problem**: Sending too many requests to same hosting server is "impolite"
- **Solution**: Download one page at a time from same host with delay
- **Implementation**: Mapping from website hostnames to download threads
- **Components**:
  - **Queue Router**: Ensures each queue contains URLs from same host
  - **Mapping Table**: Maps each host to queue
  - **FIFO Queues**: Each queue contains URLs from same host
  - **Queue Selector**: Maps worker threads to FIFO queues
  - **Worker Threads**: Download web pages one by one from same host

#### Priority
- **Need**: Prioritize URLs based on usefulness (PageRank, web traffic, update frequency)
- **Components**:
  - **Prioritizer**: Takes URLs as input and computes priorities
  - **Priority Queues**: Each queue has assigned priority
  - **Queue Selector**: Randomly choose queue with bias towards higher priority

#### URL Frontier Design
- **Two Modules**:
  - **Front Queues**: Manage prioritization
  - **Back Queues**: Manage politeness

#### Freshness
- **Problem**: Web pages constantly added, deleted, and edited
- **Solution**: Periodically recrawl downloaded pages
- **Strategies**:
  - Recrawl based on web pages' update history
  - Prioritize URLs and recrawl important pages first and more frequently

#### Storage for URL Frontier
- **Scale**: Hundreds of millions of URLs in frontier
- **Hybrid Approach**:
  - **Disk**: Majority of URLs stored on disk
  - **Memory Buffers**: Maintain buffers for enqueue/dequeue operations
  - **Periodic Write**: Data in buffer periodically written to disk

### HTML Downloader

#### Robots.txt
- **Purpose**: Standard for websites to communicate with crawlers
- **Function**: Specifies what pages crawlers are allowed to download
- **Implementation**: Check robots.txt before crawling website
- **Caching**: Cache results to avoid repeat downloads
- **Example** (Amazon robots.txt):
  ```
  User-agent: Googlebot
  Disallow: /creatorhub/*
  Disallow: /rss/people/*/reviews
  ```

#### Performance Optimization

##### 1. Distributed Crawl
- **Strategy**: Distribute crawl jobs into multiple servers
- **Implementation**: Each server runs multiple threads
- **Partitioning**: URL space partitioned into smaller pieces

##### 2. Cache DNS Resolver
- **Problem**: DNS Resolver is bottleneck (10ms to 200ms response time)
- **Solution**: Maintain DNS cache to avoid frequent DNS calls
- **Implementation**: Domain name to IP address mapping, updated periodically

##### 3. Locality
- **Strategy**: Distribute crawl servers geographically
- **Benefit**: Faster download time when servers closer to website hosts
- **Scope**: Applies to crawl servers, cache, queue, storage

##### 4. Short Timeout
- **Problem**: Some web servers respond slowly or not at all
- **Solution**: Specify maximal wait time
- **Behavior**: Stop job and crawl other pages if host doesn't respond

### Robustness
- **Consistent Hashing**: Distribute loads among downloaders
- **Save Crawl States**: Write crawl states and data to storage system
- **Exception Handling**: Handle errors gracefully without crashing
- **Data Validation**: Prevent system errors

### Extensibility
- **Goal**: Make system flexible to support new content types
- **Method**: Extend crawler by plugging in new modules
- **Examples**:
  - PNG Downloader module for PNG files
  - Web Monitor module for copyright monitoring

### Detect and Avoid Problematic Content

#### 1. Redundant Content
- **Problem**: Nearly 30% of web pages are duplicates
- **Solution**: Hashes or checksums to detect duplication

#### 2. Spider Traps
- **Definition**: Web page causing crawler infinite loop
- **Example**: Infinite deep directory structure
  ```
  www.spidertrapexample.com/foo/bar/foo/bar/foo/bar/...
  ```
- **Detection**: Set maximal length for URLs
- **Manual Verification**: User manually verify and identify spider traps

#### 3. Data Noise
- **Types**: Advertisements, code snippets, spam URLs
- **Solution**: Exclude low-value content

## Step 4: Wrap Up

### Additional Talking Points

#### Server-Side Rendering
- **Problem**: Websites use JavaScript, AJAX to generate links dynamically
- **Solution**: Perform server-side rendering before parsing page

#### Filter Out Unwanted Pages
- **Purpose**: Anti-spam component to filter low quality and spam pages
- **Benefit**: Finite storage capacity and crawl resources

#### Database Replication and Sharding
- **Techniques**: Replication and sharding
- **Purpose**: Improve data layer availability, scalability, and reliability

#### Horizontal Scaling
- **Scale**: Hundreds or thousands of servers for large scale crawl
- **Key**: Keep servers stateless

#### Availability, Consistency, and Reliability
- **Core Concepts**: Essential for any large system's success
- **Reference**: Chapter 1 for detailed discussion

#### Analytics
- **Importance**: Collecting and analyzing data for fine-tuning
- **Purpose**: Data is key ingredient for system optimization

## Technical Specifications

### Performance Requirements
- **QPS**: 400 pages per second (average)
- **Peak QPS**: 800 pages per second
- **Storage**: 30 PB for 5-year content

### Storage Strategy
- **Hybrid Approach**: Disk for bulk storage, memory for popular content
- **DNS Caching**: Reduce DNS lookup overhead
- **Buffer Management**: Memory buffers for URL Frontier operations

### Scalability Considerations
- **Distributed Architecture**: Multiple servers and threads
- **Geographic Distribution**: Locality for better performance
- **Consistent Hashing**: Load distribution and fault tolerance

---

*Next: Chapter 10 - Design a Notification System*
