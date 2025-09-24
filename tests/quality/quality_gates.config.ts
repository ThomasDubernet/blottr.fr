/**
 * Quality Gates Configuration for Design System Implementation
 * Aligned with Blottr's TDD methodology and existing tech stack
 */

export interface QualityGateConfig {
  name: string
  phase: 'pre-implementation' | 'development' | 'integration' | 'production-readiness'
  automated: boolean
  required: boolean
  tools: string[]
  timeout?: number
  retries?: number
}

export interface QualityGateResult {
  gate: string
  status: 'passed' | 'failed' | 'warning' | 'skipped'
  score?: number
  details: string[]
  metrics?: Record<string, number>
  evidence?: string[]
  timestamp: string
}

export const QUALITY_GATES: QualityGateConfig[] = [
  // Phase 1: Pre-Implementation Gates
  {
    name: 'dependency-compatibility',
    phase: 'pre-implementation',
    automated: true,
    required: true,
    tools: ['npm audit', 'npm outdated', 'depcheck'],
    timeout: 30000,
  },
  {
    name: 'architecture-review',
    phase: 'pre-implementation',
    automated: false,
    required: true,
    tools: ['manual-checklist', 'design-patterns-audit'],
  },
  {
    name: 'performance-impact',
    phase: 'pre-implementation',
    automated: true,
    required: true,
    tools: ['bundle-analyzer', 'lighthouse-ci'],
    timeout: 60000,
  },
  {
    name: 'security-audit',
    phase: 'pre-implementation',
    automated: true,
    required: true,
    tools: ['audit', 'snyk', 'eslint-security'],
    timeout: 45000,
  },

  // Phase 2: Development Phase Gates
  {
    name: 'tdd-compliance',
    phase: 'development',
    automated: true,
    required: true,
    tools: ['japa', 'test-coverage'],
    timeout: 120000,
  },
  {
    name: 'accessibility-testing',
    phase: 'development',
    automated: true,
    required: true,
    tools: ['axe-core', 'pa11y', 'lighthouse-a11y'],
    timeout: 90000,
  },
  {
    name: 'typescript-strict',
    phase: 'development',
    automated: true,
    required: true,
    tools: ['tsc', 'eslint-typescript'],
    timeout: 60000,
  },
  {
    name: 'component-standards',
    phase: 'development',
    automated: true,
    required: true,
    tools: ['eslint-react', 'prop-types-validation', 'component-linter'],
    timeout: 30000,
  },

  // Phase 3: Integration Gates
  {
    name: 'ssr-compatibility',
    phase: 'integration',
    automated: true,
    required: true,
    tools: ['inertia-ssr-test', 'hydration-test'],
    timeout: 90000,
  },
  {
    name: 'bundle-size',
    phase: 'integration',
    automated: true,
    required: true,
    tools: ['webpack-bundle-analyzer', 'size-limit'],
    timeout: 60000,
  },
  {
    name: 'cross-browser',
    phase: 'integration',
    automated: true,
    required: true,
    tools: ['playwright', 'browserstack'],
    timeout: 300000,
    retries: 2,
  },
  {
    name: 'mobile-responsive',
    phase: 'integration',
    automated: true,
    required: true,
    tools: ['playwright-mobile', 'responsive-checker'],
    timeout: 180000,
  },

  // Phase 4: Production Readiness Gates
  {
    name: 'performance-benchmark',
    phase: 'production-readiness',
    automated: true,
    required: true,
    tools: ['lighthouse', 'web-vitals', 'performance-budget'],
    timeout: 300000,
  },
  {
    name: 'accessibility-audit',
    phase: 'production-readiness',
    automated: true,
    required: true,
    tools: ['axe-audit', 'wcag-validator', 'color-contrast'],
    timeout: 120000,
  },
  {
    name: 'documentation-completeness',
    phase: 'production-readiness',
    automated: true,
    required: true,
    tools: ['docs-checker', 'storybook-coverage'],
    timeout: 60000,
  },
  {
    name: 'rollback-validation',
    phase: 'production-readiness',
    automated: false,
    required: true,
    tools: ['manual-rollback-test', 'deployment-check'],
  },
]

export const QUALITY_THRESHOLDS = {
  // Performance thresholds
  bundleSize: {
    maxIncrease: 50 * 1024, // 50KB max increase
    maxTotal: 500 * 1024, // 500KB total limit for design system
  },

  // Accessibility thresholds
  accessibility: {
    minScore: 95, // Lighthouse accessibility score
    wcagLevel: 'AA', // WCAG 2.1 AA compliance
  },

  // Test coverage thresholds
  coverage: {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90,
  },

  // Performance metrics
  performance: {
    fcp: 1500, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms)
    cls: 0.1, // Cumulative Layout Shift
    fid: 100, // First Input Delay (ms)
  },

  // TypeScript strict mode
  typescript: {
    strictNullChecks: true,
    strictFunctionTypes: true,
    noImplicitAny: true,
    noImplicitReturns: true,
  },
} as const

export const QUALITY_TOOLS = {
  // Dependency management
  'npm audit': 'npm audit --audit-level moderate',
  'npm outdated': 'npm outdated',
  depcheck: 'npx depcheck',

  // Testing
  japa: 'node ace test',
  'test-coverage': 'node ace test --coverage',

  // Accessibility
  'axe-core': 'npm run test:accessibility',
  pa11y: 'pa11y http://localhost:3333',
  'lighthouse-a11y': 'lighthouse --only-categories=accessibility',

  // TypeScript
  tsc: 'npm run typecheck',
  'eslint-typescript': 'eslint --ext .ts,.tsx',

  // Bundle analysis
  'webpack-bundle-analyzer': 'npm run analyze:bundle',
  'size-limit': 'npx size-limit',

  // Browser testing
  playwright: 'npm run test:e2e',
  'playwright-mobile': 'npm run test:mobile',

  // Performance
  lighthouse: 'lighthouse --output json --output html',
  'web-vitals': 'npm run test:vitals',
} as const
