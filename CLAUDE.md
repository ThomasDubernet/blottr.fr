# CLAUDE.md - Configuration Optimisée Blottr.fr

Configuration Claude Code ultra-efficace pour développement sans friction avec qualité maximale.

## 🧪 TEST-FIRST WORKFLOW (OBLIGATOIRE)

**Chaque feature DOIT suivre ce pattern strict :**

1. **RED** : Écrire le test qui échoue d'abord
2. **GREEN** : Implémenter le code minimum pour passer le test
3. **REFACTOR** : Améliorer la qualité en gardant les tests verts
4. **VERIFY** : Vérifier la couverture et les quality gates

### Règles Absolues de Tests

- ❌ **Aucune fonction sans test unitaire**
- ❌ **Aucun endpoint sans test fonctionnel**
- ❌ **Aucun commit sans tests verts**
- ✅ **Coverage minimum 90% sur business logic**
- ✅ **Edge cases obligatoires testés**

```bash
# Tests obligatoires après chaque feature
npm test                    # Tous les tests verts
npm run test:coverage      # Coverage >90%
npm run test:unit          # Tests unitaires rapides
npm run test:functional    # Tests d'intégration
```

## 🏗️ CLEAN ARCHITECTURE (Structure Obligatoire)

### Couches Définies

```
Domain Layer (Core Business)
├── entities/          # User, Artist, Tattoo
├── value-objects/     # Email, Password, Address
├── repositories/      # Interfaces uniquement
└── services/         # Business logic pure

Application Layer (Use Cases)
├── use-cases/        # RegisterUser, BookAppointment
├── services/         # Application services
├── dto/              # Data Transfer Objects
└── contracts/        # Interfaces

Infrastructure Layer (External)
├── database/         # Lucid models, repos implémentation
├── external/         # APIs, services externes
├── events/           # Event listeners
└── queues/           # Job processing

Presentation Layer (Interface)
├── controllers/      # HTTP controllers
├── middleware/       # Request/Response handling
├── validators/       # VineJS schemas
└── serializers/      # Response formatting
```

### Règles de Dépendances

- **Infrastructure** → **Application** → **Domain**
- **Jamais de dépendance inverse**
- **Domain ne dépend de rien d'autre**
- **Application ne connaît pas Infrastructure**

## 🤝 COMMUNICATION PROACTIVE (Zéro Aller-Retour)

**Avant chaque implémentation, TOUJOURS clarifier :**

### Questions Obligatoires à Poser

```markdown
## Analyse Préalable
- **Edge cases identifiés** : [liste des cas limites]
- **Architecture de tests** : [stratégie de tests à implémenter]
- **Dépendances externes** : [services/APIs concernés]
- **Impact existant** : [code à modifier/étendre]

## Options d'Implémentation
**Option A** : [approche 1 avec avantages/inconvénients]
**Option B** : [approche 2 avec avantages/inconvénients]

**Recommandation** : [option préférée avec justification]

## Tests à Implémenter
- [ ] Tests unitaires : [scope précis]
- [ ] Tests d'intégration : [endpoints/flows]
- [ ] Tests edge cases : [scénarios limites]
```

### Format de Clarification Standard

> "J'ai analysé la demande. Je vois ces scénarios : [A, B, C].
> Dois-je [option précise A] ou [option précise B] ?
> Les tests couvriront [scope exact]."

## ✅ QUALITY GATES AUTOMATIQUES

### Commandes Post-Développement (Auto-Run)

```bash
# Séquence obligatoire après chaque feature
npm run lint:fix           # Auto-fix style issues
npm run typecheck          # Zero TypeScript errors
npm test                   # All tests green
npm run test:coverage      # Coverage >90%
npm run build              # Production build success
```

### Scripts Package.json Requis

```json
{
  "scripts": {
    "test:coverage": "node ace test --coverage",
    "test:unit": "node ace test unit",
    "test:functional": "node ace test functional",
    "test:watch": "node ace test --watch",
    "quality:check": "npm run lint && npm run typecheck && npm test"
  }
}
```

## 🚀 STACK TECHNIQUE ACTUEL

### Core Technologies
- **Backend** : AdonisJS 6 (TypeScript)
- **Frontend** : React 19 + Inertia.js
- **Database** : PostgreSQL + Lucid ORM
- **Validation** : VineJS
- **Testing** : Japa + @japa/assert
- **Build** : Vite

### Architecture État Actuel
- **Models** : `app/models/user.ts` (Lucid BaseModel + Auth)
- **Middleware** : Auth, Guest, SilentAuth, ContainerBindings
- **Tests** : Bootstrap configuré, suites unit/functional
- **Routes** : Route simple vers home.tsx via Inertia

## 📁 CONVENTIONS DE NOMMAGE

### Backend (AdonisJS)
```typescript
// Models - PascalCase, singular
export default class User extends BaseModel

// Controllers - PascalCase + Controller suffix
export default class UsersController

// Services - PascalCase + Service suffix
export default class UserRegistrationService

// Use Cases - PascalCase + UseCase suffix
export default class RegisterUserUseCase

// Tests - describe blocks in French
test.group('Utilisateur - Inscription', () => {
  test('doit créer un utilisateur valide', async () => {
    // Test implementation
  })
})
```

