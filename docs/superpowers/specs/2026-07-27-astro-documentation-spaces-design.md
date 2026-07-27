# Astro Documentation Spaces Design

## Status

Approved for implementation on `feat/astro-documentation-spaces`.

All migration and implementation work stays on this branch until the project has passed route, content, build, search, accessibility, responsive, and visual verification. This work does not deploy or change `docs.released.so`.

## Goal

Convert the existing GitBook repository into one Astro documentation project with three clearly separated product spaces:

- Hub Documentation, migrated from the current GitBook content
- BetterBoard Documentation, migrated from `https://betterboard.work/docs/`
- Partner Documentation, represented by a coming-soon page

The new project must feel consistent with the Released marketing website while retaining the navigation, search, accessibility, and authoring features expected from a dedicated documentation site.

## Architecture

Use one Astro project with Starlight as the documentation foundation.

Starlight owns:

- Markdown and MDX content routing
- article layout and responsive behavior
- sidebar and mobile navigation mechanics
- tables of contents
- previous and next navigation
- code rendering
- metadata
- Pagefind indexing
- accessible documentation primitives

Custom Astro pages and Starlight component overrides own:

- the root documentation overview
- the documentation-space switcher
- space-aware sidebars
- scoped search
- Released visual styling
- migrated GitBook components

Do not create separate builds for each product space. All spaces share one theme, component library, build, deployment artifact, and search index.

## Routes and Information Architecture

```text
docs.released.so
├── /                         Documentation overview
├── /guide/                   Hub Documentation
│   ├── getting-started/
│   ├── product/
│   └── resources/
├── /betterboard/             BetterBoard Documentation
│   ├── start/
│   ├── board-setup/
│   ├── shape-the-board/
│   └── work-faster/
└── /partners/                Partner Documentation
                              Coming-soon page
```

### Hub

Keep the existing `/guide/*` routes even though the displayed product name becomes “Hub Documentation.”

The current GitBook repository path maps directly to a Starlight content path:

```text
README.md
→ src/content/docs/guide/index.mdx
→ /guide/

product/changelog/writing-a-post.md
→ src/content/docs/guide/product/changelog/writing-a-post.mdx
→ /guide/product/changelog/writing-a-post
```

Every public content route represented by the current `SUMMARY.md` must still resolve successfully after migration.

### BetterBoard

Migrate the existing BetterBoard content into clean `/betterboard/*` routes. Preserving individual `betterboard.work/docs/*` paths is not required.

Organize the content around the source site’s four existing themes:

- Start
- Board setup
- Shape the board
- Work faster

The BetterBoard space includes its overview, installation, quick start, FAQ, and all current feature documentation.

### Partner

`/partners/` is a branded coming-soon page with no article sidebar. It is excluded from Pagefind until substantive content exists.

### Root

`/` becomes the documentation overview instead of redirecting to `/guide`.

The existing canonical Hub overview remains `/guide`, so changing `/` does not move the current canonical content page.

## Navigation

### Header identity

The header’s left side contains:

1. the Released logo and wordmark
2. a neutral divider
3. the active documentation-space dropdown

Do not center the space switcher. Search remains aligned to the right.

The space dropdown:

- shows the active product logo and documentation-space name
- links to the landing page for Hub, BetterBoard, and Partner Documentation
- marks the active space with a check, not a status dot
- uses the product logo or a meaningful product mark before product names
- is keyboard navigable
- manages focus on open and close
- closes on Escape and outside click
- preserves a visible focus state

Never use status dots before titles, product names, labels, or other words.

### Sidebars

Article sidebars contain only the active space’s navigation.

The sidebar surface extends to the bottom of the viewport or document shell rather than ending at the final navigation item. On mobile it becomes Starlight’s accessible menu.

Partner’s coming-soon page and the root documentation overview do not show an article sidebar.

## Search

Use a single Pagefind index generated from the static build.

Each indexed page carries a documentation-space value:

- `hub`
- `betterboard`
- `partners`

Search defaults to the current space:

- `/guide/*` searches Hub
- `/betterboard/*` searches BetterBoard
- `/partners/*` searches Partner content once it exists
- `/` searches all documentation

The search dialog includes an explicit “All documentation” option. Changing the scope updates results immediately without navigating away.

The active scope is announced to assistive technology. Keyboard navigation, focus trapping, Escape behavior, and Starlight’s search shortcut remain available.

## Visual System

The documentation project follows the Released marketing design system in `/Users/jschumacher/Development/Released/released-website/docs/design-system.md`.

### Foundations

- Use Switzer as the only interface and content typeface.
- Use the website’s semantic surface, text, border, radius, and elevation tokens.
- Support System, Light, and Dark preferences.
- Use an off-white, nearly monochrome canvas.
- Use sentence case for navigation, buttons, headings, labels, and eyebrows.
- Keep standard content aligned to the shared content-width and responsive horizontal padding.
- Do not use violet as a generic highlight color.
- Color is limited to product logos, semantic states, and small meaningful product signals.

### Overview

