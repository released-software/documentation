# Agent-ready Page Markdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a clean Markdown representation and `llms.txt` index for every public documentation entry, with an accessible copy/view control beside each page title.

**Architecture:** Shared data utilities derive public HTML and Markdown paths and filter eligible content entries. An AST-based MDX converter produces portable Markdown for a prerendered catch-all `.md` endpoint, while a second prerendered endpoint builds `/llms.txt`. A Starlight `PageTitle` override composes the default title with a local split action control.

**Tech Stack:** Astro 7, Starlight 0.41, TypeScript, unified/remark MDX AST tooling, Node test runner, Playwright.

## Global Constraints

- Emit one clean Markdown representation only; do not add `displayAgentInstructions`.
- Do not include or advertise GitBook-style `ask` or `goal` support.
- Exclude drafts, 404 entries, and `component-tests/generated-content-components`.
- Preserve unrelated worktree changes, especially the in-progress Cloudflare redirects and product-switcher spacing work.
- Do not create a Git commit unless the user separately requests one.

---

### Task 1: Public documentation path model

**Files:**
- Create: `src/data/agent-docs.mjs`
- Create: `src/data/agent-docs.d.mts`
- Test: `tests/unit/agent-docs.test.mjs`

**Interfaces:**
- Produces: `htmlPathForEntryId(id: string): string`
- Produces: `markdownPathForEntryId(id: string): string`
- Produces: `isAgentDocument(entry: { id: string; data: { draft?: boolean } }): boolean`
- Produces: `renderLlmsTxt(entries, site): string`

- [ ] **Step 1: Write failing path and index tests**

Cover ordinary and index IDs, fixture/draft exclusions, space grouping, absolute `.md` links, and descriptions:

```js
assert.equal(markdownPathForEntryId('guide/index'), '/guide.md');
assert.equal(
  markdownPathForEntryId('betterboard/start/quick-start'),
  '/betterboard/start/quick-start.md'
);
assert.equal(isAgentDocument({ id: '404', data: {} }), false);
assert.match(index, /https:\/\/docs\.released\.so\/guide\/getting-started\/concepts\.md/);
```

- [ ] **Step 2: Verify the tests fail because the module does not exist**

Run: `node --test tests/unit/agent-docs.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/data/agent-docs.mjs`.

- [ ] **Step 3: Implement the minimal path/filter/index utilities**

Normalize an `index` suffix to its parent route, append `.md` without a trailing slash, reject drafts/404/the fixture, and sort index entries by space then title.

- [ ] **Step 4: Verify the focused unit tests pass**

Run: `node --test tests/unit/agent-docs.test.mjs`

Expected: all tests PASS.

---

