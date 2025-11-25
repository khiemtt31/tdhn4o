# Sprint 3: Tagging & Filtering
## Personal Task Management System

**Sprint Duration:** 2025-12-18 to 2025-12-31 (2 weeks / 10 working days)  
**Sprint Goal:** Implement comprehensive tagging system and advanced filtering capabilities  
**Total Story Points:** 42  
**Team Velocity:** 38-42 points (adjusted from Sprint 2)  

---

## 🎯 Sprint Objectives

- ✅ Build tag creation and management
- ✅ Implement tag-based filtering
- ✅ Add advanced search functionality
- ✅ Create date-based filters
- ✅ Implement sorting options
- ✅ Enable multi-filter combinations

---

## 📊 Sprint Overview

| Metric | Value |
|--------|-------|
| **User Stories** | 6 |
| **Story Points** | 42 |
| **Estimated Velocity** | 38-42 points |
| **Priority** | P0-P1 (Critical-High) |
| **Dependencies** | Sprint 2 (Task CRUD) |

---

## 📋 User Stories

### US-3.1: Tag Creation & Assignment
**Story:** As a user, I want to add tags to tasks so that I can categorize them.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create tag creation API endpoint (`POST /api/tags`)
  - Create `server/routes/tags.ts`
  - Implement POST handler
  - Check for duplicate tag names (case-insensitive)
  - Return created tag
  
- [ ] Implement tag assignment during task creation
  - Accept array of tag names in task creation
  - Create tags if they don't exist
  - Associate tags with task in task_tags table
  - Use database transaction for atomicity
  
- [ ] Build tag input component with autocomplete
  - Create `components/tags/tag-input.tsx`
  - Use Combobox or Command component
  - Allow typing to create new tags
  - Show existing tags as suggestions
  - Support multiple tag selection
  
- [ ] Add tag suggestions based on existing tags
  - Query user's existing tags
  - Filter by search input
  - Show tag usage count
  - Sort by frequency
  
- [ ] Implement tag validation (name, length)
  - Create Zod schema in `lib/validations/tag.ts`
  - Max 30 characters
  - Alphanumeric, hyphens, underscores only
  - No leading/trailing spaces
  - Case-insensitive uniqueness
  
- [ ] Create tag badge UI component
  - Create `components/tags/tag-badge.tsx`
  - Show tag name
  - Display tag color
  - Add remove button (X)
  - Hover effects
  
- [ ] Add tag color coding
  - Auto-assign colors to new tags
  - Use predefined color palette
  - Allow custom color selection
  - Store color in database
  
- [ ] Handle duplicate tag prevention
  - Check existing tags (case-insensitive)
  - Merge if duplicate
  - Show existing tag instead
  - Prevent database errors

#### Acceptance Criteria
- ✓ Tags can be created on-the-fly during task creation
- ✓ Autocomplete shows existing tags
- ✓ Tags display as colored badges
- ✓ Duplicate tags prevented (case-insensitive)
- ✓ Multiple tags can be added to task
- ✓ Tags persist with task
- ✓ Tag validation works correctly
- ✓ Tag colors assigned automatically

#### Definition of Done
- [ ] Tag creation API works
- [ ] Tag input component functional
- [ ] Autocomplete works smoothly
- [ ] Validation prevents bad data
- [ ] UI is intuitive and responsive

---

### US-3.2: Tag Management Interface
**Story:** As a user, I want to manage my tags so that I can keep them organized.

**Priority:** P1 (High)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Create tag list API endpoint (`GET /api/tags`)
  - Implement GET handler
  - Return all user tags
  - Include task count for each tag
  - Order by usage count or name
  
- [ ] Build tag management page/modal
  - Create tag management UI
  - List all tags with details
  - Add, edit, delete actions
  - Search/filter tags
  
- [ ] Display all tags with usage count
  - Show tag name and color
  - Display "X tasks" count
  - Sort by count or name
  - Visual tag preview
  
