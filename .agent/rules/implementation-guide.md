# Implementation Guide
## Personal Task Management System - Developer Handbook

**Version:** 1.0  
**Last Updated:** 2025-11-20  
**Target Audience:** Development Team  

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Sprint Implementation Guides](#sprint-implementation-guides)
5. [Code Standards](#code-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Deployment](#deployment)

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed
- Code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Navigate to project directory
cd c:\Users\trong-khiem.SYSTEM-EXE\DEV\workspaces\private_workspace\todo-hono-20251120

# 2. Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# 3. Install dependencies
npm install hono @hono/node-server
npm install drizzle-orm postgres
npm install -D drizzle-kit
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install zod
npm install @tanstack/react-query
npm install date-fns

# 4. Install shadcn/ui
npx shadcn-ui@latest init

# 5. Add shadcn components
npx shadcn-ui@latest add button input form dialog card badge calendar select checkbox toast table

# 6. Create environment file
cp .env.example .env.local

# 7. Start PostgreSQL
docker-compose up -d

# 8. Run database migrations
npm run db:migrate

# 9. Start development server
npm run dev
```

---

## Project Structure

```
todo-hono-20251120/
├── .agent/
│   ├── artifacts/                    # Build documents
│   │   ├── product-requirements-document.md
│   │   ├── technical-architecture-document.md
│   │   ├── agile-sprint-plan.md
│   │   ├── database-schema-design.md
│   │   ├── api-specification.md
│   │   └── implementation-guide.md
│   └── workflows/                    # Workflow definitions
├── app/
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                  # Protected route group
│   │   ├── page.tsx                  # Main task list
│   │   ├── layout.tsx
│   │   └── tasks/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   └── [[...route]]/
│   │       └── route.ts              # Hono API integration
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── providers.tsx                 # React Query provider
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── tasks/
│   │   ├── task-list.tsx
│   │   ├── task-card.tsx
│   │   ├── task-form.tsx
│   │   └── task-filters.tsx
│   ├── tags/
│   │   ├── tag-input.tsx
│   │   ├── tag-badge.tsx
│   │   └── tag-manager.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts                  # Database connection
│   │   ├── schema.ts                 # Drizzle schema
│   │   └── migrations/               # Migration files
│   ├── api/
│   │   ├── client.ts                 # API client (Hono RPC)
│   │   └── hooks.ts                  # React Query hooks
│   ├── auth/
│   │   ├── jwt.ts                    # JWT utilities
│   │   ├── password.ts               # Password hashing
│   │   └── proxy.ts             # Auth proxy
│   ├── validations/
│   │   ├── auth.ts                   # Auth schemas
│   │   ├── task.ts                   # Task schemas
│   │   └── tag.ts                    # Tag schemas
│   └── utils.ts                      # Utility functions
├── server/
│   ├── routes/
│   │   ├── auth.ts                   # Auth routes
│   │   ├── tasks.ts                  # Task routes
│   │   └── tags.ts                   # Tag routes
│   ├── proxy/
│   │   ├── auth.ts                   # Auth proxy
│   │   ├── validation.ts             # Validation proxy
│   │   └── error.ts                  # Error handler
│   └── index.ts                      # Hono app setup
├── types/
│   ├── index.ts                      # Shared types
│   ├── api.ts                        # API types
│   └── database.ts                   # Database types
├── docker-compose.yml                # PostgreSQL setup
├── drizzle.config.ts                 # Drizzle configuration
├── .env.example                      # Environment template
├── .env.local                        # Local environment (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Development Workflow

### Daily Workflow

1. **Pull latest changes** (if working in team)
   ```bash
   git pull origin main
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   npm run dev
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/task-creation
   ```

4. **Develop feature**
   - Write code
   - Test manually
   - Check for errors

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: implement task creation"
   ```

6. **Push to repository**
   ```bash
   git push origin feature/task-creation
   ```

### Database Workflow

**Making schema changes:**
```bash
# 1. Edit lib/db/schema.ts
# 2. Generate migration
npm run db:generate

# 3. Review migration in drizzle/migrations/
# 4. Apply migration
npm run db:migrate

# 5. Verify in Drizzle Studio
npm run db:studio
```

---

## Sprint Implementation Guides

### Sprint 1: Foundation & Authentication

#### Week 1: Project Setup & Database

**Day 1-2: Project Initialization**
```bash
# Initialize Next.js
npx create-next-app@latest . --typescript --tailwind --app

# Install core dependencies
npm install hono drizzle-orm postgres bcryptjs jsonwebtoken zod
npm install -D drizzle-kit @types/bcryptjs @types/jsonwebtoken

# Setup shadcn/ui
npx shadcn-ui@latest init
```

**Files to create:**
- `docker-compose.yml` - PostgreSQL setup
- `drizzle.config.ts` - Drizzle configuration
- `.env.example` - Environment template
- `lib/db/schema.ts` - Database schema

**Day 3-4: Database Schema**
```typescript
// lib/db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

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

// ... (tasks, tags, taskTags tables)
```

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

**Day 5: Database Connection**
```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })
```

#### Week 2: Authentication System

**Day 1-2: Auth Utilities**
```typescript
// lib/auth/password.ts
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// lib/auth/jwt.ts
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch {
    return null
  }
}
```

**Day 3-4: Auth API Routes**
```typescript
// server/routes/auth.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { eq } from 'drizzle-orm'
import { setCookie } from 'hono/cookie'

