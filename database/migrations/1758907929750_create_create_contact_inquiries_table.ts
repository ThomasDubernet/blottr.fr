import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_inquiries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Contact Information
      table.string('full_name', 100).notNullable()
      table.string('email', 255).notNullable()
      table.string('phone', 50).nullable()
      table.string('subject', 200).notNullable()
      table.text('message').notNullable()

      // Project Details
      table.enum('project_type', ['consultation', 'quote', 'appointment', 'question']).notNullable()
      table.string('budget', 50).nullable()
      table.string('preferred_date', 100).nullable()
      table.string('location', 200).nullable()
      table.json('tattoo_styles').nullable()
      table.string('size', 50).nullable()
      table.string('placement', 100).nullable()
      table.boolean('has_existing_tattoos').defaultTo(false)
      table.json('reference_images').nullable()

      // Relationships
      table.uuid('artist_id').nullable().references('artists.id').onDelete('set null')
      table.uuid('tattoo_id').nullable().references('tattoos.id').onDelete('set null')

      // Status and Tracking
      table.enum('status', ['pending', 'in_progress', 'replied', 'closed', 'spam']).defaultTo('pending')
      table.enum('source', ['website', 'quick_form', 'social_media', 'referral']).defaultTo('website')
      table.integer('priority').defaultTo(3).checkBetween([1, 10])
      table.boolean('is_read').defaultTo(false)
      table.boolean('is_starred').defaultTo(false)

      // Technical Fields
      table.string('ip_address', 45).nullable()
      table.string('user_agent', 500).nullable()
      table.json('metadata').nullable()

      // Response Tracking
      table.timestamp('first_replied_at').nullable()
      table.timestamp('last_replied_at').nullable()
      table.integer('replies_count').defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Indexes
      table.index(['artist_id', 'status'])
      table.index(['status', 'priority'])
      table.index(['created_at'])
      table.index(['email'])
      table.index(['is_read', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}