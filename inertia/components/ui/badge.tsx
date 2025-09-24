import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center border-transparent font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300',
        accent: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        success: 'text-white shadow hover:opacity-90',
        warning: 'text-white shadow hover:opacity-90',
        error: 'text-white shadow hover:opacity-90',
        outline: 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        // Industry-specific variants
        verified: 'text-white shadow hover:opacity-90',
        flash: 'text-white shadow hover:opacity-90',
        ink: 'text-white shadow hover:opacity-90',
      },
      size: {
        default: '',
        sm: 'text-xs px-2 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, style, ...props }: BadgeProps) {
  // Design token integration for badge-specific styling
  const badgeStyle: React.CSSProperties = {
    // Typography using design tokens
    fontSize: 'var(--text-caption-size)',
    lineHeight: 'var(--text-caption-line-height)',
    // Spacing using design tokens
    paddingLeft: 'var(--spacing-sm)',
    paddingRight: 'var(--spacing-sm)',
    paddingTop: 'var(--spacing-xs)',
    paddingBottom: 'var(--spacing-xs)',
    // Border radius - pill shape for badges
    borderRadius: '50px',
    // Combine with any existing styles
    ...style,
  }

  // Apply semantic colors using CSS custom properties for color variants
  const colorClass = React.useMemo(() => {
    switch (variant) {
      case 'success':
        return 'bg-[rgb(var(--color-verified))]'
      case 'warning':
        return 'bg-[rgb(var(--color-flash))]'
      case 'error':
        return 'bg-[hsl(var(--destructive))]'
      case 'verified':
        return 'bg-[rgb(var(--color-verified))]'
      case 'flash':
        return 'bg-[rgb(var(--color-flash))]'
      case 'ink':
        return 'bg-[rgb(var(--color-ink))]'
      default:
        return ''
    }
  }, [variant])

  return (
    <div
      className={cn(badgeVariants({ variant, size }), colorClass, className)}
      style={badgeStyle}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
