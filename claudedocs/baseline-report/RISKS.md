# Risk Register - Blottr

Registre des risques identifiés lors de l'audit baseline avec évaluations et stratégies de mitigation.

---

## Méthodologie

**Évaluation:**
- **Probabilité:** Certain (90%+) | Likely (60-90%) | Possible (30-60%) | Unlikely (<30%)
- **Impact:** Critical | High | Medium | Low
- **Severity:** Critical | High | Medium | Low (Probabilité × Impact)

**Stratégies:**
- **Mitigate:** Réduire probabilité ou impact
- **Transfer:** Externaliser (assurance, SaaS)
- **Accept:** Accepter le risque (low severity)
- **Avoid:** Éliminer la source du risque

---

## Risks Dashboard

| ID | Severity | Title | Status | Owner | ADR |
|----|----------|-------|--------|-------|-----|
| R1 | 🔴 Critical | No production deployment config | ✅ Mitigated | DevOps | ADR-001 |
| R2 | 🔴 Critical | Mock data blocking real usage | ✅ Mitigated | Dev Team | ADR-004 |
| R3 | 🔴 Critical | Email notifications missing | ✅ Mitigated | Backend | ADR-003 |
| R4 | 🟠 High | Local file storage not scalable | ✅ Mitigated | DevOps | ADR-002 |
| R5 | 🟠 High | No error monitoring (blind prod) | ✅ Mitigated | DevOps | ADR-006 |
| R6 | 🟠 High | Test coverage 40% (quality risk) | ✅ Mitigated | QA | ADR-009 |
| R7 | 🟡 Medium | No analytics tracking | ✅ Mitigated | Product | ADR-005 |
| R8 | 🟡 Medium | Database backup strategy missing | ✅ Mitigated | DevOps | ADR-007 |
| R9 | 🟡 Medium | RGPD compliance unverified | ⏳ Open | Legal | - |
| R10 | 🟡 Medium | No CDN (performance risk) | ✅ Mitigated | DevOps | ADR-002 |
| R11 | 🟢 Low | Seeders incomplete (dev friction) | ⏳ Open | Dev Team | - |
| R12 | 🟢 Low | No CI/CD pipeline | ⏳ Open | DevOps | - |

---

## Critical Risks (P0)

### R1: No Production Deployment Configuration
**ID:** RISK-001
**Severity:** 🔴 Critical
**Probability:** Certain (100%)
**Impact:** Critical - Cannot launch product

**Description:**
Aucune configuration de déploiement production détectée dans le codebase. Pas de Dockerfile, pas de config Railway/Vercel/Fly.io, pas de scripts deployment.

**Evidence:**
- `.env.production` existe mais vide/template
- Aucun `Dockerfile` ou `railway.json`
- Scripts npm: `deploy:production` exécute juste `build + migration:run` localement
- Aucune CI/CD config (no `.github/workflows`, `.gitlab-ci.yml`, etc.)

**Impact si Non-Mitigé:**
- Impossible de lancer le produit
- Délai supplémentaire 1-2 semaines
- Coût opportunité (market timing)

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-001 in DECISIONS.md
- **Action:** Dockploy + AWS (EC2/RDS PostgreSQL)
- **Timeline:** Sprint 1 (Week 1-2)
- **Owner:** DevOps Lead
- **Cost:** ~$40/mois (EC2 t3.small + RDS db.t3.micro)

**Implementation Plan (ADR-001):**
1. Setup Dockploy platform (Docker automation)
2. Configure AWS EC2/ECS instances (eu-west-1)
3. Setup AWS RDS PostgreSQL
4. Configure environment variables
5. Setup custom domain DNS
6. Configure auto-deploy pipeline

**Status:** ✅ Mitigation Planned - See ADR-001

---

### R2: Mock Data on Artist Pages
**ID:** RISK-002
**Severity:** 🔴 Critical
**Probability:** Certain (100%)
**Impact:** Critical - Platform unusable

**Description:**
Les pages artistes (`/artists/:slug`) utilisent du mock data hard-codé au lieu de connecter à la database réelle.

**Evidence:**
```typescript
// start/routes.ts:36-151
router.get('/artists/:slug', async ({ params, inertia }) => {
  const mockArtist = { /* 100+ lignes de données fictives */ }
  return inertia.render('artists/Show', { artist: mockArtist })
})
```

