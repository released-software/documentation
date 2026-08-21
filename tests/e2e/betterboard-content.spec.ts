import { expect, test } from '@playwright/test';

test('the BetterBoard landing links all 28 articles across the five approved groups', async ({
  page
}) => {
  await page.goto('/betterboard/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Overview' })
  ).toBeVisible();
  await expect(page.locator('main [data-overview-link]')).toHaveCount(28);
  for (const group of ['Start', 'Board setup', 'Shape the board', 'Work faster', 'How-to']) {
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
  await expect(page.getByRole('link', { name: /Bulk edit work items on a Jira board/ })).toHaveAttribute(
    'href',
    '/betterboard/how-to/bulk-edit-work-items-on-a-jira-board/'
  );
  await expect(page.locator('main [data-overview-link][href="/betterboard/work-faster/track-time-on-jira-board/"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Create a personal My work board/ })).toHaveAttribute(
    'href',
    '/betterboard/how-to/create-a-personal-my-work-board-across-all-your-jira-spaces/'
  );
});

test('the Field types section tables share aligned columns', async ({ page }) => {
  await page.goto('/betterboard/shape-the-board/field-types/');

  const tables = page.locator('main .sl-markdown-content > table');
  await expect(tables).toHaveCount(3);

  const layouts = await tables.evaluateAll((elements) =>
    elements.map((element) => {
      const headerCells = [...element.querySelectorAll('thead th')];
      return {
        tableLayout: getComputedStyle(element).tableLayout,
        width: Math.round(element.getBoundingClientRect().width),
        columnWidths: headerCells.map((cell) => Math.round(cell.getBoundingClientRect().width))
      };
    })
  );

  expect(layouts.map((layout) => layout.tableLayout)).toEqual(['fixed', 'fixed', 'fixed']);
  expect(new Set(layouts.map((layout) => layout.width)).size).toBe(1);
  expect(new Set(layouts.map((layout) => layout.columnWidths.join(','))).size, JSON.stringify(layouts)).toBe(1);

  const headerWhiteSpace = await tables
    .locator('thead th')
    .evaluateAll((headers) => headers.map((header) => getComputedStyle(header).whiteSpace));
  expect(headerWhiteSpace).toEqual(Array(18).fill('nowrap'));

  const fieldNoteLinks = tables.locator('tbody td:first-child a');
  await expect(fieldNoteLinks).toHaveCount(6);
  await expect(
    fieldNoteLinks.evaluateAll((links) =>
      links.map((link) => getComputedStyle(link).textDecorationLine)
    )
  ).resolves.toEqual(Array(6).fill('none'));
  await fieldNoteLinks.first().hover();
  await expect(fieldNoteLinks.first()).toHaveCSS('text-decoration-line', 'underline');
});

test('Elements Connect fields explain their limited inline editing', async ({ page }) => {
  await page.goto('/betterboard/shape-the-board/field-types/');

  const customFieldsTable = page.locator('main .sl-markdown-content > table').nth(1);
  const elementsConnectRow = customFieldsTable
    .getByRole('row')
    .filter({ hasText: 'Elements Connect fields' });
  await expect(elementsConnectRow).toHaveCount(1);
  await expect(
    elementsConnectRow.locator('span[aria-label="Limited support"]')
  ).toHaveText('○');

  await expect(
    page.getByRole('heading', { level: 3, name: 'Elements Connect fields' })
  ).toBeVisible();
  const editingLimitations = page.locator('main [data-neutral-callout]').filter({
    hasText: 'Inline editing is limited'
  });
  await expect(editingLimitations).toHaveCount(1);
  await expect(editingLimitations.locator('[data-callout-title]')).toHaveText('Limitations');
  await expect(editingLimitations).toContainText(
    'only values already assigned to a work item in Jira'
  );
  await expect(editingLimitations).toContainText(
    'Connected Item text fields are not currently editable or available to display on cards'
  );

  const legacyFields = editingLimitations.locator('details');
  await expect(legacyFields).toHaveCount(1);
  await expect(legacyFields).not.toHaveAttribute('open', '');
  await expect(legacyFields.locator('summary')).toHaveText(
    'Why are legacy fields unsupported?'
  );
  const legacyFieldHistory = legacyFields.getByText('Before Elements Connect 7.0.0', {
    exact: false
  });
  await expect(legacyFieldHistory).not.toBeVisible();
  await legacyFields.locator('summary').click();
  await expect(legacyFields).toHaveAttribute('open', '');
  await expect(legacyFieldHistory).toBeVisible();

  await expect(
    page.getByRole('link', { name: 'Elements Connect documentation' })
  ).toHaveAttribute(
    'href',
    'https://doc.elements-apps.com/elements-connect-cloud/connected-custom-fields-settings'
  );

  const syntheticFieldsTable = page.locator('main .sl-markdown-content > table').nth(2);
  const legend = syntheticFieldsTable.locator('xpath=following-sibling::ul[1]');
  await expect(legend.getByRole('listitem')).toHaveCount(3);
  await expect(legend.getByRole('listitem').first()).toHaveText('✓ Supported');
  await expect(legend).toContainText('Limited support');

  const capabilities = syntheticFieldsTable.locator('xpath=following-sibling::ul[2]');
  await expect(capabilities.getByRole('listitem')).toHaveCount(5);
  await expect(capabilities).toContainText('Display adds a field to cards');
});

