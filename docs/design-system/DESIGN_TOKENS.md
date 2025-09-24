# 🎨 Blottr Design Tokens & Theme System

Complete design token system for the Blottr tattoo platform, capturing the
professional yet artistic nature of the tattoo industry while maintaining
excellent usability and accessibility.

## 🌈 Color System

### Brand Colors

**Primary Red** - Professional brand identity

```css
/* Main brand red */
--primary-500: #e75d5d;
/* Full scale available: primary-50 through primary-950 */
```

**Secondary Gray** - Professional neutrals

```css
/* Sophisticated grays for UI elements */
--secondary-500: #9aa0a6;
/* Full scale: secondary-50 through secondary-950 */
```

### Tattoo Industry Colors

**Ink Gray** - Classic tattoo aesthetics

```css
--ink-500: #71717a; /* Classic tattoo ink gray */
/* Scales: ink-50 through ink-950 */
```

**Flash Orange** - Flash tattoo highlights

```css
--flash-500: #f97316; /* Vibrant flash tattoo accent */
/* Scales: flash-50 through flash-950 */
```

**Verified Green** - Verification badges

```css
--verified-500: #10b981; /* Trusted verification color */
/* Scales: verified-50 through verified-950 */
```

### Semantic Colors

- **Success**: Green tones for positive actions
- **Warning**: Amber tones for caution states
- **Error**: Red tones for errors and danger
- **Info**: Blue tones for informational content

## 📝 Typography System

### Font Families

```typescript
// Primary sans-serif stack
font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif

// Display font (same as sans for consistency)
font-display: Inter, ui-sans-serif, system-ui

// Artist name styling
font-artist: Inter (medium weight)
```

### Specialized Text Sizes

```css
/* Artist names */
.text-artist {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 500;
}

/* Salon names */
.text-salon {
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 400;
}

/* Price display */
.text-price {
  font-size: 1.25rem;
  line-height: 1.5rem;
  font-weight: 600;
  color: rgb(var(--primary));
}

/* Caption text */
.text-caption {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
```

### Responsive Typography Scale

| Size        | Mobile | Desktop | Usage              |
| ----------- | ------ | ------- | ------------------ |
| `text-xs`   | 12px   | 12px    | Captions, metadata |
| `text-sm`   | 14px   | 14px    | Body text small    |
| `text-base` | 16px   | 16px    | Body text          |
| `text-lg`   | 18px   | 18px    | Large body text    |
| `text-xl`   | 20px   | 20px    | Subheadings        |
| `text-2xl`  | 24px   | 24px    | Section headings   |
| `text-3xl`  | 30px   | 30px    | Page titles        |
| `text-4xl`  | 36px   | 36px    | Hero headings      |

## 📏 Spacing & Layout

### 8px Grid System

All spacing follows an 8px grid for visual consistency:

```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
--spacing-3xl: 4rem; /* 64px */
--spacing-4xl: 6rem; /* 96px */
```

### Enhanced Spacing Scale

Additional spacing values for fine-tuned control:

- `spacing-0.5`: 2px
- `spacing-1.5`: 6px
- `spacing-2.5`: 10px
- `spacing-3.5`: 14px
- `spacing-4.5`: 18px
- `spacing-5.5`: 22px
- And more...

### Container Widths

```css
.container {
  max-width: 1200px;
} /* Standard content */
.container-narrow {
  max-width: 768px;
} /* Forms, articles */
.container-wide {
  max-width: 1440px;
} /* Galleries, dashboards */
```

## 🎭 Component Tokens

### Gallery System

**Grid Layouts**

```css
.gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.gallery-grid-sm {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.gallery-grid-lg {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
```

**Masonry Layout**

```css
.masonry {
  column-count: 3;
  column-gap: 1.5rem;
}

@media (max-width: 768px) {
  .masonry {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .masonry {
    column-count: 4;
  }
}
```

### Shadows

**Gallery Shadows**

```css
--shadow-gallery: 0 4px 20px 0 rgb(0 0 0 / 0.08), 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-gallery-hover:
  0 8px 30px 0 rgb(0 0 0 / 0.12), 0 4px 6px 0 rgb(0 0 0 / 0.1);
```

**Card Shadows**

```css
--shadow-card: 0 2px 8px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04);
--shadow-card-hover:
  0 4px 16px 0 rgb(0 0 0 / 0.1), 0 2px 4px 0 rgb(0 0 0 / 0.06);
```

### Border Radius

```css
--radius-sm: 0.375rem; /* 6px - Small elements */
--radius-md: 0.5rem; /* 8px - Standard radius */
--radius-lg: 0.75rem; /* 12px - Cards, buttons */
--radius-xl: 1rem; /* 16px - Large cards */
--radius-2xl: 1.5rem; /* 24px - Hero elements */
--radius-full: 9999px; /* Full circle - Avatars, pills */
```

## 🎬 Animation & Interaction

### Animation Tokens

**Durations**

```css
--duration-fast: 200ms; /* Quick interactions */
--duration-normal: 300ms; /* Standard transitions */
--duration-slow: 500ms; /* Complex animations */
```

**Easing Functions**

```css
--easing-ease: ease;
--easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Micro-interactions

**Gallery Hover Effects**

```css
.gallery-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gallery-hover);
  transition: all 300ms ease-out;
}
```

**Button Interactions**

```css
.btn:hover {
  transform: translateY(-1px);
  transition: all 200ms ease-out;
}

