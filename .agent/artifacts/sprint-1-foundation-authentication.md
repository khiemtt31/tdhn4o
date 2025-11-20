# Sprint 1: Foundation & Authentication
## Personal Task Management System

**Sprint Duration:** 2025-11-20 to 2025-12-03 (2 weeks / 10 working days)  
**Sprint Goal:** Establish solid technical foundation with secure authentication  
**Total Story Points:** 34  
**Team Velocity:** Baseline sprint  

---

## 🎯 Sprint Objectives

- ✅ Set up development environment
- ✅ Configure database and ORM
- ✅ Implement complete authentication flow
- ✅ Create basic application structure
- ✅ Establish security best practices

---

## 📊 Sprint Overview

| Metric | Value |
|--------|-------|
| **User Stories** | 6 |
| **Story Points** | 34 |
| **Estimated Velocity** | 30-35 points |
| **Priority** | P0 (Critical) |
| **Dependencies** | None (Foundation sprint) |

---

## 📋 User Stories

### US-1.1: Project Setup & Configuration
**Story:** As a developer, I need to set up the project infrastructure so that I can start building features.

**Priority:** P0 (Critical)  
**Story Points:** 3  
**Assignee:** Development Team  

#### Tasks
- [ ] Initialize Next.js project with App Router
  - Run `npx create-next-app@latest . --typescript --tailwind --app`
  - Configure TypeScript settings
  - Verify Next.js runs on localhost:3000
  
- [ ] Configure TypeScript and ESLint
  - Set up strict TypeScript mode
  - Configure ESLint rules
  - Add Prettier for code formatting
  - Create `.eslintrc.json` and `.prettierrc`
  
- [ ] Install and configure shadcn/ui
  - Run `npx shadcn-ui@latest init`
  - Configure theme colors
  - Set up CSS variables
  - Test component installation
  
- [ ] Set up Tailwind CSS with custom theme
  - Configure `tailwind.config.ts`
  - Add custom colors and fonts
  - Set up responsive breakpoints
  - Test Tailwind utilities
  
- [ ] Create project folder structure
  ```
  app/
  ├── (auth)/
  ├── (dashboard)/
  └── api/
  components/
  ├── ui/
  ├── auth/
  ├── tasks/
  └── tags/
  lib/
  ├── db/
  ├── auth/
  └── validations/
  server/
  ├── routes/
  └── middleware/
  types/
  ```
  
- [ ] Set up Git repository and .gitignore
  - Initialize Git repository
  - Create comprehensive `.gitignore`
  - Make initial commit
  - Set up branch protection (if team)
  
- [ ] Create environment variable templates
  - Create `.env.example`
  - Document all required variables
  - Add `.env.local` to `.gitignore`

#### Acceptance Criteria
- ✓ Next.js app runs on localhost:3000
- ✓ TypeScript compilation works without errors
- ✓ shadcn/ui components can be imported
- ✓ Tailwind CSS styling applies correctly
- ✓ Folder structure follows best practices
- ✓ Git repository initialized with proper .gitignore
- ✓ Environment template documented

#### Definition of Done
- [ ] Code committed to Git
- [ ] README updated with setup instructions
- [ ] No console errors or warnings
- [ ] Team can clone and run project

---

