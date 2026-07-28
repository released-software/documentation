#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { load } from 'cheerio';
import matter from 'gray-matter';
import TurndownService from 'turndown';

import {
  assertUniqueDocMappings,
  betterBoardDocs
} from '../src/data/betterboard-docs.mjs';

const sectionLabels = new Map([
  ['start', 'Start'],
  ['board-setup', 'Board setup'],
  ['shape-the-board', 'Shape the board'],
  ['work-faster', 'Work faster']
]);

const landingDescriptions = new Map([
  ['overview', 'What BetterBoard changes about Jira boards and where to begin.'],
  ['installation', 'Install BetterBoard from the Atlassian Marketplace and open it in Jira.'],
  ['quick-start', 'Create your first board, add spaces, and tune the view.'],
  ['faq', 'Common setup, permission, billing, and usage questions.'],
  ['creating-managing-boards', 'Create boards, edit settings, and choose who can see them.'],
  ['multi-space-boards', 'Bring work items from multiple Jira spaces into one board.'],
  ['global-board-directory', 'Find shared boards across your Jira site.'],
  ['board-visibility', 'Control private and shared board access.'],
  ['columns-grouping', 'Group cards by status, assignee, priority, or mapped field options.'],
  ['status-mapping', 'Map Jira statuses into clearer board columns across spaces.'],
  ['display-fields', 'Choose which fields appear on cards and how merged fields behave.'],
  ['field-types', 'See how BetterBoard handles Jira field types.'],
  ['card-colors', 'Use field data to color cards, borders, and accents.'],
  ['filters-refinement', 'Filter the board without reaching for JQL.'],
  ['filter-operators', 'Understand each supported filter operator.'],
  ['sorting-ordering', 'Sort cards and keep board order predictable.'],
  ['drag-and-drop', 'Move cards and understand when Jira workflow rules apply.'],
  ['inline-editing', 'Edit fields directly on the board, including bulk edits.'],
  ['sprint-management', 'Plan sprint work from the board view.'],
  ['keyboard-shortcuts', 'Navigate and edit from the keyboard.']
]);

const docsBySourceSlug = new Map(
  betterBoardDocs.map((doc) => [doc.sourceSlug, doc])
);
const marketplaceUrl = 'https://marketplace.atlassian.com/apps/4162439467';

function parseArguments(argv) {
  const options = {
    source: '/Users/jschumacher/Development/Released/betterboard-website',
    output: 'src/content/docs/betterboard',
    public: 'public',
    report: 'reports/betterboard-migration-summary.json'
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!['--source', '--output', '--public', '--report'].includes(argument)) {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value) throw new Error(`${argument} requires a value`);
    options[argument.slice(2)] = value;
    index += 1;
  }

  return options;
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeMdxAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function articleHtml(source) {
  const match = source.match(
    /<main\b[^>]*class="[^"]*\bdocs-content\b[^"]*"[^>]*>[\s\S]*?<\/main>/i
  );
  if (!match) {
    throw new Error('Missing <main class="docs-content"> article');
  }
  return match[0];
}

function seoDescription(source) {
  const seoHead = source.match(/<SeoHead\b[\s\S]*?\/>/i)?.[0];
  const description = seoHead?.match(/\bdescription="([^"]+)"/i)?.[1];
  if (!description) {
    throw new Error('Missing SeoHead description');
  }
  return normalizeWhitespace(description);
}

