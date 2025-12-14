# Frontend Coding Rules & ORM Structure

## Table of Contents
1. [Frontend Coding Rules](#frontend-coding-rules)
2. [Component Architecture](#component-architecture)
3. [ORM Structure (Drizzle)](#orm-structure-drizzle)
4. [Data Flow Patterns](#data-flow-patterns)

---

## Frontend Coding Rules

### 1. **TypeScript Guidelines**

#### Strict Type Safety
```typescript
// ✅ GOOD: Explicit types
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ❌ BAD: Using 'any'
const handleTask = (task: any) => {
  // No type safety
};

// ✅ GOOD: Use 'unknown' if needed, then narrow
const handleUnknown = (data: unknown) => {
  if (typeof data === 'object' && data !== null) {
    // Safe to use
  }
};
```

#### Generic Type Usage
```typescript
// ✅ GOOD: Properly typed generics
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// Usage
const taskResponse = await fetchData<Task>('/api/tasks/1');
```

#### Union Types for States
```typescript
// ✅ GOOD: Discriminated unions
type TaskStatus = 
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; data: Task }
  | { state: 'error'; error: string };

// ✅ GOOD: Type guards
if (taskStatus.state === 'success') {
  console.log(taskStatus.data); // data is available
}
```

---

### 2. **Component Architecture**

#### Server vs Client Components

**Server Components** (Default)
```typescript
// ✅ GOOD: Async server component for data fetching
// app/tasks/page.tsx
import { db } from '@/lib/db';
import TaskList from '@/components/tasks/task-list';

export default async function TasksPage() {
  // Server-only operations allowed
  const tasks = await db.query.tasks.findMany();
  
  return (
    <TaskList initialTasks={tasks} />
  );
}

// ✅ GOOD: Cannot use hooks or interactivity here
// Fetch data once at server level
```

**Client Components**
```typescript
// ✅ GOOD: Interactivity with 'use client'
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

export function TaskForm() {
  const [title, setTitle] = useState('');
  
  // Client-only operations
  const { mutate: createTask } = useMutation({
    mutationFn: async (data: TaskInput) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.json();
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createTask({ title });
    }}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <button type="submit">Create</button>
    </form>
  );
}
```

#### Component Naming Conventions
```
components/
├── tasks/
│   ├── TaskManager.tsx       # Main container (orchestrator)
│   ├── TaskList.tsx          # List display (presentational)
│   ├── TaskForm.tsx          # Form container (client)
│   ├── TaskCard.tsx          # Single item (presentational)
│   ├── TaskFilters.tsx       # Filter controls (client)
│   └── task-utils.ts         # Helper functions

Naming Rules:
- ✅ PascalCase for component files (TaskManager.tsx)
- ✅ camelCase for utility files (task-utils.ts)
- ✅ Descriptive names (avoid generic names like 'Container', 'Wrapper')
- ✅ Co-locate related utilities with components
```

#### Component Structure
```typescript
// ✅ GOOD: Consistent component structure
'use client';

import { FC, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

// 1. Type definitions at top
interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

// 2. Component definition
const TaskCard: FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // 3. Hooks
  const { data: comments } = useQuery({
    queryKey: ['task-comments', task.id],
    queryFn: () => fetchComments(task.id),
  });

  // 4. Event handlers
  const handleEdit = () => onEdit?.(task);
  const handleDelete = () => onDelete?.(task.id);

  // 5. Render
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

// 6. Export
export default TaskCard;
```

---

### 3. **React Hooks & State Management**

#### useState - Local State
```typescript
// ✅ GOOD: Local UI state with useState
const [isOpen, setIsOpen] = useState(false);
const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

// ✅ GOOD: Initialize with function for expensive operations
const [tasks, setTasks] = useState(() => {
  return localStorage.getItem('tasks') 
    ? JSON.parse(localStorage.getItem('tasks')!) 
    : [];
});

// ❌ BAD: Derived state (redundant)
const [count, setCount] = useState(0);
const [doubled, setDoubled] = useState(count * 2); // Don't do this
```

#### useEffect - Side Effects
```typescript
// ✅ GOOD: Clear dependency array
useEffect(() => {
  const handleResize = () => {
    console.log(window.innerWidth);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Empty array = runs once on mount

// ✅ GOOD: Dependencies included
useEffect(() => {
  document.title = `Tasks (${taskCount})`;
}, [taskCount]); // Re-runs when taskCount changes

// ❌ BAD: Missing dependencies
useEffect(() => {
  console.log(taskId); // taskId used but not in deps
  fetchTask(taskId);
}, []); // Stale closure!
```

#### useQuery - Server State
```typescript
// ✅ GOOD: TanStack Query for data fetching
import { useQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '@/lib/query-keys';

function TaskDetails({ taskId }: { taskId: string }) {
  const { 
    data: task, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: () => fetchTask(taskId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{task?.title}</h1>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

#### useMutation - Mutations
```typescript
// ✅ GOOD: TanStack Query mutations with optimistic updates
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskQueryKeys } from '@/lib/query-keys';

function UpdateTaskForm({ task }: { task: Task }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    
    // Optimistic update
    onMutate: async (updates) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: taskQueryKeys.detail(task.id),
      });

      // Snapshot previous data
      const previousTask = queryClient.getQueryData(
        taskQueryKeys.detail(task.id)
      );

      // Update cache optimistically
      queryClient.setQueryData(taskQueryKeys.detail(task.id), {
        ...task,
        ...updates,
      });

      return { previousTask };
    },

    // Revert on error
    onError: (error, updates, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(
          taskQueryKeys.detail(task.id),
          context.previousTask
        );
      }
    },

    // Refetch after success
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({ title: 'New Title' });
    }}>
      <button disabled={isPending}>Update</button>
      {error && <div>{error.message}</div>}
    </form>
  );
}
```

#### Context API - Global State
```typescript
// ✅ GOOD: Theme context for global app state
'use client';

