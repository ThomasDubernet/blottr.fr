import { test, expect, Browser, Page } from '@playwright/test'

interface PageTestResult {
  url: string
  status: 'success' | 'error'
  errors: string[]
  consoleErrors: string[]
  loadTime: number
  responsiveResults: {
    mobile: boolean
    tablet: boolean
    desktop: boolean
    large: boolean
  }
  screenshots: {
    mobile?: string
    tablet?: string
    desktop?: string
    large?: string
  }
}

interface ResponsiveTest {
  name: string
  width: number
  height: number
}

const viewports: ResponsiveTest[] = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'large', width: 1440, height: 900 },
]

const pages = [
  { path: '/', name: 'Home' },
  { path: '/design-system', name: 'Design System' },
]

test.describe('Design System Integration Testing', () => {
  let testResults: PageTestResult[] = []

  test.beforeAll(async () => {
    console.log('Starting comprehensive design system integration tests...')
  })

  test.afterAll(async () => {
    // Generate comprehensive report
    const reportPath = '/Users/thomasdubernet/Work/Blottr/blottr.fr/tests/reports/design-system-integration-report.json'
    const report = {
      timestamp: new Date().toISOString(),
      totalPages: testResults.length,
      successCount: testResults.filter(r => r.status === 'success').length,
      errorCount: testResults.filter(r => r.status === 'error').length,
      averageLoadTime: testResults.reduce((sum, r) => sum + r.loadTime, 0) / testResults.length,
      results: testResults,
      summary: {
        criticalErrors: testResults.reduce((sum, r) => sum + r.errors.length, 0),
        consoleErrors: testResults.reduce((sum, r) => sum + r.consoleErrors.length, 0),
        responsiveIssues: testResults.filter(r =>
          !r.responsiveResults.mobile ||
          !r.responsiveResults.tablet ||
          !r.responsiveResults.desktop ||
          !r.responsiveResults.large
        ).length,
      }
    }

    console.log('\n📊 FINAL REPORT:')
    console.log(`✅ Successful pages: ${report.successCount}/${report.totalPages}`)
    console.log(`❌ Failed pages: ${report.errorCount}/${report.totalPages}`)
    console.log(`⚠️ Critical errors: ${report.summary.criticalErrors}`)
    console.log(`🖥️ Console errors: ${report.summary.consoleErrors}`)
    console.log(`📱 Responsive issues: ${report.summary.responsiveIssues}`)
    console.log(`⏱️ Average load time: ${report.averageLoadTime.toFixed(2)}ms`)

    // Save detailed report
    await require('fs').promises.mkdir('/Users/thomasdubernet/Work/Blottr/blottr.fr/tests/reports', { recursive: true })
    await require('fs').promises.writeFile(reportPath, JSON.stringify(report, null, 2))
    console.log(`📄 Detailed report saved: ${reportPath}`)
  })

  for (const pageInfo of pages) {
    test(`Test page: ${pageInfo.name} (${pageInfo.path})`, async ({ browser }) => {
      const result: PageTestResult = {
        url: pageInfo.path,
        status: 'success',
        errors: [],
        consoleErrors: [],
        loadTime: 0,
        responsiveResults: {
          mobile: false,
          tablet: false,
          desktop: false,
          large: false,
        },
        screenshots: {},
      }

      console.log(`\n🧪 Testing ${pageInfo.name} (${pageInfo.path})`)

      try {
        // Test across all viewport sizes
        for (const viewport of viewports) {
          console.log(`  📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`)

          const context = await browser.newContext({
            viewport: { width: viewport.width, height: viewport.height },
            userAgent: 'Mozilla/5.0 (compatible; BlottrTest/1.0; +https://blottr.fr)',
          })

          const page = await context.newPage()

          // Collect console errors
          const consoleErrors: string[] = []
          page.on('console', (msg) => {
            if (msg.type() === 'error') {
              consoleErrors.push(`[${viewport.name}] ${msg.text()}`)
            }
          })

          // Collect network errors
          page.on('pageerror', (error) => {
            result.errors.push(`[${viewport.name}] Page error: ${error.message}`)
          })

          page.on('requestfailed', (request) => {
            result.errors.push(`[${viewport.name}] Request failed: ${request.url()} - ${request.failure()?.errorText}`)
          })

          try {
            const startTime = Date.now()

            // Navigate to page
            const response = await page.goto(`http://localhost:3333${pageInfo.path}`, {
              waitUntil: 'networkidle',
              timeout: 30000,
            })

            result.loadTime = Date.now() - startTime

            // Check if page loaded successfully
            if (!response || response.status() !== 200) {
              result.errors.push(`[${viewport.name}] HTTP ${response?.status()}: Failed to load page`)
              result.status = 'error'
              continue
            }

            // Wait for React to hydrate
            await page.waitForLoadState('domcontentloaded')
            await page.waitForTimeout(2000) // Allow for component mounting

            // Check for critical errors
            await test.step(`Critical checks for ${viewport.name}`, async () => {
              // Check if main content is visible
              const hasContent = await page.locator('body').isVisible()
              if (!hasContent) {
                result.errors.push(`[${viewport.name}] Main content not visible`)
              }

              // Check for design system classes
              const hasDesignSystemClasses = await page.evaluate(() => {
                const elements = document.querySelectorAll('*')
                for (let el of elements) {
                  if (el.className && typeof el.className === 'string') {
                    // Check for Tailwind/design system classes
                    if (el.className.includes('bg-') ||
                        el.className.includes('text-') ||
                        el.className.includes('border-') ||
                        el.className.includes('container') ||
                        el.className.includes('btn') ||
                        el.className.includes('card')) {
                      return true
                    }
                  }
                }
                return false
              })

              if (!hasDesignSystemClasses) {
                result.errors.push(`[${viewport.name}] Design system classes not found`)
              }

              // Check for missing images
              const brokenImages = await page.evaluate(() => {
                const images = document.querySelectorAll('img')
                const broken = []
                for (let img of images) {
                  if (img.naturalWidth === 0 && img.naturalHeight === 0) {
                    broken.push(img.src)
                  }
                }
                return broken
              })

              if (brokenImages.length > 0) {
                result.errors.push(`[${viewport.name}] Broken images: ${brokenImages.join(', ')}`)
              }
            })

            // Test responsive behavior
            await test.step(`Responsive behavior for ${viewport.name}`, async () => {
              // Check if content adapts properly
              const bodyWidth = await page.evaluate(() => document.body.offsetWidth)
              const hasHorizontalScroll = await page.evaluate(() =>
                document.body.scrollWidth > document.body.offsetWidth
              )

              if (hasHorizontalScroll && viewport.width < 1024) {
                result.errors.push(`[${viewport.name}] Horizontal scroll detected on small viewport`)
              }

              // Check if navigation is accessible on mobile
              if (viewport.name === 'mobile') {
                const navElements = await page.locator('nav, [role="navigation"]').count()
                if (navElements === 0) {
                  result.errors.push(`[${viewport.name}] No navigation found`)
                }
              }

              result.responsiveResults[viewport.name as keyof typeof result.responsiveResults] =
                !hasHorizontalScroll || viewport.width >= 1024
            })

            // Test accessibility basics
            await test.step(`Accessibility checks for ${viewport.name}`, async () => {
              // Check for alt text on images
              const imagesWithoutAlt = await page.evaluate(() => {
                const images = document.querySelectorAll('img')
                let count = 0
                for (let img of images) {
                  if (!img.alt) count++
                }
                return count
              })

              if (imagesWithoutAlt > 0) {
                result.errors.push(`[${viewport.name}] ${imagesWithoutAlt} images without alt text`)
              }

              // Check for proper heading structure
              const headingStructure = await page.evaluate(() => {
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
                const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
                return levels
              })

              if (headingStructure.length > 0 && headingStructure[0] !== 1) {
                result.errors.push(`[${viewport.name}] Page should start with h1`)
              }
            })

            // Test component functionality (specific to pages)
            if (pageInfo.path === '/design-system') {
              await test.step(`Design system component tests`, async () => {
                // Test if buttons are interactive
                const buttons = await page.locator('button').count()
                if (buttons === 0) {
                  result.errors.push(`[${viewport.name}] No buttons found on design system page`)
                }

                // Test if cards are rendered
                const cards = await page.locator('[class*="card"], .card').count()
                if (cards === 0) {
                  result.errors.push(`[${viewport.name}] No cards found on design system page`)
                }

                // Test if color palette is visible
                const colorElements = await page.locator('[class*="bg-primary"], [class*="bg-gray"]').count()
                if (colorElements === 0) {
                  result.errors.push(`[${viewport.name}] Color palette not rendered properly`)
                }
              })
            }

            if (pageInfo.path === '/') {
              await test.step(`Home page specific tests`, async () => {
                // Check for hero section
                const heroSection = await page.locator('section').first().isVisible()
                if (!heroSection) {
                  result.errors.push(`[${viewport.name}] Hero section not visible`)
                }

                // Check for CTA buttons
                const ctaButtons = await page.locator('button, a[class*="btn"]').count()
                if (ctaButtons === 0) {
                  result.errors.push(`[${viewport.name}] No CTA buttons found`)
                }
              })
            }

            // Take screenshot for visual regression
            const screenshotPath = `/Users/thomasdubernet/Work/Blottr/blottr.fr/tests/screenshots/${pageInfo.name.toLowerCase().replace(' ', '-')}-${viewport.name}.png`
            await page.screenshot({
              path: screenshotPath,
              fullPage: true,
              animations: 'disabled',
            })
            result.screenshots[viewport.name as keyof typeof result.screenshots] = screenshotPath

            // Add console errors to result
            result.consoleErrors.push(...consoleErrors)

            console.log(`    ✅ ${viewport.name}: ${result.errors.length === 0 ? 'PASS' : `${result.errors.length} errors`}`)

          } catch (error) {
            result.errors.push(`[${viewport.name}] Test execution error: ${error.message}`)
            result.status = 'error'
            console.log(`    ❌ ${viewport.name}: ERROR - ${error.message}`)
          }

          await context.close()
        }

        // Performance checks
        await test.step('Performance validation', async () => {
          if (result.loadTime > 3000) {
            result.errors.push(`Slow load time: ${result.loadTime}ms (should be < 3000ms)`)
          }
        })

      } catch (globalError) {
        result.errors.push(`Global test error: ${globalError.message}`)
        result.status = 'error'
      }

      // Determine final status
      if (result.errors.length > 0) {
        result.status = 'error'
      }

      testResults.push(result)

      // Log individual page results
      console.log(`  📊 Results: ${result.status === 'success' ? '✅ PASS' : '❌ FAIL'}`)
      if (result.errors.length > 0) {
        console.log(`  🚨 Errors (${result.errors.length}):`)
        result.errors.forEach(error => console.log(`    - ${error}`))
      }
      if (result.consoleErrors.length > 0) {
        console.log(`  ⚠️ Console Errors (${result.consoleErrors.length}):`)
        result.consoleErrors.forEach(error => console.log(`    - ${error}`))
      }

      // Assertions for test framework
      expect(result.status).toBe('success')
    })
  }

  test('Cross-browser compatibility check', async ({ browser }) => {
    console.log('\n🌐 Testing cross-browser compatibility...')

    // This test checks if pages work across different browser engines
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 }
    })
    const page = await context.newPage()

    for (const pageInfo of pages) {
      try {
        const response = await page.goto(`http://localhost:3333${pageInfo.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })

        expect(response?.status()).toBe(200)

        // Check if CSS custom properties are supported
        const customPropsSupported = await page.evaluate(() => {
          const testEl = document.createElement('div')
          testEl.style.setProperty('--test-prop', 'test')
          return testEl.style.getPropertyValue('--test-prop') === 'test'
        })

        expect(customPropsSupported).toBe(true)

        console.log(`  ✅ ${pageInfo.name}: Cross-browser compatible`)

      } catch (error) {
        console.log(`  ❌ ${pageInfo.name}: Cross-browser issue - ${error.message}`)
        throw error
      }
    }

    await context.close()
  })

  test('Memory leak detection', async ({ browser }) => {
    console.log('\n🧠 Testing for memory leaks...')

    const context = await browser.newContext()
    const page = await context.newPage()

    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    // Navigate through pages multiple times
    for (let i = 0; i < 3; i++) {
      for (const pageInfo of pages) {
        await page.goto(`http://localhost:3333${pageInfo.path}`, {
          waitUntil: 'networkidle',
        })
        await page.waitForTimeout(1000)
      }
    }

    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory
      const increasePercent = (memoryIncrease / initialMemory) * 100

      console.log(`  📊 Memory usage: ${initialMemory} → ${finalMemory} bytes (${increasePercent.toFixed(1)}% increase)`)

      // Flag if memory increased significantly
      if (increasePercent > 50) {
        console.log(`  ⚠️ Potential memory leak detected`)
      } else {
        console.log(`  ✅ Memory usage within acceptable range`)
      }

      expect(increasePercent).toBeLessThan(100) // Allow up to 100% increase for dynamic content
    }

    await context.close()
  })
})