function destinationForDocsHref(href) {
  const parsed = href.match(/^\/docs\/([^/#?]+)\/?([^#?]*)?(\?[^#]*)?(#.*)?$/);
  if (!parsed) return href;
  const sourceSlug = parsed[1];
  const doc = docsBySourceSlug.get(sourceSlug);
  if (!doc) {
    throw new Error(`Unknown BetterBoard documentation link "${href}"`);
  }
  const suffix = parsed[2] ? `${parsed[2].replace(/^\/+/, '')}` : '';
  if (suffix) {
    throw new Error(`Unexpected nested BetterBoard documentation link "${href}"`);
  }
  return `/betterboard/${doc.destinationSlug}/${parsed[3] ?? ''}${parsed[4] ?? ''}`;
}

function mediaAssetForSource(src) {
  if (!src.startsWith('/images/docs/')) return null;
  const relativePath = decodeURIComponent(src.slice('/images/docs/'.length));
  const normalized = path.posix.normalize(relativePath);
  if (
    !normalized ||
    normalized === '..' ||
    normalized.startsWith('../') ||
    path.posix.isAbsolute(normalized)
  ) {
    throw new Error(`Unsafe BetterBoard media path "${src}"`);
  }
  return {
    sourcePath: `public/images/docs/${normalized}`,
    destinationPath: `public/media/betterboard/${normalized}`,
    publicPath: `/media/betterboard/${normalized}`
  };
}

function createTurndown({ tokens, assets }) {
  const service = new TurndownService({
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    headingStyle: 'atx',
    strongDelimiter: '**'
  });

  service.addRule('betterboard-token', {
    filter: (node) => node.hasAttribute('data-betterboard-token'),
    replacement: (_content, node) => {
      const token = node.getAttribute('data-betterboard-token');
      return `\n\n${tokens.get(token) ?? ''}\n\n`;
    }
  });

  service.addRule('rewritten-links', {
    filter: (node) => node.nodeName === 'A' && node.hasAttribute('href'),
    replacement: (content, node) => {
      const originalHref = node.getAttribute('href') ?? '';
      const href = originalHref.startsWith('/docs/')
        ? destinationForDocsHref(originalHref)
        : originalHref === '/docs/' || originalHref === '/docs'
          ? '/betterboard/'
          : originalHref === '{LINKS.marketplace}'
            ? marketplaceUrl
            : originalHref;
      const title = node.getAttribute('title');
      const titleSuffix = title ? ` "${title.replaceAll('"', '\\"')}"` : '';
      return `[${content.trim()}](${href}${titleSuffix})`;
    }
  });

  service.addRule('fenced-code', {
    filter: (node) => (
      node.nodeName === 'PRE' &&
      node.firstElementChild?.nodeName === 'CODE'
    ),
    replacement: (_content, node) => {
      const code = node.firstElementChild;
      const language =
        code?.getAttribute('class')?.match(/\blanguage-([^\s]+)/)?.[1] ?? '';
      const value = code?.textContent.replace(/\n$/, '') ?? '';
      return `\n\n\`\`\`${language}\n${value}\n\`\`\`\n\n`;
    }
  });

  service.addRule('betterboard-images', {
    filter: (node) => (
      node.nodeName === 'IMG' &&
      (node.getAttribute('src') ?? '').startsWith('/images/docs/')
    ),
    replacement: (_content, node) => {
      const source = node.getAttribute('src') ?? '';
      const asset = mediaAssetForSource(source);
      if (!asset) return '';
      assets.set(asset.destinationPath, asset);
      const alt = node.getAttribute('alt') ?? '';
      return `![${alt}](${asset.publicPath})`;
    }
  });

  service.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td']);
  return service;
}

function replaceWithToken($, element, tokens, value) {
  const id = `betterboard-token-${tokens.size + 1}`;
  tokens.set(id, value);
  $(element).replaceWith(
    `<div data-betterboard-token="${id}">${id}</div>`
  );
}

function insertTokenBefore($, element, tokens, value) {
  const id = `betterboard-token-${tokens.size + 1}`;
  tokens.set(id, value);
  $(element).before(
    `<div data-betterboard-token="${id}">${id}</div>`
  );
}

function generatedHeadingId(value) {
  return normalizeWhitespace(value)
    .normalize('NFKC')
    .toLocaleLowerCase('en')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

function cleanArticleDom($, service, tokens, assets) {
  const $main = $('main.docs-content').first();
  $main.children('h1').first().remove();

  $main.find('svg, source').remove();
  $main.find('picture').each((_index, element) => {
    $(element).replaceWith($(element).find('img').first());
  });

  $main.find('h2[id], h3[id]').each((_index, element) => {
    const sourceId = $(element).attr('id') ?? '';
    if (sourceId && sourceId !== generatedHeadingId($(element).text())) {
      insertTokenBefore(
        $,
        element,
        tokens,
        `<a id="${escapeMdxAttribute(sourceId)}"></a>`
      );
    }
  });

  $main.find('.effect-text').each((_index, element) => {
    const parts = $(element)
      .children()
      .toArray()
      .map((child) => normalizeWhitespace($(child).text()))
      .filter(Boolean);
    if (parts.length > 1) {
      $(element).html(`<strong>${parts[0]}</strong> — ${parts.slice(1).join(' ')}`);
    }
  });

  $main.find('.docs-next-grid').each((_index, element) => {
    const items = $(element)
      .find('a[href]')
      .toArray()
      .map((anchor) => (
        `<li><a href="${$(anchor).attr('href')}">${normalizeWhitespace($(anchor).text())}</a></li>`
      ))
      .join('');
    $(element).replaceWith(`<ul>${items}</ul>`);
  });

  $main.find('figure').each((_index, element) => {
    const image = $(element).find('img').first();
    const src = image.attr('src') ?? '';
    const asset = mediaAssetForSource(src);
    if (!asset) {
      throw new Error(`Unsupported BetterBoard figure source "${src}"`);
    }
    assets.set(asset.destinationPath, asset);
    const alt = normalizeWhitespace(image.attr('alt') ?? '');
    if (!alt) throw new Error(`BetterBoard figure "${src}" requires alt text`);
    const caption = normalizeWhitespace($(element).find('figcaption').text());
    const width = Number.parseInt(image.attr('width') ?? '', 10);
    const height = Number.parseInt(image.attr('height') ?? '', 10);
    const component = [
      '<Figure',
      `  src="${escapeMdxAttribute(asset.publicPath)}"`,
      `  alt="${escapeMdxAttribute(alt)}"`,
      caption ? `  caption="${escapeMdxAttribute(caption)}"` : null,
      Number.isFinite(width) ? `  width={${width}}` : null,
      Number.isFinite(height) ? `  height={${height}}` : null,
      '/>'
    ].filter(Boolean).join('\n');
    replaceWithToken($, element, tokens, component);
  });

  $main.find('.callout').each((_index, element) => {
    const className = $(element).attr('class') ?? '';
    const type = className.includes('callout-warning')
      ? 'caution'
      : className.includes('callout-success')
        ? 'tip'
        : 'note';
    const body = $(element).find('.callout-body').first();
    const markdown = service.turndown(body.html() ?? '').trim();
    replaceWithToken(
      $,
      element,
      tokens,
      `<NeutralCallout type="${type}">\n\n${markdown}\n\n</NeutralCallout>`
    );
  });

  $main.find('*').each((_index, element) => {
    const allowed = new Set(
      $(element).attr('data-betterboard-token')
        ? ['data-betterboard-token']
        : element.tagName === 'a'
        ? ['href', 'title']
        : element.tagName === 'img'
          ? ['src', 'alt', 'width', 'height']
          : element.tagName === 'code'
            ? ['class']
            : []
    );
    for (const attribute of [...element.attributes]) {
      if (!allowed.has(attribute.name)) {
        $(element).removeAttr(attribute.name);
      }
    }
  });

  return $main.html() ?? '';
}

function frontmatterFor(doc, description) {
  return matter.stringify('', {
    title: doc.title,
    description,
    space: 'betterboard',
    sidebar: { order: doc.order }
  }).trimEnd();
}

export function convertBetterBoardPage(source, doc) {
  if (!doc) throw new Error('BetterBoard route mapping is required');
  const description = seoDescription(source);
  const $ = load(articleHtml(source), null, false);
  const tokens = new Map();
  const assets = new Map();
  const service = createTurndown({ tokens, assets });
  const internalLinkCount = $('main.docs-content a[href^="/docs/"]').length;
  const cleanedHtml = cleanArticleDom($, service, tokens, assets);
  let body = service.turndown(cleanedHtml).trim();
  body = body.replace(/\n{3,}/g, '\n\n');

  const imports = [];
  if (body.includes('<Figure')) {
    imports.push(
      "import Figure from '../../../../components/content/Figure.astro';"
    );
  }
  if (body.includes('<NeutralCallout')) {
    imports.push(
      "import NeutralCallout from '../../../../components/content/NeutralCallout.astro';"
    );
  }
  const importBlock = imports.length ? `\n\n${imports.join('\n')}` : '';
  const content = `${frontmatterFor(doc, description)}${importBlock}\n\n${body}\n`;

  return {
    content,
    assets: [...assets.values()].map(({ publicPath: _publicPath, ...asset }) => asset),
    imageCount: assets.size,
    internalLinkCount
  };
}

function landingContent() {
  const groups = [...sectionLabels].map(([section, label]) => {
    const links = betterBoardDocs
      .filter((doc) => doc.section === section)
      .map((doc) => (
        `<LinkRow\n  href="/betterboard/${doc.destinationSlug}/"\n  title="${escapeMdxAttribute(doc.title)}"\n  description="${escapeMdxAttribute(landingDescriptions.get(doc.sourceSlug) ?? '')}"\n/>`
      ))
      .join('\n\n');
    return `## ${label}\n\n${links}`;
  });

  return `---
title: BetterBoard documentation
description: Build and shape clearer Jira boards.
space: betterboard
sidebar:
  order: 1
---

import LinkRow from '../../../components/content/LinkRow.astro';

Set up one Jira board across spaces, shape it around your fields, and keep
day-to-day board work fast.

${groups.join('\n\n')}
`;
}

function writeFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function copyAssets(sourceRoot, publicRoot, assets) {
  for (const asset of assets.values()) {
    const sourcePath = path.join(sourceRoot, asset.sourcePath);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing BetterBoard media "${asset.sourcePath}"`);
    }
    const relativeDestination = asset.destinationPath.replace(/^public\//, '');
    const destinationPath = path.join(publicRoot, relativeDestination);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function runMigration(options) {
  assertUniqueDocMappings(betterBoardDocs);
  const sourceRoot = path.resolve(options.source);
  const outputRoot = path.resolve(options.output);
  const publicRoot = path.resolve(options.public);
  const reportPath = path.resolve(options.report);
  const sourceDocsRoot = path.join(sourceRoot, 'src', 'pages', 'docs');
  const sourceLanding = path.join(sourceDocsRoot, 'index.astro');
  if (!fs.existsSync(sourceLanding)) {
    throw new Error('Missing BetterBoard source page "src/pages/docs/index.astro"');
  }

  const sourcePages = betterBoardDocs.map((doc) => {
    const sourcePath = path.join(sourceDocsRoot, doc.sourceSlug, 'index.astro');
    if (!fs.existsSync(sourcePath)) {
      throw new Error(
        `Missing BetterBoard source page "src/pages/docs/${doc.sourceSlug}/index.astro"`
      );
    }
    return { doc, sourcePath };
  });

  const allAssets = new Map();
  const articles = sourcePages.map(({ doc, sourcePath }) => {
    const result = convertBetterBoardPage(fs.readFileSync(sourcePath, 'utf8'), doc);
    for (const asset of result.assets) {
      const complete = {
        ...asset,
        publicPath: `/${asset.destinationPath.replace(/^public\//, '')}`
      };
      allAssets.set(asset.destinationPath, complete);
    }
    writeFile(
      path.join(outputRoot, `${doc.destinationSlug}.mdx`),
      result.content
    );
    return {
      sourceSlug: doc.sourceSlug,
      sourcePath: `src/pages/docs/${doc.sourceSlug}/index.astro`,
      destinationRoute: `/betterboard/${doc.destinationSlug}/`,
      title: doc.title,
      imageCount: result.imageCount,
      internalLinkCount: result.internalLinkCount,
      reviewStatus: 'migrated'
    };
  });

  writeFile(path.join(outputRoot, 'index.mdx'), landingContent());
  copyAssets(sourceRoot, publicRoot, allAssets);
  writeFile(
    reportPath,
    `${JSON.stringify({
      sourceRoot,
      sourcePages: betterBoardDocs.length + 1,
      generatedPages: betterBoardDocs.length + 1,
      articles
    }, null, 2)}\n`
  );
  console.log(
    `Migrated ${betterBoardDocs.length} BetterBoard articles and copied ${allAssets.size} media file(s).`
  );
}

function main() {
  runMigration(parseArguments(process.argv.slice(2)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
