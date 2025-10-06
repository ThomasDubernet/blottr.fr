import { DateTime } from 'luxon'
import { BaseModel, column, computed, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import City from './city.js'
import Salon from './salon.js'
import string from '@adonisjs/core/helpers/string'

// Artist verification status enum
export enum ArtistVerificationStatus {
  UNVERIFIED = 'unverified',
  SCRAPED = 'scraped',
  CONTACTED = 'contacted',
  ONBOARDING = 'onboarding',
  VERIFIED = 'verified',
}

// Artist experience level enum
export enum ArtistExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

// Availability type
export interface Availability {
  [key: string]: {
    isAvailable: boolean
    startTime?: string
    endTime?: string
    breaks?: Array<{ start: string; end: string }>
  }
}

export default class Artist extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  // User relationship - one user can be one artist
  @column()
  declare userId: number

  // Professional information
  @column()
  declare stageName: string

  @column()
  declare slug: string

  @column()
  declare bio: string | null

  @column()
  declare shortBio: string | null

  @column()
  declare specialty: string | null

  // Professional status and experience
  @column()
  declare yearsExperience: number | null

  @column.date()
  declare startedTattooingAt: DateTime | null

  @column()
  declare experienceLevel: ArtistExperienceLevel

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
  })
  declare artStyles: string[] | null

  // Location and primary salon
  @column()
  declare cityId: number

  @column()
  declare primarySalonId: string | null

  // Availability and booking
  @column()
  declare acceptsBookings: boolean

  @column()
  declare appointmentOnly: boolean

  @column()
  declare minPrice: number | null

  @column()
  declare maxPrice: number | null

  @column()
  declare currency: string

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    
  })
  declare availability: Availability | null

  // Portfolio and social presence
  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    
  })
  declare portfolioImages: string[] | null

  @column()
  declare instagramHandle: string | null

  @column()
  declare instagramUrl: string | null

  @column()
  declare website: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    
  })
  declare socialLinks: Record<string, string> | null

  // Verification system
  @column()
  declare verificationStatus: ArtistVerificationStatus

  @column.dateTime()
  declare verifiedAt: DateTime | null

  @column()
  declare verifiedBy: string | null

  @column()
  declare verificationNotes: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    
  })
  declare verificationDocuments: string[] | null

  // Professional credentials
  @column()
  declare hasHealthCertificate: boolean

  @column()
  declare hasProfessionalInsurance: boolean

  @column.date()
  declare healthCertificateExpiresAt: DateTime | null

  @column()
  declare certifications: string | null

  // Status and visibility
  @column()
  declare isActive: boolean

  @column()
  declare isFeatured: boolean

  @column()
  declare isAcceptingNewClients: boolean

  @column()
  declare priority: number

  // Performance metrics
  @column()
  declare averageRating: number | null

  @column()
  declare totalReviews: number

  @column()
  declare totalTattoos: number

  @column()
  declare profileViews: number

  @column.dateTime()
  declare lastActivityAt: DateTime | null

  // SEO and metadata
  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    
  })
  declare seoKeywords: string[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>

  @belongsTo(() => Salon, {
    foreignKey: 'primarySalonId',
  })
  declare primarySalon: BelongsTo<typeof Salon>

  @manyToMany(() => Salon, {
    pivotTable: 'artist_salons',
    localKey: 'id',
    pivotForeignKey: 'artist_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'salon_id',
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
  declare salons: ManyToMany<typeof Salon>

  // Computed properties
  @computed()
  public get displayName(): string {
    return this.stageName
  }

  @computed()
  public get isVerified(): boolean {
    return this.verificationStatus === ArtistVerificationStatus.VERIFIED
  }

  @computed()
  public get isExperienced(): boolean {
    return (
      this.experienceLevel === ArtistExperienceLevel.ADVANCED ||
      this.experienceLevel === ArtistExperienceLevel.EXPERT
    )
  }

  @computed()
  public get priceRange(): string | null {
    if (!this.minPrice && !this.maxPrice) return null

    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.currency,
    })

    if (this.minPrice && this.maxPrice) {
      return `${formatter.format(this.minPrice)} - ${formatter.format(this.maxPrice)}`
    }

    if (this.minPrice) {
      return `À partir de ${formatter.format(this.minPrice)}`
    }

    return `Jusqu'à ${formatter.format(this.maxPrice!)}`
  }

  @computed()
  public get experienceYears(): number {
    if (this.yearsExperience) return this.yearsExperience

    if (this.startedTattooingAt) {
      return Math.floor(DateTime.now().diff(this.startedTattooingAt, 'years').years)
    }

    return 0
  }

  @computed()
  public get isAvailableToday(): boolean {
    if (!this.availability) return false

    const today = DateTime.now().toFormat('cccc').toLowerCase()
    const dayAvailability = this.availability[today]

    return dayAvailability?.isAvailable || false
  }

  @computed()
  public get hasHealthCredentials(): boolean {
    return (
      this.hasHealthCertificate &&
      this.hasProfessionalInsurance &&
      (this.healthCertificateExpiresAt ? this.healthCertificateExpiresAt > DateTime.now() : false)
    )
  }

  @computed()
  public get isProfileComplete(): boolean {
    const requiredFields = [
      this.stageName,
      this.bio,
      this.specialty,
      this.artStyles,
      this.minPrice,
      this.portfolioImages?.length,
    ]

    return requiredFields.every((field) => field !== null && field !== undefined && field !== 0)
  }

  // Business methods
  public static async findBySlug(slug: string): Promise<Artist | null> {
    return this.query()
      .where('slug', slug)
      .where('is_active', true)
      .preload('user')
      .preload('city')
      .preload('primarySalon')
      .first()
  }

  public static async findByUserId(userId: number): Promise<Artist | null> {
    return this.query()
      .where('user_id', userId)
      .where('is_active', true)
      .preload('user')
      .preload('city')
      .preload('primarySalon')
      .first()
  }

  public static async findInCity(cityId: number): Promise<Artist[]> {
    return this.query()
      .where('city_id', cityId)
      .where('is_active', true)
      .where('is_accepting_new_clients', true)
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .orderBy('total_reviews', 'desc')
      .preload('user')
      .preload('city')
      .preload('primarySalon')
  }

  public static async findVerified(): Promise<Artist[]> {
    return this.query()
      .where('verification_status', ArtistVerificationStatus.VERIFIED)
      .where('is_active', true)
      .where('is_accepting_new_clients', true)
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .preload('user')
      .preload('city')
  }

  public static async findFeatured(): Promise<Artist[]> {
    return this.query()
      .where('is_active', true)
      .where('is_featured', true)
      .where('is_accepting_new_clients', true)
      .orderBy('priority', 'asc')
      .orderBy('average_rating', 'desc')
      .preload('user')
      .preload('city')
      .preload('primarySalon')
  }

  public static async findByArtStyle(artStyles: string[]): Promise<Artist[]> {
    let query = this.query().where('is_active', true).where('is_accepting_new_clients', true)

    // Build OR conditions for each art style
    query = query.where((builder) => {
      for (const style of artStyles) {
        builder.orWhereRaw('art_styles::jsonb @> ?', [JSON.stringify([style])])
      }
    })

    return query
      .orderBy('is_featured', 'desc')
      .orderBy('total_reviews', 'desc')
      .preload('user')
      .preload('city')
      .preload('primarySalon')
  }

  public static async findByExperienceLevel(level: ArtistExperienceLevel): Promise<Artist[]> {
    return this.query()
      .where('experience_level', level)
      .where('is_active', true)
      .where('is_accepting_new_clients', true)
      .orderBy('is_featured', 'desc')
      .orderBy('years_experience', 'desc')
      .preload('user')
      .preload('city')
  }

  public static async search(query: string): Promise<Artist[]> {
    return this.query()
      .where('is_active', true)
      .where('is_accepting_new_clients', true)
      .where((builder) => {
        builder
          .whereILike('stage_name', `%${query}%`)
          .orWhereILike('bio', `%${query}%`)
          .orWhereILike('specialty', `%${query}%`)
      })
      .orderBy('is_featured', 'desc')
      .orderBy('priority', 'asc')
      .limit(20)
      .preload('user')
      .preload('city')
      .preload('primarySalon')
  }

  public async markAsVerified(verifiedBy: string, notes?: string): Promise<void> {
    this.verificationStatus = ArtistVerificationStatus.VERIFIED
    this.verifiedAt = DateTime.now()
    this.verifiedBy = verifiedBy
    this.verificationNotes = notes || null
    await this.save()
  }

  public async updateVerificationStatus(
    status: ArtistVerificationStatus,
    notes?: string
  ): Promise<void> {
    this.verificationStatus = status
    this.verificationNotes = notes || null

    if (status === ArtistVerificationStatus.VERIFIED) {
      this.verifiedAt = DateTime.now()
    }

    await this.save()
  }

  public async addToSalon(
    salonId: string,
    relationshipType: 'primary' | 'guest' | 'freelance' = 'guest'
  ): Promise<void> {
    await (this.related('salons' as never) as any).attach({
      [salonId]: {
        relationship_type: relationshipType,
        is_active: true,
        started_working_at: DateTime.now().toSQLDate(),
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    })

    if (relationshipType === 'primary') {
      this.primarySalonId = salonId
      await this.save()
    }
  }

  public async removeFromSalon(salonId: string): Promise<void> {
    await (this.related('salons' as never) as any).detach([salonId])

    if (this.primarySalonId === salonId) {
      this.primarySalonId = null
      await this.save()
    }
  }

  public async setPrimarySalon(salonId: string): Promise<void> {
    this.primarySalonId = salonId
    await this.save()

    // Update the relationship to primary
    await (this.related('salons' as never) as any).pivotQuery().where('salon_id', salonId).update({
      relationship_type: 'primary',
      updated_at: DateTime.now().toSQL(),
    })
  }

  public async incrementProfileViews(): Promise<void> {
    this.profileViews += 1
    await this.save()
  }

  public async updateLastActivity(): Promise<void> {
    this.lastActivityAt = DateTime.now()
    await this.save()
  }

  public static generateSlug(stageName: string): string {
    return string.slug(stageName, { lower: true })
  }

  // Hooks
  public static async boot() {
    super.boot()

    this.before('create', async (artist) => {
      if (!artist.slug) {
        artist.slug = Artist.generateSlug(artist.stageName)
      }

      // Set default values
      if (!artist.experienceLevel) {
        artist.experienceLevel = ArtistExperienceLevel.INTERMEDIATE
      }
      if (!artist.currency) {
        artist.currency = 'EUR'
      }
      if (!artist.verificationStatus) {
        artist.verificationStatus = ArtistVerificationStatus.UNVERIFIED
      }

      // Set boolean defaults if undefined
      if (artist.isActive === undefined) {
        artist.isActive = true
      }
      if (artist.acceptsBookings === undefined) {
        artist.acceptsBookings = true
      }
      if (artist.appointmentOnly === undefined) {
        artist.appointmentOnly = true
      }
      if (artist.isAcceptingNewClients === undefined) {
        artist.isAcceptingNewClients = true
      }
      if (artist.isFeatured === undefined) {
        artist.isFeatured = false
      }

      // Set numeric defaults if undefined
      if (artist.totalReviews === undefined) {
        artist.totalReviews = 0
      }
      if (artist.totalTattoos === undefined) {
        artist.totalTattoos = 0
      }
      if (artist.profileViews === undefined) {
        artist.profileViews = 0
      }
      if (artist.hasHealthCertificate === undefined) {
        artist.hasHealthCertificate = false
      }
      if (artist.hasProfessionalInsurance === undefined) {
        artist.hasProfessionalInsurance = false
      }
    })
  }
}
