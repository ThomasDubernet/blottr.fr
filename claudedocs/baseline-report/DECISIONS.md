# Architecture Decisions Record - Blottr

**Date:** 2025-10-05
**Version:** 1.0.0
**Status:** ✅ Decisions Validated

---

## 🎯 Stack Final Validé

### Infrastructure & Deployment

#### ADR-001: Deployment Platform
**Decision:** Dockploy + AWS
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Besoin deployment production avec PostgreSQL
- Control total infrastructure souhaité
- Budget optimisé

**Decision:**
- Platform: **Dockploy** (Docker-based deployment automation)
- Cloud: **AWS** (EC2/ECS + RDS PostgreSQL)
- Region: EU-West-1 (Ireland) for GDPR compliance

**Consequences:**
- ✅ Control total infrastructure
- ✅ Scalabilité AWS ecosystem
- ✅ Dockploy simplifie Docker deployment
- ⚠️ Requires DevOps knowledge
- 💰 Cost: ~$30-50/mois (t3.small EC2 + RDS)

**Alternatives Considered:**
- Railway (trop limité long-terme)
- Vercel (pas adapté AdonisJS full-stack)
- Fly.io (multi-region non nécessaire)

---

#### ADR-002: File Storage
**Decision:** AWS S3 + CloudFront CDN
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Tattoo images (portfolio) - high traffic
- Reference images (inquiries) - low traffic
- Scalabilité required
- CDN global pour performance

**Decision:**
- Storage: **AWS S3** (eu-west-1)
- CDN: **CloudFront** (global edge locations)
- Bucket structure:
  - `blottr-tattoos/` (public, CDN)
  - `blottr-inquiries/` (private, presigned URLs)
  - `blottr-avatars/` (public, CDN)

**Configuration:**
```typescript
// config/drive.ts
s3: {
  driver: 's3',
  bucket: process.env.S3_BUCKET,
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  cdnUrl: process.env.CLOUDFRONT_URL,
}
```

**Consequences:**
- ✅ Scalable (unlimited storage)
- ✅ CDN global (low latency worldwide)
- ✅ Lifecycle policies (auto-archive old files)
- 💰 Cost: ~$5-10/mois (estimé 50GB storage + 100GB bandwidth)

**Alternatives Considered:**
- Cloudinary (plus cher, overkill pour nos besoins)
- DigitalOcean Spaces (moins features)

---

### Communication & Notifications

#### ADR-003: Email Service
**Decision:** Resend
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Besoin templates emails qualitatifs
- Notifications artistes critiques
- Dev experience important

**Decision:**
- Provider: **Resend**
- Features utilisées:
  - React Email templates (composants React → HTML)
  - Excellent deliverability
  - Webhooks (bounce, open, click tracking)
  - EU region available

**Email Templates to Create:**
1. `ArtistInquiryNotification.tsx` - Nouvelle demande client
2. `ClientConfirmation.tsx` - Confirmation envoi demande
3. `ArtistReplyNotification.tsx` - Artiste a répondu
4. `VerificationApproved.tsx` - Profil vérifié
5. `VerificationRejected.tsx` - Profil rejeté

**Implementation:**
```typescript
// app/services/email_service.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

async sendArtistNotification(inquiry: ContactInquiry, artist: Artist) {
  await resend.emails.send({
    from: 'Blottr <notifications@blottr.fr>',
    to: artist.user.email,
    subject: `Nouvelle demande de ${inquiry.fullName}`,
    react: ArtistInquiryNotification({ inquiry, artist }),
  })
}
```

**Consequences:**
- ✅ Templates React (type-safe, réutilisables)
- ✅ Excellent deliverability (>99%)
- ✅ Dev experience moderne
- 💰 Cost: Gratuit 100 emails/jour, puis $20/mois (3000 emails)

**Alternatives Considered:**
- Mailgun (plus complexe, templates Handlebars)
- SendGrid (Twilio owned, moins moderne)

---

### Data Strategy

