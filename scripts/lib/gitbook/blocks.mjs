import path from 'node:path';

import matter from 'gray-matter';

import { isFenceClosing, matchFenceOpening } from './fences.mjs';
import { convertFrontmatter } from './frontmatter.mjs';
import { normalizeMarkdownHeadingHierarchy } from './headings.mjs';
import { convertHtml } from './html.mjs';
import { mapGitBookLink } from './paths.mjs';

function protectedRanges(source) {
  const ranges = [];
  const lines = source.matchAll(/.*(?:\r?\n|$)/g);
  let fence = null;

  for (const match of lines) {
    if (!match[0]) continue;
    const line = match[0].replace(/\r?\n$/, '');
    if (fence) {
      if (isFenceClosing(line, fence)) {
        ranges.push([fence.start, match.index + match[0].length]);
        fence = null;
      }
      continue;
    }

    const opening = matchFenceOpening(line);
    if (opening) {
      fence = { ...opening, start: match.index };
      continue;
    }

    let cursor = 0;
    while (cursor < line.length) {
      const opening = line.slice(cursor).match(/`+/);
      if (!opening) break;
      const start = cursor + opening.index;
      const ticks = opening[0];
      const end = line.indexOf(ticks, start + ticks.length);
      if (end === -1) break;
      ranges.push([
        match.index + start,
        match.index + end + ticks.length
      ]);
      cursor = end + ticks.length;
    }
  }

  if (fence) ranges.push([fence.start, source.length]);
  return ranges;
}

function scanTags(source) {
  const protectedSpans = protectedRanges(source);
  const tokens = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('{%', cursor);
    if (start === -1) break;
    const protectedSpan = protectedSpans.find(
      ([rangeStart, rangeEnd]) => start >= rangeStart && start < rangeEnd
    );
    if (protectedSpan) {
      cursor = protectedSpan[1];
      continue;
    }

    const endMarker = source.indexOf('%}', start + 2);
    if (endMarker === -1) {
      const line = source.slice(0, start).split(/\r?\n/).length;
      throw new Error(`Unterminated GitBook construct at line ${line}`);
    }
    const raw = source.slice(start, endMarker + 2);
    const expression = raw.slice(2, -2).trim();
    const name = expression.split(/\s+/, 1)[0];
    tokens.push({
      start,
      end: endMarker + 2,
      raw,
      expression,
      name,
      line: source.slice(0, start).split(/\r?\n/).length
    });
    cursor = endMarker + 2;
  }

  return tokens;
}

function attribute(expression, name) {
  const match = expression.match(
    new RegExp(`(?:^|\\s)${name}=(?:"([^"]*)"|'([^']*)')`)
  );
  return match?.[1] ?? match?.[2];
}

function localImport(outputPath, componentName) {
  const target = `src/components/content/${componentName}.astro`;
  let relativePath = path.posix.relative(path.posix.dirname(outputPath), target);
  if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;
  return relativePath;
}

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function convertTags(body, context, lineOffset) {
  const tokens = scanTags(body);
  const replacements = [];
  const stack = [];
  const warnings = [];
  let usesNeutralCallout = false;
  let usesSteps = false;
  let usesTabs = false;
  let usesLinkRow = false;
  let usesResponsiveEmbed = false;

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
    const token = tokens[tokenIndex];
    if (token.name === 'code') {
      stack.push({ name: 'code', token });
      replacements.push({ start: token.start, end: token.end, value: '' });
      continue;
    }

    if (token.name === 'stepper') {
      stack.push({ name: 'stepper', token });
      usesSteps = true;
      replacements.push({
        start: token.start,
        end: token.end,
        value: '<Steps>\n<ol>'
      });
      continue;
    }

    if (token.name === 'endstepper') {
      const opening = stack.pop();
      if (opening?.name !== 'stepper') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unexpected GitBook construct "${token.name}"`
        );
      }
      replacements.push({
        start: token.start,
        end: token.end,
        value: '</ol>\n</Steps>'
      });
      continue;
    }

    if (token.name === 'step') {
      if (stack.at(-1)?.name !== 'stepper') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} GitBook "step" must be inside "stepper"`
        );
      }
      stack.push({ name: 'step', token });
      replacements.push({ start: token.start, end: token.end, value: '<li>' });
      continue;
    }

    if (token.name === 'tabs') {
      stack.push({ name: 'tabs', token });
      usesTabs = true;
      replacements.push({ start: token.start, end: token.end, value: '<Tabs>' });
      continue;
    }

    if (token.name === 'endtabs') {
      const opening = stack.pop();
      if (opening?.name !== 'tabs') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unexpected GitBook construct "${token.name}"`
        );
      }
      replacements.push({ start: token.start, end: token.end, value: '</Tabs>' });
      continue;
    }

    if (token.name === 'tab') {
      if (stack.at(-1)?.name !== 'tabs') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} GitBook "tab" must be inside "tabs"`
        );
      }
      const title = attribute(token.expression, 'title');
      if (!title) {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} GitBook "tab" requires a title`
        );
      }
      stack.push({ name: 'tab', token });
      replacements.push({
        start: token.start,
        end: token.end,
        value: `<TabItem label="${escapeAttribute(title)}">`
      });
      continue;
    }

    if (token.name === 'content-ref') {
      const closing = tokens[tokenIndex + 1];
      if (closing?.name !== 'endcontent-ref') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unclosed GitBook construct "content-ref"`
        );
      }
      const target = attribute(token.expression, 'url');
      if (!target) {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} GitBook "content-ref" requires a URL`
        );
      }
      const child = body.slice(token.end, closing.start);
      const link = child.match(/\[([^\]]+)\]\([^)]+\)/);
      const title = link?.[1] ?? target;
      const description = link
        ? child
            .replace(link[0], '')
            .replace(/\s+/g, ' ')
            .trim()
        : '';
      const href = mapGitBookLink(target, context.sourcePath);
      usesLinkRow = true;
      const descriptionProp = description
        ? ` description="${escapeAttribute(description)}"`
        : '';
      replacements.push({
        start: token.start,
        end: closing.end,
        value: `<LinkRow href="${escapeAttribute(href)}" title="${escapeAttribute(title)}"${descriptionProp} />`
      });
      tokenIndex += 1;
      continue;
    }

    if (token.name === 'embed') {
      const target = attribute(token.expression, 'url');
      if (!target) {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} GitBook "embed" requires a URL`
        );
      }
      let parsedUrl;
      try {
        parsedUrl = new URL(target);
      } catch {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} GitBook "embed" has an invalid URL`
        );
      }
      const provider = parsedUrl.hostname === 'youtu.be' ||
        parsedUrl.hostname.endsWith('.youtube.com')
        ? 'youtube'
        : parsedUrl.hostname === 'loom.com' ||
            parsedUrl.hostname.endsWith('.loom.com')
          ? 'loom'
          : null;
      const closing = tokens[tokenIndex + 1]?.name === 'endembed'
        ? tokens[tokenIndex + 1]
        : null;
      if (!provider) {
        const title = closing
          ? body.slice(token.end, closing.start).replace(/\s+/g, ' ').trim() ||
            parsedUrl.hostname
          : parsedUrl.hostname;
        warnings.push({
          file: context.sourcePath,
          line: token.line + lineOffset,
          construct: 'embed'
        });
        usesLinkRow = true;
        replacements.push({
          start: token.start,
          end: closing?.end ?? token.end,
          value: `<LinkRow href="${escapeAttribute(target)}" title="${escapeAttribute(title)}" />`
        });
        if (closing) tokenIndex += 1;
        continue;
      }

      const title = closing
        ? body.slice(token.end, closing.start).trim() || `${provider === 'loom' ? 'Loom' : 'YouTube'} video`
        : `${provider === 'loom' ? 'Loom' : 'YouTube'} video`;
      usesResponsiveEmbed = true;
      replacements.push({
        start: token.start,
        end: closing?.end ?? token.end,
        value: `<ResponsiveEmbed src="${escapeAttribute(target)}" title="${escapeAttribute(title)}" provider="${provider}" />`
      });
      if (closing) tokenIndex += 1;
      continue;
    }

    if (token.name === 'endtab') {
      const opening = stack.pop();
      if (opening?.name !== 'tab') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unexpected GitBook construct "${token.name}"`
        );
      }
      replacements.push({ start: token.start, end: token.end, value: '</TabItem>' });
      continue;
    }

    if (token.name === 'endstep') {
      const opening = stack.pop();
      if (opening?.name !== 'step') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unexpected GitBook construct "${token.name}"`
        );
      }
      replacements.push({ start: token.start, end: token.end, value: '</li>' });
      continue;
    }

    if (token.name === 'endcode') {
      const opening = stack.pop();
      if (opening?.name !== 'code') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unexpected GitBook construct "${token.name}"`
        );
      }
      replacements.push({ start: token.start, end: token.end, value: '' });
      continue;
    }

    if (token.name === 'hint') {
      stack.push({ name: 'hint', token });
      const type = {
        info: 'note',
        success: 'tip',
        warning: 'caution',
        danger: 'danger'
      }[attribute(token.expression, 'style') ?? 'info'];
      usesNeutralCallout = true;
      replacements.push({
        start: token.start,
        end: token.end,
        value: `<NeutralCallout type="${type}">`
      });
      continue;
    }

    if (token.name === 'endhint') {
      const opening = stack.pop();
      if (opening?.name !== 'hint') {
        throw new Error(
          `${context.sourcePath}:${token.line + lineOffset} Unexpected GitBook construct "${token.name}"`
        );
      }
      replacements.push({
        start: token.start,
        end: token.end,
        value: '</NeutralCallout>'
      });
      continue;
    }

    throw new Error(
      `${context.sourcePath}:${token.line + lineOffset} Unsupported GitBook construct "${token.name}"`
    );
  }

  if (stack.length) {
    const opening = stack.at(-1);
    throw new Error(
      `${context.sourcePath}:${opening.token.line + lineOffset} Unclosed GitBook construct "${opening.name}"`
    );
  }

  let converted = body;
  for (const replacement of replacements.reverse()) {
    converted =
      converted.slice(0, replacement.start) +
      replacement.value +
      converted.slice(replacement.end);
  }

  const imports = [];
  if (usesTabs) {
    imports.push(
      `import { Tabs, TabItem } from '@astrojs/starlight/components';`
    );
  }
  if (usesLinkRow) {
    imports.push(
      `import LinkRow from '${localImport(context.outputPath, 'LinkRow')}';`
    );
  }
  if (usesResponsiveEmbed) {
    imports.push(
      `import ResponsiveEmbed from '${localImport(context.outputPath, 'ResponsiveEmbed')}';`
    );
  }
  if (usesSteps) {
    imports.push(`import { Steps } from '@astrojs/starlight/components';`);
  }
  if (usesNeutralCallout) {
    imports.push(
      `import NeutralCallout from '${localImport(context.outputPath, 'NeutralCallout')}';`
    );
  }
  return {
    body: imports.length ? `${imports.join('\n')}\n\n${converted}` : converted,
    warnings
  };
}

export function convertGitBookPage(source, context = {}) {
  const converted = convertFrontmatter(source, context);
  const blocks = convertTags(
    converted.body,
    context,
    converted.bodyLineOffset
  );
  const html = convertHtml(blocks.body, context);
  const body = normalizeMarkdownHeadingHierarchy(html.body);
  return {
    content: matter.stringify(body, converted.data),
    assetCopies: html.assetCopies,
    warnings: blocks.warnings
  };
}
