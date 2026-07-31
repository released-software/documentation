# BetterBoard field capabilities design

## Goal

Make **Field types** the single BetterBoard reference for field support, while
keeping filter operators in the filter documentation and removing the dedicated
Jira Assets article.

## Information architecture

`/betterboard/shape-the-board/field-types/` becomes the canonical field
reference. It starts with one capability matrix covering the supported system,
custom, and synthetic field types. The matrix columns are:

| Field type | Display | Filter | Grouping | Columns | Edit |
| --- | --- | --- | --- | --- | --- |

**Edit** means direct inline/card editing only. Group dragging is not a matrix
capability because grouping uses the normal update behaviour for every
groupable field. A field-specific exception is described only where necessary.

The matrix states that every filterable field is also eligible for card-color
conditions. Card colors does not receive a separate column because it repeats
the filtering capability.

## Detail sections

The matrix provides the overview. Short sections remain only where a field has
behaviour that cannot be expressed clearly in a cell:

- **Assets**: chip display and overflow, object-identity filtering, no direct
  editing, and group-drag assignment.
- **Sprint**: its specialised filter choices.
- **Time in Status** and **Blockers**: their synthetic nature and behaviour.

The dedicated `/betterboard/shape-the-board/jira-assets/` article is removed.
All internal references point to the Assets section in Field types instead.

## Filter and card-color documentation

`Filters and refinement` and `Filter operators` group operators by field
behaviour, rather than repeating operators for every row in Field types. The
groups are selection, multi-value selection, people, text, number, date,
boolean, and synthetic fields. Assets appears in the multi-value selection
group, with its object-identity limitation stated once.

The Card colors guide states that its conditions use the same filterable fields
and matching semantics as filters. It links to the filter operator reference
instead of maintaining its own field list.

## Scope and constraints

- Preserve the BetterBoard landing page and sidebar ordering after the Assets
  article is removed.
- Preserve generated Markdown and Pagefind behaviour for Field types.
- Do not alter existing migration inventories or introduce a redirect for the
  never-published Assets documentation route.
- Keep the documentation accurate to the currently documented BetterBoard
  capabilities; do not infer new product support.

## Verification

Build tests verify the dedicated Assets route is absent, the landing page no
longer links to it, the Field types page has the matrix and Assets anchor, and
the relevant guides link to that anchor. Content validation, unit tests, and
the production build remain green.
