# 🎨 Design System Implementation Guide

## Overview

This guide provides comprehensive documentation for implementing a modern design system stack with Blottr.fr, including Tailwind CSS, shadcn/ui, Radix UI, and Storybook integration with AdonisJS + React + Inertia.js.

## Technology Stack

- **React 19.1.1** with TypeScript 5.8+
- **Inertia.js 2.1.10** for SPA-like experience
- **Vite 6.3.5** as build tool
- **AdonisJS 6.18.0** backend integration

---

## 1. Tailwind CSS v3.4+ Configuration

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography
npx tailwindcss init -p
```

### Configuration with Custom Design Tokens

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./inertia/**/*.{js,ts,jsx,tsx}', './resources/views/**/*.edge'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Brand colors for Blottr.fr
        'brand': {
          50: '#fef7ee',
          100: '#fdedd6',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#9a3412',
        },
        // Semantic colors
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'card': 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        'popover': 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        'primary': 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary': 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        'muted': 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'accent': 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        'destructive': 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        'radius': 'var(--radius)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}

export default config
```

### CSS Variables Setup

```css
/* inertia/css/app.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Performance Optimizations

1. **PurgeCSS Configuration**:

```typescript
// tailwind.config.ts
export default {
  content: {
    files: ['./inertia/**/*.{js,ts,jsx,tsx}', './resources/views/**/*.edge'],
    extract: {
      // Custom extractor for AdonisJS Edge templates
      edge: (content: string) => {
        return content.match(/[A-Za-z0-9-_:/]+/g) || []
      },
    },
  },
  // ... rest of config
}
```

2. **JIT Mode Optimization**:

```typescript
export default {
  mode: 'jit',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./inertia/**/*.{js,ts,jsx,tsx}'],
  },
}
```

---

## 2. shadcn/ui Installation and Setup

### Installation with React 19 + TypeScript

```bash
npx shadcn-ui@latest init
```

### Configuration for AdonisJS + Inertia.js

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "inertia/css/app.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui"
  },
  "iconLibrary": "lucide-react"
}
```

### Core Components Installation

```bash
# Essential UI components
npx shadcn-ui@latest add button card input label
npx shadcn-ui@latest add dialog sheet tooltip popover
npx shadcn-ui@latest add form table pagination
npx shadcn-ui@latest add avatar badge separator
npx shadcn-ui@latest add select combobox command
npx shadcn-ui@latest add alert-dialog toast
```

### Utils Library Setup

```typescript
// inertia/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
```

### Custom Component Examples

```typescript
// inertia/components/ui/artist-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'
import { cn } from '~/lib/utils'

interface ArtistCardProps {
  artist: {
    id: string
    firstname: string
    lastname: string
    avatar?: string
    city?: { name: string }
    isVerified: boolean
    styles: string[]
  }
  className?: string
}

export function ArtistCard({ artist, className }: ArtistCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={artist.avatar} />
            <AvatarFallback>
              {artist.firstname[0]}{artist.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {artist.firstname} {artist.lastname}
              {artist.isVerified && (
                <Badge variant="secondary" className="ml-2">
                  Vérifié
                </Badge>
              )}
            </CardTitle>
            {artist.city && (
              <p className="text-sm text-muted-foreground">
                {artist.city.name}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {artist.styles.slice(0, 3).map((style) => (
            <Badge key={style} variant="outline">
              {style}
            </Badge>
          ))}
          {artist.styles.length > 3 && (
            <Badge variant="outline">
              +{artist.styles.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### TypeScript Integration

```typescript
// inertia/types/components.ts
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ArtistData {
  id: string
  firstname: string
  lastname: string
  slug: string
  avatar?: string
  bio?: string
  isVerified: boolean
  city?: CityData
  salon?: SalonData
  styles: string[]
}

export interface PageProps<T = Record<string, unknown>> {
  auth?: {
    user?: UserData
  }
  flash?: {
    success?: string
    error?: string
  }
  [key: string]: any
} & T
```

---

## 3. Radix UI Primitives Integration

### Installation

```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tooltip
npm install @radix-ui/react-accordion @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-scroll-area
```

### Advanced Component Implementation

```typescript
// inertia/components/ui/artist-search-dialog.tsx
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Command from '@radix-ui/react-command'
import { Search, MapPin, Palette } from 'lucide-react'
import { cn } from '~/lib/utils'

interface ArtistSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectArtist: (artist: ArtistData) => void
}