#### ADR-004: Mock Data Strategy
**Decision:** Maintenir mock data + future migration Bubble.io → PostgreSQL
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- MVP doit être testable rapidement
- Données production actuellement dans Bubble.io
- Migration complexe planifiée plus tard

**Decision:**
- **Phase 1 (Now):** Mock data dans routes (`/artists/:slug`)
- **Phase 2 (MVP+1):** Migration script Bubble.io → PostgreSQL
- **Phase 3 (Post-migration):** Controllers DB réels

**Migration Plan:**
```typescript
// scripts/migrate-from-bubble.ts
import { bubbleAPI } from './bubble-client'
import Artist from '#models/artist'

async function migrateArtists() {
  const bubbleArtists = await bubbleAPI.getArtists()

  for (const bubbleArtist of bubbleArtists) {
    await Artist.create({
      // Map Bubble fields → PostgreSQL schema
      stageName: bubbleArtist.name,
      slug: slugify(bubbleArtist.name),
      bio: bubbleArtist.bio,
      // ... other fields
    })
  }
}
```

**Consequences:**
- ✅ MVP testable immédiatement
- ✅ Time to market rapide
- ⚠️ Double maintenance temporaire (mock + future DB)
- ⚠️ Migration script requis (effort estimé: 1-2 semaines)

**Migration Checklist:**
- [ ] Audit Bubble.io schema
- [ ] Map Bubble fields → PostgreSQL schema
- [ ] Write migration script with dry-run
- [ ] Test migration on staging
- [ ] Migrate production data
- [ ] Remove mock routes
- [ ] Create real ArtistsController

---

### Analytics & Monitoring

#### ADR-005: Analytics Platform
**Decision:** Amplitude (MVP) → Google Analytics 4 (post free-tier)
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Besoin product analytics pour MVP
- Free tier Amplitude généreux (10M events/mois)
- GA4 pour long-terme (gratuit, unlimited)

**Decision:**
- **Phase 1 (MVP):** Amplitude
  - Product analytics
  - Funnel analysis
  - Cohort retention
  - Free tier: 10M events/mois

- **Phase 2 (Scale):** Google Analytics 4
  - Unlimited events gratuit
  - BigQuery export (advanced analysis)
  - Google Ads integration

**Events to Track:**
```typescript
// Key events (voir 10_ANALYTICS_EVENTS.md)
amplitude.track('user_signup', { method: 'email' })
amplitude.track('artist_profile_view', { artistId, source })
amplitude.track('contact_inquiry_submitted', { artistId, projectType })
amplitude.track('search_performed', { query, filters, resultsCount })
```

**Consequences:**
- ✅ Rich product analytics (Amplitude)
- ✅ Free tier généreux (10M events/mois)
- ✅ Migration GA4 facile (même events)
- 💰 Cost: Gratuit jusqu'à 10M events, puis $50/mois ou migration GA4

**Alternatives Considered:**
- PostHog (self-hosted complexe)
- Mixpanel (plus cher)

---

#### ADR-006: Error Monitoring
**Decision:** Sentry + Better Stack
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Besoin error tracking production
- Besoin logs centralisés
- Budget optimisé

**Decision:**
- **Errors:** Sentry (5k errors/mois gratuit)
- **Logs:** Better Stack (1GB/mois gratuit)

**Configuration:**
```typescript
// bin/server.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% performance monitoring
})

// app/exceptions/handler.ts
async report(error: unknown, ctx: HttpContext) {
  Sentry.captureException(error, {
    user: { id: ctx.auth?.user?.id },
    extra: { url: ctx.request.url(), method: ctx.request.method() },
  })
}
```

**Consequences:**
- ✅ Real-time error alerts
- ✅ Stack traces + context
- ✅ Performance monitoring (10%)
- 💰 Cost: Gratuit 5k errors + 1GB logs/mois

---

#### ADR-007: Database Backups
**Decision:** pg_dump hebdomadaire → AWS S3
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Data loss risk critique
- Backup automation requise
- Budget optimisé

**Decision:**
- **Frequency:** Weekly (dimanche 3am UTC)
- **Storage:** AWS S3 (eu-west-1)
- **Retention:** 4 weekly + 12 monthly
- **Encryption:** AES-256 at rest

