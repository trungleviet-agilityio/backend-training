# Chapter 11: Design a News Feed System

## Key Concepts

### What is a News Feed System?
- **Definition**: Constantly updating list of stories on home page
- **Content Types**: Status updates, photos, videos, links, app activity, likes
- **Sources**: People, pages, and groups that user follows
- **Examples**: Facebook news feed, Instagram feed, Twitter timeline
- **Popular Interview Question**: Common system design interview topic

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: Is this a mobile app? Or a web app? Or both?
Interviewer: Both

Candidate: What are the important features?
Interviewer: A user can publish a post and see her friends' posts on the news feed page.

Candidate: Is the news feed sorted by reverse chronological order or any particular order such as topic scores? For instance, posts from your close friends have higher scores.
Interviewer: To keep things simple, let us assume the feed is sorted by reverse chronological order.

Candidate: How many friends can a user have?
Interviewer: 5000

Candidate: What is the traffic volume?
Interviewer: 10 million DAU

Candidate: Can feed contain images, videos, or just text?
Interviewer: It can contain media files, including both images and videos.
```

### System Requirements
- **Platform**: Both mobile and web apps
- **Features**: Publish posts, view friends' posts
- **Sorting**: Reverse chronological order
- **Friend Limit**: 5000 friends per user
- **Scale**: 10 million DAU (Daily Active Users)
- **Content**: Text, images, videos

## Step 2: Propose High-Level Design and Get Buy-in

### Two Main Flows
1. **Feed Publishing**: User publishes post → data written to cache/database → populated to friends' news feeds
2. **News Feed Building**: Aggregating friends' posts in reverse chronological order

### News Feed APIs

#### Feed Publishing API
```
POST /v1/me/feed
Params:
- content: text of the post
- auth_token: authenticate API requests
```

#### News Feed Retrieval API
```
GET /v1/me/feed
Params:
- auth_token: authenticate API requests
```

### Feed Publishing Flow
**Components**:
- **User**: Makes post through API (`/v1/me/feed?content=Hello&auth_token={auth_token}`)
- **Load Balancer**: Distribute traffic to web servers
- **Web Servers**: Redirect traffic to internal services
- **Post Service**: Persist post in database and cache
- **Fanout Service**: Push new content to friends' news feed
- **Notification Service**: Inform friends and send push notifications

### News Feed Building Flow
**Components**:
- **User**: Sends request to retrieve news feed (`/v1/me/feed`)
- **Load Balancer**: Redirects traffic to web servers
- **Web Servers**: Route requests to newsfeed service
- **Newsfeed Service**: Fetches news feed from cache
- **Newsfeed Cache**: Stores news feed IDs for rendering

## Step 3: Design Deep Dive

### Feed Publishing Deep Dive

#### Web Servers
- **Authentication**: Only users with valid auth_token can make posts
- **Rate Limiting**: Limit number of posts per user within certain period
- **Purpose**: Prevent spam and abusive content

#### Fanout Service

##### Two Fanout Models

###### 1. Fanout on Write (Push Model)
- **Process**: News feed pre-computed during write time
- **Behavior**: New post delivered to friends' cache immediately after publication
- **Pros**:
  - News feed generated in real-time
  - Fast fetching (pre-computed during write time)
- **Cons**:
  - Hotkey problem: Slow for users with many friends
  - Wastes computing resources for inactive users

###### 2. Fanout on Read (Pull Model)
- **Process**: News feed generated during read time (on-demand)
- **Behavior**: Recent posts pulled when user loads home page
- **Pros**:
  - Better for inactive users (no wasted resources)
  - No hotkey problem
- **Cons**:
  - Slow fetching (not pre-computed)

##### Hybrid Approach
- **Strategy**: Use push model for majority of users
- **Exception**: Celebrities/users with many friends use pull model
- **Benefit**: Avoid system overload for high-follower accounts
- **Technique**: Consistent hashing to mitigate hotkey problem

#### Fanout Service Workflow
1. **Fetch Friend IDs**: From graph database (suited for friend relationships)
2. **Get Friends Info**: From user cache, filter based on user settings
3. **Send to Queue**: Friends list and new post ID to message queue
4. **Fanout Workers**: Fetch from queue, store in news feed cache
5. **Cache Storage**: Store `<post_id, user_id>` mapping

#### News Feed Cache Design
- **Structure**: `<post_id, user_id>` mapping table
- **Memory Optimization**: Store only IDs, not entire objects
- **Configurable Limit**: Set limit to keep memory size small
- **Rationale**: Users rarely scroll through thousands of posts

### News Feed Retrieval Deep Dive

#### Retrieval Process
1. **User Request**: `/v1/me/feed`
2. **Load Balancer**: Redistribute requests to web servers
3. **Web Servers**: Call news feed service
4. **News Feed Service**: Get post IDs from news feed cache
5. **Hydration**: Fetch complete user and post objects from caches
6. **Response**: Return fully hydrated news feed in JSON format

#### Media Content
- **Storage**: Media content (images, videos) stored in CDN
- **Purpose**: Fast retrieval for media files

### Cache Architecture
**5-Layer Cache Design**:

1. **News Feed Cache**: Stores IDs of news feeds
2. **Content Cache**: Stores every post data (popular content in hot cache)
3. **Social Graph Cache**: Stores user relationship data
4. **Action Cache**: Stores user actions (likes, replies, etc.)
5. **Counters Cache**: Stores counters (likes, replies, followers, following)

## Step 4: Wrap Up

### Design Summary
- **Two Flows**: Feed publishing and news feed retrieval
- **Hybrid Fanout**: Push model for most users, pull model for celebrities
- **Multi-Layer Caching**: 5-layer cache architecture
- **Scalable Design**: Handles 10 million DAU

### Scalability Considerations

#### Database Scaling
- **Vertical vs Horizontal Scaling**: Choose based on requirements
- **SQL vs NoSQL**: Consider data structure and query patterns
- **Master-Slave Replication**: For read/write separation
- **Read Replicas**: Scale read operations
- **Consistency Models**: Choose appropriate consistency level
- **Database Sharding**: Distribute data across multiple databases

#### Other Scaling Points
- **Web Tier**: Keep stateless for easy scaling
- **Caching**: Cache data as much as possible
- **Data Centers**: Support multiple data centers
- **Message Queues**: Loosely couple components
- **Monitoring**: Track key metrics (QPS, latency)

### Key Metrics to Monitor
- **QPS during peak hours**: System performance under load
- **Latency**: Response time for news feed retrieval
- **Cache hit rates**: Performance of caching layers
- **Fanout performance**: Time to distribute posts to friends

## Technical Specifications

### Performance Requirements
- **Scale**: 10 million DAU
- **Friend Limit**: 5000 friends per user
- **Content Types**: Text, images, videos
- **Sorting**: Reverse chronological order

### Architecture Components
- **Web Servers**: Authentication, rate limiting, request routing
- **Post Service**: Database persistence and caching
- **Fanout Service**: Distribution of posts to friends
- **News Feed Service**: Feed retrieval and hydration
- **Cache Layers**: 5-layer caching strategy
- **Message Queues**: Asynchronous processing
- **CDN**: Media content delivery

### Data Flow
- **Publishing**: User → Load Balancer → Web Server → Post Service → Fanout Service → Cache
- **Retrieval**: User → Load Balancer → Web Server → News Feed Service → Cache → Response

---

*Next: Chapter 12 - Design a Chat System*
