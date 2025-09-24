# Performance Benchmarks & Optimization Strategy

## Performance Philosophy

**Principle**: Performance is a feature, not an afterthought
**Strategy**: Measure → Optimize → Validate → Monitor
**Target Audience**: Mobile-first users on 3G networks

---

## 📊 Core Performance Targets

### Bundle Size Constraints

#### Primary Constraints

| Metric                     | Target | Critical Threshold | Measurement               |
| -------------------------- | ------ | ------------------ | ------------------------- |
| **Initial Bundle Size**    | <400KB | <500KB             | Webpack Bundle Analyzer   |
| **Gzipped Bundle**         | <120KB | <150KB             | Production build analysis |
| **Design System Overhead** | <80KB  | <100KB             | Differential analysis     |
| **Critical CSS**           | <15KB  | <20KB              | Above-fold styles only    |

#### Component-Specific Limits

```typescript
// Bundle size targets per component (uncompressed)
const COMPONENT_SIZE_LIMITS = {
  TattooCard: 8000, // 8KB - High usage, optimize heavily
  ArtistProfileCard: 12000, // 12KB - Complex data structure
  SearchFilters: 25000, // 25KB - Most complex component
  ContactModal: 15000, // 15KB - Modal with form validation
  Navigation: 6000, // 6KB - Always loaded, keep minimal
  AppointmentCard: 5000, // 5KB - Simple display component
  StatsWidget: 3000, // 3KB - Minimal functionality
} as const

// Bundle analyzer configuration
export const bundleAnalyzerConfig = {
  analyzerMode: 'server',
  openAnalyzer: false,
  generateStatsFile: true,
  statsOptions: {
    chunkModules: false,
    assets: true,
    modules: false,
  },
}
```

### Runtime Performance Targets

#### Component Rendering Benchmarks

| Component             | Initial Render | Re-render | With 100 Items | With 1000 Items   |
| --------------------- | -------------- | --------- | -------------- | ----------------- |
| **TattooCard**        | <20ms          | <5ms      | <200ms         | N/A (virtualized) |
| **ArtistProfileCard** | <25ms          | <8ms      | <250ms         | N/A (paginated)   |
| **SearchFilters**     | <50ms          | <10ms     | N/A            | N/A               |
| **ContactModal**      | <30ms          | <5ms      | N/A            | N/A               |
| **Navigation**        | <15ms          | <3ms      | N/A            | N/A               |

#### Memory Usage Constraints

```typescript
// Memory usage targets
const MEMORY_CONSTRAINTS = {
  baselineHeapSize: 15000000, // 15MB baseline
  maxAdditionalHeap: 10000000, // +10MB max increase
  componentInstanceLimit: 1000, // Max components in memory
  imageMemoryBudget: 50000000, // 50MB for images
  eventListenerLimit: 100, // Max event listeners
}

// Performance monitoring thresholds
const PERFORMANCE_THRESHOLDS = {
  firstContentfulPaint: 1500, // 1.5s on 3G
  largestContentfulPaint: 2500, // 2.5s on 3G
  cumulativeLayoutShift: 0.1, // Minimal layout shift
  firstInputDelay: 100, // <100ms input response
  timeToInteractive: 3000, // 3s full interactivity
}
```

---

## 🎯 Optimization Strategies

### 1. Code Splitting & Lazy Loading

#### Strategic Component Loading

```typescript
// Heavy components loaded on demand
const ContactModal = lazy(() =>
  import('./ContactModal').then((module) => ({
    default: module.ContactModal,
  }))
)

const SearchFilters = lazy(() =>
  import('./SearchFilters').then((module) => ({
    default: module.SearchFilters,
  }))
)

// Icon lazy loading with fallbacks
const iconCache = new Map()

async function loadIcon(iconName: string) {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)
  }

  try {
    const iconModule = await import(`lucide-react/${iconName}`)
    iconCache.set(iconName, iconModule.default)
    return iconModule.default
  } catch {
    // Fallback to basic icon
    const { Circle } = await import('lucide-react')
    return Circle
  }
}

// Route-based code splitting
const routes = {
  'home': lazy(() => import('~/pages/home')),
  'artists': lazy(() => import('~/pages/artists/index')),
  'artists.show': lazy(() => import('~/pages/artists/show')),
  'search': lazy(() => import('~/pages/search')),
}
```

