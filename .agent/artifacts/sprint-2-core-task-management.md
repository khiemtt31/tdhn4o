# Sprint 2: Core Task Management
## Personal Task Management System

**Sprint Duration:** 2025-12-04 to 2025-12-17 (2 weeks / 10 working days)  
**Sprint Goal:** Implement complete CRUD operations for tasks with intuitive UI  
**Total Story Points:** 39  
**Team Velocity:** 35-40 points (adjusted from Sprint 1)  

---

## 🎯 Sprint Objectives

- ✅ Build task creation functionality
- ✅ Implement task listing and viewing
- ✅ Add task editing capabilities
- ✅ Enable task deletion with confirmation
- ✅ Create intuitive task UI components
- ✅ Implement status management

---

## 📊 Sprint Overview

| Metric | Value |
|--------|-------|
| **User Stories** | 6 |
| **Story Points** | 39 |
| **Estimated Velocity** | 35-40 points |
| **Priority** | P0 (Critical) |
| **Dependencies** | Sprint 1 (Auth system) |

---

## 📋 User Stories

### US-2.1: Task Creation
**Story:** As a user, I want to create new tasks so that I can track my work.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create task creation API endpoint (`POST /api/tasks`)
  - Create `server/routes/tasks.ts`
  - Implement POST handler
  - Use auth middleware to get user ID
  - Return created task with ID
  
- [ ] Implement Zod validation schema for tasks
  - Create `lib/validations/task.ts`
  - Define task creation schema
  - Validate title (required, max 200 chars)
  - Validate description (optional, max 2000 chars)
  - Validate dates (due date after start date)
  - Validate priority and status enums
  
- [ ] Build task creation form/modal
  - Create `components/tasks/task-form.tsx`
  - Use Dialog component from shadcn/ui
  - Make reusable for create and edit
  - Add responsive design
  
- [ ] Add title and description fields
  - Title input (required)
  - Description textarea (optional)
  - Character count indicators
  - Auto-focus on title
  
- [ ] Implement priority selector
  - Dropdown/Select component
  - Options: Low, Medium, High
  - Visual indicators (colors)
  - Default to Medium
  
- [ ] Add status selector
  - Dropdown/Select component
  - Options: Todo, In Progress, Completed
  - Default to Todo
  - Color-coded options
  
- [ ] Create date pickers for start/due dates
  - Install Calendar component
  - Start date picker (optional)
  - Due date picker (optional)
  - Validate due date > start date
  - Time selection (optional)
  
- [ ] Add form validation
  - Client-side validation with Zod
  - Show validation errors inline
  - Prevent submission if invalid
  - Clear error messages
  
- [ ] Implement optimistic UI updates
  - Add task to list immediately
  - Show loading state
  - Rollback on error
  - Use React Query mutations

#### Acceptance Criteria
- ✓ User can create task with title (required)
- ✓ Description, dates, priority are optional
- ✓ Form validates input before submission
- ✓ Task appears immediately in task list
- ✓ Success notification shown
- ✓ Form resets after successful creation
- ✓ Date validation works (due after start)
- ✓ All fields have proper labels

#### Definition of Done
- [ ] API endpoint tested with valid/invalid data
- [ ] Form validation works correctly
- [ ] UI is responsive and accessible
- [ ] Optimistic updates implemented
- [ ] Error handling in place

---

### US-2.2: Task Listing
**Story:** As a user, I want to see all my tasks so that I can manage them effectively.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create task list API endpoint (`GET /api/tasks`)
  - Implement GET handler in tasks route
  - Filter by authenticated user
  - Return tasks with tags
  - Support basic filtering
  
- [ ] Implement database query for user tasks
  - Use Drizzle ORM query builder
  - Join with tags table
  - Order by created date (desc)
  - Optimize with proper indexes
  
- [ ] Build task list UI component
  - Create `components/tasks/task-list.tsx`
  - Use React Query for data fetching
  - Show loading skeleton
  - Handle empty state
  - Make responsive (grid/list)
  
- [ ] Create task card component
  - Create `components/tasks/task-card.tsx`
  - Show task title prominently
  - Display status badge
  - Show priority indicator
  - Display due date if set
  - Show tags as badges
  - Add hover effects
  
- [ ] Display task title, status, priority, due date
  - Title as heading
  - Status as colored badge
  - Priority as icon or color
  - Due date formatted (e.g., "Due in 3 days")
  - Overdue indicator
  
- [ ] Add empty state for no tasks
  - Friendly illustration or icon
  - Helpful message
  - "Create your first task" button
  - Center aligned
  
- [ ] Implement loading state
  - Skeleton cards while loading
  - Smooth transition to content
  - Loading spinner for actions
  
- [ ] Add pagination or infinite scroll
  - Implement pagination (20 tasks/page)
  - Page controls (prev/next)
  - Show total count
  - Consider infinite scroll for future

#### Acceptance Criteria
- ✓ All user tasks displayed in list
- ✓ Tasks show key information clearly
- ✓ Empty state shown when no tasks exist
- ✓ Loading indicator during data fetch
- ✓ List updates when tasks are created/updated
- ✓ Performance maintained with 100+ tasks
- ✓ Responsive on all screen sizes

