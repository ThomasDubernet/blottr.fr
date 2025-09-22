import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Salon from './salon.js'
import Tattoo from './tattoo.js'
import ContactRequest from './contact_request.js'
import Appointment from './appointment.js'
import ArtistOnboarding from './artist_onboarding.js'

export default class Artist extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare bio: string | null

  @column()
  declare avatar: string | null

  @column()
  declare isGuest: boolean

  @column()
  declare salonId: string | null

  // Instagram scraping fields
  @column()
  declare isVerified: boolean

  @column()
  declare verificationStatus: 'scraped' | 'contacted' | 'onboarding' | 'verified'

  @column()
  declare instagramHandle: string | null

  @column()
  declare instagramUrl: string | null

  @column()
  declare instagramFollowers: number | null

  @column.dateTime()
  declare lastScrapedAt: DateTime | null

  @column()
  declare dataSource: 'instagram_scraping' | 'manual_registration'

  @column()
  declare verificationToken: string | null

  @column.dateTime()
  declare verifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Salon)
  declare salon: BelongsTo<typeof Salon>

  @manyToMany(() => Salon, {
    pivotTable: 'artist_salon',
    pivotColumns: ['is_primary', 'is_guest', 'start_date', 'end_date'],
  })
  declare salons: ManyToMany<typeof Salon>

  @hasMany(() => Tattoo)
  declare tattoos: HasMany<typeof Tattoo>

  @hasMany(() => ContactRequest)
  declare contactRequests: HasMany<typeof ContactRequest>

  @hasMany(() => Appointment)
  declare appointments: HasMany<typeof Appointment>

  @hasMany(() => ArtistOnboarding)
  declare onboarding: HasMany<typeof ArtistOnboarding>
}