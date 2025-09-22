import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}