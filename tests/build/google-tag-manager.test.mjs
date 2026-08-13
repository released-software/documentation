import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { load } from 'cheerio';
import fg from 'fast-glob';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const distRoot = path.join(repositoryRoot, 'dist');
const containerId = 'GTM-NLBNBC8';

test('every non-redirect HTML page includes the shared Google Tag Manager container', async (t) => {
  const failures = [];
  let scannedPages = 0;
  const htmlFiles = fg.sync('**/*.html', {
    cwd: distRoot,
    onlyFiles: true,
    unique: true
  }).sort();
  assert.notEqual(htmlFiles.length, 0, 'the build produced no HTML files');

  for (const relativePath of htmlFiles) {
    const html = await readFile(path.join(distRoot, relativePath), 'utf8');
    const $ = load(html);
    if ($('meta[http-equiv="refresh"]').length > 0) continue;
    scannedPages += 1;

    const bootstrap = $('head script').toArray().find((element) => {
      const source = $(element).html() ?? '';
      return source.includes('googletagmanager.com/gtm.js') && source.includes(containerId);
    });
    const noscriptFallbacks = $('noscript').toArray().filter((element) => {
      const fallback = $(element).html() ?? '';
      return fallback.includes(`https://www.googletagmanager.com/ns.html?id=${containerId}`);
    });

    if (!bootstrap) failures.push(`${relativePath} is missing the GTM bootstrap`);
    if (noscriptFallbacks.length !== 1) {
      failures.push(`${relativePath} has ${noscriptFallbacks.length} GTM noscript fallbacks`);
    }
    const firstBodyElement = $('body').children().first();
    if (!firstBodyElement.is('noscript') || !firstBodyElement.next().is('a.sl-skip-link')) {
      failures.push(`${relativePath} does not place the GTM fallback before Starlight's skip link`);
    }
    if ($('script[src*="googletagmanager.com/gtag/js"]').length > 0 || html.includes("gtag('config'")) {
      failures.push(`${relativePath} includes a separate Google Analytics snippet`);
    }
  }

  t.diagnostic(`scanned ${scannedPages} non-redirect HTML pages`);
  assert.deepEqual(failures, [], failures.join('\n'));
});
