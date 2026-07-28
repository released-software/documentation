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
    const announcement = page.locator('[data-search-scope-announcement]');
    await expect(announcement).toBeEmpty();
    const trigger = await openSearch(page);

    await expect(
      page.getByRole('combobox', { name: 'Search scope' }).locator('option:checked')
    ).toHaveText(scope);
    await expect(announcement).toHaveText(`Search scope: ${scope}`);

    await page.getByRole('button', { name: 'Close search' }).click();
    await expect(announcement).toBeEmpty();

    await trigger.click();
    await expect(announcement).toHaveText(`Search scope: ${scope}`);
    await page.getByRole('button', { name: 'Close search' }).click();
  }
});

test('search dialog uses an opaque surface', async ({ page }) => {
  await page.goto('/');
  await openSearch(page);

  await expect(
    page.getByRole('dialog', { name: 'Search documentation' })
  ).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('search scope uses the custom chevron and restrained keyboard focus', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);

  const scope = page.getByRole('combobox', { name: 'Search scope' });
  await expect(scope).toHaveCSS('appearance', 'none');
  await expect(page.locator('[data-search-scope-chevron]')).toBeVisible();

  await scope.focus();
  await expect(scope).toHaveCSS('outline-style', 'none');
  await expect(scope).not.toHaveCSS('box-shadow', 'none');
});

test('an empty query has no suggestions, loading state, or result divider', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const state = page.locator('[data-search-state]');
  const results = page.locator('[data-search-results]');
  await expect(state).toBeEmpty();
  await expect(results).toBeEmpty();
  await expect(results).toHaveCSS('display', 'none');
  await expect(page.getByText('Suggested sections in All documentation')).toHaveCount(0);
  await expect(page.getByText('Loading search…')).toHaveCount(0);

  await input.fill('Jira');
  await expect(results.locator('a').first()).toBeVisible();
  await input.fill('');
  await expect(results).toBeEmpty();
  await expect(results).toHaveAttribute('aria-busy', 'false');
});

test('changing scope updates search results without navigation', async ({ page }) => {
  await page.goto('/guide/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  await input.fill('Jira');

  const results = page.locator('[data-search-results]');
  const hubLinks = results.locator('a');
  await expect(hubLinks.first()).toBeVisible();
  await expect(hubLinks.first()).toHaveCSS('display', 'grid');
  await expect(hubLinks.first()).toHaveCSS('text-decoration-line', 'none');
  for (const link of await hubLinks.all()) {
    await expect(link).toHaveAttribute('href', /^\/guide\//);
  }

  const urlBeforeScopeChange = page.url();
  await page
    .getByRole('combobox', { name: 'Search scope' })
    .selectOption({ label: 'BetterBoard documentation' });

  const betterBoardLinks = results.locator('a');
  await expect(betterBoardLinks.first()).toBeVisible();
  for (const link of await betterBoardLinks.all()) {
    await expect(link).toHaveAttribute('href', /^\/betterboard\//);
  }
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
    .fill('qzxjkvbpygfwmu');

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
  await expect(results.first()).toBeVisible();
  expect(await results.count()).toBeGreaterThanOrEqual(2);

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

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  await input.fill('Jira');
  await expect(page.getByText('Search could not be loaded. Retry.')).toBeVisible();
  const retry = page.getByRole('button', { name: 'Retry' });
  await expect(retry).toHaveCSS('min-height', '44px');
  await expect(retry).toHaveCSS('border-radius', '8px');
  await retry.click();
  await expect(page.locator('[data-search-results] a').first()).toBeVisible();
  expect(loadAttempts).toBe(2);

  await page.getByRole('button', { name: 'Close search' }).click();
  await expect(trigger).toBeFocused();

  const switcher = page.getByRole('button', { name: 'Hub', exact: true });
  await switcher.click();
  await expect(page.getByRole('menu')).toBeVisible();
});
