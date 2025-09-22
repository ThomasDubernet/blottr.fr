import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Artist from './artist.js'
import Tattoo from './tattoo.js'
import Appointment from './appointment.js'

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
}