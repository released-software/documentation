import { getSpace, getSpaceFromPath } from './spaces.ts';

interface SidebarEntry {
  type: string;
  label?: string;
  href?: string;
  collapsed?: boolean;
  entries?: SidebarEntry[];
}

const labelOverrides = new Map([
  ['getting-started', 'Getting started'],
  ['setup-guide', 'Setup guide'],
  ['best-practices', 'Best practices'],
  ['roadmaps-and-ideas', 'Roadmaps & ideas'],
  ['ai-tips', 'AI tips'],
  ['how-tos', 'How-tos'],
  ['product-tour', 'Product tour']
]);

const protectedTerms = new Map([
  ['product hub', 'Product Hub'],
  ['betterboard', 'BetterBoard'],
  ['javascript', 'JavaScript'],
  ['atlassian', 'Atlassian'],
  ['confluence', 'Confluence'],
  ['released', 'Released'],
  ['webflow', 'Webflow'],
  ['framer', 'Framer'],
  ['slack', 'Slack'],
  ['forge', 'Forge'],
  ['cosmos', 'Cosmos'],
  ['karma', 'Karma'],
  ['aura', 'Aura'],
  ['jira', 'Jira'],
  ['csp', 'CSP'],
  ['url', 'URL'],
  ['pci', 'PCI'],
  ['ai', 'AI'],
  ['id', 'ID']
]);

const rootWrappersToPromote = new Set(['Product', 'Resources']);
const childCategoriesToPromote = new Set(['Best practices']);
const betterBoardCategoryOrder = new Map([
  ['Overview', 0],
  ['BetterBoard documentation', 0],
  ['Start', 1],
  ['Board setup', 2],
  ['Shape the board', 3],
  ['Work faster', 4]
]);

function sentenceCaseLabel(label = ''): string {
  const overridden = labelOverrides.get(label);
  if (overridden) return overridden;

  let result = label.replaceAll('-', ' ').toLocaleLowerCase('en');
  result = result.replace(/^\p{L}/u, (character) => character.toLocaleUpperCase('en'));

  for (const [term, replacement] of protectedTerms) {
    result = result.replace(new RegExp(`\\b${term}\\b`, 'gi'), replacement);
  }

  return result;
}

function canonicalLabel(label = ''): string {
  return label
    .normalize('NFKD')
    .toLocaleLowerCase('en')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function removeDuplicateFolderOverview<T extends SidebarEntry>(
  groupLabel: string | undefined,
  entries: T[]
): T[] {
  const [firstEntry, ...remainingEntries] = entries;
  const normalizedGroupLabel = canonicalLabel(groupLabel);
  if (
    normalizedGroupLabel &&
    firstEntry?.type === 'link' &&
    canonicalLabel(firstEntry.label) === normalizedGroupLabel
  ) {
    return remainingEntries;
  }

  return entries;
}

function normalizeLink<T extends SidebarEntry>(entry: T): T {
  return { ...entry, label: sentenceCaseLabel(entry.label) } as T;
}

function flattenArticleLinks<T extends SidebarEntry>(entries: T[]): T[] {
  return entries.flatMap((entry) => {
    if (entry.type !== 'group') return [normalizeLink(entry)];

    const label = sentenceCaseLabel(entry.label);
    const children = flattenArticleLinks((entry.entries ?? []) as T[]);
    return removeDuplicateFolderOverview(label, children);
  });
}

function createCategory<T extends SidebarEntry>(
  entry: T,
  entries: T[] = (entry.entries ?? []) as T[]
): T {
  const label = sentenceCaseLabel(entry.label);
  const links = removeDuplicateFolderOverview(label, flattenArticleLinks(entries));

  return {
    ...entry,
    label,
    collapsed: true,
    entries: links
  } as T;
}

function normalizeRootGroup<T extends SidebarEntry>(entry: T): T[] {
  const label = sentenceCaseLabel(entry.label);
  const children = (entry.entries ?? []) as T[];

  if (rootWrappersToPromote.has(label)) {
    return children.flatMap((child) =>
      child.type === 'group' ? [createCategory(child)] : [normalizeLink(child)]
    );
  }

  const retainedChildren: T[] = [];
  const promotedCategories: T[] = [];

  for (const child of children) {
    const childLabel = sentenceCaseLabel(child.label);
    if (child.type === 'group' && childCategoriesToPromote.has(childLabel)) {
      promotedCategories.push(createCategory(child));
    } else {
      retainedChildren.push(child);
    }
  }

  return [
    createCategory({ ...entry, label } as T, retainedChildren),
    ...promotedCategories
  ];
}

function normalizeHubEntries<T extends SidebarEntry>(entries: T[]): T[] {
  return entries.flatMap((entry) => {
    return entry.type === 'group' ? normalizeRootGroup(entry) : [normalizeLink(entry)];
  });
}

function normalizeBetterBoardEntries<T extends SidebarEntry>(entries: T[]): T[] {
  return entries
    .map((entry) => (
      entry.type === 'group' ? createCategory(entry) : normalizeLink(entry)
    ))
    .sort((left, right) => (
      (betterBoardCategoryOrder.get(left.label ?? '') ?? Number.MAX_SAFE_INTEGER) -
      (betterBoardCategoryOrder.get(right.label ?? '') ?? Number.MAX_SAFE_INTEGER)
    ));
}

export function filterSidebarForPath<T extends SidebarEntry>(pathname: string, sidebar: T[]): T[] {
  if (pathname === '/' || pathname === '/partners/') return [];

  const space = getSpaceFromPath(pathname);
  if (space === 'all') return [];

  const matchingEntries = sidebar.filter(
    (entry) => entry.type === 'group' && entry.label === getSpace(space).name
  );

  if (space === 'hub') {
    return normalizeHubEntries((matchingEntries[0]?.entries ?? []) as T[]);
  }
  if (space === 'betterboard') {
    return normalizeBetterBoardEntries((matchingEntries[0]?.entries ?? []) as T[]);
  }
  return matchingEntries;
}
