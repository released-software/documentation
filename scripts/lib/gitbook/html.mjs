import path from 'node:path';

import * as cheerio from 'cheerio';

import { isFenceClosing, matchFenceOpening } from './fences.mjs';
import { mapGitBookLink } from './paths.mjs';

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function localImport(outputPath, componentName) {
  const target = `src/components/content/${componentName}.astro`;
  let relativePath = path.posix.relative(path.posix.dirname(outputPath), target);
  if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;
  return relativePath;
}

function transformOutsideFences(source, transform) {
  const lines = source.match(/.*(?:\r?\n|$)/g) ?? [];
  let fence = null;
  let plain = '';
  let result = '';

  const flush = () => {
    if (!plain) return;
    result += transform(plain);
    plain = '';
  };

  for (const fullLine of lines) {
    if (!fullLine) continue;
    const line = fullLine.replace(/\r?\n$/, '');
    if (!fence) {
      const opening = matchFenceOpening(line);
      if (!opening) {
        plain += fullLine;
        continue;
      }
      flush();
      fence = opening;
      result += fullLine;
      continue;
    }
    result += fullLine;
    if (isFenceClosing(line, fence)) fence = null;
  }
  flush();
  return result;
}

function transformOutsideInlineCode(source, transform) {
  let result = '';
  let cursor = 0;
  while (cursor < source.length) {
    const opening = source.slice(cursor).match(/`+/);
    if (!opening) {
      result += transform(source.slice(cursor));
      break;
    }
    const start = cursor + opening.index;
    result += transform(source.slice(cursor, start));
    const ticks = opening[0];
    const end = source.indexOf(ticks, start + ticks.length);
    if (end === -1) {
      result += source.slice(start);
      break;
    }
    result += source.slice(start, end + ticks.length);
    cursor = end + ticks.length;
  }
  return result;
}

function mapAsset(sourceUrl, sourcePath) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(sourceUrl)) {
    return { url: sourceUrl, copy: null };
  }
  const decodedUrl = decodeURIComponent(sourceUrl);
  const resolved = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourcePath), decodedUrl)
  );
  if (
    resolved === '..' ||
    resolved.startsWith('../') ||
    !resolved.startsWith('.gitbook/assets/')
  ) {
    throw new Error(
      `${sourcePath}:1 Unsafe or unsupported local asset path "${sourceUrl}"`
    );
  }
  const assetPath = resolved.slice('.gitbook/assets/'.length);
  const encodedAssetPath = assetPath.split('/').map(encodeURIComponent).join('/');
  return {
    url: `/media/hub/${encodedAssetPath}`,
    copy: {
      sourcePath: resolved,
      publicPath: `public/media/hub/${assetPath}`
    }
  };
}

function splitMarkdownDestination(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('<')) {
    const close = trimmed.indexOf('>');
    if (close !== -1) {
      return {
        destination: trimmed.slice(1, close),
        suffix: trimmed.slice(close + 1)
      };
    }
  }
  const withTitle = trimmed.match(
    /^(\S+)(\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))$/
  );
  return withTitle
    ? { destination: withTitle[1], suffix: withTitle[2] }
    : { destination: trimmed, suffix: '' };
}

export function convertHtml(source, context) {
  const assetCopies = [];
  let usesFigure = false;
  const body = transformOutsideFences(source, (plain) => {
    let converted = plain.replace(
      /<figure(?:\s[^>]*)?>[\s\S]*?<\/figure>/gi,
      (figureHtml) => {
      const $ = cheerio.load(figureHtml, null, false);
      const image = $('img').first();
      if (!image.length) return figureHtml;

      const mapped = mapAsset(image.attr('src') ?? '', context.sourcePath);
      if (mapped.copy) assetCopies.push(mapped.copy);
      const caption = $('figcaption').first().text().replace(/\s+/g, ' ').trim();
      const width = image.attr('width');
      const height = image.attr('height');
      const fallbackAlt = caption ||
        path.posix.basename(mapped.copy?.sourcePath ?? mapped.url)
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]+/g, ' ');
      const alt = image.attr('alt')?.trim() || fallbackAlt;
      const props = [
        `src="${escapeAttribute(mapped.url)}"`,
        `alt="${escapeAttribute(alt)}"`
      ];
      if (caption) props.push(`caption="${escapeAttribute(caption)}"`);
      if (width && /^\d+$/.test(width)) props.push(`width={${width}}`);
      if (height && /^\d+$/.test(height)) props.push(`height={${height}}`);
      usesFigure = true;
      return `<Figure ${props.join(' ')} />`;
      }
    );
    converted = converted.replace(/<img\b[^>]*>/gi, (imageHtml) => {
      const $ = cheerio.load(imageHtml, null, false);
      const image = $('img').first();
      const sourceUrl = image.attr('src') ?? '';
      const mapped = mapAsset(sourceUrl, context.sourcePath);
      if (mapped.copy) assetCopies.push(mapped.copy);
      const fallbackAlt = path.posix.basename(
        mapped.copy?.sourcePath ?? mapped.url
      )
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ');
      const attributes = image.attr() ?? {};
      const props = [
        `src="${escapeAttribute(mapped.url)}"`,
        `alt="${escapeAttribute(attributes.alt?.trim() || fallbackAlt)}"`
      ];
      for (const [name, value] of Object.entries(attributes)) {
        if (name === 'src' || name === 'alt') continue;
        props.push(`${name}="${escapeAttribute(value)}"`);
      }
      return `<img ${props.join(' ')} />`;
    });
    converted = converted.replace(/\bhref="([^"]+)"/gi, (fullMatch, target) => {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(target)) {
        if (!target.startsWith('https://docs.released.so/')) return fullMatch;
      }
      if (target.includes('.gitbook/assets/')) {
        const mapped = mapAsset(target, context.sourcePath);
        if (mapped.copy) assetCopies.push(mapped.copy);
        return `href="${escapeAttribute(mapped.url)}"`;
      }
      return `href="${escapeAttribute(mapGitBookLink(target, context.sourcePath))}"`;
    });
    converted = transformOutsideInlineCode(converted, (text) => {
      let rewritten = text.replaceAll('&#x20;', ' ');
      rewritten = rewritten.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (fullMatch, alt, sourceUrl) => {
          if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(sourceUrl.trim())) {
            return fullMatch;
          }
          const mapped = mapAsset(sourceUrl.trim(), context.sourcePath);
          if (!mapped.copy) return fullMatch;
          assetCopies.push(mapped.copy);
          return `![${alt}](${mapped.url})`;
        }
      );
      rewritten = rewritten.replace(
        /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
        (fullMatch, label, target) => {
          const { destination, suffix } = splitMarkdownDestination(target);
          if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(destination)) {
            if (!destination.startsWith('https://docs.released.so/')) {
              return fullMatch;
            }
          }
          return `[${label}](${mapGitBookLink(destination, context.sourcePath)}${suffix})`;
        }
      );
      return rewritten;
    });
    converted = converted.replace(
      /<pre(?:\s[^>]*)?>[\s\S]*?<\/pre>/gi,
      (preHtml) => {
        const $ = cheerio.load(preHtml, null, false);
        const code = $('code').first();
        const languageClass = `${code.attr('class') ?? ''} ${$('pre').attr('class') ?? ''}`;
        const language = languageClass.match(/(?:lang|language)-([a-z\d_-]+)/i)?.[1] ?? '';
        const codeText = code.text();
        const closingSeparator = codeText.endsWith('\n') ? '' : '\n';
        return `\n\`\`\`${language}\n${codeText}${closingSeparator}\`\`\`\n`;
      }
    );
    converted = converted.replace(
      /<table\b[\s\S]*?<\/table>/gi,
      (blockHtml) => {
        const structuralTag = '(?:table|thead|tbody|tfoot|tr|th|td)';
        return cheerio
          .load(blockHtml, null, false)
          .html()
          .replace(
            new RegExp(
              `(<\\/?${structuralTag}\\b[^>]*>)\\s+(?=<\\/?${structuralTag}\\b)`,
              'gi'
            ),
            '$1'
          );
      }
    );
    converted = converted.replace(/<br(\s[^>]*)?>/gi, (fullMatch, attributes = '') =>
      /\/\s*>$/.test(fullMatch) ? fullMatch : `<br${attributes} />`
    );
    return converted;
  });

  const deduplicatedCopies = [
    ...new Map(assetCopies.map((copy) => [copy.publicPath, copy])).values()
  ];
  return {
    body: usesFigure
      ? `import Figure from '${localImport(context.outputPath, 'Figure')}';\n\n${body}`
      : body,
    assetCopies: deduplicatedCopies
  };
}
