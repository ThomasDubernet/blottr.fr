import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tag_tattoos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Composite primary key
      table.increments('id')
      table.integer('tag_id').unsigned().notNullable()
      table.uuid('tattoo_id').notNullable()

      // Relationship metadata
      table.decimal('relevance_score', 3, 2).defaultTo(1.0).index() // 0.0-1.0 relevance
      table.boolean('is_primary').defaultTo(false) // Main tag for this tattoo
      table.enu('assignment_type', ['manual', 'auto', 'ai_suggested']).defaultTo('manual')

      // Quality control
      table.boolean('is_approved').defaultTo(true)
      table.string('approved_by').nullable()
      table.text('approval_notes').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      // Foreign key constraints
      table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE')
      table.foreign('tattoo_id').references('id').inTable('tattoos').onDelete('CASCADE')

      // Unique constraint
      table.unique(['tag_id', 'tattoo_id'])

      // Performance indexes
      table.index(['tattoo_id', 'is_primary'])
      table.index(['tag_id', 'relevance_score'])
      table.index(['is_approved', 'relevance_score'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
