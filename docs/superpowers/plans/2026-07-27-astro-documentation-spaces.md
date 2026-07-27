# Astro Documentation Spaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GitBook site with one branded Astro + Starlight project containing Hub, BetterBoard, and Partner documentation spaces while preserving every existing Hub `/guide/*` URL.

**Architecture:** One static Astro build owns all three spaces. Starlight supplies the article shell, content collections, mobile navigation, table of contents, metadata, and Pagefind integration. Small component overrides add the Released identity, a left-aligned product-space switcher, space-filtered sidebars, and scoped search. Deterministic migration scripts convert the existing GitBook source and the BetterBoard Astro source into committed MDX; build-time tests validate routes, links, assets, and search metadata.

**Tech Stack:** Node 22, npm 10, Astro 7.1.3, Starlight 0.41.4, TypeScript 6.0.3, Pagefind 1.5.2, Playwright 1.62.0, Node test runner, Cheerio 1.2.0, Turndown 7.2.4, gray-matter 4.0.3, fast-glob 3.3.3.

## Global Constraints

- Work only on `feat/astro-documentation-spaces`.
- Keep the current GitBook Markdown and media unchanged until the generated Hub output has passed content comparison and route validation.
- Preserve every route listed in the current `SUMMARY.md` under `/guide/*`.
- Keep customer-facing naming separate from identifiers, URLs, code, configuration keys, API values, asset paths, and historically correct uses of “Released.”
- Use Switzer and the Released website’s semantic design tokens.
- Do not use violet as a generic highlight.
- Never place status dots before product names, page titles, labels, or words. Use actual product logos or a meaningful product mark.
- Keep callouts neutral and do not add colored top or left edge bars.
- Make the article sidebar surface extend through the viewport/document shell.
- Keep root overview rows to the article content width (`max-width: 960px`), not the full browser width.
- Do not merge, deploy, change DNS, or switch `docs.released.so` in this plan.
- Run `git status --short` and `git branch --show-current` before every commit. Stage only the files listed by the current task.

## Source Inventory

| Source | Location | Destination |
| --- | --- | --- |
| Hub GitBook navigation | `SUMMARY.md` | `src/content/docs/guide/**` and `tests/fixtures/legacy-hub-routes.json` |
| Hub GitBook content | root `README.md`, `getting-started/**`, `product/**`, `resources/**` | `src/content/docs/guide/**` |
| Hub GitBook media | `.gitbook/assets/**` and media referenced by source pages | `public/media/hub/**` |
| BetterBoard docs | `/Users/jschumacher/Development/Released/betterboard-website/src/pages/docs/**/index.astro` | `src/content/docs/betterboard/**` |
| BetterBoard docs media | `/Users/jschumacher/Development/Released/betterboard-website/public/images/docs/**` | `public/media/betterboard/**` |
| Released type and brand assets | `/Users/jschumacher/Development/Released/released-website/public/fonts/**`, `public/images/brands/logo-released-black.svg`, `public/favicon.svg` | `public/fonts/**`, `public/brand/**`, `public/favicon.svg` |
| Released design tokens | `/Users/jschumacher/Development/Released/released-website/src/styles/global.css` | `src/styles/tokens.css` |
| Approved design | `docs/superpowers/specs/2026-07-27-astro-documentation-spaces-design.md` | implementation acceptance criteria |

The current repository contains 91 Markdown source files. `SUMMARY.md` contains 84 local documentation destinations, and `.gitbook/assets/` contains 149 files. The route gate protects all 84 listed destinations; the migration report separately accounts for all 91 Markdown files so unlisted source pages cannot disappear silently.

## BetterBoard Route Map

The migration uses this explicit, committed mapping:

| Source slug | Destination |
| --- | --- |
| `overview` | `/betterboard/start/overview/` |
| `installation` | `/betterboard/start/installation/` |
| `quick-start` | `/betterboard/start/quick-start/` |
| `faq` | `/betterboard/start/faq/` |
| `creating-managing-boards` | `/betterboard/board-setup/creating-managing-boards/` |
| `multi-space-boards` | `/betterboard/board-setup/multi-space-boards/` |
| `global-board-directory` | `/betterboard/board-setup/global-board-directory/` |
| `board-visibility` | `/betterboard/board-setup/board-visibility/` |
| `columns-grouping` | `/betterboard/shape-the-board/columns-grouping/` |
| `status-mapping` | `/betterboard/shape-the-board/status-mapping/` |
| `display-fields` | `/betterboard/shape-the-board/display-fields/` |
| `field-types` | `/betterboard/shape-the-board/field-types/` |
| `card-colors` | `/betterboard/shape-the-board/card-colors/` |
| `filters-refinement` | `/betterboard/work-faster/filters-refinement/` |
| `filter-operators` | `/betterboard/work-faster/filter-operators/` |
| `sorting-ordering` | `/betterboard/work-faster/sorting-ordering/` |
| `drag-and-drop` | `/betterboard/work-faster/drag-and-drop/` |
| `inline-editing` | `/betterboard/work-faster/inline-editing/` |
| `sprint-management` | `/betterboard/work-faster/sprint-management/` |
| `keyboard-shortcuts` | `/betterboard/work-faster/keyboard-shortcuts/` |

`/betterboard/` is a new authored landing page. The source `/docs/` index supplies its descriptions and section labels but does not need an old-URL redirect.

---

### Task 1: Scaffold the Astro project and verification harness

**Files:**

- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/content.config.ts`
- Create: `src/env.d.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/scaffold.test.mjs`
- Create: `src/content/docs/betterboard/index.md`
- Modify: `.gitignore`

**Produced interfaces:**

- `npm run dev` starts the Astro development server.
- `npm run build` produces `dist/` and a Pagefind index.
- `npm run check` runs Astro type/content checks.
- `npm run test:unit` runs Node unit tests.
- `npm run test:build` rebuilds before build-output assertions.
- `npm run test:e2e` runs Playwright against a production preview.
- `npm test` runs check, unit, build-output, and E2E verification in that order.

- [ ] **Step 1: Write the failing scaffold test**

Create `tests/unit/scaffold.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the project exposes the required verification commands', async () => {
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));
  for (const script of ['dev', 'build', 'check', 'test:unit', 'test:build', 'test:e2e', 'test']) {
    assert.equal(typeof pkg.scripts[script], 'string', `missing npm script: ${script}`);
  }
});
```

- [ ] **Step 2: Run the test and confirm the expected failure**

Run:

```bash
node --test tests/unit/scaffold.test.mjs
```

Expected: failure with `ENOENT` for `package.json`.

- [ ] **Step 3: Add the pinned project manifest**

Create `package.json` with:

```json
{
  "name": "released-documentation",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0",
    "npm": ">=9.6.5"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test:unit": "node --test tests/unit/*.test.mjs",
    "test:build": "npm run build && node --test tests/build/*.test.mjs",
    "test:e2e": "playwright test",
    "test": "npm run check && npm run test:unit && npm run test:build && npm run test:e2e"
  },
  "dependencies": {
    "@astrojs/starlight": "0.41.4",
    "astro": "7.1.3"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.9",
    "@playwright/test": "1.62.0",
    "@types/turndown": "5.0.6",
    "cheerio": "1.2.0",
    "fast-glob": "3.3.3",
    "gray-matter": "4.0.3",
    "pagefind": "1.5.2",
    "turndown": "7.2.4",
    "typescript": "6.0.3"
  }
}
```

- [ ] **Step 4: Add the smallest valid Starlight configuration**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.released.so',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Released documentation',
      customCss: ['./src/styles/tokens.css', './src/styles/starlight.css'],
      routeMiddleware: './src/route-data.ts',
      social: [{ icon: 'external', label: 'Released', href: 'https://released.so' }],
      sidebar: []
    })
  ]
});
```

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      space: z.enum(['hub', 'betterboard', 'partners'])
    })
  })
});

export const collections = { docs };
```

Create `src/env.d.ts` with `/// <reference types="astro/client" />`, extend `astro/tsconfigs/strict` in `tsconfig.json`, and configure Playwright to start `npm run preview -- --host 127.0.0.1 --port 4321` after `npm run build`.

- [ ] **Step 5: Install dependencies and generate the lockfile**

Run:

```bash
npm install
npx playwright install chromium
```

Expected: `package-lock.json` exists, npm reports no resolution failure, and Chromium installation succeeds.

- [ ] **Step 6: Make the initial content shell buildable**

Create:

- `src/styles/tokens.css`
- `src/styles/starlight.css`
- `src/route-data.ts`
- `src/content/docs/guide/index.md`
- `src/content/docs/betterboard/index.md`

Use minimal valid contents. The temporary Hub page frontmatter must contain:

```yaml
---
title: Hub documentation
description: Feedback, roadmaps, and product updates.
space: hub
---
```

Do not copy the final visual styles into this task.

The temporary BetterBoard landing must use final customer-facing copy so the
space switcher and scoped-search tasks have a valid destination before the
full migration:

```yaml
---
title: BetterBoard documentation
description: Build and shape clearer Jira boards.
space: betterboard
---

BetterBoard documentation is being organized into start, board setup,
board-shaping, and faster-work guides.
```

Task 9 replaces this body with the migrated grouped overview.

- [ ] **Step 7: Run the scaffold checks**

Run:

```bash
npm run test:unit
npm run check
npm run build
```

Expected: all three commands exit 0 and both `dist/guide/index.html` and
`dist/betterboard/index.html` exist.

- [ ] **Step 8: Commit the scaffold**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json playwright.config.ts src/content.config.ts src/env.d.ts src/route-data.ts src/styles/tokens.css src/styles/starlight.css src/content/docs/guide/index.md src/content/docs/betterboard/index.md tests/unit/scaffold.test.mjs .gitignore
git commit -m "chore: scaffold Astro documentation project"
```

---

### Task 2: Define spaces, route ownership, and space-filtered navigation

**Files:**

- Create: `src/data/spaces.ts`
- Create: `src/components/ProductLogo.astro`
- Modify: `astro.config.mjs`
- Modify: `src/route-data.ts`
- Create: `tests/unit/spaces.test.mjs`

**Consumed interface:** Starlight route middleware receives the generated `starlightRoute` for a page.

**Produced interfaces:**

```ts
export type SpaceId = 'hub' | 'betterboard' | 'partners';

export interface DocumentationSpace {
  id: SpaceId;
  name: string;
  shortName: string;
  description: string;
  href: string;
  available: boolean;
  searchIndexed: boolean;
}

export const spaces: readonly DocumentationSpace[];
export function getSpaceFromPath(pathname: string): SpaceId | 'all';
export function getSpace(id: SpaceId): DocumentationSpace;
```

- [ ] **Step 1: Write failing path ownership tests**

Create `tests/unit/spaces.test.mjs` with assertions for:

```js
assert.equal(getSpaceFromPath('/'), 'all');
assert.equal(getSpaceFromPath('/guide/'), 'hub');
assert.equal(getSpaceFromPath('/guide/product/changelog/'), 'hub');
assert.equal(getSpaceFromPath('/betterboard/start/quick-start/'), 'betterboard');
assert.equal(getSpaceFromPath('/partners/'), 'partners');
assert.equal(getSpace('partners').available, false);
```

- [ ] **Step 2: Confirm the module does not exist**

Run:

```bash
node --test tests/unit/spaces.test.mjs
```

Expected: failure with `ERR_MODULE_NOT_FOUND` for `src/data/spaces.ts`.

- [ ] **Step 3: Implement the space registry**

In `src/data/spaces.ts`, make `spaces` the sole source of UI labels and destinations:

```ts
export const spaces = [
  {
    id: 'hub',
    name: 'Hub documentation',
    shortName: 'Hub',
    description: 'Feedback, roadmaps, and product updates.',
    href: '/guide/',
    available: true,
    searchIndexed: true
  },
  {
    id: 'betterboard',
    name: 'BetterBoard documentation',
    shortName: 'BetterBoard',
    description: 'Build and shape clearer Jira boards.',
    href: '/betterboard/',
    available: true,
    searchIndexed: true
  },
  {
    id: 'partners',
    name: 'Partner documentation',
    shortName: 'Partners',
    description: 'Guidance and resources for partners.',
    href: '/partners/',
    available: false,
    searchIndexed: false
  }
] as const satisfies readonly DocumentationSpace[];
```

Use prefix tests that cannot misclassify `/guidebook/` as Hub.

- [ ] **Step 4: Configure all navigation groups**

Update `astro.config.mjs` with three labeled top-level sidebar groups:

```js
sidebar: [
  { label: 'Hub documentation', autogenerate: { directory: 'guide' } },
  { label: 'BetterBoard documentation', autogenerate: { directory: 'betterboard' } },
  { label: 'Partner documentation', autogenerate: { directory: 'partners' } }
]
```

In `src/route-data.ts`, use `defineRouteMiddleware` from `@astrojs/starlight/route-data` to retain only the group owned by the current pathname. Root and Partner splash pages receive an empty sidebar. Preserve the children and Starlight-generated pagination data of the retained group.

- [ ] **Step 5: Add logo rendering without status dots**

`ProductLogo.astro` accepts:

```ts
interface Props {
  space: SpaceId;
  size?: 16 | 20 | 24 | 32;
  decorative?: boolean;
}
```

Render the Hub and BetterBoard product marks as local SVG paths. Render Partner as a semantic chain/link mark. The mark has an accessible label only when `decorative` is false. Do not render a colored circle, pseudo-element dot, or availability indicator.

- [ ] **Step 6: Run unit and type checks**

```bash
npm run test:unit
npm run check
```

Expected: all assertions pass and Astro reports no type errors.

- [ ] **Step 7: Commit the space model**

```bash
git add astro.config.mjs src/data/spaces.ts src/components/ProductLogo.astro src/route-data.ts tests/unit/spaces.test.mjs
git commit -m "feat: model documentation spaces"
```

---

### Task 3: Apply the Released visual system and documentation shell

**Files:**

- Create: `public/fonts/switzer-400.woff2`
- Create: `public/fonts/switzer-500.woff2`
- Create: `public/fonts/switzer-600.woff2`
- Create: `public/fonts/switzer-700.woff2`
- Create: `public/brand/released.svg`
- Create: `public/brand/betterboard.svg`
- Create: `public/favicon.svg`
- Create: `src/components/ReleasedIdentity.astro`
- Create: `src/components/SpaceSwitcher.astro`
- Create: `src/components/starlight/SiteTitle.astro`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/starlight.css`
- Modify: `astro.config.mjs`
- Create: `tests/e2e/shell.spec.ts`

**Produced component contract:**

```ts
// SpaceSwitcher.astro
interface Props {
  activeSpace: SpaceId | 'all';
}
```

The control is left-aligned after the Released identity. It exposes a button with `aria-haspopup="menu"`, the active space mark/name, and a chevron. The menu contains all three spaces, uses a checkmark for the active entry, closes on Escape/outside click, and returns focus to its trigger.

- [ ] **Step 1: Write failing shell interaction tests**

Create `tests/e2e/shell.spec.ts` with tests that:

- load `/guide/`
- assert the Released identity precedes the switcher in the header
- assert the switcher’s text is `Hub documentation`
- open it with Enter
- navigate to `BetterBoard documentation` with ArrowDown
- press Escape and verify focus returns to the trigger
- reopen and follow the BetterBoard link
- assert no `.status-dot`, `[data-status-dot]`, or text-leading decorative dot exists
- verify at 390px that the switcher and mobile menu remain operable

- [ ] **Step 2: Confirm the tests fail against the scaffold**

Run:

```bash
npm run build
npx playwright test tests/e2e/shell.spec.ts
```

Expected: failures because the custom identity and switcher are absent.

- [ ] **Step 3: Copy approved fonts and brand assets**

Run:

```bash
cp /Users/jschumacher/Development/Released/released-website/public/fonts/switzer-400.woff2 public/fonts/switzer-400.woff2
cp /Users/jschumacher/Development/Released/released-website/public/fonts/switzer-500.woff2 public/fonts/switzer-500.woff2
cp /Users/jschumacher/Development/Released/released-website/public/fonts/switzer-600.woff2 public/fonts/switzer-600.woff2
cp /Users/jschumacher/Development/Released/released-website/public/fonts/switzer-700.woff2 public/fonts/switzer-700.woff2
cp /Users/jschumacher/Development/Released/released-website/public/images/brands/logo-released-black.svg public/brand/released.svg
cp /Users/jschumacher/Development/Released/released-website/public/favicon.svg public/favicon.svg
cp /Users/jschumacher/Development/Released/betterboard-website/public/favicon.svg public/brand/betterboard.svg
```

Adapt `betterboard.svg` so its mark uses `currentColor` and has no enclosing black tile. Preserve the three-part BetterBoard geometry.

- [ ] **Step 4: Implement semantic design tokens**

In `src/styles/tokens.css`, define Switzer faces and these variables:

```css
:root {
  --released-bg: #fcfcfc;
  --released-bg-raised: #f7f7f9;
  --released-bg-card: #f0f0ee;
  --released-ink: #0d0d0d;
  --released-ink-soft: #3f4145;
  --released-ink-muted: #5d6065;
  --released-line: #e8e8e5;
  --released-line-strong: #d6d6d2;
  --released-radius-sm: 8px;
  --released-radius-md: 12px;
  --released-radius-lg: 20px;
  --released-radius-xl: 28px;
  --released-radius-pill: 999px;
  --released-content: 960px;
  --released-shell: 1200px;
  --released-gutter: clamp(20px, 4vw, 40px);
}

:root[data-theme='dark'] {
  --released-bg: #0f1115;
  --released-bg-raised: #16191f;
  --released-bg-card: #1c2027;
  --released-ink: #f4f5f7;
  --released-ink-soft: #c5c9d0;
  --released-ink-muted: #9298a3;
  --released-line: #292e37;
  --released-line-strong: #3a414d;
}
```

Map Starlight variables to these semantic tokens. Focus rings use a high-contrast ink/line combination, not violet.

- [ ] **Step 5: Override only the site-title region**

Register:

```js
components: {
  SiteTitle: './src/components/starlight/SiteTitle.astro'
}
```

`SiteTitle.astro` reads `Astro.locals.starlightRoute`, derives the active space from the pathname, and renders:

```text
[Released logo + Released] | [product logo + active documentation name + chevron]
```

Retain Starlight’s search, theme selector, mobile navigation, and header semantics rather than rebuilding the entire header.

- [ ] **Step 6: Implement switcher keyboard and focus behavior**

Use an Astro component with a small inline module script. Required behavior:

- click or Enter/Space toggles
- ArrowDown opens and focuses the first enabled menu item
- ArrowUp opens and focuses the final item
- ArrowUp/ArrowDown cycle through items
- Home/End jump to first/final item
- Escape closes and restores trigger focus
- Tab closes without trapping focus
- outside pointer interaction closes
- active item uses `aria-current="page"` and a checkmark
- Partner remains a valid link to `/partners/`; “Coming soon” is descriptive text, not a dot

- [ ] **Step 7: Make the sidebar surface full height**

In `src/styles/starlight.css`, make the sidebar container:

```css
@media (min-width: 50rem) {
  .sidebar-pane {
    min-height: calc(100vh - var(--sl-nav-height));
    align-self: stretch;
    border-inline-end: 1px solid var(--released-line);
    background: var(--released-bg);
  }
}
```

Adjust the selector only if the rendered Starlight DOM uses a more specific stable class. Do not use a fixed pixel height.

- [ ] **Step 8: Run the focused checks**

```bash
npm run check
npm run build
npx playwright test tests/e2e/shell.spec.ts
```

Expected: all pass at desktop and mobile viewports.

- [ ] **Step 9: Commit the branded shell**

```bash
git add public/fonts public/brand public/favicon.svg astro.config.mjs src/components/ReleasedIdentity.astro src/components/SpaceSwitcher.astro src/components/starlight/SiteTitle.astro src/styles/tokens.css src/styles/starlight.css tests/e2e/shell.spec.ts
git commit -m "feat: add Released documentation shell"
```

---

### Task 4: Build the content-width documentation overview and Partner page

**Files:**

- Create: `src/layouts/DocumentationLanding.astro`
- Create: `src/components/DocumentationOverview.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/partners/index.astro`
- Create: `tests/e2e/landing-pages.spec.ts`

**Produced component contract:**

```ts
// DocumentationOverview.astro
interface Props {
  spaces: readonly DocumentationSpace[];
}
```

- [ ] **Step 1: Write failing landing-page tests**

The tests must assert:

- `/` has one `main` landmark and no article sidebar
- the destination list is no wider than 960px
- Hub and BetterBoard rows are links and have right arrows
- Partner is rendered without a navigation arrow and says `Coming soon`
- each row uses a product logo and no status dot
- rows have transparent backgrounds and separating borders
- `/partners/` has no article sidebar, says `Partner documentation` and `Coming soon`, and is excluded from Pagefind

- [ ] **Step 2: Run the test and confirm the missing pages**

```bash
npm run build
npx playwright test tests/e2e/landing-pages.spec.ts
```

Expected: `/` or `/partners/` assertions fail because the pages do not exist.

- [ ] **Step 3: Create a shared Starlight landing layout**

`DocumentationLanding.astro` wraps `StarlightPage` from `@astrojs/starlight/components` with:

```ts
interface Props {
  title: string;
  description: string;
  pagefind?: boolean;
}
```

Pass a splash template, empty sidebar, canonical metadata, and `pagefind: false` when requested. Keep the same site header and theme behavior as article pages.

- [ ] **Step 4: Implement the overview as editorial rows**

Use the Released how-to list proportions:

```css
.documentation-overview {
  width: min(100%, 960px);
  margin-inline: auto;
  border-top: 1px solid var(--released-line);
}

.documentation-row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 24px;
  gap: 24px;
  align-items: center;
  padding: 30px 4px;
  border-bottom: 1px solid var(--released-line);
  background: transparent;
}
```

The row title is 24–28px depending on viewport. The description uses muted ink. Hover shifts only the arrow by 4px; `prefers-reduced-motion: reduce` disables that transform. Focus-visible outlines the row with sufficient contrast.

- [ ] **Step 5: Add the root and Partner pages**

Root copy:

```text
Find the right documentation for your product.
Choose a space to get started, configure your product, or find an answer.
```

Partner copy:

```text
Partner documentation
Guidance and resources for Released partners are coming soon.
```

The Partner page and Partner row use the chain/link product mark. No green availability dot appears.

- [ ] **Step 6: Verify responsive behavior**

```bash
npm run check
npm run build
npx playwright test tests/e2e/landing-pages.spec.ts
```

Expected: both pages pass at 1440px, 768px, and 390px with no horizontal overflow.

- [ ] **Step 7: Commit the landing pages**

```bash
git add src/layouts/DocumentationLanding.astro src/components/DocumentationOverview.astro src/pages/index.astro src/pages/partners/index.astro tests/e2e/landing-pages.spec.ts
git commit -m "feat: add documentation space landing pages"
```

---

### Task 5: Implement space-scoped Pagefind search

**Files:**

- Create: `src/components/starlight/MarkdownContent.astro`
- Create: `src/components/starlight/Search.astro`
- Create: `src/scripts/search-controller.ts`
- Modify: `astro.config.mjs`
- Create: `tests/build/search-index.test.mjs`
- Create: `tests/e2e/search.spec.ts`

**Produced search contract:**

```ts
export type SearchScope = SpaceId | 'all';

export interface SearchControllerOptions {
  initialScope: SearchScope;
  pagefindBaseUrl?: string;
}

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  space: SpaceId;
}
```

Page markup exposes `data-pagefind-filter="space:hub"` or `space:betterboard`. Root and Partner coming-soon pages use `data-pagefind-ignore`.

- [ ] **Step 1: Write failing built-index tests**

`tests/build/search-index.test.mjs` must:

- load `dist/pagefind/pagefind-entry.json`
- search the built Pagefind metadata for both `space:hub` and `space:betterboard`
- assert `/` and `/partners/` are absent from searchable pages
- assert each indexed content page has exactly one known space value

- [ ] **Step 2: Write failing browser tests**

`tests/e2e/search.spec.ts` must verify:

- `/guide/` opens with scope `Hub documentation`
- `/betterboard/` opens with scope `BetterBoard documentation`
- `/` opens with `All documentation`
- changing scope updates results without navigation
- no-match state offers `Search all documentation`
- Escape closes and restores trigger focus
- ArrowDown/ArrowUp navigate results
- the active scope is announced through an `aria-live="polite"` region
- simulated Pagefind import failure leaves navigation usable and presents `Search could not be loaded. Retry.`

- [ ] **Step 3: Confirm index and UI tests fail**

```bash
npm run build
node --test tests/build/search-index.test.mjs
npx playwright test tests/e2e/search.spec.ts
```

Expected: failures because filter metadata and the custom search UI are absent.

- [ ] **Step 4: Annotate article content for Pagefind**

Override Starlight’s `MarkdownContent` component. Preserve the original `.sl-markdown-content` class and slot, and wrap the article body with:

```astro
<div
  data-pagefind-body
  data-pagefind-filter={`space:${space}`}
  data-pagefind-meta={`space:${space}`}
>
  <slot />
</div>
```

Derive `space` from the validated content entry or current pathname. Throw during the build if an article route cannot be assigned to a space.

- [ ] **Step 5: Implement the scoped search dialog**

Override Starlight’s `Search` component while preserving the visible shortcut and expected header placement. Load `/pagefind/pagefind.js` only when the dialog opens. Call:

```ts
const filters = scope === 'all' ? undefined : { space: scope };
const response = await pagefind.search(query, { filters });
```

The scope chooser contains Hub, BetterBoard, Partner, and All documentation. Disable Partner search until `searchIndexed` becomes true, but keep Partner navigation available in the space switcher.

- [ ] **Step 6: Implement deterministic failure and empty states**

- Empty query: show scoped suggestions or recent section links.
- No results: show the active scope and an action to search all documentation.
- Loader failure: show retry and keep the dialog close control operable.
- No result snippet may inject unsanitized HTML.

- [ ] **Step 7: Run search verification**

```bash
npm run check
npm run build
node --test tests/build/search-index.test.mjs
npx playwright test tests/e2e/search.spec.ts
```

Expected: all pass and Pagefind reports indexed Hub and BetterBoard pages with their space filters.

- [ ] **Step 8: Commit search**

```bash
git add astro.config.mjs src/components/starlight/MarkdownContent.astro src/components/starlight/Search.astro src/scripts/search-controller.ts tests/build/search-index.test.mjs tests/e2e/search.spec.ts
git commit -m "feat: add scoped documentation search"
```

---

### Task 6: Build the GitBook conversion library with fixtures

**Files:**

- Create: `scripts/lib/gitbook/summary.mjs`
- Create: `scripts/lib/gitbook/frontmatter.mjs`
- Create: `scripts/lib/gitbook/blocks.mjs`
- Create: `scripts/lib/gitbook/html.mjs`
- Create: `scripts/lib/gitbook/paths.mjs`
- Create: `scripts/migrate-gitbook.mjs`
- Create: `scripts/validate-content.mjs`
- Create: `tests/fixtures/gitbook/hint.md`
- Create: `tests/fixtures/gitbook/stepper.md`
- Create: `tests/fixtures/gitbook/tabs.md`
- Create: `tests/fixtures/gitbook/embed.md`
- Create: `tests/fixtures/gitbook/content-ref.md`
- Create: `tests/fixtures/gitbook/figure.md`
- Create: `tests/fixtures/gitbook/details.md`
- Create: `tests/fixtures/gitbook/table.md`
- Create: `tests/unit/gitbook-migration.test.mjs`
- Modify: `package.json`

**Produced migration contract:**

```js
export function parseSummary(markdown, options): {
  sourcePath: string;
  outputPath: string;
  route: string;
  label: string;
  order: number;
}[];

export function convertGitBookPage(source, context): {
  content: string;
  assetCopies: { sourcePath: string; publicPath: string }[];
  warnings: { file: string; line: number; construct: string }[];
};

export function mapGitBookPath(sourcePath): {
  outputPath: string;
  route: string;
};
```

The CLI supports:

```text
node scripts/migrate-gitbook.mjs --source . --output src/content/docs/guide
node scripts/migrate-gitbook.mjs --source . --output src/content/docs/guide --check
node scripts/validate-content.mjs
```

- [ ] **Step 1: Copy representative constructs into isolated fixtures**

Choose one real source instance for each fixture type. Keep enough surrounding Markdown to test nested parsing, but remove customer data if any source instance contains it. Every fixture begins with a comment containing its source path.

- [ ] **Step 2: Write failing converter tests**

Test:

- root `README.md` maps to `guide/index.mdx` and `/guide/`
- nested `README.md` maps to an `index.mdx`
- ordinary `.md` maps to the same slug with `.mdx`
- frontmatter gains `space: hub` while preserving title and description
- `hint` becomes `NeutralCallout`
- `stepper` becomes Starlight `Steps`
- `tabs` becomes Starlight `Tabs` and `TabItem`
- `content-ref` becomes `LinkRow`
- YouTube and Loom embeds become `ResponsiveEmbed`
- `figure` keeps image, alt text, and caption
- `details` stays semantic
- tables retain headers and cells
- code fences survive byte-for-byte inside the fence
- unsupported GitBook tags throw with source path and line number
- local assets produce explicit copy operations and `/media/hub/**` URLs
- local links are rewritten to final `/guide/**` routes without changing fragments

- [ ] **Step 3: Run the test and confirm missing-module failures**

```bash
node --test tests/unit/gitbook-migration.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND` for the migration modules.

- [ ] **Step 4: Implement SUMMARY parsing and path mapping**

Parse Markdown links from `SUMMARY.md` in document order. Ignore external links and heading-only lines. Resolve encoded characters safely and reject paths outside the source root. Preserve explicit fragment identifiers.

Path rules:

```text
README.md                              -> src/content/docs/guide/index.mdx
getting-started/README.md              -> src/content/docs/guide/getting-started/index.mdx
product/changelog/writing-a-post.md    -> src/content/docs/guide/product/changelog/writing-a-post.mdx
```

- [ ] **Step 5: Implement block conversion**

Use a token-aware scanner, not global regular expressions. It must skip fenced code blocks and inline code while locating `{% ... %}` constructs. Nested `stepper`, `step`, `tabs`, and `tab` blocks are parsed with a stack. Self-closing embeds and paired embeds are both accepted.

Generated MDX imports only components used by that page:

```mdx
import { Steps, Tabs, TabItem } from '@astrojs/starlight/components';
import NeutralCallout from '../../../../components/content/NeutralCallout.astro';
```

Calculate local import depth from the output file instead of hard-coding it.

- [ ] **Step 6: Implement frontmatter and link conversion**

Required generated frontmatter:

```yaml
---
title: Existing page title
description: Existing description or first meaningful paragraph
space: hub
sidebar:
  order: 10
---
```

Do not replace all occurrences of “Released.” Apply customer-facing renames through an explicit review report emitted by the CLI:

```text
reports/hub-brand-review.json
```

Each entry contains source file, line, sentence, and classification `review`.

- [ ] **Step 7: Add content validation**

`scripts/validate-content.mjs` exits non-zero for:

- remaining `{%` or `%}` outside code fences
- missing `title`, `description`, or `space`
- unknown `space`
- local asset references whose files do not exist
- relative content links that cannot be resolved
- duplicate route output
- unsafe `../` traversal outside approved roots

Print every failure as `path:line message`.

- [ ] **Step 8: Add scripts and run fixtures**

Add:

```json
"migrate:hub": "node scripts/migrate-gitbook.mjs --source . --output src/content/docs/guide",
"validate:content": "node scripts/validate-content.mjs"
```

Run:

```bash
npm run test:unit
```

Expected: all conversion fixture tests pass.

- [ ] **Step 9: Commit the conversion library**

```bash
git add package.json package-lock.json scripts/lib/gitbook scripts/migrate-gitbook.mjs scripts/validate-content.mjs tests/fixtures/gitbook tests/unit/gitbook-migration.test.mjs
git commit -m "feat: add GitBook migration tooling"
```

---

### Task 7: Add reusable migrated-content components

**Files:**

- Create: `src/components/content/NeutralCallout.astro`
- Create: `src/components/content/LinkRow.astro`
- Create: `src/components/content/Figure.astro`
- Create: `src/components/content/ResponsiveEmbed.astro`
- Create: `src/pages/__tests__/content-components.astro`
- Create: `tests/e2e/content-components.spec.ts`

**Component contracts:**

```ts
// NeutralCallout.astro
interface Props {
  type?: 'note' | 'tip' | 'caution' | 'danger';
  title?: string;
}

// LinkRow.astro
interface Props {
  href: string;
  title: string;
  description?: string;
}

// Figure.astro
interface Props {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

// ResponsiveEmbed.astro
interface Props {
  src: string;
  title: string;
  provider: 'youtube' | 'loom';
  aspectRatio?: `${number}/${number}`;
}
```

- [ ] **Step 1: Write the failing component browser test**

Create `src/pages/__tests__/content-components.astro` as an explicitly temporary, Pagefind-ignored render harness. Add `robots` noindex metadata and keep it out of navigation and the sitemap. Assert:

- callouts use a neutral surface and have no colored border-top/border-left
- label and content remain readable in light and dark themes
- LinkRow uses a divider and arrow, not a filled card
- Figure uses `figure`/`figcaption` and non-empty alt text
- embed iframe has a title, lazy loading, `allowfullscreen`, and responsive bounds
- tabs and steps remain keyboard accessible

- [ ] **Step 2: Confirm the components are missing**

```bash
npm run build
npx playwright test tests/e2e/content-components.spec.ts
```

Expected: build failure for missing imported components.

- [ ] **Step 3: Implement the components**

Use semantic HTML. `NeutralCallout` may vary its label/icon by type, but all types share the neutral Released surfaces and boundary color. Warnings can use semantic iconography and text; do not add a decorative colored bar.

`ResponsiveEmbed` validates its hostname against the selected provider and refuses arbitrary origins at build time.

- [ ] **Step 4: Run component checks**

```bash
npm run check
npm run build
npx playwright test tests/e2e/content-components.spec.ts
```

Expected: all pass in light and dark mode.

- [ ] **Step 5: Commit the content primitives**

```bash
git add src/components/content src/pages/__tests__/content-components.astro tests/e2e/content-components.spec.ts
git commit -m "feat: add migrated documentation components"
```

---

### Task 8: Migrate Hub content and protect every legacy URL

**Files:**

- Create/replace generated: `src/content/docs/guide/**`
- Create: `public/media/hub/**`
- Create: `tests/fixtures/legacy-hub-routes.json`
- Create: `tests/build/legacy-routes.test.mjs`
- Create: `tests/build/links-and-assets.test.mjs`
- Create: `reports/hub-brand-review.json`
- Create: `reports/hub-migration-summary.json`
- Modify: `astro.config.mjs`

**Acceptance contract:**

- Every local content link in `SUMMARY.md` becomes one committed route.
- Every route’s built HTML exists under `dist/`.
- Every local page link and asset reference resolves.
- Existing fragments referenced by links still identify an element in the destination HTML.

- [ ] **Step 1: Generate the immutable legacy route fixture first**

Run a route-manifest mode that reads only the current `SUMMARY.md`:

```bash
node scripts/migrate-gitbook.mjs --source . --manifest tests/fixtures/legacy-hub-routes.json
```

Assert the manifest contains exactly 84 routes, matching the 84 local page links currently in `SUMMARY.md`. Commit the exact route strings, including trailing slashes.

- [ ] **Step 2: Write failing route and link tests**

`legacy-routes.test.mjs` maps each route to its expected `dist/**/index.html` and asserts the file exists.

`links-and-assets.test.mjs` parses all `dist/**/*.html` and verifies:

- same-site `/guide/**` and `/betterboard/**` links resolve
- fragment links resolve to `id` or named anchors
- `src`, `srcset`, and poster references under `/media/**` exist
- canonical links use `https://docs.released.so`
- sitemap includes every indexed route
- URLs use the configured trailing slash behavior

- [ ] **Step 3: Confirm the full manifest does not yet build**

```bash
npm run build
node --test tests/build/legacy-routes.test.mjs tests/build/links-and-assets.test.mjs
```

Expected: missing-route failures for the GitBook pages not yet generated.

- [ ] **Step 4: Run the full Hub migration**

```bash
npm run migrate:hub
npm run validate:content
```

Expected:

- generated MDX under `src/content/docs/guide/**`
- copied media under `public/media/hub/**`
- `reports/hub-migration-summary.json` with source count, output count, asset count, converted construct counts, and zero dropped constructs
- `reports/hub-brand-review.json` listing only customer-facing “Released” phrases for human review

- [ ] **Step 5: Review customer-facing naming**

For every report item, classify it as:

- change display copy to Hub
- retain product/marketplace name
- retain code/config/API/asset identifier
- retain historical usage

Apply only the first class in generated MDX. Store the chosen classification in the report so a later migration rerun can reproduce the decision.

- [ ] **Step 6: Compare representative pages to GitBook source**

Record source and destination checks in `reports/hub-migration-summary.json` for at least:

- plain prose
- nested steps
- tabs
- hint/callout
- content-ref/card list
- long table
- code block
- Loom or YouTube embed
- figure with caption
- animated media

Each check records source path, output path, reviewer result, and any deliberate transformation.

- [ ] **Step 7: Run route, link, asset, and content checks**

```bash
npm run validate:content
npm run check
npm run test:unit
npm run test:build
```

Expected: all pass; the route test reports the full manifest count and zero missing Hub routes.

- [ ] **Step 8: Commit the Hub migration**

```bash
git add src/content/docs/guide public/media/hub tests/fixtures/legacy-hub-routes.json tests/build/legacy-routes.test.mjs tests/build/links-and-assets.test.mjs reports/hub-brand-review.json reports/hub-migration-summary.json astro.config.mjs
git commit -m "feat: migrate Hub documentation"
```

---

### Task 9: Migrate BetterBoard into clean grouped routes

**Files:**

- Create: `src/data/betterboard-docs.ts`
- Create: `scripts/migrate-betterboard.mjs`
- Create: `tests/fixtures/betterboard/source-page.astro`
- Create: `tests/unit/betterboard-migration.test.mjs`
- Create: `src/content/docs/betterboard/index.mdx`
- Create: `src/content/docs/betterboard/start/**`
- Create: `src/content/docs/betterboard/board-setup/**`
- Create: `src/content/docs/betterboard/shape-the-board/**`
- Create: `src/content/docs/betterboard/work-faster/**`
- Create: `public/media/betterboard/**`
- Create: `reports/betterboard-migration-summary.json`
- Modify: `package.json`

**Produced route-map contract:**

```ts
export type BetterBoardSection =
  | 'start'
  | 'board-setup'
  | 'shape-the-board'
  | 'work-faster';

export interface BetterBoardDoc {
  sourceSlug: string;
  destinationSlug: string;
  section: BetterBoardSection;
  title: string;
  order: number;
}

export const betterBoardDocs: readonly BetterBoardDoc[];
```

The migration CLI is:

```text
node scripts/migrate-betterboard.mjs \
  --source /Users/jschumacher/Development/Released/betterboard-website \
  --output src/content/docs/betterboard
```

- [ ] **Step 1: Encode the approved route map**

Create `src/data/betterboard-docs.ts` with exactly the 20 article mappings in this plan. Orders restart within each section. Add a runtime uniqueness assertion for both source and destination slugs.

- [ ] **Step 2: Create a representative source fixture**

Copy one BetterBoard page into `tests/fixtures/betterboard/source-page.astro`, retaining:

- `SeoHead` title/description
- the `.docs-content` article
- headings
- one link
- one image if present
- enough surrounding layout/style markup to prove the extractor ignores it

- [ ] **Step 3: Write failing migration tests**

Test that the converter:

- extracts only the `.docs-content` article
- reads `SeoHead` title and description
- omits site header, docs sidebar, footer, style, and script
- converts headings, lists, links, tables, code, and images to valid MDX
- writes `space: betterboard`
- writes section and order metadata from the route map
- rewrites BetterBoard internal docs links to the new grouped routes
- rewrites docs media to `/media/betterboard/**`
- fails when a source slug is missing or duplicated

- [ ] **Step 4: Confirm the converter is absent**

```bash
node --test tests/unit/betterboard-migration.test.mjs
```

Expected: module-not-found failure for `scripts/migrate-betterboard.mjs`.

- [ ] **Step 5: Implement the extractor**

Use Cheerio to load the Astro source as HTML-like text and isolate `.docs-content`. Remove Astro directives and wrapper elements that do not belong to the article. Use Turndown with explicit rules for:

- fenced code
- semantic tables
- figure/image markup
- internal docs links
- `details`/`summary`

Do not scrape `betterboard.work` over the network. The sibling repository is the authoritative migration source.

- [ ] **Step 6: Author the BetterBoard landing**

`src/content/docs/betterboard/index.mdx` uses the approved editorial row component and these groups:

- Start
- Board setup
- Shape the board
- Work faster

It is indexed as `space: betterboard`. Rows stay within content width and use dividers, not filled cards.

- [ ] **Step 7: Run the migration**

Add:

```json
"migrate:betterboard": "node scripts/migrate-betterboard.mjs --source /Users/jschumacher/Development/Released/betterboard-website --output src/content/docs/betterboard"
```

Run:

```bash
npm run migrate:betterboard
npm run validate:content
```

Copy only referenced production media from `public/images/docs/**` to `public/media/betterboard/**`. Do not import unrelated marketing screenshots or avatars.

- [ ] **Step 8: Compare the complete source set**

`reports/betterboard-migration-summary.json` must list 21 source pages: the source landing plus 20 mapped articles. For every article record source path, destination route, title, image count, internal link count, and review status. The migration fails if any mapped source file is absent.

- [ ] **Step 9: Run full content/build checks**

```bash
npm run test:unit
npm run validate:content
npm run test:build
```

Expected: all pass and every route in the BetterBoard Route Map exists.

- [ ] **Step 10: Commit the BetterBoard migration**

```bash
git add package.json package-lock.json src/data/betterboard-docs.ts scripts/migrate-betterboard.mjs tests/fixtures/betterboard tests/unit/betterboard-migration.test.mjs src/content/docs/betterboard public/media/betterboard reports/betterboard-migration-summary.json
git commit -m "feat: migrate BetterBoard documentation"
```

---

### Task 10: Complete responsive, theme, accessibility, and representative-content coverage

**Files:**

- Create: `tests/e2e/documentation.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/visual-contract.spec.ts`
- Create: `tests/fixtures/representative-pages.json`
- Delete: `src/pages/__tests__/content-components.astro`
- Delete: `tests/e2e/content-components.spec.ts`
- Modify: `src/styles/starlight.css`
- Modify: content/components only where the focused tests identify a defect

**Representative page fixture:**

`tests/fixtures/representative-pages.json` names exact routes selected from the generated content for:

- Hub landing
- Hub simple article
- Hub nested steps
- Hub tabs
- Hub callout
- Hub long table
- Hub code sample
- Hub embed
- BetterBoard landing
- BetterBoard start article
- BetterBoard board-setup article
- BetterBoard shape-the-board article with image
- BetterBoard work-faster article
- Partner coming-soon page

- [ ] **Step 1: Write the cross-space browser suite**

At desktop 1440×1000, tablet 768×1024, and mobile 390×844, verify:

- header order: Released identity, divider, left-side switcher, search on right where space permits
- only active-space sidebar links are present
- sidebar surface reaches the viewport bottom on article pages
- article content and table of contents do not overlap
- root overview remains at or below 960px
- no page has horizontal overflow
- mobile menu opens, traps focus appropriately, and closes
- switcher navigation lands on `/guide/`, `/betterboard/`, and `/partners/`
- dark, light, and system modes all render readable surfaces
- reduced motion removes arrow/menu transition movement

- [ ] **Step 2: Write semantic and accessibility assertions**

Use Playwright assertions for:

- one main landmark
- visible focus for every interactive control
- no unlabeled buttons
- every non-decorative image has non-empty alt text
- iframes have titles
- headings do not skip from `h1` to `h3`
- switcher/menu/search ARIA state changes correctly
- contrast-sensitive controls use the semantic token classes
- callouts do not communicate severity by color alone

Add `@axe-core/playwright` only if it is introduced as a pinned development dependency and its focused violations are reviewed rather than globally suppressed.

- [ ] **Step 3: Write visual-contract assertions**

Assert computed styles rather than image snapshots for the decisions that must not regress:

- no `.status-dot` elements
- overview row background is transparent
- overview width is at most 960px
- callout top and left border widths do not form an accent bar
- no generic control uses the former violet highlight value
- sidebar min-height is at least the content viewport height
- body and headings use Switzer

- [ ] **Step 4: Retire the temporary component harness**

Move every assertion from `tests/e2e/content-components.spec.ts` onto the real representative migrated routes in `documentation.spec.ts`, `accessibility.spec.ts`, or `visual-contract.spec.ts`. Delete both `src/pages/__tests__/content-components.astro` and `tests/e2e/content-components.spec.ts`. Rebuild and assert that `/__tests__/content-components/` no longer exists in `dist/`.

- [ ] **Step 5: Run the focused suites and fix only observed defects**

```bash
npm run build
npx playwright test tests/e2e/documentation.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/visual-contract.spec.ts
```

Expected: all named routes pass across the configured viewport projects.

- [ ] **Step 6: Run the entire suite**

```bash
npm test
```

Expected: check, unit, production build, Pagefind index tests, route/link/asset tests, and all Playwright tests pass.

- [ ] **Step 7: Commit final UI and accessibility hardening**

```bash
git add tests/e2e/documentation.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/visual-contract.spec.ts tests/e2e/content-components.spec.ts tests/fixtures/representative-pages.json src/pages/__tests__/content-components.astro src/styles/starlight.css src/components src/content package.json package-lock.json
git commit -m "test: harden documentation experience"
```

Stage only files actually changed by the fixes.

---

### Task 11: Perform the branch release gate without deploying

**Files:**

- Create: `reports/release-readiness.md`
- Modify: no product files unless a failed gate requires a focused fix and rerun

- [ ] **Step 1: Confirm branch and worktree state**

```bash
git branch --show-current
git status --short
```

Expected: branch is `feat/astro-documentation-spaces` and the worktree is clean before the release-gate run.

- [ ] **Step 2: Run clean-install verification**

```bash
npm ci
npm test
```

Expected: all commands exit 0 from the committed dependency graph.

- [ ] **Step 3: Inspect a production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4321
```

Inspect the representative routes from `tests/fixtures/representative-pages.json` in the browser. Record actual checked viewport, theme, and result in `reports/release-readiness.md`.

- [ ] **Step 4: Reconcile route and content counts**

Record:

- number of routes in `tests/fixtures/legacy-hub-routes.json`
- number passing `legacy-routes.test.mjs`
- number of Hub source pages and generated pages
- number of BetterBoard mapped articles and generated pages
- number of indexed Hub and BetterBoard pages
- number of broken links/assets/fragments

All missing/broken counts must be zero.

- [ ] **Step 5: Review the branch diff**

```bash
git diff --stat main...HEAD
git diff --check main...HEAD
git log --oneline --decorate main..HEAD
```

Expected: no whitespace errors, no unrelated website/application files, no generated cache directories, no secrets, and no deployment or DNS configuration changes.

- [ ] **Step 6: Write the readiness report**

`reports/release-readiness.md` contains:

- branch and commit inspected
- exact commands run
- pass/fail result for build, routes, links/assets, search, accessibility, responsive, theme, and visual contract
- the local preview URL used
- known limitations, if any
- explicit statement: `No deployment, DNS, or docs.released.so cutover was performed.`

- [ ] **Step 7: Commit the evidence**

```bash
git add reports/release-readiness.md
git commit -m "docs: record documentation migration verification"
```

- [ ] **Step 8: Stop at the approval gate**

Report the verified branch state and local preview. Ask separately for approval before creating a pull request, merging, deploying, changing DNS, or switching `docs.released.so`.

## Final Acceptance Checklist

- [ ] `/` is the documentation overview and does not redirect.
- [ ] Every legacy Hub route in `SUMMARY.md` resolves at the same `/guide/*` URL.
- [ ] BetterBoard has a landing page plus all 20 mapped articles under clean grouped routes.
- [ ] `/partners/` is a branded, non-indexed coming-soon page.
- [ ] The active-space switcher is on the left beside Released identity and supports pointer and keyboard interaction.
- [ ] The sidebar contains only the active space and reaches the bottom of the document shell.
- [ ] Search defaults to the active space and can switch to all documentation.
- [ ] The root overview uses content-width editorial rows, product marks, dividers, and arrows instead of panels.
- [ ] No status dots appear before names or words.
- [ ] No callout uses a colored top or left bar.
- [ ] Switzer, semantic Released colors, light/dark/system theme, focus, and reduced-motion behavior are verified.
- [ ] GitBook constructs, links, anchors, code, tables, figures, and local media survive conversion.
- [ ] The complete automated suite and production-preview review pass.
- [ ] Work remains on `feat/astro-documentation-spaces`; no deployment or live-domain change occurs.

## Implementation References

- Approved design: `docs/superpowers/specs/2026-07-27-astro-documentation-spaces-design.md`
- Released design system: `/Users/jschumacher/Development/Released/released-website/docs/design-system.md`
- Released semantic tokens: `/Users/jschumacher/Development/Released/released-website/src/styles/global.css`
- Released editorial row source: `/Users/jschumacher/Development/Released/released-website/src/pages/how-to/index.astro`
- BetterBoard docs source: `/Users/jschumacher/Development/Released/betterboard-website/src/pages/docs/`
- Starlight content collections: <https://starlight.astro.build/reference/configuration/>
- Starlight component overrides: <https://starlight.astro.build/guides/overriding-components/>
- Starlight route middleware: <https://starlight.astro.build/reference/route-data/>
- Pagefind filters: <https://pagefind.app/docs/filtering/>
