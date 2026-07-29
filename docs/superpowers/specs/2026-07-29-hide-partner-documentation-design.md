# Hide Partner Documentation Entry Points

## Goal

Remove Partner documentation from the homepage and navigation without breaking
the existing `/partners/` route.

## Design

- Export a public-space list containing only available documentation spaces.
- Render that list on the homepage and in the space switcher.
- Remove the Partner documentation group from Starlight's sidebar
  configuration.
- Retain Partner space metadata, route matching, the `/partners/` page, and
  disabled search scope for compatibility.

## Verification

- The homepage contains Hub and BetterBoard rows only.
- The space switcher contains Hub and BetterBoard entries only.
- The Partner route remains buildable and directly accessible.
- Unit, focused browser, production build, and diff checks pass.