**Impact si Non-Mitigé:**
- Platform inutilisable (données factices)
- Perte de crédibilité auprès early adopters
- Impossible de valider product-market fit

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-004 in DECISIONS.md
- **Action:** Keep mock data temporarily + Bubble.io → PostgreSQL migration
- **Timeline:** Sprint 3 (Week 5-6)
- **Owner:** Backend Dev
- **Cost:** Migration effort 1-2 semaines

**Implementation Plan (ADR-004):**
- **Phase 1 (Now):** Maintain mock data in routes
- **Phase 2 (Sprint 3):** Migration script Bubble.io → PostgreSQL
- **Phase 3 (Post-migration):** Real ArtistsController with DB queries

**Rationale:** Allows MVP testing while planning complete data migration from legacy Bubble.io database

**Dependencies:**
- Bubble.io API access
- Schema mapping Bubble → PostgreSQL

**Status:** ✅ Mitigation Planned - See ADR-004

---

### R3: Email Notifications Missing
**ID:** RISK-003
**Severity:** 🔴 Critical
**Probability:** Certain (100%)
**Impact:** High - Zero engagement artistes

**Description:**
Système de contact inquiry implémenté mais aucune notification email réelle. TODO dans le code.

**Evidence:**
```typescript
// app/controllers/contact_inquiries_controller.ts:227
private async sendArtistNotification(inquiry, artist) {
  // TODO: Implement email service integration
  console.log(`Notification would be sent...`)
}
```

**Impact si Non-Mitigé:**
- Artistes ne reçoivent jamais les demandes clients
- Taux de réponse = 0%
- Client experience catastrophique
- Churn rate 100%

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-003 in DECISIONS.md
- **Action:** Resend (React Email templates)
- **Timeline:** Sprint 1 (Week 1-2)
- **Owner:** Backend Dev
- **Cost:** Gratuit < 100 emails/day

**Implementation Plan (ADR-003):**
1. Install `resend` package
2. Create React Email templates (`.tsx` components)
3. Implement `sendArtistNotification()` with Resend
4. Configure webhooks (bounce, open, click tracking)
5. Test email delivery end-to-end

**Templates to Create:**
- `ArtistInquiryNotification.tsx` - Nouvelle demande client
- `ClientConfirmation.tsx` - Confirmation envoi
- `ArtistReplyNotification.tsx` - Réponse artiste

**Status:** ✅ Mitigation Planned - See ADR-003

---

## High Risks (P1)

### R4: Local File Storage Not Scalable
**ID:** RISK-004
**Severity:** 🟠 High
**Probability:** Likely (80%)
**Impact:** High - Scalability blocked

**Description:**
Files uploads (tattoo images, inquiry references) stockés localement dans `storage/uploads/`. Non scalable, pas de backup, perdu si container restart.

**Evidence:**
```typescript
// app/controllers/contact_inquiries_controller.ts:34
await file.move(app.makePath('storage/uploads/inquiries'), { name: fileName })
```

**Impact si Non-Mitigé:**
- Limite à ~100 users actifs (disk space)
- Perte de fichiers si deploy/restart
- Pas de CDN (performance globale mauvaise)
- Backup/restore complexe

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-002 in DECISIONS.md
- **Action:** AWS S3 + CloudFront CDN
- **Timeline:** Sprint 1 (Week 1-2)
- **Owner:** Backend Dev
- **Cost:** ~$10/mois (50GB storage + 100GB bandwidth)

**Implementation Plan (ADR-002):**
1. Install `@adonisjs/drive` + S3 driver
2. Configure `config/drive.ts` (AWS credentials, eu-west-1)
3. Create S3 buckets:
   - `blottr-tattoos/` (public, CDN)
   - `blottr-inquiries/` (private, presigned URLs)
   - `blottr-avatars/` (public, CDN)
4. Setup CloudFront distribution (global edge locations)
5. Update upload logic in controllers
6. Migrate existing files (`storage/uploads → S3`)

**Status:** ✅ Mitigation Planned - See ADR-002

---

### R5: No Error Monitoring (Blind in Production)
**ID:** RISK-005
**Severity:** 🟠 High
**Probability:** Likely (70%)
**Impact:** High - Cannot debug prod issues

**Description:**
Aucun error monitoring/tracking configuré. Erreurs production invisibles pour l'équipe.

**Evidence:**
- Pas de Sentry/Datadog config
- Console.error() uniquement (logs perdus)
- MonitoringService custom mais in-memory (volatile)

