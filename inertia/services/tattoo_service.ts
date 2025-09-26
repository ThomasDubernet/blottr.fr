import { api } from '../lib/api'
import type { Tattoo, TattooFilters, PaginatedResponse } from '../types'

export class TattooService {
  /**
   * Get paginated list of tattoos with optional filters
   */
  async getTattoos(filters: TattooFilters = {}, page = 1): Promise<PaginatedResponse<Tattoo>> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value),
        ])
      ),
    })

    return api.get<PaginatedResponse<Tattoo>>(`/tattoos?${params}`)
  }

  /**
   * Get tattoo by ID with detailed information
   */
  async getTattoo(id: string): Promise<Tattoo> {
    return api.get<Tattoo>(`/tattoos/${id}`)
  }

  /**
   * Search tattoos by title, description, or tags
   */
  async searchTattoos(
    query: string,
    filters: TattooFilters = {}
  ): Promise<PaginatedResponse<Tattoo>> {
    const params = new URLSearchParams({
      q: query,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value),
        ])
      ),
    })

    return api.get<PaginatedResponse<Tattoo>>(`/tattoos/search?${params}`)
  }

  /**
   * Get featured tattoos for homepage
   */
  async getFeaturedTattoos(limit = 12): Promise<Tattoo[]> {
    return api.get<Tattoo[]>(`/tattoos/featured?limit=${limit}`)
  }

  /**
   * Get tattoos by artist
   */
  async getArtistTattoos(artistId: string, page = 1): Promise<PaginatedResponse<Tattoo>> {
    return api.get<PaginatedResponse<Tattoo>>(`/artists/${artistId}/tattoos?page=${page}`)
  }

  /**
   * Get related tattoos based on style/tags
   */
  async getRelatedTattoos(tattooId: string, limit = 6): Promise<Tattoo[]> {
    return api.get<Tattoo[]>(`/tattoos/${tattooId}/related?limit=${limit}`)
  }

  /**
   * Toggle like status for a tattoo
   */
  async toggleLike(tattooId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    return api.post<{ isLiked: boolean; likesCount: number }>(`/tattoos/${tattooId}/like`)
  }

  /**
   * Toggle favorite status for a tattoo
   */
  async toggleFavorite(tattooId: string): Promise<{ isFavorited: boolean }> {
    return api.post<{ isFavorited: boolean }>(`/tattoos/${tattooId}/favorite`)
  }

  /**
   * Get user's favorite tattoos
   */
  async getFavorites(): Promise<Tattoo[]> {
    return api.get<Tattoo[]>('/tattoos/favorites')
  }

  /**
   * Increment view count for a tattoo
   */
  async incrementViews(tattooId: string): Promise<void> {
    return api.post(`/tattoos/${tattooId}/view`)
  }

  /**
   * Report inappropriate content
   */
  async reportTattoo(tattooId: string, reason: string): Promise<void> {
    return api.post(`/tattoos/${tattooId}/report`, { reason })
  }
}

export const tattooService = new TattooService()
