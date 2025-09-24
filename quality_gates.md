# Quality Gates & Testing Strategy

## Testing Philosophy: Test-Driven Development (TDD)

**Approach**: Red-Green-Refactor cycle for all component development **Coverage
Target**: 90% minimum for component library **Strategy**: Unit → Integration →
E2E → Accessibility → Performance

---

## 🔴 Red Phase: Test-First Development

### Component Development Workflow

#### 1. Define Component Interface (Before Implementation)

```typescript
// Example: TattooCard.test.tsx (Written BEFORE TattooCard.tsx)
describe('TattooCard Component', () => {
  const mockTattoo = {
    id: '123',
    photo: 'https://example.com/tattoo.jpg',
    alt_text: 'Dragon tattoo on arm',
    is_flash: true,
    price: 150,
    artist: {
      id: '456',
      firstname: 'John',
      lastname: 'Smith',
      slug: 'john-smith'
    },
    tags: [
      { id: '1', name: 'Dragon', slug: 'dragon' },
      { id: '2', name: 'Traditional', slug: 'traditional' }
    ]
  }

  it('should render tattoo image with correct alt text', () => {
    render(<TattooCard tattoo={mockTattoo} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Dragon tattoo on arm')
    expect(image).toHaveAttribute('src', mockTattoo.photo)
  })

  it('should display flash badge when tattoo is flash', () => {
    render(<TattooCard tattoo={mockTattoo} />)
    expect(screen.getByText('Flash')).toBeInTheDocument()
  })

  it('should show price when showPrice prop is true', () => {
    render(<TattooCard tattoo={mockTattoo} showPrice={true} />)
    expect(screen.getByText('€150')).toBeInTheDocument()
  })

  it('should call onFavorite when favorite button is clicked', () => {
    const mockOnFavorite = vi.fn()
    render(<TattooCard tattoo={mockTattoo} onFavorite={mockOnFavorite} />)

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    fireEvent.click(favoriteButton)

    expect(mockOnFavorite).toHaveBeenCalledWith('123')
  })

  it('should be accessible with proper ARIA attributes', () => {
    render(<TattooCard tattoo={mockTattoo} />)

    // Check for proper semantic structure
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt')

    // Check for keyboard navigation
    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    expect(favoriteButton).toHaveAttribute('tabindex', '0')
  })

  it('should handle loading states gracefully', () => {
    render(<TattooCard tattoo={mockTattoo} />)

    // Should show loading overlay initially
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument()

    // Simulate image load
    const image = screen.getByRole('img')
    fireEvent.load(image)

    // Loading overlay should disappear
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument()
  })
})
```

### Test Categories per Component

#### Unit Tests (90% of test coverage)

```typescript
// Test file structure: ComponentName.test.tsx
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('should render with default props')
    it('should render all prop variations')
    it('should handle edge cases (empty data, null values)')
  })

  describe('Interactions', () => {
    it('should call event handlers with correct parameters')
    it('should update internal state correctly')
    it('should handle keyboard interactions')
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes')
    it('should support screen readers')
    it('should be keyboard navigable')
  })

  describe('Error Handling', () => {
    it('should handle missing required props')
    it('should display error states appropriately')
    it('should not crash on invalid data')
  })
})
```

---

## 🟢 Green Phase: Implementation to Pass Tests

### Component Implementation Standards

#### 1. TypeScript Strict Compliance

```typescript
// No 'any' types allowed - Use proper interfaces
interface TattooCardProps {
  tattoo: TattooData // Defined interface, not 'any'
  size?: 'sm' | 'md' | 'lg' // Union types, not 'string'
  onFavorite?: (tattooId: string) => void // Explicit function signature
  className?: string
}

// Use generics for reusable components
interface BaseCardProps<T> {
  data: T
  onAction?: (item: T) => void
}
```

#### 2. Accessibility by Design

```tsx
export function TattooCard({ tattoo, onFavorite }: TattooCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <article
      className="group relative overflow-hidden rounded-xl"
      role="article"
      aria-label={`Tattoo by ${tattoo.artist.firstname} ${tattoo.artist.lastname}`}
    >
      <div className="relative aspect-square">
        <img
          src={tattoo.photo}
          alt={tattoo.alt_text}
          className={cn(
            'w-full h-full object-cover transition-transform',
            !isLoaded && 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />

        <button
          onClick={() => {
            setIsFavorited(!isFavorited)
            onFavorite?.(tattoo.id)
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80"
          aria-label={
            isFavorited ? 'Remove from favorites' : 'Add to favorites'
          }
          tabIndex={0}
        >
          <Heart
            className={cn(
              'w-4 h-4',
              isFavorited ? 'fill-red-500 text-red-500' : 'text-ink-600'
            )}
          />
        </button>

        {!isLoaded && (
          <div
            className="absolute inset-0 bg-ink-100 animate-pulse"
            data-testid="loading-overlay"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Price with proper semantic meaning */}
      {tattoo.price && (
        <div className="p-4">
          <span
            className="text-lg font-semibold"
            aria-label={`Price: ${formatPrice(tattoo.price)}`}
          >
            {formatPrice(tattoo.price)}
          </span>
        </div>
      )}
    </article>
  )
}
```

