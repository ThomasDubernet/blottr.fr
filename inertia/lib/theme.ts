import React from 'react'

/**
 * Theme Configuration for Blottr Tattoo Platform
 *
 * Comprehensive theme management system with support for:
 * - Light/Dark mode switching
 * - High contrast mode for accessibility
 * - Tattoo industry-specific color palettes
 * - Responsive design tokens
 */

export type Theme = 'light' | 'dark' | 'high-contrast'

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
    input: string
    ring: string
    // Tattoo industry specific
    ink: string
    flash: string
    verified: string
  }
  shadows: {
    gallery: string
    galleryHover: string
    card: string
    cardHover: string
  }
}

/**
 * Light theme configuration
 */
export const lightTheme: ThemeConfig = {
  colors: {
    primary: '231 93 93', // Blottr brand red
    secondary: '160 160 166',
    background: '255 255 255',
    foreground: '39 39 42',
    muted: '245 245 245',
    mutedForeground: '113 113 122',
    border: '228 228 231',
    input: '228 228 231',
    ring: '231 93 93',
    // Tattoo industry colors
    ink: '113 113 122',
    flash: '249 115 22',
    verified: '16 185 129',
  },
  shadows: {
    gallery: '0 4px 20px 0 rgb(0 0 0 / 0.08), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
    galleryHover: '0 8px 30px 0 rgb(0 0 0 / 0.12), 0 4px 6px 0 rgb(0 0 0 / 0.1)',
    card: '0 2px 8px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04)',
    cardHover: '0 4px 16px 0 rgb(0 0 0 / 0.1), 0 2px 4px 0 rgb(0 0 0 / 0.06)',
  },
}

/**
 * Dark theme configuration
 */
export const darkTheme: ThemeConfig = {
  colors: {
    primary: '231 93 93', // Same brand red for consistency
    secondary: '113 113 122',
    background: '39 39 42',
    foreground: '250 250 250',
    muted: '39 39 42',
    mutedForeground: '161 161 170',
    border: '39 39 42',
    input: '39 39 42',
    ring: '231 93 93',
    // Tattoo industry colors (adjusted for dark mode)
    ink: '161 161 170',
    flash: '251 146 60',
    verified: '34 197 94',
  },
  shadows: {
    gallery: '0 4px 20px 0 rgb(0 0 0 / 0.3), 0 1px 3px 0 rgb(0 0 0 / 0.2)',
    galleryHover: '0 8px 30px 0 rgb(0 0 0 / 0.4), 0 4px 6px 0 rgb(0 0 0 / 0.3)',
    card: '0 2px 8px 0 rgb(0 0 0 / 0.2), 0 1px 2px 0 rgb(0 0 0 / 0.1)',
    cardHover: '0 4px 16px 0 rgb(0 0 0 / 0.3), 0 2px 4px 0 rgb(0 0 0 / 0.2)',
  },
}

/**
 * High contrast theme for accessibility
 */
export const highContrastTheme: ThemeConfig = {
  colors: {
    primary: '0 0 0', // Pure black for maximum contrast
    secondary: '64 64 64',
    background: '255 255 255',
    foreground: '0 0 0',
    muted: '240 240 240',
    mutedForeground: '64 64 64',
    border: '0 0 0',
    input: '255 255 255',
    ring: '0 0 0',
    // High contrast specialty colors
    ink: '0 0 0',
    flash: '255 140 0', // High contrast orange
    verified: '0 128 0', // High contrast green
  },
  shadows: {
    gallery: '0 0 0 2px rgb(0 0 0)',
    galleryHover: '0 0 0 3px rgb(0 0 0)',
    card: '0 0 0 1px rgb(0 0 0)',
    cardHover: '0 0 0 2px rgb(0 0 0)',
  },
}

/**
 * Theme configuration mapping
 */
export const themes = {
  'light': lightTheme,
  'dark': darkTheme,
  'high-contrast': highContrastTheme,
} as const

/**
 * Apply theme to document root
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  const themeConfig = themes[theme]

  // Remove existing theme classes
  root.classList.remove('light', 'dark', 'high-contrast')

  // Add new theme class
  root.classList.add(theme)

  // Apply CSS custom properties
  Object.entries(themeConfig.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
  })

  Object.entries(themeConfig.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
  })

  // Store theme preference
  localStorage.setItem('blottr-theme', theme)
}

/**
 * Get stored theme preference or system preference
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem('blottr-theme') as Theme
  if (stored && stored in themes) {
    return stored
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  // Check for high contrast preference
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    return 'high-contrast'
  }

  return 'light'
}

/**
 * Initialize theme system
 */
export function initializeTheme(): void {
  const theme = getStoredTheme()
  applyTheme(theme)

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('blottr-theme')) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })

  // Listen for high contrast changes
  window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
    if (!localStorage.getItem('blottr-theme') && e.matches) {
      applyTheme('high-contrast')
    }
  })
}

/**
 * React hook for theme management
 */
export function useTheme() {
  if (typeof window === 'undefined') {
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
      themes: Object.keys(themes) as Theme[],
    }
  }

  const [theme, setThemeState] = React.useState<Theme>(getStoredTheme)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
  }

  return {
    theme,
    setTheme,
    themes: Object.keys(themes) as Theme[],
  }
}

/**
 * Design token utilities
 */
export const designTokens = {
  // Spacing scale (8px grid)
  spacing: {
    'xs': '0.25rem', // 4px
    'sm': '0.5rem', // 8px
    'md': '1rem', // 16px
    'lg': '1.5rem', // 24px
    'xl': '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  // Typography scale
  typography: {
    sizes: {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      // Specialty sizes
      'price': '1.25rem',
      'artist': '1.5rem',
      'salon': '1.125rem',
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    leading: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Border radius scale
  radius: {
    'sm': '0.375rem',
    'md': '0.5rem',
    'lg': '0.75rem',
    'xl': '1rem',
    '2xl': '1.5rem',
    'full': '9999px',
  },

  // Animation timing
  duration: {
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
  },

  easing: {
    'ease': 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Breakpoints
  breakpoints: {
    'xs': '475px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const

// Type-safe design token access
export type DesignTokens = typeof designTokens

// Export specific token categories
export const { spacing, typography, radius, duration, easing, breakpoints, zIndex } = designTokens