#### Chunk Optimization Strategy

```typescript
// vite.config.ts - Manual chunk configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-inertia': ['@inertiajs/react'],

          // UI Framework
          'design-system-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
          ],
          'design-system-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],

          // Icons (separate chunk for caching)
          'vendor-icons': ['lucide-react'],

          // Complex components
          'components-search': ['./inertia/components/SearchFilters'],
          'components-contact': ['./inertia/components/ContactModal'],

          // Pages
          'pages-artists': ['./inertia/pages/artists/index', './inertia/pages/artists/show'],
        },
      },
    },
  },
})
```

### 2. Image Optimization Strategy

#### Responsive Image Loading

```typescript
// TattooCard optimized image handling
interface OptimizedImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Generate responsive image URLs
  const responsiveUrls = useMemo(() => {
    const baseUrl = src.split('.').slice(0, -1).join('.')
    const extension = src.split('.').pop()

    return {
      webp: {
        sm: `${baseUrl}_320.webp`,
        md: `${baseUrl}_640.webp`,
        lg: `${baseUrl}_1024.webp`
      },
      fallback: {
        sm: `${baseUrl}_320.${extension}`,
        md: `${baseUrl}_640.${extension}`,
        lg: `${baseUrl}_1024.${extension}`
      }
    }
  }, [src])

  return (
    <picture className={className}>
      {/* WebP sources for modern browsers */}
      <source
        media="(max-width: 320px)"
        srcSet={responsiveUrls.webp.sm}
        type="image/webp"
      />
      <source
        media="(max-width: 640px)"
        srcSet={responsiveUrls.webp.md}
        type="image/webp"
      />
      <source
        media="(min-width: 641px)"
        srcSet={responsiveUrls.webp.lg}
        type="image/webp"
      />

      {/* Fallback for older browsers */}
      <img
        src={responsiveUrls.fallback.md}
        srcSet={`
          ${responsiveUrls.fallback.sm} 320w,
          ${responsiveUrls.fallback.md} 640w,
          ${responsiveUrls.fallback.lg} 1024w
        `}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoading && "opacity-0"
        )}
      />

      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-ink-100 animate-pulse" />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-ink-100 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-ink-400" />
        </div>
      )}
    </picture>
  )
}
```

#### Image Preloading Strategy

```typescript
// Preload critical images
const imagePreloader = {
  preloadCache: new Set<string>(),

  preload(src: string, priority: 'high' | 'low' = 'low') {
    if (this.preloadCache.has(src)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = priority

    document.head.appendChild(link)
    this.preloadCache.add(src)
  },

  preloadTattooImages(tattoos: TattooData[], count = 3) {
    // Preload first 3 images with high priority
    tattoos.slice(0, count).forEach((tattoo) => {
      this.preload(tattoo.photo, 'high')
    })
  },
}
```

### 3. Component Virtualization

#### Large List Optimization

