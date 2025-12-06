# SCSS + Tailwind CSS v4 Integration Guide
## Technical Implementation for Sprint 1.1

---

## 🎯 Overview

This guide explains how to integrate SCSS with Tailwind CSS v4 in Next.js without conflicts.

**Key Challenge:** Tailwind v4 uses a new `@import "tailwindcss"` syntax that differs from v3. We need to ensure SCSS works alongside this new system.

---

## 📦 Installation

### Step 1: Install SCSS

```bash
npm install -D sass
```

**Note:** Next.js automatically detects SCSS and configures it. No additional webpack config needed.

### Step 2: Verify Tailwind v4 Setup

Your `app/globals.css` should already have:

```css
@import "tailwindcss";
@import "tw-animate-css";
```

**Do NOT change this.** This is the Tailwind v4 syntax.

---

## 🏗️ Architecture

### File Structure

```
tdhn4o/
├── app/
│   ├── globals.css           # Tailwind v4 entry point
│   └── layout.tsx            # Imports both CSS and SCSS
├── styles/                   # SCSS modules
│   ├── abstracts/
│   │   ├── _variables.scss   # Design tokens
│   │   ├── _mixins.scss      # Reusable mixins
│   │   ├── _functions.scss   # SCSS functions
│   │   └── _index.scss       # Export abstracts
│   ├── base/
│   │   ├── _reset.scss       # CSS reset (optional)
│   │   ├── _typography.scss  # Typography styles
│   │   └── _index.scss
│   ├── components/
│   │   ├── _buttons.scss     # Button styles
│   │   ├── _forms.scss       # Form styles
│   │   ├── _cards.scss       # Card styles
│   │   ├── _shadcn-overrides.scss  # shadcn/ui overrides
│   │   └── _index.scss
│   ├── layouts/
│   │   ├── _header.scss      # Header styles
│   │   ├── _sidebar.scss     # Sidebar styles
│   │   └── _index.scss
│   ├── utilities/
│   │   ├── _helpers.scss     # Helper classes
│   │   └── _index.scss
│   └── main.scss             # Main SCSS entry point
```

---

## 📝 Implementation Steps

### Step 1: Create SCSS Variables

**File:** `styles/abstracts/_variables.scss`

```scss
// ============================================
// DESIGN SYSTEM VARIABLES
// ============================================

// Colors - Brand Palette
$color-primary-dark: #662222;
$color-primary-medium: #842A3B;
$color-primary-light: #A3485A;
$color-accent: #F5DAA7;

// Colors - Neutrals
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

// Spacing (4px base unit)
$spacing-base: 0.25rem;
$spacing-xs: calc($spacing-base * 1);    // 4px
$spacing-sm: calc($spacing-base * 2);    // 8px
$spacing-md: calc($spacing-base * 4);    // 16px
$spacing-lg: calc($spacing-base * 6);    // 24px
$spacing-xl: calc($spacing-base * 8);    // 32px
$spacing-2xl: calc($spacing-base * 12);  // 48px
$spacing-3xl: calc($spacing-base * 16);  // 64px

// Typography
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

// Border Radius
$radius-none: 0;
$radius-sm: 0.25rem;
$radius-md: 0.5rem;
$radius-lg: 0.75rem;
$radius-xl: 1rem;
$radius-2xl: 1.5rem;
$radius-full: 9999px;

// Shadows
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

// Z-Index
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;

// Transitions
$transition-fast: 150ms ease-in-out;
$transition-base: 200ms ease-in-out;
$transition-slow: 300ms ease-in-out;

// Breakpoints (match Tailwind)
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

### Step 2: Create SCSS Mixins

**File:** `styles/abstracts/_mixins.scss`

```scss
@use 'variables' as *;

// Flexbox utilities
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Responsive breakpoints
@mixin sm {
  @media (min-width: $breakpoint-sm) {
    @content;
  }
}

@mixin md {
  @media (min-width: $breakpoint-md) {
    @content;
  }
}

@mixin lg {
  @media (min-width: $breakpoint-lg) {
    @content;
  }
}

