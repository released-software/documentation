# Agent-ready page Markdown

## Goal

Make every published documentation entry easy for people and agents to consume as clean Markdown without exposing MDX imports or presentation-only component syntax.

## Scope

- Add a page-title action that copies the current documentation entry as Markdown.
- Add a secondary action that opens the same Markdown in a new tab.
- Publish a plain-text `.md` response for every public entry in the Starlight `docs` collection.
- Publish `/llms.txt` as an index of the available documentation entries.
- Exclude drafts, the generated component-test fixture, 404 content, custom non-documentation routes, AI chat provider actions, PDF export, and dynamic question answering.
- Do not add `displayAgentInstructions` or any other alternate response mode. The Markdown response is always the clean, cacheable representation.

## Interaction

The page title row contains a compact group of two equal icon buttons:

- The copy button uses a copy icon, fetches the entry’s `.md` URL, and writes it to the clipboard.
- The Markdown link uses a document-style Markdown icon and opens the same `.md` URL in a new tab.
- Custom tooltips appear on pointer hover and keyboard focus. They read **Copy page as Markdown** and **View page as Markdown**.
- Successful copying temporarily changes the copy tooltip to **Copied as Markdown** and announces the same result through an accessible live region.
- Clipboard or network failure leaves the page intact and announces a concise failure through the live region.
- Each action has an accessible name matching its default tooltip. The controls use native button and link keyboard behavior; there is no dropdown-specific keyboard state.
- The control is hidden from print output and is only rendered for public documentation collection entries.

The group follows the existing Released documentation tokens and stays visually secondary to the page title. On narrow screens it moves below the title rather than compressing or truncating it. Tooltips remain inside the viewport at desktop and mobile widths.

## Markdown URLs

The Markdown URL is derived from the public HTML pathname by removing the trailing slash and appending `.md`.

Examples:

- `/guide/getting-started/concepts/` → `/guide/getting-started/concepts.md`
- `/guide/` → `/guide.md`
- `/betterboard/start/quick-start/` → `/betterboard/start/quick-start.md`

Responses use `text/markdown; charset=utf-8` and include:

1. A single H1 from the entry title.
2. The page body as clean Markdown.

They do not include frontmatter, navigation, footer content, JavaScript, CSS, an agent-instructions preamble, or unsupported `ask`/`goal` guidance.

## Content conversion

Conversion happens at build time from the content entry’s MDX body using an AST-based pipeline. Standard Markdown remains standard Markdown. Known presentation components are reduced to portable equivalents:

- `Figure` → Markdown image, followed by its caption when present.
- `NeutralCallout` and Starlight asides → labelled blockquotes.
- `ResponsiveEmbed` → descriptive link to the source video.
- `LinkRow` → Markdown link with its description.
- `OverviewSection` → heading and linked list.
- `Steps` → its ordered content without the wrapper.
- `Tabs`/`TabItem` → labelled sections containing each tab’s content.
- MDX imports, exports, comments, layout wrappers, and presentation-only attributes are removed.

Unknown content-bearing components keep their readable children. Unknown empty components are omitted. This prevents component syntax from leaking while avoiding silent loss of authored prose.

## `llms.txt`

`/llms.txt` is generated from the same public entry set. It contains the site title, a short description, and links grouped by documentation space. Each link targets the clean `.md` URL and includes the entry description when available.

## Implementation boundaries

- Use Starlight’s page-title override point for the action placement.
- Keep Markdown path derivation and content conversion in small shared modules used by the page action, Markdown route, and `llms.txt` route.
- Keep the implementation independent of GitBook and do not advertise capabilities the site does not provide.
- Preserve unrelated worktree changes.

## Verification

- Unit tests cover path derivation and representative component conversion.
- Build tests prove `.md` and `/llms.txt` files are emitted with the correct content type and without MDX imports/component tags.
- End-to-end tests cover copy success, the direct Markdown link, tooltip visibility on focus, mobile layout, and light/dark presentation.
- Run type checking, focused tests, the production build, and the relevant end-to-end tests before completion.