import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

### 4. **Form Handling with React Hook Form**

```typescript
// ✅ GOOD: React Hook Form with Zod validation
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema } from '@/lib/validations/task';

type CreateTaskInput = z.infer<typeof createTaskSchema>;

export function TaskFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...register('title')}
          placeholder="Task title"
        />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Task description"
        />
        {errors.description && <span>{errors.description.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

---

### 5. **Styling Guidelines**

#### TailwindCSS
```typescript
// ✅ GOOD: Use Tailwind utility classes
export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{task.description}</p>
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit
        </button>
      </div>
    </div>
  );
}

// ✅ GOOD: Extract repeated patterns
const buttonClasses = 'px-3 py-1 rounded transition-colors';
const primaryButtonClasses = `${buttonClasses} bg-blue-500 text-white hover:bg-blue-600`;
const secondaryButtonClasses = `${buttonClasses} border border-gray-300 text-gray-700 hover:bg-gray-50`;
```

---

### 6. **Error Handling**

```typescript
// ✅ GOOD: Consistent error handling
'use client';

import { useCallback } from 'react';

interface ApiError extends Error {
  status: number;
  data?: unknown;
}

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error('API request failed') as ApiError;
    error.status = response.status;
    
    try {
      error.data = await response.json();
    } catch {
      error.data = response.statusText;
    }

    throw error;
  }

  return response.json();
}

export function useTaskMutation() {
  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      if ('status' in error) {
        const apiError = error as ApiError;
        switch (apiError.status) {
          case 401:
            console.error('Unauthorized - redirect to login');
            break;
          case 400:
            console.error('Validation error:', apiError.data);
            break;
          case 500:
            console.error('Server error');
            break;
        }
      }
    }
  }, []);

  return { handleError };
}
```

---

### 7. **Performance Optimization**

```typescript
// ✅ GOOD: Memoize expensive computations
import { useMemo, memo } from 'react';

const TaskList = memo(function TaskList({ tasks }: { tasks: Task[] }) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tasks]);

  return (
    <ul>
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
});

