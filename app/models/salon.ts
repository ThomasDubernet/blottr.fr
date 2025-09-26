import { DateTime } from 'luxon'
import { BaseModel, column, computed, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import City from './city.js'
import Artist from './artist.js'
import string from '@adonisjs/core/helpers/string'

// Salon verification status enum
export enum SalonVerificationStatus {
  UNVERIFIED = 'unverified',
  SCRAPED = 'scraped',
  CONTACTED = 'contacted',
  ONBOARDING = 'onboarding',
  VERIFIED = 'verified',
}

// Opening hours type
export interface OpeningHours {
  [key: string]: {
    isOpen: boolean
    openTime?: string
    closeTime?: string
    breaks?: Array<{ start: string; end: string }>
  }
}

export default class Salon extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  // Basic salon information
  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare shortDescription: string | null

  // Contact information
  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare website: string | null

  // Address and location
  @column()
  declare cityId: number

  @column()
  declare address: string

  @column()
  declare postalCode: string

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  // Business information
  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare openingHours: OpeningHours | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare services: string[] | null

  @column()
  declare priceRangeMin: number | null

  @column()
  declare priceRangeMax: number | null

  @column()
  declare currency: string

  // Social media and online presence
  @column()
  declare instagramHandle: string | null

  @column()
  declare facebookUrl: string | null

  @column()
  declare tiktokHandle: string | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare galleryImages: string[] | null

  // Verification and status
  @column()
  declare verificationStatus: SalonVerificationStatus

  @column.dateTime()
  declare verifiedAt: DateTime | null

  @column()
  declare verifiedBy: string | null

  @column()
  declare verificationNotes: string | null

  // Business status and visibility
  @column()
  declare isActive: boolean

  @column()
  declare isFeatured: boolean

  @column()
  declare acceptsWalkIns: boolean

  @column()
  declare appointmentRequired: boolean

  @column()
  declare priority: number

  // SEO and metadata
  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare seoKeywords: string[] | null

  // Business metrics
  @column()
  declare averageRating: number | null

  @column()
  declare totalReviews: number

  @column()
  declare totalArtists: number

  @column.dateTime()
  declare lastActivityAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>

  @manyToMany(() => Artist, {
    pivotTable: 'artist_salons',
    localKey: 'id',
    pivotForeignKey: 'salon_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'artist_id',
    pivotTimestamps: true,
    pivotColumns: [
      'relationship_type',
      'is_active',
      'schedule',
      'hourly_rate',
      'commission_rate',
      'started_working_at',
      'ended_working_at',
      'notes',
    ],
  })
  declare artists: ManyToMany<typeof Artist>

  // Computed properties
  @computed()
  public get displayName(): string {
    return this.name
  }

  @computed()
  public get isVerified(): boolean {
    return this.verificationStatus === SalonVerificationStatus.VERIFIED
  }

  @computed()
  public get isOpen(): boolean {
    if (!this.openingHours) return false

    const now = DateTime.now()
    const dayName = now.toFormat('cccc').toLowerCase()
    const currentTime = now.toFormat('HH:mm')

    const daySchedule = this.openingHours[dayName]
    if (!daySchedule?.isOpen || !daySchedule.openTime || !daySchedule.closeTime) {
      return false
    }

    return currentTime >= daySchedule.openTime && currentTime <= daySchedule.closeTime
  }

  @computed()
  public get coordinates(): { lat: number; lng: number } | null {
    if (!this.latitude || !this.longitude) return null
    return {
      lat: this.latitude,
      lng: this.longitude,
    }
  }

  @computed()
  public get priceRange(): string | null {
    if (!this.priceRangeMin && !this.priceRangeMax) return null

    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.currency,
    })

    if (this.priceRangeMin && this.priceRangeMax) {
      return `${formatter.format(this.priceRangeMin)} - ${formatter.format(this.priceRangeMax)}`
    }

    if (this.priceRangeMin) {
      return `À partir de ${formatter.format(this.priceRangeMin)}`
    }

    return `Jusqu'à ${formatter.format(this.priceRangeMax!)}`
  }

  @computed()
  public get fullAddress(): string {
    return `${this.address}, ${this.postalCode}`
  }

  // Business methods
  public static async findBySlug(slug: string): Promise<Salon | null> {
    return this.query().where('slug', slug).where('is_active', true).preload('city').first()
  }

  public static async findInCity(cityId: number): Promise<Salon[]> {
    return this.query()
      .where('city_id', cityId)
      .where('is_active', true)
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .orderBy('name', 'asc')
      .preload('city')
  }

  public static async findVerified(): Promise<Salon[]> {
    return this.query()
      .where('verification_status', SalonVerificationStatus.VERIFIED)
      .where('is_active', true)
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .preload('city')
  }

  public static async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 25
  ): Promise<Salon[]> {
    // Using Haversine formula approximation for nearby salons
    const latRange = radiusKm / 111.32 // 1 degree of latitude ≈ 111.32 km
    const lngRange = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180))

    return this.query()
      .where('is_active', true)
      .whereNotNull('latitude')
      .whereNotNull('longitude')
      .whereBetween('latitude', [latitude - latRange, latitude + latRange])
      .whereBetween('longitude', [longitude - lngRange, longitude + lngRange])
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .limit(20)
      .preload('city')
  }

  public static async findFeatured(): Promise<Salon[]> {
    return this.query()
      .where('is_active', true)
      .where('is_featured', true)
      .orderBy('priority', 'asc')
      .orderBy('name', 'asc')
      .preload('city')
  }

  public static async search(query: string): Promise<Salon[]> {
    return this.query()
      .where('is_active', true)
      .where((builder) => {
        builder
          .whereILike('name', `%${query}%`)
          .orWhereILike('description', `%${query}%`)
          .orWhereILike('address', `%${query}%`)
      })
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .limit(20)
      .preload('city')
  }

  public async markAsVerified(verifiedBy: string, notes?: string): Promise<void> {
    this.verificationStatus = SalonVerificationStatus.VERIFIED
    this.verifiedAt = DateTime.now()
    this.verifiedBy = verifiedBy
    this.verificationNotes = notes || null
    await this.save()
  }

  public async updateVerificationStatus(
    status: SalonVerificationStatus,
    notes?: string
  ): Promise<void> {
    this.verificationStatus = status
    this.verificationNotes = notes || null

    if (status === SalonVerificationStatus.VERIFIED) {
      this.verifiedAt = DateTime.now()
    }

    await this.save()
  }

  public async updateArtistCount(): Promise<void> {
    const activeArtistsCount = await (this.related('artists' as never) as any)
      .query()
      .wherePivot('is_active', true)
      .count('* as total')

    this.totalArtists = Number(activeArtistsCount[0].$extras.total) || 0
    await this.save()
  }

  public async addArtist(
    artistId: string,
    relationshipType: 'primary' | 'guest' | 'freelance' = 'guest'
  ): Promise<void> {
    await (this.related('artists' as never) as any).attach({
      [artistId]: {
        relationship_type: relationshipType,
        is_active: true,
        started_working_at: DateTime.now().toSQLDate(),
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    })

    await this.updateArtistCount()
  }

  public async removeArtist(artistId: string): Promise<void> {
    await (this.related('artists' as never) as any).detach([artistId])
    await this.updateArtistCount()
  }

  public distanceToKm(targetLat: number, targetLng: number): number | null {
    if (!this.latitude || !this.longitude) return null

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

  public static generateSlug(name: string): string {
    return string.slug(name, { lower: true })
  }

  // Hooks
  public static async boot() {
    super.boot()

    this.before('create', async (salon) => {
      if (!salon.slug) {
        salon.slug = Salon.generateSlug(salon.name)
      }

      // Set default values
      if (!salon.verificationStatus) {
        salon.verificationStatus = SalonVerificationStatus.UNVERIFIED
      }
      if (!salon.currency) {
        salon.currency = 'EUR'
      }

      // Set boolean defaults if undefined
      if (salon.isActive === undefined) {
        salon.isActive = true
      }
      if (salon.isFeatured === undefined) {
        salon.isFeatured = false
      }

      // Set numeric defaults if undefined
      if (salon.totalReviews === undefined) {
        salon.totalReviews = 0
      }
      if (salon.totalArtists === undefined) {
        salon.totalArtists = 0
      }
    })
  }
}
