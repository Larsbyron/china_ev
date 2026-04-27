import { test, expect } from '@playwright/test'

test.describe('Comparison Page', () => {
  test('loads with title and subtitle', async ({ page }) => {
    await page.goto('/vergleich')

    await expect(page).toHaveTitle(/Vergleich/i)
    await expect(page.locator('h1')).toContainText('E-Auto Vergleich')
    await expect(page.locator('text=Vergleiche bis zu 4')).toBeVisible()
  })

  test('vehicle selector slots are visible', async ({ page }) => {
    await page.goto('/vergleich')

    // The comparison tool should render with selectable slots
    const tool = page.locator('[class*="comparison"], [class*="grid"], [class*="slot"]').first()
    await expect(tool).toBeVisible()
  })
})
