# BB-40 Jira Assets Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish accurate BetterBoard documentation for the implemented Jira Assets scope and update BB-40 to describe the same deliverable.

**Architecture:** Add one authored Starlight page as the durable Assets overview, then link to it from the landing page and existing topic pages rather than duplicating the whole explanation. Keep the legacy 20-page migration inventory unchanged and add explicit build assertions for the new authored HTML and Markdown routes. Update Jira only after the local documentation passes verification.

**Tech Stack:** Astro 7, Starlight 0.41, MDX, Node test runner, Cheerio, Atlassian Rovo

## Global Constraints

- Document only behavior already established for the implemented BB-40 scope.
- Do not claim that BB-40 is deployed.
- Asset chips and Command K remain read-only.
- Group dragging is the supported Assets assignment path.
- Jira remains the source of truth for Assets field configuration.
- Do not modify the BetterBoard application or retired BetterBoard website.
- Keep the 20-page `betterBoardDocs` migration inventory and report unchanged.
- Add no dependency and no product screenshot.

---

## File structure

- `src/content/docs/betterboard/shape-the-board/jira-assets.mdx`: durable feature overview and limitations.
- `src/content/docs/betterboard/index.mdx`: BetterBoard landing-page discovery.
- `src/content/docs/betterboard/shape-the-board/display-fields.mdx`: card-display cross-link.
- `src/content/docs/betterboard/shape-the-board/field-types.mdx`: Assets field-type entry and cross-link.
- `src/content/docs/betterboard/shape-the-board/columns-grouping.mdx`: grouping support and column exclusion.
- `src/content/docs/betterboard/shape-the-board/card-colors.mdx`: Assets condition cross-link.
- `src/content/docs/betterboard/work-faster/filters-refinement.mdx`: Assets filter summary.
- `src/content/docs/betterboard/work-faster/filter-operators.mdx`: exact Assets operator reference.
- `src/content/docs/betterboard/work-faster/drag-and-drop.mdx`: Assets group-drag behavior.
- `tests/build/betterboard-routes.test.mjs`: authored route, landing link, sidebar order, and cross-link assertions.
- `tests/build/agent-markdown-output.test.mjs`: clean `.md` route and `llms.txt` discovery.

---

### Task 1: Publish the authored Jira Assets page

**Files:**

- Modify: `tests/build/betterboard-routes.test.mjs`
- Modify: `tests/build/agent-markdown-output.test.mjs`
- Create: `src/content/docs/betterboard/shape-the-board/jira-assets.mdx`
- Modify: `src/content/docs/betterboard/index.mdx`

**Interfaces:**

- Consumes: Starlight frontmatter with `space: betterboard` and `sidebar.order`.
- Produces: `/betterboard/shape-the-board/jira-assets/` and `/betterboard/shape-the-board/jira-assets.md`.

- [ ] **Step 1: Add failing authored-route assertions**

Add a separate build test in `tests/build/betterboard-routes.test.mjs` that:

```js
const route = '/betterboard/shape-the-board/jira-assets/';
const fileUrl = new URL(
  'betterboard/shape-the-board/jira-assets/index.html',
  distRoot
);
assert.equal(await exists(fileUrl), true);

const landing = load(
  await readFile(new URL('betterboard/index.html', distRoot), 'utf8')
);
assert.equal(landing(`main a[href="${route}"]`).length, 1);

const page = load(await readFile(fileUrl, 'utf8'));
assert.equal(page('main h1').first().text().trim(), 'Jira Assets');
assert.equal(
  page('[data-pagefind-filter="space:betterboard"]').length,
  1
);
```

Extend `tests/build/agent-markdown-output.test.mjs` to read:

```js
const assets = await readFile(
  new URL(
    '../../dist/betterboard/shape-the-board/jira-assets.md',
    import.meta.url
  ),
  'utf8'
);
assert.match(assets, /^# Jira Assets$/m);
assert.match(
  index,
  /https:\/\/docs\.released\.so\/betterboard\/shape-the-board\/jira-assets\.md/
);
```

- [ ] **Step 2: Run the production build tests and verify RED**

Run:

```sh
npm run test:build
```

Expected: FAIL because the Jira Assets HTML and Markdown routes do not exist and the landing page has no link.

- [ ] **Step 3: Author the page and landing entry**

Create `jira-assets.mdx` with:

