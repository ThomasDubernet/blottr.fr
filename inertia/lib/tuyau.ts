import { createTuyau } from '@tuyau/client'
import { api } from '../../.adonisjs/api'

/**
 * Tuyau client for type-safe API calls and routing
 * Documentation: https://tuyau.julr.dev
 */
export const tuyau = createTuyau({
  api,
  baseUrl: import.meta.env.VITE_APP_URL ?? 'http://localhost:3333',
})
