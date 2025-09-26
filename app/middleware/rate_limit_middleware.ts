import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

interface RateLimitConfig {
  max: number
  windowMs: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

export default class RateLimitMiddleware {
  private store: RateLimitStore = {}
  private defaultConfig: RateLimitConfig = {
    max: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  }

  async handle(ctx: HttpContext, next: NextFn, options: string[] = []) {
    // Parse middleware parameters: max,windowMs
    const [maxStr, windowMsStr] = options
    const config: RateLimitConfig = {
      ...this.defaultConfig,
      max: maxStr ? Number.parseInt(maxStr, 10) : this.defaultConfig.max,
      windowMs: windowMsStr ? Number.parseInt(windowMsStr, 10) : this.defaultConfig.windowMs,
    }
    const key = this.generateKey(ctx)
    const now = Date.now()

    // Clean expired entries
    this.cleanExpiredEntries(now)

    // Get or create rate limit entry
    let entry = this.store[key]
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      }
      this.store[key] = entry
    }

    // Check if limit exceeded
    if (entry.count >= config.max) {
      return ctx.response.status(429).json({
        success: false,
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      })
    }

    // Increment counter before request
    entry.count++

    // Set rate limit headers
    ctx.response.header('X-RateLimit-Limit', config.max.toString())
    ctx.response.header('X-RateLimit-Remaining', (config.max - entry.count).toString())
    ctx.response.header('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())

    // Process request
    const output = await next()

    // Optionally decrement counter for failed requests
    if (config.skipFailedRequests && ctx.response.getStatus() >= 400) {
      entry.count--
    }

    // Optionally decrement counter for successful requests
    if (config.skipSuccessfulRequests && ctx.response.getStatus() < 400) {
      entry.count--
    }

    return output
  }

  private generateKey(ctx: HttpContext): string {
    // Use IP address as primary identifier
    const ip = ctx.request.ip()
    const route = ctx.route?.pattern || ctx.request.url()
    return `${ip}:${route}`
  }

  private cleanExpiredEntries(now: number): void {
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key]
      }
    })
  }
}
