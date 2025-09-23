import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Add missing fields to artists table
    this.schema.alterTable('artists', (table) => {
      // SEO & Display
      table.string('slug').unique().nullable()
      table.text('seo_description').nullable()
      table.string('seo_title').nullable()

      // Business logic
      table.boolean('is_claimed').defaultTo(false)
      table.boolean('editor_pick').defaultTo(false)

      // Geographic reference
      table.uuid('city_id').nullable().references('id').inTable('cities').onDelete('SET NULL')

      // Analytics (post-MVP)
      table.integer('view_count').defaultTo(0)
      table.integer('favorite_count').defaultTo(0)
      table.integer('contact_count').defaultTo(0)

      // GPT Analysis (manual for now, auto post-MVP)
      table.text('gpt_bio').nullable()
      table.json('gpt_styles').nullable()
      table.boolean('gpt_analyzed').defaultTo(false)
      table.timestamp('gpt_analyzed_at').nullable()
    })

    // Add missing fields to salons table
    this.schema.alterTable('salons', (table) => {
      // SEO & Display
      table.string('slug').unique().nullable()
      table.text('seo_description').nullable()
      table.string('seo_title').nullable()

      // Business logic
      table.boolean('is_verified').defaultTo(false)
      table.boolean('editor_pick').defaultTo(false)

      // Geographic reference
      table.uuid('city_id').nullable().references('id').inTable('cities').onDelete('SET NULL')

      // Analytics (post-MVP)
      table.integer('view_count').defaultTo(0)
      table.integer('contact_count').defaultTo(0)

      // Additional contact info
      table.string('website').nullable()
      table.json('social_links').nullable() // {facebook: '', instagram: '', etc}
    })

    // Add missing fields to shops table
    this.schema.alterTable('shops', (table) => {
      // SEO & Display
      table.string('slug').unique().nullable()

      // Geographic reference
      table.uuid('city_id').nullable().references('id').inTable('cities').onDelete('SET NULL')

      // Business logic
      table.boolean('is_active').defaultTo(true)

      // Analytics (post-MVP)
      table.integer('view_count').defaultTo(0)
    })

    // Add missing fields to tattoos table
    this.schema.alterTable('tattoos', (table) => {
      // SEO & Display
      table.string('slug').unique().nullable()
      table.text('alt_text').nullable() // For image accessibility

      // Business logic
      table.boolean('is_featured').defaultTo(false)
      table.boolean('is_visible').defaultTo(true)

      // Analytics (post-MVP)
      table.integer('view_count').defaultTo(0)
      table.integer('like_count').defaultTo(0)

      // Instagram specific
      table.string('instagram_post_url').nullable()
      table.timestamp('instagram_posted_at').nullable()
    })

    // Add missing fields to users table
    this.schema.alterTable('users', (table) => {
      // Profile completion
      table.string('phone').nullable()
      table.date('birth_date').nullable()
      table.string('gender').nullable()

      // Geographic preference
      table.uuid('preferred_city_id').nullable().references('id').inTable('cities').onDelete('SET NULL')

      // Analytics (post-MVP)
      table.timestamp('last_activity_at').nullable()
      table.integer('tattoo_view_count').defaultTo(0)
      table.integer('artist_contact_count').defaultTo(0)

      // Preferences
      table.json('style_preferences').nullable() // Array of preferred styles
      table.json('notification_preferences').nullable() // Email/SMS notification settings
    })

    // Add missing fields to tags table
    this.schema.alterTable('tags', (table) => {
      table.string('slug').unique().nullable()
      // category already exists in the table
      table.integer('usage_count').defaultTo(0)
      table.boolean('is_featured').defaultTo(false)
    })

    // Add missing fields to appointments table
    this.schema.alterTable('appointments', (table) => {
      table.uuid('shop_id').nullable().references('id').inTable('shops').onDelete('SET NULL')
      table.decimal('price', 10, 2).nullable()
      table.string('payment_status').nullable() // 'pending', 'paid', 'refunded'
      table.text('client_notes').nullable()
      table.text('artist_notes').nullable()
      table.json('reminder_sent').nullable() // Track which reminders were sent
    })

    // Add missing fields to contact_requests table
    this.schema.alterTable('contact_requests', (table) => {
      table.string('preferred_contact_method').nullable() // 'email', 'phone', 'instagram'
      table.json('availability').nullable() // Client's available time slots
      table.decimal('budget_min', 10, 2).nullable()
      table.decimal('budget_max', 10, 2).nullable()
      table.string('urgency').nullable() // 'asap', 'this_month', 'flexible'
    })
  }

  async down() {
    // Remove fields from artists table
    this.schema.alterTable('artists', (table) => {
      table.dropColumn('slug')
      table.dropColumn('seo_description')
      table.dropColumn('seo_title')
      table.dropColumn('is_claimed')
      table.dropColumn('editor_pick')
      table.dropColumn('city_id')
      table.dropColumn('view_count')
      table.dropColumn('favorite_count')
      table.dropColumn('contact_count')
      table.dropColumn('gpt_bio')
      table.dropColumn('gpt_styles')
      table.dropColumn('gpt_analyzed')
      table.dropColumn('gpt_analyzed_at')
    })

    // Remove fields from salons table
    this.schema.alterTable('salons', (table) => {
      table.dropColumn('slug')
      table.dropColumn('seo_description')
      table.dropColumn('seo_title')
      table.dropColumn('is_verified')
      table.dropColumn('editor_pick')
      table.dropColumn('city_id')
      table.dropColumn('view_count')
      table.dropColumn('contact_count')
      table.dropColumn('website')
      table.dropColumn('social_links')
    })

    // Remove fields from shops table
    this.schema.alterTable('shops', (table) => {
      table.dropColumn('slug')
      table.dropColumn('city_id')
      table.dropColumn('is_active')
      table.dropColumn('view_count')
    })

    // Remove fields from tattoos table
    this.schema.alterTable('tattoos', (table) => {
      table.dropColumn('slug')
      table.dropColumn('alt_text')
      table.dropColumn('is_featured')
      table.dropColumn('is_visible')
      table.dropColumn('view_count')
      table.dropColumn('like_count')
      table.dropColumn('instagram_post_url')
      table.dropColumn('instagram_posted_at')
    })

    // Remove fields from users table
    this.schema.alterTable('users', (table) => {
      table.dropColumn('phone')
      table.dropColumn('birth_date')
      table.dropColumn('gender')
      table.dropColumn('preferred_city_id')
      table.dropColumn('last_activity_at')
      table.dropColumn('tattoo_view_count')
      table.dropColumn('artist_contact_count')
      table.dropColumn('style_preferences')
      table.dropColumn('notification_preferences')
    })

    // Remove fields from tags table
    this.schema.alterTable('tags', (table) => {
      table.dropColumn('slug')
      // category was already in table, don't drop it
      table.dropColumn('usage_count')
      table.dropColumn('is_featured')
    })

    // Remove fields from appointments table
    this.schema.alterTable('appointments', (table) => {
      table.dropColumn('shop_id')
      table.dropColumn('price')
      table.dropColumn('payment_status')
      table.dropColumn('client_notes')
      table.dropColumn('artist_notes')
      table.dropColumn('reminder_sent')
    })

    // Remove fields from contact_requests table
    this.schema.alterTable('contact_requests', (table) => {
      table.dropColumn('preferred_contact_method')
      table.dropColumn('availability')
      table.dropColumn('budget_min')
      table.dropColumn('budget_max')
      table.dropColumn('urgency')
    })
  }
}