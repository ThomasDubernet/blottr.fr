import { defineConfig, stores } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  /**
   * Default store to use for rate limiting
   */
  default: 'database',

  /**
   * List of available stores for rate limiting
   */
  stores: {
    /**
     * Database store - Uses PostgreSQL to store rate limit data
     */
    database: stores.database({
      tableName: 'rate_limits',
    }),
  },
})

export default limiterConfig
