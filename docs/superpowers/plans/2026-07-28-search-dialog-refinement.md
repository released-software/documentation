# Search Dialog Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the documentation search dialog a controlled scope selector, a quiet empty state, and stable debounced results that do not flicker while typing.

**Architecture:** Keep the native select and Pagefind integration, but move visual ownership of the chevron and focus halo into `Search.astro`. Refactor `SearchController` so input events schedule a versioned search, empty queries short-circuit before Pagefind loads, and completed results stay mounted until the latest request commits a replacement state.

**Tech Stack:** Astro, TypeScript, native HTML dialog/select controls, Pagefind, Playwright

## Global Constraints

- Use a 150ms trailing debounce for input changes.
- Search scope changes run immediately when the query is non-empty.
- Keep completed results visible while the latest replacement search is pending.
- Do not show visible loading text during a Pagefind search.
- Empty queries must not load Pagefind and must show no suggestions.
- Preserve the development-only production-preview warning without attempting to load Pagefind.
- Keep the native select, its accessible label, and a visible keyboard focus state.
- Do not change Pagefind indexing, ranking, scope definitions, result content, or global design tokens.
- Preserve unrelated migration and documentation changes in the worktree.

---

### Task 1: Scope selector and empty-query presentation

**Files:**
- Modify: `tests/e2e/search.spec.ts:37-55`
- Modify: `src/components/starlight/Search.astro:31-49, 183-328, 365-374`
- Modify: `src/scripts/search-controller.ts:219-287`

**Interfaces:**
- Consumes: Existing `[data-search-scope]`, `[data-search-state]`, and `[data-search-results]` hooks.
- Produces: A `.search-scope-select` visual wrapper and a controller `renderEmpty()` method that later scheduling work can call.

- [ ] **Step 1: Replace the suggestion-style regression with failing selector and empty-state tests**

Update `tests/e2e/search.spec.ts` so the old `empty search suggestions use dialog link styling` test is replaced with:

```ts
test('search scope uses the custom chevron and restrained keyboard focus', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);

  const scope = page.getByRole('combobox', { name: 'Search scope' });
  await expect(scope).toHaveCSS('appearance', 'none');
  await expect(page.locator('[data-search-scope-chevron]')).toBeVisible();

  await scope.focus();
  await expect(scope).toHaveCSS('outline-style', 'none');
  await expect(scope).not.toHaveCSS('box-shadow', 'none');
});

test('an empty query has no suggestions, loading state, or result divider', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const state = page.locator('[data-search-state]');
  const results = page.locator('[data-search-results]');
  await expect(state).toBeEmpty();
  await expect(results).toBeEmpty();
  await expect(results).toHaveCSS('display', 'none');
  await expect(page.getByText('Suggested sections in All documentation')).toHaveCount(0);
  await expect(page.getByText('Loading search…')).toHaveCount(0);

  await input.fill('Jira');
  await expect(results.locator('a').first()).toBeVisible();
  await input.fill('');
  await expect(results).toBeEmpty();
  await expect(results).toHaveAttribute('aria-busy', 'false');
});
```

In the loader-failure test, type a query before expecting the intercepted Pagefind load to fail:

```ts
const input = page.getByRole('searchbox', { name: 'Search documentation' });
await input.fill('Jira');
await expect(page.getByText('Search could not be loaded. Retry.')).toBeVisible();
```

After clicking Retry, replace the suggestion assertion with:

```ts
await expect(page.locator('[data-search-results] a').first()).toBeVisible();
```

- [ ] **Step 2: Run the focused tests and verify the new checks fail for the intended reasons**

Run:

```bash
PLAYWRIGHT_PORT=45680 npx playwright test tests/e2e/search.spec.ts
```

Expected failures:

- The select reports the browser-native appearance instead of `none`.
- `[data-search-scope-chevron]` is absent.
- The select receives the current dark outline.
- The empty state contains suggested-section links.
- The empty results container still renders its divider.

- [ ] **Step 3: Add the custom chevron and restrained focus styling**

In `Search.astro`, wrap the select in a positioned span and add a decorative SVG:

```astro
<span class="search-scope-select">
  <select data-search-scope>
    <option value="all">All documentation</option>
    {
      spaces.map((space) => (
        <option disabled={!space.searchIndexed} value={space.id}>
          {space.name}
        </option>
      ))
    }
  </select>
  <svg
    aria-hidden="true"
    data-search-scope-chevron
    viewBox="0 0 16 16"
  >
    <path
      d="m4 6 4 4 4-4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    ></path>
  </svg>
</span>
```

Add component-scoped styles:

