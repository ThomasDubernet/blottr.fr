import { DateTime } from 'luxon'
import { BaseModel, column, computed, belongsTo, manyToMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Artist from '#models/artist'
import Tag from '#models/tag'

export enum TattooStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum TattooStyle {
  TRADITIONAL = 'traditional',
  NEO_TRADITIONAL = 'neo_traditional',
  REALISTIC = 'realistic',
  BLACK_AND_GREY = 'black_and_grey',
  WATERCOLOR = 'watercolor',
  GEOMETRIC = 'geometric',
  MINIMALIST = 'minimalist',
  JAPANESE = 'japanese',
  TRIBAL = 'tribal',
  BIOMECHANICAL = 'biomechanical',
  PORTRAIT = 'portrait',
  ABSTRACT = 'abstract',
  DOTWORK = 'dotwork',
  LINEWORK = 'linework',
}

export enum BodyPlacement {
  ARM = 'arm',
  LEG = 'leg',
  BACK = 'back',
  CHEST = 'chest',
  SHOULDER = 'shoulder',
  HAND = 'hand',
  FOOT = 'foot',
  NECK = 'neck',
  FACE = 'face',
  TORSO = 'torso',
  RIBS = 'ribs',
  THIGH = 'thigh',
  CALF = 'calf',
  FOREARM = 'forearm',
}

export enum SizeCategory {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  FULL_PIECE = 'full_piece',
}

export enum ColorType {
  BLACK_AND_GREY = 'black_and_grey',
  COLOR = 'color',
  SINGLE_COLOR = 'single_color',
}

export interface ImageVariants {
  thumbnail: string
  medium: string
  large: string
  original: string
  webp?: {
    thumbnail: string
    medium: string
    large: string
  }
}

export interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
}

export default class Tattoo extends BaseModel {
  public static table = 'tattoos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare artistId: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare slug: string

  @column()
  declare originalFilename: string

  @column()
  declare storagePath: string

  @column()
  declare imageVariants: ImageVariants

  @column()
  declare primaryColor: string | null

  @column()
  declare fileSize: number

  @column()
  declare dimensions: ImageDimensions

  @column()
  declare contentType: string

  @column()
  declare contentHash: string | null

  @column()
  declare tattooStyle: TattooStyle | null

  @column()
  declare bodyPlacement: BodyPlacement | null

  @column()
  declare sizeCategory: SizeCategory | null

  @column()
  declare colorType: ColorType | null

  @column()
  declare sessionCount: number | null

  @column()
  declare estimatedHours: number | null

  @column()
  declare status: TattooStatus

  @column()
  declare isFeatured: boolean

  @column()
  declare isPortfolioHighlight: boolean

  @column()
  declare displayOrder: number

  @column()
  declare viewCount: number

  @column()
  declare likeCount: number

  @column()
  declare shareCount: number

  @column()
  declare engagementScore: number

  @column()
  declare allowsInquiries: boolean

  @column()
  declare showsPricing: boolean

  @column()
  declare priceEstimate: number | null

  @column()
  declare priceCurrency: string

  @column()
  declare altText: Record<string, string> | null

  @column()
  declare searchKeywords: string[] | null

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare publishedAt: DateTime | null

  // Relationships
  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @manyToMany(() => Tag, {
    pivotTable: 'tag_tattoos',
    pivotColumns: ['relevance_score', 'is_primary', 'assignment_type', 'is_approved'],
  })
  declare tags: ManyToMany<typeof Tag>

  // Computed properties
  @computed()
  public get isPublished(): boolean {
    return this.status === TattooStatus.PUBLISHED && this.publishedAt !== null
  }

  @computed()
  public get thumbnailUrl(): string {
    return this.imageVariants.thumbnail
  }

  @computed()
  public get displayUrl(): string {
    return this.imageVariants.medium
  }

  @computed()
  public get fullSizeUrl(): string {
    return this.imageVariants.large
  }

  @computed()
  public get aspectRatio(): number {
    return this.dimensions.aspectRatio
  }

  @computed()
  public get isHighEngagement(): boolean {
    return this.engagementScore > 8.0
  }

  @computed()
  public get estimatedPriceRange(): string | null {
    if (!this.priceEstimate) return null
    const base = this.priceEstimate
    const range = base * 0.3
    return `${Math.round(base - range)} - ${Math.round(base + range)} ${this.priceCurrency}`
  }

  // Business methods
  public async publish(): Promise<void> {
    this.status = TattooStatus.PUBLISHED
    this.publishedAt = DateTime.now()
    await this.save()
  }

  public async unpublish(): Promise<void> {
    this.status = TattooStatus.DRAFT
    await this.save()
  }

