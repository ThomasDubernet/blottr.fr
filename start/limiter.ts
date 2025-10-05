import limiter from '@adonisjs/limiter/services/main'

/**
 * Rate limiter for registration endpoint
 * Limits to 5 registration attempts per 15 minutes per IP address
 */
export const registerThrottle = limiter.define('auth:register', (ctx) => {
  return limiter
    .allowRequests(5)
    .every('15 minutes')
    .usingKey(`register_${ctx.request.ip()}`)
    .blockFor('15 minutes')
}) as any
