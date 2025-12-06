# Sprint 1.1: Frontend Styling System
## Personal Task Management System - Mid-Sprint Update

**Sprint Duration:** 2025-11-30 to 2025-12-06 (1 week / 5 working days)  
**Sprint Goal:** Establish a comprehensive, consistent styling system with custom theme and SCSS architecture  
**Total Story Points:** 13  
**Sprint Type:** Enhancement (Mid-update to Sprint 1)  

---

## 🎯 Sprint Objectives

- ✅ Implement design system with constants for colors, spacing, padding, margin
- ✅ Apply custom brand theme based on specified color palette
- ✅ Integrate SCSS for consistent component styling
- ✅ Restyle shadcn/ui components to match custom theme
- ✅ Ensure Tailwind CSS v4 compatibility

---

## 📊 Sprint Overview

| Metric | Value |
|--------|-------|
| **User Stories** | 4 |
| **Story Points** | 13 |
| **Estimated Velocity** | 12-15 points |
| **Priority** | P1 (High) |
| **Dependencies** | Sprint 1 (Completed) |

---

## 🎨 Design System

### Color Palette

Our custom theme is built around a warm, sophisticated color palette:

```scss
// Primary Brand Colors
$color-primary-dark: #662222;      // Deep burgundy - primary brand color
$color-primary-medium: #842A3B;    // Rich rose - secondary brand color
$color-primary-light: #A3485A;     // Dusty rose - tertiary brand color
$color-accent: #F5DAA7;            // Warm cream - accent color

// Semantic Colors (derived from brand palette)
$color-background: #FFFFFF;
$color-foreground: #1A1A1A;
$color-surface: #FAFAFA;
$color-border: #E5E5E5;

// State Colors
$color-success: #2D5F3F;
$color-warning: #B8860B;
$color-error: #8B1A1A;
$color-info: #4A5568;
```

### Spacing System

Consistent spacing based on 4px base unit:

```scss
// Base unit: 4px
$spacing-base: 0.25rem;

// Spacing scale
$spacing-xs: calc($spacing-base * 1);    // 4px
$spacing-sm: calc($spacing-base * 2);    // 8px
$spacing-md: calc($spacing-base * 4);    // 16px
$spacing-lg: calc($spacing-base * 6);    // 24px
$spacing-xl: calc($spacing-base * 8);    // 32px
$spacing-2xl: calc($spacing-base * 12);  // 48px
$spacing-3xl: calc($spacing-base * 16);  // 64px
```

### Typography System

