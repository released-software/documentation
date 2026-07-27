import type { SpaceId } from '../data/spaces';

export type SearchScope = SpaceId | 'all';

export interface SearchControllerOptions {
  initialScope: SearchScope;
  pagefindBaseUrl?: string;
}

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  space: SpaceId;
}

interface PagefindResultData {
  url: string;
  raw_url?: string;
  excerpt?: string;
  plain_excerpt?: string;
  filters?: Record<string, string | string[]>;
  meta?: Record<string, string>;
}

interface PagefindResponse {
  results: Array<{ data(): Promise<PagefindResultData> }>;
}

interface PagefindApi {
  search(
    query: string,
    options?: { filters?: Record<string, SearchScope> }
  ): Promise<PagefindResponse>;
}

const knownSpaces = new Set<SpaceId>(['hub', 'betterboard', 'partners']);

function isSpaceId(value: string | undefined): value is SpaceId {
  return Boolean(value && knownSpaces.has(value as SpaceId));
}

function safeResultUrl(value: string): string {
  const url = new URL(value, window.location.origin);
  if (url.origin !== window.location.origin) return '/';
  return `${url.pathname}${url.search}${url.hash}`;
}

export class SearchController {
  private readonly dialog: HTMLDialogElement;
  private readonly trigger: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly input: HTMLInputElement;
  private readonly scopeSelect: HTMLSelectElement;
  private readonly scopeAnnouncement: HTMLElement;
  private readonly state: HTMLElement;
  private readonly results: HTMLElement;
  private readonly pagefindBaseUrl: string;
  private scope: SearchScope;
  private pagefind?: PagefindApi;
  private pagefindPromise?: Promise<PagefindApi>;
  private loadAttempt = 0;
  private requestId = 0;

  constructor(
    private readonly root: HTMLElement,
    options: SearchControllerOptions
  ) {
    this.dialog = this.required('dialog');
    this.trigger = this.required('[data-open-search]');
    this.closeButton = this.required('[data-close-search]');
    this.input = this.required('[data-search-input]');
    this.scopeSelect = this.required('[data-search-scope]');
    this.scopeAnnouncement = this.required('[data-search-scope-announcement]');
    this.state = this.required('[data-search-state]');
    this.results = this.required('[data-search-results]');
    this.pagefindBaseUrl = options.pagefindBaseUrl ?? '/pagefind/';
    this.scope = options.initialScope;

    this.scopeSelect.value = this.scope;
    this.bindEvents();
    this.trigger.disabled = false;
  }

