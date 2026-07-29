import { mapGitBookPath } from './paths.mjs';

export function parseSummary(markdown, options = {}) {
  const entries = [];

  for (const [lineIndex, line] of markdown.split(/\r?\n/).entries()) {
    const match = line.match(/^\s*[-*+]\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) continue;

    const [, label, target] = match;
    if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(target)) continue;

    const [encodedPath, fragment] = target.split('#', 2);
    let sourcePath;
    try {
      sourcePath = decodeURIComponent(encodedPath);
    } catch {
      throw new Error(`SUMMARY:${lineIndex + 1} GitBook path is not valid URL encoding`);
    }

    let mapped;
    try {
      mapped = mapGitBookPath(sourcePath, options);
    } catch (error) {
      throw new Error(`SUMMARY:${lineIndex + 1} ${error.message}`);
    }
    entries.push({
      sourcePath,
      outputPath: mapped.outputPath,
      route: fragment ? `${mapped.route}#${fragment}` : mapped.route,
      label,
      order: entries.length + 1
    });
  }

  return entries;
}
