import Database from '@adonisjs/lucid/services/db'
import ContactInquiry, { InquiryStatus, ProjectType } from '#models/contact_inquiry'
import { DateTime } from 'luxon'

export interface QueryPerformanceStats {
  query: string
  avgTime: number
  callCount: number
  slowQueries: number
  lastExecution: DateTime
}

export interface DatabaseHealth {
  connectionCount: number
  activeQueries: number
  slowQueries: QueryPerformanceStats[]
  indexUsage: Array<{
    table: string
    index: string
    usage: number
  }>
  tableStats: Array<{
    table: string
    size: string
    rows: number
    deadTuples: number
  }>
}

export default class DatabaseOptimizationService {
  private static instance: DatabaseOptimizationService
  private queryCache = new Map<string, { result: any; timestamp: DateTime; ttl: number }>()

  private constructor() {}

  public static getInstance(): DatabaseOptimizationService {
    if (!DatabaseOptimizationService.instance) {
      DatabaseOptimizationService.instance = new DatabaseOptimizationService()
    }
    return DatabaseOptimizationService.instance
  }

  /**
   * Get optimized contact inquiries with intelligent caching
   */
  async getInquiriesOptimized(options: {
    status?: InquiryStatus[]
    projectType?: ProjectType[]
    artistId?: string
    isRead?: boolean
    priority?: { min?: number; max?: number }
    limit?: number
    offset?: number
    searchTerm?: string
  }) {
    const cacheKey = this.generateCacheKey('inquiries', options)
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached
    }

    let query = ContactInquiry.query()

    // Use optimized indexes based on query patterns
    if (options.status && options.status.length > 0) {
      query = query.whereIn('status', options.status)
    }

    if (options.projectType && options.projectType.length > 0) {
      query = query.whereIn('project_type', options.projectType)
    }

    if (options.artistId) {
      query = query.where('artist_id', options.artistId)
    }

    if (options.isRead !== undefined) {
      query = query.where('is_read', options.isRead)
    }

    if (options.priority) {
      if (options.priority.min) {
        query = query.where('priority', '>=', options.priority.min)
      }
      if (options.priority.max) {
        query = query.where('priority', '<=', options.priority.max)
      }
    }

    // Full-text search using optimized GIN index
    if (options.searchTerm) {
      query = query.whereRaw(
        `to_tsvector('french', subject || ' ' || message) @@ plainto_tsquery('french', ?)`,
        [options.searchTerm]
      )
    }

