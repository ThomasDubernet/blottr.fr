import { tuyau } from './tuyau'
import { api } from '../../.adonisjs/api'

/**
 * Tuyau helpers for React
 * Provides type-safe API client access
 */

/**
 * Get the Tuyau client for type-safe API calls
 * Usage: const client = getTuyauClient()
 */
export function getTuyauClient() {
  return tuyau
}

/**
 * Type-safe route helper function using Tuyau's route definitions
 * Usage: route('accueil') or route('artistes.show', { slug: 'my-artist' })
 */
export function route(name: string, params?: Record<string, any>): string {
  try {
    const routeDefinition = api.routes.find((r) => r.name === name)
    if (!routeDefinition) {
      console.error(`Route not found: ${name}`)
      return '/'
    }

    let path = routeDefinition.path

    // Replace params in path if any
    if (params && routeDefinition.params.length > 0) {
      for (const paramName of routeDefinition.params) {
        if (params[paramName]) {
          path = path.replace(`:${paramName}`, String(params[paramName]))
        }
      }
    }

    return path
  } catch (error) {
    console.error(`Failed to generate route for: ${name}`, error)
    return '/'
  }
}
