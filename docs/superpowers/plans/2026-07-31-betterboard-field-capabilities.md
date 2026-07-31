# BetterBoard Field Capabilities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate BetterBoard field support into one Field types capability matrix and remove the dedicated Jira Assets guide.

**Architecture:** `field-types.mdx` becomes the canonical source for supported field capabilities and exceptional field behaviour. The filter pages describe operators by behaviour, while existing pages link to the Assets section anchor. Build tests assert public output.

**Tech Stack:** Astro, Starlight, MDX, Node test runner, Cheerio.

## Global Constraints

- The matrix columns are Field type, Display, Filter, Grouping, Columns, and Edit.
- Edit means direct inline/card editing only.
- Every filterable field is eligible for card-color conditions; do not add a card-colors column.
- Group dragging is documented only as a field-specific exception.
- Preserve the 20-item BetterBoard migration inventory and do not imply deployment.

---

### Task 1: Consolidate the canonical field reference

**Files:**

- Modify: `tests/build/betterboard-routes.test.mjs`
- Modify: `tests/build/agent-markdown-output.test.mjs`
- Modify: `src/content/docs/betterboard/index.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/field-types.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/card-colors.mdx`
- Delete: `src/content/docs/betterboard/shape-the-board/jira-assets.mdx`

**Interfaces:**

- Produces: `#assets` on `/betterboard/shape-the-board/field-types/` as the canonical Assets destination.

- [ ] **Step 1: Write the failing build test**

Replace Assets-route assertions with checks for the Field types Assets anchor,
the six matrix headings, absence of the old HTML route, absence of its landing
link, and absence of its generated Markdown/`llms.txt` entry.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:build`

Expected: the old route remains and Field types lacks the anchor and matrix.

- [ ] **Step 3: Implement the canonical Field types reference**

Replace the system/custom operator tables with one capability matrix using the
currently documented field support. Add an Assets section covering chips and
overflow, object identity, no direct editing, and group-drag assignment. State
once that filterable fields are also available in single-color conditions.
Delete `jira-assets.mdx`, remove its landing item, and restore Card colors to
sidebar order 5.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:build`

Expected: Field types is the canonical reference, the route is absent, and all
build tests pass.

- [ ] **Step 5: Commit**

Run: `git add tests/build/betterboard-routes.test.mjs tests/build/agent-markdown-output.test.mjs src/content/docs/betterboard/index.mdx src/content/docs/betterboard/shape-the-board/field-types.mdx src/content/docs/betterboard/shape-the-board/card-colors.mdx src/content/docs/betterboard/shape-the-board/jira-assets.mdx && git commit -m "docs: consolidate BetterBoard field capabilities"`

### Task 2: Centralize operator guidance and assets links

**Files:**

- Modify: `tests/build/betterboard-routes.test.mjs`
- Modify: `src/content/docs/betterboard/shape-the-board/display-fields.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/columns-grouping.mdx`
- Modify: `src/content/docs/betterboard/work-faster/drag-and-drop.mdx`
- Modify: `src/content/docs/betterboard/work-faster/filters-refinement.mdx`
- Modify: `src/content/docs/betterboard/work-faster/filter-operators.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/card-colors.mdx`

**Interfaces:**

- Consumes: `/betterboard/shape-the-board/field-types/#assets`.

- [ ] **Step 1: Write the failing link test**

Change the related-guide destination to `/betterboard/shape-the-board/field-types/#assets` and assert all six related guides link to it.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:build`

Expected: related guides still link to the removed route.

- [ ] **Step 3: Implement shared references and operator groups**

Retarget every Assets link to the Field types anchor. Group filter operators by
selection, multi-value selection, people, text, number, date, boolean, and
synthetic behaviour. Include Assets in multi-value selection and state that it
matches object identity, not attributes. State in Card colors that it uses all
filterable fields and matching semantics.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:build`

Expected: every related guide links to the Field types Assets anchor and all
build tests pass.

- [ ] **Step 5: Commit**

Run: `git add tests/build/betterboard-routes.test.mjs src/content/docs/betterboard/shape-the-board/display-fields.mdx src/content/docs/betterboard/shape-the-board/columns-grouping.mdx src/content/docs/betterboard/work-faster/drag-and-drop.mdx src/content/docs/betterboard/work-faster/filters-refinement.mdx src/content/docs/betterboard/work-faster/filter-operators.mdx src/content/docs/betterboard/shape-the-board/card-colors.mdx && git commit -m "docs: centralize BetterBoard filter guidance"`

### Task 3: Final verification

**Files:** Verify only.

- [ ] **Step 1: Run checks**

Run: `npm run check:content-fixture`, `npm run validate:content`, `npm run test:unit`, `npm run test:build`, `git diff --check 9a1ce90c`, and `git status --short`.

Expected: all checks pass and no unrelated files change.

- [ ] **Step 2: Inspect rendered output**

Run the built documentation locally and confirm the Field types matrix is
readable and its Assets section appears in the table of contents.
