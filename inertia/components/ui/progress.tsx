'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '~/lib/utils'
import { getRadius } from '~/lib/design-tokens'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative w-full overflow-hidden bg-secondary progress-responsive',
      className
    )}
    style={{
      borderRadius: `var(--radius-${getRadius('pill')})`,
      height: 'var(--component-progress-height, 0.5rem)'
    }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all progress-indicator-responsive"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        borderRadius: `var(--radius-${getRadius('pill')})`
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }