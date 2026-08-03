import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the production build exposes the sitemap index at the stable sitemap URL', async () => {
  const [sitemap, sitemapIndex, robots] = await Promise.all([
    readFile(new URL('../../dist/sitemap.xml', import.meta.url), 'utf8'),
    readFile(new URL('../../dist/sitemap-index.xml', import.meta.url), 'utf8'),
    readFile(new URL('../../dist/robots.txt', import.meta.url), 'utf8')
  ]);

  assert.equal(sitemap, sitemapIndex);
  assert.match(sitemap, /<sitemapindex\b/);
  assert.match(robots, /^Sitemap: https:\/\/docs\.released\.so\/sitemap\.xml$/m);
});
