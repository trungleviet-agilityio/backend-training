# Fake Twitter API Data Model Design

## 1. Overview
The Fake Twitter API System uses a centralized data model following relational database best practices and social media patterns. The system supports user authentication, post creation, and comment threading with clear boundaries and extensibility for future growth.

**Core Features:**
- User registration and authentication
- Post creation and interaction
- Comment threading and replies
- JWT-based session management
- Role-based access control

## 2. Design Principles
The Fake Twitter API System uses a centralized data model following relational database best practices. All modules share the same PostgreSQL database schema with clear boundaries and extensibility for future growth.

**Key Design Principles:**
- **Relationship-Driven**: Models follow the blog post pattern (User → Post → Comment)
- **Scalable Authentication**: JWT tokens with refresh token rotation and session management
- **Soft Deletes**: All entities support soft deletion for data integrity
- **Security First**: Password hashing, input validation, and SQL injection prevention
- **Normalized Structure**: Separated roles from users for permission management
- **Threading Control**: Depth-limited comment threading to prevent infinite recursion

## 3. ERD
**D2 Diagram Source Code:** [erd-design.d2](./erd-design.d2)

## 4. Core Entities

### **User Management**
**Users table:** Contains core user account information (uuid, email, username, password_hash, first_name, last_name, bio, avatar_url, role_uuid, is_active, email_verified, timestamps, soft_delete)

**Roles table:** Contains role definitions with permissions (uuid, name, description, permissions, timestamps) - normalized for security and extensibility

### **Authentication Management**
**Auth Sessions table:** JWT refresh token management (uuid, user_uuid, refresh_token_hash, expires_at, is_active, timestamps)

**Auth Password Resets table:** Secure password reset functionality (uuid, user_uuid, token_hash, expires_at, is_used, timestamps)

### **Content Management**
**Posts table:** Contains tweet-like post content (uuid, content, author_uuid, likes_count, comments_count, is_published, timestamps, soft_delete)

**Comments table:** Contains comment/reply content with threading support (uuid, content, author_uuid, post_uuid, parent_uuid, depth_level, likes_count, timestamps, soft_delete)

## 5. Relationship Analysis

### **Adjacency Matrix**

| Entity | users | roles | posts | comments | auth_sessions | auth_password_resets |
|--------|-------|-------|-------|----------|---------------|---------------------|
| **users** | - | N:1 | 1:N | 1:N | 1:N | 1:N |
| **roles** | 1:N | - | - | - | - | - |
| **posts** | N:1 | - | - | 1:N | - | - |
| **comments** | N:1 | - | N:1 | 1:N* | - | - |
| **auth_sessions** | N:1 | - | - | - | - | - |
| **auth_password_resets** | N:1 | - | - | - | - | - |

**Legend:**
- **1:N**: Row table has one, column table has many
- **N:1**: Row table has many, column table has one
- **1:N\***: Self-referencing relationship (comment threading)

### **Relationship Patterns**

#### **1. User Identity Structure**
```
Role (1) → User (N)
```

#### **2. Authentication Flow**
```
User (1) → AuthSession (N)
User (1) → AuthPasswordReset (N)
```

#### **3. Content Hierarchy (Blog Post Pattern)**
```
User (1) → Post (N) → Comment (N)
Comment (1) → Comment (N) [Self-referencing with depth limit]
```

#### **4. Has-Many-Through Relationship**
```
User → Comments (through Posts): User has many comments through their posts
```

## 6. Data Flow Analysis

### **Primary Data Flow Paths**

#### **1. User Registration & Authentication Flow**
```
User Registration → Role Assignment → JWT Token Generation → Session Tracking
```

#### **2. Content Creation Flow**
```
User Authentication → Post Creation → Comment Creation → Comment Threading (with depth limit)
```

#### **3. Has-Many-Through Relationship Flow**
```
User → Posts → Comments (Get all comments by user through their posts)
User → Comments → Replies (Get all replies to user's comments)
```

### **Advanced Query Patterns**

#### **1. User Feed Generation**
```sql
-- Get user's timeline (posts + comments)
WITH user_activity AS (
  SELECT 'post' as type, uuid, content, created_at, author_uuid
  FROM posts WHERE author_uuid = :user_uuid AND deleted_at IS NULL
  UNION ALL
  SELECT 'comment' as type, uuid, content, created_at, author_uuid
  FROM comments WHERE author_uuid = :user_uuid AND deleted_at IS NULL
)
SELECT * FROM user_activity ORDER BY created_at DESC;
```

