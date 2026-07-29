# Hide Partner Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Partner documentation from the homepage and navigation while preserving its direct route.

**Architecture:** Keep the complete `spaces` registry as the source of route and search metadata. Export an available-only `publicSpaces` view for user-facing discovery surfaces, and remove the unused Partner group from Starlight sidebar generation.

**Tech Stack:** Astro 7, TypeScript, Node test runner, Playwright

## Global Constraints

- Keep `/partners/` directly accessible.
- Keep Partner route matching, metadata, and disabled search scope.
- Do not change Hub or BetterBoard navigation.
- Preserve unrelated working-tree changes.

---

### Task 1: Hide Partner discovery entry points

**Files:**
- Modify: `tests/unit/spaces.test.mjs`
- Modify: `tests/e2e/landing-pages.spec.ts`
- Modify: `tests/e2e/shell.spec.ts`
- Modify: `src/data/spaces.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/components/SpaceSwitcher.astro`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: `spaces`, `DocumentationSpace`, and existing Partner route metadata.
- Produces: `publicSpaces`, containing only available spaces in existing order.

- [ ] **Step 1: Write failing visibility tests**

Add a unit assertion:

```js
assert.deepEqual(publicSpaces.map((space) => space.id), ['hub', 'betterboard']);
```

Update focused browser expectations so the homepage has two rows and no Partner
row, while the switcher has two menu items and no Partners item.

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test tests/unit/spaces.test.mjs
npm run build
npx playwright test tests/e2e/landing-pages.spec.ts tests/e2e/shell.spec.ts
```

Expected: the new unit import/assertion and Partner-absence browser assertions
fail because `publicSpaces` is absent and the Partner entry is still rendered.

- [ ] **Step 3: Implement the available-only public view**

In `src/data/spaces.ts`, export:

```ts
export const publicSpaces = spaces.filter((space) => space.available);
```

Pass `publicSpaces` to `DocumentationOverview`, iterate `publicSpaces` in
`SpaceSwitcher.astro`, and remove the Partner documentation group from
`astro.config.mjs`.

- [ ] **Step 4: Verify the focused behavior**

Run:

```bash
node --test tests/unit/spaces.test.mjs
npm run build
npx playwright test tests/e2e/landing-pages.spec.ts tests/e2e/shell.spec.ts
```

Expected: all focused tests pass, including the existing direct `/partners/`
coverage.

- [ ] **Step 5: Verify the repository**

Run:

```bash
npm run check
npm run test:unit
node --test tests/build/*.test.mjs
git diff --check
```

Expected: all commands exit successfully; Astro may retain existing deprecation
hints but reports zero errors.
