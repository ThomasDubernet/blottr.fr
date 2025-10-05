import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rate_limits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('key').notNullable().primary()
      table.integer('points').notNullable().defaultTo(0)
      table.bigInteger('expire').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}