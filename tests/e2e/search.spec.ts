import { test, expect } from '@playwright/test'

test.describe('Search Page', () => {
  test('loads with search input', async ({ page }) => {
    await page.goto('/suche')

    await expect(page).toHaveTitle(/Suche/i)
    await expect(page.locator('h1')).toContainText('Suche')

    const input = page.locator('input[type="text"]')
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('aria-label', /Suchbegriff/i)
  })

  test('shows hint when no search performed', async ({ page }) => {
    await page.goto('/suche')

    await expect(page.locator('text=Gib einen Suchbegriff ein')).toBeVisible()
  })

  test('search input accepts text', async ({ page }) => {
    await page.goto('/suche')

    const input = page.locator('input[type="text"]')
    await input.fill('BYD')
    await expect(input).toHaveValue('BYD')
  })
})
