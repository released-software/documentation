# Hub Navigation and Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the migrated Hub documentation so its sidebar has sentence-case labels and no more than two collapsible levels, while the complete documentation shell uses the approved compact type scale.

**Architecture:** Normalize only the Hub sidebar data in the existing route middleware boundary before Starlight renders it. Remove the redundant space wrapper, preserve the next two group levels, and flatten deeper groups without reordering their links. Apply typography through the shared Starlight tokens and shell stylesheet so every migrated article inherits one scale.

**Tech Stack:** Astro 7, Starlight 0.41, TypeScript, Node test runner, Playwright.

## Global Constraints

- Preserve every existing `/guide/*` URL and fragment compatibility behavior.
- Keep the header `Hub documentation` space switcher; remove only the sidebar wrapper.
- Allow at most two collapsible sidebar levels after the wrapper is removed.
- Preserve page order when a deeper group is flattened.
- Use sentence case for sidebar labels while preserving Released, Product Hub, BetterBoard, Jira, Slack, Confluence, AI, CSP, URL, ID, Framer, Webflow, Aura, Cosmos, Karma, Atlassian, JavaScript, PCI, and Forge.
- Apply H1 32px, H2 22px, H3 18px, H4 16px, body 16px/1.7, sidebar links 13.5px, sidebar groups 12px, on-page navigation 13px, header controls 14px, and captions 12px.
- Keep landing-page display typography separate.
- Do not change article wording, route names, assets, technical identifiers, or product-switcher behavior.

---

## File Structure

- `src/data/sidebar.ts`: owns space filtering plus Hub-only label and hierarchy normalization.
- `tests/unit/spaces.test.mjs`: exercises the normalized sidebar as route middleware consumes it.
- `src/styles/tokens.css`: owns the shared Starlight type tokens.
- `src/styles/starlight.css`: owns role-specific weights, line heights, and sidebar typography.
- `src/components/content/Figure.astro`: maps figure captions to the 12px metadata role.
- `src/components/content/LinkRow.astro`: maps row titles and descriptions to the 16px and 14px content roles.
- `src/components/content/NeutralCallout.astro`: maps callout labels to the 14px utility role.
- `tests/e2e/shell.spec.ts`: verifies real rendered navigation semantics and computed font sizes.

### Task 1: Normalize the Hub sidebar

**Files:**
- Modify: `src/data/sidebar.ts`
- Modify: `tests/unit/spaces.test.mjs`

**Interfaces:**
- Consumes: Starlight sidebar entries with `type`, `label`, and optional `entries`.
- Produces: `filterSidebarForPath<T extends SidebarEntry>(pathname: string, sidebar: T[]): T[]`, returning the Hub wrapper’s normalized children for `/guide/*` and preserving the existing behavior for other spaces.

- [ ] **Step 1: Write the failing normalization test**

Extend `tests/unit/spaces.test.mjs` with a representative Hub tree:

```js
test('unwraps and normalizes Hub navigation to two collapsible levels', () => {
  const sidebar = [
    {
      type: 'group',
      label: 'Hub documentation',
      entries: [
        { type: 'link', label: 'Overview', href: '/guide/' },
        {
          type: 'group',
          label: 'getting-started',
          entries: [
            { type: 'link', label: 'Concepts', href: '/guide/getting-started/concepts/' },
            {
              type: 'group',
              label: 'setup-guide',
              entries: [
                { type: 'link', label: 'Setup Guide', href: '/guide/getting-started/setup-guide/' },
                {
                  type: 'group',
                  label: 'widget',
                  entries: [
                    {
                      type: 'link',
                      label: 'Using Released with Framer',
                      href: '/guide/getting-started/setup-guide/widget/using-released-with-framer/'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'group',
          label: 'product',
          entries: [
            {
              type: 'group',
              label: 'changelog',
              entries: [
                {
                  type: 'group',
                  label: 'settings',
                  entries: [
                    { type: 'link', label: 'AI Settings', href: '/guide/product/changelog/settings/artificial-intelligence/' },
                    { type: 'link', label: 'Jira issue links', href: '/guide/product/changelog/settings/jira-issue-links/' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const result = filterSidebarForPath('/guide/product/changelog/', structuredClone(sidebar));
  const groupDepth = (entries, depth = 0) =>
    Math.max(depth, ...entries.map((entry) =>
      entry.type === 'group' ? groupDepth(entry.entries ?? [], depth + 1) : depth
    ));

  assert.deepEqual(result.map((entry) => entry.label), ['Overview', 'Getting started', 'Product']);
  assert.equal(groupDepth(result), 2);
  assert.deepEqual(
    result[1].entries[1].entries.map((entry) => entry.label),
    ['Setup guide', 'Using Released with Framer']
  );
  assert.deepEqual(
    result[2].entries[0].entries.map((entry) => entry.label),
    ['AI settings', 'Jira issue links']
  );
});
```

