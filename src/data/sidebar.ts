import { getSpace, getSpaceFromPath } from './spaces.ts';

interface SidebarEntry {
  type: string;
  label?: string;
}

export function filterSidebarForPath<T extends SidebarEntry>(pathname: string, sidebar: T[]): T[] {
  if (pathname === '/' || pathname === '/partners/') return [];

  const space = getSpaceFromPath(pathname);
  if (space === 'all') return [];

  return sidebar.filter((entry) => entry.type === 'group' && entry.label === getSpace(space).name);
}
