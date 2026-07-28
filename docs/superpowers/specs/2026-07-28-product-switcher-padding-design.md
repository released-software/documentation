# Product switcher padding

## Goal

Restore balanced horizontal padding around the active product name and chevron in the documentation header.

## Design

- Use 8px of inline padding on both sides of the product switcher at standard widths.
- Use 6px of inline padding on both sides at widths up to 560px.
- Preserve the current height, gap, typography, hover treatment, menu positioning, and keyboard behavior.

## Verification

- Add a focused browser test that checks the computed left and right padding at desktop and mobile widths.
- Run the focused shell tests and inspect the rendered header at both widths.

