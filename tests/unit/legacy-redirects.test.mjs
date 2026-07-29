import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { renderCloudflareRedirects } from '../../scripts/generate-cloudflare-redirects.mjs';
import { legacyRedirects } from '../../src/data/legacy-redirects.mjs';

const currentHubRoutes = new Set(
  JSON.parse(
    fs.readFileSync(new URL('../fixtures/legacy-hub-routes.json', import.meta.url), 'utf8')
  )
);

test('legacy redirect inventory is exact, canonical, and one hop', () => {
  assert.equal(legacyRedirects.length, 181);

  const sources = new Set();
  for (const { source, destination } of legacyRedirects) {
    assert.match(source, /^\/guide\/[a-z0-9/-]+$/);
    assert.equal(source.endsWith('/'), false);
    assert.match(destination, /^\/guide\/[a-z0-9/-]+\/$/);
    assert.equal(currentHubRoutes.has(destination), true, `${destination} is not canonical`);
    assert.equal(sources.has(source), false, `${source} is duplicated`);
    sources.add(source);
  }

  for (const { destination } of legacyRedirects) {
    assert.equal(
      sources.has(destination.replace(/\/$/, '')),
      false,
      `${destination} creates a redirect chain`
    );
  }

  assert.deepEqual(
    legacyRedirects.find(({ source }) => source === '/guide/getting-started/installation'),
    {
      source: '/guide/getting-started/installation',
      destination: '/guide/getting-started/setup-guide/installing-the-app/'
    }
  );
  assert.deepEqual(
    legacyRedirects.find(({ source }) => source === '/guide/workspace/changelog'),
    {
      source: '/guide/workspace/changelog',
      destination: '/guide/product/changelog/'
    }
  );
});

test('Cloudflare rules permanently redirect both legacy slash forms', () => {
  const rules = renderCloudflareRedirects(legacyRedirects)
    .split('\n')
    .filter((line) => line && !line.startsWith('#'));

  assert.equal(rules.length, 362);
  assert.deepEqual(rules.slice(0, 2), [
    '/guide/getting-started/best-practices/setting-up-your-product-hub /guide/getting-started/setup-guide/setting-up-your-product-hub/ 301',
    '/guide/getting-started/best-practices/setting-up-your-product-hub/ /guide/getting-started/setup-guide/setting-up-your-product-hub/ 301'
  ]);

  for (const line of rules) {
    assert.match(line, /^\/guide\/\S+ \/guide\/\S+\/ 301$/);
  }
});
