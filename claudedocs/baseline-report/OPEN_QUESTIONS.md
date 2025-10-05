# Open Questions - Blottr Baseline

Questions bloquantes et ambiguïtés identifiées lors de l'analyse du codebase.

**Status:** ✅ Questions P0-P1 résolues (voir DECISIONS.md) | ⏳ Questions P2 en suspens

---

## ✅ P0: Bloquant Production (RESOLVED)

### Q1: Plateforme de Déploiement Target ✅
**Status:** ✅ DECIDED - See ADR-001 in DECISIONS.md

**Decision:** Dockploy + AWS (EC2/RDS)
- Platform: Dockploy (Docker automation)
- Cloud: AWS EC2/ECS + RDS PostgreSQL
- Region: EU-West-1 (Ireland) for GDPR
- Cost: ~$40/mois

---

### Q2: Service Email pour Notifications ✅
**Status:** ✅ DECIDED - See ADR-003 in DECISIONS.md

**Decision:** Resend (React Email templates)
- Provider: Resend
- Templates: React components → HTML
- Cost: Gratuit < 100 emails/day
- Features: Excellent deliverability, EU region, webhooks

**Code Implementation:**
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

---

### Q3: Mock Data sur Pages Artistes ✅
**Status:** ✅ DECIDED - See ADR-004 in DECISIONS.md

**Decision:** Maintenir mock data temporairement + migration Bubble.io → PostgreSQL
- Phase 1: Keep mock data (`/artists/:slug`)
- Phase 2: Migration Bubble.io → PostgreSQL (1-2 semaines)
- Phase 3: Real ArtistsController with DB queries

**Rationale:** Future migration from Bubble.io database, mock data allows MVP testing while planning data migration.

---

## ✅ P1: Important (RESOLVED)

### Q4: Stratégie File Storage ✅
**Status:** ✅ DECIDED - See ADR-002 in DECISIONS.md

**Decision:** AWS S3 + CloudFront CDN
- Storage: AWS S3 (eu-west-1)
- CDN: CloudFront (global edge locations)
- Buckets:
  - `blottr-tattoos/` (public, CDN)
  - `blottr-inquiries/` (private, presigned URLs)
  - `blottr-avatars/` (public, CDN)
- Cost: ~$10/mois (50GB + 100GB bandwidth)

---

### Q5: Analytics Platform ✅
**Status:** ✅ DECIDED - See ADR-005 in DECISIONS.md

**Decision:** Amplitude (MVP) → Google Analytics 4 (post free-tier)
- Phase 1 (MVP): Amplitude (free 10M events/mois)
- Phase 2 (Scale): Google Analytics 4 (unlimited gratuit)
- Events: user_signup, artist_profile_view, contact_inquiry_submitted, search_performed

---

### Q6: Payment Provider (Future) ✅
**Status:** ✅ DECIDED - See ADR-008 in DECISIONS.md

**Decision:** Stripe Connect
- Provider: Stripe Connect (marketplace features)
- Use cases: Commission 15-20%, subscriptions, featured listings
- Cost: 1.4% + €0.25 per transaction
- Timeline: MVP+2 (après validation traction)

---

### Q7: Test Strategy & Coverage ✅
**Status:** ✅ DECIDED - See ADR-009 in DECISIONS.md

**Decision:** Unit 90% | Functional 70% | E2E 0%
- Unit Tests: 90% target (use cases, services, repositories)
- Functional Tests: 70% target (auth, contact, critical paths)
- E2E Tests: 0% (Playwright configuré mais deferred post-MVP)
- Timeline: 2-3 semaines

---

## ✅ P2: Amélioration (RESOLVED)

### Q8: Monitoring & Observability ✅
**Status:** ✅ DECIDED - See ADR-006 in DECISIONS.md

**Decision:** Sentry + Better Stack
- Errors: Sentry (5k errors/mois gratuit)
- Logs: Better Stack (1GB/mois gratuit)
- APM: Sentry performance monitoring (10% sampling)
- Cost: Gratuit pour MVP

---

### Q9: Database Backup Strategy ✅
**Status:** ✅ DECIDED - See ADR-007 in DECISIONS.md

**Decision:** pg_dump hebdomadaire → AWS S3
- Frequency: Weekly (dimanche 3am UTC)
- Storage: AWS S3 with encryption (AES-256)
- Retention: 4 weekly + 12 monthly
- Testing: Monthly recovery test on staging
- Cost: ~$1/mois

---

### Q10: CDN & Performance ✅
**Status:** ✅ DECIDED - See ADR-002 in DECISIONS.md

**Decision:** CloudFront (included in ADR-002 File Storage)
- CDN: CloudFront global edge locations
- Use cases: Tattoo images, static assets, user avatars
- Integration: S3 bucket + CloudFront distribution
- Cost: Included in ~$10/mois S3+CloudFront

