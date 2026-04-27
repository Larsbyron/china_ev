import { test, expect } from '@playwright/test'

test.describe('Newsletter Form', () => {
  test('form is visible on homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('text=Bleib auf dem Laufenden')).toBeVisible()

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('aria-label', 'E-Mail-Adresse')

    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toContainText('Abonnieren')
  })

  test('email input accepts valid email', async ({ page }) => {
    await page.goto('/')

    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('form has proper accessibility', async ({ page }) => {
    await page.goto('/')

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('required', '')
    await expect(emailInput).toHaveAttribute('aria-label', 'E-Mail-Adresse')
  })
})