  public async incrementView(): Promise<void> {
    this.viewCount += 1
    this.engagementScore = this.calculateEngagementScore()
    await this.save()
  }

  public async incrementLike(): Promise<void> {
    this.likeCount += 1
    this.engagementScore = this.calculateEngagementScore()
    await this.save()
  }

  public async incrementShare(): Promise<void> {
    this.shareCount += 1
    this.engagementScore = this.calculateEngagementScore()
    await this.save()
  }

  public async updateEngagement(): Promise<void> {
    this.engagementScore = this.calculateEngagementScore()
    await this.save()
  }

  public async addPrimaryTag(tag: Tag): Promise<void> {
    await this.related('tags').attach({
      [tag.id]: {
        relevance_score: 1.0,
        is_primary: true,
        assignment_type: 'manual',
        is_approved: true,
      }
    })
  }

  public async addTag(tag: Tag, relevanceScore: number = 0.8, isPrimary: boolean = false): Promise<void> {
    await this.related('tags').attach({
      [tag.id]: {
        relevance_score: relevanceScore,
        is_primary: isPrimary,
        assignment_type: 'manual',
        is_approved: true,
      }
    })
  }

  public async setAltText(locale: string, text: string): Promise<void> {
    const altText = this.altText || {}
    altText[locale] = text
    this.altText = altText
    await this.save()
  }

  private calculateEngagementScore(): number {
    const viewWeight = Math.log(this.viewCount + 1) * 0.1
    const likeWeight = this.likeCount * 0.5
    const shareWeight = this.shareCount * 1.0
    const featuredBonus = this.isFeatured ? 2 : 0
    const portfolioBonus = this.isPortfolioHighlight ? 1.5 : 0
    
    return Math.min(10, viewWeight + likeWeight + shareWeight + featuredBonus + portfolioBonus)
  }

  // Scopes
  public static published = scope((query) => {
    query.where('status', TattooStatus.PUBLISHED)
      .whereNotNull('publishedAt')
  })

  public static byArtist = scope((query, artistId: string) => {
    query.where('artistId', artistId)
  })

  public static byStyle = scope((query, style: TattooStyle) => {
    query.where('tattooStyle', style)
  })

  public static byBodyPlacement = scope((query, placement: BodyPlacement) => {
    query.where('bodyPlacement', placement)
  })

  public static featured = scope((query) => {
    query.where('isFeatured', true).orderBy('displayOrder')
  })

  public static portfolioHighlights = scope((query) => {
    query.where('isPortfolioHighlight', true)
      .orderBy('engagementScore', 'desc')
  })

  public static highEngagement = scope((query) => {
    query.where('engagementScore', '>', 7).orderBy('engagementScore', 'desc')
  })

  public static recent = scope((query) => {
    query.orderBy('publishedAt', 'desc')
  })

  public static search = scope((query, searchTerm: string) => {
    query.whereILike('title', `%${searchTerm}%`)
      .orWhereILike('description', `%${searchTerm}%`)
      .orWhereRaw('search_keywords::jsonb @> ?', [JSON.stringify([searchTerm])])
  })

  public static priceRange = scope((query, min: number, max: number) => {
    query.whereBetween('priceEstimate', [min, max])
  })

  public static withTags = scope((query, tagIds: number[]) => {
    query.whereHas('tags', (tagQuery) => {
      tagQuery.whereIn('id', tagIds)
    })
  })

  // Hooks
  public static async boot() {
    super.boot()

    this.before('create', async (tattoo) => {
      // Set default values if not provided
      if (!tattoo.status) {
        tattoo.status = TattooStatus.DRAFT
      }
      if (tattoo.viewCount === undefined) {
        tattoo.viewCount = 0
      }
      if (tattoo.likeCount === undefined) {
        tattoo.likeCount = 0
      }
      if (tattoo.shareCount === undefined) {
        tattoo.shareCount = 0
      }
      if (tattoo.engagementScore === undefined) {
        tattoo.engagementScore = 0
      }
      if (tattoo.isFeatured === undefined) {
        tattoo.isFeatured = false
      }
      if (tattoo.isPortfolioHighlight === undefined) {
        tattoo.isPortfolioHighlight = false
      }
      if (tattoo.displayOrder === undefined) {
        tattoo.displayOrder = 0
      }
      if (tattoo.allowsInquiries === undefined) {
        tattoo.allowsInquiries = true
      }
      if (tattoo.showsPricing === undefined) {
        tattoo.showsPricing = false
      }
      if (!tattoo.priceCurrency) {
        tattoo.priceCurrency = 'EUR'
      }
    })
  }
}