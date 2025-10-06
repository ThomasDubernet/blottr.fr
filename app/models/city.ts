import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Basic city information
  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare postalCode: string

  @column()
  declare inseeCode: string

  // Geographic data
  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare population: number | null

  @column()
  declare area: number | null

  // Administrative division
  @column()
  declare departmentCode: string

  @column()
  declare departmentName: string

  @column()
  declare regionCode: string

  @column()
  declare regionName: string

  // SEO and metadata
  @column()
  declare description: string | null

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
  })
  declare seoKeywords: Record<string, any> | null

  // Status and visibility
  @column()
  declare isActive: boolean

  @column()
  declare isFeatured: boolean

  @column()
  declare priority: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  // Computed properties
  @computed()
  public get displayName(): string {
    return `${this.name} (${this.postalCode})`
  }

  @computed()
  public get formattedPopulation(): string | null {
    if (!this.population) return null
    return new Intl.NumberFormat('fr-FR', { useGrouping: true })
      .format(this.population)
      .replace(/\u202f/g, ' ')
  }

  @computed()
  public get coordinates(): { lat: number; lng: number } {
    return {
      lat: this.latitude,
      lng: this.longitude,
    }
  }

  // Business methods
  public static async findBySlug(slug: string): Promise<City | null> {
    return this.query().where('slug', slug).where('is_active', true).first()
  }

  public static async findByPostalCode(postalCode: string): Promise<City[]> {
    return this.query()
      .where('postal_code', postalCode)
      .where('is_active', true)
      .orderBy('priority', 'asc')
      .orderBy('name', 'asc')
  }

  public static async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<City[]> {
    // Using Haversine formula approximation for nearby cities
    const latRange = radiusKm / 111.32 // 1 degree of latitude ≈ 111.32 km
    const lngRange = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180))

    return this.query()
      .where('is_active', true)
      .whereBetween('latitude', [latitude - latRange, latitude + latRange])
      .whereBetween('longitude', [longitude - lngRange, longitude + lngRange])
      .orderBy('priority', 'asc')
      .limit(20)
  }

  public static async getFeaturedCities(): Promise<City[]> {
    return this.query()
      .where('is_active', true)
      .where('is_featured', true)
      .orderBy('priority', 'asc')
      .orderBy('name', 'asc')
  }

  public distanceToKm(targetLat: number, targetLng: number): number {
    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((targetLat - this.latitude) * Math.PI) / 180
    const dLng = ((targetLng - this.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.latitude * Math.PI) / 180) *
        Math.cos((targetLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  public async getUsersCount(): Promise<number> {
    const result = await User.query()
      .where('city_id', this.id)
      .where('is_active', true)
      .count('* as total')
    return Number(result[0].$extras.total) || 0
  }
}