export function ArtistSearchDialog({
  open,
  onOpenChange,
  onSelectArtist,
}: ArtistSearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [artists, setArtists] = React.useState<ArtistData[]>([])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50">
          <Command.Root className="overflow-hidden rounded-lg">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Rechercher un artiste..."
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto">
              <Command.Empty className="py-6 text-center text-sm">
                Aucun artiste trouvé.
              </Command.Empty>
              {artists.map((artist) => (
                <Command.Item
                  key={artist.id}
                  value={artist.id}
                  onSelect={() => {
                    onSelectArtist(artist)
                    onOpenChange(false)
                  }}
                  className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-medium">
                      {artist.firstname[0]}{artist.lastname[0]}
                    </div>
                    <div>
                      <p className="font-medium">
                        {artist.firstname} {artist.lastname}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {artist.city && (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {artist.city.name}
                          </span>
                        )}
                        {artist.styles.length > 0 && (
                          <span className="flex items-center">
                            <Palette className="h-3 w-3 mr-1" />
                            {artist.styles[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.List>
          </Command.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

### Accessibility Best Practices

```typescript
// inertia/components/ui/accessible-dropdown.tsx
import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'

export function AccessibleDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Options
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[8rem] bg-white rounded-md border border-gray-200 shadow-lg z-50"
          sideOffset={5}
        >
          <DropdownMenu.Item className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100">
            <span>Profil</span>
            <DropdownMenu.RightSlot>
              <kbd className="ml-auto text-xs tracking-widest text-gray-500">
                ⌘P
              </kbd>
            </DropdownMenu.RightSlot>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-200" />
          <DropdownMenu.Item className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100">
            Déconnexion
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

---

## 4. Storybook 8+ Setup with Vite and React

### Installation

```bash
npx storybook@latest init --type react_vite
npm install -D @storybook/addon-essentials @storybook/addon-interactions
npm install -D @storybook/addon-a11y @storybook/addon-docs
```

### Configuration for AdonisJS Project

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: [
    '../inertia/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
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
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '~/': `${__dirname}/../inertia/`,
        },
      },
      define: {
        global: 'globalThis',
      },
    })
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
}

export default config
```

### Preview Configuration

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react'
import '../inertia/css/app.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'brand', value: '#f97316' },
      ],
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default preview
```

### Component Stories Examples

```typescript
// inertia/components/ui/artist-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ArtistCard } from './artist-card'

const meta = {
  title: 'Components/ArtistCard',
  component: ArtistCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A card component for displaying artist information with verification status and styles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      description: 'Artist data object',
      control: 'object',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
} satisfies Meta<typeof ArtistCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    artist: {
      id: '1',
      firstname: 'Jean',
      lastname: 'Dupont',
      avatar: 'https://via.placeholder.com/100',
      city: { name: 'Paris' },
      isVerified: true,
      styles: ['Traditional', 'Blackwork', 'Geometric'],
    },
  },
}

export const Unverified: Story = {
  args: {
    artist: {
      id: '2',
      firstname: 'Marie',
      lastname: 'Martin',
      city: { name: 'Lyon' },
      isVerified: false,
      styles: ['Watercolor', 'Minimalist'],
    },
  },
}

export const ManyStyles: Story = {
  args: {
    artist: {
      id: '3',
      firstname: 'Pierre',
      lastname: 'Dubois',
      avatar: 'https://via.placeholder.com/100',
      city: { name: 'Marseille' },
      isVerified: true,
      styles: ['Traditional', 'Neo-traditional', 'Realism', 'Blackwork', 'Japanese', 'Geometric'],
    },
  },
}
```

### Custom Webpack Configuration

```typescript
// .storybook/webpack.config.js
module.exports = ({ config }) => {
  // Handle TypeScript path mapping
  config.resolve.alias = {
    ...config.resolve.alias,
    '~/': path.resolve(__dirname, '../inertia/'),
  }

  // Handle CSS imports
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      'postcss-loader',
    ],
  })

  return config
}
```

### Scripts and Automation

```json
// package.json scripts
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "storybook:test": "test-storybook",
    "chromatic": "npx chromatic"
  }
}
```

---

## 5. Inertia.js Compatibility and SSR Considerations

### SSR Configuration

```typescript
// inertia/app/ssr.tsx
import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import { renderToString } from 'react-dom/server'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = 'Blottr'

createServer((page) =>
  createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title ? `${title} - ` : ''}${appName}`,
    resolve: (name) => resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx', { eager: true })
    ),
    setup: ({ App, props }) => {
      // Global providers setup for SSR
      return (
        <App {...props} />
      )
    },
  })
)
```

### Client-side Configuration

```typescript
// inertia/app/app.tsx
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { Toaster } from '~/components/ui/toaster'

const appName = 'Blottr'

createInertiaApp({
  progress: {
    color: '#f97316',
    showSpinner: true,
  },
  title: (title) => `${title ? `${title} - ` : ''}${appName}`,
  resolve: (name) => resolvePageComponent(
    `./pages/${name}.tsx`,
    import.meta.glob('./pages/**/*.tsx', { eager: true })
  ),
  setup({ el, App, props }) {
    const root = createRoot(el)

    root.render(
      <>
        <App {...props} />
        <Toaster />
      </>
    )
  },
})
```

### Layout Components for AdonisJS

```typescript
// inertia/layouts/app-layout.tsx
import { Head, Link } from '@inertiajs/react'
import { ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'

interface AppLayoutProps {
  title?: string
  children: ReactNode
  auth?: {
    user?: {
      id: string
      email: string
      role: number
    }
  }
}

export function AppLayout({ title, children, auth }: AppLayoutProps) {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center">
                  <div className="h-8 w-8 bg-brand-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    Blottr
                  </span>
                </Link>
                <nav className="hidden md:flex space-x-4">
                  <Link
                    href="/artists"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Artistes
                  </Link>
                  <Link
                    href="/salons"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Salons
                  </Link>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                {auth?.user ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {auth.user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href="/dashboard"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="ghost">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button>
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </>
  )
}
```