This test catches four regressions independently: returning the `Hub documentation` wrapper, retaining a third group, exposing slug labels, and lowercasing protected names.

- [ ] **Step 2: Run the unit test and verify RED**

Run:

```bash
node --test tests/unit/spaces.test.mjs
```

Expected: FAIL because the current function returns the `Hub documentation` wrapper and does not normalize labels or depth.

- [ ] **Step 3: Implement minimal sidebar normalization**

Update `src/data/sidebar.ts` with:

```ts
interface SidebarEntry {
  type: string;
  label?: string;
  entries?: SidebarEntry[];
}

const labelOverrides = new Map([
  ['getting-started', 'Getting started'],
  ['setup-guide', 'Setup guide'],
  ['best-practices', 'Best practices'],
  ['roadmaps-and-ideas', 'Roadmaps & ideas'],
  ['ai-tips', 'AI tips'],
  ['how-tos', 'How-tos'],
  ['product-tour', 'Product tour']
]);

const protectedTerms = new Map([
  ['product hub', 'Product Hub'],
  ['betterboard', 'BetterBoard'],
  ['javascript', 'JavaScript'],
  ['atlassian', 'Atlassian'],
  ['confluence', 'Confluence'],
  ['released', 'Released'],
  ['webflow', 'Webflow'],
  ['framer', 'Framer'],
  ['slack', 'Slack'],
  ['forge', 'Forge'],
  ['cosmos', 'Cosmos'],
  ['karma', 'Karma'],
  ['aura', 'Aura'],
  ['jira', 'Jira'],
  ['csp', 'CSP'],
  ['url', 'URL'],
  ['pci', 'PCI'],
  ['ai', 'AI'],
  ['id', 'ID']
]);

function sentenceCaseLabel(label = ''): string {
  const overridden = labelOverrides.get(label);
  if (overridden) return overridden;

  let result = label.replaceAll('-', ' ').toLocaleLowerCase('en');
  result = result.replace(/^\p{L}/u, (character) => character.toLocaleUpperCase('en'));

  for (const [term, replacement] of protectedTerms) {
    result = result.replace(new RegExp(`\\b${term}\\b`, 'gi'), replacement);
  }

  return result;
}

function normalizeHubEntries<T extends SidebarEntry>(entries: T[], groupDepth = 0): T[] {
  return entries.flatMap((entry) => {
    const normalized = { ...entry, label: sentenceCaseLabel(entry.label) } as T;
    if (entry.type !== 'group') return [normalized];

    const children = normalizeHubEntries((entry.entries ?? []) as T[], groupDepth + 1);
    if (groupDepth >= 2) return children;

    normalized.entries = children;
    return [normalized];
  });
}
```

In `filterSidebarForPath`, find the matching space wrapper as today. For Hub routes, return `normalizeHubEntries(wrapper.entries ?? [])`. For non-Hub spaces, preserve the existing wrapper result.

- [ ] **Step 4: Run the focused unit tests and verify GREEN**

Run:

```bash
node --test tests/unit/spaces.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit the normalization**

```bash
git add src/data/sidebar.ts tests/unit/spaces.test.mjs
git commit -m "feat: normalize hub sidebar hierarchy"
```

### Task 2: Apply and verify the documentation type scale

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/starlight.css`
- Modify: `src/components/content/Figure.astro`
- Modify: `src/components/content/LinkRow.astro`
- Modify: `src/components/content/NeutralCallout.astro`
- Modify: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: Starlight’s `--sl-text-*` and `--sl-line-height` custom properties.
- Produces: one shared documentation type scale inherited by PageTitle, MarkdownContent, sidebar, table of contents, header controls, captions, and metadata.

