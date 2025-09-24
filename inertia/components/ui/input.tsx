import * as React from 'react'

import { cn } from '~/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base layout and responsive sizing
          'flex w-full bg-transparent shadow-sm transition-colors duration-200',
          // Height using design token responsive sizing
          'h-auto',
          // Responsive padding from design tokens
          'input-responsive',
          // Border styling with design tokens
          'border border-input',
          // Border radius from design tokens (using sm = 6px as per requirements)
          'rounded-sm',
          // Typography using responsive design tokens
          'text-responsive-base',
          // Colors from design token system
          'text-foreground',
          'placeholder:text-muted-foreground',
          // Focus states with design tokens
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:border-primary',
          // Disabled states
          'disabled:cursor-not-allowed disabled:opacity-50',
          // File input styling
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          className
        )}
        style={{
          // Ensure responsive padding is applied using CSS custom properties
          paddingTop: 'var(--input-padding-y)',
          paddingBottom: 'var(--input-padding-y)',
          paddingLeft: 'var(--input-padding-x)',
          paddingRight: 'var(--input-padding-x)',
          // Responsive font size from design tokens
          fontSize: 'var(--input-font-size)',
          // Border radius from design tokens (using sm for 6px as per requirements)
          borderRadius: 'var(--radius-sm)',
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