### Page Component Structure

```typescript
// inertia/pages/artists/index.tsx
import { useState } from 'react'
import { AppLayout } from '~/layouts/app-layout'
import { ArtistCard } from '~/components/ui/artist-card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { PageProps, ArtistData } from '~/types/components'

interface ArtistIndexProps extends PageProps {
  artists: ArtistData[]
  cities: { id: string; name: string }[]
  styles: string[]
}

export default function ArtistsIndex({
  auth,
  artists,
  cities,
  styles
}: ArtistIndexProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.lastname.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity = !selectedCity || artist.city?.id === selectedCity
    const matchesStyle = !selectedStyle || artist.styles.includes(selectedStyle)

    return matchesSearch && matchesCity && matchesStyle
  })

  return (
    <AppLayout title="Artistes tatoueurs" auth={auth}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Découvrez nos artistes tatoueurs
          </h1>
          <p className="mt-2 text-gray-600">
            {artists.length} artistes vérifiés dans toute la France
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Rechercher un artiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Filters would go here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun artiste trouvé pour ces critères
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedCity('')
                setSelectedStyle('')
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
```

---

## Performance Optimization Techniques

### Code Splitting with Inertia.js

```typescript
// Lazy loading components
import { lazy, Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'

const ArtistPortfolio = lazy(() => import('~/components/artist-portfolio'))

function ArtistProfile({ artist }: { artist: ArtistData }) {
  return (
    <div>
      <h1>{artist.firstname} {artist.lastname}</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ArtistPortfolio artistId={artist.id} />
      </Suspense>
    </div>
  )
}
```

### Image Optimization

```typescript
// inertia/components/ui/optimized-image.tsx
import { useState } from 'react'
import { cn } from '~/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPg==',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={error ? placeholder : src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
```

### Bundle Analysis and Optimization

```typescript
// vite.config.ts additions
export default defineConfig({
  plugins: [
    // ... existing plugins
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
```

---

## Common Pitfalls and Solutions

### 1. Hydration Mismatches with SSR

**Problem**: Component renders differently on server vs client

**Solution**:

```typescript
// Use useIsomorphicLayoutEffect for SSR-safe effects
import { useLayoutEffect, useEffect } from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useIsomorphicLayoutEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  return [storedValue, setStoredValue] as const
}
```

### 2. CSS-in-JS vs Tailwind Conflicts

**Problem**: CSS-in-JS libraries conflict with Tailwind utilities

**Solution**:

```typescript
// Use CSS variables for dynamic styling instead of CSS-in-JS
const DynamicButton = ({ color }: { color: string }) => (
  <button
    className="px-4 py-2 rounded-md text-white"
    style={{
      '--button-bg': color,
      backgroundColor: 'var(--button-bg)',
    }}
  >
    Dynamic Button
  </button>
)
```

### 3. Component Library Integration Issues

**Problem**: Third-party components don't work with custom design tokens

**Solution**:

```typescript
// Create wrapper components
import { DatePicker as BaseDatePicker } from 'some-library'
import { cn } from '~/lib/utils'

export function DatePicker({ className, ...props }) {
  return (
    <BaseDatePicker
      {...props}
      className={cn(
        'border-input bg-background text-foreground',
        'focus:border-ring focus:ring-2 focus:ring-ring/20',
        className
      )}
    />
  )
}
```

### 4. Storybook and AdonisJS Path Resolution

**Problem**: Import aliases don't work in Storybook

**Solution**:

```typescript
// .storybook/main.ts
export default {
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '~/': path.resolve(__dirname, '../inertia/'),
          '#models/*': path.resolve(__dirname, '../app/models/*'),
        },
      },
    })
  },
}
```

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Install and configure Tailwind CSS with custom tokens
- [ ] Set up shadcn/ui with proper aliases
- [ ] Configure Radix UI primitives
- [ ] Create base layout components

### Phase 2: Components

- [ ] Build core UI components (Button, Card, Input, etc.)
- [ ] Create domain-specific components (ArtistCard, SalonCard)
- [ ] Implement form components with validation
- [ ] Add loading and error states

### Phase 3: Advanced Features

- [ ] Set up Storybook with proper configuration
- [ ] Create comprehensive component stories
- [ ] Implement accessibility features
- [ ] Add performance optimizations

### Phase 4: Integration

- [ ] Test SSR compatibility
- [ ] Verify Inertia.js integration
- [ ] Optimize bundle size
- [ ] Set up automated testing

---

## Additional Resources

### Documentation Links

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Inertia.js Guide](https://inertiajs.com/)

### Recommended Tools

- **VS Code Extensions**: Tailwind CSS IntelliSense, PostCSS Language Support
- **Browser Extensions**: React Developer Tools, Accessibility Insights
- **Design Tools**: Figma, Adobe XD for design system documentation

---

_Last Updated: September 2024_
_Compatible with: AdonisJS 6.18+, React 19+, TypeScript 5.8+_
