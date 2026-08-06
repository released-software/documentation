# BetterBoard How-to Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seven BetterBoard-only how-to pages and expose them consistently through BetterBoard navigation, overview, build metadata, and tests.

**Architecture:** Add a `how-to` BetterBoard content folder that follows the existing MDX conventions. Extend the centralized BetterBoard document mapping and sidebar ordering so overview links, build checks, and search metadata use the same route inventory.

**Tech Stack:** Astro 7, Starlight, MDX, Node test runner, Playwright.

## Global Constraints

- Include only the BetterBoard portions of the seven public how-to guides.
- Use `work items`, `spaces`, and `board` terminology.
- Do not modify the public website in this pass.
- Put `How-to` after `Work faster` in BetterBoard navigation.
- Add no dependencies.

---

### Task 1: Extend the BetterBoard route inventory and overview

**Files:**
- Modify: `src/data/betterboard-docs.mjs`
- Modify: `src/data/betterboard-docs.d.mts`
- Modify: `src/data/sidebar.ts`
- Modify: `src/content/docs/betterboard/index.mdx`
- Test: `tests/e2e/betterboard-content.spec.ts`

**Interfaces:**
- Consumes: `betterBoardDocs`, whose objects have `sourceSlug`, `destinationSlug`, `section`, `title`, and `order`.
- Produces: seven `how-to` map entries and a fifth overview/sidebar category.

- [ ] **Step 1: Write the failing navigation assertions**

Change the overview test to expect 27 `[data-overview-link]` elements, the five labels `Start`, `Board setup`, `Shape the board`, `Work faster`, and `How-to`, and direct links to `/betterboard/how-to/bulk-edit-work-items-on-a-jira-board/` and `/betterboard/how-to/create-a-personal-my-work-board-across-all-your-jira-spaces/`. Change the sidebar expectation to five labels in that order.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npx playwright test tests/e2e/betterboard-content.spec.ts --grep "landing links|ordered sentence"`

Expected: FAIL because the overview has 20 links and no How-to group.

- [ ] **Step 3: Add the centralized inventory and navigation**

Add `how-to` to the section unions. Append seven map entries with the exact slugs from the design, titles matching the future page H1s, and `order: 1` through `7`. Add `['How-to', 5]` to `betterBoardCategoryOrder`. Add an `OverviewSection` titled `How-to` that links to all seven exact routes.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npx playwright test tests/e2e/betterboard-content.spec.ts --grep "landing links|ordered sentence"`

Expected: PASS.

### Task 2: Add BetterBoard-only how-to articles

**Files:**
- Create: `src/content/docs/betterboard/how-to/bulk-edit-work-items-on-a-jira-board.mdx`
- Create: `src/content/docs/betterboard/how-to/move-multiple-tickets-to-the-next-sprint-in-jira.mdx`
- Create: `src/content/docs/betterboard/how-to/see-work-items-from-multiple-jira-spaces-on-one-board.mdx`
- Create: `src/content/docs/betterboard/how-to/filter-a-jira-board-without-writing-jql.mdx`
- Create: `src/content/docs/betterboard/how-to/group-a-jira-board-by-assignee-priority-or-any-field.mdx`
- Create: `src/content/docs/betterboard/how-to/show-custom-fields-on-jira-board-cards.mdx`
- Create: `src/content/docs/betterboard/how-to/create-a-personal-my-work-board-across-all-your-jira-spaces.mdx`
- Test: `tests/e2e/betterboard-content.spec.ts`

**Interfaces:**
- Consumes: Task 1's seven `destinationSlug` values and existing BetterBoard documentation routes.
- Produces: seven MDX pages with `space: betterboard`, matching titles, and sidebar ordering.

- [ ] **Step 1: Write the failing content-boundary test**

Add a Playwright test that visits the bulk-edit page, expects its BetterBoard H1, `How to bulk edit work items`, and an inline-editing link, and asserts the main content does not contain `Company-managed board` or `Team-managed board`. Add one assertion that the My work page links to multi-space boards and filters/refinement.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npx playwright test tests/e2e/betterboard-content.spec.ts --grep "how-to"`

Expected: FAIL because the how-to routes do not exist.

- [ ] **Step 3: Write the seven MDX pages**

For each page, include its BetterBoard source introduction, a `## How to …` ordered procedure, and the source BetterBoard tip as a `NeutralCallout` where present. Link the subjects to existing docs: inline editing, sprint management, multi-space boards, filters/refinement, columns/grouping, and display fields. Do not include native Jira sections, FAQ content, author attribution, or marketing copy.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npx playwright test tests/e2e/betterboard-content.spec.ts --grep "how-to"`

Expected: PASS.

### Task 3: Verify the generated documentation inventory

**Files:**
- Modify: `tests/build/betterboard-routes.test.mjs`
- Modify: `tests/e2e/betterboard-content.spec.ts`

**Interfaces:**
- Consumes: Task 1's 27-entry `betterBoardDocs` array and Task 2's MDX routes.
- Produces: build assertions for every documented BetterBoard route and representative mobile rendering coverage.

- [ ] **Step 1: Write the failing build expectation**

Rename the first build test to refer to all mapped articles and add `assert.equal(betterBoardDocs.length, 27)`. Update the migration-report test so it does not falsely require the historical 21-page migration report to include the seven manually authored how-tos; assert its report counts remain 21 and that the mapped report slugs equal only the non-How-to mappings. Add `/betterboard/how-to/filter-a-jira-board-without-writing-jql/` as the mobile representative.

- [ ] **Step 2: Run the build test to verify it fails**

Run: `npm run build && node --test tests/build/betterboard-routes.test.mjs`

Expected: FAIL until Tasks 1 and 2 create all mapped outputs and reconcile the historical migration assertion.

- [ ] **Step 3: Make assertions match the two source inventories**

Use the `section !== 'how-to'` filter in the migration-report assertion, retaining 21 report pages while requiring build outputs and BetterBoard Pagefind metadata for all 27 current mappings.

- [ ] **Step 4: Run focused and full verification**

Run: `npm run validate:content && npm run check && npm run test:unit && npm run test:build && npx playwright test tests/e2e/betterboard-content.spec.ts`

Expected: every command exits 0; report any unrelated pre-existing failures separately.

- [ ] **Step 5: Inspect generated pages and commit**

Inspect `dist/betterboard/index.html` and `dist/betterboard/how-to/bulk-edit-work-items-on-a-jira-board/index.html` for overview links, article heading, and `space:betterboard` Pagefind metadata. Run `git diff --check`, then commit all implementation files with `feat: add BetterBoard how-to documentation`.
