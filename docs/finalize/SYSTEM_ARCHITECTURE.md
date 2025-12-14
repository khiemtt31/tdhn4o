# System Architecture

## Overview

This is a **Next.js 15+ full-stack task management application** with authentication, real-time data synchronization, and a modular component-based architecture. The system follows modern web development best practices with separation of concerns, type safety, and scalability in mind.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router, React 18+)
- **UI Library**: React with TypeScript
- **Styling**: CSS Modules + TailwindCSS
- **Form Management**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query v5)
- **State Management**: React Context API
- **Component Library**: shadcn/ui
- **Theme System**: Custom CSS Variables + Theme Context

### Backend
- **Runtime**: Node.js (via Next.js)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (inferred from Drizzle config)
- **Authentication**: Custom JWT-based auth
- **API**: RESTful API (Next.js Route Handlers)
- **Validation**: Zod schemas

### Development
- **Language**: TypeScript (strict mode)
- **Build Tool**: Next.js built-in webpack
- **Linting**: ESLint
- **CSS Processing**: PostCSS + TailwindCSS
- **Package Manager**: npm

---

## Architecture Layers

### 1. **Presentation Layer (Frontend)**

#### Directory Structure
```
app/
├── (auth)/               # Auth page group
│   ├── login/
│   └── register/
├── (dashboard)/          # Dashboard group
├── api/                  # API routes
├── tasks/                # Task management pages
├── tags/                 # Tag management pages
├── layout.tsx            # Root layout
└── page.tsx              # Home page

components/
├── auth/                 # Authentication components
│   ├── auth-guard.tsx    # Protected route wrapper
│   └── user-context.tsx  # User state management
├── layout/               # Layout components
│   ├── header.tsx        # Navigation header
│   └── sidebar.tsx       # Sidebar navigation
├── tasks/                # Task-related components
│   ├── task-manager.tsx  # Main task container
│   ├── task-list.tsx     # Task list display
│   ├── task-form.tsx     # Task creation/editing
│   └── task-filters.tsx  # Filter controls
├── tags/                 # Tag-related components
│   ├── tag-management.tsx
│   ├── tag-input.tsx
│   └── tag-badge.tsx
└── ui/                   # Reusable UI components (shadcn/ui)
    ├── button.tsx
    ├── input.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── badge.tsx
    ├── checkbox.tsx
    ├── select.tsx
    ├── popover.tsx
    ├── calendar.tsx
    ├── command.tsx
    ├── alert-dialog.tsx
    ├── textarea.tsx
    ├── label.tsx
    ├── separator.tsx
    ├── theme-toggle.tsx
    └── button-group.tsx
```

#### Key Components

**Page Components** (Server Components by default)
- `app/layout.tsx` - Root layout with provider setup
- `app/page.tsx` - Home/landing page
- `app/dashboard/page.tsx` - Main dashboard
- `app/tasks/page.tsx` - Tasks management page
- `app/tags/page.tsx` - Tags management page
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page

**Container Components** (Client Components with 'use client')
- `components/tasks/task-manager.tsx` - Orchestrates task CRUD operations
- `components/tags/tag-management.tsx` - Orchestrates tag management
- `components/layout/header.tsx` - Navigation and user menu
- `components/layout/sidebar.tsx` - Sidebar navigation

**UI Components** (Reusable, presentational)
- Located in `components/ui/`
- Exported from shadcn/ui library
- No business logic, only presentation

---

### 2. **API Layer (Backend)**

#### Route Structure
```
app/api/
├── auth/
│   ├── login/route.ts        # POST - User login
│   ├── register/route.ts      # POST - User registration
│   ├── logout/route.ts        # POST - User logout
│   └── me/route.ts            # GET - Get current user
├── tasks/
│   ├── route.ts               # GET/POST - List/Create tasks
│   └── [id]/route.ts          # GET/PUT/DELETE - Task operations
└── tags/
    ├── route.ts               # GET/POST - List/Create tags
    └── [id]/route.ts          # GET/PUT/DELETE - Tag operations
```

#### API Response Format
All endpoints return standardized responses:
```typescript
// Success
{ data: T, success: true }

// Error
{ message: string, success: false, error?: unknown }
```

#### Endpoints

**Authentication**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user, return JWT token
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Get current authenticated user

**Tasks**
- `GET /api/tasks` - Fetch all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Fetch specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

**Tags**
- `GET /api/tags` - Fetch all user tags
- `POST /api/tags` - Create new tag
- `GET /api/tags/[id]` - Fetch specific tag
- `PUT /api/tags/[id]` - Update tag
- `DELETE /api/tags/[id]` - Delete tag

---

### 3. **Data Layer (Database & ORM)**

#### Database Schema (Drizzle ORM)
```
Schema Location: lib/db/schema.ts

Tables:
1. users
   - id (Primary Key)
   - email (Unique, Indexed)
   - password (Hashed)
   - name
   - created_at
   - updated_at

2. tasks
   - id (Primary Key)
   - user_id (Foreign Key → users.id)
   - title
   - description
   - status (pending, in_progress, completed)
   - priority (low, medium, high)
   - due_date
   - tags (Many-to-Many through task_tags)
   - created_at
   - updated_at

3. tags
   - id (Primary Key)
   - user_id (Foreign Key → users.id)
   - name (Unique per user)
   - color
   - created_at
   - updated_at

4. task_tags (Junction Table)
   - task_id (Foreign Key → tasks.id)
   - tag_id (Foreign Key → tags.id)
```

