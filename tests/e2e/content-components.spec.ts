import { expect, test, type Locator, type Page } from '@playwright/test';

const harnessPath = '/__tests__/content-components/';
const generatedFixturePath = '/component-tests/generated-content-components/';

function channelToLinear(value: number) {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: string, background: string) {
  const parse = (color: string) => {
    const channels = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number);
    if (!channels || channels.length !== 3) {
      throw new Error(`Expected an RGB color, received "${color}"`);
    }
    const scale = color.startsWith('color(srgb ') ? 255 : 1;
    const [red, green, blue] = channels.map((channel) =>
      channelToLinear(channel * scale)
    );
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const foregroundLuminance = parse(foreground);
  const backgroundLuminance = parse(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

async function expectReadable(locator: Locator, surface: Locator = locator) {
  const [foreground, background] = await Promise.all([
    locator.evaluate((element) => getComputedStyle(element).color),
    surface.evaluate((element) => getComputedStyle(element).backgroundColor)
  ]);

  expect(
    contrastRatio(foreground, background),
    `expected ${foreground} to remain readable on ${background}`
  ).toBeGreaterThanOrEqual(4.5);
}

async function useTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((selectedTheme) => {
    document.documentElement.dataset.theme = selectedTheme;
  }, theme);
}

test.beforeEach(async ({ page }) => {
  await page.goto(harnessPath);
});

test('the temporary harness is excluded from indexing and the sitemap', async ({ page, request }) => {
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);

  const sitemap = await request.get('/sitemap-0.xml');
  const sitemapText = await sitemap.text();
  expect(sitemapText).not.toContain(harnessPath);
  expect(sitemapText).not.toContain(generatedFixturePath);
});

test('real converter output resolves and renders every migrated-content component', async ({ page }) => {
  await page.goto(generatedFixturePath);

  await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow'
  );
  await expect(page.locator('[data-neutral-callout]')).toContainText(
    'Check the portal access settings before continuing.'
  );
  const linkRow = page.locator('[data-link-row]');
  await expect(linkRow).toContainText('Hub documentation');
  await expect(linkRow).toContainText('Return to the Hub documentation overview.');

  const figure = page.getByRole('figure');
  await expect(figure.getByRole('img')).toHaveAttribute('width', '96');
  await expect(figure.getByRole('img')).toHaveAttribute('height', '96');
  await expect(figure.locator('figcaption')).toHaveText('Generated figure caption.');

  await expect(page.locator('[data-embed-provider="youtube"] iframe')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/Ll1hArmqOAg'
  );
  await expect(page.locator('[data-embed-provider="loom"] iframe')).toHaveAttribute(
    'src',
    'https://www.loom.com/embed/e972f54ef3644aa78b822b2cbf573e14'
  );
});

test('callout variants use content titles and restrained state surfaces without accent bars', async ({ page }) => {
  const callouts = page.locator('[data-neutral-callout]');
  await expect(callouts).toHaveCount(4);
  await expect(page.locator('.status-dot, [data-status-dot]')).toHaveCount(0);
  await expect(callouts.locator('[data-callout-title]')).toHaveCount(3);
  await expect(callouts.getByText(/^(Note|Tip|Caution|Danger)$/)).toHaveCount(0);
  await expect(callouts.nth(0).locator('[data-callout-title]')).toHaveCount(0);
  await expect(callouts.nth(1).locator('[data-callout-title]')).toHaveText('Try this');
  await expect(callouts.nth(2).locator('[data-callout-title]')).toHaveText(
    'Check permissions'
  );
  await expect(callouts.nth(3).locator('[data-callout-title]')).toHaveText(
    'Destructive action'
  );
  const untitledAlignment = await callouts.nth(0).evaluate((callout) => {
    const icon = callout.querySelector('[data-callout-icon]') as SVGElement;
    const content = callout.querySelector('[data-callout-content]') as HTMLElement;
    const iconBox = icon.getBoundingClientRect();
    const contentBox = content.getBoundingClientRect();
    const lineHeight = Number.parseFloat(
      getComputedStyle(content.firstElementChild ?? content).lineHeight
    );
    const firstLineCenter = contentBox.top + lineHeight / 2;
    return {
      offset: Math.abs(iconBox.top + iconBox.height / 2 - firstLineCenter),
      iconTop: iconBox.top,
      iconHeight: iconBox.height,
      contentTop: contentBox.top,
      lineHeight
    };
  });
  expect(
    untitledAlignment.offset,
    `expected the untitled callout icon to align with its first line: ${JSON.stringify(
      untitledAlignment
    )}`
  ).toBeLessThanOrEqual(1);

  for (const theme of ['light', 'dark'] as const) {
    await useTheme(page, theme);
    const surfaces = await callouts.evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        const iconStyle = getComputedStyle(
          element.querySelector('[data-callout-icon]') as SVGElement
        );
        return {
          background: style.backgroundColor,
          icon: iconStyle.color,
          borderTop: style.borderTopColor,
          borderRight: style.borderRightColor,
          borderBottom: style.borderBottomColor,
          borderLeft: style.borderLeftColor
        };
      })
    );

    expect(new Set(surfaces.map(({ background }) => background)).size).toBe(4);
    expect(new Set(surfaces.map(({ icon }) => icon)).size).toBe(4);
    for (const surface of surfaces) {
      expect(surface.background).not.toBe('rgba(0, 0, 0, 0)');
      expect(surface.borderTop).toBe(surface.borderRight);
      expect(surface.borderLeft).toBe(surface.borderRight);
      expect(surface.borderBottom).toBe(surface.borderRight);
    }
    for (const callout of await callouts.all()) {
      await expectReadable(callout);
      const title = callout.locator('[data-callout-title]');
      if (await title.count()) await expectReadable(title, callout);
    }
  }
});

