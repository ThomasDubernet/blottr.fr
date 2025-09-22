import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AuthAccessToken from './auth_access_token.js'
import ContactRequest from './contact_request.js'
import Appointment from './appointment.js'

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
}