```typescript
// Virtualized TattooCard grid
import { FixedSizeGrid as Grid } from 'react-window'
import { InfiniteLoader } from 'react-window-infinite-loader'

interface VirtualizedTattooGridProps {
  tattoos: TattooData[]
  hasNextPage: boolean
  isNextPageLoading: boolean
  loadNextPage: () => Promise<void>
}

export function VirtualizedTattooGrid({
  tattoos,
  hasNextPage,
  isNextPageLoading,
  loadNextPage
}: VirtualizedTattooGridProps) {
  const ITEM_HEIGHT = 400  // TattooCard height + margin
  const ITEM_WIDTH = 320   // TattooCard width + margin
  const CONTAINER_WIDTH = window.innerWidth - 64 // Account for padding

  const columnsCount = Math.floor(CONTAINER_WIDTH / ITEM_WIDTH)
  const rowCount = Math.ceil(tattoos.length / columnsCount)

  const isItemLoaded = (index: number) => {
    return index < tattoos.length
  }

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const itemIndex = rowIndex * columnsCount + columnIndex
    const tattoo = tattoos[itemIndex]

    if (!tattoo) return null

    return (
      <div style={style} className="p-2">
        <TattooCard
          tattoo={tattoo}
          size="md"
          onFavorite={handleFavorite}
          onContact={handleContact}
        />
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={hasNextPage ? tattoos.length + 1 : tattoos.length}
        loadMoreItems={loadNextPage}
      >
        {({ onItemsRendered, ref }) => (
          <Grid
            ref={ref}
            height={800}
            width={CONTAINER_WIDTH}
            columnCount={columnsCount}
            columnWidth={ITEM_WIDTH}
            rowCount={rowCount}
            rowHeight={ITEM_HEIGHT}
            onItemsRendered={({
              visibleColumnStartIndex,
              visibleColumnStopIndex,
              visibleRowStartIndex,
              visibleRowStopIndex
            }) => {
              const startIndex = visibleRowStartIndex * columnsCount + visibleColumnStartIndex
              const stopIndex = visibleRowStopIndex * columnsCount + visibleColumnStopIndex

              onItemsRendered({
                overscanStartIndex: startIndex,
                overscanStopIndex: stopIndex,
                visibleStartIndex: startIndex,
                visibleStopIndex: stopIndex
              })
            }}
          >
            {Cell}
          </Grid>
        )}
      </InfiniteLoader>
    </div>
  )
}
```

### 4. Memory Management

#### Component Cleanup Strategy

```typescript
// Memory-aware component with cleanup
export function TattooCard({ tattoo, onFavorite }: TattooCardProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending image loads
      if (imageRef.current) {
        imageRef.current.src = ''
      }

      // Disconnect observers
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // Clear any timeouts/intervals
      clearTimeout(animationTimeout.current)
    }
  }, [])

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!imageRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '50px' }
    )

    observerRef.current.observe(imageRef.current)

    return () => observerRef.current?.disconnect()
  }, [])
}
```

#### Event Listener Optimization

```typescript
// Centralized event management
class EventManager {
  private listeners = new Map<string, Set<Function>>()
  private throttledListeners = new Map<string, Function>()

  addListener(event: string, callback: Function, throttle = 0) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())

      const handler =
        throttle > 0
          ? this.throttle(this.handleEvent.bind(this, event), throttle)
          : this.handleEvent.bind(this, event)

      document.addEventListener(event, handler)
      this.throttledListeners.set(event, handler)
    }

    this.listeners.get(event)!.add(callback)
  }

  removeListener(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)

      if (eventListeners.size === 0) {
        const handler = this.throttledListeners.get(event)
        if (handler) {
          document.removeEventListener(event, handler)
          this.throttledListeners.delete(event)
        }
        this.listeners.delete(event)
      }
    }
  }

  private handleEvent(event: string, e: Event) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(e))
    }
  }

  private throttle(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null
    return (...args: any[]) => {
      if (timeout) return
      timeout = setTimeout(() => {
        func.apply(this, args)
        timeout = null
      }, wait)
    }
  }
}

// Usage in components
const eventManager = new EventManager()

export function useScrollOptimization() {
  const handleScroll = useCallback((e: Event) => {
    // Handle scroll efficiently
  }, [])

  useEffect(() => {
    eventManager.addListener('scroll', handleScroll, 16) // 60fps throttling
    return () => eventManager.removeListener('scroll', handleScroll)
  }, [handleScroll])
}
```

---

## 📈 Performance Monitoring

