import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';

import { convertGitBookPage } from '../../scripts/lib/gitbook/blocks.mjs';
import { mapGitBookPath } from '../../scripts/lib/gitbook/paths.mjs';
import { parseSummary } from '../../scripts/lib/gitbook/summary.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, '..', '..');

function fixture(name) {
  return fs.readFileSync(
    path.join(testDirectory, '..', 'fixtures', 'gitbook', name),
    'utf8'
  );
}

function pageFixture(name) {
  return `---
title: Fixture page
description: Fixture description
---

${fixture(name)}`;
}

function fixtureContext(sourcePath, order = 1) {
  return {
    sourcePath,
    outputPath: mapGitBookPath(sourcePath).outputPath,
    order
  };
}

test('maps the root README to the Hub guide index', () => {
  assert.deepEqual(mapGitBookPath('README.md'), {
    outputPath: 'src/content/docs/guide/index.mdx',
    route: '/guide/'
  });
});

test('maps a nested README to a nested index', () => {
  assert.deepEqual(mapGitBookPath('getting-started/README.md'), {
    outputPath: 'src/content/docs/guide/getting-started/index.mdx',
    route: '/guide/getting-started/'
  });
});

test('maps an ordinary Markdown file to the same MDX slug', () => {
  assert.deepEqual(mapGitBookPath('product/changelog/writing-a-post.md'), {
    outputPath: 'src/content/docs/guide/product/changelog/writing-a-post.mdx',
    route: '/guide/product/changelog/writing-a-post/'
  });
});

test('parses local SUMMARY links in document order and ignores external links', () => {
  const entries = parseSummary(`
# Table of contents

* [Overview](README.md)
* [Setup](getting-started/setup-guide/README.md)
* [Support](https://released.so/support)
`);

  assert.deepEqual(entries, [
    {
      sourcePath: 'README.md',
      outputPath: 'src/content/docs/guide/index.mdx',
      route: '/guide/',
      label: 'Overview',
      order: 1
    },
    {
      sourcePath: 'getting-started/setup-guide/README.md',
      outputPath: 'src/content/docs/guide/getting-started/setup-guide/index.mdx',
      route: '/guide/getting-started/setup-guide/',
      label: 'Setup',
      order: 2
    }
  ]);
});

test('rejects SUMMARY paths that escape the source root after decoding', () => {
  assert.throws(
    () => parseSummary('* [Unsafe](%2E%2E/private.md)', { sourceRoot: '.' }),
    /SUMMARY:1 GitBook path escapes the source root/
  );
});

test('adds Hub metadata while preserving an existing title and description', () => {
  const source = `---
title: Existing page title
description: Existing page description
---

# Existing page title

Released remains unchanged in body copy.
`;
  const result = convertGitBookPage(source, {
    sourcePath: 'product/example.md',
    outputPath: 'src/content/docs/guide/product/example.mdx',
    order: 10
  });
  const parsed = matter(result.content);

  assert.deepEqual(parsed.data, {
    title: 'Existing page title',
    description: 'Existing page description',
    space: 'hub',
    sidebar: { order: 10 }
  });
  assert.match(parsed.content, /Released remains unchanged/);
});

test('derives missing title and description from page content', () => {
  const result = convertGitBookPage(
    `# Derived title

<!-- Source note -->

First meaningful paragraph with **formatting** and a [link](https://example.com).
`,
    {
      sourcePath: 'derived.md',
      outputPath: 'src/content/docs/guide/derived.mdx',
      order: 3
    }
  );

  assert.deepEqual(matter(result.content).data, {
    title: 'Derived title',
    description: 'First meaningful paragraph with formatting and a link.',
    space: 'hub',
    sidebar: { order: 3 }
  });
});

test('uses the page title when a heading-only page has no description paragraph', () => {
  const result = convertGitBookPage(
    '# Best Practices\n',
    fixtureContext('getting-started/best-practices/README.md')
  );

  assert.equal(matter(result.content).data.description, 'Best Practices');
});

