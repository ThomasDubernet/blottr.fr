# Implementation Stack Documentation

## Complete Integration Guide for Blottr Design System

### Table of Contents

1. [Tailwind CSS Configuration](#tailwind-css-configuration)
2. [shadcn/ui Integration](#shadcnui-integration)
3. [Radix UI Implementation](#radix-ui-implementation)
4. [Storybook Setup](#storybook-setup)
5. [Inertia.js Compatibility](#inertiajs-compatibility)
6. [Development Workflow](#development-workflow)

---

## Tailwind CSS Configuration

### Installation & Setup

```bash
# Install Tailwind CSS and dependencies
pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/typography
pnpm add clsx tailwind-merge class-variance-authority
```

### Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './inertia/pages/**/*.{js,ts,jsx,tsx}',
    './inertia/components/**/*.{js,ts,jsx,tsx}',
    './inertia/app/**/*.{js,ts,jsx,tsx}',
    './app/views/**/*.edge',
  ],
  theme: {
    extend: {
      // Blottr Brand Colors
      colors: {
        primary: {
          50: '#fff1f2',
          500: '#ef4444', // Blottr red
          600: '#dc2626',
          900: '#7f1d1d',
        },
        ink: {
          100: '#f3f4f6',
          300: '#d1d5db',
          500: '#6b7280',
          700: '#374151',
          900: '#111827',
        },
        // Tattoo industry specific colors
        flash: '#fbbf24', // Gold for flash tattoos
        traditional: '#dc2626', // Classic red
        realism: '#374151', // Deep gray
        watercolor: '#8b5cf6', // Purple accent
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Custom plugin for component utilities
    function ({ addUtilities }) {
      addUtilities({
        '.ink-shadow': {
          'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        '.tattoo-focus': {
          '@apply ring-2 ring-primary-500 ring-offset-2 outline-none': {},
        },
      })
    },
  ],
}
```

### PostCSS Configuration (`postcss.config.js`)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### CSS Entry Point (`inertia/css/app.css`)

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Blottr Custom Base Styles */
@layer base {
  html {
    @apply text-base text-ink-900 bg-white;
  }

  body {
    @apply font-sans antialiased;
  }

  /* Focus styles for accessibility */
  *:focus {
    @apply outline-none;
  }

  .focus-visible {
    @apply tattoo-focus;
  }
}

/* Component Layer for Blottr-specific patterns */
@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }

  .btn-outline {
    @apply border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }

  .card {
    @apply bg-white rounded-xl ink-shadow border border-ink-100;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-ink-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors;
  }
}

/* Animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## shadcn/ui Integration

### Installation Command

```bash
# Initialize shadcn/ui in existing project
npx shadcn-ui@latest init
```

### Configuration (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "inertia/css/app.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "inertia/components/ui",
    "utils": "inertia/lib/utils"
  }
}
```

### Utility Functions (`inertia/lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Blottr-specific utilities
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}
```

### Core Component Installation

```bash
# Install essential components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
```

---

## Radix UI Implementation

### Direct Radix Usage (Advanced Components)

```bash
# Install specific Radix primitives not covered by shadcn/ui
pnpm add @radix-ui/react-navigation-menu
pnpm add @radix-ui/react-tabs
pnpm add @radix-ui/react-accordion
pnpm add @radix-ui/react-slider
pnpm add @radix-ui/react-toggle-group
```

### Custom Radix Component Example

```typescript
// inertia/components/ui/navigation-menu.tsx
import React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "../../lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))

// Export all necessary components...
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink
}
```

---

## Storybook Setup

### Installation

```bash
# Install Storybook
npx storybook@latest init

# Additional addons for React + Inertia.js
pnpm add -D @storybook/addon-essentials
pnpm add -D @storybook/addon-interactions
pnpm add -D @storybook/addon-a11y
pnpm add -D @storybook/test
```

### Main Configuration (`.storybook/main.ts`)

```typescript
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: [
    '../inertia/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../inertia/pages/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '~': path.resolve(__dirname, '../inertia'),
          '#': path.resolve(__dirname, '../'),
        },
      },
    })
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
}

