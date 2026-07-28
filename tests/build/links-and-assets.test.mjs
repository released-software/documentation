import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { load } from 'cheerio';
import fg from 'fast-glob';

const siteOrigin = 'https://docs.released.so';
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const distRoot = path.join(repositoryRoot, 'dist');
const legacyRoutes = JSON.parse(
  await readFile(
    new URL('../fixtures/legacy-hub-routes.json', import.meta.url),
    'utf8'
  )
);
const htmlFiles = fg.sync('**/*.html', {
  cwd: distRoot,
  onlyFiles: true,
  unique: true
}).sort();

function routeForHtmlFile(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  return `/${relativePath}`;
}

function builtPathForUrl(url) {
  const decodedPath = decodeURIComponent(url.pathname);
  if (decodedPath.endsWith('/')) {
    return path.join(distRoot, decodedPath.slice(1), 'index.html');
  }
  return path.join(distRoot, decodedPath.slice(1));
}

function isDocumentationPath(pathname) {
  return /^\/(?:guide|betterboard)(?:\/|$)/.test(pathname);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function srcsetUrls(value) {
  return value
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
    .filter(Boolean);
}

test('built documentation links, fragments, and Hub media references resolve', async () => {
  const failures = [];

  for (const relativePath of htmlFiles) {
    const pageRoute = routeForHtmlFile(relativePath);
    const html = await readFile(path.join(distRoot, relativePath), 'utf8');
    const $ = load(html);

    for (const element of $('a[href]').toArray()) {
      const href = $(element).attr('href');
      if (!href) continue;

      let target;
      try {
        target = new URL(href, new URL(pageRoute, siteOrigin));
      } catch {
        failures.push(`${pageRoute} has malformed link ${href}`);
        continue;
      }
      if (target.origin !== siteOrigin) continue;

      if (isDocumentationPath(target.pathname)) {
        if (!target.pathname.endsWith('/')) {
          failures.push(`${pageRoute} links to non-trailing-slash URL ${href}`);
        }
        if (!(await exists(builtPathForUrl(target)))) {
          failures.push(`${pageRoute} links to missing page ${href}`);
          continue;
        }
      }

      if (!target.hash) continue;
      const destinationPath = builtPathForUrl(target);
      if (!(await exists(destinationPath))) continue;
      const destination = load(await readFile(destinationPath, 'utf8'));
      const fragment = decodeURIComponent(target.hash.slice(1));
      const identifiers = new Set([
        ...destination('[id]').toArray().map((node) => destination(node).attr('id')),
        ...destination('a[name]').toArray().map((node) => destination(node).attr('name'))
      ]);
      if (!identifiers.has(fragment)) {
        failures.push(`${pageRoute} links to missing fragment ${href}`);
      }
    }

    for (const element of $('[src], [srcset], [poster]').toArray()) {
      const references = [
        $(element).attr('src'),
        $(element).attr('poster'),
        ...srcsetUrls($(element).attr('srcset') ?? '')
      ].filter(Boolean);

      for (const reference of references) {
        const target = new URL(reference, new URL(pageRoute, siteOrigin));
        if (target.origin !== siteOrigin || !target.pathname.startsWith('/media/')) {
          continue;
        }
        if (!(await exists(builtPathForUrl(target)))) {
          failures.push(`${pageRoute} references missing media ${reference}`);
        }
      }
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'));
});

test('built canonicals and sitemap retain the documentation origin and trailing slashes', async () => {
  const failures = [];
  const indexedCanonicals = new Set();

  for (const relativePath of htmlFiles) {
    const pageRoute = routeForHtmlFile(relativePath);
    const html = await readFile(path.join(distRoot, relativePath), 'utf8');
    const $ = load(html);
    const canonicalHref = $('link[rel="canonical"]').attr('href');

    if (isDocumentationPath(pageRoute) && !canonicalHref) {
      failures.push(`${pageRoute} has no canonical URL`);
      continue;
    }
    if (!canonicalHref) continue;

    const canonical = new URL(canonicalHref);
    if (canonical.origin !== siteOrigin) {
      failures.push(`${pageRoute} canonical uses ${canonical.origin}`);
    }
    if (isDocumentationPath(canonical.pathname) && !canonical.pathname.endsWith('/')) {
      failures.push(`${pageRoute} canonical lacks a trailing slash: ${canonicalHref}`);
    }

    const robots = $('meta[name="robots"]').attr('content') ?? '';
    if ($('[data-pagefind-body]').length > 0 && !/\bnoindex\b/i.test(robots)) {
      indexedCanonicals.add(canonical.href);
    }
  }

  const sitemapFiles = fg.sync('sitemap-*.xml', {
    cwd: distRoot,
    onlyFiles: true,
    unique: true
  }).filter((filePath) => filePath !== 'sitemap-index.xml');
  const sitemapUrls = new Set();
  for (const sitemapFile of sitemapFiles) {
    const xml = await readFile(path.join(distRoot, sitemapFile), 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      sitemapUrls.add(match[1]);
    }
  }

  for (const route of legacyRoutes) {
    const url = new URL(route, siteOrigin).href;
    if (!sitemapUrls.has(url)) {
      failures.push(`sitemap is missing legacy route ${route}`);
    }
  }
  for (const canonical of indexedCanonicals) {
    if (!sitemapUrls.has(canonical)) {
      failures.push(`sitemap is missing indexed canonical ${canonical}`);
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'));
});
