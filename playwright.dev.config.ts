import { defineConfig } from '@playwright/test';

const port = process.env.PLAYWRIGHT_DEV_PORT ?? '45679';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e-dev',
  use: {
    baseURL
  },
  webServer: {
    command: `npm run dev -- --ignore-lock --host 127.0.0.1 --port ${port}`,
    env: {
      ASTRO_DEV_BACKGROUND: '0'
    },
    url: `${baseURL}/guide/`,
    reuseExistingServer: false
  }
});
