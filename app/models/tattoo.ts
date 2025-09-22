import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Artist from './artist.js'
import Salon from './salon.js'
import Tag from './tag.js'

export default class Tattoo extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare artistId: string

  @column()
  declare salonId: string | null

  @column()
  declare photo: string | null

  @column()
  declare description: string | null

  @column()
  declare isFlash: boolean

  @column()
  declare price: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @belongsTo(() => Salon)
  declare salon: BelongsTo<typeof Salon>

  @manyToMany(() => Tag, {
    pivotTable: 'tag_tattoo',
  })
  declare tags: ManyToMany<typeof Tag>
}