**Impact si Non-Mitigé:**
- Bugs silencieux en production
- Mauvaise UX client (erreurs non résolues)
- Time to resolution (TTR) très élevé
- Réputation damage

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-006 in DECISIONS.md
- **Action:** Sentry + Better Stack
- **Timeline:** Sprint 1 (Week 1-2)
- **Owner:** DevOps
- **Cost:** Gratuit (5k errors/mois + 1GB logs/mois)

**Implementation Plan (ADR-006):**
1. Install `@sentry/node` + configure in `bin/server.ts`
2. Configure error tracking + performance monitoring (10% sampling)
3. Setup Better Stack for centralized logs
4. Configure alerts (Slack/email)
5. Add breadcrumbs (user actions tracking)
6. Test error capture end-to-end

**Metrics to Track:**
- Error rate (errors/min)
- Affected users %
- Error by endpoint/controller
- Stack traces + context
- APM performance (10% sampling)

**Status:** ✅ Mitigation Planned - See ADR-006

---

### R6: Test Coverage 40% (Quality Risk)
**ID:** RISK-006
**Severity:** 🟠 High
**Probability:** Likely (75%)
**Impact:** Medium - Bugs in production

**Description:**
Coverage tests insuffisant (~40%). Risque bugs en production, régressions non détectées.

**Evidence:**
- 12 fichiers tests unitaires seulement
- Peu de tests fonctionnels
- Aucun test E2E (Playwright configuré mais inutilisé)
- Critical paths non testés (auth flow, contact inquiry)

**Impact si Non-Mitigé:**
- Bugs silencieux déployés en prod
- Régressions fréquentes
- Hotfixes constants (instabilité)
- Perte confiance clients

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-009 in DECISIONS.md
- **Action:** Unit 90% | Functional 70% | E2E 0%
- **Timeline:** Sprint 2 (Week 3-4)
- **Owner:** QA + Dev Team

**Test Strategy (ADR-009):**
```
Unit Tests (90% target):
- Use Cases (RegisterUser, LoginUser)
- Services (MonitoringService, EmailService)
- Repositories (ContactInquiryRepository)
- Validators (VineJS schemas)

Functional Tests (70% target):
- Auth endpoints (POST /inscription, /connexion)
- Contact API (POST /api/contact-inquiries)
- Critical paths

E2E Tests (0% - deferred):
- Playwright configuré mais non utilisé
- À implémenter post-MVP si budget/temps
```

**Tools:**
- Japa (unit + functional)
- Coverage: c8 integrated

**Status:** ✅ Mitigation Planned - See ADR-009

---

## Medium Risks (P2)

### R7: No Analytics Tracking
**ID:** RISK-007
**Severity:** 🟡 Medium
**Probability:** Certain (100%)
**Impact:** Medium - Cannot optimize product

**Description:**
Aucun analytics implémenté. Impossible de mesurer funnel, retention, conversion.

**Evidence:**
- Aucun code analytics (Amplitude/Mixpanel/GA)
- Pas de tracking events
- MonitoringService track seulement API metrics techniques

**Impact si Non-Mitigé:**
- Product decisions aveugles (no data)
- Impossible d'optimiser conversion
- Cannot measure PMF (product-market fit)
- Waste budget features inutiles

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-005 in DECISIONS.md
- **Action:** Amplitude (MVP) → Google Analytics 4 (post free-tier)
- **Timeline:** Sprint 2 (Week 3-4)
- **Owner:** Product + Frontend Dev
- **Cost:** Gratuit (Amplitude 10M events/mois)

**Implementation Plan (ADR-005):**
- **Phase 1 (MVP):** Amplitude (product analytics, funnel, cohorts)
- **Phase 2 (Scale):** Migrate to GA4 (unlimited gratuit)

**Key Events to Track:**
- user_signup, artist_profile_view
- contact_inquiry_submitted
- search_performed

**Status:** ✅ Mitigation Planned - See ADR-005

---

### R8: Database Backup Strategy Missing
**ID:** RISK-008
**Severity:** 🟡 Medium
**Probability:** Possible (40%)
**Impact:** Critical if happens - Data loss

**Description:**
Aucune stratégie backup explicite. Risque perte données en cas d'incident DB.

**Evidence:**
- Aucun script backup visible
- Pas de cron jobs `pg_dump`
- Dépendance totale sur Railway auto-backups (si déployé là)

