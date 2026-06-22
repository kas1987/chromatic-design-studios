import { test, expect } from '@playwright/test';

/**
 * /generated smoke E2E.
 *
 * Verifies the route:
 *   - renders without throwing (no live Stash required; mock fallback)
 *   - shows the heading
 *   - surfaces the Live / Demo data badge
 *   - renders the 24 mock cards
 *   - copy-prompt button toggles to "Copied"
 *   - nav contains /video link
 */
test.describe('/generated route', () => {
  test('renders heading + demo data badge + 24 cards', async ({ page }) => {
    await page.goto('/generated', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /Image \+ Video Resource Surface/i, level: 1 }),
    ).toBeVisible();

    // Stash is offline in CI → Demo data badge
    await expect(page.getByText('Demo data', { exact: true })).toBeVisible();

    // 24 mock cards (4 portrait, 4 landscape, 4 character, 4 abstract, 4 product, 4 ui)
    const list = page.getByRole('list', { name: 'Generated images' });
    await expect(list).toBeVisible();
    const items = list.locator(':scope > li');
    await expect(items).toHaveCount(24);

    // Each card shows a workflow ID
    await expect(items.first().getByText(/portrait_headshot_v1|zelex_t2i_four_prompt_v1|01_txt2img_v1|sdxl_txt2img_v1|zimage_txt2img_v1/)).toBeVisible();
  });

  test('copy prompt button toggles state', async ({ page }) => {
    await page.goto('/generated', { waitUntil: 'domcontentloaded' });
    const list = page.getByRole('list', { name: 'Generated images' });
    const firstCard = list.locator(':scope > li').first();

    const copyBtn = firstCard.getByRole('button', { name: /copy prompt/i });
    await copyBtn.click();
    await expect(firstCard.getByText('Copied!')).toBeVisible();
  });

  test('nav contains Video and Generated links', async ({ page }) => {
    await page.goto('/generated', { waitUntil: 'domcontentloaded' });
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Generated' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Video' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Components' })).toBeVisible();
  });
});