import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateSalonsTable extends BaseSchema {
  protected tableName = 'salons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Basic salon information
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.string('short_description', 200).nullable()

      // Contact information
      table.string('email').nullable()
      table.string('phone', 20).nullable()
      table.string('website').nullable()

      // Address and location
      table.integer('city_id').unsigned().notNullable()
      table.string('address').notNullable()
      table.string('postal_code', 10).notNullable()
      table.decimal('latitude', 10, 8).nullable()
      table.decimal('longitude', 11, 8).nullable()

      // Business information
      table.json('opening_hours').nullable() // Store structured opening hours
      table.json('services').nullable() // Store list of services offered
      table.decimal('price_range_min', 8, 2).nullable()
      table.decimal('price_range_max', 8, 2).nullable()
      table.string('currency', 3).defaultTo('EUR')

      // Social media and online presence
      table.string('instagram_handle').nullable()
      table.string('facebook_url').nullable()
      table.string('tiktok_handle').nullable()
      table.json('gallery_images').nullable() // Array of image URLs

      // Verification and status
      table
        .enu('verification_status', [
          'unverified',
          'scraped',
          'contacted',
          'onboarding',
          'verified',
        ])
        .defaultTo('unverified')
      table.timestamp('verified_at').nullable()
      table.string('verified_by').nullable() // Admin who verified
      table.text('verification_notes').nullable()

      // Business status and visibility
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_featured').defaultTo(false)
      table.boolean('accepts_walk_ins').defaultTo(false)
      table.boolean('appointment_required').defaultTo(true)
      table.integer('priority').defaultTo(0) // For search ordering

      // SEO and metadata
      table.string('meta_title').nullable()
      table.text('meta_description').nullable()
      table.json('seo_keywords').nullable()

      // Business metrics
      table.decimal('average_rating', 3, 2).nullable()
      table.integer('total_reviews').defaultTo(0)
      table.integer('total_artists').defaultTo(0)
      table.timestamp('last_activity_at').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      // Foreign key constraint
      table.foreign('city_id').references('id').inTable('cities').onDelete('RESTRICT')

      // Indexes for performance
      table.index('slug')
      table.index('city_id')
      table.index(['city_id', 'is_active'])
      table.index(['verification_status', 'is_active'])
      table.index(['is_active', 'is_featured', 'priority'])
      table.index(['latitude', 'longitude']) // For geographic searches
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
