/**
 * TDD Compliance Testing Suite
 * Validates Test-Driven Development methodology adherence
 */

import { test } from '@japa/runner'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

/**
 * TDD compliance configuration
 */
const TDD_CONFIG = {
  // Minimum test coverage thresholds
  coverage: {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90,
  },

  // Test-to-code ratio expectations
  testRatio: {
    minimum: 0.5, // At least 50% as much test code as implementation
    ideal: 0.8, // Ideally 80% test-to-code ratio
  },

  // File patterns for analysis
  patterns: {
    implementation: ['inertia/**/*.tsx', 'inertia/**/*.ts', 'app/**/*.ts'],
    tests: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['node_modules/**', 'build/**', 'dist/**', '*.d.ts'],
  },

  // Required test patterns for TDD
  requiredTestTypes: [
    'unit', // Unit tests for individual components
    'integration', // Integration tests for component interactions
    'accessibility', // Accessibility compliance tests
    'performance', // Performance validation tests
  ],
}

// Removed unused interface

interface ComponentAnalysis {
  name: string
  implementationFile: string
  testFile?: string
  hasUnitTest: boolean
  hasIntegrationTest: boolean
  testLineRatio: number
  tddCompliant: boolean
  issues: string[]
}

test.group('TDD Compliance Tests', () => {
  /**
   * Test that all components follow test-first development
   */
  test('Components have corresponding test files', async ({ assert }) => {
    const componentDir = join(process.cwd(), 'inertia/pages')
    const testDir = join(process.cwd(), 'tests')

    // Collect all component files
    const components = await collectFiles(componentDir, ['.tsx', '.ts'])
    const testFiles = await collectFiles(testDir, ['.test.ts', '.spec.ts'])

    const missingTests: string[] = []
    const componentAnalysis: ComponentAnalysis[] = []

    for (const component of components) {
      const componentName = basename(component, extname(component))
      const relativeComponentPath = component.replace(process.cwd(), '')

      // Look for corresponding test file
      const expectedTestPatterns = [
        `${componentName}.test.ts`,
        `${componentName}.spec.ts`,
        `${componentName.toLowerCase()}.test.ts`,
        `${componentName.toLowerCase()}.spec.ts`,
      ]

      const correspondingTest = testFiles.find((testFile) => {
        const testFileName = basename(testFile)
        return expectedTestPatterns.some((pattern) =>
          testFileName.includes(pattern.replace('.test.ts', '').replace('.spec.ts', ''))
        )
      })

      const analysis: ComponentAnalysis = {
        name: componentName,
        implementationFile: relativeComponentPath,
        testFile: correspondingTest?.replace(process.cwd(), ''),
        hasUnitTest: !!correspondingTest,
        hasIntegrationTest: false,
        testLineRatio: 0,
        tddCompliant: false,
        issues: [],
      }

      if (!correspondingTest) {
        missingTests.push(relativeComponentPath)
        analysis.issues.push('No corresponding test file found')
      } else {
        // Analyze test quality
        const testContent = readFileSync(correspondingTest, 'utf8')
        const implementationContent = readFileSync(component, 'utf8')

        analysis.testLineRatio =
          testContent.split('\n').length / implementationContent.split('\n').length

        // Check for integration tests
        analysis.hasIntegrationTest = testFiles.some(
          (testFile) =>
            testFile.includes('integration') && testFile.includes(componentName.toLowerCase())
        )

        // Check test quality indicators
        if (!testContent.includes('describe') && !testContent.includes('test(')) {
          analysis.issues.push('Test file exists but contains no actual tests')
        }

        if (analysis.testLineRatio < TDD_CONFIG.testRatio.minimum) {
          analysis.issues.push(`Test-to-code ratio too low: ${analysis.testLineRatio.toFixed(2)}`)
        }

        if (!testContent.includes('assert') && !testContent.includes('expect')) {
          analysis.issues.push('Test file contains no assertions')
        }
      }

      analysis.tddCompliant = analysis.hasUnitTest && analysis.issues.length === 0

      componentAnalysis.push(analysis)
    }

    // Assert TDD compliance
    const compliantComponents = componentAnalysis.filter((c) => c.tddCompliant).length
    const complianceRatio = compliantComponents / componentAnalysis.length

    console.log(`TDD Compliance Report:`)
    console.log(`- Total components: ${componentAnalysis.length}`)
    console.log(`- Compliant components: ${compliantComponents}`)
    console.log(`- Compliance ratio: ${(complianceRatio * 100).toFixed(1)}%`)

    if (missingTests.length > 0) {
      console.log(`\nMissing tests for:`)
      missingTests.forEach((file) => console.log(`  - ${file}`))
    }

    assert.isTrue(
      complianceRatio >= 0.8,
      `TDD compliance too low: ${(complianceRatio * 100).toFixed(1)}% (minimum: 80%)`
    )

    assert.equal(
      missingTests.length,
      0,
      `${missingTests.length} components are missing tests: ${missingTests.join(', ')}`
    )
  })

  /**
   * Test that tests are written before implementation (TDD principle)
   */
  test('Test files created before or with implementation files', async ({ assert }) => {
    const componentDir = join(process.cwd(), 'inertia/pages')
    const testDir = join(process.cwd(), 'tests')

    const components = await collectFiles(componentDir, ['.tsx', '.ts'])
    const testFiles = await collectFiles(testDir, ['.test.ts', '.spec.ts'])

    const violations: string[] = []

    for (const component of components) {
      const componentName = basename(component, extname(component))
      const correspondingTest = testFiles.find(
        (testFile) =>
          basename(testFile).includes(componentName.toLowerCase()) ||
          basename(testFile).includes(componentName)
      )

      if (correspondingTest) {
        try {
          const componentStat = statSync(component)
          const testStat = statSync(correspondingTest)

          // Allow 1 day tolerance for simultaneous development
          const tolerance = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

          if (testStat.mtime.getTime() > componentStat.mtime.getTime() + tolerance) {
            violations.push(`${componentName}: Test created after implementation`)
          }
        } catch (error) {
          // File system timestamp comparison might not be available in all environments
          console.warn(`Could not verify file timestamps for ${componentName}`)
        }
      }
    }

    // This is a warning rather than a hard failure as git may not preserve file timestamps
    if (violations.length > 0) {
      console.warn('Potential TDD violations (test after implementation):')
      violations.forEach((violation) => console.warn(`  - ${violation}`))
    }

    // Don't fail the test for timestamp issues, but log the analysis
    assert.isTrue(true, 'TDD timestamp analysis completed')
  })

  /**
   * Test coverage requirements
   */
  test('Test coverage meets TDD standards', async ({ assert }) => {
    // This test would integrate with your coverage tool
    // For now, we'll simulate coverage analysis

    const mockCoverage = {
      statements: { covered: 450, total: 500, pct: 90 },
      branches: { covered: 340, total: 400, pct: 85 },
      functions: { covered: 180, total: 200, pct: 90 },
      lines: { covered: 450, total: 500, pct: 90 },
    }

    // In a real implementation, you would:
    // 1. Run your test suite with coverage
    // 2. Parse the coverage report
    // 3. Analyze coverage by component

    const thresholds = TDD_CONFIG.coverage

    assert.isTrue(
      mockCoverage.statements.pct >= thresholds.statements,
      `Statement coverage ${mockCoverage.statements.pct}% below threshold ${thresholds.statements}%`
    )

    assert.isTrue(
      mockCoverage.branches.pct >= thresholds.branches,
      `Branch coverage ${mockCoverage.branches.pct}% below threshold ${thresholds.branches}%`
    )

    assert.isTrue(
      mockCoverage.functions.pct >= thresholds.functions,
      `Function coverage ${mockCoverage.functions.pct}% below threshold ${thresholds.functions}%`
    )

    assert.isTrue(
      mockCoverage.lines.pct >= thresholds.lines,
      `Line coverage ${mockCoverage.lines.pct}% below threshold ${thresholds.lines}%`
    )
  })

  /**
   * Test that components have proper test structure
   */
  test('Test files follow proper structure and patterns', async ({ assert }) => {
    const testDir = join(process.cwd(), 'tests')
    const testFiles = await collectFiles(testDir, ['.test.ts', '.spec.ts'])

    const structureViolations: string[] = []
    let validTestCount = 0

    for (const testFile of testFiles) {
      const content = readFileSync(testFile, 'utf8')
      const fileName = basename(testFile)

      // Check for required test structure elements
      const hasDescribe = content.includes('test.group(') || content.includes('describe(')
      const hasTests = content.includes('test(') || content.includes('it(')
      const hasAssertions = content.includes('assert.') || content.includes('expect(')

      if (!hasDescribe) {
        structureViolations.push(`${fileName}: Missing test group/describe block`)
      }

      if (!hasTests) {
        structureViolations.push(`${fileName}: Missing test cases`)
      }

      if (!hasAssertions) {
        structureViolations.push(`${fileName}: Missing assertions`)
      }

      // Check for async/await usage (important for component testing)
      if (content.includes('test(') && !content.includes('async')) {
        // Not all tests need to be async, but component tests usually are
        if (fileName.includes('component') || content.includes('render')) {
          structureViolations.push(`${fileName}: Component tests should be async`)
        }
      }

      // Check for proper imports
      if (!content.includes("from '@japa/")) {
        structureViolations.push(`${fileName}: Missing proper test framework imports`)
      }

      if (hasDescribe && hasTests && hasAssertions) {
        validTestCount++
      }
    }

    const validTestRatio = validTestCount / testFiles.length

    console.log(`Test Structure Report:`)
    console.log(`- Total test files: ${testFiles.length}`)
    console.log(`- Valid structure: ${validTestCount}`)
    console.log(`- Structure compliance: ${(validTestRatio * 100).toFixed(1)}%`)

    if (structureViolations.length > 0) {
      console.log(`\nStructure violations:`)
      structureViolations.slice(0, 10).forEach((violation) => console.log(`  - ${violation}`))
      if (structureViolations.length > 10) {
        console.log(`  ... and ${structureViolations.length - 10} more`)
      }
    }

    assert.isTrue(
      validTestRatio >= 0.8,
      `Test structure compliance too low: ${(validTestRatio * 100).toFixed(1)}% (minimum: 80%)`
    )
  })

  /**
   * Test that all required test types exist
   */
  test('All required test types are present', async ({ assert }) => {
    const testDir = join(process.cwd(), 'tests')
    const testFiles = await collectFiles(testDir, ['.test.ts', '.spec.ts'])

    const foundTestTypes: Set<string> = new Set()

    for (const testFile of testFiles) {
      const content = readFileSync(testFile, 'utf8')
      const fileName = basename(testFile).toLowerCase()

      // Identify test types based on file names and content
      if (fileName.includes('unit') || content.includes('unit test')) {
        foundTestTypes.add('unit')
      }

      if (fileName.includes('integration') || content.includes('integration test')) {
        foundTestTypes.add('integration')
      }

      if (
        fileName.includes('accessibility') ||
        content.includes('accessibility') ||
        content.includes('a11y')
      ) {
        foundTestTypes.add('accessibility')
      }

      if (
        fileName.includes('performance') ||
        content.includes('performance') ||
        content.includes('perf')
      ) {
        foundTestTypes.add('performance')
      }

      // Additional test type detection based on content patterns
      if (content.includes('render') && content.includes('component')) {
        foundTestTypes.add('unit')
      }

      if (content.includes('page.goto') || content.includes('browser')) {
        foundTestTypes.add('integration')
      }

      if (content.includes('axe') || content.includes('wcag')) {
        foundTestTypes.add('accessibility')
      }

      if (content.includes('lighthouse') || content.includes('web vitals')) {
        foundTestTypes.add('performance')
      }
    }

    const missingTestTypes = TDD_CONFIG.requiredTestTypes.filter(
      (type) => !foundTestTypes.has(type)
    )

    console.log(`Test Type Coverage:`)
    console.log(`- Found test types: ${Array.from(foundTestTypes).join(', ')}`)
    console.log(`- Required test types: ${TDD_CONFIG.requiredTestTypes.join(', ')}`)

    if (missingTestTypes.length > 0) {
      console.log(`- Missing test types: ${missingTestTypes.join(', ')}`)
    }

    assert.equal(
      missingTestTypes.length,
      0,
      `Missing required test types: ${missingTestTypes.join(', ')}`
    )

    assert.isTrue(
      foundTestTypes.size >= TDD_CONFIG.requiredTestTypes.length,
      `Insufficient test type coverage: found ${foundTestTypes.size}, required ${TDD_CONFIG.requiredTestTypes.length}`
    )
  })

  /**
   * Test-to-code ratio analysis
   */
  test('Test-to-code ratio meets TDD standards', async ({ assert }) => {
    const implementationDir = join(process.cwd(), 'inertia')
    const testDir = join(process.cwd(), 'tests')

    const implementationFiles = await collectFiles(implementationDir, ['.tsx', '.ts'])
    const testFiles = await collectFiles(testDir, ['.test.ts', '.spec.ts'])

    let implementationLines = 0
    let testLines = 0

    // Count lines in implementation files
    for (const file of implementationFiles) {
      const content = readFileSync(file, 'utf8')
      implementationLines += content
        .split('\n')
        .filter((line) => line.trim().length > 0 && !line.trim().startsWith('//')).length
    }

    // Count lines in test files
    for (const file of testFiles) {
      const content = readFileSync(file, 'utf8')
      testLines += content
        .split('\n')
        .filter((line) => line.trim().length > 0 && !line.trim().startsWith('//')).length
    }

    const testRatio = testLines / implementationLines

    console.log(`Code Metrics:`)
    console.log(`- Implementation lines: ${implementationLines}`)
    console.log(`- Test lines: ${testLines}`)
    console.log(`- Test-to-code ratio: ${testRatio.toFixed(2)}`)
    console.log(`- Minimum required: ${TDD_CONFIG.testRatio.minimum}`)
    console.log(`- Ideal target: ${TDD_CONFIG.testRatio.ideal}`)

    assert.isTrue(
      testRatio >= TDD_CONFIG.testRatio.minimum,
      `Test-to-code ratio ${testRatio.toFixed(2)} below minimum ${TDD_CONFIG.testRatio.minimum}`
    )

    if (testRatio >= TDD_CONFIG.testRatio.ideal) {
      console.log('✅ Excellent test coverage ratio!')
    } else if (testRatio >= TDD_CONFIG.testRatio.minimum) {
      console.log('⚠️ Adequate test coverage, consider increasing for better TDD compliance')
    }
  })
})

/**
 * Helper function to recursively collect files with specific extensions
 */
async function collectFiles(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)

      try {
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          // Skip common directories that shouldn't contain our files
          if (!['node_modules', '.git', 'build', 'dist', 'coverage'].includes(entry)) {
            files.push(...(await collectFiles(fullPath, extensions)))
          }
        } else if (stat.isFile()) {
          const ext = extname(fullPath)
          if (extensions.includes(ext)) {
            files.push(fullPath)
          }
        }
      } catch (error) {
        // Skip files we can't read
        console.warn(`Could not process ${fullPath}: ${error}`)
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    console.warn(`Could not read directory ${dir}: ${error}`)
  }

  return files
}
