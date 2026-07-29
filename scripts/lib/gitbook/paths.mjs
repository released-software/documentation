import path from 'node:path';

const legacyLinkOverrides = new Map([
  [
    'getting-started/setup-guide/widget/README.md\0../../../product-tour/settings/widget.md',
    '/guide/product-tour/settings/widget-configuration/'
  ],
  [
    'getting-started/setup-guide/widget/using-released-with-framer.md\0../../../product-tour/settings/announcement-page.md',
    '/guide/product/portals/portal/announcement-page/'
  ],
  [
    'product/administration/trusted-domains.md\0../portals/access.md#internal',
    '/guide/product/portals/access/#unlock-internal'
  ],
  [
    'product/changelog/editor/images.md\0./#slash-command',
    '/guide/product/changelog/editor/#overview'
  ],
  [
    'product/integrations/framer.md\0framer.md#adding-the-embed-code',
    '/guide/product/integrations/framer/#1-adding-the-embed-code'
  ],
  [
    'product/integrations/webflow.md\0../portals/portal/announcement-page.md#installation',
    '/guide/product/portals/portal/announcement-page/#configuration'
  ],
  [
    'product/portals/portal/README.md\0../access.md#portal',
    '/guide/product/portals/access/#portal-access'
  ],
  [
    'product/portals/portal/widget.md\0widget.md#attributes',
    '/guide/product/portals/portal/widget/#data-attributes'
  ],
  [
    'resources/ai-tips/international-accents.md\0../../product/changelog/settings/artificial-intelligence.md#overview',
    '/guide/product/changelog/settings/artificial-intelligence/#configuring-your-ai-settings'
  ],
  [
    'resources/troubleshooting/dark-mode-issues.md\0../../workspace/settings/design/announcement-page.md',
    '/guide/product/portals/portal/announcement-page/'
  ],
  [
    'resources/troubleshooting/dark-mode-issues.md\0../../workspace/settings/design/widget.md',
    '/guide/product/portals/portal/widget/'
  ],
  [
    'resources/troubleshooting/dark-mode-issues.md\0../../workspace/settings/design/portal.md',
    '/guide/product/portals/portal/'
  ]
]);

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
  const normalizedSourcePath = normalizeSourcePath(sourcePath);
  const override = legacyLinkOverrides.get(`${normalizedSourcePath}\0${target}`);
  if (override) return override;

  if (/^[a-z][a-z\d+.-]*:/i.test(target)) {
    const url = new URL(target);
    if (
      url.origin === 'https://docs.released.so' &&
      /^\/(?:guide|betterboard)(?:\/|$)/.test(url.pathname)
    ) {
      const pathname = url.pathname.endsWith('/')
        ? url.pathname
        : `${url.pathname}/`;
      return `${pathname}${url.search}${url.hash}`;
    }
    return target;
  }
  if (/^(?:\/\/|#)/.test(target)) return target;

  const hashIndex = target.indexOf('#');
  const encodedPath = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : target.slice(hashIndex);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(encodedPath);
  } catch {
    throw new Error(`Invalid URL encoding in local link: ${target}`);
  }

  const sourceDirectory = path.posix.dirname(normalizedSourcePath);
  let resolved = path.posix.normalize(path.posix.join(sourceDirectory, decodedPath));
  if (decodedPath.endsWith('/') || resolved === '.') {
    resolved = path.posix.join(resolved, 'README.md');
  }
  const mapped = mapGitBookPath(resolved, options);
  return `${mapped.route}${fragment}`;
}
