# Documentation overview cards design

## Goal

Make the root documentation chooser more inviting by replacing its two editorial rows with separate product cards that echo the Released homepage.

## Chosen direction

Use the approved lighter card treatment: two independent rounded cards rather than one joined rail. The cards retain the homepage's product audience label, large product name, and circular northeast-arrow affordance, but do not use the homepage's ambient gradient or pixel effect.

## Layout and visual language

- The chooser remains centred at the existing 960px documentation width.
- On desktop, Hub and BetterBoard sit in an even two-column grid with a 16px gap. Each card uses the existing raised background, a subtle line border, and the large existing radius token.
- Each card places its audience label and product name at the upper left, the circular arrow at the upper right, and the existing documentation description beneath. The card itself is the only link.
- Hover moves only the arrow slightly; keyboard focus has a visible outline; reduced motion removes the transition.
- Below the existing narrow breakpoint, the cards stack without horizontal overflow.

## Content and scope

- Keep the existing root-page heading, description, Hub destination (`/guide/`), and BetterBoard destination (`/betterboard/`).
- Keep Partner documentation excluded from the chooser.
- Use the established audience labels "For teams communicating beyond Jira" and "For Jira power users". Do not add logos, gradients, new dependencies, or homepage interactive effects.

## Verification

Update the focused landing-page browser tests to assert the two-card structure, destinations, arrow treatment, focus style, reduced-motion behaviour, and desktop/mobile overflow. Run the production build and focused test.