```mdx
---
title: Jira Assets
description: >-
  Display linked Jira Assets objects on cards, filter and color work by object,
  and organise the board with Assets groups.
space: betterboard
sidebar:
  order: 5
---

import NeutralCallout from '../../../../components/content/NeutralCallout.astro';

BetterBoard supports Jira Assets object fields across card display, filters,
card colors, and grouping. Jira's Assets field configuration remains the source
of truth; BetterBoard does not add a separate schema or AQL configuration.

Common examples include affected services on incidents, computers on hardware
requests, people or locations on service requests, and affected hosts on
changes.

## Display linked objects on cards

Add an Assets field under **Display → Fields** to show its linked objects on
each card. BetterBoard renders each object as a compact icon-and-label chip.
BetterBoard shows the first two objects on the card. When the field contains
more values, the remaining labels are available from the `+N` overflow.

Empty Assets fields follow the same behavior as other empty fields and do not
take up space on the card.

<NeutralCallout type="note">

Assets chips are read-only. They show linked-object details but do not open an
editor or the native Assets object.

</NeutralCallout>

## Filter by linked objects

Assets fields use discrete-value filters:

- **is any of** — match a work item linked to at least one selected object
- **is none of** — exclude work items linked to any selected object
- **contains all** — for multiple-object fields, require every selected object
- **is empty** / **is not empty** — match whether the field has a value

Filter conditions compare object identity. Attributes such as service tier,
criticality, status, or warranty date cannot be filtered independently.

## Use Assets in card-color rules

Assets fields are available in single-color card conditions because card colors
reuse BetterBoard's filter conditions. Select an Assets field, operator, and
object value, then choose any eligible color effect.

Card-color conditions match linked object identity only. BetterBoard does not
offer Assets-specific color settings or attribute-based rules.

## Group by an Assets field

Choose an Assets field under **Display → Grouping** to create one group for each
linked object present on the board. Work items without a linked object appear
under **No value**.

A work item linked to multiple objects appears in every matching group.
BetterBoard does not load every object allowed by the Jira field just to create
empty groups.

## Assign objects by dragging between groups

When the board is grouped by an Assets field, dragging a card between groups
updates that field in Jira:

- For a single-object field, dropping in another object group replaces the
  current value.
- For a multiple-object field, the destination object is added, the source
  object is removed, and unrelated linked objects are preserved.
- Dropping in **No value** clears a single-object field or removes only the
  source object from a multiple-object field.

If Jira rejects the update, BetterBoard restores the previous group placement
and shows an error.

<NeutralCallout type="caution">

Direct Assets editing from a card or Command K is unavailable. Group dragging
is the supported way to change an Assets field in BetterBoard.

</NeutralCallout>

## Limitations

Assets fields cannot be:

- used as a column field or sort field
- set through BetterBoard's inline work item creation
- searched, linked, or unlinked directly from a card or Command K
- used to create, edit, delete, import, or administer Assets objects
- filtered, grouped, or colored by individual object attributes

Configure schemas, object scopes, searchable attributes, and permissions in
Jira Assets.
```

In `src/content/docs/betterboard/index.mdx`, insert:

```js
{
  href: '/betterboard/shape-the-board/jira-assets/',
  title: 'Jira Assets',
  description: 'Display, filter, color, and group work by linked Assets objects.'
},
```

between **Field types** and **Card colors**.

- [ ] **Step 4: Run the production build tests and verify GREEN**

Run:

```sh
npm run test:build
```

Expected: PASS with both Assets routes generated and indexed.

- [ ] **Step 5: Commit**

```sh
git add src/content/docs/betterboard/shape-the-board/jira-assets.mdx src/content/docs/betterboard/index.mdx tests/build/betterboard-routes.test.mjs tests/build/agent-markdown-output.test.mjs
git commit -m "docs: add Jira Assets guide"
```

---

### Task 2: Connect the existing BetterBoard topics

**Files:**

- Modify: `tests/build/betterboard-routes.test.mjs`
- Modify: `src/content/docs/betterboard/shape-the-board/display-fields.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/field-types.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/columns-grouping.mdx`
- Modify: `src/content/docs/betterboard/shape-the-board/card-colors.mdx`
- Modify: `src/content/docs/betterboard/work-faster/filters-refinement.mdx`
- Modify: `src/content/docs/betterboard/work-faster/filter-operators.mdx`
- Modify: `src/content/docs/betterboard/work-faster/drag-and-drop.mdx`

