import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Artist from './artist.js'

export default class ContactRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare clientId: string

  @column()
  declare artistId: string

  @column()
  declare message: string | null

  @column()
  declare status: 'pending' | 'artist_contacted' | 'artist_responded' | 'completed'

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
}