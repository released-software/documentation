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

test('the Hub sidebar starts below the space switcher and has at most two disclosure levels', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  const sidebar = page.locator('#starlight__sidebar');
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

  expect(maximumDepth).toBe(2);
  await expect(sidebar.getByText('Getting started', { exact: true })).toBeVisible();
  await expect(sidebar.locator('summary .large').getByText('Setup guide', { exact: true })).toBeVisible();
});

test('the documentation shell uses the compact Switzer type scale', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

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
      h1: read('main h1'),
      h2: read('.sl-markdown-content h2'),
      h3: read('.sl-markdown-content h3'),
      body: read('.sl-markdown-content p'),
      sidebarGroup: read('#starlight__sidebar summary .large'),
      sidebarLink: read('#starlight__sidebar a'),
      tocLink: read('.right-sidebar-panel nav a'),
      headerControl: read('header [data-space-switcher] button')
    };
  });

  expect(styles).toEqual({
    h1: { fontSize: '32px', fontWeight: '700', lineHeight: '36.8px' },
    h2: { fontSize: '22px', fontWeight: '700', lineHeight: '27.5px' },
    h3: { fontSize: '18px', fontWeight: '600', lineHeight: '24.3px' },
    body: { fontSize: '16px', fontWeight: '400', lineHeight: '27.2px' },
    sidebarGroup: { fontSize: '12px', fontWeight: '600', lineHeight: '16.8px' },
    sidebarLink: { fontSize: '13.5px', fontWeight: '400', lineHeight: '18.9px' },
    tocLink: { fontSize: '13px', fontWeight: '400', lineHeight: '18.2px' },
    headerControl: { fontSize: '14px', fontWeight: '500', lineHeight: '19.6px' }
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
  await expect(page.locator('#starlight__sidebar')).toBeVisible();
});