### US-1.2: Database Setup
**Story:** As a developer, I need to set up PostgreSQL database so that I can store application data.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Create docker-compose.yml for PostgreSQL
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
  volumes:
    postgres_data:
  ```
  
- [ ] Install Drizzle ORM and dependencies
  - `npm install drizzle-orm postgres`
  - `npm install -D drizzle-kit`
  - Configure `drizzle.config.ts`
  
- [ ] Configure database connection
  - Create `lib/db/index.ts`
  - Set up connection pooling
  - Add environment variables
  - Test connection
  
- [ ] Create database schema (users, tasks, tags, taskTags tables)
  - Create `lib/db/schema.ts`
  - Define `users` table with auth fields
  - Define `tasks` table with all fields
  - Define `tags` table
  - Define `task_tags` junction table
  - Add enums for status and priority
  
- [ ] Set up database migrations
  - Configure Drizzle Kit
  - Generate initial migration
  - Create migration scripts in package.json
  - Document migration process
  
- [ ] Create database indexes for performance
  - Index on `users.email`
  - Index on `tasks.user_id`
  - Index on `tasks.due_date`
  - Index on `tasks.status`
  - Index on `tags.user_id`
  - Index on `task_tags.tag_id`
  
- [ ] Test database connection and queries
  - Start PostgreSQL container
  - Run migrations
  - Test basic queries
  - Verify indexes created

#### Acceptance Criteria
- ✓ PostgreSQL runs in Docker container
- ✓ Database connection successful
- ✓ All tables created with correct schema
- ✓ Migrations can be run and rolled back
- ✓ Indexes created on appropriate columns
- ✓ Drizzle Studio can view database

#### Definition of Done
- [ ] Docker container starts successfully
- [ ] Migrations applied without errors
- [ ] Schema matches design document
- [ ] Connection pooling configured
- [ ] Documentation updated

---

### US-1.3: User Registration
**Story:** As a new user, I want to create an account so that I can use the task management system.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create registration API endpoint (`POST /api/auth/register`)
  - Set up Hono router in `server/routes/auth.ts`
  - Create registration handler
  - Integrate with Next.js API routes
  
- [ ] Implement password hashing with bcrypt
  - Install bcrypt: `npm install bcryptjs @types/bcryptjs`
  - Create `lib/auth/password.ts`
  - Implement `hashPassword()` function
  - Set cost factor to 12
  
- [ ] Add email validation and uniqueness check
  - Create Zod schema in `lib/validations/auth.ts`
  - Validate email format
  - Check for existing user in database
  - Return appropriate error messages
  
- [ ] Create registration page UI
  - Create `app/(auth)/register/page.tsx`
  - Design clean, centered form layout
  - Add responsive styling
  - Include link to login page
  
- [ ] Build registration form with shadcn/ui components
  - Install form components: `npx shadcn-ui@latest add form input button label`
  - Use React Hook Form
  - Add form fields: email, password, confirm password, full name
  - Style with Tailwind CSS
  
- [ ] Add client-side validation
  - Validate email format
  - Check password strength
  - Confirm password match
  - Show validation errors inline
  
- [ ] Implement error handling and user feedback
  - Display API errors
  - Show success message
  - Add loading states
  - Use toast notifications
  
- [ ] Add password strength indicator
  - Visual indicator (weak/medium/strong)
  - Real-time feedback
  - Color-coded display

#### Acceptance Criteria
- ✓ User can register with email, password, and full name
- ✓ Passwords are hashed before storage (never plain text)
- ✓ Duplicate emails are rejected with clear error
- ✓ Form validates input before submission
- ✓ Success message shown on successful registration
- ✓ User redirected to login page after registration
- ✓ Password strength indicator works
- ✓ All validation errors are user-friendly

#### Definition of Done
- [ ] API endpoint tested with valid/invalid data
- [ ] UI is responsive on mobile/tablet/desktop
- [ ] Error messages are clear and helpful
- [ ] No passwords stored in plain text
- [ ] Code follows TypeScript best practices

---

### US-1.4: User Login
**Story:** As a registered user, I want to log in to my account so that I can access my tasks.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create login API endpoint (`POST /api/auth/login`)
  - Add login handler to `server/routes/auth.ts`
  - Verify user credentials
  - Handle invalid credentials
  
- [ ] Implement JWT token generation
  - Install JWT: `npm install jsonwebtoken @types/jsonwebtoken`
  - Create `lib/auth/jwt.ts`
  - Implement `signToken()` function
  - Set expiration to 7 days
  - Use secure secret from environment
  
- [ ] Set up HTTP-only cookie for token storage
  - Use Hono's `setCookie()` helper
  - Set `httpOnly: true`
  - Set `secure: true` in production
  - Set `sameSite: 'Lax'`
  - Set `maxAge: 7 days`
  
- [ ] Create login page UI
  - Create `app/(auth)/login/page.tsx`
  - Design clean, centered form
  - Match registration page styling
  - Add link to registration page
  
- [ ] Build login form with validation
  - Use React Hook Form
  - Add email and password fields
  - Validate on submit
  - Show validation errors
  
- [ ] Add password visibility toggle
  - Eye icon to show/hide password
  - Toggle between password/text input type
  - Accessible button
  
- [ ] Implement error handling for invalid credentials
  - Show "Invalid email or password" message
  - Don't reveal which field is wrong (security)
  - Clear form on error
  - Focus on email field
  
- [ ] Add "Remember me" functionality
  - Checkbox in form
  - Extend token expiration if checked
  - Store preference

#### Acceptance Criteria
- ✓ User can log in with valid credentials
- ✓ JWT token generated and stored in HTTP-only cookie
- ✓ Invalid credentials show clear error message
- ✓ User redirected to dashboard on successful login
- ✓ Session persists across page refreshes
- ✓ Password visibility toggle works
- ✓ "Remember me" extends session
- ✓ Error messages don't reveal security info

#### Definition of Done
- [ ] Login flow tested end-to-end
- [ ] JWT token properly signed and verified
- [ ] Cookie settings secure
- [ ] UI matches design standards
- [ ] No security vulnerabilities

---

### US-1.5: Authentication Middleware
**Story:** As a developer, I need to protect routes so that only authenticated users can access them.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Create JWT verification middleware
  - Create `lib/auth/middleware.ts`
  - Implement `verifyToken()` function
  - Extract token from cookie
  - Verify signature and expiration
  
- [ ] Implement token validation logic
  - Check token exists
  - Verify JWT signature
  - Check expiration
  - Validate user still exists in database
  
- [ ] Create protected route wrapper
  - Create middleware for Hono routes
  - Add user info to request context
  - Return 401 if unauthorized
  
- [ ] Add logout endpoint (`POST /api/auth/logout`)
  - Clear authentication cookie
  - Return success message
  - Handle already logged out state
  
- [ ] Implement session management
  - Store user ID in context
  - Make user info available to routes
  - Handle token refresh (future)
  
- [ ] Add automatic redirect to login for unauthenticated users
  - Create Next.js middleware
  - Check authentication on protected routes
  - Redirect to /login if not authenticated
  - Preserve intended destination
  
- [ ] Create "Get current user" endpoint (`GET /api/auth/me`)
  - Return current user info
  - Use auth middleware
  - Return user without password hash

#### Acceptance Criteria
- ✓ Protected routes require valid JWT token
- ✓ Invalid/expired tokens redirect to login
- ✓ Logout clears session and redirects to login
- ✓ Current user info can be retrieved
- ✓ Token expiration handled gracefully
- ✓ Middleware doesn't block public routes
- ✓ User context available in protected routes

#### Definition of Done
- [ ] All protected routes use middleware
- [ ] Unauthorized access properly handled
- [ ] Logout functionality works
- [ ] No token leakage in responses
- [ ] Security best practices followed

---

### US-1.6: Basic Layout & Navigation
**Story:** As a user, I want a consistent layout so that I can navigate the application easily.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Create root layout component
  - Create `app/layout.tsx`
  - Add HTML structure
  - Include fonts (Google Fonts)
  - Set up metadata
  
- [ ] Build header/navbar with user info
  - Create `components/layout/header.tsx`
  - Show app logo/title
  - Display user name when logged in
  - Add navigation links
  - Make responsive
  
- [ ] Add logout button
  - Add button to header
  - Call logout API
  - Redirect to login
  - Show loading state
  
- [ ] Create dashboard layout
  - Create `app/(dashboard)/layout.tsx`
  - Add sidebar (optional)
  - Include header
  - Set up main content area
  
- [ ] Implement responsive navigation
  - Mobile hamburger menu
  - Tablet/desktop horizontal nav
  - Smooth transitions
  - Accessible keyboard navigation
  
- [ ] Add loading states
  - Create loading.tsx files
  - Add skeleton screens
  - Show spinners during navigation
  - Use Suspense boundaries
  
- [ ] Create error boundary components
  - Create error.tsx files
  - Handle errors gracefully
  - Show user-friendly messages
  - Add retry functionality

#### Acceptance Criteria
- ✓ Consistent header across all pages
- ✓ User name displayed in header when logged in
- ✓ Logout button works correctly
- ✓ Layout is responsive on mobile/tablet/desktop
- ✓ Loading states show during navigation
- ✓ Error boundaries catch and display errors
- ✓ Navigation is keyboard accessible

#### Definition of Done
- [ ] Layout tested on all screen sizes
- [ ] Navigation works on all devices
- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Accessibility verified

---

## 📈 Sprint Metrics

### Story Points Breakdown
| Story | Points | Priority | Complexity |
|-------|--------|----------|------------|
| US-1.1: Project Setup | 3 | P0 | Low |
| US-1.2: Database Setup | 5 | P0 | Medium |
| US-1.3: User Registration | 8 | P0 | High |
| US-1.4: User Login | 8 | P0 | High |
| US-1.5: Auth Middleware | 5 | P0 | Medium |
| US-1.6: Basic Layout | 5 | P0 | Medium |
| **TOTAL** | **34** | **All P0** | **Mixed** |

### Daily Velocity Target
- **Total Points:** 34
- **Working Days:** 10
- **Daily Target:** ~3.4 points/day
- **Buffer:** 10% (3-4 points)

---

## ✅ Definition of Done

### Code Quality
- [ ] All code committed to Git with meaningful messages
- [ ] TypeScript compilation with no errors
- [ ] ESLint passes with no warnings
- [ ] Code formatted with Prettier
- [ ] No console errors in browser

### Functionality
- [ ] All features tested manually
- [ ] Authentication flow works end-to-end
- [ ] Database operations successful
- [ ] No critical bugs
- [ ] Error handling implemented

### Documentation
- [ ] Environment variables documented in .env.example
- [ ] README updated with setup instructions
- [ ] Database migrations documented
- [ ] API endpoints documented (if applicable)

### Security
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens properly signed
- [ ] HTTP-only cookies configured
- [ ] No sensitive data in logs
- [ ] Input validation implemented

---

## 🎯 Sprint Deliverables

At the end of Sprint 1, we will have:

### ✅ Infrastructure
- Fully configured Next.js application
- PostgreSQL database running in Docker
- Drizzle ORM configured with migrations
- Project structure established

### ✅ Authentication System
- User registration functionality
- User login functionality
- JWT-based authentication
- Protected routes
- Session management
- Logout functionality

### ✅ User Interface
- Registration page
- Login page
- Basic application layout
- Responsive header/navigation
- Loading and error states

### ✅ Security
- Password hashing
- Secure token storage
- Protected API routes
- Input validation

---

## 🚧 Sprint Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Docker setup issues | High | Medium | Provide detailed setup guide, test on multiple machines |
| Authentication complexity | High | Medium | Use established libraries (bcrypt, JWT), follow best practices |
| Time estimation accuracy | Medium | High | This is baseline sprint, adjust velocity for future sprints |
| Database migration issues | Medium | Low | Test migrations thoroughly, keep backups |

---

## 📝 Sprint Notes

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed
- Code editor (VS Code recommended)

### Environment Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start database
docker-compose up -d

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

### Key Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "hono": "^4.0.0",
    "drizzle-orm": "latest",
    "postgres": "latest",
    "bcryptjs": "latest",
    "jsonwebtoken": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest",
    "@types/bcryptjs": "latest",
    "@types/jsonwebtoken": "latest",
    "typescript": "^5.0.0"
  }
}
```

