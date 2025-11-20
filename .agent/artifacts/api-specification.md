# API Specification Document
## Personal Task Management System - RESTful API

**Version:** 1.0  
**Last Updated:** 2025-11-20  
**Base URL:** `http://localhost:3000/api` (Development)  
**Protocol:** HTTP/HTTPS  
**Format:** JSON  

---

## Table of Contents
1. [Authentication](#authentication)
2. [Tasks](#tasks)
3. [Tags](#tags)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

---

## General Information

### Request Headers
```
Content-Type: application/json
Cookie: token=<jwt_token> (for authenticated requests)
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": [ ... ]
  }
}
```

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Validation Rules:**
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain uppercase, lowercase, number, special character
- `fullName`: Required, min 2 characters, max 255 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2025-11-20T14:59:57Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
```json
// 409 Conflict - Email already exists
{
  "success": false,
  "error": {
    "message": "Email already registered",
    "code": "EMAIL_EXISTS"
  }
}

// 422 Unprocessable Entity - Validation error
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "password",
        "message": "Password must contain at least one uppercase letter"
      }
    ]
  }
}
```

---

### POST /api/auth/login
Authenticate user and create session.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Sets Cookie:**
```
Set-Cookie: token=<jwt_token>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**Error Responses:**
```json
// 401 Unauthorized - Invalid credentials
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "code": "INVALID_CREDENTIALS"
  }
}

// 429 Too Many Requests - Rate limit exceeded
{
  "success": false,
  "error": {
    "message": "Too many login attempts. Please try again in 15 minutes.",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

---

### POST /api/auth/logout
End user session.

**Authentication:** Required

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Clears Cookie:**
```
Set-Cookie: token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
```

---

### GET /api/auth/me
Get current authenticated user information.

**Authentication:** Required

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2025-11-20T14:59:57Z"
    }
  }
}
```

**Error Response:**
```json
// 401 Unauthorized
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED"
  }
}
```

---

## Tasks

### GET /api/tasks
Get all tasks for authenticated user with optional filtering, sorting, and pagination.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Filter by status (todo, in_progress, completed) | `?status=todo` |
| priority | string | Filter by priority (low, medium, high) | `?priority=high` |
| tags | string[] | Filter by tag IDs (comma-separated) | `?tags=tag1,tag2` |
| tagMode | string | Tag filter mode (and, or) | `?tagMode=and` |
| search | string | Search in title and description | `?search=meeting` |
| startDate | string | Filter tasks starting after date | `?startDate=2025-11-20` |
| dueDate | string | Filter tasks due before date | `?dueDate=2025-12-31` |
| sortBy | string | Sort field (dueDate, createdAt, priority, title) | `?sortBy=dueDate` |
| sortOrder | string | Sort direction (asc, desc) | `?sortOrder=asc` |
| page | number | Page number (1-indexed) | `?page=1` |
| limit | number | Items per page (max 100) | `?limit=20` |

**Example Request:**
```
GET /api/tasks?status=todo&sortBy=dueDate&sortOrder=asc&page=1&limit=20
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "userId": "660e8400-e29b-41d4-a716-446655440000",
        "title": "Complete project documentation",
        "description": "Write technical specs and user guide",
        "status": "todo",
        "priority": "high",
        "startDate": "2025-11-20T09:00:00Z",
        "dueDate": "2025-11-25T17:00:00Z",
        "createdAt": "2025-11-20T14:59:57Z",
        "updatedAt": "2025-11-20T14:59:57Z",
        "completedAt": null,
        "tags": [
          {
            "id": "770e8400-e29b-41d4-a716-446655440000",
            "name": "work",
            "color": "#3b82f6"
          },
          {
            "id": "880e8400-e29b-41d4-a716-446655440000",
            "name": "documentation",
            "color": "#10b981"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### POST /api/tasks
Create a new task.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write technical specs and user guide",
  "priority": "high",
  "status": "todo",
  "startDate": "2025-11-20T09:00:00Z",
  "dueDate": "2025-11-25T17:00:00Z",
  "tags": ["work", "documentation"]
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `description`: Optional, max 2000 characters
- `priority`: Optional, enum (low, medium, high), default: medium
- `status`: Optional, enum (todo, in_progress, completed), default: todo
- `startDate`: Optional, ISO 8601 datetime
- `dueDate`: Optional, ISO 8601 datetime, must be after startDate
- `tags`: Optional, array of tag names (max 10), creates tags if not exist

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "660e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write technical specs and user guide",
      "status": "todo",
      "priority": "high",
      "startDate": "2025-11-20T09:00:00Z",
      "dueDate": "2025-11-25T17:00:00Z",
      "createdAt": "2025-11-20T14:59:57Z",
      "updatedAt": "2025-11-20T14:59:57Z",
      "completedAt": null,
      "tags": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440000",
          "name": "work",
          "color": "#3b82f6"
        }
      ]
    }
  }
}
```

**Error Response:**
```json
// 422 Unprocessable Entity
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "dueDate",
        "message": "Due date must be after start date"
      }
    ]
  }
}
```

---

### GET /api/tasks/:id
Get a single task by ID.

**Authentication:** Required

**URL Parameters:**
- `id`: Task UUID

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "660e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write technical specs and user guide",
      "status": "todo",
      "priority": "high",
      "startDate": "2025-11-20T09:00:00Z",
      "dueDate": "2025-11-25T17:00:00Z",
      "createdAt": "2025-11-20T14:59:57Z",
      "updatedAt": "2025-11-20T14:59:57Z",
      "completedAt": null,
      "tags": [...]
    }
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "message": "Task not found",
    "code": "TASK_NOT_FOUND"
  }
}

// 403 Forbidden - Task belongs to another user
{
  "success": false,
  "error": {
    "message": "Access denied",
    "code": "FORBIDDEN"
  }
}
```

