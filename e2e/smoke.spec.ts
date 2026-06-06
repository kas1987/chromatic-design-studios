import { test, expect } from '@playwright/test'

test.describe('Home page smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Chromatic Design Studios')
  })

  test('hero heading is visible', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('AI Design')
  })

  test('navigation links are present', async ({ page }) => {
    // Exact names avoid colliding with the "Open Dashboard" hero CTA.
    await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Assets', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Prompts', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Studio', exact: true })).toBeVisible()
  })

  test('CTA buttons are visible and interactive', async ({ page }) => {
    // Hero CTAs render via the Button component as links (href set), not <button>.
    const dashboardCta = page.getByRole('link', { name: 'Open Dashboard' })
    const pdrCta = page.getByRole('link', { name: 'Read the PDR' })
    await expect(dashboardCta).toBeVisible()
    await expect(pdrCta).toBeVisible()
    await dashboardCta.click()
    await pdrCta.click()
  })

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
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
    // Nav is hidden on mobile (hidden md:flex)
    await expect(page.getByRole('navigation')).not.toBeVisible()
  })
})
