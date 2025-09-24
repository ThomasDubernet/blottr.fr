import React from 'react'
import { Link } from '@inertiajs/react'

interface StyleTagProps {
  tag: {
    id: string
    name: string
    slug: string
    category?: string
    usage_count?: number
  }
  variant?: 'default' | 'outline' | 'minimal' | 'pill' | 'badge'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ink' | 'auto'
  interactive?: boolean
  showCount?: boolean
  removable?: boolean
  className?: string
  href?: string
  onClick?: (tag: StyleTagProps['tag']) => void
  onRemove?: (tag: StyleTagProps['tag']) => void
}

// Color mapping based on category
const getCategoryColor = (category?: string): StyleTagProps['color'] => {
  if (!category) return 'secondary'

  switch (category.toLowerCase()) {
    case 'style':
      return 'primary'
    case 'body_part':
      return 'success'
    case 'theme':
      return 'warning'
    case 'color':
      return 'ink'
    case 'technique':
      return 'secondary'
    default:
      return 'secondary'
  }
}

// Get category icon
const getCategoryIcon = (category?: string) => {
  if (!category) return null

  switch (category.toLowerCase()) {
    case 'style':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'body_part':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2C5.03 2 1 6.03 1 11c0 2.5.97 4.8 2.56 6.56C4.53 18.53 7.47 19 10 19s5.47-.47 6.44-1.44C17.97 15.8 19 13.5 19 11c0-4.97-4.03-9-9-9z" />
        </svg>
      )
    case 'theme':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'color':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 2a2 2 0 00-2 2v8a2 2 0 002 2V4h8a2 2 0 002-2H4zm4 4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2H8z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'technique':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.3 3.7a1 1 0 00-1.4-1.4L4 9.2a1 1 0 000 1.4l1.4 1.4a1 1 0 001.4 0l6.9-6.9-.4-.4z" />
        </svg>
      )
    default:
      return null
  }
}

