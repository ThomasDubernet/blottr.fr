import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { monitoringService } from '#services/monitoring_service'

export default class MonitoringMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const startTime = Date.now()
    const { request, response } = ctx

    // Add request ID for tracing
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    request.updateQs({ _reqId: requestId })

    try {
      // Process request
      const output = await next()

      // Record successful request metrics
      const responseTime = Date.now() - startTime
      monitoringService.recordApiMetric({
        endpoint: request.url(),
        method: request.method(),
        responseTime,
        statusCode: response.getStatus(),
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
      })

      // Log slow requests
      if (responseTime > 2000) {
        monitoringService.logWarning('Slow API request detected', {
          endpoint: request.url(),
          method: request.method(),
          responseTime,
          requestId,
        })
      }

      return output
    } catch (error) {
      // Record error metrics
      const responseTime = Date.now() - startTime
      const statusCode = this.getErrorStatusCode(error)

      monitoringService.recordApiMetric({
        endpoint: request.url(),
        method: request.method(),
        responseTime,
        statusCode,
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
      })

      // Log error with context
      monitoringService.logError(error, {
        endpoint: request.url(),
        method: request.method(),
        requestId,
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
        body: request.method() !== 'GET' ? this.sanitizeRequestBody(request.all()) : undefined,
      })

      throw error
    }
  }

  private getErrorStatusCode(error: any): number {
    if (error.status) return error.status
    if (error.code === 'E_VALIDATION_ERROR') return 422
    if (error.code === 'E_UNAUTHORIZED_ACCESS') return 401
    if (error.code === 'E_ROUTE_NOT_FOUND') return 404
    return 500
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      '_token',
    ]

    const sanitized = { ...body }
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }
}
