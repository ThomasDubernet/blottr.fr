# Codebase Structure

## Root Directory

```
/
├── app/                    # Backend application code
│   ├── controllers/        # Route controllers (currently empty)
│   ├── middleware/         # HTTP middleware (auth, guest, silent_auth)
│   ├── models/            # Database models (User model)
│   └── exceptions/        # Exception handlers
├── config/                # Configuration files
├── database/              # Database migrations and seeders
│   └── migrations/        # Single users table migration
├── inertia/               # Frontend React application
│   ├── app/               # App entry points (app.tsx, ssr.tsx)
│   ├── css/               # Stylesheets
│   └── pages/             # React page components
├── resources/             # Templates and static resources
├── start/                 # Application bootstrap files
│   ├── routes.ts          # Route definitions
│   └── kernel.ts          # Middleware registration
├── tests/                 # Test files (currently empty)
├── bin/                   # Executable scripts
└── legacy/                # Previous implementation (git untracked)
```

## Key Files

- `package.json`: Dependencies and scripts
- `adonisrc.ts`: AdonisJS application configuration
- `vite.config.ts`: Frontend build configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: Code linting rules