```scss
// Font families
$font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

// Font sizes
$font-size-xs: 0.75rem;      // 12px
$font-size-sm: 0.875rem;     // 14px
$font-size-base: 1rem;       // 16px
$font-size-lg: 1.125rem;     // 18px
$font-size-xl: 1.25rem;      // 20px
$font-size-2xl: 1.5rem;      // 24px
$font-size-3xl: 1.875rem;    // 30px
$font-size-4xl: 2.25rem;     // 36px

// Font weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line heights
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

### Border Radius

```scss
$radius-none: 0;
$radius-sm: 0.25rem;    // 4px
$radius-md: 0.5rem;     // 8px
$radius-lg: 0.75rem;    // 12px
$radius-xl: 1rem;       // 16px
$radius-2xl: 1.5rem;    // 24px
$radius-full: 9999px;   // Full circle
```

### Shadows

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Z-Index Layers

```scss
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;
```

---

## 📋 User Stories

### US-1.1.1: Design System Constants
**Story:** As a developer, I need a centralized design system with constants so that styling is consistent across the application.

**Priority:** P1 (High)  
**Story Points:** 3  
**Assignee:** Development Team  

#### Tasks
- [ ] Create SCSS variables file (`styles/variables.scss`)
  - Define color palette constants
  - Define spacing scale
  - Define typography system
  - Define border radius values
  - Define shadow values
  - Define z-index layers

- [ ] Create SCSS mixins file (`styles/mixins.scss`)
  - Flexbox utilities
  - Grid utilities
  - Responsive breakpoint mixins
  - Typography mixins
  - Transition/animation mixins

- [ ] Create SCSS functions file (`styles/functions.scss`)
  - Color manipulation functions
  - Spacing calculation functions
  - Unit conversion functions

- [ ] Document design system
  - Create design tokens documentation
  - Add usage examples
  - Include visual reference guide

#### Acceptance Criteria
- ✓ All design constants defined in SCSS variables
- ✓ Variables follow consistent naming convention
- ✓ Mixins are reusable and well-documented
- ✓ Functions work correctly for calculations
- ✓ Documentation is clear and comprehensive

#### Definition of Done
- [ ] SCSS files created and organized
- [ ] All constants properly typed and documented
- [ ] No hardcoded values in components
- [ ] Design system documentation complete

---

### US-1.1.2: Custom Theme Integration
**Story:** As a user, I want the application to use our custom brand colors so that it has a unique, professional appearance.

**Priority:** P1 (High)  
**Story Points:** 5  
**Assignee:** Development Team  

#### Tasks
- [ ] Update Tailwind CSS configuration
  - Map brand colors to Tailwind theme
  - Extend color palette with custom colors
  - Configure custom spacing scale
  - Add custom font families

- [ ] Update CSS variables in `globals.css`
  - Replace default colors with brand palette
  - Update light mode variables
  - Update dark mode variables
  - Ensure OKLCH color space compatibility

- [ ] Create theme utility file (`lib/theme/colors.ts`)
  - Export color constants for TypeScript
  - Provide color manipulation utilities
  - Add theme switching utilities (future-proof)

- [ ] Test theme across all existing components
  - Verify color contrast ratios (WCAG AA)
  - Test in light and dark modes
  - Ensure readability and accessibility

#### Acceptance Criteria
- ✓ Brand colors (#662222, #842A3B, #A3485A, #F5DAA7) applied throughout
- ✓ Tailwind classes use custom theme colors
- ✓ CSS variables reflect brand palette
- ✓ Color contrast meets accessibility standards
- ✓ Theme works in both light and dark modes

#### Definition of Done
- [ ] All brand colors integrated
- [ ] Tailwind config updated
- [ ] CSS variables updated
- [ ] Accessibility verified (WCAG AA)
- [ ] Visual consistency across app

---

### US-1.1.3: SCSS Architecture Setup
**Story:** As a developer, I need SCSS integrated into the project so that I can write maintainable, modular styles.

**Priority:** P1 (High)  
**Story Points:** 3  
**Assignee:** Development Team  

#### Tasks
- [ ] Install SCSS dependencies
  - `npm install -D sass`
  - Configure Next.js for SCSS support
  - Verify SCSS compilation

- [ ] Create SCSS folder structure
  ```
  styles/
  ├── abstracts/
  │   ├── _variables.scss
  │   ├── _mixins.scss
  │   ├── _functions.scss
  │   └── _index.scss
  ├── base/
  │   ├── _reset.scss
  │   ├── _typography.scss
  │   └── _index.scss
  ├── components/
  │   ├── _buttons.scss
  │   ├── _forms.scss
  │   ├── _cards.scss
  │   └── _index.scss
  ├── layouts/
  │   ├── _header.scss
  │   ├── _sidebar.scss
  │   ├── _footer.scss
  │   └── _index.scss
  ├── utilities/
  │   ├── _helpers.scss
  │   └── _index.scss
  └── main.scss
  ```

- [ ] Create main SCSS entry point
  - Import all partials in correct order
  - Set up layer organization
  - Configure PostCSS integration

- [ ] Configure SCSS with Tailwind CSS v4
  - Ensure compatibility with `@import "tailwindcss"`
  - Use `@layer` for proper cascade
  - Avoid conflicts with Tailwind utilities

- [ ] Add SCSS linting
  - Install stylelint
  - Configure SCSS rules
  - Add lint script to package.json

#### Acceptance Criteria
- ✓ SCSS compiles without errors
- ✓ Folder structure follows best practices
- ✓ SCSS works alongside Tailwind CSS v4
- ✓ Linting catches style issues
- ✓ Build process includes SCSS compilation

#### Definition of Done
- [ ] SCSS dependencies installed
- [ ] Folder structure created
- [ ] Main SCSS file imports all partials
- [ ] Linting configured and passing
- [ ] Documentation updated

---

### US-1.1.4: shadcn/ui Component Restyling
**Story:** As a user, I want shadcn/ui components to match our brand theme so that the UI feels cohesive.

**Priority:** P1 (High)  
**Story Points:** 2  
**Assignee:** Development Team  

#### Tasks
- [ ] Create component override styles
  - Create `styles/components/_shadcn-overrides.scss`
  - Override button styles
  - Override input/form styles
  - Override card styles
  - Override dialog/modal styles

- [ ] Update button component variants
  - Primary button: use $color-primary-dark
  - Secondary button: use $color-primary-medium
  - Accent button: use $color-accent
  - Destructive button: use $color-error

- [ ] Update form component styles
  - Input borders: use brand colors
  - Focus states: use $color-primary-light
  - Error states: use $color-error
  - Disabled states: muted brand colors

- [ ] Update card component styles
  - Border colors: subtle brand tint
  - Hover states: $color-primary-light with opacity
  - Shadow: use custom shadow values

- [ ] Test all shadcn/ui components
  - Button (all variants)
  - Input, Textarea, Select
  - Card
  - Dialog/Modal
  - Label
  - Any other installed components

#### Acceptance Criteria
- ✓ All shadcn/ui components use brand colors
- ✓ Component styles are consistent
- ✓ Hover/focus states use brand palette
- ✓ Components remain accessible
- ✓ No visual regressions

#### Definition of Done
- [ ] Override styles created
- [ ] All components tested visually
- [ ] Accessibility maintained
- [ ] Documentation updated with examples
- [ ] Code committed and reviewed

---

## 📈 Sprint Metrics

### Story Points Breakdown
| Story | Points | Priority | Complexity |
|-------|--------|----------|------------|
| US-1.1.1: Design System Constants | 3 | P1 | Medium |
| US-1.1.2: Custom Theme Integration | 5 | P1 | High |
| US-1.1.3: SCSS Architecture Setup | 3 | P1 | Medium |
| US-1.1.4: shadcn/ui Restyling | 2 | P1 | Low |
| **TOTAL** | **13** | **All P1** | **Mixed** |

### Daily Velocity Target
- **Total Points:** 13
- **Working Days:** 5
- **Daily Target:** ~2.6 points/day
- **Buffer:** 10% (1-2 points)

---

## ✅ Definition of Done

### Code Quality
- [ ] All SCSS compiles without errors
- [ ] TypeScript compilation with no errors
- [ ] Stylelint passes with no warnings
- [ ] ESLint passes with no warnings
- [ ] No console errors in browser

### Functionality
- [ ] All components use design system constants
- [ ] Brand colors applied consistently
- [ ] SCSS modules work correctly
- [ ] shadcn/ui components styled properly
- [ ] No visual regressions

### Documentation
- [ ] Design system documented
- [ ] SCSS architecture documented
- [ ] Color palette usage guide created
- [ ] Component styling examples added

### Accessibility
- [ ] Color contrast ratios meet WCAG AA
- [ ] Focus states visible and clear
- [ ] All interactive elements accessible
- [ ] Dark mode works correctly

---

## 🎯 Sprint Deliverables

At the end of Sprint 1.1, we will have:

### ✅ Design System
- Complete SCSS variables file with all constants
- Reusable mixins and functions
- Comprehensive design tokens
- Documentation and usage guide

### ✅ Custom Theme
- Brand colors integrated throughout
- Tailwind CSS configured with custom palette
- CSS variables updated
- Light and dark mode support

### ✅ SCSS Architecture
- Organized folder structure
- Modular SCSS partials
- Integration with Tailwind CSS v4
- Linting and build process

### ✅ Component Styling
- shadcn/ui components restyled
- Consistent visual language
- Accessible color combinations
- Polished user interface

---

## 🚧 Sprint Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| SCSS conflicts with Tailwind v4 | High | Medium | Use `@layer` properly, test thoroughly |
| Color contrast issues | Medium | Medium | Use contrast checker, follow WCAG guidelines |
| Breaking existing components | High | Low | Test all components, maintain backwards compatibility |
| Performance impact from SCSS | Low | Low | Optimize build process, minimize compiled CSS |

---

## 📝 Implementation Guide

### Step 1: Install Dependencies

```bash
# Install SCSS
npm install -D sass

