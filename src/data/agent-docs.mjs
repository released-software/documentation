const excludedEntryIds = new Set([
  '404',
  'component-tests/generated-content-components'
]);

const spaceLabels = new Map([
  ['hub', 'Hub'],
  ['betterboard', 'BetterBoard'],
  ['partners', 'Partners']
]);

function entrySegments(id) {
  const segments = id.split('/').filter(Boolean);
  if (segments.at(-1) === 'index') segments.pop();
  return segments;
}

export function htmlPathForEntryId(id) {
  const segments = entrySegments(id);
  return segments.length === 0 ? '/' : `/${segments.join('/')}/`;
}

export function markdownPathForEntryId(id) {
  const segments = entrySegments(id);
  return segments.length === 0 ? '/index.md' : `/${segments.join('/')}.md`;
}

export function isAgentDocument(entry) {
  return (
    entry.data.draft !== true &&
    !excludedEntryIds.has(entry.id) &&
    !entry.id.endsWith('/404')
  );
}

export function renderLlmsTxt(entries, site) {
  const publicEntries = entries.filter(isAgentDocument);
  const groups = new Map();

  for (const entry of publicEntries) {
    const group = groups.get(entry.data.space) ?? [];
    group.push(entry);
    groups.set(entry.data.space, group);
  }

  const sections = [];
  for (const space of spaceLabels.keys()) {
    const group = groups.get(space);
    if (!group?.length) continue;

    const links = group
      .toSorted((left, right) => left.data.title.localeCompare(right.data.title))
      .map((entry) => {
        const href = new URL(markdownPathForEntryId(entry.id), site).href;
        const description = entry.data.description?.trim();
        return `- [${entry.data.title}](${href})${description ? `: ${description}` : ''}`;
      });

    sections.push(`## ${spaceLabels.get(space)}\n\n${links.join('\n')}`);
  }

  return `# Hub documentation

Documentation for Hub and BetterBoard.

${sections.join('\n\n')}
`;
}
