import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { load } from 'cheerio';

test('renders Mermaid sequence diagrams as accessible SVGs', async () => {
  const html = await readFile(
    new URL(
      '../../dist/guide/getting-started/setup-guide/implementing-user-verification/index.html',
      import.meta.url
    ),
    'utf8'
  );
  const $ = load(html);
  const diagram = $('figure[data-mermaid-diagram]');

  assert.equal(diagram.length, 1);
  assert.equal(diagram.find('svg').length, 1);
  assert.match(diagram.text(), /Authentication success\/failure/);
});

test('renders both implementation demos as external-link buttons', async () => {
  const html = await readFile(
    new URL(
      '../../dist/guide/getting-started/setup-guide/implementing-user-verification/index.html',
      import.meta.url
    ),
    'utf8'
  );
  const $ = load(html);
  const demos = $('a.sl-link-button.secondary');

  for (const label of ['NextJS demo', 'Express demo']) {
    const demo = demos.filter((_, link) => $(link).text().trim() === label);

    assert.equal(demo.length, 1);
    assert.equal(demo.find('svg[aria-hidden="true"]').length, 1);
  }
});
