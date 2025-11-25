# Database Schema Design
## Personal Task Management System

**Version:** 1.0  
**Last Updated:** 2025-11-20  
**Database:** PostgreSQL 16.x  
**ORM:** Drizzle ORM  

---

## Schema Overview

The database consists of 4 main tables with clear relationships:

1. **users** - User accounts and authentication
2. **tasks** - Individual task records
3. **tags** - Categorization labels
4. **task_tags** - Many-to-many relationship between tasks and tags

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
│─────────────────────│
│ id (PK)            │
│ email (UNIQUE)     │
│ password_hash      │
│ full_name          │
│ created_at         │
│ updated_at         │
└──────────┬──────────┘
           │
           │ 1:N
           │
    ┌──────┴──────────────────────┐
    │                             │
┌───▼──────────────┐      ┌──────▼────────────┐
│      tasks       │      │       tags        │
│──────────────────│      │───────────────────│
│ id (PK)         │      │ id (PK)          │
│ user_id (FK)    │      │ user_id (FK)     │
│ title           │      │ name             │
│ description     │      │ color            │
│ status          │      │ created_at       │
│ priority        │      └──────┬────────────┘
│ start_date      │             │
│ due_date        │             │
│ created_at      │             │
│ updated_at      │             │
│ completed_at    │             │
└────────┬─────────┘             │
         │                       │
         │         N:M           │
         │    ┌──────────────┐   │
         └────►  task_tags   ◄───┘
              │──────────────│
              │ task_id (FK) │
              │ tag_id (FK)  │
              │ (PK: both)   │
              └──────────────┘
```

---

## Table Definitions

### 1. users

**Purpose:** Store user account information and authentication credentials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email address (login) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE INDEX idx_users_email ON users(email)`

**Drizzle Schema:**
```typescript
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

---

### 2. tasks

**Purpose:** Store individual task records with all associated metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique task identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE | Owner of the task |
| title | VARCHAR(200) | NOT NULL | Task title/summary |
| description | TEXT | NULL | Detailed task description |
| status | ENUM | NOT NULL, DEFAULT 'todo' | Current status (todo, in_progress, completed) |
| priority | ENUM | DEFAULT 'medium' | Priority level (low, medium, high) |
| start_date | TIMESTAMP | NULL | When task should start |
| due_date | TIMESTAMP | NULL | Task deadline |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp |
| completed_at | TIMESTAMP | NULL | When task was completed |

**Enums:**
```sql
CREATE TYPE status AS ENUM ('todo', 'in_progress', 'completed');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high');
```

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX idx_tasks_user_id ON tasks(user_id)`
- `INDEX idx_tasks_due_date ON tasks(due_date)`
- `INDEX idx_tasks_status ON tasks(status)`
- `INDEX idx_tasks_created_at ON tasks(created_at)`

**Constraints:**
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
- `CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)`

**Drizzle Schema:**
```typescript
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'completed'])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  status: statusEnum('status').default('todo').notNull(),
  priority: priorityEnum('priority').default('medium'),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  userIdIdx: index('idx_tasks_user_id').on(table.userId),
  dueDateIdx: index('idx_tasks_due_date').on(table.dueDate),
  statusIdx: index('idx_tasks_status').on(table.status),
  createdAtIdx: index('idx_tasks_created_at').on(table.createdAt),
}))
```

---

### 3. tags

