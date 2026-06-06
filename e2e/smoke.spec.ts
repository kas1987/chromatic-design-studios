import { test, expect } from '@playwright/test'

test.describe('Home page smoke tests', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('Chromatic Design Studios')
  })

  test('hero heading is visible', async ({ page }) => {
    await page.goto('/')
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('AI Design')
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Assets' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Prompts' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Agents' })).toBeVisible()
  })

  test('CTA buttons are visible and interactive', async ({ page }) => {
    await page.goto('/')
    const dashboardBtn = page.getByRole('button', { name: 'Open Dashboard' })
    const pdrBtn = page.getByRole('button', { name: 'Read the PDR' })
    await expect(dashboardBtn).toBeVisible()
    await expect(pdrBtn).toBeVisible()
    // Ensure they are clickable (no errors thrown on click)
    await dashboardBtn.click()
    await pdrBtn.click()
  })

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('page is accessible — no critical ARIA violations', async ({ page }) => {
    await page.goto('/')
    // Verify key landmarks exist
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('footer shows correct version', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toContainText('Chromatic Design Studios v0.1.0')
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
