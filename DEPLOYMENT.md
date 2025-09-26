# Blottr Deployment Guide

## 📋 Overview

This guide covers deployment procedures for the Blottr platform across different environments.

## 🚀 Quick Start

### Environment Setup

```bash
# Development
npm run dev

# Staging
npm run env:staging
npm run deploy:staging

# Production
npm run env:production
npm run deploy:production
```

## 🔧 Environment Configuration

### Required Environment Variables

#### Core Application
- `APP_KEY` - 32+ character encryption key
- `NODE_ENV` - Environment (development/staging/production)
- `PORT` - Application port (default: 3333)
- `HOST` - Bind address (0.0.0.0 for production)

#### Database
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `DB_SSL` - Enable SSL (true for production)

#### Security
- `SESSION_SECURE` - Secure cookies (true for production)
- `CSRF_ENABLED` - CSRF protection (true)
- `RATE_LIMIT_ENABLED` - Rate limiting (true)

### Environment Files

- `.env.production` - Production configuration template
- `.env.staging` - Staging configuration template
- `.env` - Active environment (copied from templates)

## 🐳 Docker Deployment

### Development
```bash
# Start database only
docker-compose up postgres

# Start with Redis
docker-compose --profile cache up

# Full stack with monitoring
docker-compose --profile app --profile cache --profile monitoring up
```

### Production
```bash
# Build production image
docker build -t blottr:latest .

# Run with external services
docker run -d \
  --name blottr-app \
  --env-file .env.production \
  -p 3333:3333 \
  blottr:latest
```

## 📊 Health Checks

### Application Health
```bash
curl http://localhost:3333/api/health/contact-inquiries
```

### Database Health
```bash
npm run migration:status
```

### Environment Validation
```bash
npm run env:validate
```

## 🔄 Database Management

### Migrations
```bash
# Run migrations
npm run migration:run

# Rollback migrations
npm run migration:rollback

# Create new migration
node ace make:migration create_table_name
```

### Seeding
```bash
# Seed development data
npm run db:seed
```

## 🛡️ Security Configuration

### Rate Limiting
- Contact forms: 5 requests per 15 minutes
- Quick forms: 10 requests per 15 minutes
- Read operations: 30 requests per 15 minutes

### CSRF Protection
- Enabled by default with X-CSRF-TOKEN header
- Automatic frontend integration via API client

### Headers Security
- HSTS enabled in production
- Content type sniffing disabled
- X-Frame-Options: DENY

## 📈 Monitoring

### Health Endpoints
- `/api/health/contact-inquiries` - Application health
- Database connectivity check
- Performance metrics
- Error rate monitoring

### Logging
- Structured JSON logs
- Error tracking with context
- Performance monitoring
- Request/response tracking

## 🚨 Error Handling

### Exception Types
- `ContactInquiryNotFoundException` - Missing inquiries
- `ContactInquiryValidationException` - Validation errors
- `FileUploadException` - File upload failures
- `EmailDeliveryException` - Email sending failures

### Error Recovery
- Automatic retry mechanisms
- Graceful degradation
- User-friendly error messages
- Admin error notifications

## 💾 Backup & Recovery

### Database Backup
```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql
```

### File Storage Backup
- Uploaded files stored in S3
- Automatic versioning enabled
- Cross-region replication

## 🔍 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check database connectivity
node ace db:check

# Reset database
npm run migration:rollback --batch=0
npm run migration:run
```

#### Environment Issues
```bash
# Validate environment
npm run env:validate

# Check missing variables
grep -v '^#' .env.production | grep -E '^[A-Z_]+=$'
```

#### Performance Issues
```bash
# Check health status
curl -s localhost:3333/api/health/contact-inquiries | jq '.'

# Monitor logs
tail -f logs/app.log
```

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Database query debugging
DB_DEBUG=true npm run dev
```

## 📋 Pre-deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] TypeScript compilation (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code formatted (`npm run format:check`)

### Security
- [ ] Environment variables configured
- [ ] SSL certificates updated
- [ ] Security headers enabled
- [ ] Rate limiting configured

### Database
- [ ] Migrations tested
- [ ] Backup created
- [ ] Performance optimized
- [ ] Indexes created

### Monitoring
- [ ] Health checks responding
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Log aggregation working

## 🏗️ Production Deployment Steps

1. **Pre-deployment**
   ```bash
   # Validate environment
   npm run env:production

   # Run quality checks
   npm run quality

   # Create backup
   ./scripts/deploy.sh production
   ```

2. **Deployment**
   ```bash
   # Build application
   npm run build

   # Run migrations
   npm run migration:run

   # Start services
   docker-compose up -d
   ```

3. **Post-deployment**
   ```bash
   # Verify health
   curl http://localhost:3333/api/health/contact-inquiries

   # Check logs
   docker-compose logs app

   # Monitor metrics
   npm run monitoring:check
   ```

## 📞 Support

### Emergency Contacts
- **Database Issues**: DBA Team
- **Application Errors**: Development Team
- **Infrastructure**: DevOps Team

### Monitoring Dashboards
- Application metrics: `/metrics`
- Database performance: Postgres Exporter
- Error tracking: Sentry Dashboard

---

**Version**: 1.0.0
**Last Updated**: $(date +'%Y-%m-%d')
**Environment**: Production Ready