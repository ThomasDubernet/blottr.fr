import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tattoos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Artist relationship
      table.uuid('artist_id').notNullable().index()

      // Content metadata
      table.string('title').notNullable()
      table.text('description').nullable()
      table.string('slug').notNullable().unique()

      // Media handling
      table.string('original_filename').notNullable()
      table.string('storage_path').notNullable()
      table.json('image_variants').notNullable() // thumbnail, medium, large, original
      table.string('primary_color').nullable() // For visual search
      table.integer('file_size').notNullable()
      table.json('dimensions').notNullable() // width, height, aspect_ratio
      table.string('content_type', 50).defaultTo('image/jpeg')
      table.string('content_hash', 64).nullable() // SHA256 for duplicate detection

      // Tattoo characteristics
      table
        .enu('tattoo_style', [
          'traditional',
          'neo_traditional',
          'realistic',
          'black_and_grey',
          'watercolor',
          'geometric',
          'minimalist',
          'japanese',
          'tribal',
          'biomechanical',
          'portrait',
          'abstract',
          'dotwork',
          'linework',
        ])
        .nullable()
        .index()

      table
        .enu('body_placement', [
          'arm',
          'leg',
          'back',
          'chest',
          'shoulder',
          'hand',
          'foot',
          'neck',
          'face',
          'torso',
          'ribs',
          'thigh',
          'calf',
          'forearm',
        ])
        .nullable()
        .index()

      table.enu('size_category', ['small', 'medium', 'large', 'full_piece']).nullable().index()
      table.enu('color_type', ['black_and_grey', 'color', 'single_color']).nullable().index()
      table.integer('session_count').nullable() // How many sessions needed
      table.decimal('estimated_hours', 4, 1).nullable()

      // Status and visibility
      table
        .enu('status', ['draft', 'pending_review', 'published', 'archived'])
        .defaultTo('draft')
        .index()
      table.boolean('is_featured').defaultTo(false).index()
      table.boolean('is_portfolio_highlight').defaultTo(false).index()
      table.integer('display_order').defaultTo(0).index()

      // Performance metrics
      table.integer('view_count').defaultTo(0)
      table.integer('like_count').defaultTo(0)
      table.integer('share_count').defaultTo(0)
      table.decimal('engagement_score', 5, 2).defaultTo(0).index() // Calculated score

      // Content management
      table.boolean('allows_inquiries').defaultTo(true)
      table.boolean('shows_pricing').defaultTo(false)
      table.decimal('price_estimate', 8, 2).nullable()
      table.string('price_currency', 3).defaultTo('EUR')

      // SEO and discovery
      table.json('alt_text').nullable() // Multi-language alt text
      table.json('search_keywords').nullable() // Auto-extracted + manual
      table.string('meta_title').nullable()
      table.text('meta_description').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
      table.timestamp('published_at').nullable()

      // Foreign key constraints
      table.foreign('artist_id').references('id').inTable('artists').onDelete('CASCADE')

      // Performance indexes
      table.index(['artist_id', 'status'])
      table.index(['status', 'is_featured', 'published_at'])
      table.index(['tattoo_style', 'status'])
      table.index(['body_placement', 'size_category'])
      table.index(['engagement_score', 'published_at'])
      table.index(['created_at', 'status']) // For recent uploads
      table.index(['content_hash']) // For duplicate detection

      // Full-text search index
      table.index(['title', 'description']) // Composite for search
    })

    // Add full-text search capability
    this.defer(async (db) => {
      await db.raw(`
        CREATE INDEX tattoos_search_idx ON tattoos
        USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')))
      `)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
