import { expect, test } from '@playwright/test';

const overviewPages = [
  {
    path: '/guide/',
    groups: ['Getting started', 'The basics', 'Popular docs'],
    linkCount: 12
  },
  {
    path: '/betterboard/',
    groups: ['Start', 'Board setup', 'Shape the board', 'Work faster', 'How-to'],
    linkCount: 27
  }
] as const;

for (const overview of overviewPages) {
  test(`${overview.path} uses the shared grouped overview layout`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(overview.path);

    const sections = page.locator('[data-overview-section]');
    const links = page.locator('[data-overview-link]');

    await expect(sections).toHaveCount(overview.groups.length);
    await expect(links).toHaveCount(overview.linkCount);

    for (const group of overview.groups) {
      await expect(
        sections.getByRole('heading', { level: 2, name: group })
      ).toBeVisible();
    }

    const sectionTitleTop = await sections
      .first()
      .getByRole('heading', { level: 2 })
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top +
          Number.parseFloat(getComputedStyle(element).paddingTop)
      );
    const firstLinkTitleTop = await links
      .first()
      .locator('span')
      .first()
      .evaluate((element) => element.getBoundingClientRect().top);
    expect(Math.abs(sectionTitleTop - firstLinkTitleTop)).toBeLessThanOrEqual(1);

    await expect(
      page.getByRole('navigation', { name: 'On this page' })
    ).toHaveCount(0);

    const desktopColumns = await sections
      .first()
      .locator('[data-overview-grid]')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
    expect(desktopColumns.trim().split(/\s+/)).toHaveLength(2);

    await page.setViewportSize({ width: 390, height: 844 });

    const mobileColumns = await sections
      .first()
      .locator('[data-overview-grid]')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
    expect(mobileColumns.trim().split(/\s+/)).toHaveLength(1);
  });
}

test('the Hub overview replaces imported card tables with documentation links', async ({
  page
}) => {
  await page.goto('/guide/');

  await expect(page.locator('main table[data-view="cards"]')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: /Set up Hub/ })
  ).toHaveAttribute('href', '/guide/getting-started/setup-guide/');
  await expect(page.getByRole('link', { name: /Using templates/ })).toHaveAttribute(
    'href',
    '/guide/product/changelog/templates/'
  );
});

test('the current overview navigation link stays selected without relying on hover', async ({
  page
}) => {
  await page.goto('/betterboard/');

  const currentLink = page.locator(
    '#starlight__sidebar .top-level > li > a[aria-current="page"]'
  );
  await expect(currentLink).toHaveAttribute('href', '/betterboard/');

  const restingWeight = await currentLink.evaluate(
    (element) => getComputedStyle(element).fontWeight
  );
  expect(restingWeight).toBe('600');

  await currentLink.hover();
  const hoveredWeight = await currentLink.evaluate(
    (element) => getComputedStyle(element).fontWeight
  );
  expect(hoveredWeight).toBe(restingWeight);
});
