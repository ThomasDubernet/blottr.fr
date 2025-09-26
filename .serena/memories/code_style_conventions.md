# Code Style and Conventions

## TypeScript Configuration

- **Target**: ES modules with modern TypeScript (~5.8.3)
- **Module Resolution**: Node.js style with path mapping
- **Strict Mode**: Enabled via AdonisJS TypeScript config
- **Build Output**: `./build` directory

## Code Style

- **Linting**: ESLint with AdonisJS configuration (`@adonisjs/eslint-config`)
- **Formatting**: Prettier with AdonisJS configuration (`@adonisjs/prettier-config`)
- **Import Aliases**: Extensive use of `#` prefixed imports:
  - `#controllers/*` → `./app/controllers/*.js`
  - `#models/*` → `./app/models/*.js`
  - `#middleware/*` → `./app/middleware/*.js`
  - `#config/*` → `./config/*.js`
  - etc.

## Naming Conventions

- **Files**: snake_case for backend, camelCase for React
- **Classes**: PascalCase (User model)
- **Variables**: camelCase
- **Constants**: UPPER_CASE in config

## Database Conventions

- **ORM**: Lucid with Active Record pattern
- **Migrations**: Timestamped with descriptive names
- **Models**: Singular names, extend BaseModel
- **Columns**: snake_case in database, mapped to camelCase in models

## Frontend Conventions

- **React**: Functional components with hooks
- **File Extensions**: .tsx for React components, .ts for utilities
- **Imports**: Relative imports with `~/` alias for inertia directory
- **Styling**: Custom CSS classes, no CSS-in-JS framework detected