.btn:active {
  transform: translateY(0);
  transition: all 100ms ease-in;
}
```

## 📱 Responsive Design

### Breakpoints

```typescript
breakpoints: {
  xs: '475px',    // Extra small devices
  sm: '640px',    // Small devices
  md: '768px',    // Medium devices (tablets)
  lg: '1024px',   // Large devices (laptops)
  xl: '1280px',   // Extra large devices
  '2xl': '1536px', // Ultra wide displays
  '3xl': '1920px', // Ultra wide displays

  // Gallery-specific breakpoints
  'gallery-sm': '480px',
  'gallery-md': '768px',
  'gallery-lg': '1024px',
  'gallery-xl': '1280px',
}
```

### Aspect Ratios

```css
/* Portfolio specific ratios */
aspect-portrait: 3 / 4; /* Common tattoo photo ratio */
aspect-landscape: 4 / 3; /* Landscape photos */
aspect-square: 1 / 1; /* Profile images */
aspect-golden: 1.618 / 1; /* Golden ratio */
```

## 🌙 Theme System

### Theme Switching

The platform supports three themes:

1. **Light Theme** - Clean, professional appearance
2. **Dark Theme** - Dark mode for low-light environments
3. **High Contrast** - Enhanced accessibility compliance

### CSS Custom Properties

Each theme automatically updates these variables:

```css
:root {
  --background: /* theme background */;
  --foreground: /* theme text color */;
  --primary: /* brand color (consistent) */;
  --muted: /* muted backgrounds */;
  --border: /* border colors */;
  /* ... and more */
}
```

### Theme Usage

```typescript
import { useTheme, applyTheme } from '~/lib/theme'

// In React components
const { theme, setTheme } = useTheme()

// Programmatic theme switching
applyTheme('dark')
```

## 🎯 Component Classes

### Buttons

```css
.btn {
  /* Base button styles */
}
.btn-primary {
  /* Primary brand button */
}
.btn-secondary {
  /* Secondary button */
}
.btn-flash {
  /* Flash tattoo accent button */
}
```

### Badges

```css
.badge {
  /* Base badge styles */
}
.badge-verified {
  /* Verification badges */
}
.badge-flash {
  /* Flash tattoo badges */
}
.badge-ink {
  /* Ink/style badges */
}
```

### Cards

```css
.card {
  /* Standard card */
}
.artist-card {
  /* Artist profile cards */
}
.gallery-item {
  /* Portfolio items */
}
```

### Form Elements

```css
.form-input {
  /* Standard inputs */
}
.form-textarea {
  /* Text areas */
}
.form-select {
  /* Select dropdowns */
}
.form-label {
  /* Form labels */
}
.form-error {
  /* Error messages */
}
.form-help {
  /* Help text */
}
```

## ♿ Accessibility

### High Contrast Support

The high contrast theme provides:

- Pure black text on white backgrounds
- Thick borders for clear element separation
- High contrast color combinations
- Enhanced focus states

### Focus States

```css
.focus-ring {
  focus:outline-none
  focus:ring-2
  focus:ring-primary
  focus:ring-offset-2
}
```

### Screen Reader Support

All interactive elements include appropriate ARIA labels and semantic markup.

## 🔧 Utility Classes

### Text Utilities

```css
.text-balance {
  text-wrap: balance;
}
.line-clamp-1 {
  /* Single line truncation */
}
.line-clamp-2 {
  /* Two line truncation */
}
.line-clamp-3 {
  /* Three line truncation */
}
```

### Loading States

```css
.skeleton {
  /* Skeleton loading animation */
}
.loading-spinner {
  /* Spinning loader */
}
.loading-shimmer {
  /* Shimmer effect */
}
```

### Scrollbars

```css
.scrollbar-thin {
  /* Thin custom scrollbars */
}
.scrollbar-none {
  /* Hide scrollbars */
}
```

## 📖 Usage Examples

### Artist Profile Card

```tsx
<div className="artist-card">
  <img className="artist-avatar-lg" src="avatar.jpg" alt="Artist" />
  <h3 className="artist-name">John Doe</h3>
  <p className="salon-name">Ink Masters Studio</p>
  <div className="badge-verified">Verified Artist</div>
  <div className="price-display">€120 - €300</div>
</div>
```

### Gallery Grid

```tsx
<div className="gallery-container">
  {tattoos.map((tattoo) => (
    <div key={tattoo.id} className="gallery-item group">
      <img className="tattoo-image" src={tattoo.image} alt={tattoo.alt} />
      <div className="tattoo-overlay">
        <div className="tattoo-info">
          <p className="text-caption">{tattoo.description}</p>
          {tattoo.isFlash && <div className="badge-flash">Flash</div>}
        </div>
      </div>
    </div>
  ))}
</div>
```

### Theme Switcher

```tsx
import ThemeSwitcher from '~/components/ThemeSwitcher'
;<ThemeSwitcher className="ml-auto" showLabels={true} />
```

## 🚀 Performance Notes

- CSS custom properties enable theme switching without CSS rebuilds
- All animations use GPU-accelerated properties (`transform`, `opacity`)
- Responsive images with proper aspect ratios prevent layout shift
- Skeleton loading states improve perceived performance

## 📚 Resources

- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Inter Font**: https://rsms.me/inter/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Custom Properties**:
  https://developer.mozilla.org/en-US/docs/Web/CSS/--*

---

_This design system ensures consistency across the Blottr platform while
maintaining the professional yet artistic aesthetic appropriate for the tattoo
industry._
