# Blottr.fr - Knowledge Base & Documentation

## Description du projet

**Blottr.fr** est une plateforme moderne de mise en relation entre clients et artistes tatoueurs. Elle combine un système de scraping Instagram pour pré-populer la base d'artistes avec un workflow d'onboarding automatique pour convertir les profils scrapés en artistes vérifiés. La plateforme facilite la recherche d'artistes et la prise de contact tout en gérant un écosystème complexe de salons, artistes indépendants, et multi-établissements.

## Objectifs

1. **Marketplace Pré-populé** : Créer une base de données riche d'artistes tatoueurs via scraping Instagram avant même leur inscription
2. **Onboarding Automatique** : Convertir automatiquement les contacts clients en opportunités d'inscription pour les artistes
3. **Écosystème Flexible** : Supporter les artistes indépendants, multi-salons, et invités dans un système unifié
4. **Workflow Simplifié** : Faciliter le processus Recherche → Contact → Discussion sans complexité de paiement

## Features principales

### Utilisateurs de l'application

1. **Clients (role=1)** :
    - Recherche d'artistes tatoueurs par style, localisation, disponibilité
    - Consultation de portfolios et profils d'artistes (vérifiés et non-vérifiés)
    - Prise de contact avec les artistes (déclenchant l'onboarding si nécessaire)
    - Gestion des rendez-vous et discussions
    - Gestion du profil et historique des contacts
2. **Artistes (role=2)** :
    - Validation et enrichissement de profil auto-généré depuis Instagram
    - Gestion multi-salons et statut indépendant
    - Réception et gestion des demandes de contact
    - Planification et gestion des rendez-vous
    - Portfolio et galerie de tatouages avec système de tags

## User-Stories principales

### Clients

1. **Recherche & Découverte** :
    - En tant que client, je veux rechercher des artistes par style de tatouage pour trouver celui qui correspond à mes goûts.
    - En tant que client, je veux filtrer par localisation pour trouver des artistes près de chez moi.
    - En tant que client, je veux voir des portfolios complets pour évaluer le travail des artistes.
2. **Contact & Communication** :
    - En tant que client, je veux contacter un artiste directement pour discuter de mon projet :
        - Envoi de message avec description du projet
        - Photos de référence et inspiration
        - Discussion sur la faisabilité et timing
    - En tant que client, je veux prendre rendez-vous avec un artiste vérifié.
3. **Gestion de Profil** :
    - En tant que client, je veux gérer mon profil avec les éléments suivants :
        - **Informations personnelles** : nom, email, téléphone
        - **Préférences** : styles préférés, budget approximatif
        - **Historique** : contacts précédents, rendez-vous passés
        - **Favoris** : artistes et designs sauvegardés
        - **Photos** : inspirations et références personnelles
    - En tant que client, je veux suivre l'historique de mes contacts pour garder une trace des discussions :
        - Statut des demandes (en attente, contacté, répondu)
    - En tant que client, je veux recevoir des notifications quand un artiste me répond.

### Artistes

1. **Gestion de Profil** :
    - En tant qu'artiste, je veux valider et compléter mon profil auto-généré depuis Instagram.
    - En tant qu'artiste, je veux gérer ma présence dans plusieurs salons ou déclarer mon statut indépendant.
    - En tant qu'artiste, je veux gérer mon portfolio avec tags et catégories.

## Implémentation technique

### 🔐 Authentification & Sécurité

- **Session-based Authentication** via AdonisJS Auth pour la connexion utilisateur
- **Token-based API** pour les intégrations externes et services automatisés
- **Role-based Access Control** avec rôles clients/artistes intégrés au modèle User
- **Rate Limiting** pour sécuriser les endpoints API et prévenir l'abuse

### 🤖 Intelligence Artificielle & Automatisation

- **Instagram Scraping** : Extraction automatique de profils d'artistes depuis Instagram
- **Email Automation** : Workflows d'onboarding automatiques via système de jobs
- **Content Categorization** : Classification automatique des styles de tatouage
- **Search & Recommendation** : Algorithmes de recherche et suggestions personnalisées

## Initial Scope

### Version 0 (MVP)

**Fonctionnalités :**

1. **Système d'Authentification** :
    - Inscription/connexion clients et artistes
    - Gestion des sessions et tokens
    - Profils utilisateur de base
2. **Base de Données Artistes** :
    - Modèle Artist avec statuts de vérification :
        - **scraped** : Profil automatiquement créé depuis Instagram
        - **contacted** : Artiste contacté pour onboarding
        - **onboarding** : En cours d'inscription
        - **verified** : Profil complet et vérifié
    - Système multi-salons via table pivot artist_salon :
        - Support des artistes indépendants (salon_id nullable)
        - Support des artistes invités (is_guest flag)
        - Gestion des relations multiples (primary salon + guest salons)
    - Portfolio avec système de tags many-to-many :
        - Photos de tatouages avec descriptions
        - Tags catégorisés (styles, techniques, body parts)
        - Prix indicatifs et statut flash/custom
3. **Système de Contact** :
    - Limitation : contact simple sans négociation complexe
    - Workflow d'upgrade : contact → onboarding automatique pour artistes non-vérifiés
4. **Interface Utilisateur** :
    - Recherche et filtres d'artistes
    - Pages de profils artistes
    - Formulaires de contact
    - Dashboard client et artiste
5. **Pages Légales & Informatives** :
    - À propos, CGU, Politique de confidentialité
    - FAQ et support client
6. **Automatisation Core** :
    - Jobs d'envoi d'emails d'onboarding
    - Système de notifications internes
    - Monitoring des statuts d'artistes
7. **Rendez-vous** :
    - Système de prise de rendez-vous basique
8. **Conformité RGPD** :
    - Gestion des consentements pour scraping
    - Export de données utilisateur
    - Droit à l'oubli et soft deletes

## Choix initial des technologies

### Main technologies

- Node v20+
- TypeScript v5.8+

### Paradigms

- **Clean Architecture** → Organise the system into clear layers (application, domain, infrastructure). Maintain modularity to ensure scalability, use-case based!
- **Feature-Driven Development (FDD)** → Categorize and structure features efficiently, ensuring that they remain self-contained and manageable.
- **Domain-Driven Design (DDD)** → Focus on business-driven architecture using Entities, Aggregates, Value Objects, Repositories, and Services to enforce domain consistency.
- **Behavior-Driven Development (BDD)** → When working on user stories, test files, or Gherkin scenarios, focus on real-world user behavior to drive system design.
- **SOLID Principles** → Maintain single responsibility, modularity, and decoupling to ensure long-term maintainability and flexibility.

### CI

- GitHub Actions
- GitHub
- Renovate
- Semantic Release
- CodeQL
- OWASP Dependency-Check

### Infrastructure

- Docker
- Docker Compose

### Database

- PostgreSQL 16
- Lucid ORM (AdonisJS)
- UUID Primary Keys
- JSONB for flexible data (tags.variants)

### Backend

- AdonisJS v6 (TypeScript)
- Japa Testing Framework
- VineJS Validation
- RESTful API Architecture
- Pino Logging

### Authentication

- Session-based Authentication (AdonisJS Auth)
- Access Token Management (auth_access_tokens table)

### Security

- AdonisJS Shield (XSS, CSRF protection)
- CORS Configuration
- Input Validation (VineJS)
- Rate Limiting

### Automation

- AdonisJS Jobs (BullMQ integration)
- Email Automation Workflows
- Instagram Scraping Jobs

### Frontend

- React 19
- Inertia.js (SPA-like experience with server routing)
- Vite (Build tool)
- TypeScript
- CSS (base styling)

## LLM Integration Concepts

### Context7 Integration
- **Automatic Documentation**: Utilisation systématique de Context7 pour la documentation des librairies
- **Code Generation**: Patterns d'implémentation basés sur la documentation officielle
- **Best Practices**: Application des bonnes pratiques spécifiques à chaque framework

### Development Workflow with AI
- **Schema-First Development**: Génération de modèles et migrations depuis les schémas ER
- **Automated Testing**: Génération de tests basés sur les user stories
- **Code Review**: Analyse automatique de la qualité et conformité du code
- **Documentation Sync**: Mise à jour automatique de la documentation projet

### Knowledge Management
- **Project Memory**: Système de mémoire persistante pour les décisions architecturales
- **Pattern Recognition**: Identification et réutilisation des patterns de code
- **Evolution Tracking**: Suivi des changements et impact sur l'architecture

## 🔗 Conventional Commit guide

https://github.com/BryanLomerio/conventional-commit-cheatsheet

Each commit message follows this structure:

- **type**: Describes the change (e.g., `feat`, `fix`, `chore`)
- **scope**: Optional. Refers to the area of the project being affected (e.g., `api`, `frontend`, `db`)
- **description**: A short description of the change.

### 📋 Types of Commit

1. **feat**: A new feature for the user or system
    - Example: `feat(auth): add Instagram-based artist onboarding`
2. **fix**: A bug fix for the user or system
    - Example: `fix(contact): resolve issue with artist notification emails`
3. **chore**: Routine tasks like maintenance or updating dependencies
    - Example: `chore(deps): update @adonisjs/core to version 6.18.0`
4. **docs**: Documentation updates
    - Example: `docs(api): update artist verification workflow`
5. **style**: Changes related to code style (e.g., formatting, missing semi-colons)
    - Example: `style(models): fix indentation in artist.ts`
6. **refactor**: Code change that neither fixes a bug nor adds a feature
    - Example: `refactor(auth): simplify role-based access control`
7. **test**: Adding or updating tests
    - Example: `test(artist): add unit tests for verification status changes`
8. **db**: Database-related changes (migrations, seeders)
    - Example: `db(migration): add artist_salon pivot table`
9. **api**: Updates to API contracts or integrations
    - Example: `api(artist): add endpoint for multi-salon management`

### Additional Commit Types

- **security**: Security fixes or improvements
    - Example: `security(auth): add rate limiting to contact endpoints`
- **perf**: Code changes that improve performance
    - Example: `perf(search): optimize artist search queries with indexes`

## Frontend URLs

- **Dynamic Parameters** → URLs utilisent des paramètres dynamiques ( `/artists/:id`, `/salons/:slug` ).
- **Query Parameters** → Pour les filtres de recherche ( `?style=traditional&city=paris` ).
- **Hash Routing** → Pour la navigation dans les SPAs ( `#/profile/settings` ).

### 🔓 Public (Accessible sans connexion)

- `/` → Page d'accueil avec recherche d'artistes
- `/artists/` → Liste publique des artistes vérifiés
- `/artists/:id` → Profil public d'un artiste
- `/salons/` → Annuaire des salons partenaires
- `/about/` → À propos de la plateforme

### 🔐 Privé (Accessible après connexion)

- `/dashboard` → Dashboard principal selon le rôle
- `/profile` → Gestion du profil utilisateur
- `/contacts` → Historique des contacts et messages
- `/appointments` → Gestion des rendez-vous
- `/artists/:id/contact` → Formulaire de contact d'un artiste

### ⚙️ Admin (Réservé aux administrateurs)

- `/admin/` → Dashboard administrateur
- `/admin/artists` → Gestion des artistes et vérifications
- `/admin/onboarding` → Suivi des processus d'onboarding

## Backend URLs

- API sur configuration locale : "localhost:3333"

### 🔑 Sécurisation des Permissions API

- **Session-based + Token-based** utilisés pour gérer les accès API.
- **3 niveaux d'accès :**
    - i. **Client** → Accès recherche, contact, profil personnel
    - ii. **Artiste** → Accès gestion profil, portfolio, rendez-vous
    - iii. **Admin** → Accès complet système, gestion utilisateurs, analytics

## Project Structure

```
.
├── app/
│   ├── models/                    # 10 Lucid models avec relations
│   │   ├── user.ts               # Users avec roles (client=1, artist=2)
│   │   ├── artist.ts             # Artists avec Instagram integration
│   │   ├── salon.ts              # Salons de tatouage
│   │   ├── shop.ts               # Boutiques/chaînes
│   │   ├── tattoo.ts             # Portfolio des tatouages
│   │   ├── tag.ts                # Tags pour catégorisation
│   │   ├── appointment.ts        # Système de rendez-vous
│   │   ├── contact_request.ts    # Demandes de contact
│   │   ├── artist_onboarding.ts  # Processus d'onboarding
│   │   └── auth_access_token.ts  # Gestion des tokens
│   ├── controllers/              # HTTP controllers
│   ├── middleware/               # Request middleware
│   ├── validators/               # VineJS validators
│   ├── exceptions/               # Custom exceptions
│   └── services/                 # Business logic services
├── database/
│   └── migrations/               # 12 migrations pour schema complet
│       ├── *_create_users_table.ts
│       ├── *_create_artists_table.ts
│       ├── *_create_salons_table.ts
│       ├── *_create_shops_table.ts
│       ├── *_create_tattoos_table.ts
│       ├── *_create_tags_table.ts
│       ├── *_create_appointments_table.ts
│       ├── *_create_contact_requests_table.ts
│       ├── *_create_artist_onboarding_table.ts
│       ├── *_create_auth_access_tokens_table.ts
│       ├── *_create_artist_salons_table.ts    # Pivot many-to-many
│       └── *_create_tag_tattoos_table.ts      # Pivot many-to-many
├── inertia/
│   ├── pages/                    # React page components
│   ├── app/                      # React app setup (app.tsx, ssr.tsx)
│   └── css/                      # Stylesheets
├── config/                       # Configuration files
├── start/
│   ├── routes.ts                 # HTTP routes definition
│   └── kernel.ts                 # HTTP kernel configuration
├── tests/                        # Test files
├── docker-compose.yml            # PostgreSQL local setup
├── CLAUDE.md                     # Claude Code guidance
└── KNOWLEDGE_BASE.md             # This file
```

## Database Schema Summary

### Core Relationships

```typescript
// Users System
User (UUID, role: 1|2)
  → hasMany(ContactRequest) // Clients contacting artists
  → hasMany(Appointment)    // Bookings
  → hasMany(AuthAccessToken) // API tokens

// Artists Multi-Salon System
Artist (UUID, verification_status: 'scraped'|'contacted'|'onboarding'|'verified')
  → belongsTo(Salon) // Primary salon (nullable for independents)
  → manyToMany(Salon) via artist_salon // Multi-salon support
  → hasMany(Tattoo) // Portfolio
  → hasMany(ContactRequest) // Incoming contacts
  → hasMany(ArtistOnboarding) // Verification process

// Content System
Tattoo (UUID)
  → belongsTo(Artist)
  → belongsTo(Salon) // Where tattoo was done
  → manyToMany(Tag) via tag_tattoo // Categorization

// Contact & Onboarding Workflow
ContactRequest → triggers → ArtistOnboarding → Email Automation
```

### Key Features

1. **Instagram Integration**: Artists auto-created from scraping with verification workflow
2. **Multi-Salon Support**: Artists can work in multiple establishments or be independent
3. **Automated Onboarding**: Contact requests trigger email workflows for unverified artists
4. **Flexible Portfolio**: Tattoos with tags, pricing, and salon attribution
5. **UUID-based**: All primary keys use UUIDs for better scalability

## Additional Files

⚠️ **IMPORTANT**: These files must be taken very seriously as they represent the latest up-to-date versions of our codebase. You MUST rely on these versions and their content imperatively.

### package.json (Root)

```json
{
  "name": "blottr.fr",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "license": "UNLICENSED",
  "scripts": {
    "start": "node bin/server.js",
    "build": "node ace build",
    "dev": "node ace serve --hmr",
    "test": "node ace test",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@adonisjs/auth": "^9.4.0",
    "@adonisjs/core": "^6.18.0",
    "@adonisjs/cors": "^2.2.1",
    "@adonisjs/inertia": "^3.1.1",
    "@adonisjs/lucid": "^21.6.1",
    "@adonisjs/session": "^7.5.1",
    "@adonisjs/shield": "^8.2.0",
    "@adonisjs/static": "^1.1.1",
    "@adonisjs/vite": "^4.0.0",
    "@inertiajs/react": "^2.1.10",
    "@vinejs/vine": "^3.0.1",
    "edge.js": "^6.2.1",
    "luxon": "^3.7.2",
    "pg": "^8.16.3",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "reflect-metadata": "^0.2.2"
  }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: blottr_postgres
    environment:
      POSTGRES_DB: blottr
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Git Tree Structure (Current)

```
.
├── app/
│   ├── exceptions/
│   ├── middleware/
│   └── models/ (10 models)
├── config/ (11 config files)
├── database/
│   └── migrations/ (12 migrations)
├── inertia/
│   ├── app/
│   ├── css/
│   └── pages/
├── start/
├── tests/
├── CLAUDE.md
├── KNOWLEDGE_BASE.md
├── docker-compose.yml
└── package.json

Total: 78 files, 23 directories
```

## Development Status

### ✅ Completed
- Database schema design and implementation (12 tables)
- Lucid ORM models with full relationships
- Instagram scraping architecture
- Multi-salon artist support
- Automated onboarding workflow design
- Basic AdonisJS + React + Inertia setup

### 🚧 In Progress
- API controllers implementation
- Frontend React components
- VineJS validators
- Email automation jobs
- Authentication workflows

### 📋 Next Steps
- Artist search and filtering
- Contact request system
- Appointment booking
- Admin dashboard
- Instagram scraping implementation
- Testing suite

## Project Status (Auto-Updated)

**Last Update**: 2025-09-23 00:34:35
**Git Branch**: main
**Last Commit**: 595917b - fix(ci): resolve GitHub Actions permission denied error for auto-commits (Thomas Dubernet, 32 seconds ago)

### 📊 Project Metrics
- **Files**: 79 files, 28 directories
- **Dependencies**: 17 production, 20 development
- **Database**: 14 migrations, 11 models
- **Version**: 0.0.0

### 🌳 Current Project Structure

```
.
├── .claude
│   └── settings.local.json
├── .editorconfig
├── .env.example
├── .github
│   └── workflows
│       └── update-knowledge-base.yml
├── .gitignore
├── .husky
│   └── post-commit
├── CLAUDE.md
├── ace.js
├── adonisrc.ts
├── app
│   ├── exceptions
│   │   └── handler.ts
│   ├── middleware
│   │   ├── auth_middleware.ts
│   │   ├── container_bindings_middleware.ts
│   │   ├── guest_middleware.ts
│   │   └── silent_auth_middleware.ts
│   └── models
│       ├── appointment.ts
│       ├── artist.ts
│       ├── artist_onboarding.ts
│       ├── auth_access_token.ts
│       ├── city.ts
│       ├── contact_request.ts
│       ├── salon.ts
│       ├── shop.ts
│       ├── tag.ts
│       ├── tattoo.ts
│       └── user.ts
├── bin
│   ├── console.ts
│   ├── server.ts
│   └── test.ts
├── config
│   ├── app.ts
│   ├── auth.ts
│   ├── bodyparser.ts
│   ├── cors.ts
│   ├── database.ts
│   ├── hash.ts
│   ├── inertia.ts
│   ├── logger.ts
│   ├── session.ts
│   ├── shield.ts
│   ├── static.ts
│   └── vite.ts
├── database
│   └── migrations
│       ├── 1758579190445_create_users_table.ts
│       ├── 1758581896088_create_create_shops_table.ts
│       ├── 1758581899582_create_create_salons_table.ts
│       ├── 1758581911346_create_create_artists_table.ts
│       ├── 1758581915615_create_create_artist_salons_table.ts
│       ├── 1758581922331_create_create_tags_table.ts
│       ├── 1758581930280_create_create_tattoos_table.ts
│       ├── 1758581934955_create_create_contact_requests_table.ts
│       ├── 1758581935567_create_create_artist_onboardings_table.ts
│       ├── 1758581936199_create_create_appointments_table.ts
│       ├── 1758581936809_create_create_auth_access_tokens_table.ts
│       ├── 1758581937432_create_create_tag_tattoos_table.ts
│       ├── 1758584991949_create_create_cities_table.ts
│       └── 1758585023298_create_add_missing_fields_to_tables_table.ts
├── docker-compose.yml
├── docs
│   ├── README.md
│   ├── architecture
│   │   └── KNOWLEDGE_BASE.md
│   ├── database
│   │   ├── DATABASE_DOCUMENTATION.md
│   │   └── DB_VISUALIZATION.md
│   └── setup
│       └── CLAUDE.md
├── eslint.config.js
├── inertia
│   ├── app
│   │   ├── app.tsx
│   │   └── ssr.tsx
│   ├── css
│   │   └── app.css
│   ├── pages
│   │   ├── errors
│   │   │   ├── not_found.tsx
│   │   │   └── server_error.tsx
│   │   └── home.tsx
│   └── tsconfig.json
├── package.json
├── pgadmin-servers.json
├── pnpm-lock.yaml
├── resources
│   └── views
│       └── inertia_layout.edge
├── scripts
│   └── update-knowledge-base.sh
├── start
│   ├── env.ts
│   ├── kernel.ts
│   └── routes.ts
├── tests
│   └── bootstrap.ts
├── tsconfig.json
└── vite.config.ts

27 directories, 79 files
```

### 🔄 Git Status

```
Current branch: main
 M scripts/update-knowledge-base.sh
```

---
*Auto-generated by scripts/update-knowledge-base.sh*
