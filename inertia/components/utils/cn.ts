import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with clsx and tailwind-merge
 * Provides optimal class handling for dynamic styling in components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
