import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Core fields
      table.string('name').notNullable().index()
      table.string('slug').unique().notNullable()
      table.string('department').notNullable()
      table.string('region').notNullable()
      table.string('country').notNullable().defaultTo('FR')

      // Geographic data
      table.decimal('latitude', 10, 8).nullable()
      table.decimal('longitude', 11, 8).nullable()
      table.string('postal_code').nullable()

      // SEO fields
      table.text('seo_description').nullable()
      table.string('seo_title').nullable()

      // Stats (will be computed later)
      table.integer('artist_count').defaultTo(0)
      table.integer('salon_count').defaultTo(0)
      table.integer('tattoo_count').defaultTo(0)

      table.timestamps(true, true)

      // Indexes for search performance
      table.index(['country', 'region'])
      table.index(['country', 'department'])
      table.index(['latitude', 'longitude'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}