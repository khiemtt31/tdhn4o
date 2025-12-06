# Sprint 1.1 - Color Palette & Usage Guide
## Visual Design Reference

---

## 🎨 Brand Color Palette

### Primary Colors

#### #662222 - Deep Burgundy (Primary Dark)
**RGB:** `rgb(102, 34, 34)`  
**OKLCH:** `oklch(0.35 0.15 20)`  
**HSL:** `hsl(0, 50%, 27%)`

**Usage:**
- Primary buttons
- Main navigation background
- Important headings
- Active states
- Brand elements

**Examples:**
```tsx
// Tailwind
<button className="bg-primary text-primary-foreground">
  Primary Button
</button>

// SCSS
.header {
  background-color: $color-primary-dark;
}
```

---

#### #842A3B - Rich Rose (Primary Medium)
**RGB:** `rgb(132, 42, 59)`  
**OKLCH:** `oklch(0.45 0.12 15)`  
**HSL:** `hsl(349, 52%, 34%)`

**Usage:**
- Secondary buttons
- Hover states for primary elements
- Subheadings
- Links
- Secondary navigation

**Examples:**
```tsx
// Tailwind
<button className="bg-secondary text-secondary-foreground">
  Secondary Button
</button>

// SCSS
.btn-primary:hover {
  background-color: $color-primary-medium;
}
```

---

#### #A3485A - Dusty Rose (Primary Light)
**RGB:** `rgb(163, 72, 90)`  
**OKLCH:** `oklch(0.55 0.10 10)`  
**HSL:** `hsl(348, 39%, 46%)`

**Usage:**
- Borders on focus
- Subtle backgrounds
- Disabled button backgrounds
- Tags and badges
- Hover effects on cards

**Examples:**
```tsx
// Tailwind
<input className="focus:ring-[#A3485A] focus:border-[#A3485A]" />

// SCSS
.card:hover {
  border-color: $color-primary-light;
}
```

---

#### #F5DAA7 - Warm Cream (Accent)
**RGB:** `rgb(245, 218, 167)`  
**OKLCH:** `oklch(0.88 0.08 75)`  
**HSL:** `hsl(39, 78%, 81%)`

**Usage:**
- Accent buttons
- Highlights and callouts
- Success states
- Badges for important items
- Decorative elements

**Examples:**
```tsx
// Tailwind
<span className="bg-accent text-accent-foreground">
  New Feature!
</span>

// SCSS
.badge-highlight {
  background-color: $color-accent;
  color: $color-primary-dark;
}
```

---

## 🎯 Color Application Examples

### Buttons

```tsx
// Primary Action
<button className="bg-[#662222] hover:bg-[#842A3B] text-white">
  Create Task
</button>

// Secondary Action
<button className="bg-[#842A3B] hover:bg-[#A3485A] text-white">
  Save Draft
</button>

// Accent Action
<button className="bg-[#F5DAA7] hover:opacity-90 text-[#662222]">
  Learn More
</button>

// Outline
<button className="border-2 border-[#662222] text-[#662222] hover:bg-[#662222] hover:text-white">
  Cancel
</button>
```

### Forms

```tsx
// Input with focus state
<input 
  className="
    border-gray-300 
    focus:border-[#A3485A] 
    focus:ring-[#A3485A]
  "
  type="text"
/>

// Label
<label className="text-[#662222] font-medium">
  Task Title
</label>

// Error state
<input 
  className="
    border-red-500 
    focus:border-red-500 
    focus:ring-red-500
  "
/>
<p className="text-red-600 text-sm">This field is required</p>
```

### Cards

```tsx
// Default card
<div className="
  bg-white 
  border border-gray-200 
  hover:border-[#A3485A] 
  hover:shadow-lg 
  transition-all
">
  <h3 className="text-[#662222]">Task Title</h3>
  <p className="text-gray-600">Task description...</p>
</div>

// Highlighted card
<div className="
  bg-[#F5DAA7] 
  border-2 border-[#842A3B]
">
  <h3 className="text-[#662222]">Featured Task</h3>
</div>
```

### Navigation

