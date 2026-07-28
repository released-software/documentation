import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const pagefindDirectory = new URL('../../dist/pagefind/', import.meta.url);
const knownSpaces = new Set(['hub', 'betterboard', 'partners']);

globalThis.fetch = async (input) => {
  const url = new URL(typeof input === 'string' ? input : input.url, pagefindDirectory);
  const body = await readFile(fileURLToPath(url));

  return new Response(body, {
    headers: {
      'content-type': url.pathname.endsWith('.wasm')
        ? 'application/wasm'
        : 'application/octet-stream'
    }
  });
};

const entry = JSON.parse(
  await readFile(new URL('pagefind-entry.json', pagefindDirectory), 'utf8')
);
const pagefind = await import('../../dist/pagefind/pagefind.js');

test('the built Pagefind metadata exposes Hub and BetterBoard space filters', async () => {
  assert.ok(entry.languages.en, 'expected an English Pagefind index');

  const filters = await pagefind.filters();

  assert.deepEqual(Object.keys(filters.space ?? {}).sort(), ['betterboard', 'hub']);
});

test('every searchable page has exactly one known documentation space', async () => {
  const response = await pagefind.search(null);
  const pages = await Promise.all(response.results.map((result) => result.data()));

  assert.equal(pages.length, entry.languages.en.page_count);
  assert.ok(pages.length > 0, 'expected at least one indexed content page');

  for (const page of pages) {
    const spaceValues = Array.isArray(page.filters.space)
      ? page.filters.space
      : [page.filters.space].filter(Boolean);

    assert.equal(
      spaceValues.length,
      1,
      `expected ${page.raw_url} to have exactly one space filter`
    );
    assert.ok(
      knownSpaces.has(spaceValues[0]),
      `expected ${page.raw_url} to use a known space filter`
    );
    assert.equal(page.meta.space, spaceValues[0]);
  }
});

test('splash destinations are absent from searchable pages', async () => {
  const response = await pagefind.search(null);
  const pages = await Promise.all(response.results.map((result) => result.data()));
  const urls = pages.map((page) => page.raw_url);

  assert.ok(urls.includes('/guide/'));
  assert.ok(urls.includes('/betterboard/'));
  assert.ok(!urls.includes('/'));
  assert.ok(!urls.includes('/partners/'));
});

test('substantive Hub content creates its Pagefind record without a title fallback', async () => {
  const response = await pagefind.search(null);
  const pages = await Promise.all(response.results.map((result) => result.data()));
  const hub = pages.find((page) => page.raw_url === '/guide/');
  const betterboard = pages.find((page) => page.raw_url === '/betterboard/');

  assert.equal(hub?.meta.title, 'Overview');
  assert.match(hub?.raw_content ?? '', /Getting started/);
  const hubHtml = await readFile(
    new URL('../../dist/guide/index.html', import.meta.url),
    'utf8'
  );
  assert.doesNotMatch(hubHtml, /temporary-empty-hub-pagefind-title/);
  assert.equal(
    betterboard?.raw_content.match(/BetterBoard documentation/g)?.length,
    1,
    'expected BetterBoard to contain only its substantive body title'
  );
});