export default config
```

### Preview Configuration (`.storybook/preview.ts`)

```typescript
import type { Preview } from '@storybook/react'
import '../inertia/css/app.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
        { name: 'ink', value: '#f9fafb' },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
      },
    },
  },
}

export default preview
```

### Component Story Example

```typescript
// inertia/components/ui/button.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Primary button component for Blottr application actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Contact Artist',
    variant: 'default',
  },
}

export const Outline: Story = {
  args: {
    children: 'View Portfolio',
    variant: 'outline',
  },
}

export const Loading: Story = {
  args: {
    children: 'Booking...',
    disabled: true,
  },
}
```

---

## Inertia.js Compatibility

### Vite Configuration Updates (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true } }),
    react(),
    adonisjs({
      entrypoints: ['inertia/app/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
      '#/': `${getDirname(import.meta.url)}/`,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'design-system': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'ui-components': ['lucide-react', 'class-variance-authority'],
        },
      },
    },
  },
})
```

### App Entry Point Updates (`inertia/app/app.tsx`)

```typescript
import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { Toaster } from '~/components/ui/toaster'

const appName = 'Blottr'

createInertiaApp({
  progress: { color: '#ef4444' }, // Blottr brand color
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )
  },
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(
      <>
        <App {...props} />
        <Toaster />
      </>
    )
  }
})
```

### Layout Component Integration

```typescript
// inertia/components/layouts/app-layout.tsx
import React from 'react'
import { Head } from '@inertiajs/react'
import { Navigation } from '~/components/navigation'
import { Footer } from '~/components/footer'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function AppLayout({ children, title, className }: AppLayoutProps) {
  return (
    <>
      {title && <Head title={title} />}
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className={cn("py-6", className)}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
```

---

## Development Workflow

### Package.json Scripts Updates

```json
{
  "scripts": {
    "dev": "node ace serve --hmr",
    "build": "node ace build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "ui:add": "npx shadcn-ui@latest add",
    "ui:diff": "npx shadcn-ui@latest diff",
    "type-check": "tsc --noEmit",
    "lint:css": "stylelint 'inertia/**/*.css'",
    "test:components": "vitest run --config vitest.components.config.ts"
  }
}
```

### Development Commands

```bash
# Start development environment
pnpm dev                    # AdonisJS + Vite HMR
pnpm storybook             # Component development

# Component development workflow
pnpm ui:add button         # Add new shadcn component
pnpm ui:diff button        # Check for component updates

# Testing and quality
pnpm type-check            # TypeScript validation
pnpm test:components       # Component unit tests
pnpm lint:css             # CSS/Tailwind linting
```

### IDE Configuration (VSCode)

```json
// .vscode/settings.json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "css.validate": false,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### TypeScript Configuration Updates (`inertia/tsconfig.json`)

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./"]
    },
    "types": ["vite/client", "@inertiajs/inertia"]
  },
  "include": ["**/*.ts", "**/*.tsx", "../@types/**/*.ts"]
}
```

---

## Performance Optimization

### Bundle Analysis Configuration

```typescript
// vite.config.ts - Production optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
  },
})
```

### Critical CSS Strategy

```css
/* Critical CSS for above-the-fold content */
@layer critical {
  .hero-section {
    @apply bg-gradient-to-r from-primary-500 to-primary-600;
  }

  .navigation {
    @apply bg-white shadow-sm border-b border-ink-200;
  }

  .search-bar {
    @apply w-full max-w-md mx-auto;
  }
}
```

---

**Document Version**: 1.0
**Technology Stack**: AdonisJS v6 + React 19 + Inertia.js + Tailwind + shadcn/ui
**Last Updated**: 2025-09-24
**Next Review**: After Phase 1 implementation
