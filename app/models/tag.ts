import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  computed,
  belongsTo,
  hasMany,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tattoo from '#models/tattoo'

export enum TagCategory {
  STYLE = 'style',
  SUBJECT = 'subject',
  BODY_PART = 'body_part',
  COLOR = 'color',
  SIZE = 'size',
  TECHNIQUE = 'technique',
  MOOD = 'mood',
  CULTURAL = 'cultural',
  CUSTOM = 'custom',
}

export interface TagTranslation {
  name?: string
  description?: string
}

export interface TagTranslations {
  [locale: string]: TagTranslation
}

export interface TagTattooAttachment {
  relevanceScore: number
  isPrimary: boolean
  assignmentType: 'manual' | 'auto' | 'ai_suggested'
  isApproved: boolean
}

export default class Tag extends BaseModel {
  public static table = 'tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare category: TagCategory

  @column()
  declare parentTagId: number | null

  @column()
  declare level: number

  @column()
  declare colorCode: string | null

  @column()
  declare iconName: string | null

  @column()
  declare displayOrder: number

  @column()
  declare usageCount: number

  @column()
  declare isFeatured: boolean

  @column()
  declare isTrending: boolean

  @column()
  declare popularityScore: number

  @column()
  declare requiresApproval: boolean

  @column()
  declare isApproved: boolean

  @column()
  declare createdBy: string | null

  @column()
  declare approvedBy: string | null

  @column()
  declare translations: TagTranslations | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Tag, { foreignKey: 'parentTagId' })
  declare parentTag: BelongsTo<typeof Tag>

  @hasMany(() => Tag, { foreignKey: 'parentTagId' })
  declare childTags: HasMany<typeof Tag>

  @manyToMany(() => Tattoo, {
    pivotTable: 'tag_tattoos',
    pivotColumns: ['relevance_score', 'is_primary', 'assignment_type', 'is_approved'],
  })
  declare tattoos: ManyToMany<typeof Tattoo>

  // Computed properties
  @computed()
  public get isHierarchical(): boolean {
    return this.level > 0 || this.parentTagId !== null
  }

  @computed()
  public get displayName(): string {
    if (this.translations?.fr?.name) {
      return this.translations.fr.name
    }
    return this.name
  }

  @computed()
  public get isPopular(): boolean {
    return this.popularityScore > 7 && this.usageCount > 50
  }

  // Business methods
  public async incrementUsage(): Promise<void> {
    this.usageCount += 1
    this.popularityScore = this.calculatePopularityScore()
    await this.save()
  }

  public async approve(approverEmail: string): Promise<void> {
    this.isApproved = true
    this.approvedBy = approverEmail
    await this.save()
  }

  public async setTranslation(locale: string, data: TagTranslation): Promise<void> {
    const translations = this.translations || {}
    translations[locale] = { ...translations[locale], ...data }
    this.translations = translations
    await this.save()
  }

  public async attachToTattoo(tattoo: Tattoo, options: TagTattooAttachment): Promise<void> {
    await this.related('tattoos').attach({
      [tattoo.id]: {
        relevance_score: options.relevanceScore,
        is_primary: options.isPrimary,
        assignment_type: options.assignmentType,
        is_approved: options.isApproved ?? true,
      },
    })
    await this.incrementUsage()
  }

  private calculatePopularityScore(): number {
    const usageWeight = Math.log(this.usageCount + 1) * 2
    const featuredBonus = this.isFeatured ? 2 : 0
    const trendingBonus = this.isTrending ? 1.5 : 0
    return Math.min(10, usageWeight + featuredBonus + trendingBonus)
  }

  // Scopes
  public static approved = scope((query) => {
    query.where('isApproved', true)
  })

  public static byCategory = scope((query, category: TagCategory) => {
    query.where('category', category)
  })

  public static featured = scope((query) => {
    query.where('isFeatured', true).orderBy('displayOrder')
  })

  public static popular = scope((query) => {
    query.where('popularityScore', '>', 5).orderBy('popularityScore', 'desc')
  })

  public static trending = scope((query) => {
    query.where('isTrending', true).orderBy('usageCount', 'desc')
  })

  public static search = scope((query, searchTerm: string) => {
    query.whereILike('name', `%${searchTerm}%`).orWhereILike('description', `%${searchTerm}%`)
  })
}