**Interfaces:**

- Consumes: `/betterboard/shape-the-board/jira-assets/`.
- Produces: contextual discovery from every existing feature surface affected by Assets.

- [ ] **Step 1: Add a failing cross-link build assertion**

Add this route list to the authored Assets build test:

```js
const relatedRoutes = [
  'betterboard/shape-the-board/display-fields/index.html',
  'betterboard/shape-the-board/field-types/index.html',
  'betterboard/shape-the-board/columns-grouping/index.html',
  'betterboard/shape-the-board/card-colors/index.html',
  'betterboard/work-faster/filters-refinement/index.html',
  'betterboard/work-faster/filter-operators/index.html',
  'betterboard/work-faster/drag-and-drop/index.html'
];

for (const relatedRoute of relatedRoutes) {
  const related = load(
    await readFile(new URL(relatedRoute, distRoot), 'utf8')
  );
  assert.equal(
    related(
      'main a[href="/betterboard/shape-the-board/jira-assets/"]'
    ).length > 0,
    true,
    `${relatedRoute} does not link to Jira Assets`
  );
}
```

- [ ] **Step 2: Run the build test and verify RED**

Run:

```sh
npm run test:build
```

Expected: FAIL naming each related page without the Jira Assets link.

- [ ] **Step 3: Add focused cross-links and reference copy**

Make these bounded content changes:

- `display-fields.mdx`: add Assets to the custom-field examples and link to
  `[Jira Assets](/betterboard/shape-the-board/jira-assets/)` after the field
  rendering list.
- `field-types.mdx`: add an **Assets fields** section describing icon-and-label
  chips, discrete-value filters, grouping, card colors, read-only chips, and
  the dedicated guide link.
- `columns-grouping.mdx`: add **Assets** to supported grouping fields and state
  that Assets cannot be a column field; link to the guide.
- `card-colors.mdx`: add a sentence under **Conditions** saying Assets fields
  use the same object-identity conditions and link to the guide.
- `filters-refinement.mdx`: add an **Assets fields** operator summary and link.
- `filter-operators.mdx`: add an **Assets operators** table containing
  `is any of`, `is none of`, `contains all`, `is empty`, and `is not empty`,
  then link to the guide.
- `drag-and-drop.mdx`: add **Moving between Assets groups** with the
  single-value, multiple-value, **No value**, and rollback behavior from the
  guide.

- [ ] **Step 4: Run the build tests and verify GREEN**

Run:

```sh
npm run test:build
```

Expected: PASS with every related page linking to the Assets guide.

- [ ] **Step 5: Commit**

```sh
git add src/content/docs/betterboard tests/build/betterboard-routes.test.mjs
git commit -m "docs: connect Jira Assets feature guidance"
```

---

### Task 3: Update and verify BB-40

**Files:**

- External update: `https://released.atlassian.net/browse/BB-40`

**Interfaces:**

- Consumes: the verified documentation scope from Tasks 1 and 2.
- Produces: a Jira description matching the published documentation without a deployment claim.

- [ ] **Step 1: Re-read BB-40 immediately before the write**

Use the connected Atlassian workspace to fetch BB-40's current `summary`,
`description`, `status`, and `updated` fields. Stop if another author has
materially changed its scope since the design was approved.

- [ ] **Step 2: Replace the description**

Set BB-40's description to:

