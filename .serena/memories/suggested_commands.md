# Essential Development Commands

## Core Development

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Type checking without build
npm run typecheck
```

## Database Operations

```bash
# Run migrations
node ace migration:run

# Rollback migrations
node ace migration:rollback

# Create new migration
node ace make:migration <name>

# Create new model
node ace make:model <name>

# Database seed
node ace db:seed
```

## Development Tools

```bash
# AdonisJS REPL
node ace repl

# List all ace commands
node ace list

# Generate app key
node ace generate:key

# Create controller
node ace make:controller <name>

# Create middleware
node ace make:middleware <name>
```

## System Commands (macOS)

```bash
# File operations
ls -la                    # List files with details
find . -name "*.ts"       # Find TypeScript files
grep -r "pattern" .       # Search in files
cd <directory>            # Change directory

# Git operations
git status                # Check repository status
git add .                 # Stage changes
git commit -m "message"   # Commit changes
git log --oneline         # View commit history
```

## Package Management

```bash
# Install dependencies
pnpm install

# Add new package
pnpm add <package>

# Add dev dependency
pnpm add -D <package>

# Update packages
pnpm update
```
