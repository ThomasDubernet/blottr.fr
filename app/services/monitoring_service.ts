import ContactInquiry, { InquiryStatus } from '#models/contact_inquiry'
import { DateTime } from 'luxon'

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    database: HealthStatus
    contactInquiries: HealthStatus
    apiPerformance: HealthStatus
    errorRate: HealthStatus
  }
  metrics: {
    totalInquiries: number
    pendingInquiries: number
    averageResponseTime: number
    errorRate: number
  }
}

interface HealthStatus {
  status: 'pass' | 'warn' | 'fail'
  message: string
  duration?: number
  details?: any
}

interface PerformanceMetrics {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  timestamp: DateTime
  userAgent?: string
  ipAddress?: string
}

export default class MonitoringService {
  private static instance: MonitoringService
  private performanceMetrics: PerformanceMetrics[] = []
  private errorCounts: Map<string, number> = new Map()
  private readonly maxMetricsHistory = 1000

  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  async getHealthCheck(): Promise<HealthCheckResult> {
    const checks = {
      database: await this.checkDatabase(),
      contactInquiries: await this.checkContactInquiries(),
      apiPerformance: await this.checkApiPerformance(),
      errorRate: await this.checkErrorRate(),
    }

    const metrics = await this.getSystemMetrics()

    // Determine overall status
    const failedChecks = Object.values(checks).filter((check) => check.status === 'fail')
    const warningChecks = Object.values(checks).filter((check) => check.status === 'warn')

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy'
    if (failedChecks.length > 0) {
      overallStatus = 'unhealthy'
    } else if (warningChecks.length > 0) {
      overallStatus = 'degraded'
    } else {
      overallStatus = 'healthy'
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      metrics,
    }
  }

  private async checkDatabase(): Promise<HealthStatus> {
    try {
      const start = Date.now()
      await ContactInquiry.query().limit(1).first()
      const duration = Date.now() - start

      if (duration > 1000) {
        return {
          status: 'warn',
          message: 'Database response time is slow',
          duration,
        }
      }

      return {
        status: 'pass',
        message: 'Database connection healthy',
        duration,
      }
    } catch (error) {
      return {
        status: 'fail',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async checkContactInquiries(): Promise<HealthStatus> {
    try {
      const now = DateTime.now()
      const oneDayAgo = now.minus({ days: 1 })

      const recentInquiries = await ContactInquiry.query()
        .where('created_at', '>=', oneDayAgo.toSQL())
        .count('* as total')

      const pendingCount = await ContactInquiry.query()
        .where('status', InquiryStatus.PENDING)
        .where('created_at', '<', now.minus({ hours: 24 }).toSQL())
        .count('* as total')

      const total = Number((recentInquiries[0] as any)?.total || 0)
      const oldPending = Number((pendingCount[0] as any)?.total || 0)

      if (oldPending > 10) {
        return {
          status: 'warn',
          message: `${oldPending} inquiries pending for over 24 hours`,
          details: { oldPending, totalRecent: total },
        }
      }

      return {
        status: 'pass',
        message: 'Contact inquiry system operating normally',
        details: { totalRecent: total, oldPending },
      }
    } catch (error) {
      return {
        status: 'fail',
        message: 'Failed to check contact inquiry status',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async checkApiPerformance(): Promise<HealthStatus> {
    const recentMetrics = this.performanceMetrics.filter(
      (m) => m.timestamp.diffNow('minutes').minutes > -5
    )

    if (recentMetrics.length === 0) {
      return {
        status: 'pass',
        message: 'No recent API activity to analyze',
      }
    }

    const avgResponseTime =
      recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
    const slowRequests = recentMetrics.filter((m) => m.responseTime > 2000).length
    const slowRequestRate = slowRequests / recentMetrics.length

    if (avgResponseTime > 1500) {
      return {
        status: 'warn',
        message: `Average API response time is ${Math.round(avgResponseTime)}ms`,
        details: { avgResponseTime: Math.round(avgResponseTime), slowRequestRate },
      }
    }

    if (slowRequestRate > 0.1) {
      return {
        status: 'warn',
        message: `${Math.round(slowRequestRate * 100)}% of requests are slow (>2s)`,
        details: { avgResponseTime: Math.round(avgResponseTime), slowRequestRate },
      }
    }

    return {
      status: 'pass',
      message: `API performance is good (avg: ${Math.round(avgResponseTime)}ms)`,
      details: { avgResponseTime: Math.round(avgResponseTime), slowRequestRate },
    }
  }

  private async checkErrorRate(): Promise<HealthStatus> {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0)
    const totalRequests = this.performanceMetrics.length

    if (totalRequests === 0) {
      return {
        status: 'pass',
        message: 'No recent requests to analyze',
      }
    }

    const errorRate = totalErrors / totalRequests

    if (errorRate > 0.1) {
      return {
        status: 'fail',
        message: `High error rate: ${Math.round(errorRate * 100)}%`,
        details: { errorRate, totalErrors, totalRequests },
      }
    }

    if (errorRate > 0.05) {
      return {
        status: 'warn',
        message: `Elevated error rate: ${Math.round(errorRate * 100)}%`,
        details: { errorRate, totalErrors, totalRequests },
      }
    }

    return {
      status: 'pass',
      message: `Error rate is healthy: ${Math.round(errorRate * 100)}%`,
      details: { errorRate, totalErrors, totalRequests },
    }
  }

  private async getSystemMetrics() {
    const totalInquiries = await ContactInquiry.query().count('* as total')
    const pendingInquiries = await ContactInquiry.query()
      .where('status', InquiryStatus.PENDING)
      .count('* as total')

    const recentMetrics = this.performanceMetrics.filter(
      (m) => m.timestamp.diffNow('minutes').minutes > -5
    )

    const averageResponseTime =
      recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
        : 0

    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0)
    const errorRate =
      this.performanceMetrics.length > 0 ? totalErrors / this.performanceMetrics.length : 0

    return {
      totalInquiries: Number((totalInquiries[0] as any)?.total || 0),
      pendingInquiries: Number((pendingInquiries[0] as any)?.total || 0),
      averageResponseTime: Math.round(averageResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
    }
  }

  recordApiMetric(metric: Omit<PerformanceMetrics, 'timestamp'>) {
    this.performanceMetrics.push({
      ...metric,
      timestamp: DateTime.now(),
    })

    // Keep only recent metrics
    if (this.performanceMetrics.length > this.maxMetricsHistory) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetricsHistory)
    }
  }

  recordError(errorCode: string) {
    const current = this.errorCounts.get(errorCode) || 0
    this.errorCounts.set(errorCode, current + 1)
  }

  logError(error: any, context: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      level: 'error',
    }

    console.error('Application Error:', JSON.stringify(logEntry, null, 2))

    // Record error for metrics
    const errorCode = error?.code || error?.constructor?.name || 'UnknownError'
    this.recordError(errorCode)
  }

  logWarning(message: string, context: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      context,
      level: 'warning',
    }

    console.warn('Application Warning:', JSON.stringify(logEntry, null, 2))
  }

  logInfo(message: string, context: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      context,
      level: 'info',
    }

    console.info('Application Info:', JSON.stringify(logEntry, null, 2))
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance()
