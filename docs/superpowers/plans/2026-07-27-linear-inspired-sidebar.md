# Linear-inspired Hub Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generated multi-level Hub sidebar with the approved Shallow Linear navigation: one collapsed-by-default category level, direct article links, compact Switzer typography, and active-branch expansion without changing any documentation URL.

**Architecture:** Keep Starlight’s generated route data and semantic `details` controls, but normalize Hub-only entries in `src/data/sidebar.ts` before render. Promote selected generated folders to top-level categories, flatten the remaining folder wrappers into ordered article links, and set every category’s `collapsed` flag. Apply the approved visual rhythm through narrowly scoped CSS and prove the resulting data, interaction, typography, mobile behavior, and legacy routes independently.

**Tech Stack:** Astro 7.1.3, Starlight 0.41.4, TypeScript 6, Node test runner, Playwright 1.62, CSS

## Global Constraints

- Preserve all source files, slugs, canonical URLs, links, fragments, redirects, and `/guide/product/...` routes.
- Apply the new information architecture only to Hub navigation; BetterBoard and Partner sidebar data remain unchanged.
- Keep exactly one collapsible category level and direct article links beneath it.
- On `/guide/`, every category is collapsed; on an article route, Starlight opens the category containing the current page.
- Keep native `details` and `summary` keyboard and screen-reader behavior.
- Keep all labels in sentence case and preserve protected product names and acronyms.
- Use Switzer at 13px/400 for collapsed categories, 13px/500 for open categories, 12.5px/400 for article links, and 12.5px/600 for the current article.
- Keep a flat neutral treatment: no connector lines, status dots, decorative bullets, generic icons, panels, or filled category backgrounds.
- Preserve the transparent 2px inset marker for the current article.
- Preserve the 160ms disclosure/chevron and 120ms opacity animation, with zero-duration reduced motion.
- Keep unrelated migration work in the dirty worktree untouched; stage only files named by each task.

---

## File Structure

- `src/data/sidebar.ts` — owns Hub-only label normalization, category promotion, wrapper flattening, duplicate overview removal, and default collapsed state.
- `tests/unit/spaces.test.mjs` — proves the exact normalized category order, one-level depth, collapsed flags, flattened article order, and unchanged non-Hub behavior.
- `src/styles/starlight.css` — owns only the rendered sidebar’s approved type scale, spacing, color states, current-page marker, and existing motion.
- `tests/e2e/shell.spec.ts` — proves default/active disclosure behavior, rendered hierarchy, keyboard interaction, typography, reduced motion, current-page styling, and mobile parity.
- `tests/build/legacy-routes.test.mjs` — existing verification that all 84 legacy Hub routes remain available.
- `tests/build/links-and-assets.test.mjs` — existing verification that built links, fragments, media, canonicals, and sitemap output resolve.

---

### Task 1: Normalize Hub navigation into shallow collapsed categories

**Files:**
- Modify: `tests/unit/spaces.test.mjs:39-145`
- Modify: `src/data/sidebar.ts:3-106`

**Interfaces:**
- Consumes: Starlight `SidebarEntry` objects with `type`, `label`, `href`, `entries`, and `collapsed`.
- Produces: `filterSidebarForPath<T extends SidebarEntry>(pathname: string, sidebar: T[]): T[]`, returning Hub categories with `collapsed: true` and link-only `entries`.
- Produces: Top-level Hub order `Overview`, `Getting started`, `Best practices`, product categories, `AI tips`, `Troubleshooting`, `How-tos`, and `Product tour`.

- [ ] **Step 1: Expand the unit fixture to represent every structural transformation**

Extend the existing Hub fixture in `tests/unit/spaces.test.mjs` with:

```js
{
  type: 'group',
  label: 'best-practices',
  entries: [
    {
      type: 'link',
      label: 'Best practices',
      href: '/guide/getting-started/best-practices/'
    },
    {
      type: 'link',
      label: 'Customer communication',
      href: '/guide/getting-started/best-practices/customer-communication/'
    }
  ]
}
```

Place that group after `setup-guide` inside `getting-started`. Add these root groups after the existing `product` fixture:

