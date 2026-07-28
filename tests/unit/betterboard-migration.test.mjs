import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';

import {
  assertUniqueDocMappings,
  betterBoardDocs
} from '../../src/data/betterboard-docs.mjs';
import { convertBetterBoardPage } from '../../scripts/migrate-betterboard.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, '..', '..');
const fixturePath = path.join(
  testDirectory,
  '..',
  'fixtures',
  'betterboard',
  'source-page.astro'
);

function sourcePage({ title, description, body = '<p>Article body.</p>' }) {
  return `---
import SeoHead from '../../../components/SeoHead.astro';
---
<SeoHead
  title="${title} — BetterBoard Documentation"
  description="${description}"
/>
<main class="docs-content">
  <h1>${title}</h1>
  ${body}
</main>
`;
}

function createCompleteSource() {
  const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'betterboard-source-'));
  const docsRoot = path.join(sourceRoot, 'src', 'pages', 'docs');
  fs.mkdirSync(docsRoot, { recursive: true });
  fs.writeFileSync(
    path.join(docsRoot, 'index.astro'),
    '<main><h1>BetterBoard documentation</h1></main>\n'
  );

  for (const doc of betterBoardDocs) {
    const directory = path.join(docsRoot, doc.sourceSlug);
    fs.mkdirSync(directory, { recursive: true });
    const body = doc.sourceSlug === 'card-colors'
      ? `<figure>
          <img src="/images/docs/card-colors-example.png" alt="Card colors" width="1320" height="743" />
          <figcaption>Card colors</figcaption>
        </figure>`
      : '<p>Article body.</p>';
    fs.writeFileSync(
      path.join(directory, 'index.astro'),
      sourcePage({
        title: doc.title,
        description: `${doc.title} description.`,
        body
      })
    );
  }

  const mediaRoot = path.join(sourceRoot, 'public', 'images', 'docs');
  fs.mkdirSync(mediaRoot, { recursive: true });
  fs.writeFileSync(path.join(mediaRoot, 'card-colors-example.png'), 'fixture-image');
  fs.writeFileSync(path.join(mediaRoot, 'unreferenced.png'), 'do-not-copy');
  return sourceRoot;
}

test('the route map contains 20 unique BetterBoard articles in four sections', () => {
  assert.equal(betterBoardDocs.length, 20);
  assert.deepEqual(
    [...new Set(betterBoardDocs.map(({ section }) => section))],
    ['start', 'board-setup', 'shape-the-board', 'work-faster']
  );
  assert.doesNotThrow(() => assertUniqueDocMappings(betterBoardDocs));
  assert.equal(
    betterBoardDocs.find(({ sourceSlug }) => sourceSlug === 'card-colors')
      ?.destinationSlug,
    'shape-the-board/card-colors'
  );
  assert.equal(
    betterBoardDocs.find(({ sourceSlug }) => sourceSlug === 'global-board-directory')
      ?.destinationSlug,
    'board-setup/global-board-directory'
  );
});

test('duplicate source and destination slugs are rejected before migration', () => {
  const first = betterBoardDocs[0];
  const second = betterBoardDocs[1];

  assert.throws(
    () => assertUniqueDocMappings([first, { ...second, sourceSlug: first.sourceSlug }]),
    /Duplicate BetterBoard source slug "overview"/
  );
  assert.throws(
    () => assertUniqueDocMappings([
      first,
      { ...second, destinationSlug: first.destinationSlug }
    ]),
    /Duplicate BetterBoard destination slug "start\/overview"/
  );
});

