import { expect, test } from '@playwright/test';

test('development search explains how to test the production index', async ({ page }) => {
  await page.goto('/betterboard/');

  await page.getByRole('button', { name: 'Search documentation' }).click();

  const state = page.locator('[data-search-state]');
  await expect(state).toContainText('Search is only available in production builds.');
  await expect(state).toContainText(
    'Try building and previewing the site to test it out locally.'
  );
  await expect(state.getByRole('button', { name: 'Retry' })).toHaveCount(0);

  await page.getByRole('searchbox', { name: 'Search documentation' }).fill('Jira');
  await expect(state).toContainText('Search is only available in production builds.');
});
