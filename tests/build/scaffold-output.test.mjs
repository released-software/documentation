import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

test('the production build includes the initial documentation routes and Pagefind index', async () => {
  await access(new URL('../../dist/guide/index.html', import.meta.url));
  await access(new URL('../../dist/betterboard/index.html', import.meta.url));

  const pagefind = await stat(new URL('../../dist/pagefind/', import.meta.url));
  assert.equal(pagefind.isDirectory(), true);
});

test('the production pages use the Released product icon as their favicon', async () => {
  const html = await readFile(
    new URL('../../dist/guide/index.html', import.meta.url),
    'utf8'
  );

  assert.match(
    html,
    /<link[^>]+rel="shortcut icon"[^>]+href="\/brand\/released-favicon\.svg"/
  );
});