---

## 🔄 Sprint Ceremonies

### Daily Standup (Async for Solo)
- What did I complete yesterday?
- What will I work on today?
- Any blockers?

### Sprint Review (End of Sprint)
- Demo all completed features
- Verify all acceptance criteria met
- Document any incomplete items

### Sprint Retrospective
- What went well?
- What could be improved?
- Action items for next sprint

---

## 📊 Progress Tracking

### Day-by-Day Plan

**Days 1-2:** Project Setup & Database
- [ ] US-1.1: Project Setup (3 points)
- [ ] US-1.2: Database Setup (5 points)

**Days 3-5:** User Registration
- [ ] US-1.3: User Registration (8 points)

**Days 6-8:** User Login
- [ ] US-1.4: User Login (8 points)

**Days 9-10:** Middleware & Layout
- [ ] US-1.5: Auth Middleware (5 points)
- [ ] US-1.6: Basic Layout (5 points)

---

## 🎉 Sprint Success Criteria

Sprint 1 is considered successful when:
- ✅ All 6 user stories completed
- ✅ 34 story points delivered
- ✅ Users can register and login
- ✅ Authentication system secure and functional
- ✅ Database operational with all tables
- ✅ Basic UI layout in place
- ✅ No critical bugs
- ✅ Code quality standards met

---

**Sprint Status:** 📅 Ready to Start  
**Next Sprint:** Sprint 2 - Core Task Management  
**Last Updated:** 2025-11-20