- [ ] Add tag editing functionality (`PATCH /api/tags/:id`)
  - Implement PATCH handler
  - Allow renaming tags
  - Allow color changes
  - Update all associated tasks
  
- [ ] Implement tag deletion (`DELETE /api/tags/:id`)
  - Implement DELETE handler
  - Remove tag from all tasks
  - Cascade delete task_tags entries
  - Confirm before deletion
  
- [ ] Add tag merge functionality
  - Select multiple tags
  - Merge into one tag
  - Update all tasks
  - Delete merged tags
  
- [ ] Show tasks associated with each tag
  - Click tag to see tasks
  - Filter task list by tag
  - Show task count
  - Quick navigation
  
- [ ] Implement tag color picker
  - Color selector component
  - Predefined palette
  - Custom color input
  - Live preview

#### Acceptance Criteria
- ✓ All user tags displayed with count
- ✓ Tags can be renamed (updates all tasks)
- ✓ Tags can be deleted (removes from tasks)
- ✓ Tag colors can be customized
- ✓ Orphaned tags cleaned up automatically
- ✓ Tag merge works correctly
- ✓ Task count accurate

#### Definition of Done
- [ ] Tag management UI complete
- [ ] All CRUD operations work
- [ ] Tag updates reflect on tasks
- [ ] Deletion handles cascade properly
- [ ] Color picker functional

---

### US-3.3: Tag-Based Filtering
**Story:** As a user, I want to filter tasks by tags so that I can focus on specific categories.

**Priority:** P0 (Critical)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Implement tag filter in task list API
  - Accept tag IDs in query params
  - Support multiple tags
  - Implement AND/OR logic
  - Return filtered tasks
  
- [ ] Build tag filter sidebar/dropdown
  - Create `components/tasks/task-filters.tsx`
  - List all user tags
  - Checkboxes for selection
  - Show task count per tag
  - Collapsible sections
  
- [ ] Add multi-tag filtering (AND/OR logic)
  - Toggle between AND/OR
  - AND: Tasks with ALL selected tags
  - OR: Tasks with ANY selected tag
  - Visual indicator of mode
  
- [ ] Create tag cloud visualization
  - Display tags with size based on usage
  - Clickable tags
  - Hover effects
  - Responsive layout
  
- [ ] Show task count per tag
  - Display count next to tag name
  - Update count when filtering
  - Show "0" for unused tags
  - Gray out empty tags
  
- [ ] Add "Clear filters" button
  - Reset all tag filters
  - Return to all tasks
  - Prominent placement
  - Keyboard shortcut (Esc)
  
- [ ] Persist filter state in URL
  - Use query parameters
  - Enable sharing filtered views
  - Browser back/forward works
  - Bookmark filtered views

#### Acceptance Criteria
- ✓ Clicking tag filters task list
- ✓ Multiple tags can be selected
- ✓ AND/OR logic toggle available
- ✓ Filter state persists during session
- ✓ Clear filters resets to all tasks
- ✓ URL reflects current filters
- ✓ Task counts update correctly

#### Definition of Done
- [ ] Tag filtering works correctly
- [ ] Multi-tag logic implemented
- [ ] URL state management works
- [ ] UI is intuitive
- [ ] Performance acceptable

---

### US-3.4: Advanced Search
**Story:** As a user, I want to search tasks so that I can find specific items quickly.

**Priority:** P0 (Critical)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Implement search in task list API
  - Accept search query parameter
  - Search in title field
  - Search in description field
  - Case-insensitive search
  - Use SQL LIKE or full-text search
  
- [ ] Build search input component
  - Create search bar component
  - Add search icon
  - Clear button (X)
  - Keyboard shortcuts (Ctrl+K)
  - Focus on mount
  
- [ ] Add search by title and description
  - Search both fields simultaneously
  - Highlight matches (optional)
  - Rank by relevance
  - Show which field matched
  
- [ ] Implement debounced search
  - Delay API call by 300ms
  - Cancel previous requests
  - Show loading indicator
  - Optimize performance
  
- [ ] Add search result highlighting
  - Highlight matched text
  - Use mark or strong tags
  - Subtle background color
  - Accessible contrast
  
