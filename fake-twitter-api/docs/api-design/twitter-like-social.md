# Fake Twitter API Design Documentation

## 1. Overview

A Twitter-like social media API built with NestJS, focusing on core functionality with simplified models.

**Authentication:** JWT-based with refresh tokens
**Access Control:** Role-based (admin, user, moderator)
**Base URL:** `https://api.fake-twitter.com`
**Versioning:** URL-based (`/api/v1/`)

**Core Models:**
- `users` - User accounts and profiles
- `roles` - User roles and permissions
- `posts` - Tweet-like posts
- `comments` - Post comments with threading
- `auth_sessions` - JWT session management
- `auth_password_resets` - Password reset tokens

## 2. API Conventions

### Authentication
```
Authorization: Bearer <access_token>
```
- Access token expires after 15 minutes
- Refresh token expires after 7 days

### Response Format
```json
{
  "success": true,
  "data": <response_data>,
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Pagination
Query: `?page=1&limit=20`
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 3. Authentication Module

| Method | Endpoint | Purpose | Request | Response | Auth Required |
|--------|----------|---------|---------|----------|---------------|
| POST | `/api/v1/auth/register` | User registration | `{ "email": "john@example.com", "username": "johndoe", "password": "SecurePass123!", "firstName": "John", "lastName": "Doe" }` | `{ "success": true, "data": { "access_token": "eyJhbGci...", "refresh_token": "eyJhbGci...", "user": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "email": "john@example.com", "username": "johndoe", "firstName": "John", "lastName": "Doe", "role": { "name": "user" } } } }` | No |
| POST | `/api/v1/auth/login` | User login | `{ "email": "john@example.com", "password": "SecurePass123!" }` | `{ "success": true, "data": { "access_token": "eyJhbGci...", "refresh_token": "eyJhbGci...", "user": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "username": "johndoe", "firstName": "John", "lastName": "Doe", "role": { "name": "user" } } } }` | No |
| POST | `/api/v1/auth/refresh` | Refresh tokens | `{ "refresh_token": "eyJhbGci..." }` | `{ "success": true, "data": { "access_token": "eyJhbGci...", "refresh_token": "eyJhbGci..." } }` | No |
| POST | `/api/v1/auth/logout` | User logout | `{}` | `{ "success": true, "data": { "message": "Successfully logged out" } }` | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | `{ "email": "john@example.com" }` | `{ "success": true, "data": { "message": "Password reset email sent" } }` | No |
| POST | `/api/v1/auth/reset-password` | Reset password | `{ "token": "reset_token_here", "password": "NewSecurePass123!" }` | `{ "success": true, "data": { "message": "Password reset successfully" } }` | No |

## 4. User Management Module

| Method | Endpoint | Purpose | Request | Response | Auth Required |
|--------|----------|---------|---------|----------|---------------|
| GET | `/api/v1/users/{uuid}` | Get user profile | N/A | `{ "success": true, "data": { "user": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "username": "johndoe", "firstName": "John", "lastName": "Doe", "bio": "Software developer", "avatar_url": "https://cdn.example.com/avatar.jpg", "role": { "name": "user" }, "stats": { "posts_count": 42, "comments_count": 156 }, "created_at": "2024-01-15T10:30:00Z" } } }` | Yes |
| PATCH | `/api/v1/users/{uuid}` | Update user profile | `{ "firstName": "John", "lastName": "Smith", "bio": "Senior Software Developer" }` | `{ "success": true, "data": { "user": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "username": "johndoe", "firstName": "John", "lastName": "Smith", "bio": "Senior Software Developer", "updated_at": "2024-01-15T11:30:00Z" } } }` | Yes |
| GET | `/api/v1/users/{uuid}/posts` | Get user's posts | N/A | `{ "success": true, "data": [{ "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Hello, fake Twitter!", "author": { "username": "johndoe", "firstName": "John" }, "stats": { "likes_count": 10, "comments_count": 5 }, "created_at": "2024-01-15T10:30:00Z" }], "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 } }` | Yes |
| GET | `/api/v1/users/{uuid}/comments` | Get user's comments | N/A | `{ "success": true, "data": [{ "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Great post!", "post": { "uuid": "123e4567-e89b-12d3-a456-426614174002", "content": "Original post...", "author": { "username": "janedoe" } }, "stats": { "likes_count": 3 }, "created_at": "2024-01-15T10:30:00Z" }], "meta": { "page": 1, "limit": 20, "total": 156, "totalPages": 8 } }` | Yes |

## 5. Post Management Module

| Method | Endpoint | Purpose | Request | Response | Auth Required |
|--------|----------|---------|---------|----------|---------------|
| GET | `/api/v1/posts` | Get all posts | N/A | `{ "success": true, "data": [{ "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Hello, fake Twitter!", "author": { "uuid": "123e4567-e89b-12d3-a456-426614174001", "username": "johndoe", "firstName": "John", "lastName": "Doe", "avatar_url": "https://cdn.example.com/avatar.jpg" }, "stats": { "likes_count": 10, "comments_count": 5 }, "is_published": true, "created_at": "2024-01-15T10:30:00Z" }], "meta": { "page": 1, "limit": 20, "total": 500, "totalPages": 25 } }` | Yes |
| POST | `/api/v1/posts` | Create new post | `{ "content": "Hello, fake Twitter!", "is_published": true }` | `{ "success": true, "data": { "post": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Hello, fake Twitter!", "author": { "uuid": "123e4567-e89b-12d3-a456-426614174001", "username": "johndoe", "firstName": "John", "lastName": "Doe" }, "stats": { "likes_count": 0, "comments_count": 0 }, "is_published": true, "created_at": "2024-01-15T10:30:00Z" } } }` | Yes |
| GET | `/api/v1/posts/{uuid}` | Get single post | N/A | `{ "success": true, "data": { "post": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Hello, fake Twitter!", "author": { "username": "johndoe", "firstName": "John", "lastName": "Doe", "avatar_url": "https://cdn.example.com/avatar.jpg" }, "stats": { "likes_count": 10, "comments_count": 5 }, "is_published": true, "created_at": "2024-01-15T10:30:00Z" } } }` | Yes |
| PATCH | `/api/v1/posts/{uuid}` | Update post | `{ "content": "Updated post content!", "is_published": true }` | `{ "success": true, "data": { "post": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Updated post content!", "updated_at": "2024-01-15T11:30:00Z" } } }` | Yes |
| DELETE | `/api/v1/posts/{uuid}` | Delete post | N/A | `{ "success": true, "data": { "message": "Post deleted successfully" } }` | Yes |

## 6. Comment Management Module

| Method | Endpoint | Purpose | Request | Response | Auth Required |
|--------|----------|---------|---------|----------|---------------|
| GET | `/api/v1/posts/{uuid}/comments` | Get post comments | N/A | `{ "success": true, "data": [{ "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Great post!", "author": { "uuid": "123e4567-e89b-12d3-a456-426614174001", "username": "janedoe", "firstName": "Jane", "lastName": "Doe", "avatar_url": "https://cdn.example.com/avatar.jpg" }, "post_uuid": "123e4567-e89b-12d3-a456-426614174002", "parent_uuid": null, "depth_level": 0, "stats": { "likes_count": 0 }, "replies": [], "created_at": "2024-01-15T10:30:00Z" }], "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 } }` | Yes |
| POST | `/api/v1/posts/{uuid}/comments` | Create comment | `{ "content": "Great post!", "parent_uuid": null }` | `{ "success": true, "data": { "comment": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Great post!", "author": { "uuid": "123e4567-e89b-12d3-a456-426614174001", "username": "janedoe", "firstName": "Jane", "lastName": "Doe" }, "post_uuid": "123e4567-e89b-12d3-a456-426614174002", "parent_uuid": null, "depth_level": 0, "stats": { "likes_count": 0 }, "created_at": "2024-01-15T10:30:00Z" } } }` | Yes |
| PATCH | `/api/v1/comments/{uuid}` | Update comment | `{ "content": "Updated comment content!" }` | `{ "success": true, "data": { "comment": { "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Updated comment content!", "updated_at": "2024-01-15T11:30:00Z" } } }` | Yes |
| DELETE | `/api/v1/comments/{uuid}` | Delete comment | N/A | `{ "success": true, "data": { "message": "Comment deleted successfully" } }` | Yes |
| GET | `/api/v1/comments/{uuid}/replies` | Get comment replies | N/A | `{ "success": true, "data": [{ "uuid": "123e4567-e89b-12d3-a456-426614174000", "content": "Reply to comment", "author": { "username": "bobsmith", "firstName": "Bob" }, "parent_uuid": "123e4567-e89b-12d3-a456-426614174001", "depth_level": 1, "stats": { "likes_count": 2 }, "created_at": "2024-01-15T10:35:00Z" }], "meta": { "page": 1, "limit": 20, "total": 3, "totalPages": 1 } }` | Yes |

## 7. Key Relationships Implementation

### **Has-Many-Through: User → Comments (through Posts)**
**Endpoint:** `GET /api/v1/users/{uuid}/comments`

This implements the relationship described in the blog post where "Users resource is related to Comments resource through Posts resource. This relation enables us to get all comments written by one user."

### **Comment Threading**
**Self-referencing relationship:** `comments.parent_uuid → comments.uuid`
- `depth_level` prevents infinite nesting
- `parent_uuid = null` for top-level comments
- Replies reference parent comment via `parent_uuid`

### **Role-Based Access Control**
**Relationship:** `roles.uuid → users.role_uuid`
- **admin**: Full system access
- **user**: Standard user permissions
- **moderator**: Content moderation permissions

## 8. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

## 9. Implementation Notes

### Security
- JWT tokens with RS256 algorithm
- Password hashing with bcrypt
- Input validation using class-validator
- Role-based access control with guards

### Database
- PostgreSQL with UUID primary keys
- Soft deletes for data integrity
- Proper indexing for performance
- Foreign key constraints

### Features
- Comment threading with depth control
- Soft deletes for all entities
- Role-based permissions
- Session management with refresh tokens
