import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add role column with enum-like constraint (1=client, 2=artist)
      table.integer('role').notNullable().defaultTo(1).comment('1=client, 2=artist')

      // Add profile fields
      table.string('phone', 20).nullable()
      table.text('bio').nullable()
      table.string('avatar_url').nullable()
      table.date('birth_date').nullable()
      table.enum('gender', ['male', 'female', 'other', 'prefer_not_to_say']).nullable()

      // Add geographic data
      table.integer('city_id').nullable().unsigned()
      table.string('address').nullable()
      table.string('postal_code', 10).nullable()
      table.decimal('latitude', 10, 8).nullable()
      table.decimal('longitude', 11, 8).nullable()

      // Add verification and status fields
      table.boolean('email_verified').notNullable().defaultTo(false)
      table.timestamp('email_verified_at').nullable()
      table.boolean('phone_verified').notNullable().defaultTo(false)
      table.timestamp('phone_verified_at').nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('last_login_at').nullable()

      // Add constraints
      table.check('role IN (1, 2)', [], 'users_role_check')
      table.check('latitude >= -90 AND latitude <= 90', [], 'users_latitude_check')
      table.check('longitude >= -180 AND longitude <= 180', [], 'users_longitude_check')

      // Add indexes for performance
      table.index(['role'])
      table.index(['city_id'])
      table.index(['is_active'])
      table.index(['email_verified'])
      table.index(['latitude', 'longitude'])
    })
  }

  async down() {
    // Drop constraints using raw SQL (PostgreSQL doesn't support dropCheck in knex)
    await this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check')
    await this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_latitude_check')
    await this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_longitude_check')

    this.schema.alterTable(this.tableName, (table) => {
      // Drop indexes
      table.dropIndex(['role'])
      table.dropIndex(['city_id'])
      table.dropIndex(['is_active'])
      table.dropIndex(['email_verified'])
      table.dropIndex(['latitude', 'longitude'])

      // Drop columns
      table.dropColumn('role')
      table.dropColumn('phone')
      table.dropColumn('bio')
      table.dropColumn('avatar_url')
      table.dropColumn('birth_date')
      table.dropColumn('gender')
      table.dropColumn('city_id')
      table.dropColumn('address')
      table.dropColumn('postal_code')
      table.dropColumn('latitude')
      table.dropColumn('longitude')
      table.dropColumn('email_verified')
      table.dropColumn('email_verified_at')
      table.dropColumn('phone_verified')
      table.dropColumn('phone_verified_at')
      table.dropColumn('is_active')
      table.dropColumn('last_login_at')
    })
  }
}