test('migrated callouts promote their authored title without retaining the type label', async ({
  page
}) => {
  await page.goto('/guide/resources/troubleshooting/ensuring-jira-permissions/');

  const callout = page.locator('[data-neutral-callout]').first();
  await expect(callout.locator('[data-callout-title]')).toHaveText('App Access Rules');
  await expect(callout.getByText('Caution', { exact: true })).toHaveCount(0);
  await expect(callout.locator('[data-callout-content] strong')).toHaveCount(0);
});

test('LinkRow is a keyboard-focusable divider row rather than a filled card', async ({ page }) => {
  const row = page.getByRole('link', { name: /Hub documentation/ });
  const styles = await row.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      borderBottomStyle: style.borderBottomStyle,
      borderBottomWidth: style.borderBottomWidth,
      borderLeftWidth: style.borderLeftWidth,
      borderTopWidth: style.borderTopWidth
    };
  });

  expect(styles.background).toBe('rgba(0, 0, 0, 0)');
  expect(styles.borderBottomStyle).toBe('solid');
  expect(styles.borderBottomWidth).not.toBe('0px');
  expect(styles.borderLeftWidth).toBe('0px');
  expect(styles.borderTopWidth).toBe('0px');
  await expect(row.locator('[data-link-row-arrow]')).toHaveText('→');

  await row.focus();
  await expect(row).toBeFocused();
  await expect(row).toHaveCSS('outline-style', 'solid');
});

test('Figure preserves image and caption semantics', async ({ page }) => {
  const figure = page.getByRole('figure');
  const image = figure.getByRole('img');

  await expect(figure.locator('figcaption')).toHaveText('The Released product symbol.');
  await expect(image).toHaveAttribute('alt', 'Released symbol');
  expect(await image.getAttribute('alt')).not.toBe('');
  await expect(image).toHaveAttribute('width', '96');
  await expect(image).toHaveAttribute('height', '96');
});

test('provider embeds are secure, titled, lazy, and responsively bounded', async ({ page }) => {
  const youtube = page.locator('iframe[title="YouTube component example"]');
  const loom = page.locator('iframe[title="Loom component example"]');

  await expect(youtube).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/Ll1hArmqOAg');
  await expect(loom).toHaveAttribute(
    'src',
    'https://www.loom.com/embed/e972f54ef3644aa78b822b2cbf573e14'
  );

  for (const iframe of [youtube, loom]) {
    await expect(iframe).toHaveAttribute('loading', 'lazy');
    await expect(iframe).toHaveAttribute('allowfullscreen', '');
    await expect(iframe).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const iframe of [youtube, loom]) {
    const bounds = await iframe.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.width).toBeLessThanOrEqual(390);
    expect(bounds!.width).toBeGreaterThan(0);
    expect(bounds!.height).toBeGreaterThan(0);
  }
});

test('tabs and step content remain keyboard accessible', async ({ page }) => {
  const firstTab = page.getByRole('tab', { name: 'Team-managed projects' });
  const secondTab = page.getByRole('tab', { name: 'Company-managed projects' });

  await firstTab.focus();
  await firstTab.press('ArrowRight');
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Company-managed projects' })).toBeVisible();

  const steps = page.locator('ol.sl-steps');
  await expect(steps.locator(':scope > li')).toHaveCount(2);
  const stepLink = steps.getByRole('link', { name: 'Review the Hub guide' });
  await stepLink.focus();
  await expect(stepLink).toBeFocused();
});

test('content motion is removed when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const row = page.locator('[data-link-row]');

  await expect(row).toHaveCSS('transition-duration', '0s');
  await expect(row.locator('[data-link-row-arrow]')).toHaveCSS('transition-duration', '0s');
});
