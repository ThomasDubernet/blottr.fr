import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artist_salon'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('artist_id').notNullable().references('id').inTable('artists').onDelete('CASCADE')
      table.uuid('salon_id').notNullable().references('id').inTable('salons').onDelete('CASCADE')
      table.boolean('is_primary').defaultTo(false)
      table.boolean('is_guest').defaultTo(false)
      table.timestamp('start_date').nullable()
      table.timestamp('end_date').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['artist_id', 'salon_id'])
      table.index(['artist_id'])
      table.index(['salon_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
