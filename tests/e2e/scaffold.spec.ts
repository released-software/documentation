import { expect, test } from '@playwright/test';

test('the Hub documentation landing page exposes its heading', async ({ page }) => {
  await page.goto('/guide/');

  await expect(page.getByRole('heading', { level: 1, name: 'Hub documentation' })).toBeVisible();
});

test('the BetterBoard documentation landing page exposes its heading', async ({ page }) => {
  await page.goto('/betterboard/');

  await expect(page.getByRole('heading', { level: 1, name: 'BetterBoard documentation' })).toBeVisible();
});
