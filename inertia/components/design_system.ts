// Design System Configuration and Types
export const designSystem = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main brand color
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#ecfdf5',
      500: '#10b981',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      900: '#7f1d1d',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    default: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    full: '9999px',
  },

  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
} as const

// Type definitions for better TypeScript support
export type ColorScale = keyof typeof designSystem.colors.primary
export type ColorGroup = keyof typeof designSystem.colors
export type FontSize = keyof typeof designSystem.typography.fontSize
export type FontWeight = keyof typeof designSystem.typography.fontWeight
export type Spacing = keyof typeof designSystem.spacing
export type BorderRadius = keyof typeof designSystem.borderRadius
export type BoxShadow = keyof typeof designSystem.boxShadow
export type Breakpoint = keyof typeof designSystem.breakpoints

// Component variant types
export type ComponentVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
export type ComponentSize = 'sm' | 'default' | 'lg' | 'icon'

// Tattoo platform specific types
export interface Artist {
  id: string
  firstname: string
  lastname: string
  avatar?: string
  bio?: string
  instagram_handle?: string
  instagram_followers?: number
  salon?: {
    name: string
    city: string
  }
  city?: {
    name: string
  }
  tags?: Array<{
    name: string
    category: string
  }>
  view_count?: number
  favorite_count?: number
  is_verified?: boolean
  verification_status: 'scraped' | 'contacted' | 'onboarding' | 'verified'
  tattoo_count?: number
  rating?: number
}

export interface Tattoo {
  id: string
  photo: string
  alt_text?: string
  description?: string
  is_flash?: boolean
  price?: number
  instagram_post_url?: string
  view_count: number
  like_count: number
  tags?: Array<{
    name: string
    category: string
  }>
  artist: {
    firstname: string
    lastname: string
    instagram_handle?: string
  }
}

export interface BookingRequest {
  id: string
  client_id: string
  artist_id: string
  message?: string
  preferred_dates: Date[]
  budget_range?: {
    min: number
    max: number
  }
  tattoo_description: string
  reference_images?: string[]
  urgency: 'asap' | 'this_month' | 'flexible'
  status: 'pending' | 'artist_contacted' | 'artist_responded' | 'completed'
}

// Animation configurations
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const

// Component defaults
export const componentDefaults = {
  button: {
    variant: 'default' as ComponentVariant,
    size: 'default' as ComponentSize,
  },
  card: {
    padding: designSystem.spacing[6],
    borderRadius: designSystem.borderRadius.lg,
    boxShadow: designSystem.boxShadow.sm,
  },
  input: {
    borderRadius: designSystem.borderRadius.md,
    padding: designSystem.spacing[3],
  },
} as const
