import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.increments('id')

      // Tag identification
      table.string('name').notNullable().unique()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()

      // Categorization
      table
        .enu('category', [
          'style',
          'subject',
          'body_part',
          'color',
          'size',
          'technique',
          'mood',
          'cultural',
          'custom',
        ])
        .notNullable()
        .index()

      table.integer('parent_tag_id').nullable() // For hierarchical tags
      table.integer('level').defaultTo(0).index() // Hierarchy level

      // Visual and UX
      table.string('color_code', 7).nullable() // Hex color for UI
      table.string('icon_name').nullable() // Icon identifier
      table.integer('display_order').defaultTo(0)

      // Usage and popularity
      table.integer('usage_count').defaultTo(0).index()
      table.boolean('is_featured').defaultTo(false).index()
      table.boolean('is_trending').defaultTo(false).index()
      table.decimal('popularity_score', 5, 2).defaultTo(0).index()

      // Content curation
      table.boolean('requires_approval').defaultTo(false)
      table.boolean('is_approved').defaultTo(true)
      table.string('created_by').nullable() // User who created tag
      table.string('approved_by').nullable() // Admin who approved

      // Localization
      table.json('translations').nullable() // Multi-language support

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      // Foreign keys
      table.foreign('parent_tag_id').references('id').inTable('tags').onDelete('SET NULL')

      // Performance indexes
      table.index(['category', 'is_approved'])
      table.index(['usage_count', 'is_approved'])
      table.index(['popularity_score', 'category'])
      table.index(['is_trending', 'category'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