export default function StyleTag({
  tag,
  variant = 'default',
  size = 'md',
  color = 'auto',
  interactive = false,
  showCount = false,
  removable = false,
  className = '',
  href,
  onClick,
  onRemove,
}: StyleTagProps) {
  const actualColor = color === 'auto' ? getCategoryColor(tag.category) : color
  const categoryIcon = getCategoryIcon(tag.category)

  // Size classes with responsive design tokens
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-responsive-xs',
    md: 'px-2.5 py-1 text-responsive-sm',
    lg: 'px-3 py-1.5 text-responsive-base',
  }

  // Color classes for different variants
  const getColorClasses = () => {
    const colorMap = {
      primary: {
        default: 'bg-primary/10 text-primary border-primary/20',
        outline: 'border-primary/30 text-primary hover:bg-primary/5',
        minimal: 'text-primary hover:bg-primary/5',
        pill: 'bg-primary text-primary-foreground hover:bg-primary/90',
        badge: 'bg-primary text-primary-foreground',
      },
      secondary: {
        default: 'bg-secondary text-secondary-foreground border-border',
        outline: 'border-border text-foreground hover:bg-accent',
        minimal: 'text-muted-foreground hover:bg-accent',
        pill: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        badge: 'bg-secondary text-secondary-foreground',
      },
      success: {
        default: 'bg-green-100 text-green-800 border-green-200',
        outline: 'border-green-300 text-green-700 hover:bg-green-50',
        minimal: 'text-green-600 hover:bg-green-50',
        pill: 'bg-green-500 text-white hover:bg-green-600',
        badge: 'bg-green-600 text-white',
      },
      warning: {
        default: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        outline: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50',
        minimal: 'text-yellow-600 hover:bg-yellow-50',
        pill: 'bg-yellow-500 text-white hover:bg-yellow-600',
        badge: 'bg-yellow-600 text-white',
      },
      error: {
        default: 'bg-red-100 text-red-800 border-red-200',
        outline: 'border-red-300 text-red-700 hover:bg-red-50',
        minimal: 'text-red-600 hover:bg-red-50',
        pill: 'bg-red-500 text-white hover:bg-red-600',
        badge: 'bg-red-600 text-white',
      },
      ink: {
        default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
        outline: 'border-neutral-300 text-neutral-700 hover:bg-neutral-50',
        minimal: 'text-neutral-600 hover:bg-neutral-50',
        pill: 'bg-neutral-500 text-white hover:bg-neutral-600',
        badge: 'bg-neutral-600 text-white',
      },
    }

    return colorMap[actualColor]?.[variant] || colorMap.secondary[variant]
  }

  // Border classes for variants
  const getBorderClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border'
      case 'minimal':
        return 'border-0'
      case 'pill':
      case 'badge':
        return 'border-0'
      default:
        return 'border'
    }
  }

  // Shape classes
  const getShapeClasses = () => {
    switch (variant) {
      case 'pill':
        return 'rounded-full'
      case 'badge':
        return 'rounded-md'
      default:
        return 'rounded-full'
    }
  }

  const baseClasses = `
    inline-flex items-center font-medium transition-all duration-200
    ${sizeClasses[size]}
    ${getBorderClasses()}
    ${getShapeClasses()}
    ${getColorClasses()}
    ${interactive ? 'cursor-pointer hover:shadow-sm focus-ring' : ''}
    ${className}
  `.trim()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick(tag)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onRemove) {
      onRemove(tag)
    }
  }

  const content = (
    <>
      {/* Category Icon */}
      {categoryIcon && (
        <span className={`${size === 'sm' ? 'mr-1' : 'mr-1.5'} flex-shrink-0`}>{categoryIcon}</span>
      )}

      {/* Tag Name */}
      <span className="truncate">{tag.name}</span>

      {/* Usage Count */}
      {showCount && tag.usage_count !== undefined && (
        <span className={`${size === 'sm' ? 'ml-1' : 'ml-1.5'} text-responsive-xs opacity-75`}>
          ({tag.usage_count.toLocaleString()})
        </span>
      )}

      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className={`${size === 'sm' ? 'ml-1' : 'ml-1.5'} flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-200`}
          aria-label={`Remove ${tag.name} tag`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </>
  )

  // Render as link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        onClick={handleClick}
        aria-label={`View tattoos tagged with ${tag.name}`}
      >
        {content}
      </Link>
    )
  }

  // Render as button if interactive
  if (interactive || onClick) {
    return (
      <button
        type="button"
        className={baseClasses}
        onClick={handleClick}
        aria-label={`Filter by ${tag.name}`}
      >
        {content}
      </button>
    )
  }

  // Render as span for non-interactive tags
  return <span className={baseClasses}>{content}</span>
}

// Utility component for displaying multiple tags
interface StyleTagsProps {
  tags: Array<{
    id: string
    name: string
    slug: string
    category?: string
    usage_count?: number
  }>
  variant?: StyleTagProps['variant']
  size?: StyleTagProps['size']
  color?: StyleTagProps['color']
  interactive?: boolean
  showCount?: boolean
  removable?: boolean
  maxTags?: number
  className?: string
  onTagClick?: (tag: StyleTagProps['tag']) => void
  onTagRemove?: (tag: StyleTagProps['tag']) => void
}

export function StyleTags({
  tags,
  variant = 'default',
  size = 'md',
  color = 'auto',
  interactive = false,
  showCount = false,
  removable = false,
  maxTags,
  className = '',
  onTagClick,
  onTagRemove,
}: StyleTagsProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags
  const remainingCount = maxTags ? Math.max(0, tags.length - maxTags) : 0

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-responsive-xs ${className}`}>
      {displayTags.map((tag) => (
        <StyleTag
          key={tag.id}
          tag={tag}
          variant={variant}
          size={size}
          color={color}
          interactive={interactive}
          showCount={showCount}
          removable={removable}
          onClick={onTagClick}
          onRemove={onTagRemove}
          href={interactive ? `/tattoos?tags=${tag.slug}` : undefined}
        />
      ))}

      {remainingCount > 0 && (
        <span
          className={`
            inline-flex items-center font-medium bg-muted text-muted-foreground border border-border rounded-full
            ${sizeClasses[size]}
          `}
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  )
}

// Size classes repeated for the utility component
const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}
