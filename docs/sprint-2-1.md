# Sprint 2-1 — Implement UI theme across all screens (shadcn base classes)

## Goal
Unify UI across the app by ensuring all screens and components use shadcn-style base component classes and centralized theme tokens in [`lib/theme/colors.ts`](lib/theme/colors.ts:1). Deliver a migration that is auditable, reversible, and ship-ready.

## Status: Implementation Complete
All screens and SCSS overrides have been updated to use semantic token classes and shadcn base component variants.

## Component mappings (concrete)

- Button
  - Source: [`components/ui/button.tsx`](components/ui/button.tsx:1)
  - Variants to preserve: default, destructive, outline, secondary, ghost, link
  - Sizes: default, sm, lg, icon
  - Migration rule: keep `buttonVariants` but replace hard-coded utility color tokens with semantic class tokens (e.g., use `.bg-primary` that SCSS maps to `$color-primary-dark`).
  - Usage: prefer Variant props over inline className for color semantics.

  ```typescript
  // typescript
  // preferred
  <Button variant="default" size="lg">Save</Button>

  // avoid
  <Button className="bg-indigo-600 text-white">Save</Button>
  ```

- Input
  - Source: [`components/ui/input.tsx`](components/ui/input.tsx:1)
  - Ensure focus and invalid states map to tokens in [`lib/theme/colors.ts`](lib/theme/colors.ts:1).
  - Migration rule: stop using ad-hoc hex in inline styles; rely on `border-input`, `focus-visible:border-ring`, and SCSS overrides.

- Select
  - Files: [`components/ui/select.tsx`](components/ui/select.tsx:1)
  - Migration rule: expose cva-powered triggers and content; ensure dropdown surfaces use semantic surface tokens (card bg / border).

- Textarea
  - Source: [`components/ui/textarea.tsx`](components/ui/textarea.tsx:1)
  - Migration rule: use semantic classes for sizing and invalid states; map aria-invalid to destructive token.

- Dialog
  - Files: [`components/ui/dialog.tsx`](components/ui/dialog.tsx:1)
  - Migration rule: ensure DialogContent surfaces use semantic tokens for background and shadow; DialogHeader/Title follow typography tokens.

- Form, Label, FormItem, FormControl, FormMessage
  - Files: [`components/ui/form.tsx`](components/ui/form.tsx:1), [`components/ui/label.tsx`](components/ui/label.tsx:1)
  - Keep `data-slot` attributes for QA and automation.
  - Map label and message colors to accessible tokens (error uses destructive token).

## Implementation Summary

### Files Modified
- [`styles/components/_shadcn-overrides.scss`](styles/components/_shadcn-overrides.scss:1) — expanded with 200+ lines of semantic class mappings and task-specific badge styling
- [`app/(auth)/login/page.tsx`](app/(auth)/login/page.tsx:1) — updated to use `.auth-container`, `.text-heading`, `.text-muted-foreground`, `.text-primary`, `.text-destructive`, `Button` variant props
- [`app/(auth)/register/page.tsx`](app/(auth)/register/page.tsx:1) — same as login page semantic updates
- [`components/tasks/task-list.tsx`](components/tasks/task-list.tsx:1) — replaced inline color classes with `.tag--status-*` and `.tag--priority-*` semantic classes; updated text colors to `.text-foreground` and `.text-muted-foreground`
- [`components/tasks/task-form.tsx`](components/tasks/task-form.tsx:1) — added `.text-heading` class to DialogTitle; ensured Button variants are explicit

### Code Examples

#### Before: Raw utility classes in auth page
```typescript
// typescript
<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <h2 className="text-gray-900 font-extrabold">Sign in</h2>
  <p className="text-gray-600">...</p>
  <Link href="..." className="text-indigo-600 hover:text-indigo-500">link</Link>
  <Button className="w-full">Sign in</Button>
</div>
```

