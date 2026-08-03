# Documentation overview pixel cards design

## Goal

Bring the root documentation chooser in line with the reference at `released.so/docs/`: a centred, product-focused hero followed by two rounded panels with Documentation and What’s new actions.

## Chosen direction

Use one locally owned, framework-neutral `PixelCard` Astro component. It recreates the reference’s decorative canvas pixel response and radial hover treatment without adding React, React DOM, or an Astro React integration.

## Layout and interaction

- Keep the existing root-page heading and description, but centre the hero to match the reference.
- Render BetterBoard and Hub as semantic articles in a two-column grid. Each panel has the light raised surface, 20px rounded corners, 42px desktop padding, and a minimum height of 330px.
- Give each panel a primary Documentation link and a secondary What’s new link. The primary links remain `/betterboard/` and `/guide/`; the secondary links use the corresponding public product update routes.
- `PixelCard` owns the decorative canvas and subtle radial overlay. It responds to pointer movement only while a panel is hovered, is `aria-hidden`, never blocks links, and draws no animation for reduced-motion users.
- Keyboard focus keeps the panel affordance visible without requiring pointer movement. On narrow screens, the cards stack and retain their action order.

## Scope boundaries

- Do not add React or a UI-library dependency.
- Do not change documentation content, routes, the space-switcher, or Partner visibility.
- Do not alter page-wide navigation or footer styling.

## Verification

Add focused browser coverage for both action destinations, the canvas’s decorative/accessibility contract, hover/focus behaviour, reduced-motion fallback, and narrow-screen stacking. Verify with the focused test, `npm run build`, and `git diff --check`.
