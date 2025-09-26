import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('WCAG Accessibility Audit', () => {
  test('Home page should be accessible', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Artist profile page should be accessible', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Contact modal should be accessible', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    // Open contact modal
    await page.click('button:has-text("Contacter")')

    // Wait for modal to be visible
    await page.waitForSelector('[role="dialog"]')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Form validation should be accessible', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    // Open contact modal
    await page.click('button:has-text("Contacter")')
    await page.waitForSelector('[role="dialog"]')

    // Try to submit without filling required fields
    await page.click('button:has-text("Suivant")')

    // Wait for error messages
    await page.waitForSelector('text="Nom requis"')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Keyboard navigation should work', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    // Test keyboard navigation to contact button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should be able to activate contact button with Enter
    const contactButton = page.locator('button:has-text("Contacter")')
    await contactButton.focus()
    await page.keyboard.press('Enter')

    // Modal should open
    await page.waitForSelector('[role="dialog"]')

    // Should be able to close with Escape
    await page.keyboard.press('Escape')

    // Modal should close
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' })
  })

  test('Focus management in modal', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    // Open modal
    await page.click('button:has-text("Contacter")')
    await page.waitForSelector('[role="dialog"]')

    // First form input should receive focus
    const firstInput = page.locator('input[name="fullName"]')
    await expect(firstInput).toBeFocused()

    // Tab through form elements
    await page.keyboard.press('Tab')
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toBeFocused()

    await page.keyboard.press('Tab')
    const phoneInput = page.locator('input[name="phone"]')
    await expect(phoneInput).toBeFocused()
  })

  test('Screen reader labels should be present', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    // Open contact modal
    await page.click('button:has-text("Contacter")')
    await page.waitForSelector('[role="dialog"]')

    // Check for proper ARIA labels
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveAttribute('aria-labelledby')

    // Check form labels
    const nameInput = page.locator('input[name="fullName"]')
    await expect(nameInput).toHaveAttribute('aria-describedby')

    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('aria-describedby')
  })

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/artists/marie-claire-dubois')

    // Check all images have alt attributes
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      await expect(image).toHaveAttribute('alt')
    }
  })

  test('Heading hierarchy should be logical', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
