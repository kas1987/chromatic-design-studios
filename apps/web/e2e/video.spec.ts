import { test, expect } from '@playwright/test';

/**
 * /video smoke E2E.
 *
 * Mirror of generated.spec.ts but for the video lane — verifies 12 cards,
 * badges, video elements, and copy-prompt.
 */
test.describe('/video route', () => {
  test('renders heading + demo data badge + 12 cards', async ({ page }) => {
    await page.goto('/video', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /Video Lane Surface/i, level: 1 }),
    ).toBeVisible();

    await expect(page.getByText('Demo data', { exact: true })).toBeVisible();

    const list = page.getByRole('list', { name: 'Generated videos' });
    await expect(list).toBeVisible();
    const items = list.locator(':scope > li');
    await expect(items).toHaveCount(12);
  });

  test('each card has a <video> element with src + poster', async ({ page }) => {
    await page.goto('/video', { waitUntil: 'domcontentloaded' });
    const videos = page.getByTestId('video-clip');
    await expect(videos.first()).toHaveJSProperty('controls', true);
    const src = await videos.first().getAttribute('src');
    expect(src).toMatch(/\.mp4$/);
    const poster = await videos.first().getAttribute('poster');
    expect(poster).toMatch(/picsum\.photos\/seed\/vid-/);
  });

  test('copy prompt button toggles state', async ({ page }) => {
    await page.goto('/video', { waitUntil: 'domcontentloaded' });
    const list = page.getByRole('list', { name: 'Generated videos' });
    const firstCard = list.locator(':scope > li').first();

    const copyBtn = firstCard.getByRole('button', { name: /copy prompt/i });
    await copyBtn.click();
    await expect(firstCard.getByText('Copied')).toBeVisible();
  });
});