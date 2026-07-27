# Hub navigation and typography refinement

**Date:** 2026-07-27  
**Status:** Approved design amendment

## Context

The migrated Hub documentation currently exposes the generated Starlight directory tree directly. This creates filesystem-style labels such as `getting-started`, adds a collapsible `Hub documentation` wrapper beneath the product switcher, and allows more than two nested collapsible groups. Its default desktop heading scale is also substantially larger than the BetterBoard documentation reference.

This amendment refines the existing Astro documentation-spaces design without changing the migrated content URLs or the space-switching model.

## Navigation behavior

The header keeps the left-aligned product identity and `Hub documentation` space switcher. The sidebar does not repeat `Hub documentation` as a collapsible group.

After removing that wrapper, the existing information hierarchy remains in place with a maximum of two collapsible levels:

1. A primary section such as `Getting started`, `Product`, or `Resources`.
2. A subsection such as `Setup guide`, `Updates`, or `How-tos`.

Pages below a third generated group retain their current order and routes but render directly inside the nearest second-level subsection. For example, pages currently nested under `Product → Updates → Settings` remain within `Updates`; `Settings` is not rendered as a third collapsible control.

The current page remains visibly selected using the existing quiet inset rule. Primary and secondary groups may be collapsed. The removed `Hub documentation` wrapper has no sidebar disclosure control.

Mobile navigation uses the same normalized hierarchy and labels as desktop.

## Labels

All visible sidebar labels use sentence case. Proper names, product terminology, and acronyms retain their required capitalization, including:

- Released
- Product Hub
- BetterBoard
- Jira
- Slack
- Confluence
- AI
- CSP
- URL
- ID

Sentence casing affects navigation labels only. It does not rename routes, assets, frontmatter titles, or technical identifiers.

## Typography

The documentation shell uses the Switzer family already included in the project and adopts a compact scale based on the BetterBoard documentation reference:

| Role | Size | Weight and line height |
| --- | ---: | --- |
| Page title / H1 | 32px | 700, 1.15 |
| H2 | 22px | 700, 1.25 |
| H3 | 18px | 600, 1.35 |
| H4 | 16px | 600, 1.4 |
| Body, lists, and tables | 16px | 400, 1.7 |
| Sidebar page links | 13.5px | 400; active links 600, 1.4 |
| Sidebar group labels | 12px | 600, 1.4 |
| On-page navigation | 13px | 400; active labels 600, 1.4 |
| Header and utility controls | 14px | 400–500, 1.4 |
| Captions and metadata | 12px | 400–500, 1.4 |

The scale applies consistently to migrated Hub articles and the shared documentation shell. Landing-page display typography remains intentionally separate.

## Implementation boundaries

- Preserve every existing `/guide/*` URL and fragment compatibility behavior.
- Normalize the sidebar data before Starlight renders it; do not simulate hierarchy changes with CSS.
- Keep Starlight’s accessible disclosure behavior for the two supported group levels.
- Use CSS variables and narrowly scoped shell selectors for typography rather than per-page overrides.
- Do not change article wording, content order, or product-switcher behavior as part of this refinement.

## Verification

Automated checks will cover:

- Hub routes no longer return a sidebar group labeled `Hub documentation`.
- The normalized Hub sidebar contains no group deeper than two collapsible levels.
- Representative generated labels are sentence case and preserve protected names and acronyms.
- Existing `/guide/*` route coverage remains unchanged.
- Desktop browser checks confirm the approved heading, body, sidebar, and on-page-navigation sizes.
- Mobile browser checks confirm the same hierarchy remains usable.
- The production build and existing focused navigation tests pass.
