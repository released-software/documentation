import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
] as const;

test('the documentation overview matches the static product-panel design', async ({ page }) => {
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
  await expect(page.getByRole('banner').getByRole('link', { name: 'Marketplace' })).toHaveAttribute(
    'href',
    'https://marketplace.atlassian.com/apps/4162439467'
  );
  await expect(page.getByRole('banner').getByRole('link', { name: 'Website' })).toHaveAttribute(
    'href',
    'https://released.so'
  );

  const overview = page.locator('.documentation-overview');
  const overviewWidth = await overview.evaluate((element) => element.getBoundingClientRect().width);
  expect(overviewWidth).toBeLessThanOrEqual(1800);

  const activeSpaces = [
    {
      id: 'betterboard',
      name: 'BetterBoard',
      description: 'Set up a faster, more flexible Jira board and learn the workflows it improves.',
      href: '/betterboard/',
      whatsNewHref: 'https://released.so/betterboard/whats-new'
    },
    {
      id: 'hub',
      name: 'Hub',
      description: 'Learn how to share Jira work through roadmaps, release notes, and customer feedback.',
      href: '/guide/',
      whatsNewHref: 'https://released.so/hub/whats-new'
    }
  ] as const;

  for (const space of activeSpaces) {
    const card = overview.locator(`[data-documentation-space="${space.id}"]`);
    await expect(card).toHaveRole('article');
    await expect(card.getByText(space.name, { exact: true })).toBeVisible();
    await expect(card.getByText(space.description, { exact: true })).toBeVisible();
    await expect(card.locator('[data-pixel-canvas]')).toHaveCount(0);

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

  const cards = overview.locator('[data-documentation-space]');
  await expect(cards).toHaveCount(2);
  await expect(cards).toHaveText([/BetterBoard/, /Hub/]);
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const cardHeights = await cards.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().height))
    );
    expect(new Set(cardHeights).size, `${viewport.name}: ${cardHeights.join(', ')}`).toBe(1);
    if (viewport.width > 560) {
      const cardTops = await cards.evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().top))
      );
      expect(new Set(cardTops).size, `${viewport.name}: ${cardTops.join(', ')}`).toBe(1);
    }
  }
  const descriptionFontSizes = await cards.evaluateAll((elements) =>
    elements.map((element) =>
      Number.parseFloat(getComputedStyle(element.querySelector('.documentation-card__description')!).fontSize)
    )
  );
  expect(Math.max(...descriptionFontSizes)).toBeLessThanOrEqual(18);
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS('border-top-left-radius', '20px');
    await expect(card).toHaveCSS('font-family', /Switzer/);
  }
  await expect(cards.first().getByRole('heading')).toHaveCSS('font-weight', '400');
  const actions = cards.locator('.button-link');
  for (const action of await actions.all()) {
    await expect(action).toHaveCSS('min-height', '44px');
    await expect(action).toHaveCSS('font-size', '16px');
  }
  await expect(overview.locator('.status-dot, [data-status-dot]')).toHaveCount(0);
});

test('overview cards omit the pixel effect', async ({ page }) => {
  await page.goto('/');

  const hubCard = page.locator('[data-documentation-space="hub"]');
  await hubCard.hover();
  await expect(hubCard.locator('[data-pixel-canvas]')).toHaveCount(0);
  expect(await hubCard.evaluate((element) => getComputedStyle(element, '::before').content)).toBe(
    'none'
  );
});

test('overview panels and actions respond to hover', async ({ page }) => {
  await page.goto('/');

  const hubCard = page.locator('[data-documentation-space="hub"]');
  await hubCard.hover();
  await page.waitForTimeout(250);
  await expect
    .poll(() => hubCard.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe('none');
  await expect
    .poll(() => hubCard.evaluate((element) => getComputedStyle(element).backgroundColor))
    .toBe('rgb(247, 247, 249)');

  const primaryAction = hubCard.getByRole('link', { name: 'Documentation' });
  await primaryAction.hover();
  await expect
    .poll(() => primaryAction.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe('none');

  const secondaryAction = hubCard.getByRole('link', { name: 'What’s new' });
  await secondaryAction.hover();
  await expect
    .poll(() => secondaryAction.evaluate((element) => getComputedStyle(element).backgroundColor))
    .toBe('rgb(255, 255, 255)');
});

test('overview uses shared CTA links with compact panels and dark-mode contrast', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  await page.goto('/');

  const cards = page.locator('.documentation-overview [data-documentation-space]');
  const desktopHeights = await cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().height))
  );
  expect(Math.max(...desktopHeights)).toBeLessThanOrEqual(400);

  const primaryActions = cards.locator('.button-link--primary');
  const secondaryActions = cards.locator('.button-link--secondary');
  await expect(primaryActions).toHaveCount(2);
  await expect(secondaryActions).toHaveCount(2);

  await page.locator('html').evaluate((element) => element.setAttribute('data-theme', 'dark'));
  for (const action of await primaryActions.all()) {
    await expect(action).toHaveCSS('background-color', 'rgb(244, 245, 247)');
    await expect(action).toHaveCSS('color', 'rgb(15, 17, 21)');
  }

  await page.setViewportSize(viewports[2]);
  const mobileHeights = await cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().height))
  );
  expect(Math.max(...mobileHeights)).toBeLessThanOrEqual(352);
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
