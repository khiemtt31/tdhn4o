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

### Problem: Code doesn't match sprint tasks

**Solution:**
```
Please complete ALL tasks from sprint-[x]-[name].md, User Story [X.X]

Tasks to complete:
[Copy checkbox list from sprint file]

Check off each task as you implement it.
```

---

## ✅ Best Practices

### 1. **Work Sprint by Sprint**
- Complete one sprint before moving to next
- Follow the order in sprint files
- Check off tasks as you go

### 2. **One User Story at a Time**
- Don't try to implement entire sprint at once
- Focus on one user story
- Verify acceptance criteria before moving on

### 3. **Provide Clear Success Criteria**
Always tell the agent how to verify success:
```
Success criteria:
- [ ] User can register with email/password
- [ ] Password is hashed (check database)
- [ ] JWT token returned
- [ ] Duplicate emails rejected
- [ ] Validation errors shown
```

### 4. **Reference Documentation Consistently**
Always mention which docs to follow:
```
Reference:
- sprint-1-foundation-authentication.md (tasks)
- api-specification.md (contracts)
- database-schema-design.md (schema)
```

### 5. **Be Specific About Files**
Tell the agent exactly which files to create/modify:
```
Please create:
- lib/auth/password.ts
- lib/validations/auth.ts
- server/routes/auth.ts

Please modify:
- app/api/[[...route]]/route.ts (add auth routes)
```

### 6. **Ask for Explanations**
```
After implementing, please explain:
1. How the authentication flow works
2. Why you chose this approach
3. Any security considerations
4. How to test it
```

### 7. **Verify Against Documentation**
```
Please verify your implementation matches:
- API specification (request/response format)
- Database schema (table structure)
- Sprint acceptance criteria (all requirements met)
```

### 8. **Iterate and Refine**
```
First pass: Implement basic functionality
Second pass: Add error handling
Third pass: Add validation
Fourth pass: Polish UI/UX
```

---

## 📊 Session Planning Template

Use this template to plan each coding session:

```
SESSION: [Date] - [Sprint X, User Story X.X]

GOAL: [What to accomplish]

CONTEXT NEEDED:
- [ ] Sprint file: [filename]
- [ ] Architecture doc: [section]
- [ ] API spec: [endpoints]
- [ ] Database schema: [tables]
- [ ] Implementation guide: [examples]

TASKS TO COMPLETE:
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

ACCEPTANCE CRITERIA:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

FILES TO CREATE/MODIFY:
- [ ] [file path]
- [ ] [file path]

VERIFICATION STEPS:
1. [How to test]
2. [What to check]

PROMPT TO USE:
[Write your prompt here using CRISP framework]
```

---

## 🎓 Learning Path

### Week 1-2 (Sprint 1)
**Focus:** Learn how to guide agent for setup and architecture

**Key Skills:**
- Providing architectural context
- Referencing documentation
- Verifying setup steps

**Practice Prompts:**
- "Set up Next.js project following our architecture"
- "Create database schema from our design doc"
- "Implement authentication following API spec"

### Week 3-4 (Sprint 2)
**Focus:** Learn how to guide agent for feature implementation

**Key Skills:**
- Breaking down features into tasks
- Providing API contracts
- Verifying functionality

**Practice Prompts:**
- "Implement task CRUD following sprint file"
- "Create task form with validation"
- "Add error handling to API endpoints"

### Week 5-6 (Sprint 3)
**Focus:** Learn how to guide agent for complex features

**Key Skills:**
- Coordinating multiple components
- Managing state
- Optimizing performance

**Practice Prompts:**
- "Implement tag system with autocomplete"
- "Add filtering with multiple criteria"
- "Optimize database queries for performance"

### Week 7-8 (Sprint 4)
**Focus:** Learn how to guide agent for polish and optimization

**Key Skills:**
- UI/UX refinement
- Performance optimization
- Accessibility improvements

**Practice Prompts:**
- "Add animations following design system"
- "Optimize bundle size and performance"
- "Ensure WCAG 2.1 AA compliance"

---

## 📚 Quick Reference Card

### Essential Prompts

**Starting a User Story:**
```
Implementing [Sprint X, US-X.X: Name]
Reference: [sprint-file.md]
Task: [What to build]
Success: [Acceptance criteria]
```

**Creating a File:**
```
Create [file path]
Purpose: [What it does]
Reference: [doc section]
Requirements: [List requirements]
```

**Fixing a Bug:**
```
Issue: [Description]
Expected: [What should happen]
Current: [What's happening]
Files: [Relevant files]
Please fix and explain
```

**Reviewing Code:**
```
Review [file/feature]
Check: Quality, Performance, Security, Accessibility
Suggest improvements
Implement fixes
```

---

## 🎯 Success Metrics

Track your effectiveness in guiding the agent:

### Good Signs ✅
- Agent implements exactly what's in sprint file
- Code matches architecture document
- API contracts followed precisely
- All acceptance criteria met
- Minimal back-and-forth needed

### Warning Signs ⚠️
- Agent creates different architecture
- API contracts don't match spec
- Missing validation or error handling
- Skips tasks from sprint file
- Requires many clarifications

