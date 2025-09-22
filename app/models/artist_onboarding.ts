import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Artist from './artist.js'

export default class ArtistOnboarding extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare artistId: string

  @column()
  declare contactEmail: string | null

  @column()
  declare contactAttempts: number

  @column.dateTime()
  declare lastContactAt: DateTime | null

  @column()
  declare onboardingLink: string | null

  @column()
  declare status: 'pending' | 'email_sent' | 'clicked' | 'completed' | 'failed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>
}