const authRoutes = new Hono()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
})

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, fullName } = c.req.valid('json')

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (existingUser) {
    return c.json({ success: false, error: { message: 'Email already exists' } }, 409)
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user
  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    fullName,
  }).returning()

  // Generate token
  const token = signToken({ userId: user.id, email: user.email })

  // Set cookie
  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return c.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, fullName: user.fullName },
      token,
    },
  }, 201)
})

// ... (login, logout, me routes)

export default authRoutes
```

**Day 5: Auth UI**
```typescript
// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (data.success) {
      router.push('/dashboard')
    } else {
      setError(data.error.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Create Account</h1>
        
        {error && <div className="text-red-500">{error}</div>}
        
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}
```

### Sprint 2: Core Task Management

**Implementation order:**
1. Task API routes (CRUD)
2. Task list UI
3. Task creation form
4. Task editing
5. Task deletion
6. Status management

**Key files:**
- `server/routes/tasks.ts` - Task API
- `components/tasks/task-list.tsx` - Task list
- `components/tasks/task-form.tsx` - Create/edit form
- `components/tasks/task-card.tsx` - Task card component

### Sprint 3: Tagging & Filtering

**Implementation order:**
1. Tag API routes
2. Tag input component with autocomplete
3. Tag management UI
4. Filter implementation
5. Search functionality
6. Sorting options

**Key files:**
- `server/routes/tags.ts` - Tag API
- `components/tags/tag-input.tsx` - Tag input
- `components/tasks/task-filters.tsx` - Filters

### Sprint 4: Polish & Enhancement

**Focus areas:**
1. UI animations (Framer Motion)
2. Performance optimization
3. Accessibility improvements
4. Keyboard shortcuts
5. Error handling
6. Documentation

---

## Code Standards

### TypeScript

**Use strict typing:**
```typescript
// ✅ Good
interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'completed'
}

// ❌ Bad
interface Task {
  id: any
  title: string
  status: string
}
```

**Use Zod for runtime validation:**
```typescript
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
})

export type TaskInput = z.infer<typeof taskSchema>
```

### React Components

**Use functional components:**
```typescript
// ✅ Good
export function TaskCard({ task }: { task: Task }) {
  return <div>{task.title}</div>
}

// ❌ Bad
export class TaskCard extends React.Component { ... }
```

**Use proper naming:**
- Components: PascalCase (`TaskCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_TASKS`)

### API Routes

**Consistent response format:**
```typescript
// Success
return c.json({
  success: true,
  data: { ... }
})

// Error
return c.json({
  success: false,
  error: {
    message: 'Error description',
    code: 'ERROR_CODE'
  }
}, statusCode)
```

---

## Testing Guidelines

### Manual Testing Checklist

**Authentication:**
- [ ] Can register new user
- [ ] Cannot register with existing email
- [ ] Can login with valid credentials
- [ ] Cannot login with invalid credentials
- [ ] Session persists across page refreshes
- [ ] Can logout successfully

**Tasks:**
- [ ] Can create task with required fields
- [ ] Can create task with all fields
- [ ] Can view task list
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can change task status
- [ ] Validation works correctly

**Tags:**
- [ ] Can create tags
- [ ] Can assign tags to tasks
- [ ] Can filter by tags
- [ ] Can manage tags
- [ ] Autocomplete works

**UI/UX:**
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Animations smooth
- [ ] Loading states show
- [ ] Error messages clear

---

## Deployment

### Environment Variables

**Production `.env`:**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configure environment variables in Vercel dashboard**

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## Troubleshooting

### Common Issues

**Database connection fails:**
```bash
# Check if PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart

# Check logs
docker-compose logs postgres
```

**Migration errors:**
```bash
# Reset database (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d
npm run db:migrate
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Hono Docs](https://hono.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [React Query Docs](https://tanstack.com/query/latest)

### Tools
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) - Database GUI
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-20  
**Maintained By:** Development Team
