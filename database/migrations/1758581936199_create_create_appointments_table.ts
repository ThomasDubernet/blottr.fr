import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('client_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('artist_id').notNullable().references('id').inTable('artists').onDelete('CASCADE')
      table.uuid('salon_id').nullable().references('id').inTable('salons').onDelete('SET NULL')
      table.timestamp('appointment_date').notNullable()
      table.integer('duration').nullable() // minutes
      table.enum('status', ['pending', 'confirmed', 'completed', 'cancelled']).defaultTo('pending')
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['client_id'])
      table.index(['artist_id'])
      table.index(['salon_id'])
      table.index(['status'])
      table.index(['appointment_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}