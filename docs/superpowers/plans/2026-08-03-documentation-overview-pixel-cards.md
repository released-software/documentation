# Documentation Overview Pixel Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the root documentation chooser as two reference-matched product panels with accessible Documentation and What’s new links, plus a local pixel hover effect.

**Architecture:** Add a framework-neutral `PixelCard.astro` wrapper that renders an `article`, a decorative canvas, and an event-driven inline script. `DocumentationOverview.astro` supplies each product’s content and actions, while `DocumentationLanding.astro` centres the existing hero. Browser coverage verifies the rendered actions, canvas contract, hover/focus treatment, reduced-motion fallback, and responsive layout.

**Tech Stack:** Astro 7, TypeScript, scoped CSS, native Canvas 2D API, Playwright.

## Global Constraints

- Do not add React, React DOM, an Astro React integration, or a UI-library dependency.
- Keep Documentation links at `/betterboard/` and `/guide/`.
- Use `https://released.so/betterboard/whats-new` and `https://released.so/hub/whats-new` for the secondary actions.
- Keep Partner documentation excluded from the root chooser.
- Keep the canvas decorative (`aria-hidden`) and non-interactive (`pointer-events: none`).
- Do not animate for `prefers-reduced-motion: reduce`.
- Do not alter documentation content, routes, the space-switcher, site navigation, or footer.

---

### Task 1: Add the local, event-driven Pixel Card primitive

**Files:**
- Create: `src/components/PixelCard.astro`
- Modify: `src/components/DocumentationOverview.astro`
- Modify: `tests/e2e/landing-pages.spec.ts`

**Interfaces:**
- Consumes: an `id: string` prop and default slot content.
- Produces: an `article[data-pixel-card][data-documentation-space]` containing one `canvas[data-pixel-canvas][aria-hidden="true"]` followed by slotted semantic content.

- [ ] **Step 1: Write the failing browser contract**

  In the root-overview test, replace the whole-card-link expectation with one article per space, retain the existing documentation anchor inside it, and assert the canvas contract:

  ```ts
  const card = overview.locator('[data-documentation-space="hub"]');
  await expect(card).toHaveRole('article');
  await expect(card.locator('[data-pixel-canvas]')).toHaveCount(1);
  await expect(card.locator('[data-pixel-canvas]')).toHaveAttribute('aria-hidden', 'true');
  await expect(card.locator('[data-pixel-canvas]')).toHaveCSS('pointer-events', 'none');
  await expect(card.getByRole('link')).toHaveAttribute('href', '/guide/');
  ```

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `npx playwright test tests/e2e/landing-pages.spec.ts --grep "documentation overview"`

  Expected: FAIL because the existing card is an anchor and has no article wrapper or canvas.

- [ ] **Step 3: Implement the component**

  Create `PixelCard.astro` with this public shape:

  ```astro
  ---
  interface Props { id: string; }
  const { id } = Astro.props;
  ---

  <article class="pixel-card" data-pixel-card data-documentation-space={id}>
    <canvas aria-hidden="true" class="pixel-canvas" data-pixel-canvas></canvas>
    <slot />
  </article>
  ```

  Style the wrapper with `position: relative`, `isolation: isolate`, `overflow: hidden`, `border-radius: 20px`, and `background: var(--released-bg-raised)`. Define `--pixel-card-backdrop: rgba(17, 17, 17, 0.035)` and give `::before` `background: radial-gradient(circle, var(--pixel-card-backdrop), transparent 78%)`, `opacity: 0`, and `transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1)`; set its opacity to `1` for `:hover` and `:focus-within`. Add one Astro script with this event-driven drawing logic:

  ```ts
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function resizeCanvas(card: HTMLElement, canvas: HTMLCanvasElement) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = card.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return dpr;
  }

  function drawPixels(card: HTMLElement, canvas: HTMLCanvasElement, event: PointerEvent) {
    if (reducedMotion.matches) return;
    const dpr = resizeCanvas(card, canvas);
    const context = canvas.getContext('2d');
    if (!context) return;
    const bounds = card.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) * dpr;
    const pointerY = (event.clientY - bounds.top) * dpr;
    const cell = 12 * dpr;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = pointerY - cell * 6; y <= pointerY + cell * 6; y += cell) {
      for (let x = pointerX - cell * 6; x <= pointerX + cell * 6; x += cell) {
        const distance = Math.hypot(x - pointerX, y - pointerY) / (cell * 6);
        if (distance <= 1 && (Math.floor(x / cell) + Math.floor(y / cell)) % 3 !== 0) {
          context.fillStyle = `rgba(17, 17, 17, ${(1 - distance) * 0.14})`;
          context.fillRect(x, y, cell - dpr, cell - dpr);
        }
      }
    }
  }
  ```

  For each card, get its canvas, create `new ResizeObserver(() => resizeCanvas(card, canvas))`, and observe the card. Register `pointermove` to call `drawPixels(card, canvas, event)` and `pointerleave` to `clearRect(0, 0, canvas.width, canvas.height)`. Do not schedule `requestAnimationFrame`, use a timer, or leave an animation running while the pointer is idle. Place the canvas behind `slot` content and set `transition: none` for `::before` in the reduced-motion media query.

  In `DocumentationOverview.astro`, import `PixelCard`, move `data-documentation-space` from the existing link to `<PixelCard id={space.id}>`, and keep the existing single anchor as the slotted content. Update the reduced-motion browser test to focus that inner link and assert the Pixel Card overlay rather than the old arrow transform.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `npx playwright test tests/e2e/landing-pages.spec.ts --grep "documentation overview"`

  Expected: PASS, including the article and decorative-canvas assertions.

