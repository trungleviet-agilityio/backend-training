# Chat System Project

## Overview
Build a real-time chat system similar to WhatsApp, Facebook Messenger, Slack, or Discord. This project implements the concepts learned from Chapter 12 of the System Design Interview book.

## Features to Implement

### Core Features
- [ ] **One-on-One Chat**: Direct messaging between two users
- [ ] **Group Chat**: Group messaging (up to 100 members)
- [ ] **Real-time Messaging**: Instant message delivery
- [ ] **Online Presence**: Show online/offline status
- [ ] **Message History**: Store and retrieve chat history
- [ ] **Multi-device Support**: Sync across multiple devices

### Advanced Features
- [ ] **Push Notifications**: Notify users of new messages
- [ ] **Message Status**: Read receipts, delivery status
- [ ] **File Sharing**: Share images, documents, videos
- [ ] **Message Search**: Search through chat history
- [ ] **User Authentication**: Registration and login system
- [ ] **Message Encryption**: End-to-end encryption

## Technical Requirements

### System Design
- **Scale**: 50 million DAU, 1M concurrent connections
- **Message Size**: 100,000 characters maximum
- **Group Size**: Maximum 100 people per group
- **Platforms**: Web, mobile apps, smart TV
- **Latency**: < 100ms message delivery