export default TaskList;
```

---

### 8. **Accessibility (a11y)**

```typescript
// ✅ GOOD: Semantic HTML and ARIA
export function TaskForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form 
      onSubmit={handleSubmit}
      aria-busy={loading}
      role="form"
      aria-label="Create new task"
    >
      <div>
        <label htmlFor="task-title">
          Task Title <span aria-label="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          required
          aria-required="true"
          aria-describedby={error ? 'title-error' : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <div id="title-error" role="alert" className="text-red-600">
            {error}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

---

## Component Architecture

### 1. **Container vs Presentational Pattern**

```
Container Components (Smart):
- Handle data fetching (useQuery)
- Manage state mutations (useMutation)
- Connect to external stores
- Pass props down to presentational components

Presentational Components (Dumb):
- Receive all data via props
- No data fetching or state management
- Pure functions
- Highly reusable
```

---

### 2. **Compound Components Pattern**

```typescript
// ✅ GOOD: Compound components for flexible composition
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface TaskContextType {
  task: Task;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

// Main compound component
export function Task({ task, children }: { task: Task; children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <TaskContext.Provider value={{ task, isEditing, setIsEditing }}>
      <div className="task-container">
        {children}
      </div>
    </TaskContext.Provider>
  );
}

// Sub-components
Task.Header = function TaskHeader() {
  const { task } = useTaskContext();
  return <div className="task-header">{task.title}</div>;
};

Task.Body = function TaskBody() {
  const { task } = useTaskContext();
  return <div className="task-body">{task.description}</div>;
};

Task.Actions = function TaskActions() {
  const { isEditing, setIsEditing } = useTaskContext();
  return (
    <div className="task-actions">
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Done' : 'Edit'}
      </button>
    </div>
  );
};

function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('Task components must be used within Task');
  }
  return context;
}
```

---

## ORM Structure (Drizzle)

### 1. **Schema Definition**

```typescript
// lib/db/schema.ts
import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  timestamp,
  foreignKey,
  index,
  unique,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const taskStatus = pgEnum('task_status', 
  ['pending', 'in_progress', 'completed']
);

export const taskPriority = pgEnum('task_priority',
  ['low', 'medium', 'high']
);

// Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatus('status').default('pending').notNull(),
  priority: taskPriority('priority').default('medium').notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
}));

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }).default('#3b82f6'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('tags_user_id_idx').on(table.userId),
  uniqueNamePerUser: unique('tags_user_id_name_unique').on(table.userId, table.name),
}));

export const taskTags = pgTable('task_tags', {
  taskId: serial('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  tagId: serial('tag_id').references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.tagId] }),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  tags: many(tags),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  tags: many(taskTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  tasks: many(taskTags),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id],
  }),
}));
```

---

### 2. **Database Connection & Configuration**

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance with schema
export const db = drizzle(pool, { schema });

// Export for migrations
export { schema };
```

---

### 3. **Query Patterns**

#### Simple Queries
```typescript
// Get all tasks for a user
export async function getUserTasks(userId: number) {
  return db.query.tasks.findMany({
    where: (tasks, { eq }) => eq(tasks.userId, userId),
    orderBy: (tasks, { desc }) => desc(tasks.createdAt),
  });
}

// Get task by ID with relations
export async function getTaskWithDetails(taskId: number) {
  return db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, taskId),
    with: {
      user: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
  });
}
```

#### Complex Queries with Filters
```typescript
import { and, or, eq, like, lt, gt } from 'drizzle-orm';

export async function searchTasks(
  userId: number,
  filters: {
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    search?: string;
  }
) {
  const conditions = [eq(tasks.userId, userId)];

  if (filters.status) {
    conditions.push(eq(tasks.status, filters.status));
  }

  if (filters.search) {
    conditions.push(
      or(
        like(tasks.title, `%${filters.search}%`),
        like(tasks.description, `%${filters.search}%`)
      )
    );
  }

  return db.query.tasks.findMany({
    where: and(...conditions),
  });
}
```

#### Insert Operations
```typescript
// ✅ GOOD: Insert with return
export async function createTask(
  userId: number,
  data: {
    title: string;
    description?: string;
  }
) {
  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title: data.title,
      description: data.description,
    })
    .returning();

  return task;
}
```

#### Update Operations
```typescript
import { eq, and } from 'drizzle-orm';

export async function updateTask(
  taskId: number,
  userId: number,
  updates: Partial<typeof tasks.$inferInsert>
) {
  const [updated] = await db
    .update(tasks)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();

  return updated;
}
```

#### Delete Operations
```typescript
export async function deleteTask(taskId: number, userId: number) {
  const deleted = await db
    .delete(tasks)
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.userId, userId)
      )
    )
    .returning();

  return deleted.length > 0;
}
```

---

## Data Flow Patterns

### 1. **Create Flow**
```
User Input → Validation (Zod) → API Route → Drizzle Insert 
→ Update Cache (React Query) → UI Update
```

### 2. **Read Flow**
```
Component Mount → useQuery Check Cache 
→ If stale: Fetch from API → Drizzle Query 
→ Return to Component → Render
```

### 3. **Update Flow**
```
User Change → Validation → Optimistic Update (Local Cache) 
→ API Request → Drizzle Update 
→ Success: Confirm Update → Error: Revert Cache
```

### 4. **Delete Flow**
```
User Confirm → Optimistic Remove from Cache 
→ API Request → Drizzle Delete 
→ Success: Query Invalidation → Error: Restore
```

---

## Common Pitfalls to Avoid

### ❌ DON'T
- Use `any` type anywhere
- Fetch data in multiple places (centralize with React Query)
- Create components without 'use client' when using hooks
- Forget cleanup in useEffect
- Skip loading/error states
- Mix server and client logic
- Forget database indexes on frequently queried fields

### ✅ DO
- Use explicit types with TypeScript
- Use React Query for server state
- Mark client components with 'use client'
- Return cleanup functions from useEffect
- Always handle loading and error states
- Keep server and client code separated
- Add indexes to foreign keys and search fields