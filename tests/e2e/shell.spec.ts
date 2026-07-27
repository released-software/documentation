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

test('the active sidebar entry remains unfilled', async ({ page }) => {
  await page.goto('/guide/');

  const activeSidebarLink = page
    .locator('#starlight__sidebar')
    .getByRole('link', { name: 'Hub documentation', exact: true });

  await expect(activeSidebarLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
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