  private required<T extends Element>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`Scoped search is missing ${selector}`);
    return element;
  }

  private bindEvents() {
    this.trigger.addEventListener('click', () => this.open());
    this.closeButton.addEventListener('click', () => this.close());
    this.dialog.addEventListener('close', () => {
      document.body.toggleAttribute('data-search-modal-open', false);
      this.scopeAnnouncement.textContent = '';
      this.trigger.focus();
    });
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.close();
    });
    this.input.addEventListener('input', () => void this.runSearch());
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const links = this.resultLinks();
        const target = event.key === 'ArrowDown' ? links[0] : links.at(-1);
        if (target) {
          event.preventDefault();
          target.focus();
        }
      }
    });
    this.results.addEventListener('keydown', (event) => this.moveResultFocus(event));
    this.scopeSelect.addEventListener('change', () => {
      this.scope = this.scopeSelect.value as SearchScope;
      this.announceScope();
      void this.runSearch();
    });
    this.state.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      if (target.matches('[data-search-all]')) {
        this.scope = 'all';
        this.scopeSelect.value = 'all';
        this.announceScope();
        void this.runSearch();
      } else if (target.matches('[data-retry-search]')) {
        this.pagefind = undefined;
        this.pagefindPromise = undefined;
        this.loadAttempt += 1;
        void this.runSearch();
      }
    });
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        this.dialog.open ? this.close() : this.open();
      }
    });
  }

  private open() {
    if (!this.dialog.open) this.dialog.showModal();
    document.body.toggleAttribute('data-search-modal-open', true);
    this.announceScope();
    this.input.focus();
    void this.runSearch();
  }

  private close() {
    if (this.dialog.open) this.dialog.close();
  }

  private announceScope() {
    this.scopeAnnouncement.textContent = `Search scope: ${this.scopeLabel()}`;
  }

  private scopeLabel() {
    return (
      this.scopeSelect.selectedOptions[0]?.textContent?.trim() ?? 'All documentation'
    );
  }

  private scopeIsSearchable() {
    return !this.scopeSelect.selectedOptions[0]?.disabled;
  }

  private async loadPagefind() {
    if (this.pagefind) return this.pagefind;
    if (!this.pagefindPromise) {
      const baseUrl = this.pagefindBaseUrl.endsWith('/')
        ? this.pagefindBaseUrl
        : `${this.pagefindBaseUrl}/`;
      const retryQuery = this.loadAttempt > 0 ? `?retry=${this.loadAttempt}` : '';
      const moduleUrl = `${baseUrl}pagefind.js${retryQuery}`;
      this.pagefindPromise = import(/* @vite-ignore */ moduleUrl).then(
        (module) => module as PagefindApi
      );
    }

    this.pagefind = await this.pagefindPromise;
    return this.pagefind;
  }

  private async runSearch() {
    const currentRequest = ++this.requestId;
    this.results.replaceChildren();

    if (!this.scopeIsSearchable()) {
      this.renderUnavailable();
      return;
    }

    this.renderLoading();

    let pagefind: PagefindApi;
    try {
      pagefind = await this.loadPagefind();
    } catch {
      if (currentRequest === this.requestId) this.renderFailure();
      return;
    }

    if (currentRequest !== this.requestId) return;

    const query = this.input.value.trim();
    if (!query) {
      this.renderSuggestions();
      return;
    }

    try {
      const filters = this.scope === 'all' ? undefined : { space: this.scope };
      const response = await pagefind.search(query, { filters });
      const results = (
        await Promise.all(response.results.map((result) => result.data()))
      )
        .map((result) => this.toSearchResult(result))
        .filter((result): result is SearchResult => result !== undefined);

      if (currentRequest !== this.requestId) return;
      if (results.length === 0) {
        this.renderNoResults();
        return;
      }

      this.renderResults(results);
    } catch {
      if (currentRequest === this.requestId) this.renderFailure();
    }
  }

  private toSearchResult(result: PagefindResultData): SearchResult | undefined {
    const space = result.meta?.space;
    if (!isSpaceId(space)) return undefined;

    return {
      url: safeResultUrl(result.raw_url ?? result.url),
      title: result.meta?.title ?? 'Untitled documentation',
      excerpt: result.plain_excerpt ?? result.excerpt ?? '',
      space
    };
  }

  private renderLoading() {
    this.setStateText('Loading search…');
  }

  private renderSuggestions() {
    this.state.replaceChildren();
    const heading = document.createElement('p');
    heading.textContent = `Suggested sections in ${this.scopeLabel()}`;
    const list = document.createElement('ul');

    const suggestions =
      this.scope === 'all'
        ? [
            { href: '/guide/', label: 'Hub documentation' },
            { href: '/betterboard/', label: 'BetterBoard documentation' }
          ]
        : [
            {
              href: this.scope === 'betterboard' ? '/betterboard/' : '/guide/',
              label: this.scopeLabel()
            }
          ];

    for (const suggestion of suggestions) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = suggestion.href;
      link.textContent = suggestion.label;
      item.append(link);
      list.append(item);
    }

    this.state.append(heading, list);
  }

  private renderUnavailable() {
    this.state.replaceChildren();
    const message = document.createElement('p');
    message.textContent = `${this.scopeLabel()} search is coming soon.`;
    const button = this.createButton('Search all documentation', 'data-search-all');
    this.state.append(message, button);
  }

  private renderNoResults() {
    this.state.replaceChildren();
    const message = document.createElement('p');
    message.textContent = `No results in ${this.scopeLabel()}.`;
    this.state.append(message);
    if (this.scope !== 'all') {
      this.state.append(
        this.createButton('Search all documentation', 'data-search-all')
      );
    }
  }

  private renderFailure() {
    this.state.replaceChildren();
    const message = document.createElement('p');
    message.append('Search could not be loaded. ');
    message.append(this.createButton('Retry', 'data-retry-search'));
    message.append('.');
    this.state.append(message);
  }

  private renderResults(results: SearchResult[]) {
    this.state.replaceChildren();
    this.results.replaceChildren();

    for (const result of results) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      const title = document.createElement('span');
      const excerpt = document.createElement('p');

      link.href = result.url;
      link.dataset.resultSpace = result.space;
      title.textContent = result.title;
      excerpt.textContent = result.excerpt;
      link.append(title, excerpt);
      item.append(link);
      this.results.append(item);
    }
  }

  private createButton(label: string, attribute: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute(attribute, '');
    return button;
  }

  private setStateText(message: string) {
    this.state.textContent = message;
  }

  private resultLinks() {
    return Array.from(this.results.querySelectorAll<HTMLAnchorElement>('a'));
  }

  private moveResultFocus(event: KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const links = this.resultLinks();
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + offset + links.length) % links.length;
    links[nextIndex]?.focus();
  }
}
