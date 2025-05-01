// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough'
  }),

  devToolbar: {
    enabled: false
  },

  prefetch: {
    defaultStrategy: 'viewport'
  },
 

  output: 'server',

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
  },

  integrations: [react()]
});