```css
.search-scope-select {
  position: relative;
  display: block;
}

.search-scope-select select {
  appearance: none;
  padding-inline: 0.75rem 2.5rem;
}

.search-scope-select svg {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: 0.875rem;
  width: 1rem;
  transform: translateY(-50%);
  color: var(--released-ink-muted);
  pointer-events: none;
}

select:focus-visible {
  outline: none;
  border-color: var(--released-line-strong);
  box-shadow: 0 0 0 3px var(--released-bg-card);
}
```

Remove `select:focus-visible` from the shared dark-outline selector. Keep the existing input, button, state-action, and result-link focus rules unchanged.

- [ ] **Step 4: Remove suggested-section rendering and collapse empty containers**

Replace `renderSuggestions()` in `SearchController` with:

```ts
private renderEmpty() {
  this.state.replaceChildren();
  this.results.replaceChildren();
  this.results.setAttribute('aria-busy', 'false');
}
```

For the current pre-scheduling implementation, read the query before loading Pagefind:

```ts
const query = this.input.value.trim();
if (!query) {
  this.renderEmpty();
  return;
}
```

Keep the existing development-only `searchAvailable` guard before this empty-query branch so opening search in development still renders the production-preview warning. Delete the later query read and the suggestion list construction.

Remove the obsolete state `ul` and state `a` CSS. Add:

```css
[data-search-results]:empty {
  display: none;
}
```

Remove the desktop dialog’s `min-height: 18rem` so the empty dialog is content-sized.

- [ ] **Step 5: Run the focused search suite**

Run:

```bash
PLAYWRIGHT_PORT=45680 npx playwright test tests/e2e/search.spec.ts
```

Expected: All focused search tests pass.

- [ ] **Step 6: Commit the isolated presentation change**

```bash
git add src/components/starlight/Search.astro src/scripts/search-controller.ts tests/e2e/search.spec.ts
git commit -m "fix: refine search dialog controls"
```

---

### Task 2: Debounced versioned search scheduling

**Files:**
- Modify: `tests/e2e/search.spec.ts:56-84`
- Modify: `src/scripts/search-controller.ts:47-233`

**Interfaces:**
- Consumes: `renderEmpty()` from Task 1 and the existing `requestId` stale-response guard.
- Produces: `scheduleSearch(debounce: boolean)`, `cancelPendingSearch()`, and `setSearchBusy(busy: boolean)` methods.

- [ ] **Step 1: Add a failing stability regression**

Add this test after the empty-query test:

```ts
test('typing keeps completed results visible until the latest search replaces them', async ({
  page
}) => {
  await page.goto('/');
  await openSearch(page);

  const input = page.getByRole('searchbox', { name: 'Search documentation' });
  const results = page.locator('[data-search-results]');
  await input.fill('Jira');
  await expect(results.locator('a').first()).toBeVisible();
  const previousFirstResult = await results.locator('a').first().innerText();

  await input.fill('Board');

  expect(await results.locator('a').first().innerText()).toBe(previousFirstResult);
  await expect(results).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByText('Loading search…')).toHaveCount(0);
  await expect(results).toHaveAttribute('aria-busy', 'false');
  await expect(results.locator('a').first()).toBeVisible();
});
```

Extend the empty-query test:

```ts
await input.fill('Jira');
await expect(results.locator('a').first()).toBeVisible();
await input.fill('');
await expect(results).toBeEmpty();
await expect(results).toHaveAttribute('aria-busy', 'false');
```

- [ ] **Step 2: Run the focused test and confirm the flicker regression fails**

Run:

```bash
PLAYWRIGHT_PORT=45680 npx playwright test tests/e2e/search.spec.ts
```

Expected: The prior result disappears immediately after filling `Board`, and the visible loading state appears.

- [ ] **Step 3: Introduce the debounce state and scheduling boundary**

At module scope:

```ts
const SEARCH_DEBOUNCE_MS = 150;
```

Add controller state:

```ts
private searchTimer?: number;
```

Replace direct input searching with:

```ts
this.input.addEventListener('input', () => this.scheduleSearch(true));
```

Make scope changes call `this.scheduleSearch(false)`. Make opening the dialog call `this.scheduleSearch(false)`. On close, call `cancelPendingSearch()`, increment `requestId`, and set busy to false.

Add:

```ts
private scheduleSearch(debounce: boolean) {
  this.cancelPendingSearch();
  const currentRequest = ++this.requestId;
  const query = this.input.value.trim();

  if (!this.searchAvailable) {
    this.results.replaceChildren();
    this.setSearchBusy(false);
    this.setStateText(this.searchUnavailableMessage);
    return;
  }

  if (!query) {
    this.renderEmpty();
    return;
  }

  this.setSearchBusy(true);
  const run = () => {
    this.searchTimer = undefined;
    void this.runSearch(currentRequest, query);
  };

  if (debounce) {
    this.searchTimer = window.setTimeout(run, SEARCH_DEBOUNCE_MS);
  } else {
    run();
  }
}

private cancelPendingSearch() {
  if (this.searchTimer === undefined) return;
  window.clearTimeout(this.searchTimer);
  this.searchTimer = undefined;
}

private setSearchBusy(busy: boolean) {
  this.results.setAttribute('aria-busy', String(busy));
}
```

