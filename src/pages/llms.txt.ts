import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { isAgentDocument, renderLlmsTxt } from '../data/agent-docs.mjs';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const entries = (await getCollection('docs')).filter(isAgentDocument);
  const body = renderLlmsTxt(entries, site ?? new URL('https://docs.released.so'));

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
