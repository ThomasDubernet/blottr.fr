import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateArtistsTable extends BaseSchema {
  protected tableName = 'artists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // User relationship - one user can be one artist
      table.integer('user_id').unsigned().notNullable().unique()

      // Professional information
      table.string('stage_name').notNullable() // Professional name for display
      table.string('slug').notNullable().unique()
      table.text('bio').nullable()
      table.string('short_bio', 200).nullable()
      table.text('specialty').nullable() // Art styles specialization

      // Professional status and experience
      table.integer('years_experience').nullable()
      table.date('started_tattooing_at').nullable()
      table.enu('experience_level', ['beginner', 'intermediate', 'advanced', 'expert']).defaultTo('intermediate')
      table.json('art_styles').nullable() // Array of art styles: realism, traditional, etc.

      // Location and primary salon
      table.integer('city_id').unsigned().notNullable()
      table.uuid('primary_salon_id').nullable() // Main salon where they work

      // Availability and booking
      table.boolean('accepts_bookings').defaultTo(true)
      table.boolean('appointment_only').defaultTo(true)
      table.decimal('min_price', 8, 2).nullable()
      table.decimal('max_price', 8, 2).nullable()
      table.string('currency', 3).defaultTo('EUR')
      table.json('availability').nullable() // Working days and hours

      // Portfolio and social presence
      table.json('portfolio_images').nullable() // Array of portfolio image URLs
      table.string('instagram_handle').nullable()
      table.string('instagram_url').nullable()
      table.string('website').nullable()
      table.json('social_links').nullable() // Other social media links

      // Verification system
      table.enu('verification_status', ['unverified', 'scraped', 'contacted', 'onboarding', 'verified']).defaultTo('unverified')
      table.timestamp('verified_at').nullable()
      table.string('verified_by').nullable() // Admin who verified
      table.text('verification_notes').nullable()
      table.json('verification_documents').nullable() // Store document references

      // Professional credentials
      table.boolean('has_health_certificate').defaultTo(false)
      table.boolean('has_professional_insurance').defaultTo(false)
      table.date('health_certificate_expires_at').nullable()
      table.text('certifications').nullable()

      // Status and visibility
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_featured').defaultTo(false)
      table.boolean('is_accepting_new_clients').defaultTo(true)
      table.integer('priority').defaultTo(0) // For search ordering

      // Performance metrics
      table.decimal('average_rating', 3, 2).nullable()
      table.integer('total_reviews').defaultTo(0)
      table.integer('total_tattoos').defaultTo(0)
      table.integer('profile_views').defaultTo(0)
      table.timestamp('last_activity_at').nullable()

      // SEO and metadata
      table.string('meta_title').nullable()
      table.text('meta_description').nullable()
      table.json('seo_keywords').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      // Foreign key constraints
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('city_id').references('id').inTable('cities').onDelete('RESTRICT')
      table.foreign('primary_salon_id').references('id').inTable('salons').onDelete('SET NULL')

      // Indexes for performance
      table.index('slug')
      table.index('user_id')
      table.index('city_id')
      table.index('primary_salon_id')
      table.index(['city_id', 'is_active'])
      table.index(['verification_status', 'is_active'])
      table.index(['is_active', 'is_featured', 'priority'])
      table.index(['is_accepting_new_clients', 'is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}