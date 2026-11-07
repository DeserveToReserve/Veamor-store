import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static output -> deploys to Cloudflare Pages as-is.
// Stripe calls will later live in /functions (Pages Functions).
export default defineConfig({
  site: 'https://veamor.example', // TODO: real domain
  integrations: [react()],
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'never' },
  vite: {
    plugins: [tailwindcss()],
    // Never inline assets/scripts: keeps a strict CSP (no 'unsafe-inline') possible.
    build: { assetsInlineLimit: 0 },
  },
});
