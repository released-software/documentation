import { expect, test } from '@playwright/test';

test('the Released identity precedes an accessible documentation space switcher', async ({ page }) => {
  await page.goto('/guide/');

  const header = page.locator('header');
  const identity = header
    .locator('[data-released-identity]')
    .getByRole('link', { name: 'Released', exact: true });
  const switcher = header.getByRole('button', { name: 'Hub documentation' });

  await expect(identity).toBeVisible();
  await expect(switcher).toBeVisible();
  await expect(switcher).toHaveText(/Hub documentation/);
  await expect(
    identity.evaluate((element) => {
      const switcherElement = element
        .closest('[data-documentation-identity]')
        ?.querySelector('[data-space-switcher]');

      return switcherElement ? Boolean(element.compareDocumentPosition(switcherElement) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
    })
  ).resolves.toBe(true);
});

test('the space switcher supports keyboard navigation and restores trigger focus', async ({ page }) => {
  await page.goto('/guide/');

  const trigger = page.getByRole('button', { name: 'Hub documentation' });
  const betterBoardLink = page.getByRole('menuitem', { name: /BetterBoard documentation/ });

  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(betterBoardLink).toBeFocused();

  await betterBoardLink.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.press('Enter');
  await page.keyboard.press('ArrowDown');
  await betterBoardLink.press('Enter');
  await expect(page).toHaveURL(/\/betterboard\/$/);
});

test('space entries use product marks and descriptive availability text, never status dots', async ({ page }) => {
  await page.goto('/guide/');
  await page.getByRole('button', { name: 'Hub documentation' }).click();

  await expect(page.locator('.status-dot, [data-status-dot]')).toHaveCount(0);

  const menuItems = page.getByRole('menuitem');
  await expect(menuItems).toHaveCount(3);
  for (const menuItem of await menuItems.all()) {
    await expect(menuItem).not.toHaveText(/^\s*[•·●∙◦]/);
  }

  const partnerLink = page.getByRole('menuitem', { name: /Partner documentation/ });
  await expect(partnerLink).toHaveAttribute('href', '/partners/');
  await expect(partnerLink).toContainText('Coming soon');
});

test('the Hub sidebar is shallow and opens only the active category on initial load', async ({ page }) => {
  await page.goto('/guide/');
  const sidebar = page.locator('#starlight__sidebar');

  await expect(sidebar.locator('details')).toHaveCount(12);
  await expect(sidebar.locator('details[open]')).toHaveCount(0);

  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  await expect(page.locator('header').getByRole('button', { name: 'Hub documentation' })).toBeVisible();
  await expect(sidebar.getByText('Hub documentation', { exact: true })).toHaveCount(0);

  const maximumDepth = await sidebar.locator('details').evaluateAll((details) =>
    Math.max(0, ...details.map((detail) => {
      let depth = 1;
      let parent = detail.parentElement?.parentElement?.closest('details');
      while (parent) {
        depth += 1;
        parent = parent.parentElement?.parentElement?.closest('details');
      }
      return depth;
    }))
  );

  expect(maximumDepth).toBe(1);
  await expect(sidebar.locator('details[open]')).toHaveCount(1);
  await expect(
    sidebar.locator('details[open] > summary').getByText('Getting started', { exact: true })
  ).toBeVisible();
  await expect(sidebar.getByText('Setup guide', { exact: true })).toHaveCount(0);
  await expect(sidebar.getByText('Resources', { exact: true })).toHaveCount(0);
  await expect(
    sidebar.locator('summary .large').getByText('Settings', { exact: true })
  ).toHaveCount(0);
  await expect(sidebar.getByText('Product', { exact: true })).toHaveCount(0);
  await expect(
    sidebar
      .locator('.top-level > li > details > summary .large')
      .getByText('Best practices', { exact: true })
  ).toBeVisible();
  await expect(
    sidebar
      .locator('.top-level > li > details > summary .large')
      .getByText('AI tips', { exact: true })
  ).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'Administration', exact: true })).toHaveCount(0);
});

test('Hub categories can be opened independently after the active branch initializes', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  const sidebar = page.locator('#starlight__sidebar');
  const administration = sidebar.locator('summary').filter({ hasText: 'Administration' });

  await administration.focus();
  await administration.press('Enter');

  await expect(sidebar.locator('details[open]')).toHaveCount(2);
  await expect(administration.locator('..')).toHaveAttribute('open', '');
  await expect(
    sidebar.locator('details[open] > summary').getByText('Getting started', { exact: true })
  ).toBeVisible();
});

test('the Hub sidebar keeps nested navigation clear of connector lines', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  const nestedItems = page.locator('#starlight__sidebar .top-level ul li');
  await expect(nestedItems.first()).toBeVisible();

  const borderWidths = await nestedItems.evaluateAll((items) =>
    items.map((item) => getComputedStyle(item).borderInlineStartWidth)
  );

  expect(new Set(borderWidths)).toEqual(new Set(['0px']));
});

test('sidebar groups animate without overriding reduced-motion preferences', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  const gettingStarted = page
    .locator('#starlight__sidebar summary')
    .filter({ hasText: 'Getting started' })
    .first()
    .locator('..');

  const motionStyles = await gettingStarted.evaluate((details) => {
    const style = getComputedStyle(details, '::details-content');
    return {
      duration: style.transitionDuration,
      property: style.transitionProperty
    };
  });

  expect(motionStyles.duration).not.toBe('0s');
  expect(motionStyles.property).toContain('block-size');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      gettingStarted.evaluate(
        (details) => getComputedStyle(details, '::details-content').transitionDuration
      )
    )
    .toBe('0s');
});

