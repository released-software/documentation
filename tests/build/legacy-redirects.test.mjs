import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { load } from 'cheerio';
import fg from 'fast-glob';

import { legacyRedirects } from '../../src/data/legacy-redirects.mjs';

const siteOrigin = 'https://docs.released.so';
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const distRoot = path.join(repositoryRoot, 'dist');

function builtPagePath(route) {
  return path.join(distRoot, route.slice(1), 'index.html');
}

test(`the production build preserves all ${legacyRedirects.length} redirect aliases`, async () => {
  const failures = [];
  const sitemapUrls = new Set();

  for (const sitemapFile of fg.sync('sitemap-*.xml', {
    cwd: distRoot,
    onlyFiles: true,
    unique: true
  })) {
    const xml = await readFile(path.join(distRoot, sitemapFile), 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      sitemapUrls.add(match[1]);
    }
  }

  for (const { source, destination } of legacyRedirects) {
    let html;
    try {
      html = await readFile(builtPagePath(source), 'utf8');
    } catch {
      failures.push(`${source} has no local redirect page`);
      continue;
    }

    const $ = load(html);
    const canonical = $('link[rel="canonical"]').attr('href');
    const robots = $('meta[name="robots"]').attr('content') ?? '';
    const refresh = $('meta[http-equiv="refresh"]').attr('content') ?? '';

    if (canonical !== new URL(destination, siteOrigin).href) {
      failures.push(`${source} canonical points to ${canonical ?? 'nothing'}`);
    }
    if (!/\bnoindex\b/i.test(robots)) {
      failures.push(`${source} is not marked noindex`);
    }
    if (!refresh.includes(destination)) {
      failures.push(`${source} does not refresh to ${destination}`);
    }
    if (sitemapUrls.has(new URL(`${source}/`, siteOrigin).href)) {
      failures.push(`${source} appears in the sitemap`);
    }

    try {
      await access(builtPagePath(destination));
    } catch {
      failures.push(`${source} points to missing destination ${destination}`);
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'));
});

test('the production build contains the reviewed Cloudflare rules', async () => {
  const [sourceRules, builtRules] = await Promise.all([
    readFile(path.join(repositoryRoot, 'public', '_redirects'), 'utf8'),
    readFile(path.join(distRoot, '_redirects'), 'utf8')
  ]);

  assert.equal(builtRules, sourceRules);
});
