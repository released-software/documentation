# Search dialog refinement

**Date:** 2026-07-28

**Status:** Approved direction pending written-spec review

**Selected direction:** Stable results with restrained native-control styling

## Purpose

Refine the documentation search dialog so the scope control looks intentional, the empty state stays quiet, and typing does not make the result area flash between loading and completed states.

This change is limited to the search dialog’s scope selector, empty-query state, and search scheduling. Search scope semantics, Pagefind filtering, keyboard navigation, failure recovery, and result content remain unchanged.

## Scope selector

- Keep the native HTML `select` for keyboard, screen-reader, and platform accessibility.
- Hide the browser-provided chevron with `appearance: none`.
- Place a small, consistently sized SVG chevron inside the select label. The icon is decorative, uses the muted ink token, and does not intercept pointer events.
- Reserve explicit inline space for the icon so option text cannot overlap it.
- Keep the normal one-pixel neutral border.
- Replace the current black focus outline on the select with a soft neutral focus halo using existing Released surface and line tokens.
- Retain a visible keyboard focus treatment. Mouse selection must not leave a heavy dark border around the control.
- Do not change the input or button focus treatment as part of this refinement.

## Empty-query state

- Remove suggested-section generation and its associated link styles.
- In a production build, opening search with an empty query shows only the scope control, close button, and search field.
- Clearing an existing query removes results and visible status text immediately.
- An empty query must not initialize Pagefind or display a loading message.
- With no results or visible state content, the desktop dialog is content-sized rather than held open by the current minimum height.
- Empty result and state containers do not render divider lines or reserve extra vertical space.

## Search scheduling and result stability

- Input changes use a 150ms trailing debounce before a Pagefind search starts.
- Scope changes search immediately when a non-empty query is present.
- The currently completed result list remains visible while a replacement search is in progress.
- Starting a new search does not clear results or display a visible “Loading search…” message.
- Mark the result region busy while the latest request is running so assistive technology receives loading-state information without visual flicker.
- When the latest request completes, replace the result list atomically with results, a no-results state, or a failure state.
- Existing request identifiers continue to prevent stale responses from replacing newer results.
- Clearing the query or closing the dialog cancels any pending debounce and invalidates in-flight responses.
- Pagefind module loading remains lazy and begins only after a non-empty query is scheduled.
- Development mode retains its explicit production-preview warning and never attempts to load Pagefind.

## Error and no-result behavior

- A completed zero-result search still shows the existing scoped no-results message and “Search all documentation” action where applicable.
- Pagefind load or search failures still show the existing retry action.
- Retry runs immediately for the current non-empty query.
- If the query is empty when retry would occur, the dialog returns to the clean empty-query state.
- Old results may remain visible only while a newer request is pending; they are removed when a no-results or failure state is committed.

## Accessibility and keyboard behavior

- The native select retains its accessible “Search scope” label.
- The custom chevron is hidden from assistive technology.
- The select retains a visible `:focus-visible` state without the heavy black outline.
- Search results continue to support Arrow Down and Arrow Up navigation.
- Escape continues to close the dialog and restore focus to the search trigger.
- Scope changes continue to update the polite scope announcement.
- The results container exposes `aria-busy="true"` only while a search is pending and returns to `false` after completion or cancellation.

## Implementation boundaries

- Update search markup and component-scoped styles in `src/components/starlight/Search.astro`.
- Update scheduling and rendering in `src/scripts/search-controller.ts`.
- Update focused production search coverage in `tests/e2e/search.spec.ts`.
- Remove obsolete suggested-section tests and assertions.
- Do not change Pagefind indexing, content metadata, result ranking, scope definitions, or global design tokens.
- Preserve unrelated migration and documentation changes already present in the worktree.

## Verification

Automated and browser checks will confirm:

- The scope selector uses a custom chevron and suppresses native select appearance.
- Keyboard focus remains visible without a black outline.
- An empty query has no suggestions, result divider, loading text, or reserved result space.
- Clearing a query restores the clean empty state.
- Rapid typing does not clear completed results while a replacement search is pending.
- Only the latest query can commit results.
- Scope changes with a query still update results without navigation.
- No-result, retry, Escape, and Arrow-key behavior remain intact.
- The dialog remains correct in light and dark themes and at mobile and desktop widths.
- Focused search browser tests, Astro checks, Pagefind build tests, and the production build pass.
