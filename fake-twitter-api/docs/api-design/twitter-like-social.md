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
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/..."
}
```

### Error Format
```json
{
  "success": false,
  "message": "Human readable message",
  "errors": ["Error details"],
  "statusCode": 400,
  "timestamp": "...",
  "path": "/api/v1/..."
}
```

### Pagination
Query: `?page=1&limit=20`
```json
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "...",
  "path": "/api/v1/posts?page=1&limit=20"
}
```

---

## 5. Post Management Module

### Permissions
- **Admin**: Full access (CRUD any post)
- **Moderator**: CRUD any post
- **User**: CRUD own posts, view published/own posts

### Endpoints

| Method | Endpoint | Purpose | Auth Required | Status Codes |
|--------|----------|---------|--------------|--------------|
| GET | `/api/v1/posts` | Get all posts | Yes | 200, 401, 500 |
| POST | `/api/v1/posts` | Create new post | Yes | 201, 400, 401, 403 |
| GET | `/api/v1/posts/{uuid}` | Get single post | Yes | 200, 401, 404 |
| PATCH | `/api/v1/posts/{uuid}` | Update post | Yes | 200, 400, 401, 403, 404 |
| DELETE | `/api/v1/posts/{uuid}` | Delete post | Yes | 200, 401, 403, 404 |

#### GET /api/v1/posts
**Request Example:**
```
GET /api/v1/posts?page=1&limit=20
Authorization: Bearer <access_token>
```
**Success Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "uuid": "...",
        "content": "Hello, fake Twitter!",
        "author": { "uuid": "...", "username": "johndoe", "firstName": "John", "lastName": "Doe", "avatarUrl": "..." },
        "stats": { "likesCount": 10, "commentsCount": 5 },
        "isPublished": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T11:30:00Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
  },
  "timestamp": "...",
  "path": "/api/v1/posts?page=1&limit=20"
}
```
**Error Response (Unauthorized):**
```json
{
  "success": false,
  "message": "No valid authorization header",
  "errors": ["No valid authorization header"],
  "statusCode": 401,
  "timestamp": "...",
  "path": "/api/v1/posts?page=1&limit=20"
}
```

#### POST /api/v1/posts
**Request Example:**
```json
{
  "content": "Hello, fake Twitter!",
  "isPublished": true
}
```
**Success Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "uuid": "...",
      "content": "Hello, fake Twitter!",
      "author": { "uuid": "...", "username": "johndoe", "firstName": "John", "lastName": "Doe" },
      "stats": { "likesCount": 0, "commentsCount": 0 },
      "isPublished": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "timestamp": "...",
  "path": "/api/v1/posts"
}
```

#### Field Descriptions (Post)
- `uuid`: string, post ID
- `content`: string, post content
- `author`: object, post author (uuid, username, firstName, lastName, avatarUrl)
- `stats`: object, likesCount (int), commentsCount (int)
- `isPublished`: boolean
- `createdAt`, `updatedAt`: ISO date strings

---

## 6. Comment Management Module

### Permissions
- **Admin/Moderator**: CRUD any comment
- **User**: CRUD own comments, create on any post

### Endpoints
| Method | Endpoint | Purpose | Auth Required | Status Codes |
|--------|----------|---------|--------------|--------------|
| GET | `/api/v1/posts/{uuid}/comments` | Get post comments | Yes | 200, 401, 404 |
| POST | `/api/v1/posts/{uuid}/comments` | Create comment | Yes | 201, 400, 401, 403, 404 |
| PATCH | `/api/v1/comments/{uuid}` | Update comment | Yes | 200, 400, 401, 403, 404 |
| DELETE | `/api/v1/comments/{uuid}` | Delete comment | Yes | 200, 401, 403, 404 |
| GET | `/api/v1/comments/{uuid}/replies` | Get comment replies | Yes | 200, 401, 404 |

#### GET /api/v1/posts/{uuid}/comments
**Request Example:**
```
GET /api/v1/posts/abc-123/comments?page=1&limit=20
Authorization: Bearer <access_token>
```
**Success Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "uuid": "...",
        "content": "Great post!",
        "author": { "uuid": "...", "username": "janedoe", "firstName": "Jane", "lastName": "Doe", "avatarUrl": "..." },
        "postUuid": "...",
        "parentUuid": null,
        "depthLevel": 0,
        "stats": { "likesCount": 0 },
        "replies": [],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
  },
  "timestamp": "...",
  "path": "/api/v1/posts/abc-123/comments?page=1&limit=20"
}
```
**Error Response (Not Found):**
```json
{
  "success": false,
  "message": "Post not found",
  "errors": ["Post not found"],
  "statusCode": 404,
  "timestamp": "...",
  "path": "/api/v1/posts/abc-123/comments?page=1&limit=20"
}
```

#### Field Descriptions (Comment)
- `uuid`: string, comment ID
- `content`: string, comment content
- `author`: object, comment author (uuid, username, firstName, lastName, avatarUrl)
- `postUuid`: string, post ID
- `parentUuid`: string or null, parent comment ID
- `depthLevel`: int, nesting level
- `stats`: object, likesCount (int)
- `replies`: array, nested replies
- `createdAt`, `updatedAt`: ISO date strings

---

## 7. Interactive API Documentation

- Visit [Swagger UI](http://localhost:5555/api/v1/docs) for live, interactive API docs and to try endpoints with authentication.

---

## 8. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

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
