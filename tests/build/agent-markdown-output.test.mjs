import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('the production build publishes clean Markdown for documentation entries', async () => {
  const overview = await readFile(
    new URL('../../dist/guide.md', import.meta.url),
    'utf8'
  );
  const concepts = await readFile(
    new URL('../../dist/guide/getting-started/concepts.md', import.meta.url),
    'utf8'
  );
  const fieldTypes = await readFile(
    new URL(
      '../../dist/betterboard/shape-the-board/field-types.md',
      import.meta.url
    ),
    'utf8'
  );

  assert.match(overview, /^# Overview$/m);
  assert.match(overview, /^## Getting started$/m);
  assert.match(concepts, /^# Concepts$/m);
  assert.match(fieldTypes, /^# Field types$/m);
  assert.match(fieldTypes, /^## Field notes$/m);
  assert.match(
    concepts,
    /!\[Untitled whiteboard 2025 11 24\]\(\/media\/hub\/Untitled%20whiteboard%202025-11-24\.png\)/
  );

  for (const markdown of [overview, concepts]) {
    assert.doesNotMatch(markdown, /^import /m);
    assert.doesNotMatch(
      markdown,
      /<(?:Figure|NeutralCallout|LinkRow|ResponsiveEmbed|OverviewSection)\b/
    );
  }

  await assert.rejects(
    access(
      new URL(
        '../../dist/component-tests/generated-content-components.md',
        import.meta.url
      )
    ),
    { code: 'ENOENT' }
  );
});

test('the production build publishes an absolute Markdown documentation index', async () => {
  const index = await readFile(
    new URL('../../dist/llms.txt', import.meta.url),
    'utf8'
  );

  assert.match(index, /^# Hub documentation$/m);
  assert.match(index, /^## Hub$/m);
  assert.match(index, /^## BetterBoard$/m);
  assert.match(
    index,
    /https:\/\/docs\.released\.so\/guide\/getting-started\/concepts\.md/
  );
  assert.match(
    index,
    /https:\/\/docs\.released\.so\/betterboard\/start\/quick-start\.md/
  );
  assert.match(
    index,
    /https:\/\/docs\.released\.so\/betterboard\/shape-the-board\/field-types\.md/
  );
  assert.doesNotMatch(
    index,
    /https:\/\/docs\.released\.so\/betterboard\/shape-the-board\/jira-assets\.md/
  );
  assert.doesNotMatch(index, /component-tests|generated-content-components/);
});