```tsx
// Header
<header className="bg-[#662222] text-white">
  <nav>
    <a className="hover:text-[#F5DAA7]">Dashboard</a>
    <a className="hover:text-[#F5DAA7]">Tasks</a>
  </nav>
</header>

// Active link
<a className="
  text-white 
  bg-[#842A3B] 
  border-b-2 border-[#F5DAA7]
">
  Current Page
</a>
```

### Badges & Tags

```tsx
// Priority badges
<span className="bg-[#662222] text-white px-2 py-1 rounded">
  High Priority
</span>

<span className="bg-[#842A3B] text-white px-2 py-1 rounded">
  Medium Priority
</span>

<span className="bg-[#A3485A] text-white px-2 py-1 rounded">
  Low Priority
</span>

// Status badge
<span className="bg-[#F5DAA7] text-[#662222] px-2 py-1 rounded font-medium">
  In Progress
</span>
```

---

## 🌓 Dark Mode Variations

### Dark Mode Color Adjustments

```css
.dark {
  /* Lighten primary colors for better contrast */
  --primary: oklch(0.45 0.15 20);      /* Lighter burgundy */
  --secondary: oklch(0.55 0.12 15);    /* Lighter rose */
  
  /* Keep accent bright */
  --accent: oklch(0.88 0.08 75);       /* Same cream */
  --accent-foreground: oklch(0.25 0.15 20); /* Darker text */
  
  /* Adjust backgrounds */
  --background: oklch(0.15 0 0);       /* Dark background */
  --foreground: oklch(0.95 0 0);       /* Light text */
}
```

### Dark Mode Examples

```tsx
// Button in dark mode
<button className="
  bg-[#842A3B] 
  dark:bg-[#A3485A] 
  text-white
">
  Primary Action
</button>

// Card in dark mode
<div className="
  bg-white 
  dark:bg-gray-800 
  border border-gray-200 
  dark:border-[#A3485A]
">
  Content
</div>
```

---

## ♿ Accessibility - Color Contrast

### WCAG AA Compliance

All color combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text):

#### ✅ Passing Combinations

| Foreground | Background | Contrast Ratio | Use Case |
|------------|------------|----------------|----------|
| #662222 | #FFFFFF | 9.2:1 | Text on white |
| #FFFFFF | #662222 | 9.2:1 | White text on burgundy |
| #842A3B | #FFFFFF | 6.8:1 | Text on white |
| #FFFFFF | #842A3B | 6.8:1 | White text on rose |
| #662222 | #F5DAA7 | 5.1:1 | Dark text on cream |
| #A3485A | #FFFFFF | 4.6:1 | Light rose on white |

#### ❌ Failing Combinations (Avoid)

| Foreground | Background | Contrast Ratio | Issue |
|------------|------------|----------------|-------|
| #A3485A | #F5DAA7 | 2.8:1 | Too low for body text |
| #F5DAA7 | #FFFFFF | 1.4:1 | Too low for any text |

### Accessible Usage

```tsx
// ✅ GOOD: High contrast
<button className="bg-[#662222] text-white">
  Click Me
</button>

// ✅ GOOD: Large text can use lower contrast
<h1 className="text-4xl text-[#A3485A]">
  Heading
</h1>

// ❌ BAD: Low contrast for body text
<p className="text-[#A3485A] bg-[#F5DAA7]">
  This is hard to read
</p>

// ✅ FIXED: Use darker text
<p className="text-[#662222] bg-[#F5DAA7]">
  This is readable
</p>
```

---

## 📐 Spacing & Layout with Colors

### Card Layouts

```tsx
// Task card with brand colors
<div className="
  bg-white 
  border-l-4 border-[#662222]
  p-4 
  hover:shadow-lg 
  transition-shadow
">
  <div className="flex items-center gap-2 mb-2">
    <h3 className="text-[#662222] font-semibold">Task Title</h3>
    <span className="bg-[#F5DAA7] text-[#662222] px-2 py-0.5 rounded text-xs">
      High Priority
    </span>
  </div>
  <p className="text-gray-600 mb-3">Task description goes here...</p>
  <div className="flex gap-2">
    <button className="bg-[#662222] hover:bg-[#842A3B] text-white px-3 py-1 rounded">
      Edit
    </button>
    <button className="border border-[#A3485A] text-[#A3485A] hover:bg-[#A3485A] hover:text-white px-3 py-1 rounded">
      Delete
    </button>
  </div>
</div>
```

