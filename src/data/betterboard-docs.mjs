/**
 * @typedef {'start' | 'board-setup' | 'shape-the-board' | 'work-faster'} BetterBoardSection
 *
 * @typedef {object} BetterBoardDoc
 * @property {string} sourceSlug
 * @property {string} destinationSlug
 * @property {BetterBoardSection} section
 * @property {string} title
 * @property {number} order
 */

/** @type {readonly BetterBoardDoc[]} */
export const betterBoardDocs = [
  {
    sourceSlug: 'overview',
    destinationSlug: 'start/overview',
    section: 'start',
    title: 'Overview',
    order: 1
  },
  {
    sourceSlug: 'installation',
    destinationSlug: 'start/installation',
    section: 'start',
    title: 'Installation',
    order: 2
  },
  {
    sourceSlug: 'quick-start',
    destinationSlug: 'start/quick-start',
    section: 'start',
    title: 'Quick start',
    order: 3
  },
  {
    sourceSlug: 'faq',
    destinationSlug: 'start/faq',
    section: 'start',
    title: 'FAQ',
    order: 4
  },
  {
    sourceSlug: 'creating-managing-boards',
    destinationSlug: 'board-setup/creating-managing-boards',
    section: 'board-setup',
    title: 'Creating and managing boards',
    order: 1
  },
  {
    sourceSlug: 'multi-space-boards',
    destinationSlug: 'board-setup/multi-space-boards',
    section: 'board-setup',
    title: 'Multi-space boards',
    order: 2
  },
  {
    sourceSlug: 'global-board-directory',
    destinationSlug: 'board-setup/global-board-directory',
    section: 'board-setup',
    title: 'Global board directory',
    order: 3
  },
  {
    sourceSlug: 'board-visibility',
    destinationSlug: 'board-setup/board-visibility',
    section: 'board-setup',
    title: 'Board visibility',
    order: 4
  },
  {
    sourceSlug: 'columns-grouping',
    destinationSlug: 'shape-the-board/columns-grouping',
    section: 'shape-the-board',
    title: 'Columns and grouping',
    order: 1
  },
  {
    sourceSlug: 'status-mapping',
    destinationSlug: 'shape-the-board/status-mapping',
    section: 'shape-the-board',
    title: 'Status mapping',
    order: 2
  },
  {
    sourceSlug: 'display-fields',
    destinationSlug: 'shape-the-board/display-fields',
    section: 'shape-the-board',
    title: 'Display fields',
    order: 3
  },
  {
    sourceSlug: 'field-types',
    destinationSlug: 'shape-the-board/field-types',
    section: 'shape-the-board',
    title: 'Field types',
    order: 4
  },
  {
    sourceSlug: 'card-colors',
    destinationSlug: 'shape-the-board/card-colors',
    section: 'shape-the-board',
    title: 'Card colors',
    order: 5
  },
  {
    sourceSlug: 'filters-refinement',
    destinationSlug: 'work-faster/filters-refinement',
    section: 'work-faster',
    title: 'Filters and refinement',
    order: 1
  },
  {
    sourceSlug: 'filter-operators',
    destinationSlug: 'work-faster/filter-operators',
    section: 'work-faster',
    title: 'Filter operators',
    order: 2
  },
  {
    sourceSlug: 'sorting-ordering',
    destinationSlug: 'work-faster/sorting-ordering',
    section: 'work-faster',
    title: 'Sorting and ordering',
    order: 3
  },
  {
    sourceSlug: 'drag-and-drop',
    destinationSlug: 'work-faster/drag-and-drop',
    section: 'work-faster',
    title: 'Drag and drop',
    order: 4
  },
  {
    sourceSlug: 'inline-editing',
    destinationSlug: 'work-faster/inline-editing',
    section: 'work-faster',
    title: 'Inline editing',
    order: 5
  },
  {
    sourceSlug: 'sprint-management',
    destinationSlug: 'work-faster/sprint-management',
    section: 'work-faster',
    title: 'Sprint management',
    order: 6
  },
  {
    sourceSlug: 'keyboard-shortcuts',
    destinationSlug: 'work-faster/keyboard-shortcuts',
    section: 'work-faster',
    title: 'Keyboard shortcuts',
    order: 7
  }
];

/**
 * @param {readonly BetterBoardDoc[]} docs
 */
export function assertUniqueDocMappings(docs) {
  const sourceOwners = new Set();
  const destinationOwners = new Set();

  for (const doc of docs) {
    if (sourceOwners.has(doc.sourceSlug)) {
      throw new Error(`Duplicate BetterBoard source slug "${doc.sourceSlug}"`);
    }
    if (destinationOwners.has(doc.destinationSlug)) {
      throw new Error(
        `Duplicate BetterBoard destination slug "${doc.destinationSlug}"`
      );
    }
    sourceOwners.add(doc.sourceSlug);
    destinationOwners.add(doc.destinationSlug);
  }
}

assertUniqueDocMappings(betterBoardDocs);
