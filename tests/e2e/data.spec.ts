import { test, expect } from '@playwright/test'

test.describe('Data Page', () => {
  test('loads with chart sections', async ({ page }) => {
    await page.goto('/daten')

    await expect(page).toHaveTitle(/Daten/i)
    await expect(page.locator('h1')).toContainText('Daten & Visualisierung')

    // Three chart sections should be present
    await expect(page.locator('text=Reichweite im Vergleich')).toBeVisible()
    await expect(page.locator('text=Preis vs. Reichweite')).toBeVisible()
    await expect(page.locator('text=Batteriekapazität')).toBeVisible()
  })

  test('charts render without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/daten')
    await page.waitForLoadState('networkidle')

    // Recharts renders SVG elements
    const svgCount = await page.locator('svg').count()
    expect(svgCount).toBeGreaterThan(0)

    // No console errors (excluding favicon)
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