**Implementation:**
```bash
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="blottr_backup_${DATE}.sql.gz"

# Dump database
pg_dump $DATABASE_URL | gzip > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://blottr-backups/weekly/ \
  --storage-class STANDARD_IA \
  --server-side-encryption AES256

# Cleanup local
rm $BACKUP_FILE

# Prune old backups (keep 4 weekly)
aws s3 ls s3://blottr-backups/weekly/ | \
  sort -r | tail -n +5 | \
  awk '{print $4}' | \
  xargs -I {} aws s3 rm s3://blottr-backups/weekly/{}
```

**Cron Job (Dockploy):**
```cron
0 3 * * 0 /app/scripts/backup-db.sh >> /var/log/backups.log 2>&1
```

**Recovery Test (Monthly):**
```bash
# Test restore procedure
aws s3 cp s3://blottr-backups/weekly/latest.sql.gz .
gunzip latest.sql.gz
psql $STAGING_DATABASE_URL < latest.sql
# Verify data integrity
```

**Consequences:**
- ✅ Data loss protection
- ✅ Point-in-time recovery (weekly)
- ✅ Automated + tested
- 💰 Cost: ~$1/mois (S3 storage)

---

### Business & Payments

#### ADR-008: Payment Provider
**Decision:** Stripe
**Date:** 2025-10-05
**Status:** ✅ Approved (Future Implementation)

**Context:**
- Future revenue via commissions/subscriptions
- Besoin marketplace features (escrow, splits)
- Compliance PCI-DSS

**Decision:**
- Provider: **Stripe Connect**
- Use cases:
  - Commission bookings (15-20%)
  - Abonnement artiste premium (€29/mois)
  - Featured listings (€99/mois)

**Stripe Connect Flow:**
```typescript
// Future implementation
// app/controllers/bookings_controller.ts

// 1. Artist onboards to Stripe Connect
async onboardArtist({ auth }: HttpContext) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'FR',
    email: auth.user.email,
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    return_url: 'https://blottr.fr/dashboard',
    type: 'account_onboarding',
  })

  return { url: accountLink.url }
}

// 2. Create payment with platform fee
async createBookingPayment({ request }: HttpContext) {
  const { artistId, amount } = request.all()
  const artist = await Artist.findOrFail(artistId)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency: 'eur',
    application_fee_amount: Math.floor(amount * 0.15 * 100), // 15% commission
    transfer_data: {
      destination: artist.stripeAccountId,
    },
  })

  return { clientSecret: paymentIntent.client_secret }
}
```

**Consequences:**
- ✅ Marketplace-ready (splits, escrow)
- ✅ PCI-DSS compliant
- ✅ EU Strong Customer Authentication (SCA)
- 💰 Cost: 1.4% + €0.25 par transaction

**Implementation Timeline:** MVP+2 (après validation traction)

---

### Quality & Testing