```js
{
  type: 'group',
  label: 'resources',
  entries: [
    {
      type: 'group',
      label: 'ai-tips',
      entries: [
        {
          type: 'link',
          label: 'Create output in other languages',
          href: '/guide/resources/ai-tips/create-output-in-other-languages/'
        }
      ]
    },
    {
      type: 'group',
      label: 'troubleshooting',
      entries: [
        {
          type: 'link',
          label: 'Embeds',
          href: '/guide/resources/troubleshooting/embeds/'
        }
      ]
    },
    {
      type: 'group',
      label: 'how-tos',
      entries: [
        {
          type: 'link',
          label: 'Finding the channel/form ID',
          href: '/guide/resources/how-tos/finding-the-channel-id/'
        }
      ]
    }
  ]
},
{
  type: 'group',
  label: 'product-tour',
  entries: [
    {
      type: 'group',
      label: 'settings',
      entries: [
        {
          type: 'link',
          label: 'Widget configuration',
          href: '/guide/product-tour/settings/widget-configuration/'
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Replace the old two-level assertions with the approved shallow contract**

Rename the test to `normalizes Hub navigation into one collapsed category level` and replace its final assertions with:

```js
assert.deepEqual(
  result.map((entry) => entry.label),
  [
    'Overview',
    'Getting started',
    'Best practices',
    'Administration',
    'Changelog',
    'AI tips',
    'Troubleshooting',
    'How-tos',
    'Product tour'
  ]
);
assert.equal(groupDepth(result), 1);
assert.ok(
  result
    .filter((entry) => entry.type === 'group')
    .every((entry) => entry.collapsed === true)
);
assert.ok(
  result
    .filter((entry) => entry.type === 'group')
    .every((entry) => entry.entries.every((child) => child.type === 'link'))
);
assert.deepEqual(
  result.find((entry) => entry.label === 'Getting started').entries.map((entry) => entry.label),
  ['Concepts', 'Using Released with Framer']
);
assert.deepEqual(
  result.find((entry) => entry.label === 'Best practices').entries.map((entry) => entry.label),
  ['Customer communication']
);
assert.deepEqual(
  result.find((entry) => entry.label === 'Administration').entries.map((entry) => entry.label),
  ['Product Hub']
);
assert.deepEqual(
  result.find((entry) => entry.label === 'Changelog').entries.map((entry) => entry.label),
  ['AI settings', 'Jira issue links']
);
assert.deepEqual(
  result.find((entry) => entry.label === 'Product tour').entries.map((entry) => entry.label),
  ['Widget configuration']
);
```

These assertions fail if a removed wrapper returns, a category is open by default, a nested group remains, or article order changes.

- [ ] **Step 3: Run the unit test and verify the expected failure**

Run:

```bash
node --test tests/unit/spaces.test.mjs
```

Expected: FAIL because the current output still contains two group levels, retains `Resources`, and does not set `collapsed: true`.

- [ ] **Step 4: Extend the sidebar entry type and declare the structural rules**

In `src/data/sidebar.ts`, replace the interface and add the rule sets after `protectedTerms`:

```ts
interface SidebarEntry {
  type: string;
  label?: string;
  href?: string;
  collapsed?: boolean;
  entries?: SidebarEntry[];
}

const rootWrappersToPromote = new Set(['Product', 'Resources']);
const childCategoriesToPromote = new Set(['Best practices']);
```

- [ ] **Step 5: Replace depth-based normalization with link flattening and category promotion**

Keep `sentenceCaseLabel`, `canonicalLabel`, and `removeDuplicateFolderOverview`. Replace `normalizeHubEntries` with these helpers:

```ts
function normalizeLink<T extends SidebarEntry>(entry: T): T {
  return { ...entry, label: sentenceCaseLabel(entry.label) } as T;
}

function flattenArticleLinks<T extends SidebarEntry>(entries: T[]): T[] {
  return entries.flatMap((entry) => {
    if (entry.type !== 'group') return [normalizeLink(entry)];

    const label = sentenceCaseLabel(entry.label);
    const children = flattenArticleLinks((entry.entries ?? []) as T[]);
    return removeDuplicateFolderOverview(label, children);
  });
}

function createCategory<T extends SidebarEntry>(
  entry: T,
  entries: T[] = (entry.entries ?? []) as T[]
): T {
  const label = sentenceCaseLabel(entry.label);
  const links = removeDuplicateFolderOverview(
    label,
    flattenArticleLinks(entries as T[])
  );

  return {
    ...entry,
    label,
    collapsed: true,
    entries: links
  } as T;
}

