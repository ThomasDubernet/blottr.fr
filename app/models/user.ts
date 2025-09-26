import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import City from './city.js'
import Artist from './artist.js'

// Define user roles enum
export enum UserRole {
  CLIENT = 1,
  ARTIST = 2,
}

export type UserGender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  // Role and profile fields
  @column()
  declare role: UserRole

  @column()
  declare phone: string | null

  @column()
  declare bio: string | null

  @column()
  declare avatarUrl: string | null

  @column.date()
  declare birthDate: DateTime | null

  @column()
  declare gender: UserGender | null

  // Geographic data
  @column()
  declare cityId: number | null

  @column()
  declare address: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  // Verification and status fields
  @column()
  declare emailVerified: boolean

  @column.dateTime()
  declare emailVerifiedAt: DateTime | null

  @column()
  declare phoneVerified: boolean

  @column.dateTime()
  declare phoneVerifiedAt: DateTime | null

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare lastLoginAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>

  @hasMany(() => Artist)
  declare artists: HasMany<typeof Artist>

  // Computed properties
  @computed()
  public get isClient(): boolean {
    return this.role === UserRole.CLIENT
  }

  @computed()
  public get isArtist(): boolean {
    return this.role === UserRole.ARTIST
  }

  @computed()
  public get displayName(): string {
    return this.fullName || this.email.split('@')[0]
  }

  @computed()
  public get isProfileComplete(): boolean {
    const requiredFields = [this.fullName, this.phone, this.cityId]
    return requiredFields.every((field) => field !== null && field !== undefined)
  }

  @computed()
  public get isFullyVerified(): boolean {
    return this.emailVerified && this.phoneVerified
  }

  @computed()
  public get age(): number | null {
    if (!this.birthDate) return null
    return Math.floor(DateTime.now().diff(this.birthDate, 'years').years)
  }

  @computed()
  public get coordinates(): { lat: number; lng: number } | null {
    if (!this.latitude || !this.longitude) return null
    return {
      lat: this.latitude,
      lng: this.longitude,
    }
  }

  // Business methods
  public static async findByEmail(email: string): Promise<User | null> {
    return this.query().where('email', email).where('is_active', true).first()
  }

  public static async findClients(): Promise<User[]> {
    return this.query()
      .where('role', UserRole.CLIENT)
      .where('is_active', true)
      .orderBy('created_at', 'desc')
  }

  public static async findArtists(): Promise<User[]> {
    return this.query()
      .where('role', UserRole.ARTIST)
      .where('is_active', true)
      .orderBy('created_at', 'desc')
  }

  public static async findInCity(cityId: number): Promise<User[]> {
    return this.query()
      .where('city_id', cityId)
      .where('is_active', true)
      .orderBy('created_at', 'desc')
  }

  public static async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<User[]> {
    // Using Haversine formula approximation for nearby users
    const latRange = radiusKm / 111.32 // 1 degree of latitude ≈ 111.32 km
    const lngRange = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180))

    return this.query()
      .where('is_active', true)
      .whereNotNull('latitude')
      .whereNotNull('longitude')
      .whereBetween('latitude', [latitude - latRange, latitude + latRange])
      .whereBetween('longitude', [longitude - lngRange, longitude + lngRange])
      .orderBy('created_at', 'desc')
      .limit(20)
  }

  public async markEmailAsVerified(): Promise<void> {
    this.emailVerified = true
    this.emailVerifiedAt = DateTime.now()
    await this.save()
  }

  public async markPhoneAsVerified(): Promise<void> {
    this.phoneVerified = true
    this.phoneVerifiedAt = DateTime.now()
    await this.save()
  }

  public async updateLastLogin(): Promise<void> {
    this.lastLoginAt = DateTime.now()
    await this.save()
  }

  public async deactivate(): Promise<void> {
    this.isActive = false
    await this.save()
  }

  public async changeEmail(newEmail: string): Promise<void> {
    this.email = newEmail
    this.emailVerified = false
    this.emailVerifiedAt = null
    await this.save()
  }

  public async changeRole(newRole: UserRole): Promise<void> {
    this.role = newRole
    await this.save()
  }

  public distanceToKm(targetLat: number, targetLng: number): number | null {
    if (!this.latitude || !this.longitude) return null

    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((targetLat - this.latitude) * Math.PI) / 180
    const dLng = ((targetLng - this.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.latitude * Math.PI) / 180) *
        Math.cos((targetLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}