test('does not leak GitBook closing tags into a derived description', () => {
  const result = convertGitBookPage(
    `# Feedback Beta

{% stepper %}
{% step %}
### Enable feedback

Open settings and enable feedback.
{% endstep %}
{% endstepper %}
`,
    fixtureContext('resources/how-tos/beta.md')
  );

  assert.equal(
    matter(result.content).data.description,
    'Open settings and enable feedback.'
  );
});

test('throws unsupported GitBook constructs with source path and line number', () => {
  assert.throws(
    () => convertGitBookPage(
      `---
title: Unsupported
description: Unsupported construct
---
Body

{% mystery value="x" %}
`,
      fixtureContext('product/unsupported.md')
    ),
    /product\/unsupported\.md:7 Unsupported GitBook construct "mystery"/
  );
});

test('converts a GitBook hint to a usage-based NeutralCallout import', () => {
  const result = convertGitBookPage(
    pageFixture('hint.md'),
    fixtureContext('resources/how-tos/beta.md')
  );

  assert.match(
    result.content,
    /import NeutralCallout from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/components\/content\/NeutralCallout\.astro';/
  );
  assert.match(result.content, /<NeutralCallout type="caution">/);
  assert.match(result.content, /Not seeing the feedback button/);
  assert.match(result.content, /<\/NeutralCallout>/);
  assert.doesNotMatch(result.content, /\{%/);
});

test('removes GitBook code wrappers while preserving fenced code byte-for-byte', () => {
  const fenced = `\`\`\`liquid
{% hint style="warning" %}
const value = \`unchanged\`;
{% endhint %}
\`\`\``;
  const source = `---
title: Code
description: Code fixture
---
{% code overflow="wrap" %}
${fenced}
{% endcode %}
`;
  const result = convertGitBookPage(
    source,
    fixtureContext('resources/code.md')
  );

  assert.match(result.content, new RegExp(fenced.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(result.content, /\{% code|\{% endcode/);
});

test('does not close fenced code on a fence-like line with trailing content', () => {
  const fenced = `\`\`\`text
before
\`\`\`not-a-close
{% mystery %}
<br>
\`\`\``;
  const result = convertGitBookPage(
    `---
title: Fence
description: Fence fixture
---
${fenced}
`,
    fixtureContext('resources/fence.md')
  );

  assert.match(
    result.content,
    new RegExp(fenced.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );
});

test('converts nested GitBook step blocks to Starlight Steps', () => {
  const result = convertGitBookPage(
    pageFixture('stepper.md'),
    fixtureContext('resources/how-tos/beta.md')
  );

  assert.match(
    result.content,
    /import \{ Steps \} from '@astrojs\/starlight\/components';/
  );
  assert.match(result.content, /<Steps>/);
  assert.equal((result.content.match(/<li>/g) ?? []).length, 2);
  assert.match(result.content, /<NeutralCallout type="note">/);
  assert.match(result.content, /<\/Steps>/);
  assert.doesNotMatch(result.content, /\{%/);
});

test('converts nested GitBook tab blocks to Starlight Tabs and TabItem', () => {
  const result = convertGitBookPage(
    pageFixture('tabs.md'),
    fixtureContext('product/feedback/settings.md')
  );

  assert.match(
    result.content,
    /import \{ Tabs, TabItem \} from '@astrojs\/starlight\/components';/
  );
  assert.match(result.content, /<Tabs>/);
  assert.match(result.content, /<TabItem label="Team-managed projects">/);
  assert.match(result.content, /<NeutralCallout type="caution">/);
  assert.match(result.content, /<\/TabItem>/);
  assert.match(result.content, /<\/Tabs>/);
  assert.doesNotMatch(result.content, /\{%/);
});

test('converts a GitBook content reference to a routed LinkRow', () => {
  const result = convertGitBookPage(
    pageFixture('content-ref.md'),
    fixtureContext('resources/troubleshooting/README.md')
  );

  assert.match(
    result.content,
    /import LinkRow from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/components\/content\/LinkRow\.astro';/
  );
  assert.match(
    result.content,
    /<LinkRow href="\/guide\/resources\/troubleshooting\/ensuring-jira-permissions\/" title="ensuring-jira-permissions\.md" \/>/
  );
  assert.doesNotMatch(result.content, /endcontent-ref|\{% content-ref/);
});

test('converts content reference copy to a LinkRow description', () => {
  const result = convertGitBookPage(
    `---
title: Related content
description: Related content fixture
---
{% content-ref url="../../../README.md" %}
[Hub documentation](../../../README.md)
Return to the Hub documentation overview.
{% endcontent-ref %}
`,
    fixtureContext('tests/fixtures/gitbook/all-components.md')
  );

  assert.match(
    result.content,
    /<LinkRow href="\/guide\/" title="Hub documentation" description="Return to the Hub documentation overview\." \/>/
  );
});

test('converts paired Loom and self-closing YouTube embeds', () => {
  const result = convertGitBookPage(
    pageFixture('embed.md'),
    fixtureContext('product/roadmaps-and-ideas/README.md')
  );

  assert.match(
    result.content,
    /import ResponsiveEmbed from '.+\/components\/content\/ResponsiveEmbed\.astro';/
  );
  assert.match(
    result.content,
    /<ResponsiveEmbed src="https:\/\/www\.loom\.com\/share\/e972f54ef3644aa78b822b2cbf573e14" title="Roadmaps demo" provider="loom" \/>/
  );
  assert.match(
    result.content,
    /<ResponsiveEmbed src="https:\/\/youtu\.be\/Ll1hArmqOAg" title="YouTube video" provider="youtube" \/>/
  );
  assert.doesNotMatch(result.content, /\{%/);
});

test('preserves generic GitBook embeds as external LinkRows', () => {
  const result = convertGitBookPage(
    `---
title: External embed
description: External embed fixture
---
{% embed url="https://support.atlassian.com/jira/docs/example/" %}

{% embed url="https://www.atlassian.com/software/jira/guides/" %}
  Atlassian
  support guide
{% endembed %}
`,
    fixtureContext('product/changelog/staging-area.md')
  );

  assert.match(
    result.content,
    /<LinkRow href="https:\/\/support\.atlassian\.com\/jira\/docs\/example\/" title="support\.atlassian\.com" \/>/
  );
  assert.match(
    result.content,
    /<LinkRow href="https:\/\/www\.atlassian\.com\/software\/jira\/guides\/" title="Atlassian support guide" \/>/
  );
  assert.deepEqual(result.warnings, [
    {
      file: 'product/changelog/staging-area.md',
      line: 5,
      construct: 'embed'
    },
    {
      file: 'product/changelog/staging-area.md',
      line: 7,
      construct: 'embed'
    }
  ]);
  assert.doesNotMatch(result.content, /\{%/);
});

test('converts figures without losing image semantics or copy operations', () => {
  const result = convertGitBookPage(
    pageFixture('figure.md'),
    fixtureContext('product/administration/design.md')
  );

  assert.match(
    result.content,
    /import Figure from '.+\/components\/content\/Figure\.astro';/
  );
  assert.match(result.content, /src="\/media\/hub\/Theme%20-%20Sydney\.png"/);
  assert.match(result.content, /alt="Sydney portal layout"/);
  assert.match(result.content, /caption="A portal layout with a horizontal roadmap\."/);
  assert.match(result.content, /width=\{563\}/);
  assert.deepEqual(result.assetCopies, [
    {
      sourcePath: '.gitbook/assets/Theme - Sydney.png',
      publicPath: 'public/media/hub/Theme - Sydney.png'
    }
  ]);
});

test('preserves both figure width and height dimensions', () => {
  const result = convertGitBookPage(
    `---
title: Figure dimensions
description: Figure dimension fixture
---
<figure><img src="../../.gitbook/assets/Theme - Sydney.png" alt="Sydney portal layout" width="563" height="316"><figcaption>Portal layout</figcaption></figure>
`,
    fixtureContext('product/administration/design.md')
  );

  assert.match(result.content, /width=\{563\}/);
  assert.match(result.content, /height=\{316\}/);
});

test('rewrites Markdown assets to Hub media and records explicit copies', () => {
  const source = `---
title: Asset
description: Asset fixture
---

![Notification badge](../../.gitbook/assets/Badge.png)
`;
  const result = convertGitBookPage(
    source,
    fixtureContext('product/integrations/webflow.md')
  );

  assert.match(
    result.content,
    /!\[Notification badge\]\(\/media\/hub\/Badge\.png\)/
  );
  assert.deepEqual(result.assetCopies, [
    {
      sourcePath: '.gitbook/assets/Badge.png',
      publicPath: 'public/media/hub/Badge.png'
    }
  ]);
});

test('rewrites standalone HTML images and records explicit copies', () => {
  const source = `---
title: Standalone image
description: Standalone image fixture
---
<img src="../../.gitbook/assets/Settings-Custom Domain.png" alt="" data-size="original">
`;
  const result = convertGitBookPage(
    source,
    fixtureContext('product/administration/custom-domain.md')
  );

  assert.match(
    result.content,
    /<img src="\/media\/hub\/Settings-Custom%20Domain\.png" alt="Settings Custom Domain" data-size="original" \/>/
  );
  assert.deepEqual(result.assetCopies, [
    {
      sourcePath: '.gitbook/assets/Settings-Custom Domain.png',
      publicPath: 'public/media/hub/Settings-Custom Domain.png'
    }
  ]);
});

test('rewrites local HTML anchor destinations for content and media', () => {
  const source = `---
title: HTML links
description: HTML link fixture
---
<table><tbody><tr><td><a href="getting-started/concepts.md">Concepts</a></td><td><a href=".gitbook/assets/Roadmap Cover Image (1).png">Cover</a></td></tr></tbody></table>
`;
  const result = convertGitBookPage(source, fixtureContext('README.md'));

  assert.match(
    result.content,
    /href="\/guide\/getting-started\/concepts\/"/
  );
  assert.match(
    result.content,
    /href="\/media\/hub\/Roadmap%20Cover%20Image%20\(1\)\.png"/
  );
  assert.deepEqual(result.assetCopies, [
    {
      sourcePath: '.gitbook/assets/Roadmap Cover Image (1).png',
      publicPath: 'public/media/hub/Roadmap Cover Image (1).png'
    }
  ]);
});

test('rewrites local content links to final guide routes without changing fragments', () => {
  const source = `---
title: Links
description: Link fixture
---

[Settings](settings/README.md#email%20delivery)

[Credentials](../administration/user-verification.md#credentials "mention")

[Inbox](../feedback/inbox.md "mention")

\`[Literal](settings/README.md#unchanged)\`

[External](https://released.so)
`;
  const result = convertGitBookPage(
    source,
    fixtureContext('product/changelog/writing-a-post.md')
  );

  assert.match(
    result.content,
    /\[Settings\]\(\/guide\/product\/changelog\/settings\/#email%20delivery\)/
  );
  assert.match(
    result.content,
    /\[Credentials\]\(\/guide\/product\/administration\/user-verification\/#credentials "mention"\)/
  );
  assert.match(
    result.content,
    /\[Inbox\]\(\/guide\/product\/feedback\/inbox\/ "mention"\)/
  );
  assert.match(
    result.content,
    /`\[Literal\]\(settings\/README\.md#unchanged\)`/
  );
  assert.match(result.content, /\[External\]\(https:\/\/released\.so\)/);
});

test('keeps GitBook details as semantic details and summary elements', () => {
  const result = convertGitBookPage(
    pageFixture('details.md'),
    fixtureContext('product/roadmaps-and-ideas/roadmap.md')
  );

  assert.match(result.content, /<details>\n\n<summary>/);
  assert.match(result.content, /<summary>Text field \(multi-line\)<\/summary>/);
  assert.match(result.content, /Images and tables have limited support/);
  assert.match(result.content, /<\/details>/);
});

test('retains table headers and cells', () => {
  const result = convertGitBookPage(
    pageFixture('table.md'),
    fixtureContext('resources/troubleshooting/ensuring-jira-permissions.md')
  );

  assert.match(result.content, /<th width="219">Permission<\/th>/);
  assert.match(result.content, /<th>Required for<\/th>/);
  assert.match(result.content, /<td><strong>Edit issues<\/strong><\/td>/);
  assert.match(result.content, /<td>Accessing and creating portal content\.<\/td>/);
});

test('normalizes legacy HTML blocks into MDX-compatible markup', () => {
  const source = `---
title: HTML normalization
description: HTML normalization fixture
---
<table><tbody>
<tr><td>First<br><br>Second</td></tr>
</tbody></table>

<pre class="language-html"><code><strong>Example:
</strong>
value
</code></pre>
`;
  const result = convertGitBookPage(
    source,
    fixtureContext('resources/troubleshooting/dark-mode-issues.md')
  );

  assert.match(result.content, /First<br \/><br \/>Second/);
  assert.match(result.content, /```html\nExample:\n\nvalue\n```/);
});

test('preserves trailing code bytes when converting legacy pre blocks', () => {
  const twoTrailingSpaces = '  ';
  const result = convertGitBookPage(
    `---
title: Code bytes
description: Code byte fixture
---
<pre class="language-html"><code class="lang-html">line one${twoTrailingSpaces}
line two

</code></pre>
`,
    fixtureContext('resources/code-bytes.md')
  );

  assert.match(result.content, /```html\nline one  \nline two\n\n```/);
});

test('preserves inline whitespace between table-cell elements', () => {
  const result = convertGitBookPage(
    `---
title: Table spacing
description: Table spacing fixture
---
<table><tbody><tr><td><strong>First</strong> <em>second</em></td></tr></tbody></table>
`,
    fixtureContext('resources/table-spacing.md')
  );

  assert.match(result.content, /<strong>First<\/strong> <em>second<\/em>/);
});

test('declares the MDX compiler and compiles representative converted output', async () => {
  const result = convertGitBookPage(
    `---
title: Representative MDX
description: Representative compile fixture
---
{% stepper %}
{% step %}
### Configure

<details>

<summary>More detail</summary>

{% hint style="info" %}
Nested component content.
{% endhint %}

</details>

<table><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody><tr><td><strong>First</strong> <em>second</em></td><td>Preserved</td></tr></tbody></table>

{% code overflow="wrap" %}
\`\`\`js
const marker = "{% literal %}";
\`\`\`
{% endcode %}
{% endstep %}
{% endstepper %}
`,
    fixtureContext('resources/representative.md')
  );

  const compiled = await compile(matter(result.content).content);
  assert.ok(String(compiled.value).includes('function MDXContent'));

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8')
  );
  assert.equal(packageJson.devDependencies['@mdx-js/mdx'], '3.1.1');
});

test('migration CLI is deterministic, checkable, and emits a brand review', (t) => {
  const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gitbook-migrate-'));
  t.after(() => fs.rmSync(sourceRoot, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(sourceRoot, 'SUMMARY.md'),
    '* [Overview](README.md)\n* [Extra](extra.md)\n'
  );
  fs.writeFileSync(
    path.join(sourceRoot, 'README.md'),
    `---
description: Fixture overview
---
# Overview

Released helps teams publish updates.
`
  );
  fs.writeFileSync(
    path.join(sourceRoot, 'extra.md'),
    '# Extra\n\nExtra fixture page.\n'
  );

  const run = (extraArguments = []) =>
    spawnSync(
      process.execPath,
      [
        path.join(repositoryRoot, 'scripts', 'migrate-gitbook.mjs'),
        '--source',
        '.',
        '--output',
        'src/content/docs/guide',
        ...extraArguments
      ],
      { cwd: sourceRoot, encoding: 'utf8' }
    );

  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const outputPath = path.join(
    sourceRoot,
    'src/content/docs/guide/index.mdx'
  );
  const firstOutput = fs.readFileSync(outputPath, 'utf8');
  assert.match(firstOutput, /space: hub/);
  assert.match(firstOutput, /Released helps teams/);

  const review = JSON.parse(
    fs.readFileSync(
      path.join(sourceRoot, 'reports/hub-brand-review.json'),
      'utf8'
    )
  );
  assert.deepEqual(review, [
    {
      sourceFile: 'README.md',
      line: 6,
      sentence: 'Released helps teams publish updates.',
      classification: 'review'
    }
  ]);

  const second = run();
  assert.equal(second.status, 0, second.stderr);
  assert.equal(fs.readFileSync(outputPath, 'utf8'), firstOutput);

  const check = run(['--check']);
  assert.equal(check.status, 0, check.stderr);

  fs.writeFileSync(
    path.join(sourceRoot, 'SUMMARY.md'),
    '* [Overview](README.md)\n'
  );
  fs.unlinkSync(path.join(sourceRoot, 'extra.md'));
  const orphanCheck = run(['--check']);
  assert.equal(orphanCheck.status, 1);
  assert.match(
    orphanCheck.stderr,
    /src\/content\/docs\/guide\/extra\.mdx:1 Unexpected generated GitBook output/
  );
});

test('migration check rejects orphaned Hub media inside a dot-directory', (t) => {
  const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gitbook-media-orphan-'));
  t.after(() => fs.rmSync(sourceRoot, { recursive: true, force: true }));
  fs.mkdirSync(
    path.join(sourceRoot, '.gitbook', 'assets', '.hidden'),
    { recursive: true }
  );
  fs.mkdirSync(path.join(sourceRoot, 'public'), { recursive: true });
  fs.writeFileSync(
    path.join(sourceRoot, 'SUMMARY.md'),
    '* [Overview](README.md)\n'
  );
  fs.writeFileSync(
    path.join(sourceRoot, '.gitbook', 'assets', '.hidden', 'orphan.png'),
    'generated media fixture'
  );
  fs.writeFileSync(
    path.join(sourceRoot, 'public', 'site-logo.svg'),
    '<svg></svg>\n'
  );
  fs.writeFileSync(
    path.join(sourceRoot, 'README.md'),
    '# Overview\n\n![Screenshot](.gitbook/assets/.hidden/orphan.png)\n'
  );

  const run = (extraArguments = []) =>
    spawnSync(
      process.execPath,
      [
        path.join(repositoryRoot, 'scripts', 'migrate-gitbook.mjs'),
        '--source',
        '.',
        '--output',
        'src/content/docs/guide',
        ...extraArguments
      ],
      { cwd: sourceRoot, encoding: 'utf8' }
    );

  const initialMigration = run();
  assert.equal(initialMigration.status, 0, initialMigration.stderr);
  const generatedAsset = path.join(
    sourceRoot,
    'public/media/hub/.hidden/orphan.png'
  );
  assert.equal(fs.readFileSync(generatedAsset, 'utf8'), 'generated media fixture');

  fs.writeFileSync(
    path.join(sourceRoot, 'README.md'),
    '# Overview\n\nThe screenshot is no longer used.\n'
  );
  const nonDestructiveMigration = run();
  assert.equal(nonDestructiveMigration.status, 0, nonDestructiveMigration.stderr);
  assert.equal(fs.existsSync(generatedAsset), true);

  const orphanCheck = run(['--check']);
  assert.equal(orphanCheck.status, 1);
  assert.match(
    orphanCheck.stderr,
    /public\/media\/hub\/\.hidden\/orphan\.png:1 Unexpected generated GitBook asset/
  );
  assert.doesNotMatch(orphanCheck.stderr, /public\/site-logo\.svg/);
});

test('migration CLI rejects duplicate output destinations before writing', (t) => {
  const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gitbook-duplicate-'));
  t.after(() => fs.rmSync(sourceRoot, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(sourceRoot, 'SUMMARY.md'),
    '* [Overview](README.md)\n* [Overview alias](./README.md)\n'
  );
  fs.writeFileSync(
    path.join(sourceRoot, 'README.md'),
    '# Overview\n\nDuplicate destination fixture.\n'
  );

  const result = spawnSync(
    process.execPath,
    [
      path.join(repositoryRoot, 'scripts', 'migrate-gitbook.mjs'),
      '--source',
      '.',
      '--output',
      'src/content/docs/guide'
    ],
    { cwd: sourceRoot, encoding: 'utf8' }
  );

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /\.\/README\.md:1 Duplicate migration destination "src\/content\/docs\/guide\/index\.mdx" already claimed by "README\.md"/
  );
  assert.equal(
    fs.existsSync(path.join(sourceRoot, 'src/content/docs/guide/index.mdx')),
    false
  );
});

test('content validation reports every failure as path:line', (t) => {
  const validationRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'content-validate-'));
  t.after(() => fs.rmSync(validationRoot, { recursive: true, force: true }));
  fs.mkdirSync(path.join(validationRoot, 'content', 'guide'), { recursive: true });
  fs.mkdirSync(path.join(validationRoot, 'public'), { recursive: true });
  fs.writeFileSync(
    path.join(validationRoot, 'content', 'guide', 'a.mdx'),
    `---
title: A
space: wrong
---

{% mystery %}
![Missing](/media/hub/missing.png)
[Broken](missing.mdx)
[Unsafe](../../../../outside.md)
![Existing](/media/hub/Has%20space.png)

\`\`\`liquid
{% ignored %}
\`\`\`
`
  );
  fs.writeFileSync(
    path.join(validationRoot, 'content', 'guide', 'a.md'),
    `---
title: Duplicate
description: Duplicate route
space: hub
---
`
  );
  fs.mkdirSync(path.join(validationRoot, 'public', 'media', 'hub'), {
    recursive: true
  });
  fs.writeFileSync(
    path.join(validationRoot, 'public', 'media', 'hub', 'Has space.png'),
    'fixture'
  );
  fs.writeFileSync(
    path.join(validationRoot, 'content', 'guide', 'b.md'),
    `---
description: Missing fields
---
`
  );
  fs.writeFileSync(
    path.join(validationRoot, 'content', 'guide', 'c.md'),
    `---
title: Fence
description: Fence validation fixture
space: hub
---
\`\`\`text
\`\`\`not-a-close
{% ignored-after-literal-fence %}
\`\`\`
`
  );

  const result = spawnSync(
    process.execPath,
    [
      path.join(repositoryRoot, 'scripts', 'validate-content.mjs'),
      '--content',
      'content',
      '--public',
      'public'
    ],
    { cwd: validationRoot, encoding: 'utf8' }
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /content\/guide\/a\.mdx:1 Missing required frontmatter "description"/);
  assert.match(result.stderr, /content\/guide\/a\.mdx:3 Unknown space "wrong"/);
  assert.match(result.stderr, /content\/guide\/a\.mdx:6 Remaining GitBook construct/);
  assert.match(result.stderr, /content\/guide\/a\.mdx:7 Missing local asset "\/media\/hub\/missing\.png"/);
  assert.match(result.stderr, /content\/guide\/a\.mdx:8 Relative content link cannot be resolved/);
  assert.match(result.stderr, /content\/guide\/a\.mdx:9 Unsafe traversal outside approved roots/);
  assert.match(result.stderr, /content\/guide\/a\.md:1 Duplicate route "\/guide\/a\/"/);
  assert.match(result.stderr, /content\/guide\/b\.md:1 Missing required frontmatter "title"/);
  assert.match(result.stderr, /content\/guide\/b\.md:1 Missing required frontmatter "space"/);
  assert.doesNotMatch(result.stderr, /ignored/);
  assert.doesNotMatch(result.stderr, /Has%20space/);
  assert.doesNotMatch(result.stderr, /content\/guide\/c\.md/);
});
