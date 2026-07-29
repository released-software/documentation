# Linear-inspired documentation content

**Date:** 2026-07-28

**Status:** Approved direction pending written-spec review

**Selected direction:** Direct Linear calibration

## Purpose

Refine documentation articles using the narrow reading measure, restrained typography, and deliberate vertical rhythm of Linear’s documentation while retaining Released’s Switzer typeface, neutral palette, documentation navigation, and content components.

This change applies to Starlight documentation articles. It does not restyle the documentation landing pages, left navigation, right table of contents, header controls, or product-space switcher.

## Reference measurements

At a 1908px desktop viewport:

| Role | Current Released docs | Linear reference | Approved target |
| --- | ---: | ---: | ---: |
| Article width | 960px | 650px | 650px |
| Body | 16px / 27.2px | 15px / 24px | 15px / 24px |
| H1 | 32px / 36.8px, 700 | 32px / 36px, variable 590 | 32px / 36px, 600 |
| H2 | 22px / 27.5px, 700 | 24px / 31.92px, variable 590 | 24px / 32px, 600 |
| H3 | 18px / 24.3px, 600 | — | 18px / 24px, 600 |

Linear uses Inter Variable. Released keeps Switzer and translates the reference weights to the available 600 font file.

## Reading column

- Documentation article content has a maximum width of 650px.
- The page title and Markdown body share the same left and right edges.
- The 650px measure applies to text, callouts, tables, media, and code blocks within an article.
- The right-hand table of contents remains in its current column.
- The article column remains fluid below 650px and retains Starlight’s responsive content padding.
- The global `--released-content` token remains 960px because landing pages and other wide surfaces still use it.
- The narrower width is scoped through Starlight’s article-level `--sl-content-width` value rather than changing shared landing-page layout tokens.

## Typography

All article typography remains Switzer:

| Role | Size | Weight | Line height | Letter spacing |
| --- | ---: | ---: | ---: | ---: |
| Page title | 32px | 600 | 36px | -0.02em |
| H2 | 24px | 600 | 32px | -0.012em |
| H3 | 18px | 600 | 24px | -0.006em |
| H4 | 15px | 600 | 22px | normal |
| Body, lists, callouts | 15px | 400 | 24px | -0.005em |
| Inline code | inherit surrounding text | 500 | inherit | normal |

The existing Released ink tokens remain unchanged. Headings use primary ink; body content uses soft ink. Links continue to use the established understated text-link treatment.

## Vertical rhythm

The article reads as one continuous document rather than two stacked panels:

- Remove the divider between Starlight’s title panel and Markdown content panel on article pages.
- Keep 48px of desktop space above the page title.
- Place the first Markdown element 24px after the page title.
- Use 16px between ordinary body blocks such as paragraphs, lists, tables, callouts, media, and code blocks.
- Give H2 headings 56px of separation from preceding content.
- Give H3 headings 40px of separation from preceding content.
- Give H4 headings 32px of separation from preceding content.
- Use 12px between a heading and the content that immediately follows it.
- Preserve component-owned internal spacing inside callouts, tabs, steps, figures, and code blocks.

The spacing rules apply only when elements are present; they do not create empty spacer elements.

## Responsive behavior

- At desktop widths, the article is capped at 650px and positioned using Starlight’s existing content-grid alignment.
- At tablet and mobile widths, the article uses the available width minus Starlight’s responsive page padding.
- Font sizes remain fixed at the approved article scale down to mobile; the 32px title already fits the supported 390px viewport.
- Tables and code blocks retain their existing horizontal overflow behavior.
- Embedded media remains responsive within the narrower article measure.
- Print styles continue to use Starlight’s 100% print content width.

## Accessibility and semantics

- Heading levels and page-title semantics do not change.
- Every article continues to render exactly one H1.
- The narrower measure improves reading line length without changing content order.
- Focus styles, link semantics, table semantics, reduced-motion behavior, and responsive navigation remain unchanged.

## Implementation boundaries

- Update article-scoped layout and type tokens in `src/styles/starlight.css`.
- Do not change `--released-content` in `src/styles/tokens.css`.
- Do not modify migrated Markdown or MDX to achieve the visual rhythm.
- Do not change Starlight component markup solely for styling.
- Do not restyle the left sidebar, right table of contents, header, documentation-space landing pages, or content component surfaces as part of this change.
- Retain the existing neutral color system and Switzer font assets.

## Verification

Automated and browser checks will confirm:

- A desktop article title and Markdown body both resolve to a 650px column.
- Body copy resolves to 15px / 24px.
- H1, H2, H3, and H4 resolve to the approved size, weight, line height, and letter spacing.
- The title/body divider is absent on article pages.
- Heading-to-content and section-to-section spacing follows the approved rhythm.
- The content remains fluid and free of horizontal page overflow at desktop, tablet, and 390px mobile widths.
- Tables, callouts, code blocks, media, and provider embeds remain bounded by or scroll safely within the article.
- Documentation landing pages, sidebars, the right table of contents, and header controls retain their existing layout and typography.
- Existing duplicate-title, navigation, accessibility, link, asset, canonical URL, sitemap, and legacy-route checks remain green.
- Astro checks, unit tests, the documentation-shell browser suite, and the production build pass.
