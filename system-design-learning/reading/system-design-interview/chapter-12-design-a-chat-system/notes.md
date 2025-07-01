# Chapter 12: Design a Chat System

## Key Concepts

### What is a Chat System?
- **Definition**: Real-time messaging application for communication
- **Types**: One-on-one chat, group chat, office chat, game chat
- **Examples**: Facebook Messenger, WeChat, WhatsApp, Slack, Discord
- **Popular Interview Question**: Common system design interview topic

### Chat App Types
- **One-on-One**: Facebook Messenger, WeChat, WhatsApp
- **Office Chat**: Slack (focus on group chat)
- **Game Chat**: Discord (large groups, low voice chat latency)

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: What kind of chat app shall we design? 1 on 1 or group based?
Interviewer: It should support both 1 on 1 and group chat.

Candidate: Is this a mobile app? Or a web app? Or both?
Interviewer: Both.

Candidate: What is the scale of this app? A startup app or massive scale?
Interviewer: It should support 50 million daily active users (DAU).

Candidate: For group chat, what is the group member limit?
Interviewer: A maximum of 100 people.

Candidate: What features are important for the chat app? Can it support attachment?
Interviewer: 1 on 1 chat, group chat, online indicator. The system only supports text messages.

Candidate: Is there a message size limit?
Interviewer: Yes, text length should be less than 100,000 characters long.

Candidate: Is end-to-end encryption required?
Interviewer: Not required for now but we will discuss that if time allows.

