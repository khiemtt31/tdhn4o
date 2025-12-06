# Sprint 1.1 Quick Start Guide
## Frontend Styling System Implementation

**Goal:** Implement custom theme and SCSS architecture without breaking Sprint 1 work

---

## 🚀 Quick Implementation Steps

### Step 1: Install SCSS (2 minutes)

```bash
npm install -D sass
```

### Step 2: Create SCSS Folder Structure (5 minutes)

```bash
# Create all directories
mkdir -p styles/abstracts styles/base styles/components styles/layouts styles/utilities
```

### Step 3: Create Design System Files (15 minutes)

Create these files in order:

1. **`styles/abstracts/_variables.scss`** - All design constants (see main sprint doc)
2. **`styles/abstracts/_mixins.scss`** - Reusable SCSS mixins
3. **`styles/abstracts/_index.scss`** - Export all abstracts
4. **`styles/main.scss`** - Main entry point

### Step 4: Update Tailwind Theme (10 minutes)

Update `app/globals.css` with brand colors:

```css
:root {
  /* Brand Colors */
  --color-primary-dark: #662222;
  --color-primary-medium: #842A3B;
  --color-primary-light: #A3485A;
  --color-accent: #F5DAA7;
  
  /* Update primary to use burgundy */
  --primary: oklch(0.35 0.15 20);  /* #662222 */
  --primary-foreground: oklch(0.985 0 0);
  
  /* Update secondary to use rose */
  --secondary: oklch(0.45 0.12 15);  /* #842A3B */
  --secondary-foreground: oklch(0.985 0 0);
  
  /* Update accent to use cream */
  --accent: oklch(0.88 0.08 75);  /* #F5DAA7 */
  --accent-foreground: oklch(0.205 0 0);
}
```

### Step 5: Create shadcn Overrides (10 minutes)

**File:** `styles/components/_shadcn-overrides.scss`

```scss
@use '../abstracts/variables' as *;

// Override button styles
.btn-primary {
  background-color: $color-primary-dark;
  
  &:hover {
    background-color: $color-primary-medium;
  }
}

// Override input styles
input, textarea {
  border-color: $color-gray-300;
  
  &:focus {
    border-color: $color-primary-light;
    ring-color: $color-primary-light;
  }
}
```

### Step 6: Import SCSS in Next.js (2 minutes)

Update `app/layout.tsx` to import SCSS:

```tsx
import './globals.css'
import '../styles/main.scss'  // Add this line
```

### Step 7: Test Everything (5 minutes)

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- ✅ App still runs
- ✅ Brand colors visible
- ✅ No console errors
- ✅ Components look styled

---

## 📋 User Stories Checklist

### US-1.1.1: Design System Constants ✅
- [x] Create `styles/abstracts/_variables.scss`
- [x] Create `styles/abstracts/_mixins.scss`
- [x] Create `styles/abstracts/_functions.scss`
- [x] Document design tokens

### US-1.1.2: Custom Theme Integration ✅
- [x] Update `app/globals.css` with brand colors
- [x] Create `lib/theme/colors.ts` for TypeScript
- [x] Test color contrast (WCAG AA)
- [x] Verify light/dark modes

### US-1.1.3: SCSS Architecture Setup ✅
- [x] Install `sass` package
- [x] Create folder structure
- [x] Create `styles/main.scss`
- [x] Import in `app/layout.tsx`

### US-1.1.4: shadcn/ui Restyling ✅
- [x] Create `styles/components/_shadcn-overrides.scss`
- [x] Override button styles
- [x] Override form styles
- [x] Test all components

---

## 🎨 Brand Color Reference

Use these colors throughout the app:

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Dark** | `#662222` | Primary buttons, headers, important text |
| **Primary Medium** | `#842A3B` | Secondary buttons, hover states, accents |
| **Primary Light** | `#A3485A` | Borders, subtle backgrounds, focus rings |
| **Accent** | `#F5DAA7` | Highlights, badges, call-to-action elements |

---

## 🔧 SCSS + Tailwind v4 Integration

**Important:** Tailwind v4 uses `@import "tailwindcss"` syntax. SCSS must work alongside it.

### Correct Usage:

```scss
// ✅ GOOD: Use @layer for custom styles
@layer components {
  .my-component {
    // Your SCSS here
  }
}

// ✅ GOOD: Use SCSS variables
$my-color: #662222;

.my-element {
  color: $my-color;
}
```

### Avoid:

```scss
// ❌ BAD: Don't override Tailwind utilities directly
.text-primary {
  color: red; // This will conflict
}
```

---

## 📦 File Structure After Sprint 1.1

```
tdhn4o/
├── app/
│   ├── globals.css          # Updated with brand colors
│   └── layout.tsx           # Imports SCSS
├── styles/                  # NEW
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _functions.scss
│   │   └── _index.scss
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _index.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _forms.scss
│   │   ├── _shadcn-overrides.scss
│   │   └── _index.scss
│   ├── layouts/
│   │   ├── _header.scss
│   │   └── _index.scss
│   ├── utilities/
│   │   ├── _helpers.scss
│   │   └── _index.scss
│   └── main.scss
├── lib/
│   └── theme/               # NEW
│       └── colors.ts
└── package.json             # sass added to devDependencies
```

---

## ✅ Testing Checklist

After implementation, verify:

- [x] `npm run dev` works without errors
- [x] Brand colors visible in UI
- [x] Buttons use burgundy (#662222)
- [x] Hover states use rose (#842A3B)
- [x] Focus rings use dusty rose (#A3485A)
- [x] Accent elements use cream (#F5DAA7)
- [x] No SCSS compilation errors
- [x] No Tailwind conflicts
- [x] Responsive design still works
- [x] Dark mode still works

---

## 🐛 Common Issues & Solutions

### Issue: SCSS not compiling
**Solution:** Ensure `sass` is installed: `npm install -D sass`

### Issue: Colors not showing
**Solution:** Check import order in `app/layout.tsx` - SCSS should come after `globals.css`

### Issue: Tailwind classes not working
**Solution:** Don't override Tailwind utilities in SCSS. Use `@layer` directive.

### Issue: Build fails
**Solution:** Check for syntax errors in SCSS files. Use `@use` instead of `@import` for SCSS modules.

---

## 📚 Next Steps After Sprint 1.1

Once Sprint 1.1 is complete:

1. **Sprint 2:** Use design system for task management UI
2. **Component Library:** Build reusable components with SCSS
3. **Theme Switching:** Add light/dark mode toggle
4. **Animation System:** Add micro-interactions using SCSS

---

## 🎯 Success Metrics

Sprint 1.1 is successful when:

- ✅ All 4 user stories completed (13 points)
- ✅ Brand colors applied throughout
- ✅ SCSS compiles without errors
- ✅ No visual regressions from Sprint 1
- ✅ Design system documented
- ✅ Team can use SCSS variables for new components

---

**Estimated Time:** 1-2 hours for initial setup, 3-4 hours for complete implementation

**Priority:** High (P1) - Foundational for future sprints

**Dependencies:** Sprint 1 must be completed first ✅
