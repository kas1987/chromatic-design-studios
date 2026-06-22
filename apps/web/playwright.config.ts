import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Chromatic Design Studios web app.
 *
 * Run: `npm run test:e2e`
 *
 * Spins up `next start` on port 3006 so the suite runs against a built
 * artifact (not `next dev`). Set CI=true to require all-green.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node ../../node_modules/next/dist/bin/next start -p 3006',
    cwd: __dirname,
    url: 'http://127.0.0.1:3006',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});