### Real-Time Performance Tracking

#### Client-Side Metrics Collection

```typescript
// Performance monitoring service
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  private observer: PerformanceObserver | null = null

  init() {
    // Web Vitals monitoring
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric(entry.name, entry.duration || entry.value)
      })
    })

    this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] })

    // Monitor component render times
    this.monitorComponentRenders()
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const values = this.metrics.get(name)!
    values.push(value)

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }

    // Alert on performance regression
    if (this.isPerformanceRegression(name, value)) {
      this.alertRegression(name, value)
    }
  }

  private monitorComponentRenders() {
    // Monkey patch React render methods for monitoring
    const originalRender = React.createElement
    React.createElement = (...args) => {
      const startTime = performance.now()
      const result = originalRender.apply(React, args)
      const endTime = performance.now()

      if (args[0]?.displayName || args[0]?.name) {
        const componentName = args[0].displayName || args[0].name
        this.recordMetric(`component.${componentName}.render`, endTime - startTime)
      }

      return result
    }
  }

  getMetrics() {
    const summary = new Map()

    this.metrics.forEach((values, name) => {
      const sorted = values.slice().sort((a, b) => a - b)
      summary.set(name, {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
      })
    })

    return summary
  }

  private isPerformanceRegression(name: string, value: number): boolean {
    const values = this.metrics.get(name)!
    if (values.length < 10) return false

    const recent = values.slice(-10)
    const average = recent.reduce((a, b) => a + b, 0) / recent.length

    // Alert if 50% slower than recent average
    return value > average * 1.5
  }

  private alertRegression(name: string, value: number) {
    console.warn(`Performance regression detected: ${name} took ${value}ms`)

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric: name, value, timestamp: Date.now() }),
      })
    }
  }
}

// Initialize monitoring
const performanceMonitor = new PerformanceMonitor()
performanceMonitor.init()
```

#### Development Performance Dashboard

```tsx
// Dev-only performance dashboard component
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(new Map())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics())
    }, 1000)

    // Keyboard shortcut to toggle dashboard
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      clearInterval(interval)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isVisible])

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-ink-300 rounded-lg shadow-lg p-4 z-50 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Performance Metrics</h3>
        <button onClick={() => setIsVisible(false)} className="text-ink-400 hover:text-ink-600">
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {Array.from(metrics.entries()).map(([name, stats]) => (
          <div key={name} className="flex justify-between">
            <span className="font-mono truncate">{name}</span>
            <span
              className={cn(
                'font-mono',
                stats.p95 > 50 && 'text-red-500',
                stats.p95 > 20 && stats.p95 <= 50 && 'text-yellow-500',
                stats.p95 <= 20 && 'text-green-500'
              )}
            >
              {stats.p95.toFixed(1)}ms
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs text-ink-500 mt-3 border-t pt-2">Press Ctrl+Shift+P to toggle</div>
    </div>
  )
}
```

---

## 🚀 Build Optimization

### Production Build Configuration

#### Vite Build Optimization

```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    // Enable all optimizations
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false, // Faster builds

    rollupOptions: {
      output: {
        // Aggressive code splitting
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            return 'vendor'
          }

          // Component chunks
          if (id.includes('components/')) {
            if (id.includes('SearchFilters') || id.includes('ContactModal')) {
              return 'components-heavy'
            }
            return 'components-core'
          }
        },
      },

      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },

    // Compression settings
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
    },
  },

  // CSS optimization
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
        // PurgeCSS for unused CSS removal
        purgecss({
          content: ['./inertia/**/*.{js,jsx,ts,tsx}'],
          safelist: {
            standard: [/^(bg|text|border)-/, /^hover:/, /^focus:/],
            deep: [/tooltip/, /modal/],
            greedy: [/tooltip$/, /modal$/],
          },
        }),
      ],
    },
  },
})
```

#### Critical CSS Generation

