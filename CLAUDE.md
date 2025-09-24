# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📚 Full Documentation

All project documentation has been organized in the `/docs` directory:

@docs/README.md - Complete documentation index and navigation
@docs/database/DATABASE_DOCUMENTATION.md - Full database schema, relationships, and migration guide
@docs/database/DB_VISUALIZATION.md - pgAdmin setup and visualization guide
@docs/architecture/KNOWLEDGE_BASE.md - Project architecture, concepts, and workflows
@docs/design-system/README.md - Design system overview and component library guide

## Context7 Usage Policy

**Always use Context7 when you need:**

- Code generation, setup or configuration steps
- Library/API documentation and best practices
- Framework-specific implementation patterns
- Official documentation lookup

**Automatically use Context7 MCP tools without being explicitly asked for:**

- Resolving library IDs and getting library docs
- Finding implementation examples and patterns
- Checking API compatibility and version requirements

## Available Libraries & Technologies

### Core Stack

- **AdonisJS v6**: `/adonisjs/v6-docs` - Full-stack MVC framework
- **React**: `/facebook/react` - Frontend UI library
- **Inertia.js**: `/inertiajs/inertia` - SPA bridge for server-side routing
- **PostgreSQL**: `/websites/postgresql` - Primary database
- **VineJS**: `/vinejs/vinejs.dev` - Validation library
- **Vite**: `/vitejs/vite` - Frontend build tool

### Design System Libraries

- **Tailwind CSS**: `/tailwindlabs/tailwindcss` - Utility-first CSS framework
- **shadcn/ui**: `/shadcn/ui` - Re-usable components built with Radix UI and Tailwind
- **Radix UI**: `/radix-ui/primitives` - Unstyled, accessible components for React
- **Lucide React**: `/lucide-icons/lucide` - Icon library for React

### Additional Libraries

- **AdonisJS Lucid**: `/adonisjs/lucid` - SQL ORM with Active Record
- **AdonisJS Jobs**: `/kabbouchi/adonisjs-jobs` - Job processing with BullMQ
- **Postgres.js**: `/porsager/postgres` - PostgreSQL client for Node.js
- **Tuyau**: `/julien-r44/tuyau` - Typesafe APIs for AdonisJS

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
- `docker-compose up -d` - Start PostgreSQL + pgAdmin

### pgAdmin Access

- **URL**: http://localhost:5050
- **Email**: admin@blottr.fr
- **Password**: admin

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
docs/             # Project documentation
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
  declare id: string

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
    password: vine.string().minLength(8),
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

### Design System Architecture

- **Component Structure**: Two-tier system with base UI components and Blottr-specific components
- **Base Components**: `inertia/components/ui/` - shadcn/ui components (Button, Card, Dialog, etc.)
- **Blottr Components**: `inertia/components/blottr/` - Tattoo industry-specific components
- **Live Documentation**: Visit `http://localhost:3333/design-system` for interactive component gallery
- **Theming**: Tailwind CSS with custom tattoo industry color palette and dark mode support

### Database Workflow

1. Create migration: `node ace make:migration create_users_table`
2. Edit migration in `database/migrations/`
3. Run migration: `node ace migration:run`
4. Create model: `node ace make:model User`
5. Define model relationships and columns with decorators

### Testing & TDD Approach

Tests use the Japa framework with two suites:

- **Unit tests**: `tests/unit/` (2s timeout)
- **Functional tests**: `tests/functional/` (30s timeout)

Use `@japa/assert` for assertions and `@japa/plugin-adonisjs` for AdonisJS-specific testing helpers.

**Test-Driven Development (TDD) Workflow:**

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code quality while keeping tests green

**TDD Implementation Guidelines:**

- Always write tests BEFORE implementing features
- Start with the simplest test case and gradually add complexity
- Test one behavior per test method
- Use descriptive test names that explain the expected behavior
- Mock external dependencies in unit tests
- Keep tests isolated and independent

**Testing Best Practices:**

- Use `test.group()` to organize related tests
- Leverage AdonisJS testing helpers for database operations
- Test edge cases and error conditions
- Maintain high test coverage for critical business logic
- Run tests frequently during development

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
