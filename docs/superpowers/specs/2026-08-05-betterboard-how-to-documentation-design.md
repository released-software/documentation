# BetterBoard How-to Documentation Design

## Goal

Move the BetterBoard-only guidance from the seven public Jira how-to guides
into the BetterBoard documentation space. The website changes are deliberately
deferred to a follow-up pass.

## Scope

Create a new **How-to** category in BetterBoard documentation and add these
seven pages beneath `/betterboard/how-to/`:

1. `bulk-edit-work-items-on-a-jira-board`
2. `move-multiple-tickets-to-the-next-sprint-in-jira`
3. `see-work-items-from-multiple-jira-spaces-on-one-board`
4. `filter-a-jira-board-without-writing-jql`
5. `group-a-jira-board-by-assignee-priority-or-any-field`
6. `show-custom-fields-on-jira-board-cards`
7. `create-a-personal-my-work-board-across-all-your-jira-spaces`

Each page contains only the source guide's BetterBoard introduction, action
steps, and BetterBoard tip where one exists. It must not copy the
company-managed or team-managed Jira instructions, their limitations, FAQs,
marketing call-to-action, author line, or guide navigation.

## Information architecture

The new `How-to` folder is the fifth BetterBoard sidebar group, after `Work
faster`. Its articles use the folder's frontmatter ordering to preserve the
source guide order listed above. The BetterBoard overview gains a fifth
`OverviewSection` with direct links to every how-to.

Existing documentation remains the source of truth for overlapping detail.
The new pages link to it rather than duplicate it:

- Bulk editing links to inline editing.
- Sprint movement links to sprint management.
- Cross-space boards link to multi-space boards.
- Filtering links to filters and refinement.
- Grouping links to columns and grouping.
- Card fields link to display fields.
- The My work view links to multi-space boards and filters and refinement.

## Content format

Each MDX page follows existing BetterBoard frontmatter conventions:
`space: betterboard`, a focused title and description, and a sidebar order.
Its body uses a short outcome-led introduction, a `## How to …` ordered list,
and a neutral tip callout only where the source had a BetterBoard tip. Claims
are preserved in meaning but use existing documentation terminology: “work
items”, “spaces”, and “board”.

## Data and tests

Extend the BetterBoard section union and `betterBoardDocs` mapping to include
`how-to`, so the overview, build route test, search metadata, and migration
mapping stay in agreement. Update the BetterBoard sidebar ordering to put
`How-to` last.

Extend focused content tests to assert all seven how-to links on the overview,
the sidebar's five ordered groups, representative page content, and the
absence of company-managed/team-managed guide text from a representative
how-to. Build tests must expect 27 mapped BetterBoard sources (the existing
20 plus seven how-tos) and verify each new route has BetterBoard Pagefind
metadata.

## Deferred website work

Do not edit the public website during this pass. A later, separate change will
replace each website guide's BetterBoard section with a direct documentation
panel and revise guide navigation/layout for side-by-side company-managed and
team-managed content.

## Verification

Run the focused BetterBoard content and build-route tests, content validation,
type/content checks, and a production build. Inspect the generated overview
and one how-to page to confirm navigation, links, and BetterBoard search
metadata.