**Impact si Non-Mitigé:**
- Data loss catastrophique (artists, tattoos, inquiries)
- Impossible recovery
- Business death si perte >1 jour data

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-007 in DECISIONS.md
- **Action:** pg_dump hebdomadaire → AWS S3
- **Timeline:** Sprint 1 (Week 1-2)
- **Owner:** DevOps
- **Cost:** ~$1/mois (S3 storage)

**Implementation Plan (ADR-007):**
1. Weekly automated `pg_dump` (dimanche 3am UTC)
2. Upload to S3 with encryption (AES-256)
3. Retention: 4 weekly + 12 monthly
4. Monthly restore test on staging
5. Document recovery procedure

**RTO/RPO:**
- RTO (Recovery Time Objective): <4h
- RPO (Recovery Point Objective): <7 days (weekly backups)

**Status:** ✅ Mitigation Planned - See ADR-007

---

### R9: RGPD Compliance Unverified
**ID:** RISK-009
**Severity:** 🟡 Medium
**Probability:** Likely (60%)
**Impact:** High - Legal risk, fines

**Description:**
Compliance RGPD non vérifiée. Collecte données personnelles (email, phone, IP, location) sans audit.

**Evidence:**
- Pas de privacy policy visible
- Pas de cookie consent
- Contact inquiries stockent IP address (tracking)
- Aucun mécanisme "right to deletion"
- Data retention policy non définie