# Install stylelint (optional but recommended)
npm install -D stylelint stylelint-config-standard-scss
```

### Step 2: Create SCSS Structure

```bash
# Create directories
mkdir -p styles/abstracts styles/base styles/components styles/layouts styles/utilities
```

### Step 3: Create Variables File

**File:** `styles/abstracts/_variables.scss`

```scss
// ============================================
// DESIGN SYSTEM VARIABLES
// ============================================

// --------------------------------------------
// Colors - Brand Palette
// --------------------------------------------
$color-primary-dark: #662222;
$color-primary-medium: #842A3B;
$color-primary-light: #A3485A;
$color-accent: #F5DAA7;

// --------------------------------------------
// Colors - Neutrals
// --------------------------------------------
$color-white: #FFFFFF;
$color-black: #000000;
$color-gray-50: #FAFAFA;
$color-gray-100: #F5F5F5;
$color-gray-200: #E5E5E5;
$color-gray-300: #D4D4D4;
$color-gray-400: #A3A3A3;
$color-gray-500: #737373;
$color-gray-600: #525252;
$color-gray-700: #404040;
$color-gray-800: #262626;
$color-gray-900: #171717;

// --------------------------------------------
// Colors - Semantic
// --------------------------------------------
$color-background: $color-white;
$color-foreground: $color-gray-900;
$color-surface: $color-gray-50;
$color-border: $color-gray-200;

$color-success: #2D5F3F;
$color-warning: #B8860B;
$color-error: #8B1A1A;
$color-info: #4A5568;

// --------------------------------------------
// Spacing
// --------------------------------------------
$spacing-base: 0.25rem; // 4px

