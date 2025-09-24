import * as React from 'react'

import { cn } from '~/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Design token integration for card styling
        'card-responsive', // Uses --card-padding and --card-border-radius
        'bg-card text-card-foreground border border-border',
        'shadow-[--shadow-card] hover:shadow-[--shadow-card-hover]',
        'transition-all duration-300',
        className
      )}
      style={{
        // CSS custom properties for responsive design
        borderRadius: 'var(--card-border-radius)',
        boxShadow: 'var(--shadow-card)',
      }}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-responsive-sm', // Uses --spacing-sm for responsive gap
        className
      )}
      style={{
        padding: 'var(--card-padding) var(--card-padding) var(--spacing-sm)',
        gap: 'var(--spacing-sm)',
      }}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'font-semibold leading-none tracking-tight',
        'text-responsive-lg', // Uses h5 scale from design tokens
        className
      )}
      style={{
        fontSize: 'var(--font-size-lg)',
        lineHeight: 'var(--line-height-base)',
        letterSpacing: 'var(--letter-spacing-tight)',
      }}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-muted-foreground',
        'text-responsive-sm', // Uses body2 scale from design tokens
        className
      )}
      style={{
        fontSize: 'var(--font-size-sm)',
        lineHeight: 'var(--line-height-base)',
      }}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-0', className)}
      style={{
        padding: '0 var(--card-padding) var(--card-padding)',
      }}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pt-0 gap-responsive-sm',
        className
      )}
      style={{
        padding: '0 var(--card-padding) var(--card-padding)',
        gap: 'var(--spacing-sm)',
      }}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