- [ ] Show search result count
  - "X results found"
  - Update on search
  - Show "No results" message
  - Clear message
  
- [ ] Add "No results" state
  - Friendly message
  - Search tips
  - Clear search button
  - Suggest checking filters
  
- [ ] Combine search with filters
  - Search within filtered results
  - Apply both search and tag filters
  - Clear indication of active filters
  - Performance optimization

#### Acceptance Criteria
- ✓ Search input filters tasks in real-time
- ✓ Searches both title and description
- ✓ Search works with other filters
- ✓ Results highlighted appropriately
- ✓ Performance maintained with large datasets
- ✓ Clear search button available
- ✓ Debouncing prevents excessive API calls

#### Definition of Done
- [ ] Search functionality works
- [ ] Debouncing implemented
- [ ] Combines with filters
- [ ] Performance optimized
- [ ] UI feedback clear

---

### US-3.5: Date-Based Filtering
**Story:** As a user, I want to filter tasks by date so that I can see what's due soon.

**Priority:** P1 (High)  
**Story Points:** 8  
**Assignee:** Development Team  

#### Tasks
- [ ] Implement date filtering in API
  - Accept date range parameters
  - Filter by due_date field
  - Support preset ranges
  - Handle null dates
  
- [ ] Create "Today" view filter
  - Show tasks due today
  - Include tasks without due date (optional)
  - Quick access button
  - Badge with count
  
- [ ] Create "Upcoming" (next 7 days) filter
  - Show tasks due in next week
  - Exclude completed tasks
  - Sort by due date
  - Visual timeline
  
- [ ] Create "Overdue" filter
  - Show tasks past due date
  - Exclude completed tasks
  - Sort by how overdue
  - Red/warning indicator
  
- [ ] Add custom date range filter
  - Date range picker
  - Start and end date
  - Validate range
  - Clear range option
  
- [ ] Build date filter UI
  - Filter buttons/tabs
  - Active state indication
  - Combine with other filters
  - Responsive design
  
- [ ] Highlight overdue tasks
  - Red text or border
  - Warning icon
  - "Overdue by X days"
  - Visual priority
  
- [ ] Add date-based sorting
  - Sort by due date
  - Sort by start date
  - Ascending/descending
  - Null dates last

#### Acceptance Criteria
- ✓ Today view shows tasks due today
- ✓ Upcoming shows next 7 days
- ✓ Overdue shows past due tasks
- ✓ Custom date range works correctly
- ✓ Overdue tasks visually highlighted
- ✓ Filters combine with tag/search filters
- ✓ Sorting by date works

#### Definition of Done
- [ ] All date filters work
- [ ] Overdue highlighting implemented
- [ ] Custom range functional
- [ ] Combines with other filters
- [ ] UI is clear and intuitive

---

### US-3.6: Sorting & View Options
**Story:** As a user, I want to sort and view tasks in different ways so that I can organize them effectively.

**Priority:** P1 (High)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Implement sorting in API (due date, created, priority)
  - Accept sort field parameter
  - Accept sort order (asc/desc)
  - Support multiple sort fields
  - Default sort order
  
- [ ] Build sort dropdown UI
  - Dropdown/Select component
  - Sort options list
  - Active sort indicator
  - Keyboard accessible
  
- [ ] Add ascending/descending toggle
  - Arrow icon (up/down)
  - Click to reverse order
  - Visual indication
  - Remember preference
  
- [ ] Create list view (default)
  - Vertical list layout
  - Full task information
  - Comfortable spacing
  - Easy to scan
  
- [ ] Create grid/card view
  - Grid layout (2-3 columns)
  - Card-based design
  - Compact information
  - Responsive columns
  
- [ ] Create compact view
  - Dense list layout
  - Minimal information
  - More tasks visible
  - Quick scanning
  
- [ ] Persist view preference
  - Save to localStorage
  - Remember across sessions
  - Per-user setting
  - Easy to change
  