**Purpose:** Store user-defined tags for task categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique tag identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE | Tag owner |
| name | VARCHAR(30) | NOT NULL | Tag name/label |
| color | VARCHAR(7) | NULL | Hex color code (e.g., #FF5733) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Tag creation timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX idx_tags_user_id ON tags(user_id)`
- `UNIQUE INDEX idx_tags_user_name ON tags(user_id, name)` - Prevent duplicate tag names per user

**Constraints:**
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
- `UNIQUE (user_id, name)` - Tag names must be unique per user

**Drizzle Schema:**
```typescript
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_tags_user_id').on(table.userId),
  userNameIdx: uniqueIndex('idx_tags_user_name').on(table.userId, table.name),
}))
```

---

### 4. task_tags (Junction Table)

**Purpose:** Many-to-many relationship between tasks and tags.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| task_id | UUID | NOT NULL, FOREIGN KEY → tasks(id) ON DELETE CASCADE | Reference to task |
| tag_id | UUID | NOT NULL, FOREIGN KEY → tags(id) ON DELETE CASCADE | Reference to tag |

**Indexes:**
- `PRIMARY KEY (task_id, tag_id)` - Composite primary key
- `INDEX idx_task_tags_tag_id ON task_tags(tag_id)` - For reverse lookups

**Constraints:**
- `FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE`
- `FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE`

**Drizzle Schema:**
```typescript
export const taskTags = pgTable('task_tags', {
  taskId: uuid('task_id')
    .references(() => tasks.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.tagId] }),
  tagIdIdx: index('idx_task_tags_tag_id').on(table.tagId),
}))
```

---

## Relationships

### One-to-Many Relationships

1. **users → tasks** (1:N)
   - One user can have many tasks
   - Each task belongs to exactly one user
   - Cascade delete: Deleting a user deletes all their tasks

2. **users → tags** (1:N)
   - One user can have many tags
   - Each tag belongs to exactly one user
   - Cascade delete: Deleting a user deletes all their tags

### Many-to-Many Relationship

3. **tasks ↔ tags** (N:M via task_tags)
   - One task can have multiple tags
   - One tag can be applied to multiple tasks
   - Cascade delete: Deleting a task removes its tag associations
   - Cascade delete: Deleting a tag removes it from all tasks

---

## Drizzle Relations

```typescript
import { relations } from 'drizzle-orm'

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  tags: many(tags),
}))

// Task relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  taskTags: many(taskTags),
}))

// Tag relations
export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  taskTags: many(taskTags),
}))

// TaskTag relations
export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id],
  }),
}))
```

---

## Common Queries

### 1. Get all tasks for a user with tags

```typescript
const userTasks = await db.query.tasks.findMany({
  where: eq(tasks.userId, userId),
  with: {
    taskTags: {
      with: {
        tag: true,
      },
    },
  },
  orderBy: [desc(tasks.createdAt)],
})
```

### 2. Get tasks filtered by tag

```typescript
const tasksWithTag = await db
  .select()
  .from(tasks)
  .innerJoin(taskTags, eq(tasks.id, taskTags.taskId))
  .innerJoin(tags, eq(taskTags.tagId, tags.id))
  .where(and(
    eq(tasks.userId, userId),
    eq(tags.name, 'work')
  ))
```

### 3. Get all tags with task count

```typescript
const tagsWithCount = await db
  .select({
    id: tags.id,
    name: tags.name,
    color: tags.color,
    taskCount: count(taskTags.taskId),
  })
  .from(tags)
  .leftJoin(taskTags, eq(tags.id, taskTags.tagId))
  .where(eq(tags.userId, userId))
  .groupBy(tags.id)
```

### 4. Get overdue tasks

```typescript
const overdueTasks = await db.query.tasks.findMany({
  where: and(
    eq(tasks.userId, userId),
    lt(tasks.dueDate, new Date()),
    ne(tasks.status, 'completed')
  ),
  orderBy: [asc(tasks.dueDate)],
})
```

### 5. Create task with tags

```typescript
// Transaction to ensure atomicity
await db.transaction(async (tx) => {
  // Create task
  const [task] = await tx.insert(tasks).values({
    userId,
    title: 'New task',
    description: 'Task description',
  }).returning()

  // Create or get tags
  const tagIds = await Promise.all(
    tagNames.map(async (name) => {
      const [tag] = await tx
        .insert(tags)
        .values({ userId, name })
        .onConflictDoUpdate({
          target: [tags.userId, tags.name],
          set: { name },
        })
        .returning({ id: tags.id })
      return tag.id
    })
  )

  // Associate tags with task
  await tx.insert(taskTags).values(
    tagIds.map(tagId => ({ taskId: task.id, tagId }))
  )
})
```

---

## Migration Strategy

### Initial Migration

```typescript
// drizzle/0000_initial_schema.sql
CREATE TYPE status AS ENUM ('todo', 'in_progress', 'completed');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status status NOT NULL DEFAULT 'todo',
  priority priority DEFAULT 'medium',
  start_date TIMESTAMP,
  due_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  CONSTRAINT check_dates CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(30) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);
```

### Running Migrations

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# View database in Drizzle Studio
npm run db:studio
```

---

## Data Validation Rules

### users
- Email must be valid format
- Email must be unique
- Password must meet complexity requirements (enforced at application level)
- Full name required

### tasks
- Title required, max 200 characters
- Description optional, max 2000 characters
- Due date must be after start date (if both provided)
- Status must be one of: todo, in_progress, completed
- Priority must be one of: low, medium, high

### tags
- Name required, max 30 characters
- Name must be unique per user (case-insensitive)
- Color must be valid hex code (if provided)

### task_tags
- Both task_id and tag_id must exist
- Combination must be unique (no duplicate associations)

---

## Performance Considerations

### Indexes
All foreign keys are indexed for fast joins:
- `tasks.user_id` - Fast user task lookups
- `tasks.due_date` - Fast date-based queries
- `tasks.status` - Fast status filtering
- `tags.user_id` - Fast user tag lookups
- `task_tags.tag_id` - Fast reverse tag lookups

### Query Optimization
- Use `LIMIT` and `OFFSET` for pagination
- Use `SELECT` specific columns instead of `SELECT *`
- Use joins instead of N+1 queries
- Use transactions for multi-step operations

### Connection Pooling
Configure PostgreSQL connection pool:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!, {
  max: 10, // Maximum connections
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client)
```

---

## Backup & Recovery

### Backup Strategy
```bash
# Full database backup
pg_dump -U postgres -d todo_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres -d todo_db < backup_20251120.sql
```

### Data Retention
- Keep user data indefinitely (until account deletion)
- Soft delete option for tasks (future enhancement)
- Archive completed tasks older than 1 year (future enhancement)

---

**Schema Version:** 1.0  
**Last Updated:** 2025-11-20  
**Approved By:** Database Administrator