### Frontend (React)
```typescript
// Components - PascalCase
export default function UserProfile() {}

// Pages - PascalCase + location
// inertia/pages/users/profile.tsx
export default function UsersProfile() {}

// Hooks - camelCase + use prefix
export function useUserAuth() {}
```

## 🔧 COMMANDES DE DÉVELOPPEMENT

### Développement Quotidien
```bash
npm run dev                    # Dev server + HMR
npm test -- --watch           # Tests en continu
npm run lint:fix              # Fix automatique du code
```

### Base de Données
```bash
node ace migration:run         # Appliquer migrations
node ace migration:rollback    # Rollback dernière migration
node ace db:seed              # Peupler avec données test
node ace make:model User       # Créer modèle + migration
```

### Génération de Code
```bash
node ace make:controller Users    # Controller + resource routes
node ace make:middleware Auth     # Middleware personnalisé
node ace make:validator User      # VineJS validator
node ace make:service UserAuth   # Business service
```

## 🎯 PATTERNS SPÉCIFIQUES ADONISJS

### Model Pattern avec Business Logic
```typescript
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @computed()
  public get isEmailVerified() {
    return this.emailVerifiedAt !== null
  }

  // Business methods
  public async changeEmail(newEmail: string): Promise<void> {
    this.email = newEmail
    this.emailVerifiedAt = null
    await this.save()
  }
}
```

### Controller Pattern avec Use Cases
```typescript
import { HttpContext } from '@adonisjs/core/http'
import { RegisterUserUseCase } from '#use-cases/register_user_use_case'

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const payload = request.validateUsing(createUserValidator)

    const useCase = new RegisterUserUseCase()
    const result = await useCase.execute(payload)

    return response.created(result)
  }
}
```

### Service Pattern pour Business Logic
```typescript
export default class UserRegistrationService {
  async register(userData: CreateUserDTO): Promise<User> {
    // Validation métier
    await this.validateEmailUniqueness(userData.email)

    // Création sécurisée
    const user = await User.create({
      ...userData,
      password: await hash.make(userData.password)
    })

    // Actions post-création
    await this.sendWelcomeEmail(user)

    return user
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      throw new EmailAlreadyExistsException()
    }
  }
}
```

### Test Pattern Complet
```typescript
import { test } from '@japa/runner'
import { UserFactory } from '#factories/user_factory'

test.group('Users Controller', () => {
  test('POST /users - doit créer un utilisateur valide', async ({ client, assert }) => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'secure123',
      fullName: 'Test User'
    }

    // Act
    const response = await client.post('/users').json(userData)

    // Assert
    response.assertStatus(201)
    response.assertBodyContains({
      email: userData.email,
      fullName: userData.fullName
    })

    // Verify in database
    const user = await User.findBy('email', userData.email)
    assert.isNotNull(user)
    assert.equal(user!.email, userData.email)
  })

  test('POST /users - doit rejeter un email déjà utilisé', async ({ client }) => {
    // Arrange - Create existing user
    const existingUser = await UserFactory.create()

    // Act - Try to create user with same email
    const response = await client.post('/users').json({
      email: existingUser.email,
      password: 'password123',
      fullName: 'Another User'
    })

    // Assert
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{
        field: 'email',
        rule: 'unique'
      }]
    })
  })
})
```

## 🔒 RÈGLES DE SÉCURITÉ

### Validation Obligatoire
```typescript
// Toujours valider les inputs
const payload = request.validateUsing(createUserValidator)

// Jamais de query brute
const users = await User.query().where('active', true) // ✅
const users = await Database.rawQuery('SELECT * FROM users') // ❌
```

### Authentification
```typescript
// Middleware auth obligatoire sur routes protégées
router.group(() => {
  router.get('/profile', [UsersController, 'profile'])
}).middleware('auth')

// Vérification des permissions
export default class UsersController {
  async profile({ auth, bouncer }: HttpContext) {
    await bouncer.authorize('viewProfile', auth.user!)
    return auth.user
  }
}
```

## 📊 MÉTRIQUES DE QUALITÉ

### Objectifs Chiffrés
- **Test Coverage** : >90% sur business logic
- **TypeScript Errors** : 0
- **ESLint Warnings** : 0
- **Build Time** : <30s
- **Test Suite** : <10s pour unit tests

### Monitoring Continu
```bash
# Coverage report
npm run test:coverage -- --reporter=html

# Performance tests
npm run test:perf

# Security audit
npm audit --audit-level moderate
```

---

## 🎯 RÉSUMÉ EXÉCUTIF

**Workflow Ultra-Efficace :**
1. **Test d'abord** → Implémentation → Refactor → Quality Gates
2. **Architecture en couches** → Domain/Application/Infrastructure/Presentation
3. **Clarification proactive** → Zero aller-retour, options claires
4. **Automatisation complète** → Tests, lint, build, coverage

**Objectif** : Code qui marche du premier coup, testé à 100%, architecture scalable.