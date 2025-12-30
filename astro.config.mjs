import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import preact from '@astrojs/preact';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ['**/keystatic/**', '**/react/*']
    }),
    markdoc(),
    preact({
      include: ['**/preact/*']
    }),
    keystatic()
  ],
  output: 'server',
  adapter: netlify(),
  image: {
    domains: []
  }
});
