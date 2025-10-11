import { createTuyau } from '@tuyau/client'
import { api } from '../../.adonisjs/api'

/**
 * Tuyau client for type-safe API calls and routing
 * Documentation: https://tuyau.julr.dev
 */

// Safe way to get base URL for both SSR and client
const getBaseUrl = () => {
  // SSR context - use environment variable or default
  if (typeof window === 'undefined') {
    return process.env.VITE_APP_URL ?? 'http://localhost:3333'
  }
  // Client context - use import.meta.env
  return import.meta.env.VITE_APP_URL ?? 'http://localhost:3333'
}

export const tuyau = createTuyau({
  api,
  baseUrl: getBaseUrl(),
})