- [ ] Add priority-based visual indicators
  - High: Red/urgent color
  - Medium: Yellow/normal color
  - Low: Blue/calm color
  - Icons or badges

#### Acceptance Criteria
- ✓ Tasks can be sorted by multiple criteria
- ✓ Sort order can be reversed
- ✓ Multiple view modes available
- ✓ View preference persists
- ✓ Priority visually indicated
- ✓ Sorting works with filters
- ✓ UI is intuitive

#### Definition of Done
- [ ] All sort options work
- [ ] View modes implemented
- [ ] Preferences persist
- [ ] Visual indicators clear
- [ ] Responsive on all devices

---

## 📈 Sprint Metrics

### Story Points Breakdown
| Story | Points | Priority | Complexity |
|-------|--------|----------|------------|
| US-3.1: Tag Creation & Assignment | 8 | P0 | High |
| US-3.2: Tag Management | 8 | P1 | High |
| US-3.3: Tag Filtering | 8 | P0 | High |
| US-3.4: Advanced Search | 5 | P0 | Medium |
| US-3.5: Date Filtering | 8 | P1 | High |
| US-3.6: Sorting & Views | 5 | P1 | Medium |
| **TOTAL** | **42** | **Mixed** | **Mixed** |

### Daily Velocity Target
- **Total Points:** 42
- **Working Days:** 10
- **Daily Target:** ~4.2 points/day
- **Buffer:** 10% (4 points)

---

## ✅ Definition of Done

### Code Quality
- [ ] All code committed and reviewed
- [ ] TypeScript types correct
- [ ] ESLint passes
- [ ] Performance optimized
- [ ] No console errors

### Functionality
- [ ] Tag system fully functional
- [ ] All filters working correctly
- [ ] Search performs well
- [ ] UI intuitive and responsive
- [ ] Filter combinations work

### User Experience
- [ ] Filters easy to use
- [ ] Search is fast
- [ ] Visual feedback clear
- [ ] State persists appropriately
- [ ] Responsive on all devices

---

## 🎯 Sprint Deliverables

At the end of Sprint 3, we will have:

### ✅ Tagging System
- Complete tag CRUD functionality
- Tag creation and assignment
- Tag management interface
- Tag color customization
- Tag merge capability

### ✅ Filtering Capabilities
- Tag-based filtering
- Multi-tag filtering (AND/OR)
- Search functionality
- Date-based filters (Today, Upcoming, Overdue)
- Custom date range
- Filter combinations

### ✅ Sorting & Views
- Multiple sort options
- Ascending/descending order
- List, grid, and compact views
- View preference persistence
- Priority indicators

### ✅ User Interface
- Tag input with autocomplete
- Tag management page
- Filter sidebar
- Search bar
- Sort controls
- View switcher

---

## 📊 Progress Tracking

### Day-by-Day Plan

**Days 1-2:** Tag Creation
- [ ] US-3.1: Tag Creation & Assignment (8 points)

**Days 3-4:** Tag Management
- [ ] US-3.2: Tag Management (8 points)

**Days 5-6:** Tag Filtering
- [ ] US-3.3: Tag Filtering (8 points)

**Day 7:** Search
- [ ] US-3.4: Advanced Search (5 points)

**Days 8-9:** Date Filtering
- [ ] US-3.5: Date Filtering (8 points)

**Day 10:** Sorting & Views
- [ ] US-3.6: Sorting & Views (5 points)

---

## 🎉 Sprint Success Criteria

Sprint 3 is considered successful when:
- ✅ All 6 user stories completed
- ✅ 42 story points delivered
- ✅ Tag system fully functional
- ✅ All filters working correctly
- ✅ Search performs well
- ✅ Multiple view options available
- ✅ Filter combinations work
- ✅ UI is intuitive and responsive
- ✅ No critical bugs

---

**Sprint Status:** 📅 Pending (After Sprint 2)  
**Previous Sprint:** Sprint 2 - Core Task Management  
**Next Sprint:** Sprint 4 - Polish & Enhancement  
**Last Updated:** 2025-11-20
