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
