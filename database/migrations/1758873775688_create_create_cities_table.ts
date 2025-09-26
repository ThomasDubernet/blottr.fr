import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Basic city information
      table.string('name', 100).notNullable()
      table.string('slug', 100).notNullable().unique()
      table.string('postal_code', 10).notNullable()
      table.string('insee_code', 10).notNullable().unique()

      // Geographic data
      table.decimal('latitude', 10, 8).notNullable()
      table.decimal('longitude', 11, 8).notNullable()
      table.integer('population').nullable()
      table.decimal('area', 8, 2).nullable().comment('Area in km²')

      // Administrative division
      table.string('department_code', 3).notNullable()
      table.string('department_name', 100).notNullable()
      table.string('region_code', 2).notNullable()
      table.string('region_name', 100).notNullable()

      // SEO and metadata
      table.text('description').nullable()
      table.string('meta_title').nullable()
      table.text('meta_description').nullable()
      table.json('seo_keywords').nullable()

      // Status and visibility
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('is_featured').notNullable().defaultTo(false)
      table
        .integer('priority')
        .notNullable()
        .defaultTo(100)
        .comment('Lower number = higher priority')

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Indexes for performance
      table.index(['slug'])
      table.index(['postal_code'])
      table.index(['insee_code'])
      table.index(['department_code'])
      table.index(['region_code'])
      table.index(['is_active'])
      table.index(['is_featured'])
      table.index(['priority'])
      table.index(['latitude', 'longitude'])
      table.index(['name'])

      // Constraints
      table.check('latitude >= -90 AND latitude <= 90', [], 'cities_latitude_check')
      table.check('longitude >= -180 AND longitude <= 180', [], 'cities_longitude_check')
      table.check('population >= 0', [], 'cities_population_check')
      table.check('area >= 0', [], 'cities_area_check')
      table.check('priority >= 0', [], 'cities_priority_check')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
