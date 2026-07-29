import matter from 'gray-matter';

function stripMarkdownInline(value) {
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

function deriveTitle(body) {
  const heading = body.match(/^#\s+(.+)$/m);
  return heading ? stripMarkdownInline(heading[1]) : undefined;
}

function deriveDescription(body) {
  const paragraphs = body.split(/\r?\n\s*\r?\n/);
  for (const paragraph of paragraphs) {
    const candidate = paragraph
      .split(/\r?\n/)
      .filter((line) => !/^\s*\{%[\s\S]*%\}\s*$/.test(line))
      .join('\n')
      .trim();
    if (
      !candidate ||
      /^(?:#|<!--|<|\{%|```|~~~|[-*+]\s|\d+\.\s)/.test(candidate)
    ) {
      continue;
    }
    const plainText = stripMarkdownInline(candidate.replace(/\r?\n/g, ' '));
    if (plainText) return plainText;
  }
  return undefined;
}

function stripLeadingDocumentHeading(body) {
  const heading = body.match(
    /^(?:[ \t]*\r?\n)*[ \t]*#(?!#)\s+[^\r\n]*(?:\r?\n)?(?:[ \t]*\r?\n)?/
  );
  if (!heading) {
    return { body, removedLineCount: 0 };
  }
  return {
    body: body.slice(heading[0].length),
    removedLineCount: (heading[0].match(/\r?\n/g) ?? []).length
  };
}

export function convertFrontmatter(source, context = {}) {
  const parsed = matter(source);
  const frontmatterMatch = source.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  const title = parsed.data.title ?? deriveTitle(parsed.content);
  const stripped = stripLeadingDocumentHeading(parsed.content);
  const data = {
    ...parsed.data,
    title,
    description: parsed.data.description ?? deriveDescription(parsed.content) ?? title,
    space: 'hub',
    sidebar: {
      ...(parsed.data.sidebar ?? {}),
      order: context.order ?? parsed.data.sidebar?.order ?? 1
    }
  };

  return {
    body: stripped.body,
    bodyLineOffset: frontmatterMatch
      ? frontmatterMatch[0].split(/\r?\n/).length - 1 + stripped.removedLineCount
      : stripped.removedLineCount,
    data,
    content: matter.stringify(stripped.body, data)
  };
}