Candidate: How long shall we store the chat history?
Interviewer: Forever.
```

### System Requirements
- **Chat Types**: One-on-one and group chat
- **Platform**: Both mobile and web apps
- **Scale**: 50 million DAU
- **Group Limit**: Maximum 100 people per group
- **Features**: Text messages only, online indicators
- **Message Limit**: 100,000 characters
- **History**: Store forever
- **Encryption**: Not required initially

### Focus Features
- One-on-one chat with low delivery latency
- Small group chat (max 100 people)
- Online presence indicators
- Multiple device support
- Push notifications

## Step 2: Propose High-Level Design and Get Buy-in

### Client-Server Communication
- **Architecture**: Clients connect to chat service, not directly to each other
- **Functions**:
  - Receive messages from other clients
  - Find right recipients and relay messages
  - Hold messages for offline recipients until they come online

### Network Protocol Selection

#### Sender Side: HTTP
- **Protocol**: HTTP with keep-alive
- **Benefits**:
  - Persistent connections reduce TCP handshakes
  - Efficient for sending messages
  - Used by Facebook initially

#### Receiver Side: WebSocket
- **Challenge**: HTTP is client-initiated, not suitable for server-to-client messages
- **Solutions**: Polling, Long Polling, WebSocket

##### Polling
- **Process**: Client periodically asks server for new messages
- **Drawback**: Costly, consumes server resources
- **Issue**: Most requests return "no new messages"

##### Long Polling
- **Process**: Client holds connection until new messages arrive or timeout
- **Drawbacks**:
  - Sender and receiver may connect to different servers
  - Server can't detect client disconnection
  - Inefficient for inactive users

##### WebSocket (Recommended)
- **Process**: Bi-directional, persistent connection
- **Benefits**:
  - Server can push updates to client
  - Works through firewalls (ports 80/443)
  - Bidirectional communication
- **Implementation**: HTTP connection upgraded to WebSocket via handshake

### High-Level System Architecture

#### Three Major Categories

##### 1. Stateless Services
- **Purpose**: Traditional request/response services
- **Features**: Login, signup, user profile management
- **Architecture**: Behind load balancer, can be monolithic or microservices
- **Key Service**: Service discovery (provides chat server list to clients)

##### 2. Stateful Service
- **Service**: Chat service only
- **Characteristic**: Maintains persistent WebSocket connections
- **Behavior**: Clients don't switch servers unless server unavailable
- **Coordination**: Works with service discovery to avoid overloading

##### 3. Third-Party Integration
- **Primary**: Push notifications
- **Purpose**: Inform users of new messages when app not running
- **Reference**: Chapter 10 (Notification System)

### Scalability Considerations
- **Single Server Limitation**: Not recommended due to single point of failure
- **Memory Calculation**: 1M concurrent users × 10KB = 10GB memory
- **Starting Point**: Begin with single server design, then scale

### Storage Design

#### Data Types
1. **Generic Data**: User profiles, settings, friends list
   - **Storage**: Relational databases
   - **Techniques**: Replication, sharding

2. **Chat History Data**: Message data
   - **Volume**: Enormous (Facebook/WhatsApp: 60 billion messages/day)
   - **Access Pattern**: Recent chats accessed frequently
   - **Features**: Search, mentions, jump to specific messages
   - **Read/Write Ratio**: 1:1 for one-on-one chat

#### Storage Choice: Key-Value Stores
**Reasons**:
- Easy horizontal scaling
- Very low latency
- Better than relational DBs for long tail data
- Proven by Facebook Messenger (HBase) and Discord (Cassandra)

### Data Models

#### One-on-One Chat Message Table
- **Primary Key**: `message_id`
- **Purpose**: Determines message sequence
- **Note**: Can't rely on `created_at` (messages can have same timestamp)

#### Group Chat Message Table
- **Primary Key**: `(channel_id, message_id)`
- **Partition Key**: `channel_id`
- **Reason**: All group queries operate within a channel

#### Message ID Generation
**Requirements**:
- IDs must be unique
- IDs should be sortable by time (newer > older)

**Approaches**:
1. **Auto-increment**: MySQL feature, not available in NoSQL
2. **Global Sequence**: 64-bit generator like Snowflake (Chapter 7)
3. **Local Sequence**: Unique within group only (easier implementation)

## Step 3: Design Deep Dive

### Service Discovery
**Purpose**: Recommend best chat server for client
**Criteria**: Geographical location, server capacity
**Solution**: Apache Zookeeper
**Process**:
1. User tries to login
2. Load balancer sends request to API servers
3. Backend authenticates user
4. Service discovery finds best chat server
5. Server info returned to user
6. User connects via WebSocket

### Message Flows

#### One-on-One Chat Flow
1. **User A** sends message to **Chat Server 1**
2. **Chat Server 1** gets message ID from ID generator
3. **Chat Server 1** sends message to message sync queue
4. Message stored in key-value store
5a. If **User B** online: message forwarded to **Chat Server 2**
5b. If **User B** offline: push notification sent
6. **Chat Server 2** forwards message to **User B** via WebSocket

#### Message Synchronization Across Multiple Devices
**Process**:
- Each device maintains `cur_max_message_id`
- New messages: `recipient_id == current_user_id` AND `message_id > cur_max_message_id`
- Each device can get new messages from KV store independently

#### Small Group Chat Flow
**Process**:
1. Message copied to each group member's message sync queue
2. Each recipient has inbox containing messages from different senders
3. Each client checks own inbox for new messages

**Benefits**:
- Simplifies message sync flow
- Good for small groups (not expensive to store copies)
- Used by WeChat (500 member limit)

**Limitation**: Not suitable for large groups (too expensive to store copies)

### Online Presence

#### User Login Flow
- WebSocket connection established
- Online status and `last_active_at` saved in KV store
- Presence indicator shows user as online

#### User Logout Flow
- Online status changed to offline in KV store
- Presence indicator shows user as offline

#### User Disconnection Handling
**Problem**: Frequent disconnect/reconnect causes poor UX
**Solution**: Heartbeat mechanism

**Heartbeat Process**:
- Client sends heartbeat every 5 seconds
- If no heartbeat within 30 seconds, user marked offline
- Prevents status changes during brief disconnections

#### Online Status Fanout
**Process**:
- Publish-subscribe model
- Each friend pair maintains a channel
- Status changes published to friend channels
- Friends subscribe to status updates via WebSocket

**Limitation**: Expensive for large groups
**Solution**: Fetch status only when entering group or refreshing friend list

## Step 4: Wrap Up

### System Summary
- **Architecture**: WebSocket for real-time communication
- **Components**: Chat servers, presence servers, push notifications, KV stores, API servers
- **Features**: One-on-one and group chat, online presence, multiple devices

### Additional Talking Points

#### Media Support
- **Challenge**: Photos/videos significantly larger than text
- **Topics**: Compression, cloud storage, thumbnails

#### End-to-End Encryption
- **Example**: WhatsApp implementation
- **Benefit**: Only sender and recipient can read messages

#### Performance Optimizations
- **Client-side Caching**: Reduce data transfer
- **Geographic Distribution**: Better load times (Slack's approach)
- **Error Handling**: Chat server failures, message retry mechanisms

#### Error Handling
- **Chat Server Failure**: Service discovery provides new server
- **Message Resend**: Retry and queuing mechanisms

### Key Metrics
- **Concurrent Connections**: Per server capacity
- **Message Delivery Latency**: Real-time performance
- **Online Presence Accuracy**: Heartbeat effectiveness
- **Cross-Device Sync**: Message consistency

---

*Next: Chapter 13 - Design a Search Autocomplete System*
