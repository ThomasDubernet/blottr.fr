import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import City from './city.js'
import Salon from './salon.js'
import Appointment from './appointment.js'

export default class Shop extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare contactEmail: string | null

  @column()
  declare phone: string | null

  @column()
  declare street: string | null

  @column()
  declare city: string | null

  @column()
  declare zip: string | null

  @column()
  declare country: string | null

  @column()
  declare description: string | null

  @column()
  declare lgbtqFriendly: boolean

  @column()
  declare logo: string | null

  @column()
  declare isPrivate: boolean

  @column()
  declare type: string | null

  @column()
  declare googleClientId: string | null

  @column()
  declare googlePlaceId: string | null

  @column()
  declare googleReviewsCount: number | null

  @column()
  declare googleReviewsTotalScore: string | null

  @column()
  declare website: string | null

  @column()
  declare instaUrl: string | null

  // SEO & Display
  @column()
  declare slug: string | null

  // Geographic reference
  @column()
  declare cityId: string | null

  // Business logic
  @column()
  declare isActive: boolean

  // Analytics
  @column()
  declare viewCount: number

  // Foreign key for salon relationship
  @column()
  declare salonId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => City)
  declare cityRelation: BelongsTo<typeof City>

  @belongsTo(() => Salon)
  declare salon: BelongsTo<typeof Salon>

  @hasMany(() => Appointment)
  declare appointments: HasMany<typeof Appointment>
}
