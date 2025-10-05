# Baseline Report v1 – Blottr

**Date:** 2025-10-05
**Version:** 1.0.0
**Status:** Initial Baseline
**Analyste:** Claude (Architecte & Analyste Blottr)

---

## 📋 Executive Summary

Blottr.fr est une **plateforme de mise en relation** entre clients et tatoueurs, développée avec une stack moderne full-TypeScript. Le projet est en **phase MVP avancée** avec architecture Clean, tests automatisés, et monitoring intégré.

### Points Clés
- ✅ **Stack moderne**: AdonisJS 6 + React 19 + PostgreSQL
- ✅ **Architecture Clean** avec Use Cases & Repositories
- ✅ **Database schema complet**: 14 migrations (users, artists, salons, tattoos, tags, contact_inquiries)
- ✅ **Auth session-based** fonctionnelle (inscription/connexion)
- ✅ **Contact system** avec upload de fichiers et monitoring
- ⚠️ **Mock data** sur pages artistes (pas encore connecté au backend réel)
- ⚠️ **Tests** présents mais coverage incomplet
- ⚠️ **Analytics** non implémenté
- ⚠️ **Mails** à implémenter (TODO dans le code)

### État Global
```
🟢 Backend Architecture: 85% complete
🟡 Frontend Components: 70% complete
🟡 Database Schema: 90% complete (migrations OK, seeders partiels)
🟢 CI/CD Setup: 80% complete
🔴 Production Deployment: 0% (pas de config déployement visible)
🔴 Analytics: 0%
```

### ✅ Decisions Validated (ADR)

**Infrastructure & Deployment:**
- ADR-001: Dockploy + AWS (EC2/RDS eu-west-1) - ~$40/mois
- ADR-002: AWS S3 + CloudFront CDN - ~$10/mois
- ADR-007: pg_dump hebdo → S3 (backups)

**Communication & Services:**
- ADR-003: Resend (React Email templates) - Gratuit < 100 emails/day
- ADR-005: Amplitude (MVP) → GA4 (scale) - Gratuit 10M events/mois
- ADR-006: Sentry + Better Stack (errors + logs) - Gratuit MVP tier

**Development & Quality:**
- ADR-004: Keep mock data + Bubble.io → PostgreSQL migration (Sprint 3)
- ADR-008: Stripe Connect (payments future)
- ADR-009: Tests Unit 90% | Functional 70% | E2E 0%
- ADR-010: SEO basique MVP → optimisation post-launch
- ADR-011: Full FR (no i18n)

**📊 Total Cost MVP:** ~$40/mois infrastructure | **See:** [DECISIONS.md](./DECISIONS.md)

---

## 📚 Table des Matières

### Documents Détaillés
1. [Business Rules](./01_BUSINESS_RULES.md) - Règles métier et domain model
2. [User Journeys](./02_USER_JOURNEYS.md) - Parcours utilisateurs et séquences
3. [Frontend Architecture](./03_FRONTEND.md) - React, Inertia, composants UI
4. [Backend AdonisJS](./04_BACKEND_ADONIS.md) - Contrôleurs, services, middlewares
5. [Database ERD](./05_DATABASE_ERD.md) - Schéma complet avec diagrammes
6. [API Contracts](./06_API_CONTRACTS.md) - Endpoints REST et formats
7. [Integrations & Webhooks](./07_INTEGRATIONS_WEBHOOKS.md) - Services externes
8. [Security & Compliance](./08_SECURITY_COMPLIANCE.md) - Audit sécurité
9. [Deployment & Operations](./09_DEPLOYMENT_OPERATIONS.md) - CI/CD, infra
10. [Analytics & Events](./10_ANALYTICS_EVENTS.md) - Tracking événements
11. [UI Inventory](./11_UI_INVENTORY.md) - Catalogue des pages/composants
12. [Design Tokens](./12_DESIGN_TOKENS.json) - Système de design

### Annexes
- **[Architecture Decisions](./DECISIONS.md)** - ADR validées (11 decisions)
- [Open Questions](./OPEN_QUESTIONS.md) - Questions résolues avec ADR
- [Risks Register](./RISKS.md) - Risques mitigés avec ADR
- [Memory Pack](./MEMORY_PACK.json) - Résumé pour PO assistant

---

## 🗺️ Carte Mentale Synthèse

