# Two-button Markdown Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the page-title Markdown dropdown with two equal icon actions whose tooltips explain copying and opening the raw Markdown page.

**Architecture:** Keep the existing Starlight `PageTitle` override and Markdown route. Simplify its custom element to own only clipboard behavior; use a native anchor for the raw Markdown action and CSS tooltips driven by accessible labels and tooltip text attributes.

**Tech Stack:** Astro 7, Starlight, TypeScript in Astro components, CSS, Playwright.

## Global Constraints

- Keep the existing `.md` routes and `/llms.txt` behavior unchanged.
- Use two equal 36px icon actions in one bordered group.
- Tooltips must appear on pointer hover and keyboard focus.
- Copy success must announce **Copied as Markdown** visually and through the existing live region.
- Preserve native button and link keyboard behavior.
- Preserve unrelated worktree changes.

---

### Task 1: Specify the two-button interaction

**Files:**
- Modify: `tests/e2e/shell.spec.ts:586-646`

**Interfaces:**
- Consumes: Existing `[data-copy-page]`, `[data-page-actions]`, and generated `.md` endpoint.
- Produces: Browser expectations for accessible names, focus tooltips, direct Markdown navigation, clipboard success, and mobile containment.

- [x] **Step 1: Replace the dropdown expectations with direct-action expectations**

Update the existing page Markdown action test to locate:

```ts
const copy = page.getByRole('button', { name: 'Copy page as Markdown' });
const view = page.getByRole('link', { name: 'View page as Markdown' });
```

Assert that focusing each action reveals its associated tooltip, that the view link points directly to `/guide/getting-started/concepts.md` in a new tab, and that copying changes the copy tooltip to `Copied as Markdown`.

- [x] **Step 2: Run the focused tests to verify RED**

Run:

```bash
npx playwright test tests/e2e/shell.spec.ts --grep "page Markdown actions"
```

Expected: FAIL because the current component still exposes `Copy page`, a menu trigger, and a menu item.

### Task 2: Implement the icon group and tooltips

**Files:**
- Modify: `src/components/starlight/PageTitle.astro`

**Interfaces:**
- Consumes: `markdownPath`, the existing `.md` response, and the existing live region.
- Produces: `[data-copy-page]` button and `[data-view-markdown]` link with `aria-label` and `data-tooltip`.

- [x] **Step 1: Replace the split-button markup**

Render a copy button and a direct anchor:

```astro
<button
  aria-label="Copy page as Markdown"
  data-copy-page
  data-tooltip="Copy page as Markdown"
  type="button"
>
  <!-- copy icon -->
</button>
<a
  aria-label="View page as Markdown"
  data-tooltip="View page as Markdown"
  data-view-markdown
  href={markdownPath}
  rel="noopener"
  target="_blank"
>
  <!-- Markdown document icon -->
</a>
```

- [x] **Step 2: Remove dropdown-only JavaScript**

Delete trigger, menu, menu-item, outside-pointer, ArrowDown, and Escape state. Keep the copy request, clipboard write, live-region announcement, and reset timer. Update `data-tooltip` to `Copied as Markdown` after success, then restore `Copy page as Markdown`.

- [x] **Step 3: Replace menu CSS with icon and tooltip CSS**

Give both controls equal 2.25rem dimensions and a shared divider. Render the tooltip from `data-tooltip` with `::after` on hover and `:focus-visible`, align it to the inline end of the group, and keep it within the mobile viewport. Preserve existing light/dark tokens, print hiding, focus styles, and title-row stacking.

- [x] **Step 4: Run the focused tests to verify GREEN**

Run:

```bash
npx playwright test tests/e2e/shell.spec.ts --grep "page Markdown actions"
```

Expected: 2 tests pass.

### Task 3: Verify presentation and repository health

**Files:**
- Verify: `src/components/starlight/PageTitle.astro`
- Verify: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: Completed two-button UI.
- Produces: Visual and automated evidence that the refinement is complete.

- [x] **Step 1: Build and visually inspect**

Run a production build and preview on a clean local port. Inspect dark and light themes with both tooltips visible in turn. Confirm the group remains secondary to the title and does not overflow at 390px.

- [x] **Step 2: Run the complete test suite**

Run:

```bash
PLAYWRIGHT_PORT=4326 npm test
```

Expected: typecheck, 70 unit tests, 15 build tests, 65 production E2E tests, and 1 development E2E test pass.

- [x] **Step 3: Check the final diff**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; unrelated dirty files remain preserved.
