import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import matter from 'gray-matter';

const sourceUrl = new URL(
  '../fixtures/gitbook/all-content-components.md',
  import.meta.url
);
const outputUrl = new URL(
  '../../src/content/docs/component-tests/generated-content-components.mdx',
  import.meta.url
);

test('the committed all-component MDX fixture is deterministic converter output', async () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/generate-content-component-fixture.mjs', '--check'],
    {
      cwd: new URL('../..', import.meta.url),
      encoding: 'utf8'
    }
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const source = await readFile(sourceUrl, 'utf8');
  const output = await readFile(outputUrl, 'utf8');

  assert.match(source, /Fixture sources:/);
  assert.match(output, /pagefind: false/);
  assert.deepEqual(matter(output).data.head, [
    {
      tag: 'meta',
      attrs: {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    }
  ]);
  assert.match(output, /import NeutralCallout from/);
  assert.match(output, /import LinkRow from/);
  assert.match(output, /import Figure from/);
  assert.match(output, /import ResponsiveEmbed from/);
  assert.match(
    output,
    /<LinkRow href="\/guide\/" title="Hub documentation" description="Return to the Hub documentation overview\." \/>/
  );
  assert.match(output, /width=\{96\} height=\{96\}/);
  assert.match(output, /provider="loom"/);
  assert.match(output, /provider="youtube"/);
});
