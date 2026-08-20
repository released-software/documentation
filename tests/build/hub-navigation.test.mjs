import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { load } from 'cheerio';

test('Hub product section landing pages are present in the sidebar', async () => {
  const html = await readFile(
    new URL('../../dist/guide/product/changelog/index.html', import.meta.url),
    'utf8'
  );
  const $ = load(html);

  for (const href of [
    '/guide/product/roadmaps-and-ideas/',
    '/guide/product/feedback/',
    '/guide/product/changelog/'
  ]) {
    assert.ok($(`a[href="${href}"]`).length > 0, `${href} is absent from the sidebar`);
  }
});

test('the previous nested setup guide URL redirects to the setup guide landing page', async () => {
  const legacySetupGuide = await readFile(
    new URL(
      '../../dist/guide/getting-started/setup-guide/setting-up-your-product-hub/index.html',
      import.meta.url
    ),
    'utf8'
  );
  assert.match(legacySetupGuide, /content="0;url=\/guide\/getting-started\/setup-guide\/"/);
});