#### ADR-009: Test Coverage Strategy
**Decision:** Unit 90% | Functional 70% | E2E 0% (pour l'instant)
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Coverage actuel: ~40%
- Besoin qualité avant production
- Effort/impact optimisé

**Decision:**
- **Unit Tests: 90% target**
  - Use Cases (RegisterUser, LoginUser)
  - Services (MonitoringService, EmailService)
  - Repositories (ContactInquiryRepository)
  - Validators (VineJS schemas)

- **Functional Tests: 70% target**
  - Auth endpoints (POST /inscription, /connexion)
  - Contact API (POST /api/contact-inquiries)
  - Critical paths

- **E2E Tests: 0% (deferred)**
  - Playwright configuré mais non utilisé
  - À implémenter post-MVP si budget/temps

**Test Strategy:**
```typescript
// tests/unit/use_cases/register_user_use_case.spec.ts
test.group('RegisterUserUseCase', () => {
  test('should create user with hashed password', async ({ assert }) => {
    const useCase = new RegisterUserUseCase()
    const result = await useCase.execute({
      email: 'test@blottr.fr',
      password: 'secure123',
      fullName: 'Test User',
    })

    const user = await User.find(result.userId)
    assert.isTrue(await hash.verify(user.password, 'secure123'))
  })

  test('should reject duplicate email', async ({ assert }) => {
    await UserFactory.create({ email: 'exists@blottr.fr' })
    const useCase = new RegisterUserUseCase()

    await assert.rejects(
      () => useCase.execute({ email: 'exists@blottr.fr', ... }),
      'Email already exists'
    )
  })
})

// tests/functional/auth.spec.ts
test.group('Auth Endpoints', () => {
  test('POST /inscription should create user and redirect', async ({ client }) => {
    const response = await client.post('/inscription').json({
      email: 'new@blottr.fr',
      password: 'secure123',
      fullName: 'New User',
    })

    response.assertRedirectsTo('/connexion')
    response.assertFlashMessage('success', 'Compte créé avec succès')
  })
})
```

**Timeline:**
- Sprint 1: Unit tests use cases + services (90%)
- Sprint 2: Functional tests critical paths (70%)
- Post-MVP: E2E si nécessaire

**Consequences:**
- ✅ Quality assurance avant prod
- ✅ Effort optimisé (no E2E overhead)
- ✅ Coverage target réaliste
- ⏱️ Timeline: 2-3 semaines

---

### SEO & Localization

#### ADR-010: SEO Strategy
**Decision:** SEO basique MVP → optimisation post-launch
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Acquisition organique importante long-terme
- MVP focus sur features core
- Budget SEO limité

**Decision:**
- **Phase 1 (MVP):** SEO Basique
  - Sitemap.xml automatique
  - Meta tags (title, description, OG)
  - Slugs SEO-friendly (already done ✓)
  - robots.txt
  - Schema.org markup (Artist, LocalBusiness)

- **Phase 2 (Post-launch):** SEO Avancé
  - Content marketing (blog tatouage)
  - Link building
  - Local SEO (Google My Business pour salons)
  - Page speed optimization (Core Web Vitals)

**Implementation MVP:**
```typescript
// app/middleware/seo_middleware.ts
export default class SeoMiddleware {
  async handle({ inertia, route }: HttpContext, next: NextFn) {
    // Auto meta tags per route
    const meta = this.getMetaForRoute(route.name)
    inertia.share({ meta })
    await next()
  }

  private getMetaForRoute(routeName: string) {
    const metaMap = {
      'artists.show': (params) => ({
        title: `${params.artistName} - Tatoueur ${params.city} | Blottr`,
        description: `Portfolio et contact ${params.artistName}, tatoueur à ${params.city}. Styles: ${params.styles.join(', ')}`,
        ogImage: params.coverImage,
      }),
      'home': () => ({
        title: 'Blottr - Trouvez le tatoueur parfait',
        description: 'Découvrez les meilleurs tatoueurs de France. Portfolio, avis, contact direct.',
      }),
    }
    return metaMap[routeName]?.(params) || defaultMeta
  }
}

// Generate sitemap
// app/controllers/sitemap_controller.ts
async index({ response }: HttpContext) {
  const artists = await Artist.query().where('is_active', true)
  const cities = await City.query().where('is_active', true)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://blottr.fr</loc><priority>1.0</priority></url>
    ${artists.map(a => `
      <url>
        <loc>https://blottr.fr/artists/${a.slug}</loc>
        <lastmod>${a.updatedAt}</lastmod>
        <priority>0.8</priority>
      </url>
    `).join('')}
    ${cities.map(c => `
      <url>
        <loc>https://blottr.fr/tatoueurs/${c.slug}</loc>
        <priority>0.7</priority>
      </url>
    `).join('')}
  </urlset>`

  return response.header('Content-Type', 'application/xml').send(xml)
}
```

**Consequences:**
- ✅ SEO foundations solides
- ✅ Indexation Google optimale
- ⏱️ Effort minimal (1-2 jours)
- 📈 Optimisation continue post-launch

---

#### ADR-011: Localization
**Decision:** Full FR (pas d'internationalisation)
**Date:** 2025-10-05
**Status:** ✅ Approved

**Context:**
- Market initial: France uniquement
- i18n complexité non justifiée MVP
- Focus sur product-market fit local

**Decision:**
- **Langue unique:** Français
- **Hard-coded strings** acceptés (pas de i18n framework)
- **Future i18n:** Post-PMF si expansion internationale

**Consequences:**
- ✅ Simplicité développement
- ✅ Time to market rapide
- ✅ Focus France (90% TAM estimé)
- ⚠️ Refactoring requis si expansion (effort: 2-3 semaines)

**Future i18n Checklist (si nécessaire):**
- [ ] Installer react-i18next
- [ ] Extract tous les strings
- [ ] Translate FR → EN/ES
- [ ] Adapter formats (dates, currency)
- [ ] URL routing i18n (/fr/artists, /en/artists)

---

## 📊 Stack Final Résumé

```yaml
Infrastructure:
  Platform: Dockploy + AWS (EC2/RDS)
  Region: eu-west-1 (Ireland)
  Storage: AWS S3 + CloudFront CDN
  Database: PostgreSQL (AWS RDS)
  Backups: pg_dump hebdo → S3

