import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the project exposes the required verification commands', async () => {
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));
  for (const script of ['dev', 'build', 'check', 'test:unit', 'test:build', 'test:e2e', 'test']) {
    assert.equal(typeof pkg.scripts[script], 'string', `missing npm script: ${script}`);
  }
});