    // Optimize ordering based on available indexes
    if (options.isRead === false && (!options.status || options.status.includes(InquiryStatus.PENDING))) {
      // Use optimized partial index for unread pending inquiries
      query = query.orderBy('priority', 'desc').orderBy('created_at', 'asc')
    } else {
      query = query.orderBy('created_at', 'desc')
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit)
    }
    if (options.offset) {
      query = query.offset(options.offset)
    }

    const result = await query.exec()

    // Cache result for 5 minutes
    this.setCache(cacheKey, result, 300)

    return result
  }

  /**
   * Get urgent inquiries using optimized partial index
   */
  async getUrgentInquiries() {
    const cacheKey = 'urgent-inquiries'
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached
    }

    // This query uses the idx_contact_inquiries_urgent partial index
    const result = await ContactInquiry.query()
      .where((query) => {
        query.where('priority', '>=', 8)
             .orWhere('project_type', ProjectType.APPOINTMENT)
      })
      .where('status', InquiryStatus.PENDING)
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'asc')
      .limit(20)
      .exec()

    // Cache for 1 minute (urgent data should be fresh)
    this.setCache(cacheKey, result, 60)

    return result
  }

  /**
   * Get analytics from materialized view
   */
  async getInquiryAnalytics(days: number = 30) {
    const cacheKey = `analytics-${days}`
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached
    }

    const result = await Database.rawQuery(`
      SELECT * FROM contact_inquiries_stats
      WHERE day >= NOW() - INTERVAL '${days} days'
      ORDER BY day DESC
    `)

    // Cache analytics for 1 hour
    this.setCache(cacheKey, result.rows, 3600)

    return result.rows
  }

  /**
   * Refresh materialized view for analytics
   */
  async refreshAnalytics() {
    await Database.rawQuery('REFRESH MATERIALIZED VIEW CONCURRENTLY contact_inquiries_stats')

    // Clear related cache
    for (const key of this.queryCache.keys()) {
      if (key.startsWith('analytics-')) {
        this.queryCache.delete(key)
      }
    }
  }

  /**
   * Get database health metrics
   */
  async getDatabaseHealth(): Promise<DatabaseHealth> {
    const [connectionStats, activityStats, indexUsage, tableStats] = await Promise.all([
      this.getConnectionStats(),
      this.getActivityStats(),
      this.getIndexUsage(),
      this.getTableStats(),
    ])

    return {
      connectionCount: connectionStats.totalConnections,
      activeQueries: activityStats.activeQueries,
      slowQueries: await this.getSlowQueries(),
      indexUsage,
      tableStats,
    }
  }

  /**
   * Optimize database performance
   */
  async optimizeDatabase() {
    const optimizations = []

    // Analyze table statistics
    await Database.rawQuery('ANALYZE contact_inquiries')
    optimizations.push('Table statistics updated')

    // Refresh materialized view
    await this.refreshAnalytics()
    optimizations.push('Analytics materialized view refreshed')

    // Clean up expired cache entries
    this.cleanExpiredCache()
    optimizations.push('Query cache cleaned')

    // Suggest vacuum if needed
    const tableStats = await this.getTableStats()
    const contactInquiriesStats = tableStats.find(t => t.table === 'contact_inquiries')

    if (contactInquiriesStats && contactInquiriesStats.deadTuples > 1000) {
      optimizations.push('VACUUM suggested for contact_inquiries table')
    }

    return optimizations
  }

  // Private helper methods

  private generateCacheKey(prefix: string, options: any): string {
    const optionsStr = JSON.stringify(options, Object.keys(options).sort())
    return `${prefix}:${Buffer.from(optionsStr).toString('base64')}`
  }

  private getFromCache(key: string) {
    const cached = this.queryCache.get(key)
    if (!cached) return null

    const now = DateTime.now()
    if (now.diff(cached.timestamp, 'seconds').seconds > cached.ttl) {
      this.queryCache.delete(key)
      return null
    }

    return cached.result
  }

  private setCache(key: string, result: any, ttlSeconds: number) {
    this.queryCache.set(key, {
      result,
      timestamp: DateTime.now(),
      ttl: ttlSeconds,
    })

    // Limit cache size
    if (this.queryCache.size > 1000) {
      const oldestKey = this.queryCache.keys().next().value
      this.queryCache.delete(oldestKey)
    }
  }

  private cleanExpiredCache() {
    const now = DateTime.now()

    for (const [key, cached] of this.queryCache.entries()) {
      if (now.diff(cached.timestamp, 'seconds').seconds > cached.ttl) {
        this.queryCache.delete(key)
      }
    }
  }

  private async getConnectionStats() {
    const result = await Database.rawQuery(`
      SELECT
        count(*) as total_connections,
        count(CASE WHEN state = 'active' THEN 1 END) as active_connections,
        count(CASE WHEN state = 'idle' THEN 1 END) as idle_connections
      FROM pg_stat_activity
      WHERE datname = current_database()
    `)

    return {
      totalConnections: parseInt(result.rows[0]?.total_connections || '0'),
      activeConnections: parseInt(result.rows[0]?.active_connections || '0'),
      idleConnections: parseInt(result.rows[0]?.idle_connections || '0'),
    }
  }

  private async getActivityStats() {
    const result = await Database.rawQuery(`
      SELECT count(*) as active_queries
      FROM pg_stat_activity
      WHERE state = 'active' AND query NOT LIKE '%pg_stat_activity%'
    `)

    return {
      activeQueries: parseInt(result.rows[0]?.active_queries || '0'),
    }
  }

  private async getSlowQueries(): Promise<QueryPerformanceStats[]> {
    // This would integrate with pg_stat_statements if available
    return []
  }

  private async getIndexUsage() {
    const result = await Database.rawQuery(`
      SELECT
        schemaname,
        tablename as table_name,
        indexname as index_name,
        idx_scan as usage_count
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
        AND tablename = 'contact_inquiries'
      ORDER BY idx_scan DESC
    `)

    return result.rows.map((row: any) => ({
      table: row.table_name,
      index: row.index_name,
      usage: parseInt(row.usage_count || '0'),
    }))
  }

  private async getTableStats() {
    const result = await Database.rawQuery(`
      SELECT
        schemaname,
        tablename as table_name,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        n_tup_ins + n_tup_upd + n_tup_del as total_rows,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `)

    return result.rows.map((row: any) => ({
      table: row.table_name,
      size: row.table_size,
      rows: parseInt(row.total_rows || '0'),
      deadTuples: parseInt(row.dead_tuples || '0'),
    }))
  }
}

// Export singleton instance
export const databaseOptimizationService = DatabaseOptimizationService.getInstance()