**GDPR Checklist:**
- [ ] Privacy policy rédigée et publiée
- [ ] Cookie consent (si analytics cookies)
- [ ] Data minimization (only collect what's needed)
- [ ] Right to access (GDPR Art. 15)
- [ ] Right to deletion (GDPR Art. 17)
- [ ] Right to data portability (GDPR Art. 20)
- [ ] Breach notification process (<72h)
- [ ] Data Processing Agreement (DPA) avec providers

**Impact si Non-Mitigé:**
- Amendes CNIL jusqu'à 4% revenue ou €20M
- Action collective utilisateurs
- Bad PR / perte confiance
- Blocage produit par autorités

**Mitigation Strategy:**
- **Action:** Audit RGPD complet + remediation
- **Timeline:** 2 semaines
- **Owner:** Legal + Product
- **Cost:** Avocat RGPD ~€2-5k one-time

**Implementation:**
1. Privacy policy rédaction (avocat)
2. Cookie consent banner (si analytics)
3. Implement data export endpoint
4. Implement data deletion workflow
5. Update ToS mentions RGPD
6. Staff training RGPD basics
7. DPA avec Mailgun/Cloudinary/etc

**Status:** 🟡 Open - Audit requis avant launch

---

### R10: No CDN (Performance Risk Global)
**ID:** RISK-010
**Severity:** 🟡 Medium
**Probability:** Likely (70%)
**Impact:** Medium - Poor UX outside France

**Description:**
Aucun CDN configuré. Images tattoos servies depuis origin. Performance dégradée hors France/EU.

**Evidence:**
- Images servies depuis `storage/uploads/` (local)
- Aucune config Cloudflare/CloudFront
- Latency élevée pour users US/Asia/Latam

**Impact si Non-Mitigé:**
- Slow page load (>3s LCP)
- High bounce rate international
- Bad Core Web Vitals (SEO penalty)
- Bandwidth cost élevé origin

**Mitigation Strategy:**
- ✅ **Decision Made:** See ADR-002 in DECISIONS.md (included in File Storage)
- **Action:** CloudFront CDN (AWS)
- **Timeline:** Sprint 1 (Week 1-2) - Included with S3 setup
- **Owner:** DevOps
- **Cost:** Included in ~$10/mois (S3 + CloudFront)

**Implementation Plan (ADR-002):**
- CloudFront distribution configured with S3 buckets
- Global edge locations (automatic)
- Use cases: Tattoo images, static assets, user avatars
- Cache TTL: 30 days for images, 1 hour for dynamic content

**Performance Gains Expected:**
- LCP: 3.5s → <2s
- TTFB: 800ms → <200ms
- Bandwidth reduction: -60%

**Status:** ✅ Mitigation Planned - See ADR-002

---

## Low Risks (P3)

### R11: Seeders Incomplete (Dev Friction)
**ID:** RISK-011
**Severity:** 🟢 Low
**Probability:** Certain (100%)
**Impact:** Low - Developer productivity

**Description:**
Seulement 1 seeder (cities). Pas de seeders artists/tattoos/tags. Hard to develop/test.

**Evidence:**
- `database/seeders/` contient seulement `1_city_seeder.ts`
- Devs doivent créer données manuellement via UI (slow)

**Impact si Non-Mitigé:**
- Onboarding lent nouveaux devs
- Tests manuels pénibles
- Cannot reproduce bugs facilement

**Mitigation Strategy:**
- **Action:** Créer seeders complets
- **Timeline:** 2 jours
- **Owner:** Backend Dev

**Seeders Needed:**
1. `2_artist_seeder.ts` - 20 artistes variés (styles différents)
2. `3_salon_seeder.ts` - 10 salons (villes majeures)
3. `4_tattoo_seeder.ts` - 100 tattoos (portfolio diversifié)
4. `5_tag_seeder.ts` - Tags populaires par catégorie
5. `6_contact_inquiry_seeder.ts` - Demandes test (statuts variés)

**Strategy:** Factorys pattern (Lucid Factories)

**Status:** 🟢 Open - Nice to have pour DX

---

### R12: No CI/CD Pipeline
**ID:** RISK-012
**Severity:** 🟢 Low
**Probability:** Certain (100%)
**Impact:** Low - Manual deployment friction

**Description:**
Aucun CI/CD automatisé. Deployments manuels, tests pas auto-run, pas de quality gates.

**Evidence:**
- Pas de `.github/workflows/`
- Pas de `.gitlab-ci.yml` ou `.circleci/config.yml`
- Scripts npm uniquement (manuels)

**Impact si Non-Mitigé:**
- Human error deployments
- Oubli run tests avant deploy
- Rollback complexe (manual)
- Slow deployment cycle

**Mitigation Strategy:**
- **Action:** Setup GitHub Actions CI/CD
- **Timeline:** 1-2 jours
- **Owner:** DevOps
- **Cost:** Gratuit (GitHub Actions 2000 min/mois)

**Pipeline Stages:**
```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    - npm run lint
    - npm run typecheck
    - npm test
    - npm run test:coverage (fail if <90%)

  deploy:
    if: branch == 'main'
    - npm run build
    - Deploy to Railway (auto)
    - Run migrations
    - Smoke tests
    - Notify Slack
```

**Quality Gates:**
- Tests pass
- Coverage ≥90%
- TypeScript zero errors
- Lint pass
- Build success

**Status:** 🟢 Open - Amélioration DevOps

---

## Risk Mitigation Timeline (Updated with Decisions)

### ✅ Sprint 1 (Week 1-2) - Infrastructure Setup
- [ ] R1: Setup Dockploy + AWS deployment (ADR-001)
- [ ] R3: Integrate Resend email service (ADR-003)
- [ ] R4: Migrate to AWS S3 + CloudFront (ADR-002)
- [ ] R5: Integrate Sentry + Better Stack (ADR-006)
- [ ] R8: Setup pg_dump backups → S3 (ADR-007)
- [ ] R10: CloudFront CDN (included in R4/ADR-002)

**Milestone:** MVP Infrastructure Ready

---

### ✅ Sprint 2 (Week 3-4) - Quality & Monitoring
- [ ] R6: Increase test coverage to 90% unit / 70% functional (ADR-009)
- [ ] R7: Implement Amplitude analytics (ADR-005)

**Milestone:** Production-Ready Quality

---

### ✅ Sprint 3 (Week 5-6) - Data Migration
- [ ] R2: Bubble.io → PostgreSQL migration (ADR-004)
- [ ] Create real ArtistsController with DB queries

**Milestone:** Real Data Integration

---

### ⏳ Backlog - Open Items
- [ ] R9: RGPD compliance audit (2 semaines) - Legal team
- [ ] R11: Complete seeders (2 jours)
- [ ] R12: Setup CI/CD pipeline (1-2 jours)

---

## Risk Monitoring Dashboard

**KPIs to Track:**
- Open critical risks: Target 0
- Average time to close risk: Target <2 weeks
- New risks identified per sprint: Trend
- Risk mitigation budget spent: Track vs plan

**Review Cadence:**
- Daily: Critical risks review
- Weekly: All risks status update
- Monthly: Risk register refresh

---

**Version:** 1.0.0
**Last Updated:** 2025-10-05
**Next Review:** Weekly sprint planning
