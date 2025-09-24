import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shops'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('name').notNullable()
      table.string('contact_email').nullable()
      table.string('phone').nullable()
      table.string('street').nullable()
      table.string('city').nullable()
      table.string('zip').nullable()
      table.string('country').nullable()
      table.text('description').nullable()
      table.boolean('lgbtq_friendly').defaultTo(false)
      table.text('logo').nullable()
      table.boolean('is_private').defaultTo(false)
      table.string('type').nullable()
      table.string('google_client_id').nullable()
      table.string('google_place_id').nullable()
      table.integer('google_reviews_count').nullable()
      table.string('google_reviews_total_score').nullable()
      table.string('website').nullable()
      table.string('insta_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
