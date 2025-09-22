import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tattoos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('artist_id').notNullable().references('id').inTable('artists').onDelete('CASCADE')
      table.uuid('salon_id').nullable().references('id').inTable('salons').onDelete('SET NULL')
      table.text('photo').nullable()
      table.text('description').nullable()
      table.boolean('is_flash').defaultTo(false)
      table.integer('price').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['artist_id'])
      table.index(['salon_id'])
      table.index(['is_flash'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}