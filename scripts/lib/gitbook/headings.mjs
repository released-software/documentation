import {
  isFenceClosing,
  matchFenceOpening
} from './fences.mjs';

function mapLinesOutsideFences(source, transform) {
  const lines = source.match(/.*(?:\r?\n|$)/g) ?? [];
  let fence = null;

  return lines.map((fullLine, lineIndex) => {
    if (!fullLine) return fullLine;
    const line = fullLine.replace(/\r?\n$/, '');
    const lineEnding = fullLine.slice(line.length);

    if (fence) {
      if (isFenceClosing(line, fence)) fence = null;
      return fullLine;
    }

    const opening = matchFenceOpening(line);
    if (opening) {
      fence = opening;
      return fullLine;
    }

    return `${transform(line, lineIndex + 1)}${lineEnding}`;
  }).join('');
}

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function plainTextTitle(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]+/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x20;|&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function calloutTitleLine(line) {
  const heading = line.match(/^\s{0,3}#{1,6}[ \t]+(.+?)\s*$/);
  if (heading) {
    return {
      title: plainTextTitle(
        heading[1].replace(/\s*<a\b[^>]*>\s*<\/a>\s*$/, '')
      ),
      remainder: ''
    };
  }

  const bold = line.match(/^\s*\*\*(.+?)\*\*(.*)$/);
  if (bold) {
    return {
      title: plainTextTitle(bold[1]),
      remainder: bold[2].trim().replace(/^\\$/, '')
    };
  }

  const strong = line.match(/^\s*<strong>([\s\S]+?)<\/strong>(.*)$/i);
  if (strong) {
    return {
      title: plainTextTitle(strong[1]),
      remainder: strong[2].trim().replace(/^\\$/, '')
    };
  }

  return null;
}

function promoteCalloutTitles(source) {
  return source.replace(
    /(<NeutralCallout\b[^>]*>)([\s\S]*?)(<\/NeutralCallout>)/g,
    (_, opening, body, closing) => {
      if (/\btitle=/.test(opening)) return `${opening}${body}${closing}`;

      const lines = body.match(/.*(?:\r?\n|$)/g) ?? [];
      const titleLineIndex = lines.findIndex((fullLine) =>
        fullLine.replace(/\r?\n$/, '').trim()
      );
      if (titleLineIndex === -1) return `${opening}${body}${closing}`;

      const fullLine = lines[titleLineIndex];
      const line = fullLine.replace(/\r?\n$/, '');
      const lineEnding = fullLine.slice(line.length);
      const promoted = calloutTitleLine(line);
      if (!promoted?.title) return `${opening}${body}${closing}`;

      lines[titleLineIndex] = promoted.remainder
        ? `${promoted.remainder}${lineEnding}`
        : '';
      const titledOpening = opening.replace(
        />$/,
        ` title="${escapeAttribute(promoted.title)}">`
      );
      return `${titledOpening}${lines.join('')}${closing}`;
    }
  );
}

export function normalizeMarkdownHeadingHierarchy(source) {
  const hierarchy = [{ originalLevel: 1, normalizedLevel: 1 }];
  const withoutCalloutHeadings = promoteCalloutTitles(source);

  return mapLinesOutsideFences(withoutCalloutHeadings, (line) => {
    const heading = line.match(/^(\s{0,3})(#{1,6})([ \t]+.*)$/);
    if (!heading) return line;

    const originalLevel = heading[2].length;
    while (hierarchy.at(-1)?.originalLevel >= originalLevel) {
      hierarchy.pop();
    }
    const normalizedLevel = Math.min(
      (hierarchy.at(-1)?.normalizedLevel ?? 1) + 1,
      6
    );
    hierarchy.push({ originalLevel, normalizedLevel });

    return `${heading[1]}${'#'.repeat(normalizedLevel)}${heading[3].trimEnd()}`;
  });
}

export function markdownHeadingHierarchyIssues(source, lineOffset = 0) {
  const issues = [];
  let previousLevel = 1;

  mapLinesOutsideFences(source, (line, lineNumber) => {
    const heading = line.match(/^\s{0,3}(#{1,6})[ \t]+/);
    if (!heading) return line;

    const level = heading[1].length;
    if (level === 1) {
      issues.push({
        line: lineNumber + lineOffset,
        message: 'Body H1 duplicates the page title'
      });
    } else if (level > previousLevel + 1) {
      issues.push({
        line: lineNumber + lineOffset,
        message: `Heading level jumps from H${previousLevel} to H${level}`
      });
    }
    previousLevel = level;
    return line;
  });

  return issues;
}
