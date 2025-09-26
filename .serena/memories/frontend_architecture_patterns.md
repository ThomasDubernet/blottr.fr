# Frontend Architecture Patterns - Blottr.fr

## Established Patterns from Sprint 1

### Component Architecture

```typescript
// Component Pattern with TypeScript Props
interface ComponentProps {
  required: string
  optional?: boolean
  children?: React.ReactNode
}

export const Component: React.FC<ComponentProps> = ({ required, optional = false, children }) => {
  return <div className="component-base">{children}</div>
}
```

### Service Layer Pattern

```typescript
// Service Class Pattern for API Integration
export class ArtistService {
  private static instance: ArtistService

  static getInstance(): ArtistService {
    if (!ArtistService.instance) {
      ArtistService.instance = new ArtistService()
    }
    return ArtistService.instance
  }

  async getArtists(filters?: ArtistFilters): Promise<Artist[]> {
    return api.get('/api/artists', { params: filters })
  }
}

// Export both class and instance
export const artistService = ArtistService.getInstance()
```

### Inertia.js Integration Pattern

```typescript
// Page Component with Inertia Props
interface PageProps {
  user?: User | null
  // Other props from backend controller
}

export default function PageName({ user }: PageProps) {
  return (
    <MainLayout title="Page Title" user={user}>
      {/* Page content */}
    </MainLayout>
  )
}
```

### Form Handling with Inertia

```typescript
// Inertia useForm Pattern
const { data, setData, post, processing, errors } = useForm<FormType>({
  field1: '',
  field2: '',
})

const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  post('/endpoint')
}
```

### Layout Component Pattern

```typescript
// Layout with SEO and Navigation
interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  user?: User | null
}

export function Layout({ children, title, description, user }: LayoutProps) {
  return (
    <>
      <Head title={title}>
        <meta name="description" content={description} />
      </Head>
      <Header user={user} />
      <main>{children}</main>
    </>
  )
}
```

### Utility Function Patterns

```typescript
// Clsx utility for conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage in components
<div className={cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  disabled && 'disabled-classes'
)} />
```

### File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `MainLayout.tsx`)
- **Pages**: PascalCase with location context (`auth/Login.tsx`)
- **Services**: snake_case (`artist_service.ts`, `tattoo_service.ts`)
- **Utilities**: snake_case (`utils.ts`, `api.ts`)
- **Types**: camelCase files (`index.ts`)

### Import/Export Patterns

```typescript
// Service index file pattern
export { artistService, ArtistService } from './artist_service'
export { tattooService, TattooService } from './tattoo_service'

// Component index file pattern
export { Button } from './Button'
export { Input } from './Input'
export { Card, CardContent, CardHeader } from './Card'
```

### Quality Control Workflow

```bash
# Automated quality checks
pnpm run fix       # Auto-fix linting and formatting
pnpm run quality   # Comprehensive quality validation
pnpm run lint:fix  # ESLint fixes only
pnpm run format    # Prettier formatting only
```

### TypeScript Integration

- All components have proper TypeScript interfaces
- Props are strongly typed with optional/required clarity
- Service methods have return type annotations
- Form data uses typed interfaces

### CSS/Styling Approach

- TailwindCSS for utility-first styling
- Component-specific classes with cn() utility
- Responsive design with mobile-first approach
- No CSS modules or styled-components (TailwindCSS only)

## Established for Sprint 2+

These patterns are now the foundation for all future Sprint development:

- Component library expansion
- Service layer extension for new APIs
- Consistent file naming and organization
- Quality control integration in development workflow