@mixin xl {
  @media (min-width: $breakpoint-xl) {
    @content;
  }
}

// Button base
@mixin btn-base {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  transition: all $transition-base;
  cursor: pointer;
  border: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Primary button
@mixin btn-primary {
  @include btn-base;
  background-color: $color-primary-dark;
  color: $color-white;
  
  &:hover:not(:disabled) {
    background-color: $color-primary-medium;
  }
  
  &:active:not(:disabled) {
    background-color: darken($color-primary-dark, 10%);
  }
}

// Card base
@mixin card {
  background-color: $color-white;
  border: 1px solid $color-gray-200;
  border-radius: $radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
}

// Focus ring
@mixin focus-ring($color: $color-primary-light) {
  outline: none;
  border-color: $color;
  box-shadow: 0 0 0 3px rgba($color, 0.2);
}

// Truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Line clamp
@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Step 3: Create SCSS Functions

**File:** `styles/abstracts/_functions.scss`

```scss
@use 'sass:color';
@use 'sass:math';

// Lighten color
@function lighten-color($color, $amount) {
  @return color.adjust($color, $lightness: $amount);
}

// Darken color
@function darken-color($color, $amount) {
  @return color.adjust($color, $lightness: -$amount);
}

// Add alpha to color
@function alpha($color, $opacity) {
  @return color.adjust($color, $alpha: -1 + $opacity);
}

// Calculate spacing
@function spacing($multiplier) {
  @return calc(0.25rem * $multiplier);
}
```

### Step 4: Create Index Files

**File:** `styles/abstracts/_index.scss`

```scss
@forward 'variables';
@forward 'mixins';
@forward 'functions';
```

**File:** `styles/components/_index.scss`

```scss
@forward 'buttons';
@forward 'forms';
@forward 'cards';
@forward 'shadcn-overrides';
```

**File:** `styles/base/_index.scss`

```scss
@forward 'typography';
```

**File:** `styles/layouts/_index.scss`

```scss
@forward 'header';
```

**File:** `styles/utilities/_index.scss`

```scss
@forward 'helpers';
```

### Step 5: Create Main SCSS File

**File:** `styles/main.scss`

```scss
// ============================================
// MAIN SCSS ENTRY POINT
// ============================================

// Abstracts (variables, mixins, functions)
@use 'abstracts' as *;

// Base styles
@use 'base';

// Layout styles
@use 'layouts';

// Component styles
@use 'components';

// Utility classes
@use 'utilities';
```

### Step 6: Create Component SCSS Examples

**File:** `styles/components/_buttons.scss`

```scss
@use '../abstracts' as *;

.btn {
  @include btn-base;
  
  &-primary {
    @include btn-primary;
  }
  
  &-secondary {
    @include btn-base;
    background-color: $color-primary-medium;
    color: $color-white;
    
    &:hover:not(:disabled) {
      background-color: $color-primary-light;
    }
  }
  
  &-accent {
    @include btn-base;
    background-color: $color-accent;
    color: $color-primary-dark;
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
  
  &-outline {
    @include btn-base;
    background-color: transparent;
    border: 2px solid $color-primary-dark;
    color: $color-primary-dark;
    
    &:hover:not(:disabled) {
      background-color: $color-primary-dark;
      color: $color-white;
    }
  }
}
```

**File:** `styles/components/_forms.scss`

```scss
@use '../abstracts' as *;

.form-input {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  border: 1px solid $color-gray-300;
  border-radius: $radius-md;
  font-size: $font-size-base;
  transition: all $transition-base;
  
  &:focus {
    @include focus-ring($color-primary-light);
  }
  
  &:disabled {
    background-color: $color-gray-100;
    cursor: not-allowed;
  }
  
  &.error {
    border-color: #DC2626;
    
    &:focus {
      @include focus-ring(#DC2626);
    }
  }
}

.form-label {
  display: block;
  margin-bottom: $spacing-sm;
  color: $color-primary-dark;
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
}

.form-error {
  margin-top: $spacing-xs;
  color: #DC2626;
  font-size: $font-size-sm;
}
```

**File:** `styles/components/_cards.scss`

```scss
@use '../abstracts' as *;

.card {
  @include card;
  
  &:hover {
    box-shadow: $shadow-lg;
    border-color: $color-primary-light;
  }
  
  &-branded {
    @include card;
    border-left: 4px solid $color-primary-dark;
    
    &:hover {
      border-left-color: $color-primary-medium;
    }
  }
  
  &-header {
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $color-gray-200;
  }
  
  &-title {
    color: $color-primary-dark;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    margin: 0;
  }
  
  &-body {
    color: $color-gray-700;
    line-height: $line-height-relaxed;
  }
  
  &-footer {
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $color-gray-200;
    display: flex;
    gap: $spacing-sm;
  }
}
```

**File:** `styles/components/_shadcn-overrides.scss`

```scss
@use '../abstracts' as *;

// Override shadcn/ui button component
button[class*="bg-primary"] {
  background-color: $color-primary-dark !important;
  
  &:hover {
    background-color: $color-primary-medium !important;
  }
}

button[class*="bg-secondary"] {
  background-color: $color-primary-medium !important;
  
  &:hover {
    background-color: $color-primary-light !important;
  }
}

button[class*="bg-accent"] {
  background-color: $color-accent !important;
  color: $color-primary-dark !important;
}

// Override input focus states
input:focus-visible,
textarea:focus-visible {
  border-color: $color-primary-light;
  box-shadow: 0 0 0 3px rgba($color-primary-light, 0.2);
}

// Override card hover states
[class*="card"]:hover {
  border-color: $color-primary-light;
}
```

**File:** `styles/base/_typography.scss`

```scss
@use '../abstracts' as *;

body {
  font-family: $font-family-sans;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $color-gray-900;
}

h1, h2, h3, h4, h5, h6 {
  color: $color-primary-dark;
  font-weight: $font-weight-semibold;
  line-height: $line-height-tight;
  margin-bottom: $spacing-md;
}

h1 {
  font-size: $font-size-4xl;
}

h2 {
  font-size: $font-size-3xl;
}

h3 {
  font-size: $font-size-2xl;
}

h4 {
  font-size: $font-size-xl;
}

h5 {
  font-size: $font-size-lg;
}

h6 {
  font-size: $font-size-base;
}

a {
  color: $color-primary-medium;
  text-decoration: none;
  transition: color $transition-base;
  
  &:hover {
    color: $color-primary-dark;
  }
}

code {
  font-family: $font-family-mono;
  font-size: 0.875em;
  background-color: $color-gray-100;
  padding: 0.125rem 0.25rem;
  border-radius: $radius-sm;
}
```

**File:** `styles/layouts/_header.scss`

```scss
@use '../abstracts' as *;

.header {
  background-color: $color-primary-dark;
  color: $color-white;
  padding: $spacing-md $spacing-lg;
  box-shadow: $shadow-md;
  
  &-container {
    max-width: 1280px;
    margin: 0 auto;
    @include flex-between;
  }
  
  &-logo {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-white;
    
    &:hover {
      color: $color-accent;
    }
  }
  
  &-nav {
    display: flex;
    gap: $spacing-lg;
    
    a {
      color: $color-white;
      font-weight: $font-weight-medium;
      transition: color $transition-base;
      
      &:hover {
        color: $color-accent;
      }
      
      &.active {
        color: $color-accent;
        border-bottom: 2px solid $color-accent;
      }
    }
  }
}
```

**File:** `styles/utilities/_helpers.scss`

```scss
@use '../abstracts' as *;

// Spacing utilities
.mt-sm { margin-top: $spacing-sm; }
.mt-md { margin-top: $spacing-md; }
.mt-lg { margin-top: $spacing-lg; }

.mb-sm { margin-bottom: $spacing-sm; }
.mb-md { margin-bottom: $spacing-md; }
.mb-lg { margin-bottom: $spacing-lg; }

.p-sm { padding: $spacing-sm; }
.p-md { padding: $spacing-md; }
.p-lg { padding: $spacing-lg; }

// Text utilities
.text-primary { color: $color-primary-dark; }
.text-secondary { color: $color-primary-medium; }
.text-accent { color: $color-accent; }

// Background utilities
.bg-primary { background-color: $color-primary-dark; }
.bg-secondary { background-color: $color-primary-medium; }
.bg-accent { background-color: $color-accent; }
```

### Step 7: Import SCSS in Next.js

**File:** `app/layout.tsx`

```tsx
import './globals.css'      // Tailwind v4 (MUST be first)
import '../styles/main.scss' // SCSS (after Tailwind)
```

**Important:** Import order matters!
1. `globals.css` (Tailwind v4) first
2. `main.scss` (SCSS) second

This ensures Tailwind utilities can override SCSS when needed.

---

## ⚙️ Configuration

### Next.js Config

**File:** `next.config.ts`

No changes needed! Next.js automatically handles SCSS.

### PostCSS Config

**File:** `postcss.config.mjs`

Your existing config should work:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

---

## 🎯 Usage Patterns

### Pattern 1: Use Tailwind for Utilities

```tsx
// ✅ GOOD: Use Tailwind for spacing, layout
<div className="flex items-center gap-4 p-4">
  <button className="btn-primary">Click Me</button>
</div>
```

### Pattern 2: Use SCSS for Components

```scss
// ✅ GOOD: Use SCSS for complex components
.task-card {
  @include card;
  
  &-header {
    @include flex-between;
    margin-bottom: $spacing-md;
  }
}
```

### Pattern 3: Combine Both

```tsx
// ✅ GOOD: Tailwind utilities + SCSS classes
<div className="card flex flex-col gap-4">
  <h3 className="card-title">Task Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

### Pattern 4: Use CSS Variables

```scss
// ✅ GOOD: Reference Tailwind CSS variables
.custom-component {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

---

## ❌ Common Mistakes

### Mistake 1: Overriding Tailwind Utilities

```scss
// ❌ BAD: Don't override Tailwind classes
.text-primary {
  color: red; // This conflicts with Tailwind
}

// ✅ GOOD: Use custom class names
.custom-text-primary {
  color: $color-primary-dark;
}
```

### Mistake 2: Wrong Import Order

```tsx
// ❌ BAD: SCSS before Tailwind
import '../styles/main.scss'
import './globals.css'

// ✅ GOOD: Tailwind first
import './globals.css'
import '../styles/main.scss'
```

### Mistake 3: Using @import Instead of @use

```scss
// ❌ BAD: Old SCSS syntax
@import 'variables';

// ✅ GOOD: Modern SCSS syntax
@use 'variables' as *;
```

---

## 🧪 Testing

### Test SCSS Compilation

```bash
npm run dev
```

Check console for SCSS errors.

### Test Tailwind Integration

1. Add a Tailwind class: `<div className="bg-primary">`
2. Add an SCSS class: `<div className="btn-primary">`
3. Verify both work

### Test Build

```bash
npm run build
```

Ensure no compilation errors.

---

## 🐛 Troubleshooting

### Issue: SCSS not compiling

**Solution:**
```bash
# Reinstall sass
npm uninstall sass
npm install -D sass

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Styles not applying

**Solution:**
- Check import order in `layout.tsx`
- Verify file paths are correct
- Check for typos in class names

### Issue: Tailwind classes not working

**Solution:**
- Ensure `globals.css` is imported first
- Don't override Tailwind utilities in SCSS
- Use `!important` sparingly

---

## ✅ Checklist

Before considering Sprint 1.1 complete:

- [ ] SCSS compiles without errors
- [ ] Tailwind utilities still work
- [ ] Brand colors applied
- [ ] Components use SCSS classes
- [ ] No console errors
- [ ] Build succeeds
- [ ] Styles work in production

---

**Last Updated:** 2025-11-30  
**Version:** 1.0  
**Status:** Ready for Implementation
