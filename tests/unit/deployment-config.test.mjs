import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Cloudflare deploys the generated static site without framework autoconfiguration', async () => {
  const config = JSON.parse(
    await readFile(new URL('../../wrangler.jsonc', import.meta.url), 'utf8')
  );

  assert.equal(config.name, 'documentation');
  assert.deepEqual(config.assets, {
    directory: './dist',
    not_found_handling: '404-page'
  });
});
