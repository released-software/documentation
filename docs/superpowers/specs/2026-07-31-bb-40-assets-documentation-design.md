# BB-40 Jira Assets documentation

## Goal

Document the Jira Assets behavior implemented for BetterBoard and make BB-40
describe that same deliverable. The documentation must distinguish the
available board features from the direct Assets editing that is not available.

## Scope

### Jira

Retain BB-40's customer problem and examples, then replace the proposed
implementation scope and acceptance criteria with:

- an **Implemented scope** section covering card display, accessible overflow,
  filtering, card colors, grouping, and assignment by dragging between groups;
- an **Editing boundary** section stating that Asset chips and Command K are
  read-only, configured object search is unavailable, and inline creation does
  not set Assets fields;
- a concise **Not included** section covering Assets administration, arbitrary
  AQL, attribute-based board behavior, Assets columns, and Assets sorting.

The description must not claim that users can search for, directly link,
unlink, or open Assets objects from cards. It must not claim that the feature
has been deployed.

### Documentation

Add `/betterboard/shape-the-board/jira-assets/` as the durable overview for the
feature. Place it in **Shape the board** after **Field types** and before
**Card colors**.

The page will explain:

1. Jira's Assets field configuration remains the source of truth.
2. Adding an Assets field to card display shows linked objects as icon-and-label
   chips, with additional values available through the `+N` overflow.
3. Assets fields support discrete-value filters and reuse those conditions for
   card colors.
4. Grouping creates groups from object values already present on the board,
   includes **No value**, and can place a multi-value work item in more than one
   group.
5. Dragging between Assets groups is the supported assignment path, with
   separate behavior for single-value and multiple-value fields.
6. Direct card and Command K editing, inline creation, columns, sorting,
   attribute-based rules, and Assets object administration are unavailable.

Update the BetterBoard landing page to link to the new page. Add short,
contextual cross-links from the existing display fields, field types, columns
and grouping, filters, filter operators, card colors, and drag-and-drop pages.
Do not repeat the complete feature explanation on every page.

## Source and navigation

The new page is authored directly in this documentation repository. Starlight
will discover it for the sidebar and agent-readable Markdown. Add an explicit
build assertion for the route and landing-page link.

Keep the existing 20-page `betterBoardDocs` inventory and migration report
unchanged: they describe the one-time import from the retired BetterBoard
website, not every page authored after that migration. Do not modify the
BetterBoard application repository or the retired website source.

## Verification

- Validate the existing BetterBoard migration tests and the new authored route.
- Build the site from current sources.
- Confirm the new HTML and `.md` routes exist.
- Confirm the landing page and relevant topic pages link to the new route.
- Confirm the sidebar position is **Field types**, **Jira Assets**, **Card
  colors**.
- Check the rendered page at desktop and mobile widths for readable tables,
  lists, callouts, and no horizontal overflow.
- Re-read BB-40 after updating it and confirm the description matches the
  documentation without claiming deployment.

## Excluded

- Changes to the BetterBoard application or its tests
- Changes to the legacy BetterBoard website
- Product screenshots or new media
- Jira status transitions, comments, or release/deployment claims
- Documentation for the unimplemented Assets search/editor flow
