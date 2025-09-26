# Task Completion Checklist

## Before Marking Task Complete

Always run these commands after making code changes:

### 1. Code Quality Checks

```bash
npm run lint          # ESLint - fix any linting errors
npm run typecheck     # TypeScript - resolve type issues
npm run format        # Prettier - ensure consistent formatting
```

### 2. Testing (when tests exist)

```bash
npm test              # Run all test suites
```

### 3. Build Verification

```bash
npm run build         # Ensure production build works
```

### 4. Development Server Check

```bash
npm run dev           # Start dev server and verify changes
```

## Quality Gates

- **Zero ESLint errors**: Code must pass linting
- **Zero TypeScript errors**: All type issues resolved
- **Build succeeds**: Production build must complete
- **No console errors**: Browser console should be clean
- **Functionality verified**: Manual testing of changed features

## Git Workflow

- **Feature branches**: Always work on feature branches, never main
- **Meaningful commits**: Use descriptive commit messages
- **Small commits**: Commit frequently with focused changes
- **Clean history**: Review changes with `git diff` before commit

## Documentation Updates

- Update relevant memory files if architecture changes
- Update this checklist if new quality requirements added
- Document any new development patterns or conventions

## Environment Considerations

- **Database migrations**: Run `node ace migration:run` after schema changes
- **Environment variables**: Update `.env` if new config needed
- **Dependencies**: Run `pnpm install` after package.json changes