function normalizeRootGroup<T extends SidebarEntry>(entry: T): T[] {
  const label = sentenceCaseLabel(entry.label);
  const children = (entry.entries ?? []) as T[];

  if (rootWrappersToPromote.has(label)) {
    return children.flatMap((child) =>
      child.type === 'group' ? [createCategory(child)] : [normalizeLink(child)]
    );
  }

  const retainedChildren: T[] = [];
  const promotedCategories: T[] = [];

  for (const child of children) {
    const childLabel = sentenceCaseLabel(child.label);
    if (child.type === 'group' && childCategoriesToPromote.has(childLabel)) {
      promotedCategories.push(createCategory(child));
    } else {
      retainedChildren.push(child);
    }
  }

  return [
    createCategory({ ...entry, label } as T, retainedChildren),
    ...promotedCategories
  ];
}

function normalizeHubEntries<T extends SidebarEntry>(entries: T[]): T[] {
  return entries.flatMap((entry) =>
    entry.type === 'group' ? normalizeRootGroup(entry) : [normalizeLink(entry)]
  );
}
```

The `createCategory` call removes duplicate category overview links after flattening each folder, so differently named links such as `Product Hub` remain.

- [ ] **Step 6: Run focused and full unit suites**

Run:

```bash
node --test tests/unit/spaces.test.mjs
npm run test:unit
```

Expected: the focused test reports 4 passing tests; the full unit suite reports zero failures.

- [ ] **Step 7: Commit the normalized navigation data**

```bash
git add src/data/sidebar.ts tests/unit/spaces.test.mjs
git commit -m "feat: flatten hub sidebar categories"
```

---

### Task 2: Apply the Linear-inspired disclosure behavior and visual rhythm

**Files:**
- Modify: `tests/e2e/shell.spec.ts:65-238`
- Modify: `src/styles/starlight.css:51-139`

**Interfaces:**
- Consumes: Task 1’s Hub output, where every `group` is top-level, has `collapsed: true`, and contains links only.
- Produces: A rendered sidebar with collapsed overview state, active-category expansion, 13px category text, 12.5px article text, 34px category rows, 30px article rows, existing active marker, and reduced-motion-safe disclosure animation.

- [ ] **Step 1: Rewrite the hierarchy test around the one-level disclosure contract**

Replace `the Hub sidebar starts below the space switcher and has at most two disclosure levels` with:

```ts
test('the Hub sidebar is shallow and opens only the active category on initial load', async ({ page }) => {
  await page.goto('/guide/');

  const sidebar = page.locator('#starlight__sidebar');
  await expect(sidebar.locator('details')).toHaveCount(12);
  await expect(sidebar.locator('details[open]')).toHaveCount(0);

  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

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
  await expect(sidebar.getByText('Settings', { exact: true })).toHaveCount(0);
  await expect(
    sidebar.locator('.top-level > li > details > summary .large').getByText('Best practices', {
      exact: true
    })
  ).toBeVisible();
  await expect(
    sidebar.locator('.top-level > li > details > summary .large').getByText('AI tips', {
      exact: true
    })
  ).toBeVisible();
});
```

- [ ] **Step 2: Add an interaction test proving categories are independent disclosures**

Add:

```ts
test('Hub categories can be opened independently after the active branch initializes', async ({ page }) => {
  await page.goto('/guide/getting-started/setup-guide/embedding-the-feedback-form/');

  const sidebar = page.locator('#starlight__sidebar');
  const administration = sidebar
    .locator('summary')
    .filter({ hasText: 'Administration' });

  await administration.focus();
  await administration.press('Enter');

  await expect(sidebar.locator('details[open]')).toHaveCount(2);
  await expect(administration.locator('..')).toHaveAttribute('open', '');
  await expect(
    sidebar.locator('details[open] > summary').getByText('Getting started', { exact: true })
  ).toBeVisible();
});
```

- [ ] **Step 3: Retarget animation and typography checks to the shallow structure**

In the existing animation test, replace the `Setup guide` locator with:

```ts
const gettingStarted = page
  .locator('#starlight__sidebar summary')
  .filter({ hasText: 'Getting started' })
  .first()
  .locator('..');
```

Read `::details-content` from `gettingStarted` in both motion modes.

In `the documentation shell uses the compact Switzer type scale`, replace the sidebar fields with:

```ts
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
```

Replace the old `firstLevelGroup`, `secondLevelGroup`, and `sidebarLink` expectations with:

```ts
collapsedCategory: { fontSize: '13px', fontWeight: '400', lineHeight: '18.2px' },
openCategory: { fontSize: '13px', fontWeight: '500', lineHeight: '18.2px' },
overviewLink: { fontSize: '13px', fontWeight: '400', lineHeight: '18.2px' },
articleLink: { fontSize: '12.5px', fontWeight: '400', lineHeight: '17.5px' },
currentArticle: { fontSize: '12.5px', fontWeight: '600', lineHeight: '17.5px' },
```

Keep all article, table-of-contents, header, callout, and caption expectations unchanged.

- [ ] **Step 4: Extend the mobile test with collapsed and active-category assertions**

After opening the mobile menu on `/guide/`, add:

```ts
const mobileSidebar = page.locator('#starlight__sidebar');
await expect(mobileSidebar.locator('details[open]')).toHaveCount(0);

