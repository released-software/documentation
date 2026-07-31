import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { load } from 'cheerio';

import { betterBoardDocs } from '../../src/data/betterboard-docs.mjs';

const distRoot = new URL('../../dist/', import.meta.url);

async function exists(url) {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

test('the production build contains the BetterBoard landing and all 20 mapped articles', async () => {
  const failures = [];
  const landingUrl = new URL('betterboard/index.html', distRoot);

  if (!(await exists(landingUrl))) {
    failures.push('missing /betterboard/');
  } else {
    const $ = load(await readFile(landingUrl, 'utf8'));
    const landingLinks = new Set(
      $('main a[href^="/betterboard/"]')
        .toArray()
        .map((element) => $(element).attr('href'))
    );
    for (const doc of betterBoardDocs) {
      const route = `/betterboard/${doc.destinationSlug}/`;
      if (!landingLinks.has(route)) {
        failures.push(`/betterboard/ does not link to ${route}`);
      }
    }
  }

  for (const doc of betterBoardDocs) {
    const route = `/betterboard/${doc.destinationSlug}/`;
    const fileUrl = new URL(
      `betterboard/${doc.destinationSlug}/index.html`,
      distRoot
    );
    if (!(await exists(fileUrl))) {
      failures.push(`missing ${route}`);
      continue;
    }

    const $ = load(await readFile(fileUrl, 'utf8'));
    const heading = $('main h1').first().text().replace(/\s+/g, ' ').trim();
    if (heading !== doc.title) {
      failures.push(`${route} has heading "${heading}" instead of "${doc.title}"`);
    }
    if ($('[data-pagefind-filter="space:betterboard"]').length !== 1) {
      failures.push(`${route} does not expose the BetterBoard search filter`);
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'));
});

test('the production build makes Field types the Jira Assets reference', async () => {
  const assetsRoute = '/betterboard/shape-the-board/jira-assets/';
  const assetsFile = new URL(
    'betterboard/shape-the-board/jira-assets/index.html',
    distRoot
  );
  const fieldTypes = load(
    await readFile(
      new URL('betterboard/shape-the-board/field-types/index.html', distRoot),
      'utf8'
    )
  );
  const landing = load(
    await readFile(new URL('betterboard/index.html', distRoot), 'utf8')
  );

  assert.equal(fieldTypes('main #assets').length, 1);
  assert.match(
    fieldTypes('main').text(),
    /Field type\s+Display\s+Filter\s+Grouping\s+Columns\s+Edit/
  );
  assert.equal(landing(`main a[href="${assetsRoute}"]`).length, 0);
  assert.equal(await exists(assetsFile), false);
});

test('related BetterBoard guides link to the Jira Assets guide', async () => {
  const assetsRoute = '/betterboard/shape-the-board/field-types/#assets';
  const relatedRoutes = [
    'betterboard/shape-the-board/display-fields/index.html',
    'betterboard/shape-the-board/columns-grouping/index.html',
    'betterboard/work-faster/filters-refinement/index.html',
    'betterboard/work-faster/filter-operators/index.html',
    'betterboard/work-faster/drag-and-drop/index.html'
  ];

  for (const relatedRoute of relatedRoutes) {
    const relatedPage = load(
      await readFile(new URL(relatedRoute, distRoot), 'utf8')
    );
    assert.ok(
      relatedPage(`main a[href="${assetsRoute}"]`).length > 0,
      `${relatedRoute} does not link to ${assetsRoute}`
    );
  }
});

test('the committed BetterBoard migration report accounts for every mapped source', async () => {
  const report = JSON.parse(
    await readFile(
      new URL('../../reports/betterboard-migration-summary.json', import.meta.url),
      'utf8'
    )
  );

  assert.equal(report.sourcePages, 21);
  assert.equal(report.generatedPages, 21);
  assert.deepEqual(
    report.articles.map(({ sourceSlug }) => sourceSlug),
    betterBoardDocs.map(({ sourceSlug }) => sourceSlug)
  );
});
