import limiter from '@adonisjs/limiter/services/main'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Rate limiter for registration endpoint
 * Limits to 5 registration attempts per 15 minutes per IP address
 *
 * Note: Type assertion needed due to HttpLimiter<never> vs HttpLimiter<any> mismatch
 * in @adonisjs/limiter type definitions
 */
export const registerThrottle = limiter.define('auth:register', (ctx: HttpContext) => {
  return limiter
    .allowRequests(5)
    .every('15 minutes')
    .usingKey(`register_${ctx.request.ip()}`)
    .blockFor('15 minutes') as any
})
