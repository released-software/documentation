import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.released.so',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Released documentation',
      customCss: ['./src/styles/tokens.css', './src/styles/starlight.css'],
      routeMiddleware: './src/route-data.ts',
      social: [{ icon: 'external', label: 'Released', href: 'https://released.so' }],
      sidebar: [
        { label: 'Hub documentation', items: [{ autogenerate: { directory: 'guide' } }] },
        { label: 'BetterBoard documentation', items: [{ autogenerate: { directory: 'betterboard' } }] },
        { label: 'Partner documentation', items: [{ autogenerate: { directory: 'partners' } }] }
      ]
    })
  ]
});