---

### PATCH /api/tasks/:id
Update an existing task.

**Authentication:** Required

**URL Parameters:**
- `id`: Task UUID

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "medium",
  "startDate": "2025-11-21T09:00:00Z",
  "dueDate": "2025-11-26T17:00:00Z",
  "tags": ["work", "urgent"]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Updated title",
      "updatedAt": "2025-11-20T15:30:00Z",
      ...
    }
  }
}
```

**Special Behavior:**
- Setting `status` to "completed" automatically sets `completedAt` to current timestamp
- Changing status from "completed" to other values clears `completedAt`
- `updatedAt` is automatically updated

---

### DELETE /api/tasks/:id
Delete a task.

**Authentication:** Required

**URL Parameters:**
- `id`: Task UUID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response:**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "message": "Task not found",
    "code": "TASK_NOT_FOUND"
  }
}
```

---

## Tags

### GET /api/tags
Get all tags for authenticated user with task counts.

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "userId": "660e8400-e29b-41d4-a716-446655440000",
        "name": "work",
        "color": "#3b82f6",
        "createdAt": "2025-11-20T14:59:57Z",
        "taskCount": 12
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "name": "personal",
        "color": "#10b981",
        "createdAt": "2025-11-20T15:00:00Z",
        "taskCount": 5
      }
    ]
  }
}
```

---

### POST /api/tags
Create a new tag.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "urgent",
  "color": "#ef4444"
}
```

**Validation Rules:**
- `name`: Required, max 30 characters, unique per user (case-insensitive)
- `color`: Optional, valid hex color code (e.g., #FF5733)

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "tag": {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "userId": "660e8400-e29b-41d4-a716-446655440000",
      "name": "urgent",
      "color": "#ef4444",
      "createdAt": "2025-11-20T15:30:00Z"
    }
  }
}
```

**Error Response:**
```json
// 409 Conflict - Tag name already exists
{
  "success": false,
  "error": {
    "message": "Tag name already exists",
    "code": "TAG_EXISTS"
  }
}
```

---

### PATCH /api/tags/:id
Update a tag.

**Authentication:** Required

**URL Parameters:**
- `id`: Tag UUID

**Request Body (all fields optional):**
```json
{
  "name": "super-urgent",
  "color": "#dc2626"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tag": {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "name": "super-urgent",
      "color": "#dc2626",
      "updatedAt": "2025-11-20T16:00:00Z"
    }
  }
}
```

**Note:** Renaming a tag updates it for all associated tasks.

---

### DELETE /api/tags/:id
Delete a tag.

**Authentication:** Required

**URL Parameters:**
- `id`: Tag UUID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

**Note:** Deleting a tag removes it from all associated tasks (cascade delete).

---

## Error Handling

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error"
      }
    ]
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required or invalid token |
| FORBIDDEN | 403 | User doesn't have access to resource |
| VALIDATION_ERROR | 422 | Request validation failed |
| EMAIL_EXISTS | 409 | Email already registered |
| TAG_EXISTS | 409 | Tag name already exists for user |
| TASK_NOT_FOUND | 404 | Task doesn't exist or user doesn't own it |
| TAG_NOT_FOUND | 404 | Tag doesn't exist or user doesn't own it |
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

### Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/auth/login | 5 requests | 15 minutes |
| POST /api/auth/register | 3 requests | 1 hour |
| All other endpoints | 100 requests | 15 minutes |

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637424000
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "message": "Rate limit exceeded. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 900
  }
}
```

---

## Authentication Flow

### JWT Token
- **Algorithm:** HS256
- **Expiration:** 7 days
- **Storage:** HTTP-only cookie
- **Payload:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "iat": 1637424000,
  "exp": 1638028800
}
```

### Protected Endpoints
All endpoints except `/api/auth/register` and `/api/auth/login` require authentication.

**Authentication Header:**
```
Cookie: token=<jwt_token>
```

---

**API Version:** 1.0  
**Last Updated:** 2025-11-20  
**Maintained By:** Backend Team