```md
## Goal

Let users understand which Jira Assets objects a work item relates to and use
those linked objects to organise work directly from BetterBoard.

Jira's Assets custom field configuration remains the source of truth.
BetterBoard does not introduce a separate schema selector, attribute
configuration, or AQL editor.

## Customer outcomes

* See the service, device, person, location, system, or other object associated
  with work without opening the Jira work item.
* Focus the board around linked objects using filters, groups, and card colors.
* Update an Assets field by moving work between object groups.

Common examples include affected services on incidents, computers on hardware
requests, people or locations on service requests, and affected hosts on
changes.

## Implemented scope

### Display on cards

* Jira Assets object custom fields are recognised as a distinct supported field
  type.
* Assets fields can be selected for card display.
* Linked objects render as compact icon-and-label chips.
* The first two values remain visible on the card and additional values are
  exposed through an accessible `+N` overflow.
* Empty fields follow BetterBoard's existing empty-field behavior.
* If an object cannot be fully resolved, BetterBoard falls back to the object
  key or Jira-supplied value rather than breaking the card.

### Filtering

* Assets fields use discrete-value filter semantics.
* Single-object fields support **is any of**, **is none of**, **is empty**, and
  **is not empty**.
* Multiple-object fields additionally support **contains all**.
* Conditions match stable linked-object identity rather than object attributes.
* Existing linked values on the board remain available as filter choices.

### Card colors

* Assets fields are available in card-color conditions because card colors
  reuse BetterBoard's filter conditions.
* Assets card-color conditions use the same operators, values, and identity
  matching as filtering.
* All existing eligible color treatments apply.

### Grouping and assignment

* Assets fields can be used as the board's grouping field.
* Groups are derived from object values present on the board.
* Work items without a linked object appear in **No value**.
* A work item linked to multiple objects appears in every applicable group.
* Dragging to another object group updates the Jira Assets field.
* For a single-object field, a move replaces the current value.
* For a multiple-object field, a move adds the destination object, removes only
  the source object, and preserves unrelated linked objects.
* Moving to **No value** clears a single-object field or removes only the source
  object from a multiple-object field.
* Failed Jira updates roll back to the previous values and board placement.
* Inline work item creation is unavailable while grouping by Assets.

## Editing boundary

Assets chips are read-only. They display linked-object details but do not open
an Assets editor or the native Assets object. Command K does not offer Assets
field editing.

Configured Assets candidate search is not available through the supported
Forge boundary, so BetterBoard does not provide a broader or unrestricted
custom object picker. Group dragging is the supported path for changing Assets
values.

## Not included

* Searching, directly linking, replacing, or unlinking Assets objects from a
  card or Command K
* Opening the native Assets object from a card
* Creating, editing, deleting, importing, or administering Assets objects
* A separate AQL editor or board-specific object scope
* Exposing arbitrary object attributes as BetterBoard fields
* Attribute-based filtering, grouping, sorting, or coloring
* Using an Assets field as a board column field
* Sorting by an Assets field
* Setting Assets values through BetterBoard's inline work item creation

## Acceptance criteria

1. An Assets field can be displayed on a card as compact icon-and-label chips
   with accessible overflow.
2. Assets filters support the applicable discrete-value and empty-state
   operators.
3. Assets card-color conditions reuse those filter semantics and match linked
   object identity.
4. Grouping creates one group per object present on the board plus **No value**;
   multi-value work items appear in every applicable group.
5. Group moves update only the intended linked values, preserve unrelated
   values, and roll back on failure.
6. Asset chips and Command K remain read-only.
7. No Assets object is created, edited, deleted, imported, or administered by
   BetterBoard.
8. Assets fields remain unavailable for columns, sorting, and inline creation.
```

Do not transition the issue or add a comment.

- [ ] **Step 3: Re-read BB-40 and verify the write**

Fetch BB-40 again and confirm:

- the description includes **Implemented scope**, **Editing boundary**, and
  **Not included**;
- it does not claim direct search/link/unlink or native-object navigation;
- its status is unchanged;
- no comment was added.

---

### Task 4: Final repository verification

**Files:**

- Verify only; do not modify unrelated files.

**Interfaces:**

- Consumes: the completed documentation and Jira update.
- Produces: completion evidence for the user.

- [ ] **Step 1: Run focused validation**

Run:

```sh
npm run check:content-fixture
npm run validate:content
npm run test:unit
npm run test:build
git diff --check 07c4be2b
git status --short
```

Expected: every content/unit/build command passes, the diff has no whitespace
errors, and the status contains no unrelated changes.

- [ ] **Step 2: Inspect rendered output**

Start a local preview on an available permitted port and inspect:

- `/betterboard/shape-the-board/jira-assets/`
- `/betterboard/shape-the-board/jira-assets.md`
- `/betterboard/`

At desktop and mobile widths confirm:

- the page has no horizontal overflow;
- the callouts, lists, and headings are readable;
- the sidebar order is **Field types**, **Jira Assets**, **Card colors**;
- the landing link opens the Assets page;
- the browser console has no errors.

- [ ] **Step 3: Report the exact completion boundary**

Report the Jira description update, documentation routes, tests/build results,
commit hashes, and the fact that deployment was not verified or performed.
