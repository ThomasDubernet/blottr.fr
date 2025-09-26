import env from '@adonisjs/core/services/env'

export interface EnvironmentCheck {
  key: string
  value: string | undefined
  required: boolean
  sensitive: boolean
  valid: boolean
  message?: string
}

export interface EnvironmentValidationResult {
  isValid: boolean
  environment: string
  checks: EnvironmentCheck[]
  errors: string[]
  warnings: string[]
}

export default class EnvironmentService {
  private static instance: EnvironmentService

  private constructor() {}

  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService()
    }
    return EnvironmentService.instance
  }

  validateEnvironment(): EnvironmentValidationResult {
    const environment = env.get('NODE_ENV', 'development')
    const checks: EnvironmentCheck[] = []
    const errors: string[] = []
    const warnings: string[] = []

    // Define required environment variables based on environment
    const requiredVars = this.getRequiredVariables(environment)
    const optionalVars = this.getOptionalVariables(environment)

    // Check required variables
    for (const config of requiredVars) {
      const check = this.validateVariable(config)
      checks.push(check)

      if (!check.valid) {
        errors.push(check.message || `Missing required variable: ${config.key}`)
      }
    }

    // Check optional variables (warnings only)
    for (const config of optionalVars) {
      const check = this.validateVariable(config)
      checks.push(check)

      if (!check.valid && check.value === undefined) {
        warnings.push(`Optional variable not set: ${config.key}`)
      }
    }

    // Environment-specific validations
    this.validateEnvironmentSpecific(environment, errors, warnings)

    return {
      isValid: errors.length === 0,
      environment,
      checks,
      errors,
      warnings,
    }
  }

  private getRequiredVariables(environment: string) {
    const base = [
      { key: 'APP_KEY', required: true, sensitive: true, validator: this.validateAppKey },
      { key: 'NODE_ENV', required: true, sensitive: false, validator: this.validateNodeEnv },
      { key: 'PORT', required: true, sensitive: false, validator: this.validatePort },
      { key: 'HOST', required: true, sensitive: false },
      { key: 'LOG_LEVEL', required: true, sensitive: false, validator: this.validateLogLevel },
      { key: 'SESSION_DRIVER', required: true, sensitive: false },
      { key: 'DB_HOST', required: true, sensitive: false },
      { key: 'DB_PORT', required: true, sensitive: false, validator: this.validatePort },
      { key: 'DB_USER', required: true, sensitive: true },
      { key: 'DB_PASSWORD', required: true, sensitive: true },
      { key: 'DB_DATABASE', required: true, sensitive: false },
    ]

    if (environment === 'production') {
      return [
        ...base,
        { key: 'REDIS_HOST', required: true, sensitive: false },
        { key: 'REDIS_PASSWORD', required: true, sensitive: true },
        { key: 'SMTP_HOST', required: true, sensitive: false },
        { key: 'SMTP_USERNAME', required: true, sensitive: true },
        { key: 'SMTP_PASSWORD', required: true, sensitive: true },
        { key: 'AWS_ACCESS_KEY_ID', required: true, sensitive: true },
        { key: 'AWS_SECRET_ACCESS_KEY', required: true, sensitive: true },
        { key: 'AWS_BUCKET', required: true, sensitive: false },
        { key: 'SENTRY_DSN', required: true, sensitive: true },
      ]
    }

    if (environment === 'staging') {
      return [
        ...base,
        { key: 'REDIS_HOST', required: true, sensitive: false },
        { key: 'SENTRY_DSN', required: true, sensitive: true },
      ]
    }

    return base
  }

  private getOptionalVariables(environment: string) {
    const base = [
      { key: 'TZ', required: false, sensitive: false },
      { key: 'SESSION_MAX_AGE', required: false, sensitive: false },
      { key: 'DB_SSL', required: false, sensitive: false, validator: this.validateBoolean },
      { key: 'RATE_LIMIT_ENABLED', required: false, sensitive: false, validator: this.validateBoolean },
      { key: 'CORS_ENABLED', required: false, sensitive: false, validator: this.validateBoolean },
      { key: 'CSRF_ENABLED', required: false, sensitive: false, validator: this.validateBoolean },
    ]

    if (environment === 'production') {
      return [
        ...base,
        { key: 'CDN_URL', required: false, sensitive: false, validator: this.validateUrl },
        { key: 'METRICS_ENDPOINT', required: false, sensitive: false },
        { key: 'BACKUP_ENABLED', required: false, sensitive: false, validator: this.validateBoolean },
      ]
    }

    return base
  }

  private validateVariable(config: any): EnvironmentCheck {
    const value = env.get(config.key)
    const check: EnvironmentCheck = {
      key: config.key,
      value: config.sensitive ? (value ? '[REDACTED]' : undefined) : value,
      required: config.required,
      sensitive: config.sensitive,
      valid: true,
    }

    // Check if required variable is missing
    if (config.required && !value) {
      check.valid = false
      check.message = `Required environment variable '${config.key}' is not set`
      return check
    }

    // Run custom validator if provided
    if (value && config.validator) {
      const validationResult = config.validator(value)
      if (!validationResult.valid) {
        check.valid = false
        check.message = `Invalid value for '${config.key}': ${validationResult.message}`
      }
    }

    return check
  }

  private validateAppKey(value: string) {
    if (value.length < 32) {
      return { valid: false, message: 'APP_KEY must be at least 32 characters long' }
    }
    return { valid: true }
  }

  private validateNodeEnv(value: string) {
    const validEnvs = ['development', 'staging', 'production', 'test']
    if (!validEnvs.includes(value)) {
      return { valid: false, message: `NODE_ENV must be one of: ${validEnvs.join(', ')}` }
    }
    return { valid: true }
  }

  private validatePort(value: string) {
    const port = parseInt(value, 10)
    if (isNaN(port) || port < 1 || port > 65535) {
      return { valid: false, message: 'Must be a valid port number (1-65535)' }
    }
    return { valid: true }
  }

  private validateLogLevel(value: string) {
    const validLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']
    if (!validLevels.includes(value)) {
      return { valid: false, message: `Must be one of: ${validLevels.join(', ')}` }
    }
    return { valid: true }
  }

  private validateBoolean(value: string) {
    const validBooleans = ['true', 'false', '1', '0', 'yes', 'no']
    if (!validBooleans.includes(value.toLowerCase())) {
      return { valid: false, message: 'Must be a boolean value (true/false, 1/0, yes/no)' }
    }
    return { valid: true }
  }

  private validateUrl(value: string) {
    try {
      new URL(value)
      return { valid: true }
    } catch {
      return { valid: false, message: 'Must be a valid URL' }
    }
  }

  private validateEnvironmentSpecific(environment: string, errors: string[], warnings: string[]) {
    switch (environment) {
      case 'production':
        this.validateProductionEnvironment(errors, warnings)
        break
      case 'staging':
        this.validateStagingEnvironment(errors, warnings)
        break
      case 'development':
        this.validateDevelopmentEnvironment(warnings)
        break
    }
  }

  private validateProductionEnvironment(errors: string[], warnings: string[]) {
    // Security checks for production
    const host = env.get('HOST')
    if (host === 'localhost' || host === '127.0.0.1') {
      errors.push('Production HOST should not be localhost')
    }

    const sessionSecure = env.get('SESSION_SECURE')
    if (sessionSecure !== 'true') {
      errors.push('SESSION_SECURE must be true in production')
    }

    const dbSsl = env.get('DB_SSL')
    if (dbSsl !== 'true') {
      warnings.push('Consider enabling DB_SSL in production')
    }

    const logLevel = env.get('LOG_LEVEL')
    if (logLevel === 'debug' || logLevel === 'trace') {
      warnings.push('Consider using warn or error log level in production for performance')
    }
  }

  private validateStagingEnvironment(errors: string[], warnings: string[]) {
    // Staging-specific validations
    const database = env.get('DB_DATABASE')
    if (database && !database.includes('staging')) {
      warnings.push('Consider using a staging-specific database name')
    }
  }

  private validateDevelopmentEnvironment(warnings: string[]) {
    // Development-specific validations
    const appKey = env.get('APP_KEY')
    if (!appKey) {
      warnings.push('Generate APP_KEY for better security: node ace generate:key')
    }
  }

  logEnvironmentStatus() {
    const result = this.validateEnvironment()

    console.log(`\n=== Environment Validation (${result.environment.toUpperCase()}) ===`)

    if (result.isValid) {
      console.log('✅ Environment configuration is valid')
    } else {
      console.log('❌ Environment configuration has errors')
    }

    if (result.errors.length > 0) {
      console.log('\n🚨 ERRORS:')
      result.errors.forEach(error => console.log(`  - ${error}`))
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:')
      result.warnings.forEach(warning => console.log(`  - ${warning}`))
    }

    console.log(`\n📊 Configuration Summary:`)
    console.log(`  - Required variables: ${result.checks.filter(c => c.required).length}`)
    console.log(`  - Optional variables: ${result.checks.filter(c => !c.required).length}`)
    console.log(`  - Valid checks: ${result.checks.filter(c => c.valid).length}`)
    console.log(`  - Invalid checks: ${result.checks.filter(c => !c.valid).length}`)

    if (result.environment === 'production' && !result.isValid) {
      console.log('\n💥 CRITICAL: Production environment is not properly configured!')
      process.exit(1)
    }

    return result
  }
}

// Export singleton instance
export const environmentService = EnvironmentService.getInstance()