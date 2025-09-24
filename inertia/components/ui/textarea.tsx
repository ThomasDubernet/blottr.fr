import * as React from 'react'

import { cn } from '~/lib/utils'
import { getRadius } from '~/lib/design_tokens'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex w-full border border-input bg-transparent shadow-sm',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'textarea-responsive',
          className
        )}
        style={{
          borderRadius: `var(--radius-${getRadius('md')})`,
          paddingLeft: 'var(--spacing-sm)',
          paddingRight: 'var(--spacing-sm)',
          paddingTop: 'var(--spacing-xs)',
          paddingBottom: 'var(--spacing-xs)',
          minHeight: 'var(--component-textarea-min-height, 60px)',
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
