# Design: E2E Coverage

## Overview

Este SDD implementa testes E2E usando Playwright para garantir cobertura adequada do frontend do Ponto Zero.

## Architecture

### Stack de Testes

| Layer | Technology |
|-------|------------|
| E2E Framework | Playwright |
| Test Runner | @playwright/test |
| Browser | Chromium (via Playwright) |
| Assertions | expect (Playwright) |

### File Structure

```
ponto-zero/
├── e2e/
│   ├── example.spec.ts       # Teste example
│   ├── home.spec.ts          # Testes da home page
│   ├── login.spec.ts         # Testes da login page
│   ├── theme.spec.ts         # Testes de tema
│   └── logout.spec.ts        # Testes de logout
├── playwright.config.ts      # Configuração do Playwright
└── test-results/            # Resultados de testes
```

## Implementation

### Configuração do Playwright (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Performance Thresholds

| Metric | Threshold |
|--------|-----------|
| Page Load | 5000ms |
| Navigation | 2000ms |
| Max External Requests | 20 per page |

### Test Categories

1. **Home Page Tests** (`home.spec.ts`)
   - Homepage loads
   - Branding and logo display
   - Feature cards display
   - Login button navigation
   - Theme toggle presence
   - Mobile responsiveness
   - Accessibility (heading hierarchy)
   - Performance (load time)
   - Network requests optimization

2. **Login Page Tests** (`login.spec.ts`)
   - Page loads within threshold
   - Email and password inputs display
   - Login button states (disabled/enabled)
   - Form validation (email format, password length)
   - Error handling (invalid credentials)
   - Navigation links work
   - Password masking

3. **Theme Tests** (`theme.spec.ts`)
   - Theme toggle button exists
   - Theme class is applied to HTML
   - Theme persists after navigation

## Dependencies

- Node.js 18+
- npm/pnpm
- Playwright (instalado via npm)
- Next.js dev server (para testes locais)

## Commands

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npx playwright test --ui

# Run specific file
npx playwright test e2e/login.spec.ts

# Update screenshots (if using visual regression)
npx playwright test --update-snapshots
```

## Known Limitations

1. **Auth Tests**: Testes de logout, dashboard e time-entry requerem Supabase auth real com credenciais de teste. Atualmente pulados.

2. **ThemeToggle**: Componente usa `useEffect` para mountar, então o botão só aparece após hidratação.

3. **Mobile Tests**: Viewport configurado para 375x667 (iPhone SE size).

## Verification

| Check | Command | Threshold |
|-------|---------|-----------|
| Build | `npm run build` | Pass |
| Lint | `npm run lint` | Pass |
| Tests | `npm run test:run` | All pass |
| Coverage | `npm run test` | >= 80% |