import ContactInquiry, { InquiryStatus, ProjectType } from '#models/contact_inquiry'
import { databaseOptimizationService } from '#services/database_optimization_service'
import { DateTime } from 'luxon'

export interface InquiryFilters {
  status?: InquiryStatus[]
  projectType?: ProjectType[]
  artistId?: string
  isRead?: boolean
  priority?: { min?: number; max?: number }
  dateRange?: { start: DateTime; end: DateTime }
  searchTerm?: string
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface InquiryListResult {
  data: ContactInquiry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

/**
 * Optimized repository for contact inquiries with intelligent caching
 * and query optimization strategies
 */
export default class ContactInquiryRepository {
  private static instance: ContactInquiryRepository

  private constructor() {}

  public static getInstance(): ContactInquiryRepository {
    if (!ContactInquiryRepository.instance) {
      ContactInquiryRepository.instance = new ContactInquiryRepository()
    }
    return ContactInquiryRepository.instance
  }

  /**
   * Get paginated list of inquiries with optimized queries
   */
  async findPaginated(
    filters: InquiryFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<InquiryListResult> {
    const offset = (pagination.page - 1) * pagination.limit

    // Use optimized service for complex queries
    const data = await databaseOptimizationService.getInquiriesOptimized({
      ...filters,
      limit: pagination.limit,
      offset,
    })

    // Get total count with optimization
    const total = await this.getTotalCount(filters)

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasMore: offset + data.length < total,
      },
    }
  }

  /**
   * Get urgent inquiries using optimized partial index
   */
  async findUrgent(): Promise<ContactInquiry[]> {
    return databaseOptimizationService.getUrgentInquiries()
  }

  /**
   * Get recent unread inquiries (dashboard view)
   */
  async findRecentUnread(limit: number = 10): Promise<ContactInquiry[]> {
    return databaseOptimizationService.getInquiriesOptimized({
      isRead: false,
      status: [InquiryStatus.PENDING, InquiryStatus.IN_PROGRESS],
      limit,
    })
  }

  /**
   * Find inquiries by artist with optimized query
   */
  async findByArtist(
    artistId: string,
    options: {
      limit?: number
      status?: InquiryStatus[]
    } = {}
  ): Promise<ContactInquiry[]> {
    return databaseOptimizationService.getInquiriesOptimized({
      artistId,
      status: options.status,
      limit: options.limit || 50,
    })
  }

  /**
   * Search inquiries with full-text search
   */
  async search(
    searchTerm: string,
    options: {
      limit?: number
      filters?: Partial<InquiryFilters>
    } = {}
  ): Promise<ContactInquiry[]> {
    return databaseOptimizationService.getInquiriesOptimized({
      searchTerm,
      ...options.filters,
      limit: options.limit || 20,
    })
  }

  /**
   * Get inquiry statistics for analytics
   */
  async getAnalytics(days: number = 30) {
    return databaseOptimizationService.getInquiryAnalytics(days)
  }

  /**
   * Batch update inquiries status (optimized for multiple updates)
   */
  async batchUpdateStatus(inquiryIds: string[], status: InquiryStatus): Promise<number> {
    const result = await ContactInquiry.query().whereIn('id', inquiryIds).update({
      status,
      updated_at: DateTime.now(),
    })

    // Invalidate relevant caches
    await this.invalidateStatusCaches()

    return result[0] || 0
  }

  /**
   * Batch mark as read (optimized for multiple updates)
   */
  async batchMarkAsRead(inquiryIds: string[]): Promise<number> {
    const result = await ContactInquiry.query().whereIn('id', inquiryIds).update({
      is_read: true,
      updated_at: DateTime.now(),
    })

    // Invalidate read status caches
    await this.invalidateReadCaches()

    return result[0] || 0
  }

  /**
   * Get inquiry by ID with optimized lookup
   */
  async findById(id: string): Promise<ContactInquiry | null> {
    return ContactInquiry.find(id)
  }

  /**
   * Create new inquiry with optimized creation
   */
  async create(data: Partial<ContactInquiry>): Promise<ContactInquiry> {
    const inquiry = await ContactInquiry.create(data)

    // Invalidate relevant caches
    await this.invalidateListCaches()

    return inquiry
  }

  /**
   * Update inquiry with cache invalidation
   */
  async update(id: string, data: Partial<ContactInquiry>): Promise<ContactInquiry> {
    const inquiry = await ContactInquiry.findOrFail(id)
    inquiry.merge(data)
    await inquiry.save()

    // Invalidate relevant caches
    await this.invalidateListCaches()

    return inquiry
  }

  /**
   * Delete inquiry with cache cleanup
   */
  async delete(id: string): Promise<void> {
    await ContactInquiry.query().where('id', id).delete()

    // Invalidate relevant caches
    await this.invalidateListCaches()
  }

  /**
   * Get dashboard summary with optimized queries
   */
  async getDashboardSummary() {
    const urgentInquiries = await this.findUrgent()
    const [totalInquiries, pendingInquiries, unreadInquiries, todayInquiries] = await Promise.all([
      this.getTotalCount(),
      this.getTotalCount({ status: [InquiryStatus.PENDING] }),
      this.getTotalCount({ isRead: false }),
      this.getTotalCount({
        dateRange: {
          start: DateTime.now().startOf('day'),
          end: DateTime.now().endOf('day'),
        },
      }),
    ])

    return {
      totalInquiries,
      pendingInquiries,
      unreadInquiries,
      urgentInquiries: urgentInquiries.length,
      todayInquiries,
    }
  }

  /**
   * Optimize database performance
   */
  async optimizePerformance(): Promise<string[]> {
    return databaseOptimizationService.optimizeDatabase()
  }

  // Private helper methods

  private async getTotalCount(filters: InquiryFilters = {}): Promise<number> {
    let query = ContactInquiry.query()

    if (filters.status && filters.status.length > 0) {
      query = query.whereIn('status', filters.status)
    }

    if (filters.projectType && filters.projectType.length > 0) {
      query = query.whereIn('project_type', filters.projectType)
    }

    if (filters.artistId) {
      query = query.where('artist_id', filters.artistId)
    }

    if (filters.isRead !== undefined) {
      query = query.where('is_read', filters.isRead)
    }

    if (filters.priority) {
      if (filters.priority.min) {
        query = query.where('priority', '>=', filters.priority.min)
      }
      if (filters.priority.max) {
        query = query.where('priority', '<=', filters.priority.max)
      }
    }

    if (filters.dateRange) {
      query = query.whereBetween('created_at', [
        filters.dateRange.start.toSQL() as any,
        filters.dateRange.end.toSQL() as any,
      ])
    }

    if (filters.searchTerm) {
      query = query.whereRaw(
        `to_tsvector('french', subject || ' ' || message) @@ plainto_tsquery('french', ?)`,
        [filters.searchTerm]
      )
    }

    const result = await query.count('* as total')
    return Number((result[0] as any).total || 0)
  }

  private async invalidateListCaches(): Promise<void> {
    // This would invalidate Redis cache keys in production
    // For now, we'll trigger a cache cleanup in the optimization service
    await databaseOptimizationService.optimizeDatabase()
  }

  private async invalidateStatusCaches(): Promise<void> {
    // Invalidate status-related caches
    await this.invalidateListCaches()
  }

  private async invalidateReadCaches(): Promise<void> {
    // Invalidate read status caches
    await this.invalidateListCaches()
  }
}

// Export singleton instance
export const contactInquiryRepository = ContactInquiryRepository.getInstance()
