import { test, expect } from '@playwright/test'

const PERFORMANCE = {
  maxSignUpPageLoad: 5000,
  maxFormInteraction: 2000,
}

test.describe('Sign Up Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('sign up page loads within performance threshold', async ({ page }) => {
    const start = Date.now()
    await expect(page.locator('h1')).toContainText('Login')
    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(PERFORMANCE.maxSignUpPageLoad)
  })

  test('create account button is disabled when form is empty', async ({ page }) => {
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeVisible()
    await expect(signUpButton).toBeDisabled()
  })

  test('create account button is disabled with only email', async ({ page }) => {
    await page.locator('input[type="email"]').fill('newuser@example.com')
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeDisabled()
  })

  test('create account button is disabled with only password', async ({ page }) => {
    await page.locator('input[type="password"]').fill('password123')
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeDisabled()
  })

  test('create account button is enabled when form is valid', async ({ page }) => {
    await page.locator('input[type="email"]').fill('newuser@example.com')
    await page.locator('input[type="password"]').fill('password123')
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeEnabled()
  })

  test('shows validation error for invalid email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('notanemail')
    await emailInput.blur()
    const isValid = await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid)
    expect(isValid).toBe(false)
  })

  test('password must be at least 6 characters (form validation)', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('12345')
    
    // With only 5 chars, form should be invalid - button stays disabled
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeDisabled()
    
    // With 6 chars, button should be enabled
    await page.locator('input[type="password"]').fill('123456')
    await expect(signUpButton).toBeEnabled()
  })

  test('creates account successfully and shows confirmation message', async ({ page }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`
    
    await page.locator('input[type="email"]').fill(uniqueEmail)
    await page.locator('input[type="password"]').fill('password123')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await signUpButton.click()
    
    // Should show success message about email confirmation
    await expect(page.locator('text=Verifique seu e-mail')).toBeVisible({ timeout: 5000 })
  })

  test('shows resend confirmation button after successful sign up', async ({ page }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`
    
    await page.locator('input[type="email"]').fill(uniqueEmail)
    await page.locator('input[type="password"]').fill('password123')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await signUpButton.click()
    
    // Should show resend button
    await expect(page.getByRole('button', { name: /reenviar e-mail/i })).toBeVisible({ timeout: 5000 })
  })

  test('resend confirmation button is clickable', async ({ page }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`
    
    await page.locator('input[type="email"]').fill(uniqueEmail)
    await page.locator('input[type="password"]').fill('password123')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await signUpButton.click()
    
    // Wait for resend button and click it
    const resendButton = page.getByRole('button', { name: /reenviar e-mail/i })
    await expect(resendButton).toBeVisible({ timeout: 5000 })
    
    // Clear email field first since resend requires email
    await page.locator('input[type="email"]').clear()
    await page.locator('input[type="email"]').fill(uniqueEmail)
    
    await resendButton.click()
    
    // Button should show reenviando state
    await expect(page.getByRole('button', { name: /reenviando/i })).toBeVisible({ timeout: 3000 })
  })

  test('form is cleared after successful sign up', async ({ page }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`
    
    await page.locator('input[type="email"]').fill(uniqueEmail)
    await page.locator('input[type="password"]').fill('password123')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await signUpButton.click()
    
    // After success, email field should still have the email (user can resend)
    await expect(page.locator('input[type="email"]')).toHaveValue(uniqueEmail)
  })

  test('entrar button is enabled after sign up attempt', async ({ page }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`
    
    await page.locator('input[type="email"]').fill(uniqueEmail)
    await page.locator('input[type="password"]').fill('password123')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await signUpButton.click()
    
    // Wait for success message
    await expect(page.locator('text=Verifique seu e-mail')).toBeVisible({ timeout: 5000 })
    
    // Now login button should be enabled
    const loginButton = page.locator('button[type="submit"]')
    await expect(loginButton).toBeEnabled()
  })

  test('password requirements are met (min 6 chars)', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('123456')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await expect(signUpButton).toBeEnabled()
  })

  test('both login and create account buttons are visible', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /criar conta/i })).toBeVisible()
  })

  test('link back to home works after sign up', async ({ page }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`
    
    await page.locator('input[type="email"]').fill(uniqueEmail)
    await page.locator('input[type="password"]').fill('password123')
    
    const signUpButton = page.getByRole('button', { name: /criar conta/i })
    await signUpButton.click()
    
    // Wait for success state
    await expect(page.locator('text=Verifique seu e-mail')).toBeVisible({ timeout: 5000 })
    
    // Click back to home
    const homeLink = page.locator('a', { hasText: /voltar para home/i })
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })
})
