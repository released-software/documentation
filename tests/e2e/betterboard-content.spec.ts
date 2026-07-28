import { expect, test } from '@playwright/test';

test('the BetterBoard landing links all 20 articles across the four approved groups', async ({
  page
}) => {
  await page.goto('/betterboard/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Overview' })
  ).toBeVisible();
  await expect(page.locator('main [data-overview-link]')).toHaveCount(20);
  for (const group of ['Start', 'Board setup', 'Shape the board', 'Work faster']) {
    await expect(page.getByRole('heading', { level: 2, name: group })).toBeVisible();
  }
  await expect(
    page.getByRole('link', { name: /Global board directory/ })
  ).toHaveAttribute(
    'href',
    '/betterboard/board-setup/global-board-directory/'
  );
  await expect(page.getByRole('link', { name: /Card colors/ })).toHaveAttribute(
    'href',
    '/betterboard/shape-the-board/card-colors/'
  );
});

test('BetterBoard articles use ordered sentence-case navigation without a wrapper group', async ({
  page
}) => {
  await page.goto('/betterboard/shape-the-board/card-colors/');

  const sidebar = page.locator('#starlight__sidebar');
  await expect(sidebar.locator('details')).toHaveCount(4);
  await expect(sidebar.locator('details[open]')).toHaveCount(1);
  await expect(
    sidebar.locator('details[open] > summary').getByText('Shape the board', {
      exact: true
    })
  ).toBeVisible();
    await expect(
      sidebar.getByRole('link', { name: 'Overview', exact: true })
    ).toHaveCount(1);

  const categoryLabels = await sidebar
    .locator('.top-level > li > details > summary .large')
    .allTextContents();
  expect(categoryLabels).toEqual([
    'Start',
    'Board setup',
    'Shape the board',
    'Work faster'
  ]);
  await expect(sidebar.getByText('shape-the-board', { exact: true })).toHaveCount(0);
});

test('representative migrated articles preserve figures, callouts, tables, and legacy anchors', async ({
  page
}) => {
  await page.goto('/betterboard/shape-the-board/card-colors/');

  await expect(page.locator('main h1')).toHaveText('Card colors');
  await expect(page.locator('.sl-markdown-content h1')).toHaveCount(0);
  await expect(page.locator('[data-neutral-callout]')).toHaveCount(4);
  await expect(page.locator('figure img')).toHaveAttribute(
    'src',
    '/media/betterboard/card-colors-example.png'
  );
  await expect(page.locator('figure figcaption')).toContainText(
    'Several effects at work on one board'
  );

  await page.goto(
    '/betterboard/shape-the-board/columns-grouping/#mapping-field-options'
  );
  await expect(page.locator('#mapping-field-options')).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      level: 3,
      name: 'Mapping field options to columns'
    })
  ).toBeVisible();

  await page.goto('/betterboard/board-setup/global-board-directory/');
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Key' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Focus the search field' })).toBeVisible();
});

for (const [label, route, heading] of [
  ['landing', '/betterboard/', 'Overview'],
  ['start', '/betterboard/start/overview/', 'Overview'],
  [
    'board setup',
    '/betterboard/board-setup/global-board-directory/',
    'Global board directory'
  ],
  [
    'shape the board',
    '/betterboard/shape-the-board/card-colors/',
    'Card colors'
  ],
  [
    'work faster',
    '/betterboard/work-faster/keyboard-shortcuts/',
    'Keyboard shortcuts'
  ]
] as const) {
  test(`the BetterBoard ${label} representative has no mobile overflow`, async ({
    page
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.locator('main h1')).toHaveText(heading);
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  });
}