#### 3. Error Boundary Integration

```tsx
// Every component should handle errors gracefully
function TattooCardWithErrorBoundary(props: TattooCardProps) {
  return (
    <ErrorBoundary
      fallback={<TattooCardError />}
      onError={(error) => {
        console.error('TattooCard Error:', error)
        // Log to error tracking service
      }}
    >
      <TattooCard {...props} />
    </ErrorBoundary>
  )
}

function TattooCardError() {
  return (
    <div className="w-80 h-80 bg-ink-100 rounded-xl flex items-center justify-center">
      <div className="text-center text-ink-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Unable to load tattoo</p>
      </div>
    </div>
  )
}
```

---

## 🔵 Refactor Phase: Optimization & Quality

### Performance Optimization Standards

#### 1. Memoization Strategy

```tsx
// Memoize expensive calculations
const formattedPrice = useMemo(() => {
  return tattoo.price ? formatPrice(tattoo.price) : null
}, [tattoo.price])

// Memoize callback functions
const handleFavorite = useCallback(
  (tattooId: string) => {
    setIsFavorited(!isFavorited)
    onFavorite?.(tattooId)
  },
  [isFavorited, onFavorite]
)

// Memo for pure components
export const TattooCard = memo(
  ({ tattoo, ...props }: TattooCardProps) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison for complex objects
    return (
      prevProps.tattoo.id === nextProps.tattoo.id &&
      prevProps.showPrice === nextProps.showPrice
    )
  }
)
```

#### 2. Bundle Size Optimization

```tsx
// Lazy load heavy components
const ContactModal = lazy(() => import('./ContactModal'))

// Use dynamic imports for icons
const HeartIcon = lazy(() =>
  import('lucide-react').then((module) => ({ default: module.Heart }))
)

// Tree-shake utilities
import { cn } from '~/lib/utils' // Not the entire library
import { formatPrice } from '~/lib/formatters' // Specific functions
```

---

## 📊 Quality Gates Framework

### Gate 1: Unit Testing (Required for merge)

#### Test Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/stories/**',
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
})
```

#### Test Utilities (`test/utils.tsx`)

```tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Custom render with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <div className="test-wrapper">{children}</div>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock Inertia.js for testing
export const mockInertiaLink = (href: string) => ({
  href,
  onClick: vi.fn(),
  'data-testid': 'inertia-link',
})
```

### Gate 2: Integration Testing

#### Component Integration Tests

```tsx
// Integration test example
describe('TattooCard Integration', () => {
  it('should integrate properly with parent components', () => {
    const mockTattoos = [mockTattoo1, mockTattoo2, mockTattoo3]

    render(
      <div className="grid grid-cols-3 gap-4">
        {mockTattoos.map((tattoo) => (
          <TattooCard
            key={tattoo.id}
            tattoo={tattoo}
            onFavorite={handleFavorite}
            onContact={handleContact}
          />
        ))}
      </div>
    )

    // Should render all cards
    expect(screen.getAllByRole('article')).toHaveLength(3)

    // Should handle interactions without affecting siblings
    const favoriteButtons = screen.getAllByLabelText(/add to favorites/i)
    fireEvent.click(favoriteButtons[0])

    expect(handleFavorite).toHaveBeenCalledTimes(1)
    expect(screen.getAllByLabelText(/remove from favorites/i)).toHaveLength(1)
  })
})
```

### Gate 3: Accessibility Testing

#### Automated Accessibility Tests

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('TattooCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<TattooCard tattoo={mockTattoo} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should support keyboard navigation', () => {
    render(<TattooCard tattoo={mockTattoo} onFavorite={mockOnFavorite} />)

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })

    // Tab navigation
    favoriteButton.focus()
    expect(favoriteButton).toHaveFocus()

    // Enter key activation
    fireEvent.keyDown(favoriteButton, { key: 'Enter', code: 'Enter' })
    expect(mockOnFavorite).toHaveBeenCalled()
  })

  it('should have proper ARIA labels and roles', () => {
    render(<TattooCard tattoo={mockTattoo} />)

    // Main container should be an article
    expect(screen.getByRole('article')).toBeInTheDocument()

    // Image should have alt text
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', expect.stringContaining('tattoo'))

    // Interactive elements should have proper labels
    const favoriteButton = screen.getByRole('button')
    expect(favoriteButton).toHaveAttribute('aria-label')
  })
})
```

### Gate 4: Performance Testing

#### Performance Benchmarks

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { performance } from 'perf_hooks'

