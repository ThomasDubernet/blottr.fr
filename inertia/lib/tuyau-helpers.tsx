import { useTuyau } from '@tuyau/inertia/react'
import { tuyau } from './tuyau'

/**
 * Tuyau Inertia helpers for React
 * Provides type-safe Link component and route function
 */

/**
 * Custom hook to access Tuyau client
 * Usage: const tuyau = useTuyauClient()
 */
export function useTuyauClient() {
  return useTuyau<typeof tuyau>()
}

/**
 * Type-safe route helper
 * Usage: route('accueil') or route('artistes.show', { slug: 'my-artist' })
 */
export function route(name: string, params?: Record<string, any>): string {
  return tuyau.$url(name as any, params)
}
