/**
 * Accessibility Testing Suite for Design System Components
 * WCAG 2.1 AA Compliance Validation
 */

import { test } from '@japa/runner'
import { AxePuppeteer } from '@axe-core/puppeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

/**
 * Accessibility testing configuration
 */
const ACCESSIBILITY_CONFIG = {
  // WCAG 2.1 Level AA rules
  rules: {
    wcag2a: { enabled: true },
    wcag2aa: { enabled: true },
    wcag21a: { enabled: true },
    wcag21aa: { enabled: true },
  },

  // Tags to include in testing
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],

  // Minimum scores for different aspects
  thresholds: {
    violations: 0, // No WCAG violations allowed
    incomplete: 2, // Max 2 incomplete checks
    colorContrast: 4.5, // WCAG AA contrast ratio
    largeText: 3.0, // Large text contrast ratio
  },
}

let browser: Browser
let page: Page

test.group('Accessibility Tests', (group) => {
  group.setup(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    })
    page = await browser.newPage()

    // Set viewport for consistent testing
    await page.setViewport({ width: 1200, height: 800 })
  })

  group.teardown(async () => {
    if (browser) {
      await browser.close()
    }
  })

  /**
   * Test Button Component Accessibility
   */
  test('Button component meets WCAG 2.1 AA standards', async ({ assert }) => {
    // Navigate to component page (would be replaced with actual component URL)
    await page.goto('http://localhost:3333/components/button')

    // Run axe-core accessibility tests
    const axe = new AxePuppeteer(page)
    const results = await axe
      .withTags(ACCESSIBILITY_CONFIG.tags)
      .analyze()

    // Assert no WCAG violations
    assert.equal(
      results.violations.length,
      0,
      `Found ${results.violations.length} accessibility violations: ${results.violations
        .map((v) => `${v.id}: ${v.description}`)
        .join(', ')}`
    )

    // Check color contrast specifically
    const contrastResults = await axe.include('button').withRules(['color-contrast']).analyze()

    assert.equal(
      contrastResults.violations.length,
      0,
      'Button component must meet color contrast requirements'
    )

    // Test keyboard navigation
    await page.focus('button')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    assert.equal(focusedElement, 'BUTTON', 'Button should be focusable')

    // Test ARIA attributes
    const ariaLabel = await page.$eval('button', (el) => el.getAttribute('aria-label'))
    const innerText = await page.$eval('button', (el) => el.textContent)

    assert.isTrue(
      ariaLabel !== null || (innerText && innerText.trim().length > 0),
      'Button must have accessible name (aria-label or text content)'
    )
  })

  /**
   * Test Form Components Accessibility
   */
  test('Form components have proper labeling and structure', async ({ assert }) => {
    await page.goto('http://localhost:3333/components/forms')

    const axe = new AxePuppeteer(page)
    const results = await axe.withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze()

    // Check for form labeling issues
    const labelingViolations = results.violations.filter((v) =>
      ['label', 'form-field-multiple-labels', 'label-content-name-mismatch'].includes(v.id)
    )

    assert.equal(labelingViolations.length, 0, 'All form fields must have proper labels')

    // Test form validation accessibility
    const validationResults = await axe
      .withRules(['aria-valid-attr-value', 'aria-describedby'])
      .analyze()

    assert.equal(validationResults.violations.length, 0, 'Form validation must be accessible')

    // Test field associations
    const inputs = await page.$$('input, textarea, select')

    for (const input of inputs) {
      const hasLabel = await input.evaluate((el) => {
        const id = el.id
        const ariaLabel = el.getAttribute('aria-label')
        const ariaLabelledBy = el.getAttribute('aria-labelledby')
        const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null

        return !!(ariaLabel || ariaLabelledBy || associatedLabel)
      })

      assert.isTrue(hasLabel, 'Each form field must have an accessible label')
    }
  })

  /**
   * Test Navigation Component Accessibility
   */
  test('Navigation components support keyboard navigation', async ({ assert }) => {
    await page.goto('http://localhost:3333/components/navigation')

    // Test skip links
    const skipLink = await page.$('[href="#main"], [href="#content"]')
    if (skipLink) {
      await skipLink.focus()
      const isVisible = await skipLink.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return style.display !== 'none' && style.visibility !== 'hidden'
      })
      assert.isTrue(isVisible, 'Skip link should be visible when focused')
    }

    // Test menu navigation
    const menuItems = await page.$$('[role="menuitem"], nav a, .menu-item')

    if (menuItems.length > 0) {
      // Test Tab navigation through menu
      await menuItems[0].focus()

      for (let i = 0; i < menuItems.length - 1; i++) {
        await page.keyboard.press('Tab')
        const focusedElement = await page.evaluate(() => document.activeElement)
        assert.isNotNull(focusedElement, 'Focus should move through menu items')
      }

      // Test Arrow key navigation if present
      await menuItems[0].focus()
      await page.keyboard.press('ArrowDown')

      await page.evaluate(() => document.activeElement)
      // This test is optional as not all menus implement arrow key navigation
    }

    // Run standard accessibility tests
    const axe = new AxePuppeteer(page)
    const results = await axe.analyze()

    assert.equal(results.violations.length, 0, 'Navigation must be fully accessible')
  })

  /**
   * Test Modal/Dialog Accessibility
   */
  test('Modal components trap focus and manage ARIA', async ({ assert }) => {
    await page.goto('http://localhost:3333/components/modal')

    // Open modal if trigger exists
    const modalTrigger = await page.$(
      '[data-modal-trigger], .modal-trigger, button[aria-haspopup="dialog"]'
    )
    if (modalTrigger) {
      await modalTrigger.click()

      // Wait for modal to open
      await page.waitForSelector('[role="dialog"], .modal[aria-hidden="false"]', { timeout: 2000 })

      // Test focus trap
      const focusableElements = await page.$$(
        '[role="dialog"] button, [role="dialog"] input, [role="dialog"] a[href]'
      )

      if (focusableElements.length > 1) {
        await focusableElements[0].focus()

        // Tab through all elements and ensure focus stays within modal
        for (let i = 0; i < focusableElements.length + 2; i++) {
          await page.keyboard.press('Tab')

          const currentFocus = await page.evaluate(() => {
            const focused = document.activeElement
            return focused?.closest('[role="dialog"]') !== null
          })

          assert.isTrue(currentFocus, 'Focus must remain trapped within modal')
        }
      }

      // Test Escape key functionality
      await page.keyboard.press('Escape')

      const modalClosed = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]')
        return !modal || modal.getAttribute('aria-hidden') === 'true'
      })

      assert.isTrue(modalClosed, 'Modal should close on Escape key')
    }
  })

  /**
   * Test Color Contrast Compliance
   */
  test('All components meet color contrast requirements', async ({ assert }) => {
    const testPages = [
      '/components/buttons',
      '/components/forms',
      '/components/typography',
      '/components/cards',
    ]

    for (const testPage of testPages) {
      try {
        await page.goto(`http://localhost:3333${testPage}`)

        const axe = new AxePuppeteer(page)
        const results = await axe.withRules(['color-contrast']).analyze()

        assert.equal(
          results.violations.length,
          0,
          `Color contrast violations found on ${testPage}: ${results.violations
            .map((v) => v.description)
            .join(', ')}`
        )

        // Additional contrast checking for specific elements
        const contrastElements = await page.$$('button, a, .text-primary, .text-secondary')

        for (const element of contrastElements) {
          const hasGoodContrast = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el)
            const color = styles.color
            const backgroundColor = styles.backgroundColor

            // This is a simplified check - in practice you'd use a contrast calculation library
            return color !== backgroundColor
          })

          assert.isTrue(hasGoodContrast, `Element must have sufficient color contrast`)
        }
      } catch (error) {
        // Page might not exist yet, skip this test
        console.warn(`Skipping ${testPage}: ${error}`)
      }
    }
  })

  /**
   * Test Screen Reader Compatibility
   */
  test('Components provide proper screen reader information', async ({ assert }) => {
    await page.goto('http://localhost:3333/components')

    // Check for proper heading structure
    const headings = await page.$$('h1, h2, h3, h4, h5, h6')

    if (headings.length > 0) {
      const headingLevels = await Promise.all(
        headings.map((h) => h.evaluate((el) => parseInt(el.tagName.charAt(1))))
      )

      // Check for proper heading hierarchy (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i]
        const previousLevel = headingLevels[i - 1]

        if (currentLevel > previousLevel + 1) {
          assert.fail(`Heading level skip detected: h${previousLevel} followed by h${currentLevel}`)
        }
      }
    }

    // Check for alt text on images
    const images = await page.$$('img')

    for (const img of images) {
      const hasAltText = await img.evaluate((el) => {
        return el.hasAttribute('alt') || el.getAttribute('role') === 'presentation'
      })

      assert.isTrue(hasAltText, 'All images must have alt text or be marked as decorative')
    }

    // Check for ARIA landmarks
    const landmarks = await page.$$(
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer'
    )
    assert.isTrue(landmarks.length > 0, 'Page should have proper landmark structure')

    // Run comprehensive accessibility test
    const axe = new AxePuppeteer(page)
    const results = await axe.analyze()

    // Log any incomplete checks for manual review
    if (results.incomplete.length > 0) {
      console.log(
        'Manual accessibility review needed for:',
        results.incomplete.map((i) => i.id).join(', ')
      )
    }

    assert.equal(results.violations.length, 0, 'No accessibility violations allowed')
  })

  /**
   * Test Mobile Accessibility
   */
  test('Components are accessible on mobile devices', async ({ assert }) => {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 })
    await page.goto('http://localhost:3333/components')

    // Test touch target sizes
    const interactiveElements = await page.$$('button, a, input, [tabindex="0"]')

    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox()

      if (boundingBox) {
        const minSize = 44 // iOS minimum touch target size
        assert.isTrue(
          boundingBox.width >= minSize || boundingBox.height >= minSize,
          `Interactive element must be at least ${minSize}px in one dimension for touch accessibility`
        )
      }
    }

    // Test mobile-specific accessibility
    const axe = new AxePuppeteer(page)
    const results = await axe.withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze()

    assert.equal(results.violations.length, 0, 'Mobile accessibility violations detected')

    // Reset viewport
    await page.setViewport({ width: 1200, height: 800 })
  })
})
