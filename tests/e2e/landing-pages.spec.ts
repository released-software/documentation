import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
] as const;

test('the documentation overview presents two homepage-inspired product cards', async ({ page }) => {
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
  await expect(page.locator('main .hero .copy')).toHaveCSS('text-align', 'center');

  const overview = page.locator('.documentation-overview');
  const overviewWidth = await overview.evaluate((element) => element.getBoundingClientRect().width);
  expect(overviewWidth).toBeLessThanOrEqual(960);

  const activeSpaces = [
    {
      id: 'hub',
      audience: 'For teams communicating beyond Jira',
      name: 'Hub',
      href: '/guide/',
      whatsNewHref: 'https://released.so/hub/whats-new'
    },
    {
      id: 'betterboard',
      audience: 'For Jira power users',
      name: 'BetterBoard',
      href: '/betterboard/',
      whatsNewHref: 'https://released.so/betterboard/whats-new'
    }
  ] as const;

  for (const space of activeSpaces) {
    const card = overview.locator(`[data-documentation-space="${space.id}"]`);
    await expect(card).toHaveRole('article');
    await expect(card).toHaveClass(/pixel-card/);
    await expect(card.getByText(space.audience)).toBeVisible();
    await expect(card.getByText(space.name, { exact: true })).toBeVisible();
    await expect(card.locator('[data-pixel-canvas]')).toHaveCount(1);
    await expect(card.locator('[data-pixel-canvas]')).toHaveAttribute('aria-hidden', 'true');
    await expect(card.locator('[data-pixel-canvas]')).toHaveCSS('pointer-events', 'none');

    const actions = card.getByRole('navigation', { name: `${space.name} actions` });
    await expect(actions.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      space.href
    );
    await expect(actions.getByRole('link', { name: 'What’s new' })).toHaveAttribute(
      'href',
      space.whatsNewHref
    );
  }

  await expect(overview.locator('[data-documentation-space="partners"]')).toHaveCount(0);

  const cards = overview.locator('[data-pixel-card]');
  await expect(cards).toHaveCount(2);
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS('border-top-left-radius', '20px');
    await expect(card).toHaveCSS('min-height', '330px');
    await expect(card).toHaveCSS('padding-left', '42px');
  }
  await expect(overview.locator('.status-dot, [data-status-dot]')).toHaveCount(0);
});

test('overview cards reveal pixels on hover and preserve visible reduced-motion focus', async ({
  page
}) => {
  await page.goto('/');

  const hubCard = page.locator('[data-documentation-space="hub"]');
  const documentationLink = hubCard.getByRole('link', { name: 'Documentation' });

  expect(await hubCard.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe(
    '0'
  );

  await hubCard.hover();
  await expect
    .poll(() => hubCard.evaluate((element) => getComputedStyle(element, '::before').opacity))
    .toBe('1');

  await documentationLink.focus();
  expect(await hubCard.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe(
    '1'
  );

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await hubCard.evaluate((element) => getComputedStyle(element, '::before').transitionDuration)
  ).toBe('0s');
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
