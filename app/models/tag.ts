import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Tattoo from './tattoo.js'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare variants: any | null

  @column()
  declare category: string | null

  // SEO & Display
  @column()
  declare slug: string | null

  // Analytics
  @column()
  declare usageCount: number

  // Business logic
  @column()
  declare isFeatured: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Tattoo, {
    pivotTable: 'tag_tattoo',
  })
  declare tattoos: ManyToMany<typeof Tattoo>
}