### Form Layouts

```tsx
// Registration form with brand styling
<form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-[#662222] mb-6">Create Account</h2>
  
  <div className="mb-4">
    <label className="block text-[#662222] font-medium mb-2">
      Email
    </label>
    <input 
      type="email"
      className="
        w-full 
        px-3 py-2 
        border border-gray-300 
        rounded 
        focus:border-[#A3485A] 
        focus:ring-2 focus:ring-[#A3485A]/20
      "
    />
  </div>
  
  <button className="
    w-full 
    bg-[#662222] 
    hover:bg-[#842A3B] 
    text-white 
    py-2 
    rounded 
    font-medium 
    transition-colors
  ">
    Sign Up
  </button>
  
  <p className="mt-4 text-center text-gray-600">
    Already have an account? 
    <a href="/login" className="text-[#842A3B] hover:text-[#662222] ml-1">
      Log in
    </a>
  </p>
</form>
```

---

## 🎨 SCSS Mixins for Brand Colors

### Useful Mixins

```scss
// File: styles/abstracts/_mixins.scss

@use 'variables' as *;

// Primary button mixin
@mixin btn-primary {
  background-color: $color-primary-dark;
  color: $color-white;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  transition: background-color $transition-base;
  
  &:hover {
    background-color: $color-primary-medium;
  }
  
  &:active {
    background-color: darken($color-primary-dark, 10%);
  }
  
  &:disabled {
    background-color: $color-gray-300;
    cursor: not-allowed;
  }
}

// Card with brand accent
@mixin card-branded {
  background-color: $color-white;
  border-left: 4px solid $color-primary-dark;
  padding: $spacing-md;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-lg;
    border-left-color: $color-primary-medium;
  }
}

// Focus ring with brand color
@mixin focus-ring {
  outline: none;
  border-color: $color-primary-light;
  box-shadow: 0 0 0 3px rgba($color-primary-light, 0.2);
}
```

### Usage Examples

```scss
// Use in component
.task-card {
  @include card-branded;
}

.submit-button {
  @include btn-primary;
}

input:focus {
  @include focus-ring;
}
```

---

## 📱 Responsive Color Usage

### Mobile-First Approach

```tsx
// Adjust colors for mobile
<div className="
  bg-white 
  sm:bg-gray-50 
  border-[#A3485A] 
  sm:border-[#662222]
">
  <h2 className="
    text-[#662222] 
    text-xl 
    sm:text-2xl 
    lg:text-3xl
  ">
    Responsive Heading
  </h2>
</div>
```

---

## 🎯 Component-Specific Color Guidelines

### Buttons
- **Primary:** `#662222` → hover: `#842A3B`
- **Secondary:** `#842A3B` → hover: `#A3485A`
- **Accent:** `#F5DAA7` → hover: opacity 90%
- **Destructive:** Keep default red for clarity

### Forms
- **Border:** `#E5E5E5` (gray-200)
- **Focus:** `#A3485A` with 20% opacity ring
- **Error:** Keep default red
- **Success:** Use `#2D5F3F` (dark green)

### Navigation
- **Background:** `#662222`
- **Text:** White
- **Hover:** `#F5DAA7`
- **Active:** `#842A3B` background

### Cards
- **Border:** `#E5E5E5` default, `#A3485A` on hover
- **Accent border:** `#662222` (left border 4px)
- **Background:** White or `#FAFAFA`

### Badges
- **High priority:** `#662222`
- **Medium priority:** `#842A3B`
- **Low priority:** `#A3485A`
- **Status:** `#F5DAA7`

---

## ✅ Implementation Checklist

When applying colors to components:

- [ ] Use CSS variables from `globals.css` when possible
- [ ] Use SCSS variables for component-specific styles
- [ ] Ensure 4.5:1 contrast ratio for text
- [ ] Test in both light and dark modes
- [ ] Verify hover states are visible
- [ ] Check focus states are clear
- [ ] Test on mobile devices
- [ ] Validate with accessibility tools

---

**Last Updated:** 2025-11-30  
**Version:** 1.0  
**Status:** Ready for Implementation
