import assert from 'node:assert/strict';
import test from 'node:test';

import {
  htmlPathForEntryId,
  isAgentDocument,
  markdownPathForEntryId,
  renderLlmsTxt
} from '../../src/data/agent-docs.mjs';

test('documentation entry IDs map to their public HTML and Markdown paths', () => {
  assert.equal(htmlPathForEntryId('guide/index'), '/guide/');
  assert.equal(markdownPathForEntryId('guide/index'), '/guide.md');
  assert.equal(
    htmlPathForEntryId('betterboard/start/quick-start'),
    '/betterboard/start/quick-start/'
  );
  assert.equal(
    markdownPathForEntryId('betterboard/start/quick-start'),
    '/betterboard/start/quick-start.md'
  );
});

test('only public documentation entries are available to agents', () => {
  assert.equal(isAgentDocument({ id: 'guide/index', data: {} }), true);
  assert.equal(isAgentDocument({ id: 'guide/draft', data: { draft: true } }), false);
  assert.equal(isAgentDocument({ id: '404', data: {} }), false);
  assert.equal(isAgentDocument({ id: 'guide/404', data: {} }), false);
  assert.equal(
    isAgentDocument({
      id: 'component-tests/generated-content-components',
      data: {}
    }),
    false
  );
});

test('llms.txt groups Markdown links by documentation space', () => {
  const index = renderLlmsTxt(
    [
      {
        id: 'betterboard/start/quick-start',
        data: {
          title: 'Quick start',
          description: 'Create your first board.',
          space: 'betterboard'
        }
      },
      {
        id: 'guide/getting-started/concepts',
        data: {
          title: 'Concepts',
          description: 'Understand the Released model.',
          space: 'hub'
        }
      },
      {
        id: 'guide/draft',
        data: {
          title: 'Draft',
          description: 'Not public.',
          space: 'hub',
          draft: true
        }
      }
    ],
    new URL('https://docs.released.so')
  );

  assert.equal(
    index,
    `# Released documentation

Documentation for Released Hub and BetterBoard.

## Hub

- [Concepts](https://docs.released.so/guide/getting-started/concepts.md): Understand the Released model.

## BetterBoard

- [Quick start](https://docs.released.so/betterboard/start/quick-start.md): Create your first board.
`
  );
});
