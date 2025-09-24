import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Artist from './artist.js'
import Salon from './salon.js'
import Shop from './shop.js'

export default class Appointment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare clientId: string

  @column()
  declare artistId: string

  @column()
  declare salonId: string | null

  @column.dateTime()
  declare appointmentDate: DateTime

  @column()
  declare duration: number | null // minutes

  @column()
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled'

  @column()
  declare notes: string | null

  // Additional fields
  @column()
  declare shopId: string | null

  @column()
  declare price: number | null

  @column()
  declare paymentStatus: string | null

  @column()
  declare clientNotes: string | null

  @column()
  declare artistNotes: string | null

  @column()
  declare reminderSent: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'clientId',
  })
  declare client: BelongsTo<typeof User>

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @belongsTo(() => Salon)
  declare salon: BelongsTo<typeof Salon>

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>
}