### Task 2: Clean MDX-to-Markdown conversion

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/markdown/agent-markdown.mjs`
- Create: `src/markdown/agent-markdown.d.mts`
- Test: `tests/unit/agent-markdown.test.mjs`

**Interfaces:**
- Produces: `renderAgentMarkdown(input: { title: string; body: string }): Promise<string>`
- Consumes: raw Starlight content-entry `body` and frontmatter `title`.

- [ ] **Step 1: Add failing conversion tests**

Use one representative fixture containing standard headings, a code fence, `Figure`, `NeutralCallout`, `ResponsiveEmbed`, `LinkRow`, `Steps`, `Tabs`/`TabItem`, and `OverviewSection`. Assert that the result starts with one H1, preserves authored content, and contains no imports or JSX component names.

```js
const markdown = await renderAgentMarkdown({ title: 'Quick start', body });
assert.match(markdown, /^# Quick start$/m);
assert.match(markdown, /!\[Board view\]\(\/media\/board\.png\)/);
assert.match(markdown, /> \\*\\*Caution\\*\\*/);
assert.doesNotMatch(markdown, /^import /m);
assert.doesNotMatch(markdown, /<(?:Figure|NeutralCallout|Tabs|TabItem)\\b/);
```

- [ ] **Step 2: Verify the tests fail because the converter does not exist**

Run: `node --test tests/unit/agent-markdown.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Add the explicit AST dependencies**

Install direct production dependencies for `unified`, `remark-parse`, `remark-mdx`, `remark-gfm`, `remark-stringify`, and `acorn`.

Run: `npm install unified remark-parse remark-mdx remark-gfm remark-stringify acorn`

- [ ] **Step 4: Implement the AST conversion**

Parse MDX, recursively replace known component nodes with mdast-native nodes, unwrap content-bearing layout components, remove ESM/comment/expression-only nodes, parse `OverviewSection.items` as a static object-literal expression with Acorn, stringify with GFM support, prepend the frontmatter title as the only H1, and normalize excess blank lines.

- [ ] **Step 5: Verify the focused conversion tests pass**

Run: `node --test tests/unit/agent-markdown.test.mjs`

Expected: all tests PASS with no warnings.

---

### Task 3: Prerendered Markdown and `llms.txt` endpoints

**Files:**
- Create: `src/pages/[...slug].md.ts`
- Create: `src/pages/llms.txt.ts`
- Create: `tests/build/agent-markdown-output.test.mjs`

**Interfaces:**
- Consumes: `isAgentDocument`, `markdownPathForEntryId`, `renderLlmsTxt`, and `renderAgentMarkdown`.
- Produces: static `text/markdown; charset=utf-8` `.md` responses and static `text/plain; charset=utf-8` `/llms.txt`.

- [ ] **Step 1: Add failing build-output tests**

Assert the built files exist at `dist/guide.md`, `dist/guide/getting-started/concepts.md`, and `dist/llms.txt`; assert the correct content, links, and absence of imports/custom component tags.

```js
const concepts = await readFile(new URL('../../dist/guide/getting-started/concepts.md', import.meta.url), 'utf8');
assert.match(concepts, /^# Concepts$/);
assert.doesNotMatch(concepts, /^import /m);
assert.doesNotMatch(concepts, /<Figure\\b/);
```

- [ ] **Step 2: Verify the test fails against the current build**

Run: `npm run build && node --test tests/build/agent-markdown-output.test.mjs`

Expected: FAIL because the `.md` and `llms.txt` artifacts do not exist.

- [ ] **Step 3: Implement the static endpoints**

Use `getCollection('docs')` in both endpoints, filter through `isAgentDocument`, map HTML-derived Markdown paths to catch-all route params, and return explicit content-type plus UTF-8 responses. Generate absolute links from the configured site URL in `llms.txt`.

- [ ] **Step 4: Verify the build-output tests pass**

Run: `npm run build && node --test tests/build/agent-markdown-output.test.mjs`

Expected: all tests PASS and Astro reports generated `.md` and `llms.txt` routes.

---

### Task 4: Page-level copy and view interaction

**Files:**
- Create: `src/components/starlight/PageTitle.astro`
- Modify: `astro.config.mjs`
- Modify: `src/styles/starlight.css`
- Modify: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: the default Starlight `PageTitle`, `markdownPathForEntryId`, and `isAgentDocument`.
- Produces: `[data-page-actions]`, `[data-copy-page]`, `[data-page-actions-trigger]`, and a `View as Markdown` link for Playwright and assistive technology.

- [ ] **Step 1: Add failing end-to-end tests**

Test that `/guide/getting-started/concepts/` renders the split control, copying fetches the `.md` response and announces `Copied`, the view action targets `/guide/getting-started/concepts.md`, ArrowDown opens/focuses the menu, Escape closes it and restores trigger focus, and the title/control stack at 390px without horizontal overflow.

- [ ] **Step 2: Verify the focused browser tests fail**

Run: `npx playwright test tests/e2e/shell.spec.ts --grep "page Markdown actions"`

Expected: FAIL because no page action controls exist.

- [ ] **Step 3: Implement the Starlight title override**

Compose `@astrojs/starlight/components/PageTitle.astro` inside a title row. Render the control only when `isAgentDocument()` is true. Use semantic buttons, `aria-expanded`, `aria-haspopup="menu"`, `role="menu"`, one `role="menuitem"` link, a polite live region, inline SVG icons, and a local script for copy/menu/focus behavior.

- [ ] **Step 4: Register and style the override**

Add `PageTitle: './src/components/starlight/PageTitle.astro'` to the existing `components` object without disturbing redirect work. Add token-based split-control, menu, focus, reduced-motion, print, and narrow-screen styles to `src/styles/starlight.css`.

- [ ] **Step 5: Verify the focused browser tests pass**

Run: `npx playwright test tests/e2e/shell.spec.ts --grep "page Markdown actions"`

Expected: all focused tests PASS in Chromium.

---

### Task 5: Full validation

**Files:**
- Review: all files changed by Tasks 1–4 plus the design and plan documents.

- [ ] **Step 1: Run static and unit validation**

Run: `npm run check && npm run test:unit`

Expected: both commands exit 0.

- [ ] **Step 2: Run a fresh production build and build assertions**

Run: `npm run test:build`

Expected: build and all build tests exit 0.

- [ ] **Step 3: Run the complete end-to-end suite**

Run: `npm run test:e2e`

Expected: all configured Playwright projects exit 0; if an environmental failure occurs, classify it with the exact command and output rather than reporting the suite green.

- [ ] **Step 4: Inspect scope and whitespace**

Run: `git status --short && git diff --check && git diff --stat`

Expected: no whitespace errors; only the agent-Markdown files plus the pre-existing redirect, content, and product-switcher changes appear.
