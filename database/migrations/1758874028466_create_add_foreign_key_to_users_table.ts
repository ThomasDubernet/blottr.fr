import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add foreign key constraint to cities table
      table.foreign('city_id').references('id').inTable('cities').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop foreign key constraint
      table.dropForeign(['city_id'])
    })
  }
}