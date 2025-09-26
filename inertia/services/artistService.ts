import { api } from '../lib/api'
import type { Artist, ArtistFilters, PaginatedResponse } from '../types'

export class ArtistService {
  /**
   * Get paginated list of artists with optional filters
   */
  async getArtists(filters: ArtistFilters = {}, page = 1): Promise<PaginatedResponse<Artist>> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value)
        ])
      )
    })

    return api.get<PaginatedResponse<Artist>>(`/artists?${params}`)
  }

  /**
   * Get artist by ID with detailed information
   */
  async getArtist(id: string): Promise<Artist> {
    return api.get<Artist>(`/artists/${id}`)
  }

  /**
   * Search artists by name or location
   */
  async searchArtists(query: string, filters: ArtistFilters = {}): Promise<PaginatedResponse<Artist>> {
    const params = new URLSearchParams({
      q: query,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value)
        ])
      )
    })

    return api.get<PaginatedResponse<Artist>>(`/artists/search?${params}`)
  }

  /**
   * Get artists near a geographic location
   */
  async getNearbyArtists(lat: number, lng: number, radius = 50): Promise<Artist[]> {
    return api.get<Artist[]>(`/artists/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
  }

  /**
   * Get featured artists for homepage
   */
  async getFeaturedArtists(limit = 6): Promise<Artist[]> {
    return api.get<Artist[]>(`/artists/featured?limit=${limit}`)
  }

  /**
   * Submit a project inquiry to an artist
   */
  async submitInquiry(artistId: string, inquiry: {
    description: string
    bodyZone: string
    size: string
    budget: string
    email: string
  }): Promise<void> {
    return api.post(`/artists/${artistId}/inquiries`, inquiry)
  }

  /**
   * Toggle favorite status for an artist
   */
  async toggleFavorite(artistId: string): Promise<{ isFavorited: boolean }> {
    return api.post<{ isFavorited: boolean }>(`/artists/${artistId}/favorite`)
  }

  /**
   * Get user's favorite artists
   */
  async getFavorites(): Promise<Artist[]> {
    return api.get<Artist[]>('/artists/favorites')
  }
}

export const artistService = new ArtistService()