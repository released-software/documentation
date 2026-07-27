import assert from 'node:assert/strict';
import test from 'node:test';

import matter from 'gray-matter';

import { convertGitBookPage } from '../../scripts/lib/gitbook/blocks.mjs';

const context = {
  sourcePath: 'resources/troubleshooting/permissions.md',
  outputPath: 'src/content/docs/guide/resources/troubleshooting/permissions.mdx',
  order: 1
};

test('promotes the GitBook document heading to frontmatter without retaining a body H1', () => {
  const result = convertGitBookPage(
    `# Permissions Issues

## Overview

Permission guidance.
`,
    context
  );
  const parsed = matter(result.content);

  assert.equal(parsed.data.title, 'Permissions Issues');
  assert.doesNotMatch(parsed.content, /^#\s+/m);
  assert.match(parsed.content, /^## Overview$/m);
});
