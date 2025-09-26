import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_inquiries'

  async up() {
    // Add performance optimization indexes to existing contact_inquiries table
    this.schema.alterTable(this.tableName, (table) => {
      // Composite indexes for common query patterns
      table.index(['status', 'created_at'], 'idx_contact_inquiries_status_created')
      table.index(['artist_id', 'created_at'], 'idx_contact_inquiries_artist_created')
      table.index(['project_type', 'status'], 'idx_contact_inquiries_project_status')
      table.index(['is_read', 'priority', 'created_at'], 'idx_contact_inquiries_read_priority_created')

      // Partial indexes for performance (PostgreSQL specific)
      // Index only unread inquiries
      this.raw(`
        CREATE INDEX CONCURRENTLY idx_contact_inquiries_unread_pending
        ON contact_inquiries (created_at DESC, priority DESC)
        WHERE is_read = false AND status = 'pending'
      `)

      // Index for urgent inquiries
      this.raw(`
        CREATE INDEX CONCURRENTLY idx_contact_inquiries_urgent
        ON contact_inquiries (created_at DESC)
        WHERE priority >= 8 OR project_type = 'appointment'
      `)

      // Index for recent inquiries (performance optimization)
      this.raw(`
        CREATE INDEX CONCURRENTLY idx_contact_inquiries_recent
        ON contact_inquiries (created_at DESC)
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `)

      // Full-text search index for subject and message
      this.raw(`
        CREATE INDEX CONCURRENTLY idx_contact_inquiries_fulltext
        ON contact_inquiries
        USING gin(to_tsvector('french', subject || ' ' || message))
      `)

      // JSON indexes for metadata and tattoo styles
      this.raw(`
        CREATE INDEX CONCURRENTLY idx_contact_inquiries_tattoo_styles
        ON contact_inquiries
        USING gin(tattoo_styles)
        WHERE tattoo_styles IS NOT NULL
      `)

      this.raw(`
        CREATE INDEX CONCURRENTLY idx_contact_inquiries_metadata
        ON contact_inquiries
        USING gin(metadata)
        WHERE metadata IS NOT NULL
      `)
    })

    // Add statistics targets for better query planning
    this.raw(`
      ALTER TABLE contact_inquiries
      ALTER COLUMN status SET STATISTICS 1000,
      ALTER COLUMN project_type SET STATISTICS 1000,
      ALTER COLUMN priority SET STATISTICS 1000,
      ALTER COLUMN artist_id SET STATISTICS 1000
    `)

    // Create materialized view for analytics
    this.raw(`
      CREATE MATERIALIZED VIEW contact_inquiries_stats AS
      SELECT
        DATE_TRUNC('day', created_at) as day,
        status,
        project_type,
        COUNT(*) as inquiry_count,
        AVG(priority) as avg_priority,
        COUNT(CASE WHEN artist_id IS NOT NULL THEN 1 END) as with_artist_count
      FROM contact_inquiries
      WHERE created_at >= NOW() - INTERVAL '90 days'
      GROUP BY DATE_TRUNC('day', created_at), status, project_type
      ORDER BY day DESC
    `)

    // Create index on materialized view
    this.raw(`
      CREATE UNIQUE INDEX idx_contact_inquiries_stats_day_status_type
      ON contact_inquiries_stats (day, status, project_type)
    `)
  }

  async down() {
    // Drop materialized view
    this.raw('DROP MATERIALIZED VIEW IF EXISTS contact_inquiries_stats')

    // Drop custom indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['status', 'created_at'], 'idx_contact_inquiries_status_created')
      table.dropIndex(['artist_id', 'created_at'], 'idx_contact_inquiries_artist_created')
      table.dropIndex(['project_type', 'status'], 'idx_contact_inquiries_project_status')
      table.dropIndex(['is_read', 'priority', 'created_at'], 'idx_contact_inquiries_read_priority_created')
    })

    // Drop partial and specialized indexes
    this.raw('DROP INDEX IF EXISTS idx_contact_inquiries_unread_pending')
    this.raw('DROP INDEX IF EXISTS idx_contact_inquiries_urgent')
    this.raw('DROP INDEX IF EXISTS idx_contact_inquiries_recent')
    this.raw('DROP INDEX IF EXISTS idx_contact_inquiries_fulltext')
    this.raw('DROP INDEX IF EXISTS idx_contact_inquiries_tattoo_styles')
    this.raw('DROP INDEX IF EXISTS idx_contact_inquiries_metadata')

    // Reset statistics targets
    this.raw(`
      ALTER TABLE contact_inquiries
      ALTER COLUMN status SET STATISTICS -1,
      ALTER COLUMN project_type SET STATISTICS -1,
      ALTER COLUMN priority SET STATISTICS -1,
      ALTER COLUMN artist_id SET STATISTICS -1
    `)
  }
}