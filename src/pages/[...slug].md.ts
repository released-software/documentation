import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

import {
  isAgentDocument,
  markdownPathForEntryId
} from '../data/agent-docs.mjs';
import { renderAgentMarkdown } from '../markdown/agent-markdown.mjs';

interface Props {
  markdown: string;
}

export const prerender = true;

export const getStaticPaths = (async () => {
  const entries = (await getCollection('docs')).filter(isAgentDocument);

  return Promise.all(
    entries.map(async (entry) => {
      const markdownPath = markdownPathForEntryId(entry.id);
      return {
        params: {
          slug: markdownPath.slice(1, -'.md'.length)
        },
        props: {
          markdown: await renderAgentMarkdown({
            title: entry.data.title,
            body: entry.body ?? ''
          })
        } satisfies Props
      };
    })
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = ({ props }) =>
  new Response(props.markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
