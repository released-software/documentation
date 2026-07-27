import { getSpace, getSpaceFromPath } from './spaces.ts';

interface SidebarEntry {
  type: string;
  label?: string;
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

function normalizeHubEntries<T extends SidebarEntry>(entries: T[], groupDepth = 0): T[] {
  return entries.flatMap((entry) => {
    const normalized = { ...entry, label: sentenceCaseLabel(entry.label) } as T;
    if (entry.type !== 'group') return [normalized];

    const children = normalizeHubEntries((entry.entries ?? []) as T[], groupDepth + 1);
    if (groupDepth >= 2) return children;

    normalized.entries = children;
    return [normalized];
  });
}

export function filterSidebarForPath<T extends SidebarEntry>(pathname: string, sidebar: T[]): T[] {
  if (pathname === '/' || pathname === '/partners/') return [];

  const space = getSpaceFromPath(pathname);
  if (space === 'all') return [];

  const matchingEntries = sidebar.filter(
    (entry) => entry.type === 'group' && entry.label === getSpace(space).name
  );

  if (space !== 'hub') return matchingEntries;

  return normalizeHubEntries((matchingEntries[0]?.entries ?? []) as T[]);
}