- [ ] **Step 4: Make search execution commit only completed latest states**

Change the signature to:

```ts
private async runSearch(currentRequest: number, query: string)
```

Remove the initial `requestId` increment, result clearing, visible loading call, and late query read. Keep Pagefind lazy loading after the empty-query boundary in `scheduleSearch`.

Before every terminal return for the active request, call `setSearchBusy(false)`. Update render methods so results are replaced only when committing:

```ts
private renderNoResults() {
  this.state.replaceChildren();
  this.results.replaceChildren();
  const message = document.createElement('p');
  message.textContent = `No results in ${this.scopeLabel()}.`;
  this.state.append(message);
  if (this.scope !== 'all') {
    this.state.append(
      this.createButton('Search all documentation', 'data-search-all')
    );
  }
}

private renderUnavailable() {
  this.state.replaceChildren();
  this.results.replaceChildren();
  const message = document.createElement('p');
  message.textContent = `${this.scopeLabel()} search is coming soon.`;
  const button = this.createButton('Search all documentation', 'data-search-all');
  this.state.append(message, button);
}

private renderFailure() {
  this.state.replaceChildren();
  this.results.replaceChildren();
  const message = document.createElement('p');
  message.append('Search could not be loaded. ');
  message.append(this.createButton('Retry', 'data-retry-search'));
  message.append('.');
  this.state.append(message);
}

private renderResults(results: SearchResult[]) {
  this.state.replaceChildren();
  const nextResults = document.createDocumentFragment();

  for (const result of results) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const title = document.createElement('span');
    const excerpt = document.createElement('p');

    link.href = result.url;
    link.dataset.resultSpace = result.space;
    title.textContent = result.title;
    excerpt.textContent = result.excerpt;
    link.append(title, excerpt);
    item.append(link);
    nextResults.append(item);
  }

  this.results.replaceChildren(nextResults);
}
```

Delete `renderLoading()`. Ensure stale request branches return without changing results or busy state owned by the newer request.

Retry resets Pagefind state and calls `scheduleSearch(false)`. “Search all documentation” also calls `scheduleSearch(false)`.

- [ ] **Step 5: Run the focused search suite**

Run:

```bash
PLAYWRIGHT_PORT=45680 npx playwright test tests/e2e/search.spec.ts
```

Expected: All search tests pass, including stable results, clear-query cleanup, scope changes, no-results, retry, Escape, and result keyboard navigation.

- [ ] **Step 6: Commit the scheduling change**

```bash
git add src/scripts/search-controller.ts tests/e2e/search.spec.ts
git commit -m "fix: stabilize search result updates"
```

---

### Task 3: Production and visual verification

**Files:**
- Verify: `src/components/starlight/Search.astro`
- Verify: `src/scripts/search-controller.ts`
- Verify: `tests/e2e/search.spec.ts`

**Interfaces:**
- Consumes: The completed presentation and scheduling changes from Tasks 1 and 2.
- Produces: Verification evidence only; no new runtime interfaces.

- [ ] **Step 1: Run type and content checks**

Run:

```bash
npm run check
```

Expected: Exit 0 with no Astro errors.

- [ ] **Step 2: Verify the production Pagefind index**

Run:

```bash
node --test tests/build/search-index.test.mjs
```

Expected: Four passing Pagefind metadata/index tests.

- [ ] **Step 3: Run the complete focused search browser suite from a production build**

Run:

```bash
PLAYWRIGHT_PORT=45680 npx playwright test tests/e2e/search.spec.ts
```

Expected: Every test in `tests/e2e/search.spec.ts` passes.

- [ ] **Step 4: Check the final diff**

Run:

```bash
git diff --check
git status --short
```

Expected: No whitespace errors. Only the planned search files plus the user’s pre-existing worktree changes are present.

- [ ] **Step 5: Verify the live preview**

Rebuild and reload `http://127.0.0.1:45678/`, then verify:

- The select has one neutral border, a centered 16px chevron, and no heavy dark mouse-focus border.
- Tab focus produces the soft neutral halo.
- Opening search shows no suggestions or empty divider.
- Existing results remain visible during a replacement search.
- Light, dark, desktop, and 390px mobile layouts remain usable.

- [ ] **Step 6: Commit any verification-only test correction if required**

If verification reveals a test-only correction, stage only the search files and commit:

```bash
git add src/components/starlight/Search.astro src/scripts/search-controller.ts tests/e2e/search.spec.ts
git commit -m "test: cover stable search interactions"
```

If no correction is required, do not create an empty commit.