test('the converter extracts article content and rewrites routes, media, and components', async () => {
  const result = convertBetterBoardPage(
    fs.readFileSync(fixturePath, 'utf8'),
    betterBoardDocs.find(({ sourceSlug }) => sourceSlug === 'card-colors')
  );
  const parsed = matter(result.content);

  assert.deepEqual(parsed.data, {
    title: 'Card colors',
    description: 'Color cards with conditional formatting based on Jira field values.',
    space: 'betterboard',
    sidebar: { order: 5 }
  });
  assert.doesNotMatch(parsed.content, /^# Card Colors$/m);
  assert.match(parsed.content, /^## Configure rules$/m);
  assert.match(parsed.content, /-\s+First rule/);
  assert.match(
    parsed.content,
    /\[Shortcuts\]\(\/betterboard\/work-faster\/keyboard-shortcuts\/#command-palette\)/
  );
  assert.match(
    parsed.content,
    /\[Atlassian Marketplace\]\(https:\/\/marketplace\.atlassian\.com\/apps\/4162439467\)/
  );
  assert.match(
    parsed.content,
    /<Figure[\s\S]*src="\/media\/betterboard\/card-colors-example\.png"/
  );
  assert.match(parsed.content, /caption="Several card-color effects applied to one board\."/);
  assert.match(parsed.content, /<NeutralCallout type="caution">/);
  assert.match(parsed.content, /<table>/);
  assert.match(parsed.content, /```json\n\{"enabled": true\}\n```/);
  assert.match(
    parsed.content,
    /<a id="short-anchor"><\/a>\n\n## A longer heading label/
  );
  assert.doesNotMatch(
    parsed.content,
    /marketing navigation|Source documentation sidebar|Released footer|sourceSiteOnly/
  );
  assert.doesNotMatch(parsed.content, /\b(?:class|style)=/);
  assert.deepEqual(result.assets, [
    {
      sourcePath: 'public/images/docs/card-colors-example.png',
      destinationPath: 'public/media/betterboard/card-colors-example.png'
    }
  ]);

  await compile(result.content);
});

test('the migration CLI writes every mapped page, a complete report, and referenced media only', () => {
  const sourceRoot = createCompleteSource();
  const outputRoot = path.join(sourceRoot, 'generated', 'betterboard');
  const reportPath = path.join(sourceRoot, 'generated', 'betterboard-report.json');
  const result = spawnSync(
    process.execPath,
    [
      path.join(repositoryRoot, 'scripts', 'migrate-betterboard.mjs'),
      '--source',
      sourceRoot,
      '--output',
      outputRoot,
      '--public',
      path.join(sourceRoot, 'public'),
      '--report',
      reportPath
    ],
    { cwd: repositoryRoot, encoding: 'utf8' }
  );

  assert.equal(result.status, 0, result.stderr);
  for (const doc of betterBoardDocs) {
    assert.equal(
      fs.existsSync(path.join(outputRoot, `${doc.destinationSlug}.mdx`)),
      true,
      `missing ${doc.destinationSlug}`
    );
  }
  assert.equal(fs.existsSync(path.join(outputRoot, 'index.mdx')), true);

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert.equal(report.sourcePages, 21);
  assert.equal(report.articles.length, 20);
  assert.deepEqual(
    report.articles.find(({ sourceSlug }) => sourceSlug === 'card-colors'),
    {
      sourceSlug: 'card-colors',
      sourcePath: 'src/pages/docs/card-colors/index.astro',
      destinationRoute: '/betterboard/shape-the-board/card-colors/',
      title: 'Card colors',
      imageCount: 1,
      internalLinkCount: 0,
      reviewStatus: 'migrated'
    }
  );
  assert.equal(
    fs.existsSync(
      path.join(sourceRoot, 'public', 'media', 'betterboard', 'card-colors-example.png')
    ),
    true
  );
  assert.equal(
    fs.existsSync(
      path.join(sourceRoot, 'public', 'media', 'betterboard', 'unreferenced.png')
    ),
    false
  );
});

test('the migration fails when any mapped source page is absent', () => {
  const sourceRoot = createCompleteSource();
  fs.rmSync(
    path.join(sourceRoot, 'src', 'pages', 'docs', 'global-board-directory'),
    { recursive: true }
  );
  const result = spawnSync(
    process.execPath,
    [
      path.join(repositoryRoot, 'scripts', 'migrate-betterboard.mjs'),
      '--source',
      sourceRoot,
      '--output',
      path.join(sourceRoot, 'generated')
    ],
    { cwd: repositoryRoot, encoding: 'utf8' }
  );

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /Missing BetterBoard source page "src\/pages\/docs\/global-board-directory\/index\.astro"/
  );
});
