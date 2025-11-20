# Technical Architecture Document
## Personal Task Management System

**Document Version:** 1.0  
**Last Updated:** 2025-11-20  
**Architecture Owner:** Solutions Architect  

---

## 1. Architecture Overview

### 1.1 System Architecture Pattern
**Monolithic Full-Stack Application** with clear separation of concerns:
- Frontend (Next.js App Router)
- Backend API (Hono.js integrated)
- Database (PostgreSQL)
- ORM Layer (Drizzle)

### 1.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│                    (React/Next.js Frontend)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Next.js Application                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Router (Frontend)                    │  │
│  │  - Pages (app directory)                             │  │
│  │  - Components (shadcn/ui)                            │  │
│  │  - Client State Management                           │  │
│  │  - RPC Client (Hono Client)                          │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │              API Routes (Backend)                     │  │
│  │  - Hono.js Router                                    │  │
│  │  - Authentication Middleware                         │  │
│  │  - Business Logic                                    │  │
│  │  - Validation Layer                                  │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │              Data Access Layer                        │  │
│  │  - Drizzle ORM                                       │  │
│  │  - Database Queries                                  │  │
│  │  - Schema Definitions                                │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │ TCP/IP
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   PostgreSQL Database                        │
│                     (Docker Container)                       │
│  - Users Table                                              │
│  - Tasks Table                                              │
│  - Tags Table                                               │
│  - TaskTags Junction Table                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Details

### 2.1 Frontend Stack

#### Next.js (App Router)
- **Version:** Latest (15.x recommended)
- **Routing:** App Router (app directory)
- **Rendering:** Server Components + Client Components
- **Features Used:**
  - Server Actions (for mutations)
  - Route Handlers (API routes)
  - Middleware (authentication)
  - Layouts (shared UI)
  - Loading/Error states

**Directory Structure:**
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx (main task list)
│   └── tasks/
│       └── [id]/
│           └── page.tsx
├── api/
│   └── [[...route]]/
│       └── route.ts (Hono integration)
├── layout.tsx
└── globals.css
```

#### shadcn/ui Components
- Button, Input, Form, Dialog, Sheet, Popover
- Select, Checkbox, Switch, Card, Badge, Avatar
- Calendar, DatePicker, Command, Toast, Table

#### State Management
- **Server State:** React Query / TanStack Query
- **Client State:** React hooks (useState, useReducer)

---

### 2.2 Backend Stack

#### Hono.js
- **Version:** Latest (4.x)
- **Integration:** Next.js API Routes
- **Features:** Fast routing, Middleware, Type-safe RPC, Validation (Zod), JWT handling

#### Middleware Stack
1. CORS Middleware
2. Logger Middleware
3. Auth Middleware (JWT verification)
4. Validation Middleware (Zod)
5. Error Handler

---

### 2.3 Database Stack

#### PostgreSQL
- **Version:** 16.x (latest stable)
- **Deployment:** Docker Compose
- **Configuration:** Port 5432, Database: todo_db

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: todo-postgres
    environment:
      POSTGRES_DB: todo_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

#### Drizzle ORM Schema
```typescript
// db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, pgEnum, primaryKey, index } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'completed'])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  status: statusEnum('status').default('todo').notNull(),
  priority: priorityEnum('priority').default('medium'),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
})

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const taskTags = pgTable('task_tags', {
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey(table.taskId, table.tagId),
}))
```

---

## 3. Authentication Architecture

### 3.1 JWT Structure
```typescript
interface JWTPayload {
  userId: string
  email: string
  iat: number  // issued at
  exp: number  // expiration (7 days)
}
```

### 3.2 Security Measures
1. **Password Hashing:** bcrypt with cost factor 12
2. **Token Storage:** HTTP-only cookies (prevent XSS)
3. **Token Validation:** Verify signature, expiration, user existence
4. **Rate Limiting:** Login (5/15min), Register (3/hour)

---

## 4. API Design

### 4.1 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Tasks
- `GET /api/tasks` - List tasks (with filters, pagination)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Tags
- `GET /api/tags` - List all user tags
- `POST /api/tags` - Create tag
- `PATCH /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

### 4.2 Response Format
```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": [...]
  }
}
```

---

## 5. Performance Optimization

### 5.1 Database
- Indexes on foreign keys, email, due dates
- Connection pooling
- Pagination for large datasets

### 5.2 Frontend
- Code splitting
- React Query caching
- Lazy loading
- Memoization

### 5.3 API
- Response compression
- Caching headers
- Rate limiting

---

## 6. Development Workflow

### 6.1 Setup
```bash
npm install
cp .env.example .env.local
docker-compose up -d
npm run db:migrate
npm run dev
```

### 6.2 Environment Variables
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 7. Security Checklist
- [x] Password hashing (bcrypt)
- [x] JWT signed tokens
- [x] HTTP-only cookies
- [x] CSRF protection
- [x] SQL injection prevention (ORM)
- [x] XSS prevention
- [x] Rate limiting
- [x] Input validation
- [x] Authorization checks

---

**Document Approval:**
- Solutions Architect: _________________
- Technical Lead: _________________
- Date: 2025-11-20
