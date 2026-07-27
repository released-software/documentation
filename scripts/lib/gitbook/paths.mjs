import path from 'node:path';

function normalizeSourcePath(sourcePath) {
  if (typeof sourcePath !== 'string' || sourcePath.length === 0) {
    throw new Error('GitBook path must be a non-empty string');
  }

  const normalized = path.posix.normalize(sourcePath.replaceAll('\\', '/'));
  if (
    path.posix.isAbsolute(normalized) ||
    normalized === '..' ||
    normalized.startsWith('../')
  ) {
    throw new Error('GitBook path escapes the source root');
  }
  return normalized.replace(/^\.\//, '');
}

function encodeRoutePath(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}

export function mapGitBookPath(sourcePath, options = {}) {
  const normalized = normalizeSourcePath(sourcePath);
  const outputRoot = options.outputRoot ?? 'src/content/docs/guide';
  const routeRoot = options.routeRoot ?? '/guide';

  if (normalized === 'README.md' || normalized.endsWith('/README.md')) {
    const directory = normalized === 'README.md'
      ? ''
      : normalized.slice(0, -'/README.md'.length);
    const routeSuffix = directory ? `${directory}/` : '';
    return {
      outputPath: path.posix.join(outputRoot, routeSuffix, 'index.mdx'),
      route: `${routeRoot}/${encodeRoutePath(routeSuffix)}`
    };
  }

  if (normalized.endsWith('.md')) {
    const slug = normalized.slice(0, -'.md'.length);
    return {
      outputPath: path.posix.join(outputRoot, `${slug}.mdx`),
      route: `${routeRoot}/${encodeRoutePath(slug)}/`
    };
  }

  throw new Error(`Unsupported GitBook path: ${sourcePath}`);
}

export function mapGitBookLink(target, sourcePath, options = {}) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) return target;

  const hashIndex = target.indexOf('#');
  const encodedPath = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : target.slice(hashIndex);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(encodedPath);
  } catch {
    throw new Error(`Invalid URL encoding in local link: ${target}`);
  }

  const sourceDirectory = path.posix.dirname(normalizeSourcePath(sourcePath));
  let resolved = path.posix.normalize(path.posix.join(sourceDirectory, decodedPath));
  if (decodedPath.endsWith('/') || resolved === '.') {
    resolved = path.posix.join(resolved, 'README.md');
  }
  const mapped = mapGitBookPath(resolved, options);
  return `${mapped.route}${fragment}`;
}
