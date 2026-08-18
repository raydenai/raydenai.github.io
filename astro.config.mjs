// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * AURA — Astro Authority System
 * Site URL is read from PUBLIC_SITE_URL so one codebase can deploy to many
 * client domains without editing config.
 */
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://example.com',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    /* Required only for trusted temporary preview hosts. Production delivery
       is static GitHub Pages output and does not use the Vite preview server. */
    preview: {
      allowedHosts: ['.manus.computer'],
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
