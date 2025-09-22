import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tag_tattoo'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE')
      table.uuid('tattoo_id').notNullable().references('id').inTable('tattoos').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['tag_id', 'tattoo_id'])
      table.index(['tag_id'])
      table.index(['tattoo_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}