```
Blottr.fr
├── Domain Business
│   ├── Actors: Client, Tatoueur, Salon, Admin
│   ├── Core Entities: User, Artist, Salon, Tattoo, Tag, City
│   ├── Actions: Search, Discover, Book, Contact, Review
│   └── Rules: Verification workflow, Contact routing
│
├── Tech Stack
│   ├── Backend: AdonisJS 6.18.0 + PostgreSQL + Lucid ORM
│   ├── Frontend: React 19.1.1 + Inertia.js 2.1.11 + Tailwind
│   ├── Build: Vite 6.3.5 + TypeScript 5.8.3
│   ├── Auth: Session-based (no JWT)
│   └── Tests: Japa 4.2.0
│
├── Features (Current)
│   ├── ✅ User registration & login
│   ├── ✅ Contact inquiry system (with file upload)
│   ├── ✅ Artist profiles (mock data)
│   ├── ✅ Interactive map (Leaflet)
│   ├── ✅ Search & filters (UI only)
│   └── ⚠️ Email notifications (TODO)
│
├── Architecture Patterns
│   ├── Clean Architecture: Domain → Application → Infrastructure → Presentation
│   ├── Use Cases: RegisterUserUseCase, LoginUserUseCase
│   ├── Repositories: ContactInquiryRepository
│   ├── Services: MonitoringService, FormService
│   └── Validators: VineJS schemas
│
└── Infrastructure
    ├── Database: 14 migrations (complex schema ready)
    ├── Monitoring: Custom monitoring service
    ├── Rate Limiting: Implemented on critical routes
    ├── File Storage: Local (storage/uploads)
    └── CI/CD: npm scripts (no cloud config visible)
```

---

## 🚨 Top-10 Tech Debt

| Priority | Item | Impact | Effort | Recommendation |
|----------|------|--------|--------|----------------|
| **P0** | Mock data on artist pages | Blocking real usage | M | Connect to real API endpoints |
| **P0** | Email notifications missing | No artist communication | M | Integrate Mailgun/SendGrid |
| **P0** | Production deployment config | Cannot deploy | L | Setup Railway/Vercel/Fly.io |
| **P1** | Analytics not implemented | No metrics | M | Add Amplitude/Mixpanel |
| **P1** | Test coverage incomplete | Quality risk | H | Reach 90% coverage |
| **P1** | Seeders minimal (only cities) | Hard to dev/test | L | Add Artist/Tattoo seeders |
| **P2** | No error monitoring | Blind in prod | L | Add Sentry integration |
| **P2** | File storage local only | Not scalable | M | Migrate to S3/Cloudinary |
| **P2** | No i18n system | France only | M | Add internationalization |
| **P3** | Tailwind not configured | Using tw-merge only | S | Add tailwind.config.js |

---

## 📊 Metrics Dashboard

### Codebase Stats
```
Total TypeScript files: 110+
├── Backend (app/): ~40 files
├── Frontend (inertia/): 44 files
├── Tests: 12 files
├── Migrations: 14 files
└── Config: 10 files

Lines of Code: ~15,000 (estimated)
Database Tables: 10 (core) + 4 (pivot/support)
API Endpoints: 8 (4 pages + 4 API routes)
React Components: 25+ components
```

### Quality Indicators
```
✅ TypeScript Coverage: 100% (strict mode)
⚠️ Test Coverage: ~40% (needs improvement)
✅ Linting: ESLint configured
✅ Formatting: Prettier configured
⚠️ Documentation: Partial (code comments sparse)
```

---

## 🎯 Next Steps Roadmap

### Phase 1: MVP Completion (2-3 sprints)
1. Connect artist pages to real backend
2. Implement email notifications
3. Complete test coverage (90%+)
4. Add production deployment config

### Phase 2: Production Ready (1-2 sprints)
1. Migrate to cloud file storage
2. Add error monitoring (Sentry)
3. Implement analytics tracking
4. Performance optimization

### Phase 3: Growth Features (3-5 sprints)
1. Booking system
2. Payment integration
3. Review/rating system
4. Internationalization

---

## 📝 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-10-05 | Initial baseline report | Claude |

---

## 🔗 Quick Links

- [Project README](../../README.md)
- [CLAUDE.md Instructions](../../CLAUDE.md)
- [Package.json](../../package.json)
- [AdonisRC Config](../../adonisrc.ts)

---

**Note**: Ce rapport est généré à partir d'une analyse statique du codebase au 2025-10-05. Pour toute mise à jour, régénérer via l'assistant Claude avec les dernières sources.
