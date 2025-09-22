import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('email').nullable()
      table.string('phone').nullable()
      table.text('bio').nullable()
      table.text('avatar').nullable()
      table.boolean('is_guest').defaultTo(false)
      table.uuid('salon_id').nullable().references('id').inTable('salons').onDelete('SET NULL')

      // Instagram scraping fields
      table.boolean('is_verified').defaultTo(false)
      table.enum('verification_status', ['scraped', 'contacted', 'onboarding', 'verified']).defaultTo('scraped')
      table.string('instagram_handle').nullable()
      table.string('instagram_url').nullable()
      table.integer('instagram_followers').nullable()
      table.timestamp('last_scraped_at').nullable()
      table.enum('data_source', ['instagram_scraping', 'manual_registration']).defaultTo('instagram_scraping')
      table.string('verification_token').nullable()
      table.timestamp('verified_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['instagram_handle'])
      table.index(['verification_status'])
      table.index(['is_verified'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}