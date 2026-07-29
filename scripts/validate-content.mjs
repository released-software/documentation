#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import fg from 'fast-glob';
import matter from 'gray-matter';

import {
  isFenceClosing,
  matchFenceOpening
} from './lib/gitbook/fences.mjs';
import { markdownHeadingHierarchyIssues } from './lib/gitbook/headings.mjs';

const knownSpaces = new Set(['hub', 'betterboard', 'partners']);

function parseArguments(argv) {
  const options = {
    content: 'src/content/docs',
    public: 'public'
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument !== '--content' && argument !== '--public') {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value) throw new Error(`${argument} requires a value`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  return options;
}

function displayPath(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join('/');
}

function routeForFile(filePath, contentRoot) {
  const relative = path.relative(contentRoot, filePath).split(path.sep).join('/');
  const withoutExtension = relative.replace(/\.mdx?$/, '');
  const slug = withoutExtension === 'index'
    ? ''
    : withoutExtension.endsWith('/index')
      ? withoutExtension.slice(0, -'/index'.length)
      : withoutExtension;
  return `/${slug}${slug ? '/' : ''}`;
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function markdownTargets(line) {
  const targets = [];
  for (const match of line.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    targets.push({
      target: match[1].trim(),
      asset: match[0].startsWith('!')
    });
  }
  for (const match of line.matchAll(/\b(src|href)="([^"]+)"/g)) {
    targets.push({
      target: match[2],
      asset: match[1] === 'src'
    });
  }
  return targets;
}

function contentCandidates(resolved, targetPath) {
  if (/\.mdx?$/.test(targetPath)) return [resolved];
  if (targetPath.endsWith('/')) {
    return [path.join(resolved, 'index.md'), path.join(resolved, 'index.mdx')];
  }
  return [
    `${resolved}.md`,
    `${resolved}.mdx`,
    path.join(resolved, 'index.md'),
    path.join(resolved, 'index.mdx')
  ];
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const contentRoot = path.resolve(options.content);
  const publicRoot = path.resolve(options.public);
  const relativeFiles = fg.sync(['**/*.md', '**/*.mdx'], {
    cwd: contentRoot,
    onlyFiles: true,
    unique: true
  }).sort();
  const files = relativeFiles.map((filePath) => path.join(contentRoot, filePath));
  const fileSet = new Set(files.map((filePath) => path.normalize(filePath)));
  const failures = [];
  const addFailure = (filePath, line, message) => {
    failures.push(`${displayPath(filePath)}:${line} ${message}`);
  };

  const routes = new Map();
  for (const filePath of files) {
    const route = routeForFile(filePath, contentRoot);
    const routeFiles = routes.get(route) ?? [];
    routeFiles.push(filePath);
    routes.set(route, routeFiles);

    const source = fs.readFileSync(filePath, 'utf8');
    let parsed;
    try {
      parsed = matter(source);
    } catch (error) {
      addFailure(filePath, 1, `Invalid frontmatter: ${error.message}`);
      continue;
    }
    for (const field of ['title', 'description', 'space']) {
      if (typeof parsed.data[field] !== 'string' || !parsed.data[field].trim()) {
        addFailure(filePath, 1, `Missing required frontmatter "${field}"`);
      }
    }
    if (
      typeof parsed.data.space === 'string' &&
      parsed.data.space &&
      !knownSpaces.has(parsed.data.space)
    ) {
      const spaceLine = source.split(/\r?\n/)
        .findIndex((line) => /^\s*space\s*:/.test(line)) + 1;
      addFailure(
        filePath,
        spaceLine || 1,
        `Unknown space "${parsed.data.space}"`
      );
    }
    const frontmatterMatch = source.match(
      /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/
    );
    const headingLineOffset = frontmatterMatch
      ? (frontmatterMatch[0].match(/\r?\n/g) ?? []).length
      : 0;
    for (const issue of markdownHeadingHierarchyIssues(
      parsed.content,
      headingLineOffset
    )) {
      addFailure(filePath, issue.line, issue.message);
    }

    let fence = null;
    for (const [lineIndex, line] of source.split(/\r?\n/).entries()) {
      if (fence) {
        if (isFenceClosing(line, fence)) fence = null;
        continue;
      }
      const opening = matchFenceOpening(line);
      if (opening) {
        fence = opening;
        continue;
      }
      const withoutInlineCode = line.replace(/(`+).*?\1/g, '');
      if (withoutInlineCode.includes('{%') || withoutInlineCode.includes('%}')) {
        addFailure(filePath, lineIndex + 1, 'Remaining GitBook construct');
      }

      for (const { target, asset } of markdownTargets(withoutInlineCode)) {
        const targetPath = target.split('#', 1)[0].split('?', 1)[0];
        if (!targetPath || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) {
          continue;
        }
        if (asset) {
          const decodedTargetPath = decodeURIComponent(targetPath);
          const assetPath = targetPath.startsWith('/')
            ? path.resolve(publicRoot, `.${decodedTargetPath}`)
            : path.resolve(path.dirname(filePath), decodedTargetPath);
          const approvedRoot = targetPath.startsWith('/') ? publicRoot : contentRoot;
          if (!isWithin(approvedRoot, assetPath)) {
            addFailure(
              filePath,
              lineIndex + 1,
              `Unsafe traversal outside approved roots "${target}"`
            );
          } else if (!fs.existsSync(assetPath)) {
            addFailure(
              filePath,
              lineIndex + 1,
              `Missing local asset "${target}"`
            );
          }
          continue;
        }
        if (targetPath.startsWith('/')) continue;
        const resolved = path.resolve(
          path.dirname(filePath),
          decodeURIComponent(targetPath)
        );
        if (!isWithin(contentRoot, resolved)) {
          addFailure(
            filePath,
            lineIndex + 1,
            `Unsafe traversal outside approved roots "${target}"`
          );
          continue;
        }
        const candidates = contentCandidates(resolved, targetPath);
        if (!candidates.some((candidate) => fileSet.has(path.normalize(candidate)))) {
          addFailure(
            filePath,
            lineIndex + 1,
            `Relative content link cannot be resolved "${target}"`
          );
        }
      }
    }
  }

  for (const [route, routeFiles] of routes) {
    if (routeFiles.length > 1) {
      addFailure(routeFiles.sort()[0], 1, `Duplicate route "${route}"`);
    }
  }

  if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${files.length} content files.`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