describe('TattooCard Performance', () => {
  it('should render within performance budget', async () => {
    const startTime = performance.now()

    render(<TattooCard tattoo={mockTattoo} />)

    // Wait for all async operations to complete
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render within 50ms
    expect(renderTime).toBeLessThan(50)
  })

  it('should handle large datasets efficiently', () => {
    const largeTattooList = Array.from({ length: 100 }, (_, i) => ({
      ...mockTattoo,
      id: `tattoo-${i}`,
    }))

    const startTime = performance.now()

    render(
      <div>
        {largeTattooList.map((tattoo) => (
          <TattooCard key={tattoo.id} tattoo={tattoo} />
        ))}
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should handle 100 components within 200ms
    expect(renderTime).toBeLessThan(200)
  })
})
```

---

## 🎯 Test-Driven Component Development Checklist

### Before Writing Component Code:

- [ ] Define TypeScript interface for all props
- [ ] Write failing unit tests for core functionality
- [ ] Write accessibility tests with axe
- [ ] Define error states and edge cases
- [ ] Create Storybook story structure

### During Implementation:

- [ ] Write minimal code to pass first test
- [ ] Implement accessibility attributes
- [ ] Add error handling and loading states
- [ ] Ensure TypeScript strict compliance
- [ ] Add performance optimizations

### Before Code Review:

- [ ] All tests passing with 90%+ coverage
- [ ] Accessibility audit passes
- [ ] Performance benchmarks met
- [ ] Storybook documentation complete
- [ ] Error boundaries implemented

### Quality Gates Automation:

#### Pre-commit Hooks (`husky` configuration)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:coverage && npm run test:a11y"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "npm run test -- --passWithNoTests"
    ]
  }
}
```

#### CI/CD Quality Gates (GitHub Actions)

```yaml
name: Quality Gates

on: [pull_request]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Type checking
        run: pnpm run type-check

      - name: Unit tests with coverage
        run: pnpm run test:coverage

      - name: Accessibility tests
        run: pnpm run test:a11y

      - name: Performance tests
        run: pnpm run test:performance

      - name: Build test
        run: pnpm run build

      - name: Bundle size check
        run: pnpm run analyze:bundle

      - name: Comment coverage report
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: coverage
          path: coverage/coverage-summary.json
```

---

## 📈 Success Metrics & KPIs

### Code Quality Metrics

- **Test Coverage**: >90% (measured by vitest)
- **TypeScript Compliance**: 100% (no `any` types)
- **Accessibility Score**: WCAG 2.1 AA (measured by axe-core)
- **Performance Budget**: <50ms render time per component

### Developer Experience Metrics

- **Build Time**: <30s for full build
- **Test Execution**: <10s for component test suite
- **Storybook Build**: <60s for complete documentation
- **Hot Reload**: <1s for component changes

### Bug Prevention Metrics

- **Pre-merge Bug Detection**: >95% (via automated testing)
- **Accessibility Issues**: 0 violations in production
- **Performance Regressions**: 0 components exceeding budget
- **TypeScript Errors**: 0 runtime type errors

### Component Library Health

- **API Consistency**: >95% across all components
- **Documentation Coverage**: 100% public APIs documented
- **Storybook Stories**: 100% component coverage
- **Migration Success**: 0 breaking changes for consumers

---

## 🔧 Testing Tools Configuration

### Vitest Configuration for Components

```typescript
// vitest.components.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./inertia/test/setup.ts'],
    include: ['inertia/components/**/*.test.{ts,tsx}'],
    coverage: {
      include: ['inertia/components/**/*.{ts,tsx}'],
      exclude: [
        'inertia/components/**/*.stories.{ts,tsx}',
        'inertia/components/**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'inertia'),
    },
  },
})
```

### Storybook Test Runner

```typescript
// .storybook/test-runner.ts
import { injectAxe, checkA11y } from 'axe-playwright'

export default {
  async preRender(page) {
    await injectAxe(page)
  },
  async postRender(page) {
    await checkA11y(page, '#root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  },
}
```

---

## 📋 Quality Checklist Template

### Component Development Checklist

#### Phase 1: Design & Planning

- [ ] Component interface designed with TypeScript
- [ ] User stories and acceptance criteria defined
- [ ] Accessibility requirements identified
- [ ] Performance requirements set
- [ ] Error states and edge cases planned

#### Phase 2: Test-First Development

- [ ] Unit tests written for all functionality
- [ ] Accessibility tests implemented
- [ ] Performance benchmarks established
- [ ] Error handling tests created
- [ ] Integration test scenarios defined

#### Phase 3: Implementation

- [ ] Component implemented to pass all tests
- [ ] TypeScript strict mode compliance
- [ ] Accessibility attributes added
- [ ] Error boundaries implemented
- [ ] Performance optimizations applied

#### Phase 4: Documentation & Stories

- [ ] Storybook stories for all variants
- [ ] API documentation generated
- [ ] Usage examples provided
- [ ] Migration guide updated
- [ ] Best practices documented

#### Phase 5: Review & Quality

- [ ] Code review completed
- [ ] All quality gates passing
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Integration tests successful

---

**Document Version**: 1.0 **Testing Framework**: Vitest + React Testing
Library + axe-core **Coverage Target**: 90% minimum for component library
**Quality Philosophy**: Test-Driven Development with accessibility-first design
**Automation Level**: 95% automated quality gates
