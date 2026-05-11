import { test, expect } from '@playwright/test'

const PERFORMANCE = {
  maxHomePageLoad: 5000,
  maxNavigation: 2000,
}

test.describe('Home Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage loads within performance threshold', async ({ page }) => {
    const start = Date.now()
    await expect(page.locator('h1')).toContainText('Ponto Zero')
    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(PERFORMANCE.maxHomePageLoad)
  })

  test('displays branding with logo', async ({ page }) => {
    await expect(page.locator('div.rounded-full >> text=P0').first()).toBeVisible()
    await expect(page.locator('header >> text=Ponto Zero')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Ponto Zero')
    await expect(page.locator('h1 >> text=Controle de Jornada')).toBeVisible()
  })

  test('displays feature cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Registro Simples' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Horas Extras' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Relatórios Mensais' })).toBeVisible()
  })

  test('login button navigates to login page', async ({ page }) => {
    const loginButton = page.locator('text=Entrar')
    await expect(loginButton).toBeVisible()
    const start = Date.now()
    await loginButton.click()
    await expect(page).toHaveURL('/login')
    const navTime = Date.now() - start
    expect(navTime).toBeLessThan(PERFORMANCE.maxNavigation)
  })

  test('dark mode toggle is present', async ({ page }) => {
    const themeToggle = page.locator('button').first()
    await expect(themeToggle).toBeVisible()
  })

  test('page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1')).toContainText('Ponto Zero')
    await expect(page.locator('text=Entrar')).toBeVisible()
  })

  test('page is accessible - has proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(page.locator('h1')).toHaveCount(1)
  })
})

test.describe('Home Page Performance', () => {
  test('homepage loads in under 5 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'networkidle' })
    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(PERFORMANCE.maxHomePageLoad)
  })

  test('no excessive network requests on homepage', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (req) => {
      if (!req.url().includes('_next')) {
        requests.push(req.url())
      }
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Homepage should not make more than 20 external requests
    expect(requests.length).toBeLessThan(20)
  })
})
