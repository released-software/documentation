# Linear-Inspired Article Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan.

**Goal:** Make Hub documentation articles narrower and calmer, with Linear-inspired typography and vertical rhythm, without changing landing pages or navigation.

**Architecture:** Scope all layout and type changes to Starlight article pages using `html[data-has-sidebar] main[data-pagefind-body]`. Keep the shared `--released-content` token unchanged so overview and product landing pages retain their existing width.

**Tech Stack:** Astro 7, Starlight 0.41, CSS, Playwright

## Global Constraints

- Preserve the existing sidebar, header, table of contents, component surfaces, and migrated URLs.
- Keep article content fluid on mobile.
- Do not touch unrelated migration work already present in the worktree.

### Task 1: Lock the article treatment with browser tests

**Files:**
- Modify: `tests/e2e/shell.spec.ts`

1. Update the article typography expectations to 15px/24px body, 32px/36px H1 at weight 600, 24px/32px H2 at weight 600, 18px/24px H3, and 15px/22px H4.
2. Add assertions for a 650px desktop article column, no title/body divider, the approved title and section spacing, and fluid mobile width.
3. Keep assertions proving BetterBoard and homepage landing typography remain unchanged.
4. Run `npx playwright test tests/e2e/shell.spec.ts --grep "content|typography|landing"` and confirm the new assertions fail before CSS changes.

### Task 2: Implement scoped article CSS

**Files:**
- Modify: `src/components/starlight/MarkdownContent.astro`
- Modify: `src/styles/starlight.css`

1. Mark Markdown content as either a space overview or an article from the current route.
2. Add article-only width, font size, line height, weight, and letter-spacing rules.
3. Remove the article title/body panel divider and set responsive top/title spacing.
4. Set direct article-block rhythm to 16px, with 56px H2, 40px H3, 32px H4 section gaps and 12px heading-to-content spacing.
5. Run the focused Playwright tests until green.

### Task 3: Verify the complete documentation shell

1. Run `npm run check`.
2. Run `npx playwright test tests/e2e/shell.spec.ts`.
3. Run `npm run test:unit`.
4. Run `npm run test:build`.
5. Review `git diff --check` and confirm only the plan, test, and scoped stylesheet are part of this change.
