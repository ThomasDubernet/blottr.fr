import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Artist from './artist.js'
import Salon from './salon.js'
import Shop from './shop.js'
import User from './user.js'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare department: string

  @column()
  declare region: string

  @column()
  declare country: string

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare postalCode: string | null

  @column()
  declare seoDescription: string | null

  @column()
  declare seoTitle: string | null

  @column()
  declare artistCount: number

  @column()
  declare salonCount: number

  @column()
  declare tattooCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @hasMany(() => Artist)
  declare artists: HasMany<typeof Artist>

  @hasMany(() => Salon)
  declare salons: HasMany<typeof Salon>

  @hasMany(() => Shop)
  declare shops: HasMany<typeof Shop>

  @hasMany(() => User, { foreignKey: 'preferredCityId' })
  declare users: HasMany<typeof User>
}