#### Definition of Done
- [ ] API returns correct data
- [ ] UI renders all task information
- [ ] Loading and empty states work
- [ ] Performance tested with many tasks
- [ ] Responsive design verified

---

### US-2.3: Task Viewing
**Story:** As a user, I want to view full task details so that I can see all information.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Create single task API endpoint (`GET /api/tasks/:id`)
  - Implement GET by ID handler
  - Verify task belongs to user
  - Return 404 if not found
  - Include all task fields and tags
  
- [ ] Build task detail modal/page
  - Create task detail view
  - Use Dialog or separate page
  - Show all task information
  - Make scrollable if long
  
- [ ] Display all task fields
  - Title (large, prominent)
  - Description (formatted)
  - Status badge
  - Priority indicator
  - Start date (if set)
  - Due date (if set)
  - Tags list
  
- [ ] Show creation and update timestamps
  - "Created on [date]"
  - "Last updated [time ago]"
  - Format dates nicely
  - Use relative time (e.g., "2 hours ago")
  
- [ ] Add visual status indicators
  - Color-coded status
  - Icons for priority
  - Overdue warning
  - Completion checkmark
  
- [ ] Implement responsive design
  - Mobile: Full screen modal
  - Tablet/Desktop: Centered modal
  - Proper spacing and typography
  - Touch-friendly buttons

#### Acceptance Criteria
- ✓ Clicking task opens detail view
- ✓ All task information displayed
- ✓ Timestamps formatted correctly
- ✓ Modal/page is responsive
- ✓ Close button returns to task list
- ✓ Visual indicators clear and helpful

#### Definition of Done
- [ ] Detail view shows all data
- [ ] Responsive on all devices
- [ ] Timestamps display correctly
- [ ] Navigation works smoothly
- [ ] Accessibility verified

---

### US-2.4: Task Editing
**Story:** As a user, I want to edit my tasks so that I can update information.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create task update API endpoint (`PATCH /api/tasks/:id`)
  - Implement PATCH handler
  - Verify task ownership
  - Validate input with Zod
  - Update only provided fields
  - Return updated task
  
- [ ] Build task edit form (reuse creation form)
  - Use same TaskForm component
  - Pass task data as initial values
  - Change submit button text to "Update"
  - Handle edit mode prop
  
- [ ] Pre-populate form with current values
  - Load task data
  - Set form default values
  - Show loading while fetching
  - Handle missing task (404)
  
- [ ] Implement validation on update
  - Same validation as creation
  - Check due date > start date
  - Validate all field constraints
  - Show clear error messages
  
- [ ] Add optimistic UI updates
  - Update task in list immediately
  - Show loading state
  - Rollback on error
  - Use React Query mutations
  
- [ ] Handle concurrent edit conflicts
  - Check updated_at timestamp
  - Warn if task changed by another session
  - Allow user to choose version
  - Prevent data loss
  
- [ ] Show success/error feedback
  - Success toast notification
  - Error toast with details
  - Close modal on success
  - Keep modal open on error

#### Acceptance Criteria
- ✓ User can edit all task fields
- ✓ Form pre-filled with current values
- ✓ Validation prevents invalid updates
- ✓ Changes persist to database
- ✓ UI updates immediately
- ✓ Clear success notification
- ✓ Concurrent edits handled gracefully

#### Definition of Done
- [ ] Edit functionality works end-to-end
- [ ] Validation prevents bad data
- [ ] Optimistic updates implemented
- [ ] Error handling comprehensive
- [ ] User feedback clear

---

### US-2.5: Task Deletion
**Story:** As a user, I want to delete tasks so that I can remove completed or unwanted items.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Create task deletion API endpoint (`DELETE /api/tasks/:id`)
  - Implement DELETE handler
  - Verify task ownership
  - Delete task from database
  - Return success message
  - Handle not found
  
- [ ] Add delete button to task card
  - Trash icon button
  - Position in card corner
  - Show on hover (desktop)
  - Always visible (mobile)
  - Danger color (red)
  
- [ ] Implement confirmation dialog
  - Use AlertDialog from shadcn/ui
  - Show task title in message
  - "Are you sure?" message
  - Cancel and Delete buttons
  - Focus on Cancel by default
  
- [ ] Handle deletion in database
  - Delete task record
  - Cascade delete task_tags
  - Transaction for safety
  - Handle errors gracefully
  
- [ ] Update UI after deletion
  - Remove task from list immediately
  - Optimistic update
  - Show success toast
  - Rollback on error
  
- [ ] Add undo functionality (optional)
  - Show "Undo" in toast
  - 5-second window
  - Restore task if undo clicked
  - Soft delete approach
  
- [ ] Show success notification
  - "Task deleted successfully"
  - Toast notification
  - Auto-dismiss after 3 seconds
  - Include undo button

#### Acceptance Criteria
- ✓ Delete button visible on each task
- ✓ Confirmation dialog appears before deletion
- ✓ Task removed from database
- ✓ UI updates immediately
- ✓ Success message displayed
- ✓ No orphaned data remains
- ✓ Undo works (if implemented)