await page.goto('/guide/resources/how-tos/embed-the-portal-in-a-forge-app/');
await page.locator('starlight-menu-button button').click();
await expect(mobileSidebar.locator('details[open]')).toHaveCount(1);
await expect(
  mobileSidebar.locator('details[open] > summary').getByText('How-tos', { exact: true })
).toBeVisible();
```

- [ ] **Step 5: Run the shell tests and verify the expected failures**

Run:

```bash
npx playwright test tests/e2e/shell.spec.ts
```

Expected: FAIL because the current category typography is 14px/600, article typography is 13.5px, top-level spacing remains larger, and the existing E2E locators still reflect two disclosure levels.

- [ ] **Step 6: Replace the sidebar typography and spacing rules**

In `src/styles/starlight.css`, replace the current `.large`, group, link, and nested-list declarations with:

```css
.sidebar-pane .large,
.sidebar-pane .top-level > li > details > summary .large,
.sidebar-pane .top-level > li > a.large {
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.4;
}

.sidebar-pane .top-level > li + li {
  margin-top: 0;
}

.sidebar-pane .top-level > li > details > summary,
.sidebar-pane .top-level > li > a {
  min-height: 34px;
}

.sidebar-pane .top-level > li > details > summary {
  padding-block: 0;
}

.sidebar-pane .top-level > li > details[open] > summary .large {
  color: var(--released-ink);
  font-weight: 500;
}

.sidebar-pane .top-level > li > details > ul {
  padding-block-end: 0.5rem;
}

.sidebar-pane .top-level > li > details > ul > li {
  margin-inline-start: 0;
  border-inline-start: 0;
  padding-inline-start: 1rem;
}

.sidebar-pane .top-level > li > details > ul a {
  display: flex;
  min-height: 30px;
  align-items: center;
  padding-block: 0;
  font-size: 0.78125rem;
  font-weight: 400;
  line-height: 1.4;
}

.sidebar-pane .top-level > li > a {
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.4;
}

.sidebar-pane details > summary .caret {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--released-ink-muted);
}
```

Keep the existing `::details-content`, active-link, desktop full-height sidebar, and reduced-motion rules. The active-link rule continues to override article weight to 600 and keeps the transparent inset marker.

- [ ] **Step 7: Run the focused browser suite and inspect desktop and mobile**

Run:

```bash
npx playwright test tests/e2e/shell.spec.ts
```

Expected: all shell tests pass.

Inspect these routes in the local preview:

```text
/guide/
/guide/getting-started/setup-guide/embedding-the-feedback-form/
/guide/product/changelog/settings/artificial-intelligence/
/guide/resources/how-tos/embed-the-portal-in-a-forge-app/
```

At 1440px, confirm the overview is fully collapsed, only the active category opens on articles, labels do not wrap unexpectedly, and long categories remain scrollable. At 390×844, confirm the same state and readable touch targets.

- [ ] **Step 8: Run complete verification**

Run each command separately:

```bash
npm run check
npm run test:unit
npm run build
node --test tests/build/legacy-routes.test.mjs tests/build/links-and-assets.test.mjs
npx playwright test tests/e2e/shell.spec.ts
git diff --check
```

Expected:

- Astro check: zero errors.
- Unit tests: zero failures.
- Production build: 96 pages.
- Legacy/build checks: all 84 legacy Hub routes and all built links, fragments, media, canonicals, and sitemap entries pass.
- Shell browser suite: zero failures on desktop and mobile coverage.
- Diff check: no whitespace errors.

Record existing non-blocking output separately rather than fixing it in this task: the three `z` deprecation hints and Expressive Code’s `markup`/`url` fallback warnings.

- [ ] **Step 9: Commit the approved visual behavior**

```bash
git add src/styles/starlight.css tests/e2e/shell.spec.ts
git commit -m "feat: adopt shallow linear sidebar"
```

Confirm the commit includes only these two files and that unrelated migration changes remain unstaged.