### How to Improve
1. **Be more specific** in prompts
2. **Reference docs explicitly**
3. **Provide complete context** upfront
4. **Verify against documentation** after each implementation
5. **Ask agent to explain** their approach

---

## 💡 Pro Tips

### Tip 1: Use Checkboxes
Copy task checkboxes from sprint files into your prompts:
```
Please complete these tasks:
- [ ] Create API endpoint
- [ ] Add validation
- [ ] Create UI component
- [ ] Add error handling
```

### Tip 2: Reference Line Numbers
```
Implement the schema from database-schema-design.md, lines 150-200
```

### Tip 3: Ask for Verification
```
After implementing, please verify:
1. All tasks from sprint file completed
2. Acceptance criteria met
3. Code follows architecture doc
4. API matches specification
```

### Tip 4: Request Documentation
```
After implementing, please update:
1. README with new setup steps
2. Code comments for complex logic
3. API documentation if endpoints changed
```

### Tip 5: Incremental Implementation
```
Let's implement this in stages:
Stage 1: Basic functionality (no validation)
Stage 2: Add validation
Stage 3: Add error handling
Stage 4: Add UI polish

Start with Stage 1.
```

---

## 📖 Example: Complete Session

Here's a complete example of guiding an agent through one user story:

```
Hi! I'm ready to implement Sprint 1, User Story 1.3: User Registration

CONTEXT:
- Project: Personal Todo App
- Tech Stack: Next.js 15 + Hono.js + Drizzle ORM + PostgreSQL
- Current State: Project initialized, database set up and running
- Sprint: Sprint 1 - Foundation & Authentication
- User Story: US-1.3 (Story Points: 8)

OBJECTIVE:
Implement complete user registration flow (API + UI)

REFERENCE DOCUMENTS:
Please follow these documents I have open:
1. sprint-1-foundation-authentication.md (US-1.3, lines 150-250)
2. api-specification.md (POST /api/auth/register section)
3. database-schema-design.md (users table definition)
4. implementation-guide.md (Sprint 1, Week 2 code examples)

TASKS TO IMPLEMENT:
From sprint-1-foundation-authentication.md, US-1.3:

- [ ] Create registration API endpoint (POST /api/auth/register)
- [ ] Implement password hashing with bcrypt
- [ ] Add email validation and uniqueness check
- [ ] Create registration page UI
- [ ] Build registration form with shadcn/ui components
- [ ] Add client-side validation
- [ ] Implement error handling and user feedback
- [ ] Add password strength indicator

SPECIFIC REQUIREMENTS:

1. Password Hashing (lib/auth/password.ts):
   - Use bcrypt with cost factor 12
   - Export hashPassword() and verifyPassword()

2. Validation (lib/validations/auth.ts):
   - Zod schema for registration
   - Email: valid format, unique
   - Password: min 8 chars, uppercase, lowercase, number, special char
   - Full name: min 2 chars, max 255 chars

3. API Endpoint (server/routes/auth.ts):
   - POST /api/auth/register
   - Request/response format from api-specification.md
   - Return JWT token on success
   - Set HTTP-only cookie

4. UI (app/(auth)/register/page.tsx):
   - Clean, centered form
   - Fields: email, password, confirm password, full name
   - Use shadcn/ui form components
   - Password visibility toggle
   - Link to login page

ACCEPTANCE CRITERIA:
✓ User can register with email, password, and full name
✓ Passwords are hashed before storage
✓ Duplicate emails are rejected with clear error
✓ Form validates input before submission
✓ Success message shown on successful registration
✓ User redirected to login page after registration
✓ Password strength indicator works

SUCCESS VERIFICATION:
After implementation, I should be able to:
1. Navigate to /register
2. Fill in the form
3. Submit and see user created in database (password hashed)
4. See JWT token in cookies
5. Be redirected to login page

Please implement all of the above, following the exact specifications from the reference documents.

After implementing, please:
1. Explain the authentication flow
2. Show me how to test it
3. Confirm all acceptance criteria are met
```

**Agent Response Would:**
1. Create all required files
2. Implement all functionality
3. Follow exact specifications
4. Explain the implementation
5. Provide testing instructions

---

## 🎉 Conclusion

### Key Takeaways

1. **Documentation is Your Blueprint** - Reference it constantly
2. **Be Specific** - Clear instructions = better results
3. **Verify Everything** - Check against acceptance criteria
4. **Iterate** - Start simple, add complexity
5. **Learn and Adapt** - Improve your prompts over time

### Your Documentation Advantage

You have:
- ✅ Complete product requirements
- ✅ Detailed technical architecture
- ✅ Sprint-by-sprint breakdown
- ✅ Task-level checklists
- ✅ API contracts
- ✅ Database schema
- ✅ Code examples

This is **everything** an agent needs to build your project correctly.

### Next Steps

1. **Start with Sprint 1, US-1.1**
2. **Use the prompt templates** from this guide
3. **Reference your documentation** consistently
4. **Check off tasks** as you complete them
5. **Verify acceptance criteria** before moving on

---

**Happy Coding!** 🚀

You're now equipped to effectively guide an AI agent through your entire project implementation. Remember: clear communication + good documentation = successful project delivery.

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-20  
**Next Review:** After Sprint 1 completion
