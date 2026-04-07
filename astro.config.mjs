// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://nexailabs.com',
	output: 'static',
	integrations: [sitemap()],
	prefetch: true,
});
