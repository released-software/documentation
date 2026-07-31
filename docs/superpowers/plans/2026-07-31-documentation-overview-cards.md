# Documentation Overview Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the root documentation chooser rows with responsive homepage-inspired product cards.

**Architecture:** Keep `publicSpaces` as the data source and refactor only `DocumentationOverview.astro` into two link cards. The component owns the visual treatment; `index.astro` continues to supply the same spaces and `landing-pages.spec.ts` verifies rendered behaviour.

**Tech Stack:** Astro, TypeScript, scoped CSS, Playwright.

## Global Constraints

- Keep Hub at `/guide/` and BetterBoard at `/betterboard/`.
- Exclude Partner documentation from the root chooser.
- Use separate cards, not a joined rail or ambient gradient.
- Keep cards keyboard accessible and reduced-motion friendly.
- Do not add dependencies or homepage interactive effects.

---

### Task 1: Replace the root chooser with product cards

**Files:**

- Modify: `tests/e2e/landing-pages.spec.ts`
- Modify: `src/components/DocumentationOverview.astro`

**Interfaces:**

- Consumes: `readonly DocumentationSpace[]` from `src/data/spaces.ts`.
- Produces: two `[data-documentation-space]` links styled as `.documentation-card`, each containing `[data-card-arrow]`.

- [x] **Step 1: Write the failing browser test**

Replace the row-based expectations with a two-card grid assertion. Check each card's link destination, audience label, circular arrow, raised background, visible focus outline, hover arrow translation, reduced-motion reset, and mobile horizontal-overflow behaviour.

- [x] **Step 2: Run the focused browser test to verify it fails**

Run `npx playwright test tests/e2e/landing-pages.spec.ts`.

Expected: the current `.documentation-row` structure does not expose the card or circular-arrow contracts.

- [x] **Step 3: Implement the minimum card layout**

In `DocumentationOverview.astro`, remove the logo-and-row markup. Render each available space as a `.documentation-card` link with the established audience label, `shortName`, existing description, and a `↗` arrow in a bordered round element. Use a two-column CSS grid above 35rem and one column below it. Give the cards `var(--released-bg-raised)`, `var(--released-line)`, and `var(--released-radius-lg)`; retain a visible focus outline and disable arrow movement under reduced motion.

- [x] **Step 4: Run the focused browser test to verify it passes**

Run `npx playwright test tests/e2e/landing-pages.spec.ts`.

Expected: all landing-page tests pass with the new card structure.

- [x] **Step 5: Verify the production output**

Run `npm run build` and `git diff --check`.

Expected: the build exits successfully and the diff has no whitespace errors.

- [x] **Step 6: Commit**

Run `git add src/components/DocumentationOverview.astro tests/e2e/landing-pages.spec.ts docs/superpowers/specs/2026-07-31-documentation-overview-cards-design.md docs/superpowers/plans/2026-07-31-documentation-overview-cards.md` followed by `git commit -m "docs: refresh documentation overview cards"`.