- [ ] **Step 1: Write failing rendered-shell tests**

Update the active-sidebar test in `tests/e2e/shell.spec.ts` so it scopes the header switcher separately and asserts the sidebar has no `Hub documentation` disclosure:

```ts
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
  await expect(sidebar.getByText('Setup guide', { exact: true })).toBeVisible();
});
```

Add a computed-style test:

```ts
test('the documentation shell uses the compact Switzer type scale', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  const styles = await page.evaluate(() => {
    const read = (selector) => {
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
```

- [ ] **Step 2: Run the shell tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/shell.spec.ts
```

Expected: the hierarchy assertion fails against the redundant wrapper or third group, and the computed-style assertions fail with the current 42px H1, 35px H2, 29px H3, 16px group label, and 14px sidebar link.

- [ ] **Step 3: Implement the type tokens and role-specific styles**

Add to the light-theme `:root` block in `src/styles/tokens.css`:

```css
--sl-text-h1: 2rem;
--sl-text-h2: 1.375rem;
--sl-text-h3: 1.125rem;
--sl-text-h4: 1rem;
--sl-text-h5: 0.9375rem;
--sl-text-body: 1rem;
--sl-text-xs: 0.8125rem;
--sl-text-sm: 0.875rem;
--sl-text-2xs: 0.75rem;
--sl-line-height: 1.7;
```

Add to `src/styles/starlight.css`:

```css
main h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.15;
}

.sl-markdown-content h2 {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.25;
}

.sl-markdown-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
}

.sl-markdown-content h4 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.sidebar-pane .large {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
}

.sidebar-pane a,
.sidebar-pane a.large {
  font-size: 0.84375rem;
  font-weight: 400;
  line-height: 1.4;
}

.sidebar-pane a[aria-current='page'] {
  font-weight: 600;
}

.right-sidebar-panel :where(a) {
  font-size: 0.8125rem;
  line-height: 1.4;
}

header [data-space-switcher] button {
  font-size: 0.875rem;
  line-height: 1.4;
}
```

Replace the remaining content-component literals with the shared roles:

```css
/* Figure.astro */
.content-figure figcaption {
  font-size: var(--sl-text-2xs);
  line-height: 1.4;
}

/* LinkRow.astro */
.link-row__title {
  font-size: var(--sl-text-body);
  line-height: 1.4;
}

.link-row__description {
  font-size: var(--sl-text-sm);
  line-height: 1.5;
}

.link-row__arrow {
  font-size: var(--sl-text-lg);
}

/* NeutralCallout.astro */
.neutral-callout__label {
  font-size: var(--sl-text-sm);
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
node --test tests/unit/spaces.test.mjs
npx playwright test tests/e2e/shell.spec.ts
```

Expected: all focused tests PASS with no console errors.

- [ ] **Step 5: Run proportional regression checks**

Run:

```bash
npm run check
npm run build
node --test tests/build/legacy-routes.test.mjs tests/build/links-and-assets.test.mjs
git diff --check
```

Expected: all commands PASS. The route tests confirm the visual hierarchy change did not alter `/guide/*` output paths.

- [ ] **Step 6: Commit the type scale**

```bash
git add src/styles/tokens.css src/styles/starlight.css src/components/content/Figure.astro src/components/content/LinkRow.astro src/components/content/NeutralCallout.astro tests/e2e/shell.spec.ts
git commit -m "feat: refine documentation typography"
```

## Final browser verification

- [ ] Reload `/guide/getting-started/setup-guide/embedding-the-feedback-form/` in the in-app browser.
- [ ] Confirm the header still exposes the Hub documentation dropdown.
- [ ] Confirm the sidebar begins with Overview and the existing Hub sections, with no Hub documentation disclosure.
- [ ] Confirm only two nested disclosure levels can appear.
- [ ] Confirm sentence-case labels and protected product names.
- [ ] Confirm the compact type scale at desktop and 390px mobile width.
- [ ] Capture a final screenshot for the handoff.
