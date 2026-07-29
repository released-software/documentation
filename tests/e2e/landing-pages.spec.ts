import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
] as const;

test('the documentation overview is a content-width editorial destination list', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  await page.goto('/');

  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.locator('#starlight__sidebar')).toHaveCount(0);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Find the right documentation for your product.'
    })
  ).toBeVisible();
  await expect(
    page.getByText('Choose a space to get started, configure your product, or find an answer.')
  ).toBeVisible();

  const overview = page.locator('.documentation-overview');
  const overviewWidth = await overview.evaluate((element) => element.getBoundingClientRect().width);
  expect(overviewWidth).toBeLessThanOrEqual(960);

  const activeSpaces = [
    { id: 'hub', name: /Hub documentation/ },
    { id: 'betterboard', name: /BetterBoard documentation/ }
  ] as const;

  for (const space of activeSpaces) {
    const row = overview.locator(`[data-documentation-space="${space.id}"]`);
    await expect(row).toHaveRole('link');
    await expect(row).toHaveAttribute('href', space.id === 'hub' ? '/guide/' : '/betterboard/');
    await expect(row.getByText(space.name)).toBeVisible();
    await expect(row.locator('.product-mark img')).toHaveAttribute(
      'src',
      space.id === 'hub'
        ? '/brand/released-favicon.svg'
        : '/brand/betterboard-favicon.svg'
    );
    await expect(row.locator('[data-row-arrow]')).toHaveCount(1);
  }

  await expect(overview.locator('[data-documentation-space="partners"]')).toHaveCount(0);

  const rows = overview.locator('.documentation-row');
  await expect(rows).toHaveCount(2);
  for (const row of await rows.all()) {
    await expect(row).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(row).toHaveCSS('border-bottom-style', 'solid');
    await expect(row).toHaveCSS('border-bottom-width', '1px');
    await expect(row).toHaveCSS('box-shadow', 'none');
  }
  await expect(overview.locator('.status-dot, [data-status-dot]')).toHaveCount(0);
});

test('active overview rows move only their arrow and preserve visible reduced-motion focus', async ({
  page
}) => {
  await page.goto('/');

  const hubRow = page.locator('[data-documentation-space="hub"]');
  const arrow = hubRow.locator('[data-row-arrow]');

  await hubRow.focus();
  await expect(hubRow).toHaveCSS('outline-style', 'solid');
  await expect(hubRow).toHaveCSS('outline-width', '2px');

  await page.mouse.move(0, 0);
  await expect(arrow).toHaveCSS('transform', 'none');
  await hubRow.hover();
  await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 4, 0)');
  await expect(hubRow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(arrow).toHaveCSS('transform', 'none');
});

test('the Partner coming-soon page keeps the documentation shell but is excluded from Pagefind', async ({
  page
}) => {
  await page.goto('/partners/');

  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.locator('#starlight__sidebar')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Partner documentation' })
  ).toBeVisible();
  await expect(
    page.getByText('Guidance and resources for Released partners are coming soon.')
  ).toBeVisible();
  await expect(
    page.getByLabel('Partner documentation status').getByText('Coming soon', { exact: true })
  ).toBeVisible();
  await expect(page.locator('main[data-pagefind-body]')).toHaveCount(0);
  await expect(page.locator('main svg')).toHaveCount(1);
  await expect(page.locator('.status-dot, [data-status-dot]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://docs.released.so/partners/'
  );

  const indexedUrls = await page.evaluate(async () => {
    // Pagefind creates this browser module during `astro build`, so it has no source-time types.
    // @ts-expect-error Generated at build time and served by the preview server.
    const pagefind = (await import('/pagefind/pagefind.js')) as {
      search(query: string): Promise<{
        results: Array<{ data(): Promise<{ url: string }> }>;
      }>;
    };
    const results = await pagefind.search(
      'Guidance and resources for Released partners are coming soon.'
    );
    const entries = await Promise.all(results.results.map((result) => result.data()));
    return entries.map((entry) => entry.url);
  });
  expect(indexedUrls).not.toContain('/partners/');
});

for (const viewport of viewports) {
  test(`landing pages have no horizontal overflow at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of ['/', '/partners/']) {
      await page.goto(route);

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}