#### Definition of Done
- [ ] Deletion works correctly
- [ ] Confirmation prevents accidents
- [ ] Database cleanup complete
- [ ] UI updates properly
- [ ] Error handling in place

---

### US-2.6: Task Status Management
**Story:** As a user, I want to change task status so that I can track progress.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Add status toggle to task card
  - Checkbox for quick toggle
  - Click to mark complete
  - Visual feedback on hover
  - Accessible keyboard control
  
- [ ] Implement quick status change (Todo ↔ Completed)
  - Single click to complete
  - Click again to uncomplete
  - Update via API
  - Optimistic update
  
- [ ] Update completedAt timestamp
  - Set to current time when completed
  - Clear when uncompleted
  - Store in database
  - Display in task details
  
- [ ] Add visual status indicators
  - Completed: Strikethrough text
  - Completed: Checkmark icon
  - Completed: Muted colors
  - In Progress: Different color
  - Todo: Default styling
  
- [ ] Implement status filter
  - Filter buttons: All, Todo, In Progress, Completed
  - Update query params
  - Filter on API side
  - Show active filter
  
- [ ] Add status change animation
  - Smooth transition
  - Fade or slide effect
  - Celebrate completion (confetti?)
  - Subtle, not distracting

#### Acceptance Criteria
- ✓ Status can be changed with single click
- ✓ Completed tasks visually distinct
- ✓ CompletedAt timestamp set correctly
- ✓ Status change persists immediately
- ✓ Visual feedback on status change
- ✓ Filter by status works
- ✓ Animation smooth and pleasant

#### Definition of Done
- [ ] Status toggle works
- [ ] Timestamps updated correctly
- [ ] Visual indicators clear
- [ ] Filter functionality works
- [ ] Animations implemented

---

## 📈 Sprint Metrics

### Story Points Breakdown
| Story | Points | Priority | Complexity |
|-------|--------|----------|------------|
| US-2.1: Task Creation | 8 | P0 | High |
| US-2.2: Task Listing | 8 | P0 | High |
| US-2.3: Task Viewing | 5 | P0 | Medium |
| US-2.4: Task Editing | 8 | P0 | High |
| US-2.5: Task Deletion | 5 | P0 | Medium |
| US-2.6: Status Management | 5 | P0 | Medium |
| **TOTAL** | **39** | **All P0** | **Mixed** |

### Daily Velocity Target
- **Total Points:** 39
- **Working Days:** 10
- **Daily Target:** ~3.9 points/day
- **Buffer:** 10% (3-4 points)

---

## ✅ Definition of Done

### Code Quality
- [ ] All code committed with meaningful messages
- [ ] TypeScript compilation successful
- [ ] ESLint passes
- [ ] Components properly typed
- [ ] No console errors

### Functionality
- [ ] All CRUD operations work
- [ ] API endpoints tested
- [ ] UI responsive and intuitive
- [ ] Error handling implemented
- [ ] Data validation working

### User Experience
- [ ] Forms are intuitive
- [ ] Loading states implemented
- [ ] Error messages helpful
- [ ] Success feedback clear
- [ ] Animations smooth

---

## 🎯 Sprint Deliverables

At the end of Sprint 2, we will have:

### ✅ Task Management Features
- Complete task CRUD functionality
- Task creation with all fields
- Task listing with cards
- Task detail view
- Task editing
- Task deletion with confirmation
- Status management

### ✅ User Interface
- Task list page
- Task cards with key info
- Task creation/edit form
- Task detail modal
- Empty states
- Loading states
- Confirmation dialogs

### ✅ API Endpoints
- POST /api/tasks - Create task
- GET /api/tasks - List tasks
- GET /api/tasks/:id - Get task
- PATCH /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

---

## 📊 Progress Tracking

### Day-by-Day Plan

**Days 1-2:** Task Creation
- [ ] US-2.1: Task Creation (8 points)

**Days 3-4:** Task Listing
- [ ] US-2.2: Task Listing (8 points)

**Day 5:** Task Viewing
- [ ] US-2.3: Task Viewing (5 points)

**Days 6-8:** Task Editing
- [ ] US-2.4: Task Editing (8 points)

**Days 9-10:** Deletion & Status
- [ ] US-2.5: Task Deletion (5 points)
- [ ] US-2.6: Status Management (5 points)

---

## 🎉 Sprint Success Criteria

Sprint 2 is considered successful when:
- ✅ All 6 user stories completed
- ✅ 39 story points delivered
- ✅ Users can create, view, edit, delete tasks
- ✅ Task list displays all user tasks
- ✅ Status management works
- ✅ UI is intuitive and responsive
- ✅ No critical bugs
- ✅ Code quality maintained

---

**Sprint Status:** 📅 Pending (After Sprint 1)  
**Previous Sprint:** Sprint 1 - Foundation & Authentication  
**Next Sprint:** Sprint 3 - Tagging & Filtering  
**Last Updated:** 2025-11-20