The root overview uses the same editorial list pattern as the Released website’s how-to section.

Each product destination is a content-width row with:

- the product logo or meaningful mark
- a title
- a concise description
- a right-aligned arrow for active destinations
- a quiet divider between rows

Rows do not stretch beyond the standard content width. They are not rendered as filled panels and do not receive decorative shadows.

The full active row is a link. Its hover treatment may shift the arrow subtly. Keyboard focus remains clearly visible. The Partner row is visibly unavailable and has no navigation arrow while the space is coming soon.

### Article shell

Articles retain the conventional documentation layout:

- full-height left sidebar
- readable article column
- right-hand table of contents on wide viewports
- collapsed mobile navigation and table of contents

Typography, whitespace, alignment, and authentic product imagery carry the design. Decorative gradients, stars, floating shapes, colored headings, and ornamental numbering are not used.

### Callouts

Hints, notes, tips, and warnings use neutral surfaces, clear labels, and semantic copy or icons.

Do not use a colored top bar or left edge bar on callouts.

### Borders, panels, and elevation

- Use borders when they communicate a control, frame, table, or boundary.
- Keep ordinary information surfaces flat.
- Use the website’s radius scale.
- Reserve frame shadows for floating menus, browser frames, and popovers.

## Content Model

Store documentation in `src/content/docs/`.

Each page includes:

- `title`
- `description`
- sidebar order or label where required
- documentation-space metadata
- canonical metadata where the default URL is insufficient

Use MDX only when a migrated page requires a component. Keep ordinary prose in Markdown-compatible syntax.

Do not perform a global string replacement from “Released” to “Hub.” Update customer-facing terminology page by page while preserving:

- existing URLs
- code identifiers
- marketplace names
- configuration keys
- API values
- asset paths
- historical references where “Released” is the correct name

## GitBook Compatibility Layer

Convert GitBook-only constructs into explicit Starlight or local MDX components:

| GitBook construct | Astro/Starlight representation |
| --- | --- |
| `hint` | local neutral callout component |
| `stepper` and `step` | Starlight `Steps` |
| `tabs` and `tab` | Starlight `Tabs` and `TabItem` |
| `content-ref` | link row or link card appropriate to context |
| card tables | semantic overview or link-list components |
| figures | accessible local figure component |
| Loom and YouTube embeds | responsive media component |
| details | native semantic details or local disclosure component |
| standard tables | Markdown tables or semantic HTML tables |

The conversion must preserve:

- code samples
- internal and external links
- captions
- meaningful image dimensions
- local media
- accessible alternative text
- heading IDs used by existing inbound anchors

Copy all production media into organized local asset directories. Do not load documentation imagery from third-party hosts.

## URL Compatibility

Generate a legacy route manifest from the current `SUMMARY.md`.

A route regression test must verify that every listed `/guide/*` destination exists in the Astro output. A migration is not accepted if an existing Hub route becomes a 404.

Prefer keeping a route unchanged. When an unavoidable move is discovered, add an exact permanent redirect in Astro configuration and add both the source and destination to the route test. Do not redirect unrelated missing pages to a section homepage.

Also verify:

- heading anchors referenced by local links
- internal links
- image paths
- canonical URLs
- sitemap entries
- trailing-slash behavior

## Failure Behavior

The production build fails when:

- a content file cannot be parsed
- a required frontmatter field is missing
- an internal documentation link points to a missing page
- a local media reference is missing
- a legacy Hub route is absent
- Pagefind indexing fails

Unsupported GitBook constructs are reported with their source file and line number. They are not silently dropped.

Search with no matches presents a scoped empty state and offers “Search all documentation.” Search loading failures present a clear retry action and leave normal navigation usable.

## Testing and Verification

### Automated

- content schema tests
- GitBook conversion fixture tests
- legacy route manifest test
- internal-link and asset validation
- production Astro build
- Pagefind index generation
- search scope tests
- component tests for the documentation switcher
- keyboard and focus tests for the switcher and search

### Browser

Verify at desktop, tablet, and mobile widths:

- root documentation overview
- Hub landing and representative migrated articles
- BetterBoard landing and representative articles
- Partner coming-soon page
- dropdown positioning and keyboard interaction
- scoped and all-documentation search
- sidebar height and mobile navigation
- tables, callouts, tabs, steps, embeds, and figures
- light, dark, and system theme behavior
- reduced motion
- visible focus states
- no horizontal overflow

### Content sampling

Manually compare representative source and migrated pages for:

- simple prose
- multiple nested steps
- tabs
- hints
- card tables
- long standard tables
- code blocks
- videos and embeds
- animated media
- complex figures and captions

## Release Gate

Implementation remains on `feat/astro-documentation-spaces`.

Before any merge or live-domain change:

1. run the full automated verification suite
2. build the production site
3. inspect representative pages in a local production preview
4. verify every legacy Hub route
5. review scoped search results
6. complete responsive and accessibility checks
7. review the branch diff and confirm only documentation-project files are included

Merging, deployment, DNS changes, and switching `docs.released.so` are separate, explicitly approved actions.
