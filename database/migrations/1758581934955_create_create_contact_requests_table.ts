import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('client_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('artist_id').notNullable().references('id').inTable('artists').onDelete('CASCADE')
      table.text('message').nullable()
      table.enum('status', ['pending', 'artist_contacted', 'artist_responded', 'completed']).defaultTo('pending')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['client_id'])
      table.index(['artist_id'])
      table.index(['status'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}