test('BetterBoard articles use ordered sentence-case navigation without a wrapper group', async ({
  page
}) => {
  await page.goto('/betterboard/shape-the-board/card-colors/');

  const sidebar = page.locator('#starlight__sidebar');
  await expect(sidebar.locator('details')).toHaveCount(5);
  await expect(sidebar.locator('details[open]')).toHaveCount(1);
  await expect(
    sidebar.locator('details[open] > summary').getByText('Shape the board', {
      exact: true
    })
  ).toBeVisible();
  await expect(
      sidebar.getByRole('link', { name: 'Overview', exact: true })
    ).toHaveCount(1);
  await expect(
    sidebar
      .locator('.top-level > li')
      .first()
      .getByRole('link', { name: 'Overview', exact: true })
  ).toHaveAttribute('href', '/betterboard/');

  const categoryLabels = await sidebar
    .locator('.top-level > li > details > summary .large')
    .allTextContents();
  expect(categoryLabels).toEqual([
    'Start',
    'Board setup',
    'Shape the board',
    'Work faster',
    'How-to'
  ]);
  await expect(sidebar.getByText('shape-the-board', { exact: true })).toHaveCount(0);
});

test('the time-tracking guide is reachable from Work faster navigation', async ({ page }) => {
  await page.goto('/betterboard/work-faster/keyboard-shortcuts/');

  const guide = page
    .locator('#starlight__sidebar')
    .locator('a[href="/betterboard/work-faster/track-time-on-jira-board/"]');
  await expect(guide).toHaveCount(1);
  await guide.click();

  await expect(page).toHaveURL('/betterboard/work-faster/track-time-on-jira-board/');
  await expect(page.locator('main h1')).toBeVisible();
});

test('the time-tracking guide uses aligned FAQ items without a left border', async ({
  page
}) => {
  await page.goto('/betterboard/work-faster/track-time-on-jira-board/');

  const faqItems = page.locator('main [data-faq-item]');
  await expect(faqItems).toHaveCount(5);

  const firstItem = faqItems.first();
  await expect(firstItem).not.toHaveAttribute('open', '');
  await expect(firstItem.locator('[data-faq-answer]')).not.toBeVisible();

  const styles = await firstItem.evaluate((item) => {
    const style = getComputedStyle(item);
    const summary = item.querySelector('summary') as HTMLElement;
    const heading = document.querySelector('#frequently-asked-questions') as HTMLElement;
    const summaryStyle = getComputedStyle(summary);
    return {
      borderBottomStyle: style.borderBottomStyle,
      borderLeftWidth: style.borderLeftWidth,
      headingLeft: heading.getBoundingClientRect().left,
      summaryLeft: summary.getBoundingClientRect().left,
      summaryPaddingInlineStart: summaryStyle.paddingInlineStart,
      summaryPaddingInlineEnd: summaryStyle.paddingInlineEnd
    };
  });
  expect(styles.borderBottomStyle).toBe('solid');
  expect(styles.borderLeftWidth).toBe('0px');
  expect(styles.headingLeft).toBe(styles.summaryLeft);
  expect(styles.summaryPaddingInlineStart).toBe('0px');
  expect(styles.summaryPaddingInlineEnd).toBe('8px');

  await firstItem.locator('summary').click();
  await expect(firstItem).toHaveAttribute('open', '');
  await expect(firstItem.locator('[data-faq-answer]')).toBeVisible();
});

test('BetterBoard how-tos keep native Jira instructions out of the documentation', async ({ page }) => {
  await page.goto('/betterboard/how-to/bulk-edit-work-items-on-a-jira-board/');

  await expect(page.locator('main h1')).toHaveText('Bulk edit work items on a Jira board');
  await expect(
    page.getByRole('heading', { level: 2, name: 'How to bulk edit work items' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Inline editing' })).toHaveAttribute(
    'href',
    '/betterboard/work-faster/inline-editing/'
  );
  await expect(page.locator('main')).not.toContainText('Company-managed board');
  await expect(page.locator('main')).not.toContainText('Team-managed board');
  await expect(page.locator('main .sl-steps')).toHaveCount(1);
  await expect(page.locator('main .betterboard-how-to-steps')).toHaveCSS('margin-top', '24px');
  await expect(page.locator('main .sl-steps li')).toHaveCount(3);
  await expect(page.locator('main .sl-steps h3')).toHaveCount(3);

  await page.goto('/betterboard/how-to/create-a-personal-my-work-board-across-all-your-jira-spaces/');
  await expect(page.getByRole('link', { name: 'Multi-space boards' })).toHaveAttribute(
    'href',
    '/betterboard/board-setup/multi-space-boards/'
  );
  await expect(page.getByRole('link', { name: 'Filters and refinement' })).toHaveAttribute(
    'href',
    '/betterboard/work-faster/filters-refinement/'
  );
  await expect(page.locator('main .sl-steps')).toHaveCount(1);
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
