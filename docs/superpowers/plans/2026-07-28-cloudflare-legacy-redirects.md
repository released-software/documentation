# Cloudflare Legacy Redirects Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Preserve every verified GitBook legacy URL beneath `docs.released.so` after the Astro migration with exact, permanent, one-hop Cloudflare Pages redirects.

**Architecture:** Keep the 181 logical source-to-destination mappings in one versioned JavaScript manifest. Import that manifest into Astro so local previews and static builds contain redirect pages, and render a deterministic `public/_redirects` file for Cloudflare Pages. Validate the manifest and generated artifact with unit and build tests; legacy sources stay out of navigation and the sitemap.

**Tech Stack:** Astro 7, Cloudflare Pages static redirects, Node.js test runner.

---

### Task 1: Freeze the verified legacy redirect inventory

**Files:**
- Create: `src/data/legacy-redirects.mjs`
- Create: `tests/unit/legacy-redirects.test.mjs`

1. Re-run the historical GitBook route audit and capture the 181 live redirect mappings.
2. Normalize destinations to the canonical Astro path with a trailing slash.
3. Add a failing contract test for the expected count, representative mappings, uniqueness, exact-path syntax, canonical destinations, and absence of redirect chains.
4. Run the focused unit test and confirm that it fails before the manifest exists.
5. Add the manifest and rerun the test until it passes.

### Task 2: Generate Cloudflare Pages rules

**Files:**
- Create: `scripts/generate-cloudflare-redirects.mjs`
- Create: `public/_redirects`
- Modify: `package.json`
- Extend: `tests/unit/legacy-redirects.test.mjs`

1. Add a failing test that requires deterministic Cloudflare rules for every manifest entry.
2. Implement a generator that writes both slash forms of each legacy source to the same canonical destination with status `301`.
3. Add `generate:redirects` and `check:redirects` scripts, and make the build fail if the committed artifact is stale.
4. Generate `public/_redirects` and confirm the focused test passes.

### Task 3: Integrate redirects into Astro

**Files:**
- Modify: `astro.config.mjs`
- Create: `tests/build/legacy-redirects.test.mjs`

1. Add a failing build regression test for redirect output, canonical targets, sitemap exclusion, and Cloudflare artifact copying.
2. Import the manifest in Astro config and map it to Astro's static redirect configuration.
3. Build the site and confirm every logical alias produces a local static redirect page while `dist/_redirects` contains the exact permanent Cloudflare rules.
4. Confirm all redirect destinations resolve to built canonical pages and no source is itself another redirect source.

### Task 4: Verify the migration safety net

**Files:**
- Verify only; no planned source changes.

1. Run `npm run check`.
2. Run `npm run test:unit`.
3. Run `npm run test:build`.
4. Run the relevant existing route and link tests.
5. Review `git diff` and `git status` to ensure only redirect-related files were changed and all pre-existing user changes remain untouched.
