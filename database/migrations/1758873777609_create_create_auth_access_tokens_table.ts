import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Token data
      table.integer('tokenable_id').notNullable().unsigned()
      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash').notNullable().unique()
      table.text('abilities').notNullable()

      // Token metadata
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Foreign key to users table
      table.foreign('tokenable_id').references('id').inTable('users').onDelete('CASCADE')

      // Indexes for performance
      table.index(['tokenable_id'])
      table.index(['hash'])
      table.index(['type'])
      table.index(['expires_at'])
      table.index(['last_used_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
