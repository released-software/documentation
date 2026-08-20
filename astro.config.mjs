import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

import { legacyRedirects } from './src/data/legacy-redirects.mjs';
import remarkBeautifulMermaid from './src/markdown/remark-beautiful-mermaid.mjs';

const astroRedirects = Object.fromEntries(
  legacyRedirects.map(({ source, destination }) => [source, destination])
);
const legacyRedirectPaths = new Set(
  legacyRedirects.map(({ source }) => `${source}/`)
);

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
  redirects: astroRedirects,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkBeautifulMermaid]
    })
  },
  integrations: [
    contentComponentHarness,
    starlight({
      title: 'Hub documentation',
      favicon: '/brand/released-favicon.svg',
      head: [
        {
          tag: 'script',
          content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NLBNBC8');`
        }
      ],
      customCss: ['./src/styles/tokens.css', './src/styles/starlight.css'],
      routeMiddleware: './src/route-data.ts',
      components: {
        MarkdownContent: './src/components/starlight/MarkdownContent.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        Search: './src/components/starlight/Search.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        SkipLink: './src/components/starlight/SkipLink.astro',
        SocialIcons: './src/components/starlight/SocialLinks.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro'
      },
      sidebar: [
        { label: 'Hub documentation', items: [{ autogenerate: { directory: 'guide' } }] },
        { label: 'BetterBoard documentation', items: [{ autogenerate: { directory: 'betterboard' } }] }
      ]
    }),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !legacyRedirectPaths.has(pathname) && ![
          '/__tests__/content-components/',
          '/component-tests/generated-content-components/'
        ].includes(pathname);
      }
    })
  ]
});
