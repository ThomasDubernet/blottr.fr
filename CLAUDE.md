# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Development
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm start` - Start production server

### Testing
- `npm test` - Run all tests
- `node ace test --files="tests/path/to/test.spec.ts"` - Run specific test
- `node ace test unit` - Run unit tests only
- `node ace test functional` - Run functional tests only

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - TypeScript type checking

### Database
- `node ace migration:run` - Run pending migrations
- `node ace migration:rollback` - Rollback last migration
- `node ace migration:fresh` - Drop all tables and re-run migrations
- `node ace db:seed` - Run database seeders

### Code Generation
- `node ace make:controller ControllerName` - Create controller
- `node ace make:model ModelName` - Create Lucid model
- `node ace make:migration create_table_name` - Create migration
- `node ace make:middleware MiddlewareName` - Create middleware
- `node ace make:validator ValidatorName` - Create validator

## Architecture Overview

This is an **AdonisJS v6** application with **React** and **Inertia.js** for the frontend.

### Stack
- **Backend**: AdonisJS v6 (TypeScript)
- **Frontend**: React 19 with Inertia.js
- **Database**: PostgreSQL with Lucid ORM
- **Validation**: VineJS
- **Testing**: Japa
- **Build**: Vite

### Directory Structure

```
app/
  controllers/     # HTTP controllers
  models/          # Lucid ORM models
  middleware/      # Request middleware
  validators/      # VineJS validators
  exceptions/      # Custom exceptions
  services/        # Business logic services
inertia/
  pages/          # React page components
  app/            # React app setup (app.tsx, ssr.tsx)
  css/            # Stylesheets
database/
  migrations/     # Database migrations
start/
  routes.ts       # HTTP routes definition
  kernel.ts       # HTTP kernel configuration
config/           # Configuration files
tests/            # Test files
```

### Import Aliases

The project uses import maps for cleaner imports:
- `#controllers/*` → `app/controllers/*`
- `#models/*` → `app/models/*`
- `#services/*` → `app/services/*`
- `#validators/*` → `app/validators/*`
- `#middleware/*` → `app/middleware/*`
- `#config/*` → `config/*`
- `~/` → `inertia/` (in frontend code)

### Code Patterns

**Models**: Use Lucid ORM with decorators
```typescript
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare email: string
}
```

**Controllers**: Return Inertia responses for frontend routes
```typescript
import { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    return inertia.render('home', { data })
  }
}
```

**React Pages**: Located in `inertia/pages/`
```typescript
export default function HomePage({ data }) {
  return <div>{/* Component */}</div>
}
```

**Validation**: Use VineJS schemas
```typescript
import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8)
  })
)
```

**Routes**: Defined in `start/routes.ts`
```typescript
import router from '@adonisjs/core/services/router'

router.get('/', [HomeController, 'index'])
router.post('/users', [UsersController, 'store'])
```

### Frontend Development

- Inertia.js handles client-server communication
- React components in `inertia/pages/` are automatically resolved
- SSR is enabled via `inertia/app/ssr.tsx`
- Vite handles HMR and bundling
- Use `~/` alias for imports within Inertia directory

### Database Workflow

1. Create migration: `node ace make:migration create_users_table`
2. Edit migration in `database/migrations/`
3. Run migration: `node ace migration:run`
4. Create model: `node ace make:model User`
5. Define model relationships and columns with decorators

### Testing

Tests use the Japa framework with two suites:
- **Unit tests**: `tests/unit/` (2s timeout)
- **Functional tests**: `tests/functional/` (30s timeout)

Use `@japa/assert` for assertions and `@japa/plugin-adonisjs` for AdonisJS-specific testing helpers.