import { test, expect } from '@playwright/test'

test.describe('Example E2E', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ponto-zero/i)
  })
})