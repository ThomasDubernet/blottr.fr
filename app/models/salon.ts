import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Artist from './artist.js'
import Tattoo from './tattoo.js'
import Appointment from './appointment.js'
import City from './city.js'
import Shop from './shop.js'

export default class Salon extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string | null

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

  // SEO & Display
  @column()
  declare slug: string | null

  @column()
  declare seoDescription: string | null

  @column()
  declare seoTitle: string | null

  // Business logic
  @column()
  declare isVerified: boolean

  @column()
  declare editorPick: boolean

  // Geographic reference
  @column()
  declare cityId: string | null

  // Analytics
  @column()
  declare viewCount: number

  @column()
  declare contactCount: number

  // Additional contact info
  @column()
  declare website: string | null

  @column()
  declare socialLinks: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Artist)
  declare artists: HasMany<typeof Artist>

  @manyToMany(() => Artist, {
    pivotTable: 'artist_salon',
    pivotColumns: ['is_primary', 'is_guest', 'start_date', 'end_date'],
  })
  declare artistsMany: ManyToMany<typeof Artist>

  @hasMany(() => Tattoo)
  declare tattoos: HasMany<typeof Tattoo>

  @hasMany(() => Appointment)
  declare appointments: HasMany<typeof Appointment>

  @belongsTo(() => City, { foreignKey: 'cityId' })
  declare cityRelation: BelongsTo<typeof City>

  @hasMany(() => Shop)
  declare shops: HasMany<typeof Shop>
}