### Architecture Components
1. **WebSocket Servers**: Real-time communication
2. **API Servers**: RESTful APIs for non-real-time operations
3. **Message Queue**: Asynchronous message processing
4. **Database**: Store messages and user data
5. **Cache**: Store active sessions and metadata
6. **Load Balancer**: Distribute WebSocket connections

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE devices (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_type ENUM('web', 'mobile', 'smart_tv'),
    push_id VARCHAR(255),
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

-- Conversations table (1-on-1 or group)
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY,
    type ENUM('direct', 'group') NOT NULL,
    name VARCHAR(100), -- For group chats
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation participants
CREATE TABLE conversation_participants (
    id BIGINT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_participant (conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id BIGINT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file', 'video'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation_time (conversation_id, created_at),
    INDEX idx_sender (sender_id)
);

-- Message status (read receipts)
CREATE TABLE message_status (
    id BIGINT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_status (message_id, user_id)
);
```

## Implementation Steps

### Phase 1: Basic Chat System
1. **Set up WebSocket server**
2. **Implement user authentication**
3. **Create one-on-one messaging**
4. **Add message persistence**
5. **Implement basic UI**

### Phase 2: Enhanced Features
1. **Add group chat functionality**
2. **Implement online presence**
3. **Add message status tracking**
4. **Create push notifications**

### Phase 3: Advanced Features
1. **Add file sharing**
2. **Implement message search**
3. **Add end-to-end encryption**
4. **Performance optimization**

## WebSocket Implementation

### Connection Management
```javascript
// WebSocket connection handling
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
    // Authenticate user
    const user = authenticateUser(req);
    ws.userId = user.id;

    // Store connection
    connections.set(user.id, ws);

    // Handle incoming messages
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        handleMessage(message, user);
    });

    // Handle disconnection
    ws.on('close', () => {
        connections.delete(user.id);
        updateUserStatus(user.id, 'offline');
    });
});
```

### Message Handling
```javascript
function handleMessage(message, user) {
    switch (message.type) {
        case 'chat':
            processChatMessage(message, user);
            break;
        case 'typing':
            broadcastTypingStatus(message, user);
            break;
        case 'presence':
            updateUserStatus(user.id, message.status);
            break;
    }
}
```

## API Endpoints

### Authentication
```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/logout      # User logout
```

### Conversations
```
GET  /api/v1/conversations           # Get user conversations
POST /api/v1/conversations           # Create new conversation
GET  /api/v1/conversations/{id}      # Get conversation details
POST /api/v1/conversations/{id}/join # Join group conversation
```

### Messages
```
GET  /api/v1/conversations/{id}/messages # Get message history
POST /api/v1/conversations/{id}/messages # Send message
PUT  /api/v1/messages/{id}/read          # Mark message as read
```

### Users
```
GET  /api/v1/users/search               # Search users
GET  /api/v1/users/{id}/profile         # Get user profile
PUT  /api/v1/users/{id}/profile         # Update user profile
```

## Technology Stack Suggestions

### Backend
- **Language**: Node.js (Express + Socket.io) or Python (Django + Channels)
- **Database**: PostgreSQL or MySQL
- **Cache**: Redis (for sessions and metadata)
- **Message Queue**: RabbitMQ or Redis
- **WebSocket**: Socket.io or native WebSocket

### Frontend
- **Framework**: React, Vue.js, or Angular
- **WebSocket Client**: Socket.io-client
- **UI Library**: Material-UI, Ant Design, or Bootstrap

### Mobile
- **React Native** or **Flutter** for cross-platform
- **Native iOS/Android** for platform-specific features

### Deployment
- **Container**: Docker
- **Cloud**: AWS, Google Cloud, or Azure
- **Load Balancer**: Nginx or cloud load balancer

## Performance Considerations

### WebSocket Optimization
- **Connection Pooling**: Manage WebSocket connections efficiently
- **Heartbeat**: Keep connections alive with periodic pings
- **Load Balancing**: Distribute WebSocket connections across servers

### Database Optimization
- **Message Pagination**: Load messages in chunks
- **Indexing**: Index on conversation_id and created_at
- **Sharding**: Shard by user_id for large scale

### Caching Strategy
- **Active Sessions**: Cache user sessions in Redis
- **Recent Messages**: Cache recent messages for fast access
- **User Status**: Cache online/offline status

## Real-time Features

### Online Presence
```javascript
// Update user status
function updateUserStatus(userId, status) {
    // Update database
    db.query('UPDATE users SET status = ?, last_active = NOW() WHERE id = ?', [status, userId]);

    // Broadcast to friends
    const friends = getUserFriends(userId);
    friends.forEach(friendId => {
        const connection = connections.get(friendId);
        if (connection) {
            connection.send(JSON.stringify({
                type: 'presence_update',
                userId: userId,
                status: status
            }));
        }
    });
}
```

### Message Delivery
```javascript
// Send message to conversation participants
function sendMessageToConversation(message, conversationId) {
    const participants = getConversationParticipants(conversationId);

    participants.forEach(participantId => {
        const connection = connections.get(participantId);
        if (connection) {
            // User is online - send via WebSocket
            connection.send(JSON.stringify({
                type: 'new_message',
                message: message
            }));
        } else {
            // User is offline - send push notification
            sendPushNotification(participantId, message);
        }
    });
}
```

## Security Considerations

### Authentication
- **JWT Tokens**: Secure authentication
- **Session Management**: Proper session handling
- **Rate Limiting**: Prevent abuse

### Message Security
- **Input Validation**: Sanitize message content
- **File Upload**: Validate file types and sizes
- **Encryption**: End-to-end encryption for sensitive messages

### Privacy
- **Message Privacy**: Ensure messages are only visible to participants
- **User Privacy**: Protect user information
- **Data Retention**: Implement message retention policies

## Testing Strategy

### Unit Tests
- Message processing logic
- Authentication functions
- Database operations

### Integration Tests
- WebSocket message flow
- API endpoint testing
- Database integration

### Load Tests
- Concurrent WebSocket connections
- Message throughput
- Database performance under load

### Real-time Testing
- Message delivery latency
- Connection stability
- Cross-device synchronization

## Monitoring and Analytics

### Key Metrics
- **Active Connections**: Number of concurrent WebSocket connections
- **Message Latency**: Time from send to delivery
- **Error Rate**: Failed message deliveries
- **User Engagement**: Messages per user per day

### Logging
- **Message Logs**: Track message flow for debugging
- **Error Logs**: Log connection and processing errors
- **Performance Logs**: Monitor system performance

## Next Steps
1. Choose your technology stack
2. Set up development environment
3. Start with Phase 1 implementation
4. Add real-time features gradually
5. Implement advanced features
6. Deploy and monitor

## Key Concepts from Chapter 12

### WebSocket vs HTTP
- **WebSocket**: Bi-directional, persistent connection for real-time communication
- **HTTP**: Request-response for non-real-time operations

### Message Flow
1. **Sender**: WebSocket → Message Queue → Database
2. **Receiver**: Database → Message Queue → WebSocket → Client

### Online Presence
- **Heartbeat Mechanism**: Periodic status updates
- **Status Fanout**: Publish-subscribe model for status changes

### Multi-Device Sync
- **Message ID Tracking**: Each device tracks latest message ID
- **Delta Sync**: Only sync new messages

## Resources
- [Chapter 12 Notes](../../reading/system-design-interview/chapter-12-design-a-chat-system/notes.md)
- [System Design Interview Book](https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119)
- [Socket.io Documentation](https://socket.io/docs/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