$spacing-xs: calc($spacing-base * 1);    // 4px
$spacing-sm: calc($spacing-base * 2);    // 8px
$spacing-md: calc($spacing-base * 4);    // 16px
$spacing-lg: calc($spacing-base * 6);    // 24px
$spacing-xl: calc($spacing-base * 8);    // 32px
$spacing-2xl: calc($spacing-base * 12);  // 48px
$spacing-3xl: calc($spacing-base * 16);  // 64px

// --------------------------------------------
// Typography
// --------------------------------------------
$font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 1.875rem;
$font-size-4xl: 2.25rem;

$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// --------------------------------------------
// Border Radius
// --------------------------------------------
$radius-none: 0;
$radius-sm: 0.25rem;
$radius-md: 0.5rem;
$radius-lg: 0.75rem;
$radius-xl: 1rem;
$radius-2xl: 1.5rem;
$radius-full: 9999px;

// --------------------------------------------
// Shadows
// --------------------------------------------
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

// --------------------------------------------
// Z-Index
// --------------------------------------------
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;

// --------------------------------------------
// Transitions
// --------------------------------------------
$transition-fast: 150ms ease-in-out;
$transition-base: 200ms ease-in-out;
$transition-slow: 300ms ease-in-out;

// --------------------------------------------
// Breakpoints
// --------------------------------------------
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

### Step 4: Update globals.css with Brand Colors

**File:** `app/globals.css`

Update the `:root` section to use brand colors:

```css
:root {
  --radius: 0.75rem;
  
  /* Brand Colors */
  --color-primary-dark: #662222;
  --color-primary-medium: #842A3B;
  --color-primary-light: #A3485A;
  --color-accent: #F5DAA7;
  
  /* Light Mode */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  
  /* Primary - Using brand burgundy */
  --primary: oklch(0.35 0.15 20);  /* #662222 in OKLCH */
  --primary-foreground: oklch(0.985 0 0);
  
  /* Secondary - Using brand rose */
  --secondary: oklch(0.45 0.12 15);  /* #842A3B in OKLCH */
  --secondary-foreground: oklch(0.985 0 0);
  
  /* Accent - Using warm cream */
  --accent: oklch(0.88 0.08 75);  /* #F5DAA7 in OKLCH */
  --accent-foreground: oklch(0.205 0 0);
  
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --destructive: oklch(0.50 0.20 20);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.45 0.12 15);
}
```

### Step 5: Create Component SCSS Example

**File:** `styles/components/_buttons.scss`

```scss
@use '../abstracts/variables' as *;

.btn {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  transition: all $transition-base;
  
  &-primary {
    background-color: $color-primary-dark;
    color: $color-white;
    
    &:hover {
      background-color: $color-primary-medium;
    }
  }
  
  &-secondary {
    background-color: $color-primary-medium;
    color: $color-white;
    
    &:hover {
      background-color: $color-primary-light;
    }
  }
  
  &-accent {
    background-color: $color-accent;
    color: $color-primary-dark;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
```

---

## 🔄 Sprint Ceremonies

### Daily Standup (Async for Solo)
- What did I complete yesterday?
- What will I work on today?
- Any blockers or decisions needed?

### Sprint Review (End of Sprint)
- Demo all styled components
- Verify design system consistency
- Document any deviations from plan

### Sprint Retrospective
- What went well?
- What could be improved?
- Lessons learned about SCSS + Tailwind v4

---

## 📊 Progress Tracking

### Day-by-Day Plan

**Day 1:** Design System Constants
- [ ] US-1.1.1: Create SCSS variables, mixins, functions (3 points)

**Day 2-3:** Custom Theme Integration
- [ ] US-1.1.2: Update Tailwind config and CSS variables (5 points)

**Day 4:** SCSS Architecture
- [ ] US-1.1.3: Set up SCSS folder structure and build process (3 points)

**Day 5:** Component Restyling
- [ ] US-1.1.4: Restyle shadcn/ui components (2 points)

---

## 🎉 Sprint Success Criteria

Sprint 1.1 is considered successful when:
- ✅ All 4 user stories completed
- ✅ 13 story points delivered
- ✅ Design system constants in place
- ✅ Brand colors applied throughout
- ✅ SCSS architecture functional
- ✅ shadcn/ui components match theme
- ✅ No visual regressions
- ✅ Accessibility standards met

---

## 📚 Resources

### Documentation
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [shadcn/ui Theming Guide](https://ui.shadcn.com/docs/theming)
- [OKLCH Color Picker](https://oklch.com/)

### Tools
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Palette Generator](https://coolors.co/)
- [SCSS to CSS Converter](https://jsonformatter.org/scss-to-css)

---

**Sprint Status:** 🚀 Ready to Start  
**Previous Sprint:** Sprint 1 - Foundation & Authentication (Completed)  
**Next Sprint:** Sprint 2 - Core Task Management  
**Last Updated:** 2025-11-30