- [ ] **Step 5: Commit the primitive**

  ```bash
  git add src/components/PixelCard.astro src/components/DocumentationOverview.astro tests/e2e/landing-pages.spec.ts
  git commit -m "feat: add local pixel card primitive"
  ```

### Task 2: Compose product panels and matching landing layout

**Files:**
- Modify: `src/components/DocumentationOverview.astro`
- Modify: `src/layouts/DocumentationLanding.astro`
- Modify: `tests/e2e/landing-pages.spec.ts`

**Interfaces:**
- Consumes: `publicSpaces` and `PixelCard` with each space’s `id`, `shortName`, `description`, and documentation `href`.
- Produces: two `article[data-documentation-space]` panels, each with a Documentation link and an externally targeted What’s new link.

- [ ] **Step 1: Extend the failing browser test for panel content and interaction**

  Change `activeSpaces` to include the two actions and assert them within each article:

  ```ts
  const actions = card.getByRole('navigation', { name: `${space.name} actions` });
  await expect(actions.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', space.href);
  await expect(actions.getByRole('link', { name: "What's new" })).toHaveAttribute('href', space.whatsNewHref);
  ```

  Add assertions that the desktop panel has a 20px radius, a `330px` minimum height, and `42px` inline padding. Read the pseudo-element state directly for hover, focus, and reduced motion:

  ```ts
  await hubCard.hover();
  expect(await hubCard.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('1');
  await hubCard.getByRole('link', { name: 'Documentation' }).focus();
  expect(await hubCard.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await hubCard.evaluate((element) => getComputedStyle(element, '::before').transitionDuration)).toBe('0s');
  ```

  Retain the existing Partner exclusion and responsive overflow checks.

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `npx playwright test tests/e2e/landing-pages.spec.ts`

  Expected: FAIL because the overview has neither the two action links nor the reference panel sizing.

- [ ] **Step 3: Refactor the overview into semantic panels**

  In `DocumentationOverview.astro`, import `PixelCard` and replace the enclosing anchor with the component. Keep audience text, title, and description; replace the arrow with a labelled navigation region containing:

  ```astro
  <nav aria-label={`${space.shortName} actions`} class="documentation-card__actions">
    <a class="documentation-card__action documentation-card__action--primary" href={space.href}>
      Documentation
    </a>
    <a class="documentation-card__action" href={whatsNewHrefs[space.id]}>
      What’s new
    </a>
  </nav>
  ```

  Define the two `whatsNewHrefs` values as exact `https://released.so/...` URLs. Use the reference spacing and panel dimensions: a 16px two-column gap, `min-height: 330px`, `padding: 42px`, and 20px radius. Style the primary action as an ink-filled pill and the secondary action as an outlined pill. Keep a visible focus outline on each action; remove the obsolete arrow-specific styles and reduced-motion rules.

  In `DocumentationLanding.astro`, centre the hero stack and copy, set the desktop title maximum width to `22ch`, and centre the tagline. Keep the existing responsive type scale and gutter.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `npx playwright test tests/e2e/landing-pages.spec.ts`

  Expected: PASS at desktop, tablet, and mobile widths; all four action links target their expected paths; the canvas remains decorative.

- [ ] **Step 5: Manually verify interaction and reduced motion**

  Run: `npm run dev`

  Open `http://127.0.0.1:4321/` in the configured browser. Move the pointer across each panel, tab through each action, then enable reduced motion in browser emulation. Confirm the pixels appear only on pointer movement, links stay clickable, keyboard focus remains obvious, and the reduced-motion view has no animated redraw.

- [ ] **Step 6: Verify production output**

  Run:

  ```bash
  npm run build
  git diff --check
  ```

  Expected: both commands exit 0.

- [ ] **Step 7: Commit the overview**

  ```bash
  git add src/components/DocumentationOverview.astro src/layouts/DocumentationLanding.astro src/components/PixelCard.astro tests/e2e/landing-pages.spec.ts docs/superpowers/plans/2026-08-03-documentation-overview-pixel-cards.md
  git commit -m "feat: add pixel documentation overview panels"
  ```
