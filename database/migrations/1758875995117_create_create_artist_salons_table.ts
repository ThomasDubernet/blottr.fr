import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateArtistSalonsTable extends BaseSchema {
  protected tableName = 'artist_salons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Composite primary key
      table.increments('id')

      // Foreign keys
      table.uuid('artist_id').notNullable()
      table.uuid('salon_id').notNullable()

      // Relationship type and status
      table.enu('relationship_type', ['primary', 'guest', 'freelance']).defaultTo('guest')
      table.boolean('is_active').defaultTo(true)

      // Schedule and availability at this salon
      table.json('schedule').nullable() // Days/hours when artist works here
      table.decimal('hourly_rate', 8, 2).nullable()
      table.decimal('commission_rate', 5, 2).nullable() // Percentage (0-100)

      // Relationship details
      table.date('started_working_at').nullable()
      table.date('ended_working_at').nullable()
      table.text('notes').nullable()

      // Permissions and access
      table.boolean('can_book_appointments').defaultTo(true)
      table.boolean('can_manage_schedule').defaultTo(false)
      table.boolean('has_salon_key').defaultTo(false)

      // Timestamps with pivot support
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      // Foreign key constraints
      table.foreign('artist_id').references('id').inTable('artists').onDelete('CASCADE')
      table.foreign('salon_id').references('id').inTable('salons').onDelete('CASCADE')

      // Unique constraint to prevent duplicate relationships
      table.unique(['artist_id', 'salon_id'])

      // Indexes for performance
      table.index('artist_id')
      table.index('salon_id')
      table.index(['artist_id', 'is_active'])
      table.index(['salon_id', 'is_active'])
      table.index(['relationship_type', 'is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}