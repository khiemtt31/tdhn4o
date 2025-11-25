---
trigger: always_on
---

# Agent Guidance Handbook
## How to Guide an AI Agent to Code Your Project

**Version:** 1.0  
**Last Updated:** 2025-11-20  
**Purpose:** Step-by-step guide for directing AI agents to implement your project  

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Context Preparation](#context-preparation)
3. [Effective Prompting Strategies](#effective-prompting-strategies)
4. [Sprint-by-Sprint Guidance](#sprint-by-sprint-guidance)
5. [Example Prompts](#example-prompts)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## 🎯 Overview

### What You Have
You now have comprehensive documentation that serves as the "blueprint" for your project:
- Product requirements (WHAT to build)
- Technical architecture (HOW to build)
- Sprint plans (WHEN to build)
- Database schema (DATA structure)
- API specifications (INTERFACE contracts)
- Implementation guide (CODE examples)

### How to Use It
Think of yourself as a **Product Manager/Tech Lead** directing a **Senior Developer** (the AI agent). You provide:
1. **Context** - What they need to know
2. **Instructions** - What they should do
3. **Constraints** - What they should follow
4. **Success Criteria** - How to verify it's done

---

## 📋 Context Preparation

### Step 1: Identify What to Share

For each coding session, the agent needs:

#### **Always Include (Core Context)**
1. **Current Sprint File** - The sprint you're working on
2. **Technical Architecture** - System design reference
3. **Database Schema** - Data model reference
4. **API Specification** - Endpoint contracts

#### **Include When Relevant**
5. **Product Requirements** - For understanding WHY
6. **Implementation Guide** - For code examples
7. **Existing Code** - Files being modified

### Step 2: How to Provide Context

#### **Method 1: Reference Documents (Recommended)**
```
I'm working on Sprint 1, User Story 1.2 (Database Setup).

Please reference these documents:
- sprint-1-foundation-authentication.md (for tasks)
- technical-architecture-document.md (for architecture)
- database-schema-design.md (for schema details)

Task: Create the Drizzle ORM schema file with all tables.
```

#### **Method 2: Copy Relevant Sections**
```
I'm implementing the database schema. Here's the schema from our design doc:

[Copy the schema section from database-schema-design.md]

Please create the lib/db/schema.ts file based on this design.
```

#### **Method 3: Open Files in Editor**
- Open the relevant documentation files in your editor
- The agent can see open files and reference them
- Mention which files are relevant

---

## 💬 Effective Prompting Strategies

### The CRISP Framework

Use this framework for clear, actionable prompts:

**C - Context**: What's the current state?  
**R - Reference**: Which docs to follow?  
**I - Instruction**: What to do?  
**S - Success**: How to verify?  
**P - Preferences**: Any specific choices?  

### Example Using CRISP

```
C: I've completed Sprint 1 US-1.1 (Project Setup). Next.js is running.

R: Following sprint-1-foundation-authentication.md, User Story 1.2

I: Please create the database setup:
   1. Create docker-compose.yml for PostgreSQL
   2. Install Drizzle ORM dependencies
   3. Create lib/db/schema.ts with all tables
   4. Configure drizzle.config.ts

S: Success = PostgreSQL running in Docker, schema file created, 
   migrations can be generated

P: Use PostgreSQL 16-alpine, Drizzle ORM latest version
```

---

## 🚀 Sprint-by-Sprint Guidance

### Sprint 1: Foundation & Authentication

#### **Session 1: Project Setup (US-1.1)**

**Prompt Template:**
```
I'm starting Sprint 1 of my Todo App project.

Context:
- Following sprint-1-foundation-authentication.md
- User Story 1.1: Project Setup & Configuration
- Fresh project, nothing exists yet

Task: Initialize the Next.js project with all required setup

Please:
1. Initialize Next.js with TypeScript, Tailwind, App Router
2. Install core dependencies (Hono, Drizzle, bcrypt, JWT, Zod)
3. Set up shadcn/ui
4. Create the project folder structure as defined in technical-architecture-document.md
5. Create .env.example with all required variables

Reference: 
- sprint-1-foundation-authentication.md (US-1.1 tasks)
- technical-architecture-document.md (project structure)

Success criteria: npm run dev works, folder structure matches architecture doc
```

#### **Session 2: Database Setup (US-1.2)**

**Prompt Template:**
```
Continuing Sprint 1, moving to User Story 1.2: Database Setup

Context:
- Project is initialized and running
- Need to set up PostgreSQL and Drizzle ORM

Task: Create complete database setup

Please:
1. Create docker-compose.yml for PostgreSQL 16
2. Create lib/db/schema.ts with all tables (users, tasks, tags, task_tags)
3. Create lib/db/index.ts for database connection
4. Create drizzle.config.ts
5. Add database scripts to package.json (db:generate, db:migrate, db:studio)

Reference:
- database-schema-design.md (for exact schema)
- sprint-1-foundation-authentication.md (US-1.2 tasks)

Success: docker-compose up -d works, npm run db:migrate creates tables
```

#### **Session 3: User Registration (US-1.3)**

**Prompt Template:**
```
Sprint 1, User Story 1.3: User Registration

Context:
- Database is set up and running
- Need to implement user registration API and UI

Task: Create complete registration flow

Please implement:
1. lib/auth/password.ts - Password hashing utilities (bcrypt)
2. lib/validations/auth.ts - Zod schema for registration
3. server/routes/auth.ts - Registration endpoint (POST /api/auth/register)
4. app/api/[[...route]]/route.ts - Hono integration with Next.js
5. app/(auth)/register/page.tsx - Registration page UI
6. components/auth/register-form.tsx - Registration form component

Reference:
- api-specification.md (for endpoint contract)
- implementation-guide.md (for code examples)
- sprint-1-foundation-authentication.md (US-1.3 tasks)

Success: User can register, password is hashed, JWT token returned
```

### Sprint 2: Core Task Management

#### **Session Example: Task Creation (US-2.1)**

**Prompt Template:**
```
Starting Sprint 2, User Story 2.1: Task Creation

Context:
- Sprint 1 complete (auth working)
- User can login and is authenticated
- Need to implement task creation

Task: Build task creation feature

Please implement:
1. lib/validations/task.ts - Zod schema for task creation
2. server/routes/tasks.ts - POST /api/tasks endpoint
3. components/tasks/task-form.tsx - Task creation form
4. Update app/(dashboard)/page.tsx - Add "New Task" button

Reference:
- database-schema-design.md (tasks table schema)
- api-specification.md (POST /api/tasks contract)
- sprint-2-core-task-management.md (US-2.1 tasks)

Include:
- Title (required), description (optional)
- Priority selector (Low/Medium/High)
- Status selector (Todo/In Progress/Completed)
- Date pickers for start/due dates
- Form validation with Zod

Success: User can create task, it appears in database, form validates
```

---

## 📝 Example Prompts for Common Scenarios

### Scenario 1: Starting a New User Story

```
I'm implementing [Sprint X, User Story X.X: Story Name]

Current state: [What's already done]

Task: [What needs to be built]

Please implement according to:
- [sprint-file.md] for tasks and acceptance criteria
- [technical-doc.md] for architecture
- [api-spec.md] for API contracts

Specific requirements:
- [List any specific requirements]

Success criteria:
- [List acceptance criteria from sprint file]
```

### Scenario 2: Debugging/Fixing Issues

```
I'm working on [Feature Name] from [Sprint File]

Issue: [Describe the problem]

Current code: [Mention files or paste relevant code]

Expected behavior: [What should happen]

Please:
1. Identify the issue
2. Suggest a fix
3. Implement the fix
4. Explain what was wrong

Reference: [Relevant documentation]
```

### Scenario 3: Implementing API Endpoint

```
Implementing API endpoint: [METHOD /api/path]

Reference: api-specification.md section [X.X]

Please create:
1. Route handler in server/routes/[name].ts
2. Zod validation schema in lib/validations/[name].ts
3. Database queries using Drizzle ORM
4. Error handling
5. Response formatting

Requirements from API spec:
- Request: [Copy from api-spec]
- Response: [Copy from api-spec]
- Validation: [Copy rules]

Success: Endpoint returns correct response, validation works, errors handled
```

### Scenario 4: Building UI Component

```
Building UI component: [Component Name]

Purpose: [What it does]

Reference: 
- sprint-[x]-[name].md for requirements
- implementation-guide.md for code patterns

Please create: components/[path]/[name].tsx

Requirements:
- Use shadcn/ui components: [list components]
- Props: [list props]
- State management: [React Query/useState/etc]
- Styling: Tailwind CSS
- Responsive design

Features:
- [List features from sprint file]

Success: Component renders, all features work, responsive on mobile
```

### Scenario 5: Reviewing/Refactoring Code

```
I've implemented [Feature Name] but want to improve it.

Current implementation: [File paths or paste code]

Please review and suggest improvements for:
1. Code quality and TypeScript types
2. Performance optimization
3. Error handling
4. Accessibility
5. Best practices

Reference: implementation-guide.md for code standards

Then implement the improvements.
```

---

## 🎯 Context Giving Strategies

### Strategy 1: Progressive Disclosure

Start with minimal context, add more as needed:

**Initial Prompt:**
```
I'm implementing Sprint 1, US-1.3 (User Registration).
Please create the registration API endpoint.
```

**If agent asks for details:**
```
Here's the API specification:
[Paste relevant section from api-specification.md]
```

**If agent needs schema:**
```
Here's the database schema:
[Paste users table from database-schema-design.md]
```

### Strategy 2: Full Context Upfront

Provide everything at once:

```
I'm implementing User Registration (Sprint 1, US-1.3)

CONTEXT:
- Project: Todo App with Next.js + Hono + Drizzle
- Current state: Database set up, project initialized
- Goal: Complete user registration flow

ARCHITECTURE:
[Paste relevant section from technical-architecture-document.md]

API SPECIFICATION:
[Paste POST /api/auth/register from api-specification.md]

DATABASE SCHEMA:
[Paste users table from database-schema-design.md]

TASKS (from sprint file):
- Create password hashing utilities
- Create Zod validation schema
- Create API endpoint
- Create registration page UI
- Create registration form component

Please implement all of the above.
```

### Strategy 3: Reference by File (Most Efficient)

```
I'm implementing Sprint 1, US-1.3 (User Registration)

Please reference these files I have open:
- sprint-1-foundation-authentication.md (lines 150-250 for US-1.3)
- api-specification.md (POST /api/auth/register section)
- database-schema-design.md (users table)
- implementation-guide.md (Sprint 1 code examples)

Implement the registration flow following the tasks in the sprint file.
```

---

## 🔧 Troubleshooting

### Problem: Agent doesn't follow the architecture

**Solution:**
```
Please follow the exact architecture from technical-architecture-document.md

Specifically:
- File structure: [paste structure]
- Technology choices: [list tech stack]
- Patterns: [mention patterns]

Let me know if anything is unclear about the architecture.
```

### Problem: Agent creates different API contracts

**Solution:**
```
Please follow the EXACT API specification from api-specification.md

For POST /api/auth/register:
- Request body: [paste from spec]
- Response: [paste from spec]
- Status codes: [paste from spec]

Do not deviate from this contract.
```

### Problem: Agent skips validation

**Solution:**
```
Validation is critical. Please implement:

1. Zod schema in lib/validations/[name].ts
2. Use schema in API endpoint
3. Return validation errors in format from api-specification.md

Reference: api-specification.md error response format
```

### Problem: Code doesn't match sprint tas