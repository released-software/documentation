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

/** @type {readonly {destinationSlug: string, title: string, order: number}[]} */
export const betterBoardHowToDocs = [
  { destinationSlug: 'how-to/bulk-edit-work-items-on-a-jira-board', title: 'Bulk edit work items on a Jira board', order: 1 },
  { destinationSlug: 'how-to/move-multiple-tickets-to-the-next-sprint-in-jira', title: 'Move multiple tickets to the next sprint in Jira', order: 2 },
  { destinationSlug: 'how-to/see-work-items-from-multiple-jira-spaces-on-one-board', title: 'See work items from multiple Jira spaces on one board', order: 3 },
  { destinationSlug: 'how-to/filter-a-jira-board-without-writing-jql', title: 'Filter a Jira board without writing JQL', order: 4 },
  { destinationSlug: 'how-to/group-a-jira-board-by-assignee-priority-or-any-field', title: 'Group a Jira board by assignee, priority, or any field', order: 5 },
  { destinationSlug: 'how-to/show-custom-fields-on-jira-board-cards', title: 'Show custom fields on Jira board cards', order: 6 },
  { destinationSlug: 'how-to/create-a-personal-my-work-board-across-all-your-jira-spaces', title: 'Create a personal My work board across all your Jira spaces', order: 7 }
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
