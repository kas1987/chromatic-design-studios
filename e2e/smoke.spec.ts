import { test, expect } from '@playwright/test'

test.describe('Home page smoke tests (v0.4.0 Platform Surface)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Chromatic Design Studios')
  })

  test('hero heading is visible', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Front-end')
    await expect(heading).toContainText('Resource Platform')
  })

  test('global nav links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Components', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Tokens', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Examples', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Playground', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Studio', exact: true })).toBeVisible()
  })

  test('hero CTAs navigate to the right routes', async ({ page }) => {
    const browseCta = page.getByRole('link', { name: 'Browse components' })
    const exploreCta = page.getByRole('link', { name: 'Explore tokens' })
    await expect(browseCta).toBeVisible()
    await expect(exploreCta).toBeVisible()
    await browseCta.click()
    await expect(page).toHaveURL(/\/components$/)
    await page.goto('/')
    await exploreCta.click()
    await expect(page).toHaveURL(/\/tokens$/)
  })

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('page is accessible — no critical ARIA violations', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('footer shows correct version', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer).toContainText('Chromatic Design Studios v0.4.0')
  })

  test('page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    // ThemeToggle still rendered in the mobile header (visible always)
    await expect(page.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeVisible()
  })
})

test.describe('Platform routes (v0.4.0)', () => {
  for (const route of ['/components', '/tokens', '/examples', '/playground', '/studio']) {
    test(`${route} renders without errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      await page.goto(route)
      await expect(page.getByRole('main')).toBeVisible()
      await expect(page.getByRole('banner')).toBeVisible()
      expect(errors).toHaveLength(0)
    })
  }
})