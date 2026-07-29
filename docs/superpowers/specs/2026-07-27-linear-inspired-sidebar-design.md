# Linear-inspired Hub sidebar

**Date:** 2026-07-27  
**Status:** Approved visual direction pending written-spec review  
**Selected direction:** A — Shallow Linear

## Purpose

Refine the Hub documentation sidebar using the structural clarity and compact rhythm of Linear’s documentation navigation while retaining Released’s Switzer typeface, neutral palette, product switcher, and existing URL structure.

This change applies to the left documentation sidebar. It does not restyle article typography, the on-page table of contents, or the documentation landing page.

## Information architecture

The Hub sidebar has one collapsible group level. Articles appear directly beneath their category; there are no collapsible subcategories.

The visible category order is:

1. `Overview` — direct link
2. `Getting started`
3. `Best practices`
4. `Administration`
5. `Portals`
6. `Feedback`
7. `Roadmaps & ideas`
8. `Changelog`
9. `Integrations`
10. `AI tips`
11. `Troubleshooting`
12. `How-tos`
13. `Product tour`

Generated folder wrappers are normalized as follows:

- `Setup guide` is removed as a visible group. Its articles become direct children of `Getting started`, after `Concepts`.
- `Best practices` is promoted from beneath `Getting started` to a top-level category.
- `Resources` is removed as a visible wrapper. `AI tips`, `Troubleshooting`, and `How-tos` become top-level categories.
- `Settings` is removed from beneath `Product tour`. Its articles become direct children of `Product tour`.
- Deeper generated folders beneath a category are flattened into that category while preserving article order.
- A folder overview link is omitted when its label duplicates the category label. Differently named overview links remain.

This is navigation-only normalization. Source files, slugs, canonical URLs, links, fragments, redirects, and the `/guide/product/...` route structure remain unchanged.

## Disclosure behavior

- On `/guide/`, all categories are collapsed.
- On an article route, the category containing the current page opens automatically.
- Other categories remain collapsed on the initial page load.
- Users may open multiple categories while viewing a page.
- Following an article link initializes the next page with its active category open; manually opened inactive categories do not require cross-page persistence.
- Category controls retain native keyboard and screen-reader disclosure semantics.
- Desktop and mobile use the same normalized hierarchy and state rules.

## Typography

The sidebar remains entirely Switzer:

| Role | Size | Weight | Line height |
| --- | ---: | ---: | ---: |
| Category | 13px | 400 | 1.4 |
| Open category | 13px | 500 | 1.4 |
| Article link | 12.5px | 400 | 1.4 |
| Current article | 12.5px | 600 | 1.4 |
| Overview link | 13px | 400; 600 when current | 1.4 |

All labels remain in sentence case. Protected product names and acronyms retain their approved capitalization.

## Styling

The sidebar uses the existing Released tokens:

- **Canvas:** `#fcfcfc`
- **Primary ink:** `#0d0d0d`
- **Secondary ink:** `#3f4145`
- **Muted ink:** `#5d6065`
- **Structural line:** `#e8e8e5`

Dark mode continues to use the existing token inversion.

The visual treatment is deliberately flat:

- No connector lines between hierarchy levels.
- No status dots or decorative bullets.
- No generic icons before category or article names.
- No cards, panels, or filled category backgrounds.
- A muted right-facing chevron identifies a collapsed category.
- The chevron rotates downward for an open category.
- The open category changes from secondary ink to primary ink and medium weight.
- The current article retains the 2px primary-ink inset marker, transparent background, and semibold label.
- Category rows are 34px high.
- Article rows are at least 30px high and indent 24px from the sidebar content edge.
- Top-level spacing remains even; expansion adds only the space required by visible article links.

The product identity and space switcher remain in the header. The sidebar does not repeat `Hub documentation`.

## Motion

Opening and closing a category uses the existing restrained disclosure animation:

- 160ms size transition using the current ease-out curve.
- 120ms opacity transition.
- Chevron rotation follows the same 160ms timing.
- `prefers-reduced-motion: reduce` removes the transition.

## Implementation boundaries

- Normalize generated Hub sidebar entries in `src/data/sidebar.ts`; do not hide structural levels with CSS.
- Mark generated Hub groups as collapsed by default before Starlight renders them.
- Keep Starlight’s semantic `details` and `summary` controls.
- Scope visual overrides to the sidebar shell in `src/styles/starlight.css`.
- Do not modify migrated article files to achieve the navigation hierarchy.
- Do not change BetterBoard or Partner sidebar data as part of this work.

## Verification

Automated and browser checks will confirm:

- `/guide/` renders every Hub category collapsed.
- A direct article load opens only the category containing the current page.
- The rendered Hub sidebar has at most one collapsible group level.
- `Setup guide`, `Resources`, and `Settings` are absent as visible groups.
- `Best practices`, `AI tips`, `Troubleshooting`, and `How-tos` are top-level categories.
- Article order and sentence-case labels remain correct.
- Current-page styling, keyboard disclosure behavior, animation, and reduced-motion behavior remain intact.
- The mobile menu exposes the same hierarchy.
- All 84 legacy Hub routes, built links, fragments, media references, canonical URLs, and sitemap entries remain valid.
- Astro checks, unit tests, the documentation-shell browser suite, and the production build pass.
