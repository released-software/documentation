import { expect, test, type Page } from '@playwright/test';

async function openSearch(page: Page) {
  const trigger = page.getByRole('button', { name: 'Search documentation' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Search documentation' })).toBeVisible();
  return trigger;
}

test('search defaults to the pathname-derived documentation scope', async ({ page }) => {
  const cases = [
    { route: '/guide/', scope: 'Hub documentation' },
    { route: '/betterboard/', scope: 'BetterBoard documentation' },
    { route: '/', scope: 'All documentation' }
  ];

  for (const { route, scope } of cases) {
    await page.goto(route);
    await openSearch(page);

    await expect(
      page.getByRole('combobox', { name: 'Search scope' }).locator('option:checked')
    ).toHaveText(scope);
    await expect(page.locator('[data-search-scope-announcement]')).toHaveText(
      `Search scope: ${scope}`
    );

    await page.getByRole('button', { name: 'Close search' }).click();
  }
});

test('changing scope updates search results without navigation', async ({ page }) => {
  await page.goto('/guide/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  await input.fill('documentation');

  const results = page.locator('[data-search-results]');
  await expect(results.getByRole('link', { name: 'Hub documentation' })).toBeVisible();
  await expect(
    results.getByRole('link', { name: 'BetterBoard documentation' })
  ).toHaveCount(0);

  const urlBeforeScopeChange = page.url();
  await page
    .getByRole('combobox', { name: 'Search scope' })
    .selectOption({ label: 'BetterBoard documentation' });

  await expect(
    results.getByRole('link', { name: 'BetterBoard documentation' })
  ).toBeVisible();
  await expect(results.getByRole('link', { name: 'Hub documentation' })).toHaveCount(0);
  expect(page.url()).toBe(urlBeforeScopeChange);
});

test('Partner scope stays visible but disabled until it has indexed content', async ({ page }) => {
  await page.goto('/');
  await openSearch(page);

  await expect(
    page.getByRole('combobox', { name: 'Search scope' }).getByRole('option', {
      name: 'Partner documentation'
    })
  ).toHaveAttribute('disabled', '');
});

test('a scoped no-match state offers an all-documentation search', async ({ page }) => {
  await page.goto('/guide/');
  await openSearch(page);

  await page
    .getByRole('searchbox', { name: 'Search documentation' })
    .fill('no-result-phrase-7d97cf');

  await expect(page.getByText('No results in Hub documentation.')).toBeVisible();
  const searchAll = page.getByRole('button', { name: 'Search all documentation' });
  await expect(searchAll).toBeVisible();
  await searchAll.click();

  await expect(
    page.getByRole('combobox', { name: 'Search scope' }).locator('option:checked')
  ).toHaveText('All documentation');
});

test('Escape closes search and restores focus to its trigger', async ({ page }) => {
  await page.goto('/guide/');
  const trigger = await openSearch(page);

  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog', { name: 'Search documentation' })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('ArrowDown and ArrowUp move focus through search results', async ({ page }) => {
  await page.goto('/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  await input.fill('documentation');

  const results = page.locator('[data-search-results] a');
  await expect(results).toHaveCount(2);

  await input.press('ArrowDown');
  await expect(results.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(results.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(results.nth(0)).toBeFocused();
});

test('a Pagefind loader failure keeps search closable and site navigation usable', async ({
  page
}) => {
  let loadAttempts = 0;
  await page.route('**/pagefind/pagefind.js*', (route) => {
    loadAttempts += 1;
    return loadAttempts === 1 ? route.abort() : route.continue();
  });
  await page.goto('/guide/');
  const trigger = await openSearch(page);

  await expect(page.getByText('Search could not be loaded. Retry.')).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Suggested sections in Hub documentation')).toBeVisible();
  expect(loadAttempts).toBe(2);

  await page.getByRole('button', { name: 'Close search' }).click();
  await expect(trigger).toBeFocused();

  const switcher = page.getByRole('button', { name: 'Hub documentation' });
  await switcher.click();
  await expect(page.getByRole('menu')).toBeVisible();
});
