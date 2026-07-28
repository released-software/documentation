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

test('search controls use neutral focus and clear-button styling', async ({ page }) => {
  await page.goto('/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  await input.fill('Jira');
  await input.focus();
  await expect(input).toHaveCSS('outline-style', 'none');
  await expect(input).not.toHaveCSS('box-shadow', 'none');

  const closeButton = page.getByRole('button', { name: 'Close search' });
  await closeButton.focus();
  await expect(closeButton).toHaveCSS('outline-style', 'none');
  await expect(closeButton).not.toHaveCSS('box-shadow', 'none');

  const clearButton = page.getByRole('button', { name: 'Clear search' });
  await expect(clearButton).toBeVisible();
  const [clearColor, searchIconColor] = await Promise.all([
    clearButton.evaluate((element) => getComputedStyle(element).color),
    page
      .locator('.search-input > svg')
      .evaluate((element) => getComputedStyle(element).color)
  ]);
  expect(clearColor).toBe(searchIconColor);

  await clearButton.click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(clearButton).toBeHidden();
  await expect(page.locator('[data-search-results]')).toBeEmpty();
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
  await expect(state).toHaveCSS('display', 'none');
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

test('an initially empty busy owner stays exposed without changing layout', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);
  await page.clock.install();

  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const results = page.locator('[data-search-results]');
  const emptyDialogHeight = await dialog.evaluate(
    (element) => element.getBoundingClientRect().height
  );

  const initialBusyState = await input.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new Error('Search input is missing');
    }
    element.value = 'Jira';
    element.dispatchEvent(new Event('input', { bubbles: true }));

    const dialog = document.querySelector<HTMLDialogElement>('dialog');
    const results = document.querySelector<HTMLElement>('[data-search-results]');
    if (!dialog || !results) throw new Error('Search dialog is missing');

    const styles = getComputedStyle(results);
    const bounds = results.getBoundingClientRect();
    return {
      ariaBusy: results.getAttribute('aria-busy'),
      childCount: results.childElementCount,
      display: styles.display,
      borderTopWidth: styles.borderTopWidth,
      height: bounds.height,
      width: bounds.width,
      dialogHeight: dialog.getBoundingClientRect().height
    };
  });

  expect(initialBusyState.ariaBusy).toBe('true');
  expect(initialBusyState.childCount).toBe(0);
  expect(initialBusyState.display).not.toBe('none');
  expect(initialBusyState.borderTopWidth).toBe('0px');
  expect(initialBusyState.height).toBeLessThanOrEqual(1);
  expect(initialBusyState.width).toBeLessThanOrEqual(1);
  expect(initialBusyState.dialogHeight).toBe(emptyDialogHeight);

  await page.clock.fastForward(150);
  await expect(results.locator('a').first()).toBeVisible();
});

test('typing keeps completed results visible until the latest search replaces them', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const results = page.locator('[data-search-results]');
  await input.fill('Jira');
  await expect(results.locator('a').first()).toBeVisible();
  const previousFirstResult = await results.locator('a').first().innerText();

  await input.fill('Board');

  expect(await results.locator('a').first().innerText()).toBe(previousFirstResult);
  await expect(results).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByText('Loading search…')).toHaveCount(0);
  await expect(results).toHaveAttribute('aria-busy', 'false');
  await expect(results.locator('a').first()).toBeVisible();
  expect(await results.locator('a').first().innerText()).not.toBe(previousFirstResult);
});

test('closing synchronously cancels a pending debounced search', async ({ page }) => {
  let loadAttempts = 0;
  await page.route('**/pagefind/pagefind.js*', (route) => {
    loadAttempts += 1;
    return route.continue();
  });
  await page.goto('/');
  await openSearch(page);
  await page.clock.install();

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const results = page.locator('[data-search-results]');
  await input.fill('Jira');
  await expect(results).toHaveAttribute('aria-busy', 'true');

  const busyOnClose = await page.evaluate(() => {
    const closeButton = document.querySelector<HTMLButtonElement>('[data-close-search]');
    const resultsElement = document.querySelector<HTMLElement>('[data-search-results]');
    if (!closeButton || !resultsElement) throw new Error('Search controls are missing');

    closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return resultsElement.getAttribute('aria-busy');
  });

  expect(busyOnClose).toBe('false');
  await expect(page.getByRole('dialog', { name: 'Search documentation' })).toBeHidden();
  await page.clock.fastForward(200);
  expect(loadAttempts).toBe(0);
});

test('Escape synchronously cancels a pending debounced search', async ({ page }) => {
  let loadAttempts = 0;
  await page.route('**/pagefind/pagefind.js*', (route) => {
    loadAttempts += 1;
    return route.continue();
  });
  await page.goto('/');
  await openSearch(page);
  await page.clock.install();

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const results = page.locator('[data-search-results]');
  await input.fill('Jira');
  await expect(results).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Close search' }).focus();
  await page.evaluate(() => {
    const dialog = document.querySelector<HTMLDialogElement>('dialog');
    const resultsElement = document.querySelector<HTMLElement>('[data-search-results]');
    if (!dialog || !resultsElement) throw new Error('Search controls are missing');

    dialog.addEventListener(
      'cancel',
      () => {
        document.documentElement.dataset.searchBusyDuringCancel =
          resultsElement.getAttribute('aria-busy') ?? '';
      },
      { once: true }
    );
  });

  await page.keyboard.press('Escape');

  await expect(page.locator('html')).toHaveAttribute(
    'data-search-busy-during-cancel',
    'false'
  );
  await expect(page.getByRole('dialog', { name: 'Search documentation' })).toBeHidden();
  await page.clock.fastForward(200);
  expect(loadAttempts).toBe(0);
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

  await expect(results).toHaveAttribute('aria-busy', 'false');
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
  await expect(results.nth(0)).toHaveCSS('outline-style', 'none');
  await expect(results.nth(0)).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
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
