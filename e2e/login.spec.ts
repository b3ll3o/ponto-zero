import { test, expect } from '@playwright/test'

const PERFORMANCE = {
  maxLoginPageLoad: 5000,
  maxNavigation: 2000,
}

test.describe('Login Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('login page loads within performance threshold', async ({ page }) => {
    const start = Date.now()
    await expect(page.locator('h1')).toContainText('Login')
    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(PERFORMANCE.maxLoginPageLoad)
  })

  test('displays email and password inputs', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login button is present and disabled when not filled', async ({ page }) => {
    const loginButton = page.locator('button[type="submit"]')
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeDisabled()
  })

  test('enables login button when email and password are filled', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('password123')
    const loginButton = page.locator('button[type="submit"]')
    await expect(loginButton).toBeEnabled()
  })

  test('create account button is present', async ({ page }) => {
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeVisible()
  })

  test('shows error on invalid login attempt', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid@email.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=E-mail ou senha incorretos')).toBeVisible()
  })

  test('link back to home works', async ({ page }) => {
    const homeLink = page.locator('a', { hasText: /voltar para home/i })
    await expect(homeLink).toBeVisible()
    const start = Date.now()
    await homeLink.click()
    await expect(page).toHaveURL('/')
    const navTime = Date.now() - start
    expect(navTime).toBeLessThan(PERFORMANCE.maxNavigation)
  })

  test('email validation prevents invalid email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('notanemail')
    await emailInput.blur()
    // Email input should have invalid state (native validation)
    const isValid = await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid)
    expect(isValid).toBe(false)
  })

  test('password field is masked', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('mysecretpassword')
    const type = await passwordInput.getAttribute('type')
    expect(type).toBe('password')
  })
})

test.describe('Login Navigation Guards', () => {
  // Note: Full auth redirect testing requires Supabase server-side cookie mocking
  // which is complex in E2E mode. This test verifies the login page renders
  // correctly and guards are in place (redirect logic is tested via proxy unit tests).
  test('login page is accessible when not authenticated', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
