export type SpaceId = 'hub' | 'betterboard' | 'partners';

export interface DocumentationSpace {
  id: SpaceId;
  name: string;
  shortName: string;
  description: string;
  href: string;
  available: boolean;
  searchIndexed: boolean;
}

export const spaces = [
  {
    id: 'hub',
    name: 'Hub documentation',
    shortName: 'Hub',
    description: 'Feedback, roadmaps, and product updates.',
    href: '/guide/',
    available: true,
    searchIndexed: true
  },
  {
    id: 'betterboard',
    name: 'BetterBoard documentation',
    shortName: 'BetterBoard',
    description: 'Build and shape clearer Jira boards.',
    href: '/betterboard/',
    available: true,
    searchIndexed: true
  },
  {
    id: 'partners',
    name: 'Partner documentation',
    shortName: 'Partners',
    description: 'Guidance and resources for partners.',
    href: '/partners/',
    available: false,
    searchIndexed: false
  }
] as const satisfies readonly DocumentationSpace[];

function pathStartsWith(pathname: string, prefix: string) {
  return pathname === prefix.slice(0, -1) || pathname.startsWith(prefix);
}

export function getSpaceFromPath(pathname: string): SpaceId | 'all' {
  if (pathStartsWith(pathname, '/guide/')) return 'hub';
  if (pathStartsWith(pathname, '/betterboard/')) return 'betterboard';
  if (pathStartsWith(pathname, '/partners/')) return 'partners';
  return 'all';
}

export function getSpace(id: SpaceId): DocumentationSpace {
  const space = spaces.find((candidate) => candidate.id === id);
  if (!space) throw new Error(`Unknown documentation space: ${id}`);
  return space;
}