```typescript
// Critical CSS extraction
import { PurgeCSS } from 'purgecss'
import { readFileSync, writeFileSync } from 'fs'

async function generateCriticalCSS() {
  const purgeCSSResults = await new PurgeCSS().purge({
    content: [
      './inertia/pages/home.tsx',
      './inertia/components/Navigation.tsx',
      './inertia/components/ui/Button.tsx',
    ],
    css: ['./dist/assets/main.css'],
    safelist: [
      // Always include these classes
      'btn-primary',
      'nav-active',
      'hero-section',
    ],
  })

  const criticalCSS = purgeCSSResults[0].css
  writeFileSync('./dist/critical.css', criticalCSS)

  console.log(`Critical CSS generated: ${criticalCSS.length} bytes`)
}
```

---

## 📋 Performance Testing Checklist

### Automated Performance Tests

#### Component Performance Tests

```typescript
// Component performance test suite
describe('TattooCard Performance', () => {
  const PERFORMANCE_BUDGET = {
    render: 20,        // 20ms max render time
    rerender: 5,       // 5ms max re-render time
    memory: 1024 * 10  // 10KB max memory per instance
  }

  beforeEach(() => {
    performance.clearMarks()
    performance.clearMeasures()
  })

  it('should render within performance budget', () => {
    performance.mark('render-start')

    render(<TattooCard tattoo={mockTattoo} />)

    performance.mark('render-end')
    performance.measure('component-render', 'render-start', 'render-end')

    const renderTime = performance.getEntriesByName('component-render')[0].duration
    expect(renderTime).toBeLessThan(PERFORMANCE_BUDGET.render)
  })

  it('should re-render efficiently when props change', () => {
    const { rerender } = render(<TattooCard tattoo={mockTattoo} showPrice={false} />)

    performance.mark('rerender-start')

    rerender(<TattooCard tattoo={mockTattoo} showPrice={true} />)

    performance.mark('rerender-end')
    performance.measure('component-rerender', 'rerender-start', 'rerender-end')

    const rerenderTime = performance.getEntriesByName('component-rerender')[0].duration
    expect(rerenderTime).toBeLessThan(PERFORMANCE_BUDGET.rerender)
  })

  it('should not create memory leaks', () => {
    const initialHeap = (performance as any).memory?.usedJSHeapSize || 0

    // Render and unmount 100 components
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<TattooCard tattoo={mockTattoo} />)
      unmount()
    }

    // Force garbage collection if available
    if ((global as any).gc) {
      (global as any).gc()
    }

    const finalHeap = (performance as any).memory?.usedJSHeapSize || 0
    const heapIncrease = finalHeap - initialHeap

    expect(heapIncrease).toBeLessThan(PERFORMANCE_BUDGET.memory * 100)
  })
})
```

#### Bundle Size Tests

```typescript
// Bundle size regression tests
const fs = require('fs')
const path = require('path')

describe('Bundle Size Regression Tests', () => {
  const BUNDLE_SIZE_LIMITS = {
    'design-system-core': 50000, // 50KB
    'components-core': 30000, // 30KB
    'components-heavy': 80000, // 80KB
    'vendor-ui': 120000, // 120KB
  }

  Object.entries(BUNDLE_SIZE_LIMITS).forEach(([chunkName, sizeLimit]) => {
    it(`${chunkName} should not exceed size limit`, () => {
      const chunkPath = path.join(__dirname, `../dist/assets/${chunkName}.js`)

      if (!fs.existsSync(chunkPath)) {
        throw new Error(`Chunk file not found: ${chunkPath}`)
      }

      const stats = fs.statSync(chunkPath)
      const actualSize = stats.size

      expect(actualSize).toBeLessThanOrEqual(sizeLimit)

      // Warn if approaching limit (80% threshold)
      if (actualSize > sizeLimit * 0.8) {
        console.warn(
          `Warning: ${chunkName} is ${Math.round((actualSize / sizeLimit) * 100)}% of size limit`
        )
      }
    })
  })
})
```

