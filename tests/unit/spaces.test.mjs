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

test('normalizes Hub navigation into one collapsed category level', () => {
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
            },
            {
              type: 'group',
              label: 'best-practices',
              entries: [
                {
                  type: 'link',
                  label: 'Best practices',
                  href: '/guide/getting-started/best-practices/'
                },
                {
                  type: 'link',
                  label: 'Customer communication',
                  href: '/guide/getting-started/best-practices/customer-communication/'
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
        },
        {
          type: 'group',
          label: 'resources',
          entries: [
            {
              type: 'group',
              label: 'ai-tips',
              entries: [
                {
                  type: 'link',
                  label: 'Create output in other languages',
                  href: '/guide/resources/ai-tips/create-output-in-other-languages/'
                }
              ]
            },
            {
              type: 'group',
              label: 'troubleshooting',
              entries: [
                {
                  type: 'link',
                  label: 'Embeds',
                  href: '/guide/resources/troubleshooting/embeds/'
                }
              ]
            },
            {
              type: 'group',
              label: 'how-tos',
              entries: [
                {
                  type: 'link',
                  label: 'Finding the channel/form ID',
                  href: '/guide/resources/how-tos/finding-the-channel-id/'
                }
              ]
            }
          ]
        },
        {
          type: 'group',
          label: 'product-tour',
          entries: [
            {
              type: 'group',
              label: 'settings',
              entries: [
                {
                  type: 'link',
                  label: 'Widget configuration',
                  href: '/guide/product-tour/settings/widget-configuration/'
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

  assert.deepEqual(
    result.map((entry) => entry.label),
    [
      'Overview',
      'Getting started',
      'Best practices',
      'Administration',
      'Changelog',
      'AI tips',
      'Troubleshooting',
      'How-tos',
      'Product tour'
    ]
  );
  assert.equal(groupDepth(result), 1);
  assert.ok(
    result
      .filter((entry) => entry.type === 'group')
      .every((entry) => entry.collapsed === true)
  );
  assert.ok(
    result
      .filter((entry) => entry.type === 'group')
      .every((entry) => entry.entries.every((child) => child.type === 'link'))
  );
  assert.deepEqual(
    result.find((entry) => entry.label === 'Getting started').entries.map((entry) => entry.label),
    ['Concepts', 'Using Released with Framer']
  );
  assert.deepEqual(
    result.find((entry) => entry.label === 'Best practices').entries.map((entry) => entry.label),
    ['Customer communication']
  );
  assert.deepEqual(
    result.find((entry) => entry.label === 'Administration').entries.map((entry) => entry.label),
    ['Product Hub']
  );
  assert.deepEqual(
    result.find((entry) => entry.label === 'Changelog').entries.map((entry) => entry.label),
    ['AI settings', 'Jira issue links']
  );
  assert.deepEqual(
    result.find((entry) => entry.label === 'Product tour').entries.map((entry) => entry.label),
    ['Widget configuration']
  );
});

test('orders and labels BetterBoard navigation without its outer wrapper', () => {
  const sidebar = [
    {
      type: 'group',
      label: 'BetterBoard documentation',
      entries: [
        {
          type: 'link',
          label: 'BetterBoard documentation',
          href: '/betterboard/'
        },
        {
          type: 'group',
          label: 'board-setup',
          entries: [
            {
              type: 'link',
              label: 'Creating and managing boards',
              href: '/betterboard/board-setup/creating-managing-boards/'
            }
          ]
        },
        {
          type: 'group',
          label: 'shape-the-board',
          entries: [
            {
              type: 'link',
              label: 'Columns and grouping',
              href: '/betterboard/shape-the-board/columns-grouping/'
            }
          ]
        },
        {
          type: 'group',
          label: 'start',
          entries: [
            {
              type: 'link',
              label: 'Overview',
              href: '/betterboard/start/overview/'
            }
          ]
        },
        {
          type: 'group',
          label: 'work-faster',
          entries: [
            {
              type: 'link',
              label: 'Keyboard shortcuts',
              href: '/betterboard/work-faster/keyboard-shortcuts/'
            }
          ]
        }
      ]
    }
  ];

  const result = filterSidebarForPath(
    '/betterboard/shape-the-board/columns-grouping/',
    structuredClone(sidebar)
  );

  assert.deepEqual(
    result.map(({ label }) => label),
    [
      'BetterBoard documentation',
      'Start',
      'Board setup',
      'Shape the board',
      'Work faster'
    ]
  );
  assert.ok(
    result
      .filter(({ type }) => type === 'group')
      .every(({ collapsed }) => collapsed === true)
  );
  assert.deepEqual(
    result.find(({ label }) => label === 'Shape the board').entries,
    [
      {
        type: 'link',
        label: 'Columns and grouping',
        href: '/betterboard/shape-the-board/columns-grouping/'
      }
    ]
  );
});
