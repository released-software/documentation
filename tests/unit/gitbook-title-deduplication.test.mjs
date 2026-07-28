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

test('normalizes skipped body heading levels while preserving fenced examples', () => {
  const trailingSpaces = '   ';
  const result = convertGitBookPage(
    `# Heading hierarchy

### First section${trailingSpaces}

### Sibling section

#### Nested section

## Later section

#### Skipped subsection

#### Sibling skipped subsection

\`\`\`md
### Example heading
\`\`\`
`,
    context
  );
  const parsed = matter(result.content);

  assert.match(parsed.content, /^## First section$/m);
  assert.match(parsed.content, /^## Sibling section$/m);
  assert.match(parsed.content, /^### Nested section$/m);
  assert.match(parsed.content, /^## Later section$/m);
  assert.match(parsed.content, /^### Skipped subsection$/m);
  assert.match(parsed.content, /^### Sibling skipped subsection$/m);
  assert.match(parsed.content, /^### Example heading$/m);
  assert.doesNotMatch(parsed.content, /^#### /m);
});

test('promotes callout headings to titles outside the document outline', () => {
  const result = convertGitBookPage(
    `# Callout labels

{% hint style="info" %}
#### See a demo

Callout copy.
{% endhint %}
`,
    context
  );
  const parsed = matter(result.content);

  assert.match(
    parsed.content,
    /<NeutralCallout type="note" title="See a demo">/
  );
  assert.doesNotMatch(parsed.content, /^\*\*See a demo\*\*$/m);
  assert.doesNotMatch(parsed.content, /^#{1,6} See a demo$/m);
});