---

## 📊 Performance Monitoring Dashboard

### Real-Time Metrics Display

#### Production Performance Tracking

```typescript
// Performance metrics service for production
class ProductionMetrics {
  private buffer: PerformanceEntry[] = []
  private sendTimeout: NodeJS.Timeout | null = null

  init() {
    // Collect Core Web Vitals
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.buffer.push({
          name: entry.name,
          value: (entry as any).value || entry.duration,
          timestamp: Date.now(),
          url: window.location.pathname,
        })
      })

      this.scheduleSend()
    }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

    // Monitor component performance
    this.monitorComponents()
  }

  private scheduleSend() {
    if (this.sendTimeout) return

    this.sendTimeout = setTimeout(() => {
      this.sendMetrics()
      this.sendTimeout = null
    }, 5000) // Send metrics every 5 seconds
  }

  private async sendMetrics() {
    if (this.buffer.length === 0) return

    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: this.buffer,
          userAgent: navigator.userAgent,
          connection: (navigator as any).connection?.effectiveType,
        }),
      })

      this.buffer = []
    } catch (error) {
      console.warn('Failed to send metrics:', error)
      // Keep metrics for retry
    }
  }

  reportCustomMetric(name: string, value: number, context?: any) {
    this.buffer.push({
      name: `custom.${name}`,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
      context,
    })

    this.scheduleSend()
  }
}

// Initialize in production
if (process.env.NODE_ENV === 'production') {
  const metrics = new ProductionMetrics()
  metrics.init()

  // Export for component usage
  window.__blottr_metrics = metrics
}
```

### Performance Alert System

```typescript
// Performance regression detection
class PerformanceAlerts {
  private baselines = new Map<string, number>()
  private alertThresholds = {
    render: 1.5, // 50% slower than baseline
    bundle: 1.2, // 20% larger than baseline
    memory: 2.0, // 100% more memory usage
  }

  setBaseline(metric: string, value: number) {
    this.baselines.set(metric, value)
  }

  checkRegression(metric: string, currentValue: number): boolean {
    const baseline = this.baselines.get(metric)
    if (!baseline) return false

    const metricType = metric.split('.')[0]
    const threshold = this.alertThresholds[metricType] || 1.5

    return currentValue > baseline * threshold
  }

  alert(metric: string, currentValue: number, baseline: number) {
    const regression = (((currentValue - baseline) / baseline) * 100).toFixed(1)

    console.error(`🚨 Performance Regression Detected:`)
    console.error(`Metric: ${metric}`)
    console.error(`Current: ${currentValue}`)
    console.error(`Baseline: ${baseline}`)
    console.error(`Regression: +${regression}%`)

    // Send alert to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/alerts/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric,
          currentValue,
          baseline,
          regression: parseFloat(regression),
          timestamp: Date.now(),
        }),
      })
    }
  }
}
```

---

## 🎯 Success Metrics Summary

### Key Performance Indicators (KPIs)

#### Technical Metrics

- **Bundle Size**: <400KB total, <80KB design system overhead
- **Component Render Time**: <20ms p95 for core components
- **Memory Usage**: <10MB additional heap allocation
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1

#### User Experience Metrics

- **Time to Interactive**: <3s on 3G networks
- **Search Response Time**: <200ms filter application
- **Image Loading**: Progressive with <1s perceived load
- **Mobile Performance**: 90+ Lighthouse score

#### Developer Experience Metrics

- **Build Time**: <30s full production build
- **Hot Reload**: <1s component change reflection
- **Bundle Analysis**: Automated size regression detection
- **Performance Testing**: 100% component coverage

---

**Document Version**: 1.0
**Performance Framework**: Web Vitals + Custom Metrics + Automated Testing
**Monitoring Strategy**: Real-time client-side + Server-side analytics
**Optimization Philosophy**: Measure → Optimize → Validate → Monitor\*\*