#### **2. Threaded Comment System**
```sql
-- Get threaded comments with depth limit
WITH RECURSIVE comment_tree AS (
  SELECT *, 0 as depth FROM comments
  WHERE post_uuid = :post_uuid AND parent_uuid IS NULL AND deleted_at IS NULL
  UNION ALL
  SELECT c.*, ct.depth + 1 FROM comments c
  JOIN comment_tree ct ON c.parent_uuid = ct.uuid
  WHERE c.deleted_at IS NULL AND ct.depth < 5
)
SELECT * FROM comment_tree ORDER BY depth, created_at;
```

#### **3. Has-Many-Through: User Comments via Posts**
```sql
-- Get all comments on user's posts (has-many-through relationship)
SELECT c.*, p.content as post_content, u.username as commenter
FROM comments c
JOIN posts p ON c.post_uuid = p.uuid
JOIN users u ON c.author_uuid = u.uuid
WHERE p.author_uuid = :user_uuid
  AND c.deleted_at IS NULL
  AND p.deleted_at IS NULL
ORDER BY c.created_at DESC;
```

## 7. Performance Optimization Strategies

### **1. Essential Indexes**
```sql
-- Authentication indexes
CREATE INDEX idx_auth_sessions_user_uuid ON auth_sessions(user_uuid);
CREATE INDEX idx_auth_sessions_expires_at ON auth_sessions(expires_at);
CREATE INDEX idx_auth_password_resets_user_uuid ON auth_password_resets(user_uuid);

-- Content indexes
CREATE INDEX idx_posts_author_uuid ON posts(author_uuid);
CREATE INDEX idx_comments_post_uuid ON comments(post_uuid);
CREATE INDEX idx_comments_parent_uuid ON comments(parent_uuid);
CREATE INDEX idx_comments_author_uuid ON comments(author_uuid);

-- Soft delete indexes (partial indexes for performance)
CREATE INDEX idx_posts_active ON posts(uuid) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_active ON comments(uuid) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(uuid) WHERE deleted_at IS NULL;
```

### **2. Unique Constraints for Data Integrity**
```sql
-- Ensure unique usernames and emails
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);

-- Ensure unique role names
ALTER TABLE roles ADD CONSTRAINT unique_role_name UNIQUE (name);

-- Prevent infinite threading depth
ALTER TABLE comments ADD CONSTRAINT check_depth_level CHECK (depth_level <= 5);
```

### **3. Security and Performance Constraints**
```sql
-- Foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_role_uuid
  FOREIGN KEY (role_uuid) REFERENCES roles(uuid);

ALTER TABLE posts ADD CONSTRAINT fk_posts_author_uuid
  FOREIGN KEY (author_uuid) REFERENCES users(uuid);

ALTER TABLE comments ADD CONSTRAINT fk_comments_author_uuid
  FOREIGN KEY (author_uuid) REFERENCES users(uuid);

ALTER TABLE comments ADD CONSTRAINT fk_comments_post_uuid
  FOREIGN KEY (post_uuid) REFERENCES posts(uuid);

ALTER TABLE comments ADD CONSTRAINT fk_comments_parent_uuid
  FOREIGN KEY (parent_uuid) REFERENCES comments(uuid);

ALTER TABLE auth_sessions ADD CONSTRAINT fk_auth_sessions_user_uuid
  FOREIGN KEY (user_uuid) REFERENCES users(uuid);

ALTER TABLE auth_password_resets ADD CONSTRAINT fk_auth_password_resets_user_uuid
  FOREIGN KEY (user_uuid) REFERENCES users(uuid);
```

## 8. Implementation Notes

### **Authentication Security**
- **Password Hashing**: bcrypt with salt rounds ≥ 12
- **JWT Tokens**: RS256 algorithm with key rotation
- **Refresh Tokens**: Hashed storage, automatic expiration cleanup
- **Session Management**: Multi-device support with proper invalidation

### **Data Integrity**
- **Soft Deletes**: All user-generated content supports recovery
- **Foreign Key Constraints**: Maintain referential integrity
- **Validation**: Input validation at application and database levels
- **Threading Control**: Maximum depth of 5 levels for comments

### **Performance Considerations**
- **Connection Pooling**: Database connection optimization
- **Query Optimization**: Proper indexing for social media patterns
- **Caching Strategy**: Response caching for public endpoints
- **Pagination**: All list endpoints support cursor-based pagination
