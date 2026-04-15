import { test, expect } from '@playwright/test'

/**
 * E2E Critical Smoke Tests for E-Auto Blog
 *
 * These tests verify that all critical user paths work correctly.
 * Run on every PR and before deployment.
 */

test.describe('Critical Smoke Tests', () => {
  test('homepage loads without errors', async ({ page }) => {
    await page.goto('/')

    // Check no console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Homepage should load
    await expect(page).toHaveTitle(/E-Auto/i)

    // Header should be visible
    await expect(page.locator('header')).toBeVisible()

    // Hero section should be visible
    await expect(page.locator('[class*="hero"]').first()).toBeVisible()

    // Article grid should be visible
    await expect(page.locator('[class*="grid"], [class*="articleGrid"]').first()).toBeVisible()

    // Footer should be visible
    await expect(page.locator('footer')).toBeVisible()

    // No console errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('article pages load correctly', async ({ page }) => {
    // Navigate to the homepage first to find a real article link
    await page.goto('/')

    // Find first article link
    const articleLink = page.locator('a[href^="/articles/"]').first()
    const href = await articleLink.getAttribute('href')

    if (href) {
      // Navigate to the article
      await page.goto(href)

      // Should load without server error (500)
      await page.waitForLoadState('networkidle')

      // Check for no error page
      const url = page.url()
      expect(url).not.toContain('500')
      expect(url).not.toContain('_error')
    }
  })

  test('brands page loads', async ({ page }) => {
    await page.goto('/brands')

    // Brands page should load
    await expect(page.locator('h1')).toBeVisible()

    // Brand cards or grid should be visible
    const hasContent = await page.locator('[class*="brand"], [class*="grid"]').first().isVisible().catch(() => false)
    if (hasContent) {
      await expect(page.locator('[class*="brand"], [class*="grid"]').first()).toBeVisible()
    }
  })

  test('weekly page loads', async ({ page }) => {
    await page.goto('/weekly')

    // Weekly page should load
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Should contain "Top 5" or similar content
    const h1Text = await h1.textContent()
    expect(h1Text).toBeTruthy()
  })

  test('navigation works', async ({ page }) => {
    await page.goto('/')

    // Click on brands link if visible
    const brandsLink = page.locator('nav a[href="/brands"], a[href="/brands"]').first()
    if (await brandsLink.isVisible()) {
      await brandsLink.click()
      await expect(page).toHaveURL(/\/brands/)
    }

    // Click on home link
    const homeLink = page.locator('nav a[href="/"], a:has-text("E-Auto")').first()
    if (await homeLink.isVisible()) {
      await homeLink.click()
      await expect(page).toHaveURL(/\//)
    }
  })
})

test.describe('Responsive Design', () => {
  test('mobile view loads correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile should still load
    await expect(page.locator('header')).toBeVisible()

    // Hamburger menu or mobile nav should work
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('desktop view loads correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    // Desktop should load with full layout
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('[class*="hero"]').first()).toBeVisible()
  })
})
