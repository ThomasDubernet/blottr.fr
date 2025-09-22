import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artist_onboarding'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('artist_id').notNullable().references('id').inTable('artists').onDelete('CASCADE')
      table.string('contact_email').nullable()
      table.integer('contact_attempts').defaultTo(0)
      table.timestamp('last_contact_at').nullable()
      table.string('onboarding_link').nullable()
      table.enum('status', ['pending', 'email_sent', 'clicked', 'completed', 'failed']).defaultTo('pending')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['artist_id'])
      table.index(['status'])
      table.index(['contact_email'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}