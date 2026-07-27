import assert from 'node:assert/strict';
import test from 'node:test';

import { getSpace, getSpaceFromPath } from '../../src/data/spaces.ts';
import { filterSidebarForPath } from '../../src/data/sidebar.ts';

test('assigns paths to their documentation spaces', () => {
  assert.equal(getSpaceFromPath('/'), 'all');
  assert.equal(getSpaceFromPath('/guide/'), 'hub');
  assert.equal(getSpaceFromPath('/guide/product/changelog/'), 'hub');
  assert.equal(getSpaceFromPath('/betterboard/start/quick-start/'), 'betterboard');
  assert.equal(getSpaceFromPath('/partners/'), 'partners');
  assert.equal(getSpaceFromPath('/guidebook/'), 'all');
  assert.equal(getSpaceFromPath('/betterboarder/'), 'all');
});

test('keeps partner documentation unavailable', () => {
  assert.equal(getSpace('partners').available, false);
});

test('shows sidebar navigation only for Partner article routes', () => {
  const sidebar = [
    { type: 'group', label: 'Hub documentation', entries: [] },
    { type: 'group', label: 'BetterBoard documentation', entries: [] },
    { type: 'group', label: 'Partner documentation', entries: [] }
  ];

  for (const [pathname, expectedLabels] of [
    ['/', []],
    ['/partners/', []],
    ['/partners/example/', ['Partner documentation']]
  ]) {
    const filteredSidebar = filterSidebarForPath(pathname, structuredClone(sidebar));

    assert.deepEqual(filteredSidebar.map((entry) => entry.label), expectedLabels, pathname);
  }
});

test('unwraps and normalizes Hub navigation to two collapsible levels', () => {
  const sidebar = [
    {
      type: 'group',
      label: 'Hub documentation',
      entries: [
        { type: 'link', label: 'Overview', href: '/guide/' },
        {
          type: 'group',
          label: 'getting-started',
          entries: [
            { type: 'link', label: 'Concepts', href: '/guide/getting-started/concepts/' },
            {
              type: 'group',
              label: 'setup-guide',
              entries: [
                { type: 'link', label: 'Setup Guide', href: '/guide/getting-started/setup-guide/' },
                {
                  type: 'group',
                  label: 'widget',
                  entries: [
                    {
                      type: 'link',
                      label: 'Using Released with Framer',
                      href: '/guide/getting-started/setup-guide/widget/using-released-with-framer/'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'group',
          label: 'product',
          entries: [
            {
              type: 'group',
              label: 'administration',
              entries: [
                {
                  type: 'link',
                  label: 'Administration',
                  href: '/guide/product/administration/'
                },
                {
                  type: 'link',
                  label: 'Product Hub',
                  href: '/guide/product/administration/general/'
                }
              ]
            },
            {
              type: 'group',
              label: 'changelog',
              entries: [
                {
                  type: 'group',
                  label: 'settings',
                  entries: [
                    {
                      type: 'link',
                      label: 'AI Settings',
                      href: '/guide/product/changelog/settings/artificial-intelligence/'
                    },
                    {
                      type: 'link',
                      label: 'Jira issue links',
                      href: '/guide/product/changelog/settings/jira-issue-links/'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const result = filterSidebarForPath('/guide/product/changelog/', structuredClone(sidebar));
  const groupDepth = (entries, depth = 0) =>
    Math.max(
      depth,
      ...entries.map((entry) =>
        entry.type === 'group' ? groupDepth(entry.entries ?? [], depth + 1) : depth
      )
    );

  assert.deepEqual(result.map((entry) => entry.label), ['Overview', 'Getting started', 'Product']);
  assert.equal(groupDepth(result), 2);
  assert.deepEqual(
    result[1].entries[1].entries.map((entry) => entry.label),
    ['Using Released with Framer']
  );
  assert.deepEqual(
    result[2].entries[0].entries.map((entry) => entry.label),
    ['Product Hub']
  );
  assert.deepEqual(
    result[2].entries[1].entries.map((entry) => entry.label),
    ['AI settings', 'Jira issue links']
  );
});
