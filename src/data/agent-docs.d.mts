export interface AgentDocumentEntry {
  id: string;
  data: {
    title: string;
    description?: string;
    space?: 'hub' | 'betterboard' | 'partners';
    draft?: boolean;
  };
}

export function htmlPathForEntryId(id: string): string;
export function markdownPathForEntryId(id: string): string;
export function isAgentDocument(
  entry: Pick<AgentDocumentEntry, 'id' | 'data'>
): boolean;
export function renderLlmsTxt(
  entries: AgentDocumentEntry[],
  site: URL | string
): string;
