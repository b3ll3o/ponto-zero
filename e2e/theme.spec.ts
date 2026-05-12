import { test, expect } from '@playwright/test'

test.describe('Theme E2E', () => {
  test('home page renders without theme toggle button', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const themeToggle = page.locator('[aria-label="Toggle theme"]')
    await expect(themeToggle).toHaveCount(0)
  })

  test('login page renders without theme toggle button', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const themeToggle = page.locator('[aria-label="Toggle theme"]')
    await expect(themeToggle).toHaveCount(0)
  })

  test('home page has html theme class', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const htmlElement = page.locator('html')
    const classAttr = await htmlElement.getAttribute('class')
    expect(classAttr).toBeTruthy()
  })

  test('login page has html theme class', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const htmlElement = page.locator('html')
    const classAttr = await htmlElement.getAttribute('class')
    expect(classAttr).toBeTruthy()
  })
})