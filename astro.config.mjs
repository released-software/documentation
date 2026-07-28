import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

const contentComponentHarness = {
  name: 'released-content-component-harness',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({
        pattern: '/__tests__/content-components',
        entrypoint: './src/pages/__tests__/content-components.astro',
        prerender: true
      });
    }
  }
};

export default defineConfig({
  site: 'https://docs.released.so',
  trailingSlash: 'always',
  integrations: [
    contentComponentHarness,
    starlight({
      title: 'Released documentation',
      favicon: '/brand/released-favicon.svg',
      customCss: ['./src/styles/tokens.css', './src/styles/starlight.css'],
      routeMiddleware: './src/route-data.ts',
      components: {
        MarkdownContent: './src/components/starlight/MarkdownContent.astro',
        Search: './src/components/starlight/Search.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro'
      },
      social: [{ icon: 'external', label: 'Released', href: 'https://released.so' }],
      sidebar: [
        { label: 'Hub documentation', items: [{ autogenerate: { directory: 'guide' } }] },
        { label: 'BetterBoard documentation', items: [{ autogenerate: { directory: 'betterboard' } }] },
        { label: 'Partner documentation', items: [{ autogenerate: { directory: 'partners' } }] }
      ]
    }),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return ![
          '/__tests__/content-components/',
          '/component-tests/generated-content-components/'
        ].includes(pathname);
      }
    })
  ]
});
