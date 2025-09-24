/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './inertia/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './resources/views/**/*.edge',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS Custom Properties integration
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
          50: '#fef2f2',
          100: '#fde6e6',
          200: '#fbd2d2',
          300: '#f7b1b1',
          400: '#f18a8a',
          500: '#e75d5d', // Main brand red
          600: '#d53f3f',
          700: '#b32f2f',
          800: '#942a2a',
          900: '#7a2828',
          950: '#431212',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        input: 'rgb(var(--color-input) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
        // Specialty colors for tattoo industry
        ink: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a', // Classic tattoo ink gray
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Flash tattoo accent colors
        flash: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Flash tattoo orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Verification badge colors
        verified: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Verified green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Info/accent colors
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        // Typography system optimized for tattoo platform
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        // Artist name styling
        artist: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        // Extended type scale for tattoo platform
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Specialized text sizes for tattoo platform
        'price': ['1.25rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'artist-name': ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }],
        'salon-name': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.25rem' }],
      },
      spacing: {
        // Enhanced spacing scale based on 8px grid
        0.5: '0.125rem', // 2px
        1.5: '0.375rem', // 6px
        2.5: '0.625rem', // 10px
        3.5: '0.875rem', // 14px
        4.5: '1.125rem', // 18px
        5.5: '1.375rem', // 22px
        6.5: '1.625rem', // 26px
        7.5: '1.875rem', // 30px
        8.5: '2.125rem', // 34px
        9.5: '2.375rem', // 38px
        11: '2.75rem', // 44px
        13: '3.25rem', // 52px
        15: '3.75rem', // 60px
        17: '4.25rem', // 68px
        18: '4.5rem', // 72px
        19: '4.75rem', // 76px
        21: '5.25rem', // 84px
        22: '5.5rem', // 88px
        88: '22rem', // 352px - Gallery grid
        128: '32rem', // 512px - Content width
        144: '36rem', // 576px - Max content width
        160: '40rem', // 640px - Large content
      },
      borderRadius: {
        // Refined border radius system
        'none': '0px',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Tattoo platform specific shadows
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'medium': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'large': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        // Portfolio specific shadows
        'gallery': '0 4px 20px 0 rgb(0 0 0 / 0.08), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'gallery-hover': '0 8px 30px 0 rgb(0 0 0 / 0.12), 0 4px 6px 0 rgb(0 0 0 / 0.1)',
        'card': '0 2px 8px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 16px 0 rgb(0 0 0 / 0.1), 0 2px 4px 0 rgb(0 0 0 / 0.06)',
        // Dark mode shadows
        'dark': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'dark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      },
      animation: {
        // Enhanced animation system
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        // Gallery specific animations
        'gallery-hover': 'galleryHover 0.3s ease-out',
        'image-load': 'imageLoad 0.4s ease-out',
        // Loading states
        'skeleton': 'skeleton 1.5s ease-in-out infinite alternate',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -10px, 0)' },
          '70%': { transform: 'translate3d(0, -5px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        galleryHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        imageLoad: {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        skeleton: {
          '0%': { backgroundColor: 'hsl(200, 20%, 80%)' },
          '100%': { backgroundColor: 'hsl(200, 20%, 95%)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },
      screens: {
        // Enhanced responsive breakpoint system
        'xs': '475px', // Extra small devices
        'sm': '640px', // Small devices
        'md': '768px', // Medium devices
        'lg': '1024px', // Large devices
        'xl': '1280px', // Extra large devices
        '2xl': '1536px', // 2X Large devices
        '3xl': '1920px', // Ultra wide displays
        // Custom breakpoints for gallery layouts
        'gallery-sm': '480px',
        'gallery-md': '768px',
        'gallery-lg': '1024px',
        'gallery-xl': '1280px',
      },
      aspectRatio: {
        // Portfolio specific aspect ratios
        portrait: '3 / 4',
        landscape: '4 / 3',
        square: '1 / 1',
        golden: '1.618 / 1',
        tattoo: '3 / 4', // Common tattoo photo ratio
      },
      zIndex: {
        // Enhanced z-index scale
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
        900: '900ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    // Enhanced utilities plugin for tattoo platform
    function ({ addUtilities, addComponents, theme }) {
      // Line clamp utilities
      const lineClampUtilities = {
        '.line-clamp-1': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.line-clamp-4': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
      }

      // Gallery utilities for tattoo portfolios
      const galleryUtilities = {
        '.gallery-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        },
        '.gallery-grid-sm': {
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        },
        '.gallery-grid-lg': {
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        },
        '.masonry': {
          'columnCount': '3',
          'columnGap': '1.5rem',
          '@screen sm': {
            columnCount: '2',
          },
          '@screen lg': {
            columnCount: '4',
          },
        },
        '.masonry-item': {
          breakInside: 'avoid',
          marginBottom: '1.5rem',
        },
      }

      // Scrollbar utilities
      const scrollbarUtilities = {
        '.scrollbar-thin': {
          'scrollbarWidth': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.neutral.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.neutral.300'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme('colors.neutral.400'),
          },
        },
        '.scrollbar-none': {
          'scrollbarWidth': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }

      // Skeleton loading utilities
      const skeletonUtilities = {
        '.skeleton': {
          'backgroundColor': theme('colors.neutral.200'),
          'borderRadius': theme('borderRadius.md'),
          'animation': theme('animation.skeleton'),
          'position': 'relative',
          'overflow': 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            background: `linear-gradient(90deg, transparent, ${theme('colors.neutral.50')}, transparent)`,
            animation: theme('animation.shimmer'),
          },
        },
      }

      // Text utilities for tattoo platform
      const textUtilities = {
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-artist': {
          fontSize: theme('fontSize.artist-name')[0],
          lineHeight: theme('fontSize.artist-name')[1].lineHeight,
          fontWeight: theme('fontSize.artist-name')[1].fontWeight,
        },
        '.text-price': {
          fontSize: theme('fontSize.price')[0],
          lineHeight: theme('fontSize.price')[1].lineHeight,
          fontWeight: theme('fontSize.price')[1].fontWeight,
        },
      }

      addUtilities({
        ...lineClampUtilities,
        ...galleryUtilities,
        ...scrollbarUtilities,
        ...skeletonUtilities,
        ...textUtilities,
      })

      // Component-level styles for tattoo platform
      addComponents({
        '.btn': {
          'padding': `${theme('spacing.2')} ${theme('spacing.4')}`,
          'borderRadius': theme('borderRadius.md'),
          'fontSize': theme('fontSize.sm')[0],
          'fontWeight': theme('fontWeight.medium'),
          'lineHeight': theme('fontSize.sm')[1].lineHeight,
          'transition': 'all 0.2s ease-in-out',
          'cursor': 'pointer',
          'display': 'inline-flex',
          'alignItems': 'center',
          'justifyContent': 'center',
          'gap': theme('spacing.2'),
          'border': '1px solid transparent',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme('colors.primary.500')}40`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          'backgroundColor': theme('colors.primary.500'),
          'color': theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.medium'),
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: theme('boxShadow.soft'),
          },
        },
        '.btn-secondary': {
          'backgroundColor': theme('colors.white'),
          'color': theme('colors.neutral.700'),
          'borderColor': theme('colors.neutral.300'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.neutral.50'),
            borderColor: theme('colors.neutral.400'),
          },
        },
        '.btn-flash': {
          'backgroundColor': theme('colors.flash.500'),
          'color': theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.flash.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.medium'),
          },
        },
        '.card': {
          'backgroundColor': theme('colors.white'),
          'borderRadius': theme('borderRadius.xl'),
          'boxShadow': theme('boxShadow.card'),
          'padding': theme('spacing.6'),
          'transition': 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
        '.gallery-item': {
          'backgroundColor': theme('colors.white'),
          'borderRadius': theme('borderRadius.lg'),
          'boxShadow': theme('boxShadow.gallery'),
          'overflow': 'hidden',
          'transition': 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.gallery-hover'),
            transform: 'translateY(-2px)',
          },
        },
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.xs')[0],
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('fontSize.xs')[1].lineHeight,
        },
        '.badge-verified': {
          backgroundColor: theme('colors.verified.100'),
          color: theme('colors.verified.700'),
        },
        '.badge-flash': {
          backgroundColor: theme('colors.flash.100'),
          color: theme('colors.flash.700'),
        },
        '.badge-ink': {
          backgroundColor: theme('colors.ink.100'),
          color: theme('colors.ink.700'),
        },
        '.input': {
          'width': '100%',
          'padding': `${theme('spacing.2')} ${theme('spacing.3')}`,
          'borderRadius': theme('borderRadius.md'),
          'border': `1px solid ${theme('colors.neutral.300')}`,
          'fontSize': theme('fontSize.sm')[0],
          'lineHeight': theme('fontSize.sm')[1].lineHeight,
          'backgroundColor': theme('colors.white'),
          'transition': 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}20`,
          },
          '&:disabled': {
            backgroundColor: theme('colors.neutral.100'),
            cursor: 'not-allowed',
          },
        },
      })
    },
  ],
}
