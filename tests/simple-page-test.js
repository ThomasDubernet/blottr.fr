#!/usr/bin/env node

/**
 * Simple page testing script for Blottr design system integration
 * Tests all pages for basic functionality and design system issues
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'http://localhost:3333';

const pages = [
  { path: '/', name: 'Home' },
  { path: '/design-system', name: 'Design System' },
];

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'large', width: 1440, height: 900 },
];

async function testPage(browser, pageInfo, viewport) {
  const page = await browser.newPage();
  const results = {
    url: pageInfo.path,
    viewport: viewport.name,
    status: 'success',
    errors: [],
    consoleErrors: [],
    loadTime: 0,
    screenshot: null,
  };

  // Set viewport
  await page.setViewport(viewport);

  // Collect console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(`[${viewport.name}] ${msg.text()}`);
    }
  });

  // Collect page errors
  page.on('pageerror', (error) => {
    results.errors.push(`[${viewport.name}] Page error: ${error.message}`);
  });

  // Collect failed requests
  page.on('requestfailed', (request) => {
    results.errors.push(`[${viewport.name}] Request failed: ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`);
  });

  try {
    const startTime = Date.now();

    // Navigate to page
    const response = await page.goto(`${BASE_URL}${pageInfo.path}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    results.loadTime = Date.now() - startTime;

    // Check response status
    if (!response || response.status() !== 200) {
      results.errors.push(`[${viewport.name}] HTTP ${response?.status()}: Failed to load page`);
      results.status = 'error';
      return results;
    }

    // Wait for React to hydrate
    await page.waitForTimeout(2000);

    // Basic functionality tests
    await testBasicFunctionality(page, pageInfo, viewport, results);

    // Design system tests
    await testDesignSystem(page, pageInfo, viewport, results);

    // Responsive tests
    await testResponsive(page, pageInfo, viewport, results);

    // Accessibility tests
    await testAccessibility(page, pageInfo, viewport, results);

    // Page-specific tests
    if (pageInfo.path === '/design-system') {
      await testDesignSystemPage(page, viewport, results);
    } else if (pageInfo.path === '/') {
      await testHomePage(page, viewport, results);
    }

    // Take screenshot
    const screenshotDir = path.join(__dirname, '../tests/screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, `${pageInfo.name.toLowerCase().replace(' ', '-')}-${viewport.name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    results.screenshot = screenshotPath;

  } catch (error) {
    results.errors.push(`[${viewport.name}] Test execution error: ${error.message}`);
    results.status = 'error';
  } finally {
    await page.close();
  }

  if (results.errors.length > 0 || results.consoleErrors.length > 0) {
    results.status = 'error';
  }

  return results;
}

async function testBasicFunctionality(page, pageInfo, viewport, results) {
  try {
    // Check if main content is visible
    const hasContent = await page.$('body');
    if (!hasContent) {
      results.errors.push(`[${viewport.name}] Main content not visible`);
    }

    // Check for React hydration
    const hasReact = await page.evaluate(() => {
      return window.React !== undefined || document.querySelector('[data-reactroot], #root') !== null;
    });

    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const broken = [];
      for (let img of images) {
        if (img.naturalWidth === 0 && img.naturalHeight === 0 && img.src !== '') {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      results.errors.push(`[${viewport.name}] Broken images: ${brokenImages.join(', ')}`);
    }

  } catch (error) {
    results.errors.push(`[${viewport.name}] Basic functionality test error: ${error.message}`);
  }
}

async function testDesignSystem(page, pageInfo, viewport, results) {
  try {
    // Check for design system classes
    const hasDesignSystemClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let el of elements) {
        if (el.className && typeof el.className === 'string') {
          // Check for Tailwind/design system classes
          if (el.className.includes('bg-') ||
              el.className.includes('text-') ||
              el.className.includes('border-') ||
              el.className.includes('container') ||
              el.className.includes('btn') ||
              el.className.includes('card')) {
            return true;
          }
        }
      }
      return false;
    });

    if (!hasDesignSystemClasses) {
      results.errors.push(`[${viewport.name}] Design system classes not found`);
    }

    // Check for CSS custom properties
    const hasCssCustomProps = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.setProperty('--test-prop', 'test');
      return testEl.style.getPropertyValue('--test-prop') === 'test';
    });

    if (!hasCssCustomProps) {
      results.errors.push(`[${viewport.name}] CSS custom properties not supported`);
    }

    // Check for primary color variables
    const hasPrimaryColors = await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      return rootStyles.getPropertyValue('--color-primary') !== '';
    });

    if (!hasPrimaryColors) {
      results.errors.push(`[${viewport.name}] Primary color variables not found`);
    }

  } catch (error) {
    results.errors.push(`[${viewport.name}] Design system test error: ${error.message}`);
  }
}

async function testResponsive(page, pageInfo, viewport, results) {
  try {
    // Check for horizontal scroll on small viewports
    const hasHorizontalScroll = await page.evaluate(() =>
      document.body.scrollWidth > document.body.offsetWidth
    );

    if (hasHorizontalScroll && viewport.width < 1024) {
      results.errors.push(`[${viewport.name}] Horizontal scroll detected on small viewport`);
    }

    // Check if navigation is accessible on mobile
    if (viewport.name === 'mobile') {
      const navElements = await page.$$('nav, [role="navigation"]');
      if (navElements.length === 0) {
        results.errors.push(`[${viewport.name}] No navigation found`);
      }
    }

    // Check for responsive typography
    const hasResponsiveTypography = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) return false;

      const h1 = headings[0];
      const styles = getComputedStyle(h1);
      return parseInt(styles.fontSize) > 0;
    });

    if (!hasResponsiveTypography) {
      results.errors.push(`[${viewport.name}] Responsive typography not working`);
    }

  } catch (error) {
    results.errors.push(`[${viewport.name}] Responsive test error: ${error.message}`);
  }
}

async function testAccessibility(page, pageInfo, viewport, results) {
  try {
    // Check for alt text on images
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let count = 0;
      for (let img of images) {
        if (!img.alt && !img.getAttribute('aria-label')) count++;
      }
      return count;
    });

    if (imagesWithoutAlt > 0) {
      results.errors.push(`[${viewport.name}] ${imagesWithoutAlt} images without alt text`);
    }

    // Check for proper heading structure
    const headingStructure = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      return levels;
    });

    if (headingStructure.length > 0 && headingStructure[0] !== 1) {
      results.errors.push(`[${viewport.name}] Page should start with h1`);
    }

    // Check for focus management
    const hasFocusableElements = await page.evaluate(() => {
      const focusable = document.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
      return focusable.length > 0;
    });

    if (!hasFocusableElements) {
      results.errors.push(`[${viewport.name}] No focusable elements found`);
    }

  } catch (error) {
    results.errors.push(`[${viewport.name}] Accessibility test error: ${error.message}`);
  }
}

async function testDesignSystemPage(page, viewport, results) {
  try {
    // Test if buttons are present
    const buttons = await page.$$('button');
    if (buttons.length === 0) {
      results.errors.push(`[${viewport.name}] No buttons found on design system page`);
    }

    // Test if cards are rendered
    const cards = await page.$$('[class*="card"], .card');
    if (cards.length === 0) {
      results.errors.push(`[${viewport.name}] No cards found on design system page`);
    }

    // Test if color palette is visible
    const colorElements = await page.$$('[class*="bg-primary"], [class*="bg-gray"]');
    if (colorElements.length === 0) {
      results.errors.push(`[${viewport.name}] Color palette not rendered properly`);
    }

    // Check for component showcase
    const showcaseElements = await page.$$('[class*="artist"], [class*="tattoo"], [class*="gallery"]');
    if (showcaseElements.length === 0) {
      results.errors.push(`[${viewport.name}] Component showcase not found`);
    }

  } catch (error) {
    results.errors.push(`[${viewport.name}] Design system page test error: ${error.message}`);
  }
}

async function testHomePage(page, viewport, results) {
  try {
    // Check for hero section
    const heroSection = await page.$('section');
    if (!heroSection) {
      results.errors.push(`[${viewport.name}] Hero section not visible`);
    }

    // Check for CTA buttons
    const ctaButtons = await page.$$('button, a[class*="btn"]');
    if (ctaButtons.length === 0) {
      results.errors.push(`[${viewport.name}] No CTA buttons found`);
    }

    // Check for header
    const header = await page.$('header, [role="banner"]');
    if (!header) {
      results.errors.push(`[${viewport.name}] Header not found`);
    }

    // Check for navigation
    const navigation = await page.$('nav, [role="navigation"]');
    if (!navigation) {
      results.errors.push(`[${viewport.name}] Navigation not found`);
    }

  } catch (error) {
    results.errors.push(`[${viewport.name}] Home page test error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 Starting Blottr Design System Integration Tests...\n');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allResults = [];

  try {
    for (const pageInfo of pages) {
      console.log(`📄 Testing ${pageInfo.name} (${pageInfo.path})`);

      for (const viewport of viewports) {
        console.log(`  📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

        const result = await testPage(browser, pageInfo, viewport);
        allResults.push(result);

        if (result.status === 'success') {
          console.log(`    ✅ PASS (${result.loadTime}ms)`);
        } else {
          console.log(`    ❌ FAIL (${result.errors.length} errors, ${result.consoleErrors.length} console errors)`);
          result.errors.forEach(error => console.log(`      - ${error}`));
          if (result.consoleErrors.length > 0) {
            result.consoleErrors.slice(0, 3).forEach(error => console.log(`      - ${error}`));
            if (result.consoleErrors.length > 3) {
              console.log(`      - ... and ${result.consoleErrors.length - 3} more console errors`);
            }
          }
        }
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }

  await browser.close();

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: allResults.length,
    successCount: allResults.filter(r => r.status === 'success').length,
    errorCount: allResults.filter(r => r.status === 'error').length,
    averageLoadTime: allResults.reduce((sum, r) => sum + r.loadTime, 0) / allResults.length,
    results: allResults,
    summary: {
      criticalErrors: allResults.reduce((sum, r) => sum + r.errors.length, 0),
      consoleErrors: allResults.reduce((sum, r) => sum + r.consoleErrors.length, 0),
      responsiveIssues: allResults.filter(r => r.errors.some(err => err.includes('scroll'))).length,
    }
  };

  // Save detailed report
  const reportDir = path.join(__dirname, '../tests/reports');
  await fs.mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'design-system-integration-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Print final summary
  console.log('\n📊 FINAL REPORT:');
  console.log(`✅ Successful tests: ${report.successCount}/${report.totalTests}`);
  console.log(`❌ Failed tests: ${report.errorCount}/${report.totalTests}`);
  console.log(`⚠️ Critical errors: ${report.summary.criticalErrors}`);
  console.log(`🖥️ Console errors: ${report.summary.consoleErrors}`);
  console.log(`📱 Responsive issues: ${report.summary.responsiveIssues}`);
  console.log(`⏱️ Average load time: ${report.averageLoadTime.toFixed(2)}ms`);
  console.log(`📄 Detailed report saved: ${reportPath}`);

  // Return exit code
  const exitCode = report.errorCount > 0 ? 1 : 0;
  if (exitCode === 1) {
    console.log('\n❌ Some tests failed. Please review the errors above.');
  } else {
    console.log('\n🎉 All tests passed successfully!');
  }

  process.exit(exitCode);
}

// Run the tests
runTests().catch(console.error);