#### Drizzle Configuration
- **File**: `drizzle.config.ts`
- **Migrations**: Stored in `drizzle/` directory
- **Database**: PostgreSQL
- **ORM Features**: 
  - Type-safe queries
  - Automatic migrations
  - Relation queries
  - Transaction support

#### Database Connection
- **File**: `lib/db/index.ts`
- **Connection Pool**: Managed via Drizzle
- **Environment**: Database URL from `.env.local`

---

### 4. **Business Logic & Services**

#### Validation Layer
```
lib/validations/
├── auth.ts      # User registration/login schemas
├── task.ts      # Task CRUD schemas
└── tag.ts       # Tag CRUD schemas

Tools: Zod library for schema validation
```

#### Authentication & Security
```
lib/auth/
├── jwt.ts       # JWT token generation/verification
├── password.ts  # Password hashing (bcrypt)
└── proxy.ts     # Proxy configuration for auth
```

#### Query Management
```
lib/query-keys.ts   # TanStack Query key factory
                    # Centralized query key management
lib/query-provider.tsx # Query client configuration
```

#### Type Definitions
```
types/
└── task.ts      # TypeScript interfaces for tasks
```

---

### 5. **State Management**

#### Context API Usage
```
lib/theme/theme-context.tsx    # Theme (light/dark) state
components/auth/user-context.tsx # User authentication state
```

#### TanStack Query (React Query)
- **Purpose**: Server state management, caching, synchronization
- **Key Features**:
  - Automatic background refetching
  - Cache invalidation
  - Optimistic updates
  - Pagination & infinite queries
  - Mutation management

#### Provider Setup
```typescript
// app/layout.tsx
<QueryClientProvider client={queryClient}>
  <ThemeProvider>
    <UserProvider>
      {children}
    </UserProvider>
  </ThemeProvider>
</QueryClientProvider>
```

---

## Data Flow

### 1. **User Authentication Flow**
```
1. User enters credentials on login/register page
2. Form validation (Zod schema)
3. Submit to /api/auth/login or /api/auth/register
4. Backend validates input, hashes password (if register)
5. Check database for existing user
6. Generate JWT token
7. Store token in httpOnly cookie
8. Redirect to dashboard
9. Update user context
```

### 2. **Task CRUD Flow**
```
Frontend:
1. User interacts with task form (task-form.tsx)
2. React Hook Form validates input
3. Mutation sent to /api/tasks
4. TanStack Query handles request

Backend:
1. Route handler verifies JWT token
2. Validates request body with Zod
3. Query database via Drizzle ORM
4. Return response (data or error)

Frontend (Response):
1. TanStack Query receives response
2. Cache updated
3. Related queries invalidated
4. Component re-renders with new data
5. UI optimistically updates
```

### 3. **Real-time Updates**
- Achieved through TanStack Query refetching
- Manual invalidation on mutations
- Polling on specific intervals
- Component-level subscriptions

---

## Key Architectural Decisions

### 1. **Server Components by Default**
- Pages are Server Components for SEO and performance
- Data fetching at the server level
- Gradual client-side interactivity with 'use client'

### 2. **Separation of Concerns**
- **Components**: Presentation logic only
- **API Routes**: Business logic & database operations
- **Validation**: Zod schemas centralized
- **Auth**: Custom JWT implementation

### 3. **Type Safety**
- Full TypeScript implementation
- Zod runtime validation
- Type-safe queries from Drizzle ORM
- Type inference across layers

### 4. **Scalability**
- Modular component structure
- Reusable UI component library
- Centralized validation & auth
- Query key factory pattern
- Environment-based configuration

### 5. **DX (Developer Experience)**
- Consistent error handling
- Standardized API responses
- Clear file organization
- Component co-location
- Type hints throughout

---

## Deployment & Environment

### Environment Variables
```
.env.local (local development)
.env.example (template)

Required variables:
- DATABASE_URL (PostgreSQL connection string)
- JWT_SECRET (Token signing key)
- API endpoints (if external APIs used)
```

### Build & Runtime
- **Development**: `npm run dev` - Next.js dev server
- **Production**: `npm run build` && `npm start` - Optimized build
- **Database Migrations**: `npm run migrate` (Drizzle)
- **Docker**: `docker-compose.yml` for local PostgreSQL

---

## Security Considerations

1. **Authentication**: JWT tokens in httpOnly cookies
2. **Password Security**: Bcrypt hashing with salt rounds
3. **CORS**: Next.js built-in CORS handling
4. **SQL Injection**: Protected by Drizzle ORM parameterized queries
5. **XSS Protection**: React automatic escaping
6. **CSRF**: HTTP-only cookies mitigate CSRF
7. **Rate Limiting**: Can be added at API layer
8. **Input Validation**: Zod schemas on all inputs

---

## Performance Optimizations

1. **Server-Side Rendering**: SEO and performance
2. **Code Splitting**: Automatic via Next.js
3. **Image Optimization**: Next.js Image component
4. **Database Indexing**: On frequently queried fields
5. **Query Caching**: TanStack Query with custom strategies
6. **CSS-in-JS**: TailwindCSS for optimized styles
7. **Lazy Loading**: Dynamic imports for large components

---

## Monitoring & Maintenance

- **Error Logging**: Can be integrated (e.g., Sentry)
- **Performance Monitoring**: Next.js analytics
- **Database Monitoring**: PostgreSQL logs
- **API Monitoring**: Custom middleware for logging
- **User Session Tracking**: JWT-based sessions