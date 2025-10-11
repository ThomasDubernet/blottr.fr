import { DateTime } from 'luxon'
import { BaseModel, column, computed, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Artist from './artist.js'
import Tattoo from './tattoo.js'

export enum InquiryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  REPLIED = 'replied',
  CLOSED = 'closed',
  SPAM = 'spam',
}

export enum ProjectType {
  CONSULTATION = 'consultation',
  QUOTE = 'quote',
  APPOINTMENT = 'appointment',
  QUESTION = 'question',
}

export enum InquirySource {
  WEBSITE = 'website',
  QUICK_FORM = 'quick_form',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
}

export default class ContactInquiry extends BaseModel {
  public static table = 'contact_inquiries'

  @column({ isPrimary: true })
  declare id: string

  // Contact Information
  @column()
  declare fullName: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare subject: string

  @column()
  declare message: string

  // Project Details
  @column()
  declare projectType: ProjectType

  @column()
  declare budget: string | null

  @column()
  declare preferredDate: string | null

  @column()
  declare location: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
  })
  declare tattooStyles: string[] | null

  @column()
  declare size: string | null

  @column()
  declare placement: string | null

  @column()
  declare hasExistingTattoos: boolean

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
  })
  declare referenceImages: string[] | null

  // Relationships
  @column()
  declare artistId: string | null

  @column()
  declare tattooId: string | null

  // Status and Tracking
  @column()
  declare status: InquiryStatus

  @column()
  declare source: InquirySource

  @column()
  declare priority: number

  @column()
  declare isRead: boolean

  @column()
  declare isStarred: boolean

  // Technical Fields
  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
  })
  declare metadata: Record<string, any> | null

  // Response Tracking
  @column.dateTime()
  declare firstRepliedAt: DateTime | null

  @column.dateTime()
  declare lastRepliedAt: DateTime | null

  @column()
  declare repliesCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @belongsTo(() => Tattoo)
  declare tattoo: BelongsTo<typeof Tattoo>

  // Computed Properties
  @computed()
  public get isPending(): boolean {
    return this.status === InquiryStatus.PENDING
  }

  @computed()
  public get isUrgent(): boolean {
    return this.priority >= 8 || this.projectType === ProjectType.APPOINTMENT
  }

  @computed()
  public get timeAgo(): string {
    const now = DateTime.now()
    const diff = now.diff(this.createdAt, ['days', 'hours', 'minutes'])

    if (diff.days > 0) {
      return `il y a ${Math.floor(diff.days)} jour${diff.days > 1 ? 's' : ''}`
    } else if (diff.hours > 0) {
      return `il y a ${Math.floor(diff.hours)} heure${diff.hours > 1 ? 's' : ''}`
    } else {
      return `il y a ${Math.floor(diff.minutes)} minute${diff.minutes > 1 ? 's' : ''}`
    }
  }

  @computed()
  public get responseTime(): number | null {
    if (!this.firstRepliedAt) return null
    return this.firstRepliedAt.diff(this.createdAt, 'hours').hours
  }

  @computed()
  public get priorityLabel(): string {
    if (this.priority >= 9) return 'Critique'
    if (this.priority >= 7) return 'Élevée'
    if (this.priority >= 5) return 'Normale'
    if (this.priority >= 3) return 'Faible'
    return 'Très faible'
  }

  // Business Methods
  public async markAsRead(): Promise<void> {
    this.isRead = true
    await this.save()
  }

  public async markAsStarred(): Promise<void> {
    this.isStarred = !this.isStarred
    await this.save()
  }

  public async updateStatus(status: InquiryStatus): Promise<void> {
    this.status = status
    await this.save()
  }

  public async recordReply(): Promise<void> {
    const now = DateTime.now()

    if (!this.firstRepliedAt) {
      this.firstRepliedAt = now
    }

    this.lastRepliedAt = now
    this.repliesCount += 1
    this.status = InquiryStatus.REPLIED

    await this.save()
  }

  public async setPriority(priority: number): Promise<void> {
    this.priority = Math.max(1, Math.min(10, priority))
    await this.save()
  }

  // Static Methods
  public static async findPending(): Promise<ContactInquiry[]> {
    return this.query()
      .where('status', InquiryStatus.PENDING)
      .orderBy('created_at', 'desc')
      .preload('artist')
      .preload('tattoo')
  }

  public static async findByArtist(artistId: string): Promise<ContactInquiry[]> {
    return this.query()
      .where('artist_id', artistId)
      .orderBy('created_at', 'desc')
      .preload('artist')
      .preload('tattoo')
  }

  public static async findUnread(): Promise<ContactInquiry[]> {
    return this.query()
      .where('is_read', false)
      .where('status', '!=', InquiryStatus.SPAM)
      .orderBy('created_at', 'desc')
  }

  public static async findUrgent(): Promise<ContactInquiry[]> {
    return this.query()
      .where('priority', '>=', 8)
      .orWhere('project_type', ProjectType.APPOINTMENT)
      .where('status', InquiryStatus.PENDING)
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'asc')
  }

  // Hooks
  public static async boot() {
    super.boot()

    this.before('create', async (inquiry) => {
      // Set default values
      if (inquiry.status === undefined) {
        inquiry.status = InquiryStatus.PENDING
      }
      if (inquiry.source === undefined) {
        inquiry.source = InquirySource.WEBSITE
      }
      if (inquiry.priority === undefined) {
        // Auto-set priority based on project type
        switch (inquiry.projectType) {
          case ProjectType.APPOINTMENT:
            inquiry.priority = 8
            break
          case ProjectType.QUOTE:
            inquiry.priority = 6
            break
          case ProjectType.CONSULTATION:
            inquiry.priority = 5
            break
          default:
            inquiry.priority = 3
        }
      }
      if (inquiry.isRead === undefined) {
        inquiry.isRead = false
      }
      if (inquiry.isStarred === undefined) {
        inquiry.isStarred = false
      }
      if (inquiry.hasExistingTattoos === undefined) {
        inquiry.hasExistingTattoos = false
      }
      if (inquiry.repliesCount === undefined) {
        inquiry.repliesCount = 0
      }
    })
  }
}
