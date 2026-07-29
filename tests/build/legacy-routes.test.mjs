import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const distRoot = path.join(repositoryRoot, 'dist');
const routes = JSON.parse(
  await readFile(
    new URL('../fixtures/legacy-hub-routes.json', import.meta.url),
    'utf8'
  )
);

function builtPagePath(route) {
  assert.match(route, /^\/guide\/(?:.*\/)?$/);
  return path.join(distRoot, decodeURIComponent(route.slice(1)), 'index.html');
}

test(`the production build preserves all ${routes.length} legacy Hub routes`, async () => {
  const missing = [];

  for (const route of routes) {
    try {
      await access(builtPagePath(route));
    } catch {
      missing.push(route);
    }
  }

  assert.deepEqual(
    missing,
    [],
    `missing ${missing.length} of ${routes.length} legacy Hub routes:\n${missing.join('\n')}`
  );
});