test('the active Hub sidebar entry stays transparent without a decorative line', async ({ page }) => {
  await page.goto('/guide/product/changelog/settings/artificial-intelligence/');

  const activeSidebarLink = page.locator('#starlight__sidebar a[aria-current="page"]');

  await expect(activeSidebarLink).toHaveAttribute('aria-current', 'page');
  await expect(activeSidebarLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(activeSidebarLink).toHaveCSS('box-shadow', 'none');
});

test('landing and documentation headings keep their distinct typography roles', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main .hero h1')).toHaveCSS('font-weight', '600');

  await page.goto('/betterboard/');
  await expect(page.locator('main h1#_top')).toHaveCSS('font-size', '32px');
  await expect(page.locator('main h1#_top')).toHaveCSS('font-weight', '700');

  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');
  await expect(page.locator('.sl-markdown-content h1')).toHaveCSS('font-size', '32px');
  await expect(page.locator('.sl-markdown-content h1')).toHaveCSS('font-weight', '700');
});

test('the documentation shell uses the compact Switzer type scale', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  await expect(page.locator('.right-sidebar-panel nav a[aria-current="true"]')).toBeVisible();

  const styles = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight
      };
    };

    return {
      h1: read('.sl-markdown-content h1'),
      h2: read('.sl-markdown-content h2'),
      h3: read('.sl-markdown-content h3'),
      body: read('.sl-markdown-content p'),
      collapsedCategory: read(
        '#starlight__sidebar .top-level > li > details:not([open]) > summary .large'
      ),
      openCategory: read(
        '#starlight__sidebar .top-level > li > details[open] > summary .large'
      ),
      overviewLink: read('#starlight__sidebar .top-level > li > a'),
      articleLink: read(
        '#starlight__sidebar .top-level > li > details[open] > ul a:not([aria-current="page"])'
      ),
      currentArticle: read(
        '#starlight__sidebar .top-level > li > details[open] > ul a[aria-current="page"]'
      ),
      tocLink: read('.right-sidebar-panel nav a:not([aria-current="true"])'),
      activeTocLink: read('.right-sidebar-panel nav a[aria-current="true"]'),
      headerControl: read('header [data-space-switcher] button'),
      searchTrigger: read('header [data-open-search]'),
      calloutLabel: read('[data-neutral-callout] [data-callout-label]')
    };
  });

  expect(styles).toEqual({
    h1: { fontSize: '32px', fontWeight: '700', lineHeight: '36.8px' },
    h2: { fontSize: '22px', fontWeight: '700', lineHeight: '27.5px' },
    h3: { fontSize: '18px', fontWeight: '600', lineHeight: '24.3px' },
    body: { fontSize: '16px', fontWeight: '400', lineHeight: '27.2px' },
    collapsedCategory: { fontSize: '13px', fontWeight: '400', lineHeight: '18.2px' },
    openCategory: { fontSize: '13px', fontWeight: '500', lineHeight: '18.2px' },
    overviewLink: { fontSize: '13px', fontWeight: '400', lineHeight: '18.2px' },
    articleLink: { fontSize: '12.5px', fontWeight: '400', lineHeight: '17.5px' },
    currentArticle: { fontSize: '12.5px', fontWeight: '600', lineHeight: '17.5px' },
    tocLink: { fontSize: '13px', fontWeight: '400', lineHeight: '18.2px' },
    activeTocLink: { fontSize: '13px', fontWeight: '600', lineHeight: '18.2px' },
    headerControl: { fontSize: '14px', fontWeight: '500', lineHeight: '19.6px' },
    searchTrigger: { fontSize: '14px', fontWeight: '400', lineHeight: '19.6px' },
    calloutLabel: { fontSize: '14px', fontWeight: '500', lineHeight: '19.6px' }
  });

  await page.goto('/guide/getting-started/setup-guide/');
  await expect(page.locator('.sl-markdown-content h4')).toHaveCSS('font-size', '16px');
  await expect(page.locator('[data-link-row] .link-row__title').first()).toHaveCSS('font-size', '16px');

  await page.goto('/guide/getting-started/setup-guide/embedding-the-widget/');
  await expect(page.locator('figcaption').first()).toHaveCSS('font-size', '12px');
});

test('the space switcher and Starlight mobile menu remain operable at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/guide/');

  const trigger = page.getByRole('button', { name: 'Hub documentation' });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await trigger.press('Escape');
  await expect(trigger).toBeFocused();

  const mobileMenu = page.locator('starlight-menu-button button');
  await expect(mobileMenu).toBeVisible();
  await mobileMenu.click();
  await expect(page.locator('body')).toHaveAttribute('data-mobile-menu-expanded', '');
  const mobileSidebar = page.locator('#starlight__sidebar');
  await expect(mobileSidebar).toBeVisible();
  await expect(mobileSidebar.locator('details[open]')).toHaveCount(0);

  await page.goto('/guide/resources/how-tos/embed-the-portal-in-a-forge-app/');
  await page.locator('starlight-menu-button button').click();
  await expect(mobileSidebar.locator('details[open]')).toHaveCount(1);
  await expect(
    mobileSidebar.locator('details[open] > summary').getByText('How-tos', { exact: true })
  ).toBeVisible();
});