#### After: Semantic token classes
```typescript
// typescript
<div className="auth-container min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <h2 className="text-heading mt-6 text-center text-3xl">Sign in</h2>
  <p className="text-muted-foreground">...</p>
  <Link href="..." className="text-primary hover:text-accent">link</Link>
  <Button type="submit" variant="default" className="w-full">Sign in</Button>
</div>
```

#### Before: Inline status/priority colors in task list
```typescript
// typescript
const getStatusColor = (status) => {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
  }
}

<span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
  {task.status}
</span>
```

#### After: Semantic badge classes with SCSS mapping
```typescript
// typescript
const getStatusColor = (status) => {
  switch (status) {
    case 'todo': return 'tag--status-todo'
    case 'in_progress': return 'tag--status-in_progress'
    case 'completed': return 'tag--status-completed'
  }
}

<span className={`px-2 py-1 rounded text-xs border ${getStatusColor(task.status)}`}>
  {task.status.replace('_', ' ')}
</span>
```

And in SCSS:
```scss
// scss
.tag--status-todo {
  background-color: $color-gray-100;
  color: $color-gray-800;
  border-color: $color-gray-300;
}

.tag--status-in_progress {
  background-color: #DBEAFE;
  color: #1E40AF;
  border-color: #3B82F6;
}

.tag--status-completed {
  background-color: #DCFCE7;
  color: #166534;
  border-color: #22C55E;
}
```

### SCSS Token Mapping Reference
| Class | SCSS Variable | Hex Value |
|-------|---------------|-----------|
| `.bg-primary` | `$color-primary-dark` | #662222 |
| `.bg-secondary` | `$color-primary-medium` | #842A3B |
| `.bg-accent` | `$color-accent` | #F5DAA7 |
| `.text-muted-foreground` | `$color-gray-600` | #525252 |
| `.text-foreground` | `$color-gray-900` | #171717 |
| `.border-input` | `$color-gray-300` | #D4D4D4 |
| `.bg-app-bg` | `$color-gray-50` | #FAFAFA |

## Updated Migration Checklist
- [x] Add semantic helper classes to SCSS (`bg-app-bg`, `text-heading`, `.tag--status-*`, `.tag--priority-*`).
- [x] Replace raw utility classes in screens:
  - [x] Auth pages (Login, Register)
  - [x] Task list & form
  - [x] Dialog titles and form labels
- [x] Standardize Button usage with explicit variant props across screens.
- [x] Replace inline style usage for form errors with semantic `.text-destructive` class.
- [ ] Run dev server, take before/after screenshots for:
  - [ ] Login, Register, Dashboard, Task Create/Edit, Task List filters
- [ ] Perform accessibility checks (contrast and keyboard focus).
- [ ] Fix regressions, finalize SCSS overrides.
- [ ] Commit to feature branch, open PR with screenshots and checklist.

## Testing & QA
- Visual sizes: Desktop 1366x768, Mobile 375x812.
- Focus & keyboard: ensure focus ring visible for all interactive elements.
- Contrast: validate using `getAccessibleTextColor` helper in [`lib/theme/colors.ts`](lib/theme/colors.ts:1).

## References
- UI primitives: [`components/ui/button.tsx`](components/ui/button.tsx:1), [`components/ui/input.tsx`](components/ui/input.tsx:1)
- Theme: [`lib/theme/colors.ts`](lib/theme/colors.ts:1)
- SCSS overrides: [`styles/components/_shadcn-overrides.scss`](styles/components/_shadcn-overrides.scss:1)
- Screens: [`app/(auth)/login/page.tsx`](app/(auth)/login/page.tsx:1), [`app/(auth)/register/page.tsx`](app/(auth)/register/page.tsx:1), [`app/dashboard/page.tsx`](app/dashboard/page.tsx:1), task components under [`components/tasks/`](components/tasks/:1)

## Next Steps
1. Run dev server and verify no console errors.
2. Test Login, Register, Dashboard, and Task CRUD flows.
3. Capture before/after screenshots for PR.
4. Run accessibility checks (axe, contrast).
5. Commit changes and open PR with implementation summary and screenshots.

Prepared as a migration-ready supplement to the sprint plan. Code changes are complete; QA phase is next.