---

### Q11: Internationalization ✅
**Status:** ✅ DECIDED - See ADR-011 in DECISIONS.md

**Decision:** Full FR (pas d'internationalisation)
- Langue unique: Français
- Hard-coded strings acceptés (no i18n framework)
- Rationale: Market initial France, focus PMF local
- Future: i18n post-PMF si expansion (effort: 2-3 semaines)

---

### Q12: SEO Strategy ✅
**Status:** ✅ DECIDED - See ADR-010 in DECISIONS.md

**Decision:** SEO basique MVP → optimisation post-launch
- Phase 1 (MVP):
  - Sitemap.xml automatique
  - Meta tags (title, description, OG)
  - Slugs SEO-friendly ✓
  - robots.txt
  - Schema.org markup (Artist, LocalBusiness)
- Phase 2 (Post-launch): Content marketing, link building, local SEO
- Effort MVP: 1-2 jours

---

## ⏳ P2: Questions Restantes (TO BE DECIDED)

---

### Q13: Admin Dashboard
**Question:** Interface admin prévue pour modération?

**Besoins Identifiés:**
- Vérification artistes/salons (workflow complexe)
- Modération tattoos (pending_review)
- Gestion contact inquiries (spam detection)
- Analytics dashboard
- User management

**Questions:**
- Admin panel custom ou solution SaaS (Retool, Forest Admin)?
- Rôles admin (super-admin, moderator, support)?
- Audit trail nécessaire?

**Impact:** Scalability opérationnelle

**Proposition:** Admin custom AdonisJS (routes /admin) avec ACL

---

### Q14: Legal & RGPD
**Question:** Compliance RGPD assurée?

**Checklist:**
- [ ] Privacy policy rédigée
- [ ] Cookie consent (si analytics)
- [ ] Data retention policy (contact_inquiries, users)
- [ ] Right to deletion (GDPR Article 17)
- [ ] Data export (GDPR Article 20)
- [ ] DPO nommé (si > 250 employees)
- [ ] Breach notification process

**Impact:** Legal risk, amendes CNIL

**Action Required:** Audit RGPD complet avant production

---

### Q15: Mobile App Strategy
**Question:** App mobile native prévue ou PWA suffisant?

**Options:**
- PWA (Inertia responsive + manifest.json)
- React Native (code sharing avec web)
- Native iOS/Android (double dev)

**Informations Manquantes:**
- Budget
- Timeline
- Features mobile-specific (géoloc push, camera)

**Impact:** User acquisition mobile

**Proposition:** PWA en priorité, React Native si traction

---

## Méthodes pour Lever les Ambiguïtés

### Technique 1: Code Review Session
- Review avec PO/VP Eng
- Identifier TODOs critiques
- Prioriser questions P0/P1/P2

### Technique 2: Spike Stories
- Prototypes techniques pour options incertaines
- Timeboxed (1-2 jours max)
- Decision matrix (cost/benefit)

### Technique 3: User Research
- Interviews artistes (besoins réels)
- Analytics competitors (quel stack)
- MVP validation (features minimum)

### Technique 4: Architecture Decision Records (ADR)
- Documenter choix techniques
- Rationale + alternatives
- Versionné dans codebase

---

## Prioritization Matrix

| Question | Priority | Blocking | Effort | Decision By |
|----------|----------|----------|--------|-------------|
| Q1: Deployment platform | P0 | Yes | Low | PO + DevOps |
| Q2: Email service | P0 | Yes | Medium | PO + Dev |
| Q3: Mock data | P0 | Yes | Medium | Dev Team |
| Q4: File storage | P1 | No | Medium | Arch + Finance |
| Q5: Analytics | P1 | No | Medium | PO + Growth |
| Q6: Payments | P1 | No | High | PO + Finance |
| Q7: Test strategy | P1 | No | High | QA + Dev |
| Q8: Monitoring | P2 | No | Medium | DevOps |
| Q9: Backups | P2 | No | Low | DevOps |
| Q10: CDN | P2 | No | Low | DevOps |
| Q11: i18n | P2 | No | High | PO |
| Q12: SEO | P2 | No | Medium | Marketing |
| Q13: Admin panel | P2 | No | High | PO + Dev |
| Q14: RGPD | P2 | No | Medium | Legal |
| Q15: Mobile app | P3 | No | Very High | PO + Exec |

---

**Next Steps:**
1. Schedule architecture review meeting
2. Create decision log (ADR)
3. Timeboxed spikes for P0 questions
4. Update roadmap with decisions

---

**Version:** 1.0.0
**Last Updated:** 2025-10-05