Communication:
  Email: Resend (React Email templates)
  SMS: À définir (future)

Analytics & Monitoring:
  Analytics: Amplitude (MVP) → GA4 (scale)
  Errors: Sentry (5k/mois gratuit)
  Logs: Better Stack (1GB/mois gratuit)
  APM: Sentry performance (10% sampling)

Business:
  Payments: Stripe Connect (future)
  Revenue: Commission 15-20% + subscriptions

Quality:
  Tests: Unit 90% | Functional 70% | E2E 0%
  Coverage: Target 80% global
  CI/CD: GitHub Actions (future)

SEO & i18n:
  SEO: Basique MVP → avancé post-launch
  i18n: Full FR (no internationalization)

Data Strategy:
  Current: Mock data (temporary)
  Future: Migration Bubble.io → PostgreSQL
```

---

## 💰 Cost Estimate

**Monthly Costs (Production):**
```
Infrastructure:
├── AWS EC2 (t3.small): ~$15
├── AWS RDS PostgreSQL (db.t3.micro): ~$15
├── AWS S3 + CloudFront: ~$10
├── Dockploy: $0 (self-hosted)
└── Total Infrastructure: ~$40/mois

Communication:
├── Resend: $0 (< 100 emails/day)
└── Total Communication: $0/mois (MVP)

Monitoring:
├── Sentry: $0 (< 5k errors/mois)
├── Better Stack: $0 (< 1GB logs/mois)
├── Amplitude: $0 (< 10M events/mois)
└── Total Monitoring: $0/mois (MVP)

Payments:
├── Stripe: 1.4% + €0.25 per transaction
└── Pay-as-you-go

🎯 TOTAL MVP: ~$40/mois
📈 TOTAL Scale (1000 users): ~$100-150/mois
```

---

## 🚀 Implementation Timeline

**Sprint 1 (Week 1-2): Infrastructure Setup**
- [ ] Setup Dockploy + AWS
- [ ] Configure AWS S3 + CloudFront
- [ ] Integrate Resend email service
- [ ] Setup Sentry + Better Stack
- [ ] Configure backups (pg_dump → S3)

**Sprint 2 (Week 3-4): Quality & Monitoring**
- [ ] Implement Amplitude tracking
- [ ] Write unit tests (90% coverage)
- [ ] Write functional tests (70% coverage)
- [ ] SEO basics (sitemap, meta tags)

**Sprint 3 (Week 5-6): Data Migration Prep**
- [ ] Audit Bubble.io schema
- [ ] Write migration script (dry-run)
- [ ] Test migration on staging
- [ ] Remove mock data
- [ ] Create real ArtistsController

**Post-MVP: Scale Features**
- [ ] Stripe Connect integration
- [ ] Migration GA4 (if > 10M events/mois)
- [ ] E2E tests (if needed)
- [ ] SEO advanced (content, links)

---

**✅ All decisions validated and documented**
**📅 Next: Implementation Sprint 1**
