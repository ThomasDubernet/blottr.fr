import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import AuthAccessToken from './auth_access_token.js'
import ContactRequest from './contact_request.js'
import Appointment from './appointment.js'
import City from './city.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: number // 1=client, 2=artist

  @column.dateTime()
  declare lastLoginAt: DateTime | null

  @column()
  declare avatarFile: string | null

  // Profile completion
  @column()
  declare phone: string | null

  @column.date()
  declare birthDate: DateTime | null

  @column()
  declare gender: string | null

  // Geographic preference
  @column()
  declare preferredCityId: string | null

  // Analytics
  @column.dateTime()
  declare lastActivityAt: DateTime | null

  @column()
  declare tattooViewCount: number

  @column()
  declare artistContactCount: number

  // Preferences
  @column()
  declare stylePreferences: Record<string, any> | null

  @column()
  declare notificationPreferences: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => AuthAccessToken, {
    foreignKey: 'tokenableId',
  })
  declare tokens: HasMany<typeof AuthAccessToken>

  @hasMany(() => ContactRequest, {
    foreignKey: 'clientId',
  })
  declare contactRequests: HasMany<typeof ContactRequest>

  @hasMany(() => Appointment, {
    foreignKey: 'clientId',
  })
  declare appointments: HasMany<typeof Appointment>

  @belongsTo(() => City, {
    foreignKey: 'preferredCityId',
  })
  declare preferredCity: BelongsTo<typeof City>
}
