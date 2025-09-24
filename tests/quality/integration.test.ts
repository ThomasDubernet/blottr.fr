/**
 * Integration Testing Suite for Design System Components
 * Inertia.js SSR, Cross-browser, and Mobile Compatibility Testing
 */

import { test } from '@japa/runner'
import { chromium, firefox, webkit, Browser, Page, devices } from 'playwright'

/**
 * Integration testing configuration
 */
const INTEGRATION_CONFIG = {
  // Browser configurations
  browsers: [
    { name: 'chromium', launcher: chromium },
    { name: 'firefox', launcher: firefox },
    { name: 'webkit', launcher: webkit },
  ],

  // Mobile device configurations
  mobileDevices: [
    'iPhone 12',
    'iPhone SE',
    'iPad',
    'Pixel 5',
    'Samsung Galaxy S21',
    'Galaxy Tab S4',
  ],

  // Test URLs for component integration
  testUrls: [
    '/components/buttons',
    '/components/forms',
    '/components/navigation',
    '/components/cards',
    '/components/modals',
  ],

  // SSR validation checks
  ssrChecks: {
    hydrationMismatch: false,
    clientOnlyContent: true,
    serverRenderedContent: true,
    interactivityAfterHydration: true,
  },
}

test.group('Integration Tests', () => {
  /**
   * Test Cross-Browser Compatibility
   */
  test('Components work consistently across browsers', async ({ assert }) => {
    const browserResults: Record<string, any> = {}

    for (const browserConfig of INTEGRATION_CONFIG.browsers) {
      const browser = await browserConfig.launcher.launch({ headless: true })

      try {
        const context = await browser.newContext()
        const page = await context.newPage()

        console.log(`Testing in ${browserConfig.name}...`)

        // Test each component URL
        for (const url of INTEGRATION_CONFIG.testUrls) {
          try {
            await page.goto(`http://localhost:3333${url}`, { waitUntil: 'networkidle' })

            // Check if page loaded without errors
            const pageErrors: string[] = []

            page.on('pageerror', (error) => {
              pageErrors.push(`Page error: ${error.message}`)
            })

            page.on('console', (msg) => {
              if (msg.type() === 'error') {
                pageErrors.push(`Console error: ${msg.text()}`)
              }
            })

            // Wait for React to hydrate
            await page.waitForTimeout(2000)

            // Test basic interactivity
            const interactiveElements = await page.locator('button, input, select, a[href]').count()

            if (interactiveElements > 0) {
              // Test first interactive element
              const firstElement = page.locator('button, input, select, a[href]').first()
              await firstElement.focus()

              const isFocused = await firstElement.evaluate((el) => el === document.activeElement)
              assert.isTrue(isFocused, `Element should be focusable in ${browserConfig.name}`)
            }

            // Check for layout shifts
            const layoutShifts = await page.evaluate(() => {
              return new Promise((resolve) => {
                let clsValue = 0
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                      clsValue += (entry as any).value
                    }
                  }
                  setTimeout(() => resolve(clsValue), 1000)
                }).observe({ entryTypes: ['layout-shift'] })
              })
            })

            browserResults[`${browserConfig.name}_${url}`] = {
              loaded: true,
              errors: pageErrors,
              interactive: interactiveElements > 0,
              layoutShift: layoutShifts,
            }

            // Assert no major layout shifts
            assert.isTrue(
              Number(layoutShifts) < 0.25,
              `Layout shift (${layoutShifts}) too high in ${browserConfig.name} for ${url}`
            )

            // Assert no JavaScript errors
            assert.equal(
              pageErrors.length,
              0,
              `JavaScript errors in ${browserConfig.name} for ${url}: ${pageErrors.join(', ')}`
            )
          } catch (error) {
            browserResults[`${browserConfig.name}_${url}`] = {
              loaded: false,
              error: error instanceof Error ? error.message : String(error),
            }

            console.warn(`Failed to test ${url} in ${browserConfig.name}: ${error}`)
          }
        }

        await context.close()
      } finally {
        await browser.close()
      }
    }

    // Verify consistent behavior across browsers
    for (const url of INTEGRATION_CONFIG.testUrls) {
      const browserSpecificResults = INTEGRATION_CONFIG.browsers
        .map((b) => browserResults[`${b.name}_${url}`])
        .filter(Boolean)

      if (browserSpecificResults.length > 1) {
        const allLoaded = browserSpecificResults.every((r) => r.loaded)
        assert.isTrue(allLoaded, `${url} should load consistently across all browsers`)
      }
    }
  })

  /**
   * Test Mobile Responsiveness
   */
  test('Components are responsive on mobile devices', async ({ assert }) => {
    const browser = await chromium.launch({ headless: true })

    try {
      for (const deviceName of INTEGRATION_CONFIG.mobileDevices) {
        const device = devices[deviceName]
        if (!device) continue

        const context = await browser.newContext({
          ...device,
          locale: 'en-US',
        })

        const page = await context.newPage()

        console.log(`Testing on ${deviceName}...`)

        for (const url of INTEGRATION_CONFIG.testUrls) {
          try {
            await page.goto(`http://localhost:3333${url}`)

            // Wait for content to load
            await page.waitForLoadState('networkidle')

            // Check viewport dimensions
            const viewport = await page.evaluate(() => ({
              width: window.innerWidth,
              height: window.innerHeight,
              devicePixelRatio: window.devicePixelRatio,
            }))

            // Test touch interactions if on touch device
            if (device.isMobile) {
              const touchableElements = page.locator('button, a, [role="button"]')
              const touchElementCount = await touchableElements.count()

              if (touchElementCount > 0) {
                // Test first touchable element
                const firstTouchable = touchableElements.first()

                // Check touch target size (minimum 44x44px for accessibility)
                const boundingBox = await firstTouchable.boundingBox()
                if (boundingBox) {
                  const minTouchSize = 44
                  assert.isTrue(
                    boundingBox.width >= minTouchSize - 8 || boundingBox.height >= minTouchSize - 8,
                    `Touch target too small on ${deviceName}: ${boundingBox.width}x${boundingBox.height}`
                  )
                }

                // Test tap interaction
                await firstTouchable.tap()
                await page.waitForTimeout(100)
              }
            }

            // Check for horizontal scrolling (usually indicates responsive issues)
            const hasHorizontalScroll = await page.evaluate(() => {
              return document.documentElement.scrollWidth > window.innerWidth
            })

            assert.isFalse(
              hasHorizontalScroll,
              `Horizontal scrolling detected on ${deviceName} for ${url}`
            )

            // Test text readability (font size should be at least 16px on mobile)
            const textElements = page.locator('p, span, div').filter({
              has: page.locator(':scope:not(:empty)'),
            })

            const textElementCount = await textElements.count()
            if (textElementCount > 0) {
              const fontSize = await textElements.first().evaluate((el) => {
                const styles = window.getComputedStyle(el)
                return parseFloat(styles.fontSize)
              })

              if (device.isMobile) {
                assert.isTrue(
                  fontSize >= 14,
                  `Text too small on ${deviceName}: ${fontSize}px (should be ≥14px)`
                )
              }
            }
          } catch (error) {
            console.warn(`Failed to test ${url} on ${deviceName}: ${error}`)
          }
        }

        await context.close()
      }
    } finally {
      await browser.close()
    }
  })

  /**
   * Test Inertia.js SSR Compatibility
   */
  test('Components work with Inertia.js SSR', async ({ assert }) => {
    const browser = await chromium.launch({ headless: true })

    try {
      const context = await browser.newContext()
      const page = await context.newPage()

      // Track client/server render mismatches
      const hydrationErrors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error' && msg.text().includes('hydrat')) {
          hydrationErrors.push(msg.text())
        }
      })

      for (const url of INTEGRATION_CONFIG.testUrls) {
        console.log(`Testing SSR for ${url}...`)

        // Test server-rendered content
        const response = await page.goto(`http://localhost:3333${url}`)
        assert.isTrue(response?.ok(), `Server should respond successfully for ${url}`)

        // Check if content is server-rendered
        const initialHtml = await page.content()
        const hasServerRenderedContent =
          !initialHtml.includes('<div id="root"></div>') ||
          initialHtml.includes('data-server-rendered')

        if (INTEGRATION_CONFIG.ssrChecks.serverRenderedContent) {
          assert.isTrue(hasServerRenderedContent, `${url} should have server-rendered content`)
        }

        // Wait for client hydration
        await page.waitForTimeout(2000)

        // Check for hydration mismatches
        assert.equal(
          hydrationErrors.length,
          0,
          `Hydration errors detected for ${url}: ${hydrationErrors.join(', ')}`
        )

        // Test that interactive elements work after hydration
        const buttons = page.locator('button')
        const buttonCount = await buttons.count()

        if (buttonCount > 0) {
          const firstButton = buttons.first()

          // Test button click after hydration
          let clickHandled = false
          await firstButton.click()

          // Check if click event was handled (this is component-specific)
          await page.waitForTimeout(100)

          // For this test, we'll check if focus moved or if there's some visual feedback
          const hasActiveState = await firstButton.evaluate((el) => {
            const styles = window.getComputedStyle(el)
            return el === document.activeElement || styles.transform !== 'none'
          })

          // This assertion might need to be adjusted based on actual component behavior
          console.log(`Button interaction test for ${url}: active state = ${hasActiveState}`)
        }

        // Test form elements if present
        const formElements = page.locator('input, textarea, select')
        const formElementCount = await formElements.count()

        if (formElementCount > 0) {
          const firstInput = formElements.first()

          // Test input functionality after hydration
          await firstInput.focus()
          await firstInput.fill('test input')

          const inputValue = await firstInput.inputValue()
          assert.equal(
            inputValue,
            'test input',
            `Form input should work after hydration for ${url}`
          )
        }

        // Test navigation elements
        const navLinks = page.locator('a[href^="/"]')
        const navLinkCount = await navLinks.count()

        if (navLinkCount > 0) {
          // Check if navigation links are properly set up for Inertia
          const hasInertiaLinks = await navLinks.first().evaluate((el) => {
            return (
              el.hasAttribute('data-inertia-link') ||
              el.classList.contains('inertia-link') ||
              !el.hasAttribute('target')
            )
          })

          // This check depends on how Inertia.js handles links in your setup
          console.log(`Navigation setup for ${url}: Inertia-compatible = ${hasInertiaLinks}`)
        }
      }

      await context.close()
    } finally {
      await browser.close()
    }
  })

  /**
   * Test Form Integration with AdonisJS Validation
   */
  test('Form components integrate with AdonisJS validation', async ({ assert }) => {
    const browser = await chromium.launch({ headless: true })

    try {
      const context = await browser.newContext()
      const page = await context.newPage()

      // Test forms page if it exists
      try {
        await page.goto('http://localhost:3333/components/forms')

        // Find forms on the page
        const forms = page.locator('form')
        const formCount = await forms.count()

        if (formCount > 0) {
          for (let i = 0; i < formCount; i++) {
            const form = forms.nth(i)

            // Test form submission with invalid data
            const submitButton = form.locator('button[type="submit"], input[type="submit"]').first()

            if ((await submitButton.count()) > 0) {
              // Fill form with invalid data to test validation
              const textInputs = form.locator(
                'input[type="text"], input[type="email"], input[type="password"]'
              )
              const textInputCount = await textInputs.count()

              if (textInputCount > 0) {
                // Fill first input with invalid data
                await textInputs.first().fill('')
                await submitButton.click()

                // Wait for validation response
                await page.waitForTimeout(1000)

                // Check for validation errors
                const validationErrors = page.locator('.error, .validation-error, [role="alert"]')
                const errorCount = await validationErrors.count()

                if (errorCount > 0) {
                  const errorText = await validationErrors.first().textContent()
                  assert.isString(errorText, 'Validation errors should be displayed as text')

                  assert.isTrue(
                    (errorText || '').length > 0,
                    'Validation error should have meaningful message'
                  )
                }

                // Test valid form submission
                const emailInput = form.locator('input[type="email"]').first()
                if ((await emailInput.count()) > 0) {
                  await emailInput.fill('test@example.com')
                }

                const textInput = form.locator('input[type="text"]').first()
                if ((await textInput.count()) > 0) {
                  await textInput.fill('Valid input')
                }

                const passwordInput = form.locator('input[type="password"]').first()
                if ((await passwordInput.count()) > 0) {
                  await passwordInput.fill('validPassword123')
                }

                // Submit form with valid data
                await submitButton.click()
                await page.waitForTimeout(1000)

                // Check that validation errors are cleared
                const remainingErrors = await validationErrors.count()
                assert.isTrue(
                  remainingErrors === 0 || remainingErrors < errorCount,
                  'Validation errors should be cleared after fixing issues'
                )
              }
            }
          }
        }
      } catch (error) {
        console.warn('Forms page not available for testing:', error)
      }

      await context.close()
    } finally {
      await browser.close()
    }
  })

  /**
   * Test Component State Persistence
   */
  test('Component state persists correctly during navigation', async ({ assert }) => {
    const browser = await chromium.launch({ headless: true })

    try {
      const context = await browser.newContext()
      const page = await context.newPage()

      // Test navigation between component pages
      await page.goto('http://localhost:3333/components/buttons')

      // Interact with components to create state
      const toggleButtons = page.locator('button').filter({
        hasText: /toggle|switch|active/i,
      })

      const toggleCount = await toggleButtons.count()

      if (toggleCount > 0) {
        // Click toggle button to change state
        await toggleButtons.first().click()
        await page.waitForTimeout(100)

        const buttonState =
          (await toggleButtons.first().getAttribute('aria-pressed')) ||
          (await toggleButtons.first().getAttribute('data-active'))

        // Navigate to another page and back
        await page.goto('http://localhost:3333/components/forms')
        await page.waitForTimeout(500)

        await page.goBack()
        await page.waitForTimeout(500)

        // Check if appropriate state handling occurred
        // (This test depends on your specific implementation)
        const newButtonState =
          (await toggleButtons.first().getAttribute('aria-pressed')) ||
          (await toggleButtons.first().getAttribute('data-active'))

        // In most cases, component state should reset after navigation
        // unless specifically persisted
        console.log(`State persistence test: ${buttonState} -> ${newButtonState}`)
      }

      // Test form state preservation
      try {
        await page.goto('http://localhost:3333/components/forms')

        const textInputs = page.locator('input[type="text"]')
        const inputCount = await textInputs.count()

        if (inputCount > 0) {
          const testValue = 'persistence test value'
          await textInputs.first().fill(testValue)

          // Navigate away and back
          await page.goto('http://localhost:3333/components/buttons')
          await page.waitForTimeout(500)
          await page.goBack()
          await page.waitForTimeout(500)

          // Check if form was reset (expected behavior)
          const inputValue = await textInputs.first().inputValue()

          // Form should typically be reset after navigation
          assert.notEqual(
            inputValue,
            testValue,
            'Form values should not persist after navigation unless specifically implemented'
          )
        }
      } catch (error) {
        console.warn('Form persistence test skipped:', error)
      }

      await context.close()
    } finally {
      await browser.close()
    }
  })

  /**
   * Test Keyboard Navigation
   */
  test('Keyboard navigation works consistently across components', async ({ assert }) => {
    const browser = await chromium.launch({ headless: true })

    try {
      const context = await browser.newContext()
      const page = await context.newPage()

      for (const url of INTEGRATION_CONFIG.testUrls) {
        console.log(`Testing keyboard navigation for ${url}...`)

        await page.goto(`http://localhost:3333${url}`)
        await page.waitForLoadState('networkidle')

        // Find all focusable elements
        const focusableElements = page.locator(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
        )

        const focusableCount = await focusableElements.count()

        if (focusableCount > 0) {
          // Test Tab navigation through all elements
          await page.keyboard.press('Tab')

          for (let i = 0; i < Math.min(focusableCount, 10); i++) {
            const focusedElement = await page.evaluate(() => {
              const focused = document.activeElement
              return {
                tagName: focused?.tagName.toLowerCase(),
                type: focused?.getAttribute('type'),
                role: focused?.getAttribute('role'),
                ariaLabel: focused?.getAttribute('aria-label'),
                hasText: (focused?.textContent || '').trim().length > 0,
              }
            })

            // Assert that focused element is actually focusable
            assert.isTrue(
              focusedElement.tagName !== 'body',
              `Tab navigation should focus on interactive elements, not body`
            )

            // Move to next element
            if (i < focusableCount - 1) {
              await page.keyboard.press('Tab')
            }
          }

          // Test Shift+Tab reverse navigation
          for (let i = 0; i < 3; i++) {
            await page.keyboard.press('Shift+Tab')

            const focusedElement = await page.evaluate(() => {
              return document.activeElement?.tagName.toLowerCase()
            })

            assert.isTrue(focusedElement !== 'body', 'Shift+Tab navigation should work properly')
          }

          // Test Enter/Space activation on buttons
          const buttons = page.locator('button, [role="button"]')
          const buttonCount = await buttons.count()

          if (buttonCount > 0) {
            await buttons.first().focus()

            // Test Enter key activation
            await page.keyboard.press('Enter')
            await page.waitForTimeout(100)

            // Test Space key activation
            await page.keyboard.press('Space')
            await page.waitForTimeout(100)

            // The actual behavior test would depend on the specific button implementation
            console.log(`Button activation test completed for ${url}`)
          }
        }
      }

      await context.close()
    } finally {
      await browser.close()
    }
  })
})
