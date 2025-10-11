import type { HttpContext } from '@adonisjs/core/http'
import Artist from '#models/artist'

export default class ArtistsController {
  /**
   * Get all artists with their relations
   * Public endpoint - no authentication required
   */
  async index({ response }: HttpContext) {
    const artists = await Artist.query()
      .preload('user')
      .preload('city')
      .preload('primarySalon')
      .preload('salons')

    return response.json(artists)
  }
}
