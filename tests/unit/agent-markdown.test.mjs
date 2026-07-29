import assert from 'node:assert/strict';
import test from 'node:test';

import { renderAgentMarkdown } from '../../src/markdown/agent-markdown.mjs';

test('known MDX components become portable agent-readable Markdown', async () => {
  const body = `
import Figure from '../components/Figure.astro';
import NeutralCallout from '../components/NeutralCallout.astro';
import LinkRow from '../components/LinkRow.astro';
import ResponsiveEmbed from '../components/ResponsiveEmbed.astro';
import OverviewSection from '../components/OverviewSection.astro';
import { Steps, Tabs, TabItem } from '@astrojs/starlight/components';

## Configure the board

<Figure src="/media/board.png" alt="Board view" caption="The configured board." width={375} />

<NeutralCallout type="caution" title="Check permissions">

You need Jira administrator access.

</NeutralCallout>

<LinkRow href="/guide/" title="Hub documentation" description="Return to the Hub overview." />

<ResponsiveEmbed src="https://www.loom.com/share/demo" title="Watch the demo" provider="loom" />

<Steps>

1. Open the board.
2. Choose **Settings**.

</Steps>

<Tabs>
  <TabItem label="Cloud">

Use the Cloud installation.

  </TabItem>
  <TabItem label="Data Center">

Use the Data Center installation.

  </TabItem>
</Tabs>

<OverviewSection
  title="Next steps"
  items={[
    {
      href: '/guide/product/',
      title: 'Product guide',
      description: 'Continue learning.',
    },
  ]}
/>

\`\`\`json
{"enabled": true}
\`\`\`
`;

  const markdown = await renderAgentMarkdown({ title: 'Quick start', body });

  assert.match(markdown, /^# Quick start\n/);
  assert.match(markdown, /^## Configure the board$/m);
  assert.match(markdown, /!\[Board view\]\(\/media\/board\.png\)/);
  assert.match(markdown, /\*The configured board\.\*/);
  assert.match(markdown, /> \*\*Check permissions\*\*/);
  assert.match(markdown, /> You need Jira administrator access\./);
  assert.match(
    markdown,
    /\[Hub documentation\]\(\/guide\/\) — Return to the Hub overview\./
  );
  assert.match(markdown, /\[Watch the demo\]\(https:\/\/www\.loom\.com\/share\/demo\)/);
  assert.match(markdown, /1\. Open the board\.\n2\. Choose \*\*Settings\*\*\./);
  assert.match(markdown, /^### Cloud$/m);
  assert.match(markdown, /^### Data Center$/m);
  assert.match(markdown, /^## Next steps$/m);
  assert.match(
    markdown,
    /- \[Product guide\]\(\/guide\/product\/\) — Continue learning\./
  );
  assert.match(markdown, /```json\n\{"enabled": true\}\n```/);
  assert.doesNotMatch(markdown, /^import /m);
  assert.doesNotMatch(
    markdown,
    /<(?:Figure|NeutralCallout|LinkRow|ResponsiveEmbed|Steps|Tabs|TabItem|OverviewSection)\b/
  );
});

test('unknown content wrappers keep readable children without leaking component syntax', async () => {
  const markdown = await renderAgentMarkdown({
    title: 'Wrapped content',
    body: `
<FutureLayout>

Readable **content** remains available.

</FutureLayout>

<DecorativeGlyph name="sparkle" />
`
  });

  assert.match(markdown, /Readable \*\*content\*\* remains available\./);
  assert.doesNotMatch(markdown, /FutureLayout|DecorativeGlyph/);
});
